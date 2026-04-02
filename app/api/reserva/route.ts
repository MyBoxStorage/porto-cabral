import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { ReservationConfirmation } from '@/emails/ReservationConfirmation'
import { sendBcEvent } from '@/lib/bcconnect'
import { getDb } from '@/lib/db'
import { reservations } from '@/lib/db/schema'
import { getClientIp, rateLimitReservation } from '@/lib/ratelimit'
import { getResend, resendFromEmail } from '@/lib/resend'

export const dynamic = 'force-dynamic'

const ReservationSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  whatsapp: z.string().min(10).max(15),
  // Regex + refinement: garante data válida e não no passado distante (max 1 ano à frente)
  reservation_date: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data inválida')
    .refine((v) => {
      const d = new Date(v)
      if (isNaN(d.getTime())) return false
      const now = new Date()
      const maxFuture = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate())
      const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      return d >= yesterday && d <= maxFuture
    }, 'Data fora do intervalo permitido'),
  // Hora: HH entre 00-23, MM entre 00-59
  reservation_time: z.string()
    .regex(/^\d{2}:\d{2}$/, 'Hora inválida')
    .refine((v) => {
      const [h, m] = v.split(':').map(Number)
      return h >= 0 && h <= 23 && m >= 0 && m <= 59
    }, 'Hora fora do intervalo permitido'),
  party_size: z.number().int().min(1).max(50),
  occasion_type: z.string().max(100).optional(),
  observations: z.string().max(500).optional(),
  allergies: z.string().max(300).optional(),
  optin_accepted: z.boolean(),
  locale: z.enum(['pt', 'en', 'es']).default('pt'),
})

export async function POST(req: Request) {
  // IP resistente a spoofing: x-real-ip (injetado pela Vercel) tem prioridade.
  // x-forwarded-for usa o último valor da lista (não o primeiro, manipulável pelo cliente).
  const ip = getClientIp(req.headers)

  const rl = await rateLimitReservation(ip)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Limite de reservas excedido para este IP.' },
      { status: 429 },
    )
  }

  const json = await req.json().catch(() => null)
  const parsed = ReservationSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const body = parsed.data
  let reservationId: string

  try {
    const db = getDb()
    const [row] = await db
      .insert(reservations)
      .values({
        name: body.name,
        email: body.email.toLowerCase(),
        whatsapp: body.whatsapp,
        reservation_date: body.reservation_date,
        reservation_time: body.reservation_time,
        party_size: body.party_size,
        occasion_type: body.occasion_type,
        observations: body.observations,
        allergies: body.allergies,
        optin_accepted: body.optin_accepted,
      })
      .returning({ id: reservations.id })
    reservationId = row.id
  } catch (e) {
    console.error('[reserva] db insert', e)
    return NextResponse.json(
      { error: 'Não foi possível salvar a reserva.' },
      { status: 500 },
    )
  }

  const resend = getResend()
  if (resend) {
    try {
      const subjects = {
        pt: 'Reserva recebida — Porto Cabral BC',
        en: 'Reservation received — Porto Cabral BC',
        es: 'Reserva recibida — Porto Cabral BC',
      } as const
      await resend.emails.send({
        from: resendFromEmail,
        to: body.email,
        subject: subjects[body.locale],
        react: ReservationConfirmation({
          name: body.name,
          reservationDate: body.reservation_date,
          reservationTime: body.reservation_time,
          partySize: body.party_size,
          locale: body.locale,
        }),
      })
      try {
        const db = getDb()
        await db
          .update(reservations)
          .set({
            confirmation_email_sent: true,
            confirmation_email_sent_at: new Date(),
          })
          .where(eq(reservations.id, reservationId))
      } catch {
        // ignore
      }
    } catch (err) {
      console.warn('[Resend] Falha ao enviar confirmação:', err)
    }
  }

  void (async () => {
    await sendBcEvent({
      eventType: 'RESERVATION',
      occurredAt: new Date().toISOString(),
      lead: {
        email: body.email.toLowerCase(),
        name: body.name,
        phone: body.whatsapp.replace(/\D/g, ''),
      },
      optinAccepted: body.optin_accepted,
      metadata: {
        groupSize: body.party_size,
        // Ticket estimado calculado server-side com cap fixo — não usa o party_size
        // diretamente como multiplicador irrestrito para evitar inflação de métricas no CRM.
        estimatedTicket: Math.min(body.party_size, 20) * 175,
        occasionType: body.occasion_type ?? 'reserva_restaurante',
      },
    })
    try {
      const db = getDb()
      await db
        .update(reservations)
        .set({
          bc_connect_sent: true,
          bc_connect_sent_at: new Date(),
        })
        .where(eq(reservations.id, reservationId))
    } catch {
      // ignore
    }
  })()

  return NextResponse.json({ success: true, reservationId })
}

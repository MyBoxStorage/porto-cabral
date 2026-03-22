import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { ReservationConfirmation } from '@/emails/ReservationConfirmation'
import { sendBcEvent } from '@/lib/bcconnect'
import { getDb } from '@/lib/db'
import { reservations } from '@/lib/db/schema'
import { rateLimitReservation } from '@/lib/ratelimit'
import { getResend, resendFromEmail } from '@/lib/resend'

export const dynamic = 'force-dynamic'

const ReservationSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  whatsapp: z.string().min(10).max(15),
  reservation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reservation_time: z.string().regex(/^\d{2}:\d{2}$/),
  party_size: z.number().int().min(1).max(50),
  occasion_type: z.string().optional(),
  observations: z.string().max(500).optional(),
  allergies: z.string().max(300).optional(),
  optin_accepted: z.boolean(),
  locale: z.enum(['pt', 'en', 'es']).default('pt'),
})

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'anonymous'

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
    console.error('[reserva]', e)
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
        estimatedTicket: body.party_size * 175,
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

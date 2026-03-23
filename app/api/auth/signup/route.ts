import { NextResponse } from 'next/server'
import { z } from 'zod'

import { WelcomeEmail } from '@/emails/WelcomeEmail'
import { sendBcEvent } from '@/lib/bcconnect'
import { getDb } from '@/lib/db'
import { customers } from '@/lib/db/schema'
import { rateLimitSignup } from '@/lib/ratelimit'
import { getResend, resendFromEmail } from '@/lib/resend'
import { createSupabaseAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const SignupSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).max(72),
  whatsapp: z.string().min(10).max(20),
  optin_accepted: z.boolean(),
  optin_parceiros: z.boolean().default(false),
})

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'anonymous'

  const rl = await rateLimitSignup(ip)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Muitas tentativas de cadastro. Tente mais tarde.' },
      { status: 429 },
    )
  }

  const json = await req.json().catch(() => null)
  const parsed = SignupSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { name, email, password, whatsapp, optin_accepted, optin_parceiros } = parsed.data
  const emailLower = email.toLowerCase()

  let authUserId: string
  try {
    const admin = createSupabaseAdminClient()
    const { data, error } = await admin.auth.admin.createUser({
      email: emailLower,
      password,
      email_confirm: true,
      user_metadata: { name, full_name: name },
    })
    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message ?? 'Não foi possível criar o usuário.' },
        { status: 400 },
      )
    }
    authUserId = data.user.id
  } catch (e) {
    console.error('[signup] supabase', e)
    return NextResponse.json({ error: 'Falha ao criar conta.' }, { status: 500 })
  }

  const now = new Date()
  try {
    const db = getDb()
    await db.insert(customers).values({
      auth_user_id: authUserId,
      name,
      email: emailLower,
      whatsapp,
      optin_accepted,
      optin_accepted_at: optin_accepted ? now : undefined,
      optin_parceiros,
      optin_parceiros_at: optin_parceiros ? now : undefined,
    })
  } catch (e) {
    console.error('[signup] db', e)
    return NextResponse.json(
      { error: 'Usuário criado, mas perfil não pôde ser salvo.' },
      { status: 500 },
    )
  }

  void sendBcEvent({
    eventType: 'SIGNUP',
    occurredAt: new Date().toISOString(),
    lead: {
      email: emailLower,
      name,
      phone: whatsapp.replace(/\D/g, ''),
    },
    optinAccepted: optin_accepted,
  })

  const resend = getResend()
  if (resend) {
    try {
      await resend.emails.send({
        from: resendFromEmail,
        to: emailLower,
        subject: 'Bem-vindo ao Porto Cabral BC',
        react: WelcomeEmail({ name }),
      })
    } catch (err) {
      console.warn('[Resend] Boas-vindas:', err)
    }
  }

  return NextResponse.json({ success: true })
}

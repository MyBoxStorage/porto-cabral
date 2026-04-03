import { eq } from 'drizzle-orm'
import type { Session } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { sendBcEvent } from '@/lib/bcconnect'
import { getDb } from '@/lib/db'
import { customerPreferences, customers } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

const QuizSchema = z.object({
  occasion_type: z.string().optional(),
  visit_frequency: z.string().min(1),
  food_preferences: z.array(z.string()).default([]),
  drink_preferences: z.array(z.string()).default([]),
  group_size: z.string().min(1),
  how_found: z.string().optional(),
})

async function resolveCustomerId(session: Session) {
  if (session.user.customer_id) return session.user.customer_id
  const db = getDb()
  const row = await db
    .select({ id: customers.id })
    .from(customers)
    .where(eq(customers.auth_user_id, session.user.id))
    .limit(1)
  return row[0]?.id ?? null
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const json = await req.json().catch(() => null)
  const parsed = QuizSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const customerId = await resolveCustomerId(session)
  if (!customerId) {
    return NextResponse.json(
      { error: 'Perfil de cliente não encontrado. Complete o cadastro.' },
      { status: 403 },
    )
  }

  const now = new Date()
  try {
    const db = getDb()
    await db
      .insert(customerPreferences)
      .values({
        customer_id: customerId,
        occasion_type: data.occasion_type,
        visit_frequency: data.visit_frequency,
        food_preferences: data.food_preferences,
        drink_preferences: data.drink_preferences,
        group_size: data.group_size,
        how_found: data.how_found,
        quiz_completed_at: now,
        updated_at: now,
      })
      .onConflictDoUpdate({
        target: customerPreferences.customer_id,
        set: {
          occasion_type: data.occasion_type,
          visit_frequency: data.visit_frequency,
          food_preferences: data.food_preferences,
          drink_preferences: data.drink_preferences,
          group_size: data.group_size,
          how_found: data.how_found,
          quiz_completed_at: now,
          updated_at: now,
        },
      })
  } catch (e) {
    console.error('[quiz]', e)
    return NextResponse.json({ error: 'Não foi possível salvar o quiz.' }, { status: 500 })
  }

  void sendBcEvent({
    eventType: 'PREFERENCE_UPDATE',
    occurredAt: new Date().toISOString(),
    lead: { email: session.user.email.toLowerCase() },
    metadata: {
      preferences: [
        ...(data.occasion_type ? [{ category: 'OCCASION', value: data.occasion_type }] : []),
        { category: 'FOOD', value: data.food_preferences.join(',') },
        { category: 'DRINK', value: data.drink_preferences.join(',') },
        { category: 'GROUP_SIZE', value: data.group_size },
      ],
    },
  })

  return NextResponse.json({ success: true })
}

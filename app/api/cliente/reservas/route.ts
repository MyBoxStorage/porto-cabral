import { desc, eq, or } from 'drizzle-orm'
import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { getDb } from '@/lib/db'
import { customers, reservations } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const email = session.user.email.toLowerCase()

  try {
    const db = getDb()
    let customerId = session.user.customer_id
    if (!customerId) {
      const row = await db
        .select({ id: customers.id })
        .from(customers)
        .where(eq(customers.auth_user_id, session.user.id))
        .limit(1)
      customerId = row[0]?.id
    }

    const rows = await db
      .select()
      .from(reservations)
      .where(
        customerId
          ? or(eq(reservations.customer_id, customerId), eq(reservations.email, email))
          : eq(reservations.email, email),
      )
      .orderBy(desc(reservations.reservation_date), desc(reservations.reservation_time))

    return NextResponse.json({ reservations: rows })
  } catch (e) {
    console.error('[cliente/reservas]', e)
    return NextResponse.json({ error: 'Erro ao listar reservas.' }, { status: 500 })
  }
}

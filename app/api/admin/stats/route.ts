import { requireAdmin } from '@/lib/adminAuth'
import { getDb } from '@/lib/db'
import { reservations, customers } from '@/lib/db/schema'
import { eq, count, sql } from 'drizzle-orm'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET() {
  const authError = await requireAdmin()
  if (authError) return authError
  try {
    const db = getDb()
    const today = new Date().toISOString().split('T')[0]
    const [totalRes] = await db.select({ c: count() }).from(reservations)
    const [todayRes] = await db.select({ c: count() }).from(reservations).where(eq(reservations.reservation_date, today))
    const [pendingRes] = await db.select({ c: count() }).from(reservations).where(eq(reservations.status, 'pending'))
    const [confirmedRes] = await db.select({ c: count() }).from(reservations).where(eq(reservations.status, 'confirmed'))
    const [totalClients] = await db.select({ c: count() }).from(customers)
    const [optinClients] = await db.select({ c: count() }).from(customers).where(eq(customers.optin_accepted, true))

    const byStatus = await db.select({
      status: reservations.status,
      total: count()
    }).from(reservations).groupBy(reservations.status)

    const recentReservations = await db.select().from(reservations)
      .orderBy(sql`created_at desc`).limit(5)

    return NextResponse.json({
      total_reservations: totalRes.c,
      today_reservations: todayRes.c,
      pending_reservations: pendingRes.c,
      confirmed_reservations: confirmedRes.c,
      total_customers: totalClients.c,
      optin_customers: optinClients.c,
      by_status: byStatus,
      recent_reservations: recentReservations,
    })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
}

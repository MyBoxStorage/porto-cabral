import { getDb } from '@/lib/db'
import { reservations } from '@/lib/db/schema'
import { eq, desc, like, and, gte, lte } from 'drizzle-orm'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const date = searchParams.get('date')
  const dateFrom = searchParams.get('dateFrom')
  const dateTo = searchParams.get('dateTo')
  try {
    const db = getDb()
    const conds: ReturnType<typeof eq>[] = []
    if (status && status !== 'all') conds.push(eq(reservations.status, status))
    if (date) conds.push(eq(reservations.reservation_date, date))
    if (dateFrom) conds.push(gte(reservations.reservation_date, dateFrom))
    if (dateTo) conds.push(lte(reservations.reservation_date, dateTo))
    if (search) conds.push(like(reservations.name, `%${search}%`))
    const rows = await db.select().from(reservations)
      .where(conds.length ? and(...conds) : undefined)
      .orderBy(desc(reservations.reservation_date), desc(reservations.created_at))
      .limit(300)
    return NextResponse.json({ reservations: rows })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erro' }, { status: 500 }) }
}

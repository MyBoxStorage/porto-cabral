import { getDb } from '@/lib/db'
import { customers } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = getDb()
    const rows = await db.select().from(customers).orderBy(desc(customers.created_at)).limit(500)
    return NextResponse.json({ customers: rows })
  } catch { return NextResponse.json({ error: 'Erro' }, { status: 500 }) }
}

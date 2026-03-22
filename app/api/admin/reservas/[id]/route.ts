import { getDb } from '@/lib/db'
import { reservations } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  const allowed = ['pending', 'confirmed', 'cancelled', 'no_show', 'completed']
  if (!allowed.includes(body.status)) return NextResponse.json({ error: 'Status inválido' }, { status: 400 })
  try {
    const db = getDb()
    await db.update(reservations).set({ status: body.status }).where(eq(reservations.id, id))
    return NextResponse.json({ success: true })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erro' }, { status: 500 }) }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const db = getDb()
    await db.delete(reservations).where(eq(reservations.id, id))
    return NextResponse.json({ success: true })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erro' }, { status: 500 }) }
}

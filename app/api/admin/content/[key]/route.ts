import { getDb } from '@/lib/db'
import { siteContent } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
export const dynamic = 'force-dynamic'

export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { key } = await params
  try {
    const db = getDb()
    const [row] = await db.select().from(siteContent).where(eq(siteContent.key, key))
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const value = typeof row.value === 'string' ? JSON.parse(row.value) : row.value
    return NextResponse.json({ key: row.key, value, updated_at: row.updated_at })
  } catch (e) {
    console.error('[content GET]', e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ key: string }> }) {
  const authError = await requireAdmin()
  if (authError) return authError
  const { key } = await params
  const body = await req.json().catch(() => null)
  if (!body?.value) return NextResponse.json({ error: 'value obrigatorio' }, { status: 400 })
  try {
    const db = getDb()
    await db
      .insert(siteContent)
      .values({ key, value: body.value, updated_by: 'admin' })
      .onConflictDoUpdate({
        target: siteContent.key,
        set: { value: body.value, updated_at: new Date(), updated_by: 'admin' },
      })
    return NextResponse.json({ success: true })
  } catch (e) { console.error(e); return NextResponse.json({ error: 'Erro ao salvar' }, { status: 500 }) }
}
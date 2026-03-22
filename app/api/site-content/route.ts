// GET /api/site-content?key=hero  — lido pelo site (público, cached)
import { getDb } from '@/lib/db'
import { siteContent } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')
  try {
    const db = getDb()
    if (key) {
      const [row] = await db.select().from(siteContent).where(eq(siteContent.key, key))
      if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json({ key: row.key, value: row.value, updated_at: row.updated_at })
    }
    const rows = await db.select().from(siteContent)
    return NextResponse.json({ content: rows })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
}

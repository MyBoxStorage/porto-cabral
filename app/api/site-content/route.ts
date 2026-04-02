// GET /api/site-content?key=hero  — lido pelo site (público, cached)
// SEGURANÇA: o parâmetro `key` é OBRIGATÓRIO. Listagem completa da tabela
// sem autenticação foi removida — exporia todo o JSONB de site_content publicamente.
import { getDb } from '@/lib/db'
import { siteContent } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')

  // Chave obrigatória — impede varredura/dump completo da tabela
  if (!key || key.trim() === '') {
    return NextResponse.json(
      { error: 'Parâmetro key obrigatório.' },
      { status: 400 },
    )
  }

  try {
    const db = getDb()
    const [row] = await db
      .select()
      .from(siteContent)
      .where(eq(siteContent.key, key))

    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Garante que value é sempre objeto (Drizzle pode retornar jsonb como string)
    const value =
      typeof row.value === 'string' ? JSON.parse(row.value) : row.value

    return NextResponse.json(
      { key: row.key, value, updated_at: row.updated_at },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      },
    )
  } catch (e) {
    // Não vazar mensagem de erro do banco para o cliente
    console.error('[site-content]', e)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

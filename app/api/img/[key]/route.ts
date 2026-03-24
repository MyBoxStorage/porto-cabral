// GET /api/img/[key] — serve imagem armazenada no banco
import { getDb } from '@/lib/db'
import { siteContent } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
export const dynamic = 'force-static'
export const revalidate = 86400 // 24h

export async function GET(_req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params
  try {
    const db = getDb()
    const [row] = await db.select().from(siteContent).where(eq(siteContent.key, key))
    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const val = row.value as { dataUri?: string }
    if (!val?.dataUri) return NextResponse.json({ error: 'Sem imagem' }, { status: 404 })

    // Extrai mime type e base64
    const match = val.dataUri.match(/^data:([^;]+);base64,(.+)$/)
    if (!match) return NextResponse.json({ error: 'Formato inválido' }, { status: 400 })

    const [, mimeType, base64] = match
    const buffer = Buffer.from(base64, 'base64')

    return new Response(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': String(buffer.length),
      },
    })
  } catch (e) {
    console.error('[img]', e)
    return NextResponse.json({ error: 'Erro' }, { status: 500 })
  }
}

// GET /api/img/[key] — serve imagem armazenada no banco
import { getDb } from '@/lib/db'
import { siteContent } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = 86400 // 24 h

// Tipos permitidos na saída — mesmo allowlist do upload.
// Garante que mesmo dados legados gravados como SVG não sejam servidos.
const SAFE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string }> },
) {
  const { key } = await params

  // Rejeita qualquer chave que não comece com o prefixo de imagem,
  // impedindo IDOR em chaves de configuração e enumeração por diferença de resposta.
  if (!key.startsWith('img_')) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  try {
    const db = getDb()
    const [row] = await db
      .select()
      .from(siteContent)
      .where(eq(siteContent.key, key))

    if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const val = row.value as { dataUri?: string }
    if (!val?.dataUri) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Extrai mime type e base64 da data URI
    const match = val.dataUri.match(/^data:([^;]+);base64,(.+)$/)
    if (!match) return NextResponse.json({ error: 'Formato inválido' }, { status: 400 })

    const [, mimeType, base64] = match

    // Segunda camada de defesa: bloquear tipos não seguros mesmo que
    // tenham chegado ao banco por outra via (dados legados, import direto, etc.)
    if (!SAFE_MIME_TYPES.includes(mimeType.toLowerCase())) {
      return NextResponse.json({ error: 'Tipo de mídia não permitido' }, { status: 415 })
    }

    const buffer = Buffer.from(base64, 'base64')

    return new Response(buffer, {
      headers: {
        'Content-Type':           mimeType,
        'Cache-Control':          'public, max-age=31536000, immutable',
        'Content-Length':         String(buffer.length),
        // Impede que o browser re-interprete o Content-Type — defesa contra sniffing
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (e) {
    console.error('[img]', e)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

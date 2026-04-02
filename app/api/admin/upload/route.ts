import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { siteContent } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

const MAX_SIZE = 2 * 1024 * 1024 // 2 MB

// SVG e HTML são explicitamente excluídos: SVG pode carregar JS e causar XSS
// quando servido com Content-Type: image/svg+xml diretamente pelo browser.
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
] as const
type AllowedMime = (typeof ALLOWED_MIME_TYPES)[number]

function isAllowedMime(mime: string): mime is AllowedMime {
  return (ALLOWED_MIME_TYPES as readonly string[]).includes(mime)
}

export async function POST(req: Request) {
  const authError = await requireAdmin()
  if (authError) return authError

  const body = await req.json().catch(() => null)
  if (!body?.data || !body?.filename) {
    return NextResponse.json(
      { error: 'data e filename obrigatorios' },
      { status: 400 },
    )
  }

  const dataUri: string = body.data

  // Extrai MIME type da data URI antes de qualquer outra validação
  const mimeMatch = dataUri.match(/^data:([^;]+);base64,/)
  if (!mimeMatch) {
    return NextResponse.json(
      { error: 'Formato inválido. Envie uma imagem em base64.' },
      { status: 400 },
    )
  }

  const mimeType = mimeMatch[1].toLowerCase()

  // Allowlist estrita — bloqueia SVG, HTML, texto, etc.
  if (!isAllowedMime(mimeType)) {
    return NextResponse.json(
      { error: `Tipo de imagem não permitido: ${mimeType}. Use JPEG, PNG, GIF ou WebP.` },
      { status: 400 },
    )
  }

  const base64 = dataUri.split(',')[1] ?? ''
  const sizeBytes = Math.ceil(base64.length * 0.75)
  if (sizeBytes > MAX_SIZE) {
    return NextResponse.json(
      { error: 'Imagem muito grande. Máximo 2 MB.' },
      { status: 400 },
    )
  }

  try {
    const db  = getDb()
    // Usa crypto.randomUUID() para alta entropia — elimina previsibilidade de timestamp
    const key = `img_${crypto.randomUUID()}`

    await db
      .insert(siteContent)
      .values({
        key,
        value: { dataUri, filename: body.filename, size: sizeBytes, mimeType },
        updated_by: 'admin',
      })
      .onConflictDoUpdate({
        target: siteContent.key,
        set: {
          value:      { dataUri, filename: body.filename, size: sizeBytes, mimeType },
          updated_at: new Date(),
        },
      })

    const url = `/api/img/${key}`
    return NextResponse.json({ url, key })
  } catch (e: unknown) {
    console.error('[upload]', e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'Erro interno ao salvar imagem.' }, { status: 500 })
  }
}

// POST /api/admin/upload
// Recebe imagem, redimensiona e salva no banco (site_content key='img_<uuid>')
// Retorna a URL /api/img/<key> para uso no site
import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { siteContent } from '@/lib/db/schema'
export const dynamic = 'force-dynamic'

// Limite: 2MB após base64
const MAX_SIZE = 2 * 1024 * 1024

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body?.data || !body?.filename) {
    return NextResponse.json({ error: 'data e filename obrigatórios' }, { status: 400 })
  }

  const dataUri: string = body.data
  if (!dataUri.startsWith('data:image/')) {
    return NextResponse.json({ error: 'Formato inválido. Envie uma imagem.' }, { status: 400 })
  }

  // Verifica tamanho
  const base64 = dataUri.split(',')[1] ?? ''
  const sizeBytes = Math.ceil(base64.length * 0.75)
  if (sizeBytes > MAX_SIZE) {
    return NextResponse.json({ error: 'Imagem muito grande. Máximo 2MB.' }, { status: 400 })
  }

  try {
    const db  = getDb()
    const key = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    await db.insert(siteContent).values({
      key,
      value: { dataUri, filename: body.filename, size: sizeBytes },
      updated_by: 'admin',
    }).onConflictDoUpdate({
      target: siteContent.key,
      set: { value: { dataUri, filename: body.filename, size: sizeBytes }, updated_at: new Date() },
    })

    // URL pública para servir a imagem
    const url = `/api/img/${key}`
    return NextResponse.json({ url, key })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro ao salvar'
    console.error('[upload]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

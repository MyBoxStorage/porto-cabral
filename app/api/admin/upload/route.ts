import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { siteContent } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/adminAuth'
export const dynamic = 'force-dynamic'

const MAX_SIZE = 2 * 1024 * 1024

export async function POST(req: Request) {
  const authError = await requireAdmin()
  if (authError) return authError

  const body = await req.json().catch(() => null)
  if (!body?.data || !body?.filename) {
    return NextResponse.json({ error: 'data e filename obrigatorios' }, { status: 400 })
  }

  const dataUri: string = body.data
  if (!dataUri.startsWith('data:image/')) {
    return NextResponse.json({ error: 'Formato invalido. Envie uma imagem.' }, { status: 400 })
  }

  const base64 = dataUri.split(',')[1] ?? ''
  const sizeBytes = Math.ceil(base64.length * 0.75)
  if (sizeBytes > MAX_SIZE) {
    return NextResponse.json({ error: 'Imagem muito grande. Maximo 2MB.' }, { status: 400 })
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

    const url = `/api/img/${key}`
    return NextResponse.json({ url, key })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro ao salvar'
    console.error('[upload]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
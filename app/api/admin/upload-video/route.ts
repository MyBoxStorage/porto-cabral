// POST /api/admin/upload-video
// Faz upload via REST API do Supabase Storage diretamente (sem SDK).
// O SDK usa JWT signing que falha neste projeto — a API REST aceita o Bearer token diretamente.
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

const BUCKET      = 'pc-videos'
const MAX_MB      = 50
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL_PC!
const SERVICE_KEY  = process.env.PC_SUPABASE_SERVICE_ROLE_KEY!
const ALLOWED_MIME = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']

export async function POST(req: Request) {
  try {
    const authError = await requireAdmin()
    if (authError) return authError

    const formData = await req.formData().catch(() => null)
    if (!formData) {
      return NextResponse.json({ error: 'Envie o vídeo como multipart/form-data' }, { status: 400 })
    }

    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'Campo "file" obrigatório' }, { status: 400 })
    }

    if (!ALLOWED_MIME.includes(file.type)) {
      return NextResponse.json(
        { error: `Formato não permitido: ${file.type}. Use MP4, WebM ou MOV.` },
        { status: 400 },
      )
    }

    if (file.size > MAX_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Arquivo muito grande. Máximo ${MAX_MB}MB.` },
        { status: 400 },
      )
    }

    if (!SUPABASE_URL || !SERVICE_KEY) {
      return NextResponse.json({ error: 'Variáveis de ambiente do Supabase não configuradas.' }, { status: 500 })
    }

    // Gera path único
    const ext  = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4'
    const safe = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9_-]/gi, '_').slice(0, 40)
    const path = `${Date.now()}_${safe}.${ext}`

    // Upload via REST API direta — sem SDK, sem JWT signing
    const bytes = await file.arrayBuffer()
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`

    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': file.type,
        'x-upsert': 'false',
        'Cache-Control': '31536000',
      },
      body: bytes,
    })

    if (!uploadRes.ok) {
      const errBody = await uploadRes.text()
      console.error('[upload-video] REST error:', uploadRes.status, errBody)
      return NextResponse.json(
        { error: `Supabase Storage retornou ${uploadRes.status}: ${errBody}` },
        { status: 500 },
      )
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
    return NextResponse.json({ publicUrl })

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[upload-video] erro inesperado:', msg)
    return NextResponse.json({ error: `Erro interno: ${msg}` }, { status: 500 })
  }
}

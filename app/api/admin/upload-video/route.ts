// POST /api/admin/upload-video
// Recebe o vídeo no body e faz upload direto para o Supabase Storage via Admin client.
// Usa conexão de service role sem depender de JWT signing para URLs assinadas.
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { createSupabaseAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

// Aumenta o limite de body do Next.js para 100MB
export const config = { api: { bodyParser: { sizeLimit: '100mb' } } }

const BUCKET       = 'pc-videos'
const ALLOWED_MIME = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo']
const MAX_MB       = 100

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

    const supabase = createSupabaseAdminClient()

    // Cria bucket se não existir (ignora erro se já existe)
    await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_MB * 1024 * 1024,
      allowedMimeTypes: ALLOWED_MIME,
    }).catch(() => {})

    // Gera path único
    const ext  = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4'
    const safe = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9_-]/gi, '_').slice(0, 40)
    const path = `${Date.now()}_${safe}.${ext}`

    // Upload direto via Admin client — não usa JWT signing
    const arrayBuffer = await file.arrayBuffer()
    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, arrayBuffer, {
        contentType: file.type,
        cacheControl: '31536000', // 1 ano de cache no CDN
        upsert: false,
      })

    if (uploadErr) {
      console.error('[upload-video] upload error:', uploadErr.message)
      return NextResponse.json(
        { error: `Erro no upload: ${uploadErr.message}` },
        { status: 500 },
      )
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)

    return NextResponse.json({ publicUrl })

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[upload-video] erro inesperado:', msg)
    return NextResponse.json({ error: `Erro interno: ${msg}` }, { status: 500 })
  }
}

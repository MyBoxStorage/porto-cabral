// POST /api/admin/upload-video
// Gera URL de upload assinada no Supabase Storage.
// O browser faz PUT direto para o Supabase — o vídeo NÃO passa pelo servidor Next.js.
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { createSupabaseAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const BUCKET       = 'pc-videos'
const ALLOWED_MIME = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']

async function ensureBucket(supabase: ReturnType<typeof createSupabaseAdminClient>) {
  // Tenta criar — ignora qualquer erro (bucket já existe = Duplicate, ou sem permissão)
  await supabase.storage.createBucket(BUCKET, {
    public:           true,
    fileSizeLimit:    500 * 1024 * 1024,
    allowedMimeTypes: ALLOWED_MIME,
  })
  // Confirma que o bucket está acessível independente do resultado acima
  const { data: buckets } = await supabase.storage.listBuckets()
  return buckets?.some(b => b.name === BUCKET) ?? false
}

export async function POST(req: Request) {
  try {
    const authError = await requireAdmin()
    if (authError) return authError

    const body = await req.json().catch(() => null)
    if (!body?.filename || !body?.mimeType) {
      return NextResponse.json({ error: 'filename e mimeType são obrigatórios' }, { status: 400 })
    }

    const { filename, mimeType } = body as { filename: string; mimeType: string }

    if (!ALLOWED_MIME.includes(mimeType)) {
      return NextResponse.json(
        { error: `Formato não permitido: ${mimeType}. Use MP4, WebM ou MOV.` },
        { status: 400 },
      )
    }

    const supabase = createSupabaseAdminClient()

    // Garante que o bucket existe antes de tentar criar URL assinada
    const bucketOk = await ensureBucket(supabase)
    if (!bucketOk) {
      return NextResponse.json(
        { error: 'Bucket "pc-videos" não encontrado. Crie-o em Supabase → Storage → New bucket (nome: pc-videos, Public: ✓).' },
        { status: 500 },
      )
    }

    // Gera path único
    const ext  = filename.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4'
    const safe = filename.replace(/\.[^.]+$/, '').replace(/[^a-z0-9_-]/gi, '_').slice(0, 40)
    const path = `${Date.now()}_${safe}.${ext}`

    // URL de upload assinada — válida por 1 hora
    const { data, error: signErr } = await supabase.storage
      .from(BUCKET)
      .createSignedUploadUrl(path)

    if (signErr || !data) {
      console.error('[upload-video] createSignedUploadUrl:', signErr?.message)
      return NextResponse.json(
        { error: `Erro ao gerar URL de upload: ${signErr?.message ?? 'resposta vazia'}` },
        { status: 500 },
      )
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)

    return NextResponse.json({ signedUrl: data.signedUrl, publicUrl })

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[upload-video] erro inesperado:', msg)
    return NextResponse.json({ error: `Erro interno: ${msg}` }, { status: 500 })
  }
}

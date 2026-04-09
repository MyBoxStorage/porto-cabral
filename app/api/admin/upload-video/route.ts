// POST /api/admin/upload-video
// Gera uma URL de upload assinada no Supabase Storage.
// O browser faz PUT direto para o Supabase — o vídeo NÃO passa pelo servidor Next.js.
// Isso evita limitações de tamanho de função e é mais rápido para o usuário.
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { createSupabaseAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const BUCKET       = 'pc-videos'
const MAX_SIZE_MB  = 500
const ALLOWED_MIME = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']

export async function POST(req: Request) {
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

  // Cria o bucket se não existir (idempotente — ignora erro se já existe)
  await supabase.storage.createBucket(BUCKET, {
    public:           true,
    fileSizeLimit:    MAX_SIZE_MB * 1024 * 1024,
    allowedMimeTypes: ALLOWED_MIME,
  })

  // Gera path único para evitar colisão
  const ext  = filename.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4'
  const safe = filename.replace(/\.[^.]+$/, '').replace(/[^a-z0-9_-]/gi, '_').slice(0, 40)
  const path = `${Date.now()}_${safe}.${ext}`

  // URL de upload assinada — válida por 1 hora
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(path)

  if (error || !data) {
    console.error('[upload-video] signed URL error:', error)
    return NextResponse.json({ error: 'Não foi possível gerar URL de upload.' }, { status: 500 })
  }

  // URL pública final (CDN Supabase / Cloudflare)
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(path)

  return NextResponse.json({ signedUrl: data.signedUrl, publicUrl })
}

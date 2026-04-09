// POST /api/admin/upload-video
// Gera URL de upload assinada no Supabase Storage.
// O browser faz PUT direto para o Supabase — o vídeo NÃO passa pelo servidor Next.js.
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { createSupabaseAdminClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const BUCKET       = 'pc-videos'
const ALLOWED_MIME = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']

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

    // Valida variáveis de ambiente antes de criar o cliente
    if (!process.env.PC_SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[upload-video] PC_SUPABASE_SERVICE_ROLE_KEY não definida no ambiente')
      return NextResponse.json(
        { error: 'Configuração de servidor incompleta. Adicione PC_SUPABASE_SERVICE_ROLE_KEY nas variáveis de ambiente do Vercel.' },
        { status: 500 },
      )
    }

    const supabase = createSupabaseAdminClient()

    // Cria o bucket se não existir (ignora erro "already exists")
    const { error: bucketErr } = await supabase.storage.createBucket(BUCKET, {
      public:           true,
      fileSizeLimit:    500 * 1024 * 1024,
      allowedMimeTypes: ALLOWED_MIME,
    })
    if (bucketErr && !bucketErr.message.includes('already exists')) {
      console.error('[upload-video] createBucket:', bucketErr.message)
      // Não aborta — bucket pode já existir com mensagem diferente
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
        { error: `Não foi possível gerar URL de upload: ${signErr?.message ?? 'resposta vazia'}` },
        { status: 500 },
      )
    }

    // URL pública final (CDN Supabase / Cloudflare)
    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)

    return NextResponse.json({ signedUrl: data.signedUrl, publicUrl })

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[upload-video] erro inesperado:', msg)
    return NextResponse.json({ error: `Erro interno: ${msg}` }, { status: 500 })
  }
}

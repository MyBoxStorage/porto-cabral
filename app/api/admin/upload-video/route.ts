// POST /api/admin/upload-video — usa SDK Supabase com sb_secret_ key via createClient
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminAuth'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const BUCKET       = 'pc-videos'
const MAX_MB       = 50
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
      return NextResponse.json({ error: `Formato não permitido: ${file.type}` }, { status: 400 })
    }

    if (file.size > MAX_MB * 1024 * 1024) {
      return NextResponse.json({ error: `Máximo ${MAX_MB}MB.` }, { status: 400 })
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL_PC
    const key = process.env.PC_SUPABASE_SERVICE_ROLE_KEY

    if (!url || !key) {
      return NextResponse.json({ error: 'Env SUPABASE não configurada.' }, { status: 500 })
    }

    // Cria cliente com a sb_secret_ key — o SDK envia os headers corretos internamente
    const supabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const ext  = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'mp4'
    const safe = file.name.replace(/\.[^.]+$/, '').replace(/[^a-z0-9_-]/gi, '_').slice(0, 40)
    const path = `${Date.now()}_${safe}.${ext}`

    const bytes = await file.arrayBuffer()

    const { error: uploadErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, {
        contentType: file.type,
        cacheControl: '31536000',
        upsert: false,
      })

    if (uploadErr) {
      console.error('[upload-video]', uploadErr.message)
      return NextResponse.json({ error: uploadErr.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return NextResponse.json({ publicUrl })

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[upload-video]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

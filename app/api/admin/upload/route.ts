// POST /api/admin/upload — recebe imagem base64 e faz upload no Cloudinary
import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  if (!body?.data || !body?.filename) {
    return NextResponse.json({ error: 'data e filename obrigatórios' }, { status: 400 })
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey    = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: 'Cloudinary não configurado' }, { status: 500 })
  }

  try {
    // Gera assinatura para upload autenticado
    const timestamp = Math.round(Date.now() / 1000)
    const folder    = 'porto-cabral/dishes'
    const publicId  = `${folder}/${body.filename.replace(/\.[^.]+$/, '').replace(/\s+/g, '_')}`

    // Assina com SHA-1
    const crypto = await import('crypto')
    const str    = `folder=${folder}&public_id=${publicId}&timestamp=${timestamp}${apiSecret}`
    const signature = crypto.createHash('sha1').update(str).digest('hex')

    const formData = new FormData()
    formData.append('file', body.data) // base64 data URI
    formData.append('api_key', apiKey)
    formData.append('timestamp', String(timestamp))
    formData.append('signature', signature)
    formData.append('folder', folder)
    formData.append('public_id', publicId)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error?.message ?? 'Upload falhou')

    return NextResponse.json({ url: data.secure_url, public_id: data.public_id })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro desconhecido'
    console.error('[upload]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

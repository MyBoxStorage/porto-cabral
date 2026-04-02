import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { auth } from '@/auth'
import { getDb } from '@/lib/db'
import { customers } from '@/lib/db/schema'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  try {
    const db = getDb()
    const [row] = await db
      .select({
        name: customers.name,
        email: customers.email,
        whatsapp: customers.whatsapp,
        birth_date: customers.birth_date,
        city_of_origin: customers.city_of_origin,
        allergies: customers.allergies,
        special_notes: customers.special_notes,
      })
      .from(customers)
      .where(eq(customers.auth_user_id, session.user.id))
      .limit(1)

    if (!row) {
      return NextResponse.json({ error: 'Perfil não encontrado.' }, { status: 404 })
    }

    return NextResponse.json({ perfil: row })
  } catch (e) {
    console.error('[cliente/perfil GET]', e)
    return NextResponse.json({ error: 'Erro ao carregar perfil.' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'

const PerfilSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  whatsapp: z.string().min(10).max(20).optional(),
  birth_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .nullable(),
  city_of_origin: z.string().max(120).optional(),
  allergies: z.string().max(500).optional(),
  special_notes: z.string().max(500).optional(),
})

export async function PUT(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const json = await req.json().catch(() => null)
  const parsed = PerfilSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const patch = parsed.data

  try {
    const db = getDb()
    await db
      .update(customers)
      .set({
        ...(patch.name !== undefined ? { name: patch.name } : {}),
        ...(patch.whatsapp !== undefined ? { whatsapp: patch.whatsapp } : {}),
        ...(patch.birth_date !== undefined ? { birth_date: patch.birth_date } : {}),
        ...(patch.city_of_origin !== undefined
          ? { city_of_origin: patch.city_of_origin }
          : {}),
        ...(patch.allergies !== undefined ? { allergies: patch.allergies } : {}),
        ...(patch.special_notes !== undefined
          ? { special_notes: patch.special_notes }
          : {}),
        updated_at: new Date(),
      })
      .where(eq(customers.auth_user_id, session.user.id))
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[cliente/perfil]', e)
    return NextResponse.json({ error: 'Não foi possível atualizar o perfil.' }, { status: 500 })
  }
}

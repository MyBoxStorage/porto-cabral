// lib/adminAuth.ts
// Helper para proteger Route Handlers do /api/admin/*.
// Uso: const check = await requireAdmin(); if (check) return check;

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { isAdminEmail } from '@/lib/admin'

export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await auth()
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  return null // ok, pode prosseguir
}

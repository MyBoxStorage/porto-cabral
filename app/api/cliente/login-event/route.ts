import { NextResponse } from 'next/server'

import { auth } from '@/auth'
import { sendBcEvent } from '@/lib/bcconnect'

export const dynamic = 'force-dynamic'

export async function POST() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  void sendBcEvent({
    eventType: 'LOGIN',
    occurredAt: new Date().toISOString(),
    lead: { email: session.user.email.toLowerCase() },
  })

  return NextResponse.json({ success: true })
}

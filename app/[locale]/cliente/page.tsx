import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { ClienteDashboardClient } from './ClienteDashboardClient'

type Props = { params: Promise<{ locale: string }> }

export default async function ClienteDashboard({ params }: Props) {
  const { locale } = await params
  const session = await auth()
  if (!session) redirect(`/${locale}/cliente/login`)
  return <ClienteDashboardClient session={session} />
}

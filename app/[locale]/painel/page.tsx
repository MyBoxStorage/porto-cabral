import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { isAdminEmail } from '@/lib/admin'
import { PainelClient } from './PainelClient'

type Props = { params: Promise<{ locale: string }> }

export default async function PainelPage({ params }: Props) {
  const { locale } = await params
  const session = await auth()

  // Sem sessao -> redireciona para login
  if (!session?.user?.email) {
    redirect(`/${locale}/cliente/login`)
  }

  // Logado mas nao eh admin -> home
  if (!isAdminEmail(session.user.email)) {
    redirect(`/${locale}`)
  }

  return <PainelClient />
}

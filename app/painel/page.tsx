import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { isAdminEmail } from '@/lib/admin'
import { PainelClient } from '@/app/[locale]/painel/PainelClient'

export default async function PainelPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect('/painel/login')
  }

  if (!isAdminEmail(session.user.email)) {
    redirect('/')
  }

  return <PainelClient />
}

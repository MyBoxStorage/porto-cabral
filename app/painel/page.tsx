import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { isAdminEmail } from '@/lib/admin'
import { PainelClientWrapper } from './PainelClientWrapper'

// Server Component: faz a verificação de auth no servidor.
// PainelClientWrapper (Client Component) carrega PainelClient dinamicamente com ssr:false.
export default async function PainelPage() {
  const session = await auth()

  if (!session?.user?.email) {
    redirect('/painel/login')
  }

  if (!isAdminEmail(session.user.email)) {
    redirect('/')
  }

  return <PainelClientWrapper />
}

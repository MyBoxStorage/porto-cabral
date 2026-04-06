import { redirect } from 'next/navigation'
import dynamic from 'next/dynamic'
import { auth } from '@/auth'
import { isAdminEmail } from '@/lib/admin'

// PainelClient é um componente de 93 KB que só é acessado por admins.
// Com dynamic + ssr:false, o bundle do painel nunca é incluído no JS
// de visitantes públicos — carrega apenas quando o admin está autenticado.
const PainelClient = dynamic(
  () => import('@/app/[locale]/painel/PainelClient').then((m) => m.PainelClient),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: '100vh',
          background: '#001432',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '2px solid rgba(212,168,67,0.2)',
            borderTopColor: 'rgba(212,168,67,0.8)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    ),
  }
)

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

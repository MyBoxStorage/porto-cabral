'use client'
import dynamic from 'next/dynamic'

// PainelClient é 93 KB — com dynamic + ssr:false só carrega após autenticação confirmada.
// Este wrapper é um Client Component, o que permite usar ssr:false corretamente.
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

export function PainelClientWrapper() {
  return <PainelClient />
}

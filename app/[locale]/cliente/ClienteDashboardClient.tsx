'use client'
import { signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import { useState, useEffect, useRef } from 'react'
import { MinhasReservas } from '@/components/cliente/MinhasReservas'
import { MeuPerfil } from '@/components/cliente/MeuPerfil'
import { QuizPreferencias } from '@/components/cliente/QuizPreferencias'
import { IconLogbook, IconTripulante, IconPreferencias, IconAncora, IconLeme } from '@/components/icons'
import { useSiteContent } from '@/lib/useSiteContent'

type Tab = 'reservas' | 'perfil' | 'quiz'
type Props = { session: Session }

const tabs: { key: Tab; label: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { key: 'reservas', label: 'Minhas Reservas', Icon: IconLogbook },
  { key: 'perfil',   label: 'Meu Perfil',      Icon: IconTripulante },
  { key: 'quiz',     label: 'Preferências',    Icon: IconPreferencias },
]

export function ClienteDashboardClient({ session }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('reservas')
  const videoRef = useRef<HTMLVideoElement>(null)

  // Video de fundo da area do cliente — configurado no painel
  type PageBannersData = { cliente_video?: string; cardapio?: string; sobre?: string; blog?: string }
  const banners = useSiteContent<PageBannersData>('page_banners', {})
  const bgVideo = banners?.cliente_video || ''

  // Intersection observer para pausar/retomar o video
  useEffect(() => {
    const el = videoRef.current
    if (!el || !bgVideo) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [bgVideo])

  return (
    <div className="min-h-screen bg-[#002451] pt-[88px] pb-16 px-4 relative overflow-hidden">

      {/* Video de fundo — autoplay loop muted */}
      {bgVideo && (
        <>
          <video
            ref={videoRef}
            src={bgVideo}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{
              position: 'fixed',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: 0,
              filter: 'brightness(0.35)',
            }}
          />
          {/* Overlay gradiente para manter legibilidade */}
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1,
            background: 'linear-gradient(180deg,rgba(0,20,50,0.6) 0%,rgba(0,36,81,0.5) 50%,rgba(0,20,50,0.7) 100%)',
            pointerEvents: 'none',
          }} />
        </>
      )}
      <div className="max-w-4xl mx-auto" style={{position:'relative',zIndex:2}}>

        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="flex items-center gap-2 text-[#D4A843] mb-1">
              <IconLeme size={14} strokeWidth={1.5} />
              <p className="font-accent uppercase tracking-widest text-xs">Cabine do Comandante</p>
            </div>
            <h1 className="font-display text-3xl text-white">
              Olá, {session.user?.name?.split(' ')[0] ?? 'Tripulante'}
            </h1>
            <p className="text-slate-400 text-sm mt-1">{session.user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-[#D4A843] opacity-30">
              <IconAncora size={32} strokeWidth={1} />
            </div>
            <button onClick={() => signOut({ callbackUrl: '/' })}
              className="text-slate-400 hover:text-white transition-colors text-sm font-accent uppercase tracking-wide border border-white/10 px-4 py-2 rounded-lg hover:border-white/30">
              Sair
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white/5 rounded-xl p-1 overflow-x-auto">
          {tabs.map(({ key, label, Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-accent uppercase tracking-wide transition-all whitespace-nowrap ${
                activeTab === key
                  ? 'bg-[#D4A843] text-[#002451] font-bold'
                  : 'text-slate-400 hover:text-white'}`}>
              <Icon size={15} strokeWidth={activeTab === key ? 2 : 1.5} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
          {activeTab === 'reservas' && <MinhasReservas />}
          {activeTab === 'perfil'   && <MeuPerfil session={session} />}
          {activeTab === 'quiz'     && (
            <div>
              <h2 className="font-display text-xl text-white mb-6">Suas Preferências</h2>
              <QuizPreferencias />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

'use client'
import { signOut } from 'next-auth/react'
import type { Session } from 'next-auth'
import { useState, useEffect, useRef } from 'react'
import { useLocale } from 'next-intl'
import { MinhasReservas } from '@/components/cliente/MinhasReservas'
import { MeuPerfil } from '@/components/cliente/MeuPerfil'
import { QuizPreferencias } from '@/components/cliente/QuizPreferencias'
import { useSiteContent } from '@/lib/useSiteContent'

type Tab = 'reservas' | 'perfil' | 'quiz'
type Props = { session: Session }
type Locale = 'pt' | 'en' | 'es'

const TAB_LABELS: Record<Locale, { reservas: string; perfil: string; quiz: string }> = {
  pt: { reservas: 'Reservas', perfil: 'Perfil', quiz: 'Preferências' },
  en: { reservas: 'Bookings', perfil: 'Profile', quiz: 'Preferences' },
  es: { reservas: 'Reservas', perfil: 'Perfil', quiz: 'Preferencias' },
}

const HEADER_LABELS: Record<Locale, { eyebrow: string; greeting: string; logout: string }> = {
  pt: { eyebrow: 'Cabine do Comandante', greeting: 'Olá,', logout: 'Sair' },
  en: { eyebrow: "Captain's Cabin",      greeting: 'Hello,', logout: 'Sign out' },
  es: { eyebrow: 'Cabina del Comandante', greeting: 'Hola,', logout: 'Salir' },
}

export function ClienteDashboardClient({ session }: Props) {
  const rawLocale = useLocale()
  const locale: Locale = (rawLocale as Locale) || 'pt'

  const [activeTab, setActiveTab] = useState<Tab>('reservas')
  const videoRef = useRef<HTMLVideoElement>(null)

  type PageBannersData = { cliente_video?: string }
  const banners = useSiteContent<PageBannersData>('page_banners', {})
  const bgVideo = banners?.cliente_video || ''

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

  const labels = TAB_LABELS[locale]
  const header = HEADER_LABELS[locale]
  const firstName =
    session.user?.name?.split(' ')[0] ??
    (locale === 'en' ? 'Guest' : 'Tripulante')

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'reservas', label: labels.reservas, icon: '◷' },
    { key: 'perfil',   label: labels.perfil,   icon: '◉' },
    { key: 'quiz',     label: labels.quiz,     icon: '◎' },
  ]

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: '#001020' }}
      /* SEM paddingTop: o Navbar está invisible (opacity 0) no topo da página
         então o conteúdo pode começar do topo e o header da Cabine aparece
         naturalmente logo abaixo do topo sem ser tapado. */
    >
      {/* ── Vídeo de fundo ── */}
      {bgVideo && (
        <>
          <video
            ref={videoRef}
            src={bgVideo}
            autoPlay muted loop playsInline preload="auto"
            style={{
              position: 'fixed', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              zIndex: 0, filter: 'brightness(0.32) saturate(1.1)',
            }}
          />
          <div style={{
            position: 'fixed', inset: 0, zIndex: 1,
            background: 'linear-gradient(160deg,rgba(0,10,30,0.65) 0%,rgba(0,25,60,0.45) 50%,rgba(0,10,30,0.7) 100%)',
            pointerEvents: 'none',
          }} />
        </>
      )}

      {/* ── Conteúdo ── */}
      <div style={{ position: 'relative', zIndex: 2, minHeight: '100dvh' }}>

        {/* ── HEADER DA CABINE
            paddingTop = altura da navbar (72px) + safe-area iOS + margem visual.
            A navbar é fixed/transparente no topo — precisamos desse espaço para
            o conteúdo não ficar atrás dela. ── */}
        <header style={{
          padding: '0 1.25rem',
          paddingTop: 'max(calc(72px + env(safe-area-inset-top, 0px) + 2rem), 112px)',
          borderBottom: '1px solid rgba(212,168,67,0.1)',
          background: 'rgba(0,15,40,0.5)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}>
          <div style={{
            maxWidth: 720, margin: '0 auto',
            padding: '12px 0 24px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', gap: 16,
          }}>

            {/* Lado esquerdo: eyebrow + nome + email */}
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{
                fontFamily: "'Josefin Sans',sans-serif",
                fontSize: '0.58rem', fontWeight: 700,
                letterSpacing: '0.38em', textTransform: 'uppercase',
                color: 'rgba(212,168,67,0.65)', margin: '0 0 10px',
              }}>
                ✦ {header.eyebrow}
              </p>
              <h1 style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 'clamp(1.8rem, 7vw, 2.4rem)',
                fontStyle: 'italic', fontWeight: 400,
                color: '#fff', margin: '0 0 8px', lineHeight: 1.1,
              }}>
                {header.greeting}{' '}
                <span style={{ color: '#D4A843' }}>{firstName}</span>
              </h1>
              <p style={{
                fontFamily: "'Josefin Sans',sans-serif",
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.3)',
                margin: '5px 0 0', letterSpacing: '0.02em',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {session.user?.email}
              </p>
            </div>

            {/* Lado direito: âncora + botão sair */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <span style={{ color: 'rgba(212,168,67,0.18)', fontSize: '1.5rem', lineHeight: 1 }}>⚓</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                style={{
                  fontFamily: "'Josefin Sans',sans-serif",
                  fontSize: '0.62rem', fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '9px 14px', borderRadius: 8,
                  cursor: 'pointer', transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                  WebkitTapHighlightColor: 'transparent',
                }}
              >
                {header.logout}
              </button>
            </div>
          </div>
        </header>

        {/* ── TABS — sticky abaixo da navbar ── */}
        <div style={{
          position: 'sticky', top: 72, zIndex: 10,
          background: 'rgba(0,10,30,0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212,168,67,0.08)',
        }}>
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 1.25rem' }}>
            <div style={{ display: 'flex' }}>
              {tabs.map(({ key, label, icon }) => {
                const isActive = activeTab === key
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    style={{
                      flex: 1,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 6, padding: '15px 8px',
                      fontFamily: "'Josefin Sans',sans-serif",
                      fontSize: '0.65rem', fontWeight: isActive ? 700 : 500,
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: isActive ? '#D4A843' : 'rgba(255,255,255,0.38)',
                      background: 'transparent', border: 'none',
                      cursor: 'pointer',
                      borderBottom: `2px solid ${isActive ? '#D4A843' : 'transparent'}`,
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <span style={{ fontSize: '0.65rem', opacity: isActive ? 1 : 0.4 }}>{icon}</span>
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── CONTEÚDO DAS ABAS ── */}
        <main style={{ maxWidth: 720, margin: '0 auto', padding: '1.75rem 1.25rem 5rem' }}>
          {activeTab === 'reservas' && <MinhasReservas locale={locale} />}
          {activeTab === 'perfil'   && <MeuPerfil session={session} locale={locale} />}
          {activeTab === 'quiz'     && <QuizPreferencias locale={locale} />}
        </main>
      </div>
    </div>
  )
}

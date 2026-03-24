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
  en: { eyebrow: "Captain's Cabin",     greeting: 'Hello,', logout: 'Sign out' },
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
  const firstName = session.user?.name?.split(' ')[0] ?? (locale === 'en' ? 'Guest' : locale === 'es' ? 'Tripulante' : 'Tripulante')

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'reservas', label: labels.reservas, icon: '◷' },
    { key: 'perfil',   label: labels.perfil,   icon: '◉' },
    { key: 'quiz',     label: labels.quiz,     icon: '◎' },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#001020', paddingTop: 0 }}>

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

        {/* ── HEADER ── */}
        <header style={{
          padding: '0 1.25rem',
          paddingTop: 'max(env(safe-area-inset-top), 16px)',
          borderBottom: '1px solid rgba(212,168,67,0.1)',
          background: 'rgba(0,15,40,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}>
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '14px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontFamily: "'Josefin Sans',sans-serif",
                fontSize: '0.6rem', fontWeight: 700,
                letterSpacing: '0.35em', textTransform: 'uppercase',
                color: 'rgba(212,168,67,0.7)', margin: '0 0 4px',
              }}>
                ✦ {header.eyebrow}
              </p>
              <h1 style={{
                fontFamily: "'Playfair Display',serif",
                fontSize: 'clamp(1.4rem, 6vw, 2rem)',
                fontStyle: 'italic', fontWeight: 400,
                color: '#fff', margin: 0, lineHeight: 1.15,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {header.greeting} <span style={{ color: '#D4A843' }}>{firstName}</span>
              </h1>
              <p style={{
                fontFamily: "'Josefin Sans',sans-serif",
                fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)',
                margin: '3px 0 0', letterSpacing: '0.03em',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {session.user?.email}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              {/* Âncora decorativa */}
              <span style={{ color: 'rgba(212,168,67,0.2)', fontSize: '1.4rem', lineHeight: 1 }}>⚓</span>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                style={{
                  fontFamily: "'Josefin Sans',sans-serif",
                  fontSize: '0.65rem', fontWeight: 700,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.55)',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {header.logout}
              </button>
            </div>
          </div>
        </header>

        {/* ── TABS ── */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'rgba(0,10,30,0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(212,168,67,0.08)',
        }}>
          <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 1.25rem' }}>
            <div style={{ display: 'flex', gap: 0 }}>
              {tabs.map(({ key, label, icon }) => {
                const isActive = activeTab === key
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 6, padding: '14px 8px',
                      fontFamily: "'Josefin Sans',sans-serif",
                      fontSize: '0.65rem', fontWeight: isActive ? 700 : 500,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: isActive ? '#D4A843' : 'rgba(255,255,255,0.4)',
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      borderBottom: `2px solid ${isActive ? '#D4A843' : 'transparent'}`,
                      transition: 'all 0.2s',
                      whiteSpace: 'nowrap',
                      WebkitTapHighlightColor: 'transparent',
                    }}
                  >
                    <span style={{ fontSize: '0.7rem', opacity: isActive ? 1 : 0.5 }}>{icon}</span>
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── CONTEÚDO ── */}
        <main style={{ maxWidth: 720, margin: '0 auto', padding: '1.5rem 1.25rem 4rem' }}>
          {activeTab === 'reservas' && <MinhasReservas locale={locale} />}
          {activeTab === 'perfil'   && <MeuPerfil session={session} locale={locale} />}
          {activeTab === 'quiz'     && <QuizPreferencias locale={locale} />}
        </main>
      </div>
    </div>
  )
}

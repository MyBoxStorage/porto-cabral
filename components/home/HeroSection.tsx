'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useSiteContent } from '@/lib/useSiteContent'

/* ─────────────────────────────────────────────────────────────
   Detecção de mobile SÍNCRONA — antes do primeiro render
───────────────────────────────────────────────────────────── */
function getIsMobile(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.innerWidth < 768 ||
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent)
  )
}

type HeroData = {
  video_desktop_1?: string
  video_desktop_2?: string
  video_desktop_3?: string
  video_mobile?: string
  video_mobile_2?: string
  [key: string]: string | undefined
}

/* ─────────────────────────────────────────────────────────────
   VideoSlot — renderiza UM vídeo e nunca troca sua src.
   A src é travada no primeiro valor não-vazio recebido.
   Isso evita o re-render que reinicia o carregamento.
───────────────────────────────────────────────────────────── */
function VideoSlot({
  src,
  onFirstPlay,
}: {
  src: string
  onFirstPlay?: () => void
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const firedRef = useRef(false)
  // Trava a src no primeiro valor não-vazio — nunca muda depois
  const lockedSrc = useRef<string>('')
  if (src && !lockedSrc.current) {
    lockedSrc.current = src
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const tryPlay = () => {
      el.play()
        .then(() => {
          if (!firedRef.current) {
            firedRef.current = true
            onFirstPlay?.()
          }
        })
        .catch(() => setTimeout(tryPlay, 300))
    }
    tryPlay()

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.05 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // intencionalmente sem deps — monta uma vez

  // Só renderiza quando tiver src travada
  if (!lockedSrc.current) return null

  return (
    <video
      ref={ref}
      src={lockedSrc.current}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center',
        filter: 'brightness(0.55)',
        display: 'block',
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   HeroSection
───────────────────────────────────────────────────────────── */
export function HeroSection() {
  const t = useTranslations('home')
  const locale = useLocale()
  const [isMobile] = useState<boolean>(getIsMobile)
  const [videoReady, setVideoReady] = useState(false)

  // Revela os vídeos após 400ms no mobile, 600ms no desktop
  // independente de qualquer evento — os vídeos já estão tocando
  useEffect(() => {
    const delay = isMobile ? 400 : 600
    const timer = setTimeout(() => setVideoReady(true), delay)
    return () => clearTimeout(timer)
  }, [isMobile])

  const raw = useSiteContent<HeroData>('hero', {})
  const data = raw ?? {}

  // URLs finais — sem fallback para URL diferente
  // Se não tem URL configurada, o slot não renderiza nada
  const d1   = data.video_desktop_1 ?? ''
  const d2   = data.video_desktop_2 ?? ''
  const d3   = data.video_desktop_3 ?? ''
  const mob  = data.video_mobile    ?? ''
  const mob2 = data.video_mobile_2  ?? ''

  const desktopSrcs = [d1, d2, d3]
  const mobileSrcs  = [mob, mob2]

  const handleFirstPlay = useCallback(() => {
    setVideoReady(true)
  }, [])

  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ height: '100dvh' }}
    >
      {/* Capa de loading — some quando videoReady */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg,#001432 0%,#002451 50%,#0a1a35 100%)',
          opacity: videoReady ? 0 : 1,
          transition: 'opacity 0.6s ease',
        }}
      >
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(212,168,67,0.06) 1px,transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage:
              'radial-gradient(ellipse at 20% 50%,rgba(0,116,191,0.25) 0%,transparent 55%),' +
              'radial-gradient(ellipse at 80% 50%,rgba(0,116,191,0.25) 0%,transparent 55%)',
          }}
        />
      </div>

      {/* Camada de vídeo */}
      <div
        className="absolute inset-0 z-0"
        style={{
          opacity: videoReady ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        {isMobile ? (
          /* ── MOBILE ── */
          mobileSrcs.filter(Boolean).length >= 2 ? (
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
              <div style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
                <VideoSlot src={mobileSrcs[0]} onFirstPlay={handleFirstPlay} />
              </div>
              <div style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
                <VideoSlot src={mobileSrcs[1]} />
              </div>
            </div>
          ) : (
            <VideoSlot src={mob} onFirstPlay={handleFirstPlay} />
          )
        ) : (
          /* ── DESKTOP ── */
          <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            {desktopSrcs.map((src, i) => (
              <div key={i} style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
                <VideoSlot src={src} onFirstPlay={i === 0 ? handleFirstPlay : undefined} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overlay gradiente */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg,rgba(0,20,50,0.5) 0%,rgba(26,95,168,0.06) 38%,rgba(26,95,168,0.06) 62%,rgba(0,20,50,0.65) 100%)',
        }}
      />

      {/* Conteúdo */}
      <div className="relative z-20 text-center px-4 sm:px-6 max-w-3xl mx-auto w-full">
        <p
          className="font-accent text-[10px] tracking-[0.5em] uppercase mb-6"
          style={{ color: 'rgba(212,168,67,0.8)' }}
        >
          {t('hero_eyebrow')}
        </p>
        <h1
          className="font-display italic text-white leading-[1.05] mb-7"
          style={{ fontSize: 'clamp(2.8rem,7vw,5.5rem)', textShadow: '0 4px 32px rgba(0,0,0,0.6)' }}
        >
          {t('hero_tagline').split('\n').map((line, i) => (
            <span key={i}>{line}{i === 0 && <br />}</span>
          ))}
        </h1>
        <div
          className="flex items-center justify-center gap-3 mb-8 mx-auto"
          style={{ maxWidth: 220 }}
        >
          <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(212,168,67,0.55))' }} />
          <span className="font-display text-pc-gold" style={{ fontSize: '0.9rem', letterSpacing: '0.2em' }}>✦</span>
          <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,rgba(212,168,67,0.55),transparent)' }} />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4 sm:px-0">
          <a
            href="#reserva"
            className="shimmer w-full sm:w-auto px-8 md:px-10 py-4 font-accent font-semibold text-xs tracking-[0.22em] uppercase text-pc-navy rounded shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-200 text-center min-h-[48px] flex items-center justify-center"
          >
            {t('cta_reserva')}
          </a>
          <a
            href={`/${locale}/cardapio`}
            className="w-full sm:w-auto px-8 md:px-10 py-4 font-accent font-semibold text-xs tracking-[0.22em] uppercase text-white rounded transition-all duration-200 hover:bg-white/15 text-center min-h-[48px] flex items-center justify-center"
            style={{ border: '1px solid rgba(255,255,255,0.45)', backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.07)' }}
          >
            {t('cta_cardapio')}
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-60">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  )
}

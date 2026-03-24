'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useSiteContent } from '@/lib/useSiteContent'

type HeroData = {
  video_desktop_1?: string
  video_desktop_2?: string
  video_desktop_3?: string
  video_mobile?: string
  video_mobile_2?: string
  [key: string]: string | undefined
}

/* ─────────────────────────────────────────────────────────────
   VideoSlot
   - src travada no primeiro valor não-vazio (evita re-render)
   - autoPlay + muted + playsInline no elemento já garante
     que o browser inicia o vídeo sem precisar de .play()
   - onReady dispara quando o primeiro frame estiver disponível
     (evento 'loadeddata'), revelando os vídeos imediatamente
───────────────────────────────────────────────────────────── */
function VideoSlot({
  src,
  onReady,
}: {
  src: string
  onReady?: () => void
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const firedRef = useRef(false)

  const lockedSrc = useRef<string>('')
  if (src && !lockedSrc.current) {
    lockedSrc.current = src
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const fire = () => {
      if (!firedRef.current) {
        firedRef.current = true
        onReady?.()
      }
    }

    // Revela assim que o primeiro frame estiver pronto
    el.addEventListener('loadeddata', fire, { once: true })
    // Fallback: se já carregou antes do listener
    if (el.readyState >= 2) fire()

    // Pausa quando fora da viewport (economiza bateria)
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold: 0.05 }
    )
    obs.observe(el)

    return () => {
      el.removeEventListener('loadeddata', fire)
      obs.disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
   Desktop e mobile: sempre 2 vídeos lado a lado.
   Usa video_desktop_1 e video_desktop_2 (ou video_mobile
   e video_mobile_2 se definidos separadamente).
───────────────────────────────────────────────────────────── */
export function HeroSection() {
  const t = useTranslations('home')
  const locale = useLocale()
  const [videoReady, setVideoReady] = useState(false)

  // Fallback de segurança: se loadeddata não disparar em 1s,
  // revela de qualquer jeito para não travar a tela de loading
  useEffect(() => {
    const timer = setTimeout(() => setVideoReady(true), 1000)
    return () => clearTimeout(timer)
  }, [])

  const raw = useSiteContent<HeroData>('hero', {})
  const data = raw ?? {}

  const src1 = data.video_desktop_1 ?? ''
  const src2 = data.video_desktop_2 ?? data.video_desktop_3 ?? ''

  const handleReady = useCallback(() => {
    setVideoReady(true)
  }, [])

  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ height: '100dvh' }}
    >
      {/* Capa de loading — some assim que o vídeo tiver o primeiro frame */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg,#001432 0%,#002451 50%,#0a1a35 100%)',
          opacity: videoReady ? 0 : 1,
          transition: 'opacity 0.5s ease',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(rgba(212,168,67,0.06) 1px,transparent 1px)',
          backgroundSize: '28px 28px',
        }} />
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage:
            'radial-gradient(ellipse at 20% 50%,rgba(0,116,191,0.25) 0%,transparent 55%),' +
            'radial-gradient(ellipse at 80% 50%,rgba(0,116,191,0.25) 0%,transparent 55%)',
        }} />
      </div>

      {/* 2 vídeos lado a lado — desktop e mobile */}
      <div
        className="absolute inset-0 z-0"
        style={{
          display: 'flex',
          opacity: videoReady ? 1 : 0,
          transition: 'opacity 0.5s ease',
        }}
      >
        <div style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
          <VideoSlot src={src1} onReady={handleReady} />
        </div>
        <div style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
          <VideoSlot src={src2} />
        </div>
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

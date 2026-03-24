'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useSiteContent } from '@/lib/useSiteContent'

type HeroData = {
  video_desktop_1?: string
  video_desktop_2?: string
  [key: string]: string | undefined
}

/* ── URLs hardcoded — browser começa download ANTES de qualquer fetch ── */
const DEFAULT_SRC1 = 'https://res.cloudinary.com/djhevgyvi/video/upload/v1774204726/BANNER_LENTO_1_idcad3.mp4'
const DEFAULT_SRC2 = 'https://res.cloudinary.com/djhevgyvi/video/upload/v1774204724/BANNER_LENTO_2_uzz8l5.mp4'

/* ─────────────────────────────────────────────────────────────
   VideoSlot — <video> existe no DOM imediatamente com src fixa.
   autoPlay + muted + playsInline = browser toca sem .play()
   onReady dispara em canplay (mais rápido que loadeddata)
───────────────────────────────────────────────────────────── */
function VideoSlot({ src, onReady }: { src: string; onReady?: () => void }) {
  const ref      = useRef<HTMLVideoElement>(null)
  const firedRef = useRef(false)

  const fire = useCallback(() => {
    if (!firedRef.current) { firedRef.current = true; onReady?.() }
  }, [onReady])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener('canplay',    fire, { once: true })
    el.addEventListener('loadeddata', fire, { once: true })
    if (el.readyState >= 3) fire()
    return () => {
      el.removeEventListener('canplay',    fire)
      el.removeEventListener('loadeddata', fire)
    }
  }, [fire])

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      style={{
        width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center',
        filter: 'brightness(0.55)', display: 'block',
      }}
    />
  )
}

/* ─────────────────────────────────────────────────────────────
   HeroSection
   Lógica de carregamento:
   1. src1/src2 começam com DEFAULT (hardcoded) — browser baixa imediatamente
   2. Quando useSiteContent retorna, atualiza para a URL do banco se diferente
   3. videoReady: false só enquanto o primeiro frame não chegou
   4. Fallback de 2s garante que a capa some mesmo em rede lenta
───────────────────────────────────────────────────────────── */
export function HeroSection() {
  const t      = useTranslations('home')
  const locale = useLocale()
  const [videoReady, setVideoReady] = useState(false)

  /* URLs do banco — iniciam com as defaults hardcoded */
  const raw  = useSiteContent<HeroData>('hero', {})
  const data = raw ?? {}
  const src1 = data.video_desktop_1 || DEFAULT_SRC1
  const src2 = data.video_desktop_2 || DEFAULT_SRC2

  /* Fallback: capa some em 2s mesmo sem canplay */
  useEffect(() => {
    const t = setTimeout(() => setVideoReady(true), 2000)
    return () => clearTimeout(t)
  }, [])

  const handleReady = useCallback(() => setVideoReady(true), [])

  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ height: '100dvh' }}
    >
      {/* Capa azul escura — some quando canplay dispara */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background: 'linear-gradient(135deg,#001432 0%,#002451 50%,#0a1a35 100%)',
          opacity: videoReady ? 0 : 1,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* 2 vídeos lado a lado — no DOM desde o primeiro render */}
      <div className="absolute inset-0 z-0" style={{ display: 'flex' }}>
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
            'linear-gradient(180deg,rgba(0,20,50,0.5) 0%,rgba(26,95,168,0.06) 38%,' +
            'rgba(26,95,168,0.06) 62%,rgba(0,20,50,0.65) 100%)',
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

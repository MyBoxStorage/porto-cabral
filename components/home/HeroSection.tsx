'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useSiteContent } from '@/lib/useSiteContent'

const VIDEO_FALLBACK = 'https://res.cloudinary.com/djhevgyvi/video/upload/v1774204726/BANNER_LENTO_1_idcad3.mp4'

type HeroData = {
  video_desktop_1?: string
  video_desktop_2?: string
  video_desktop_3?: string
  video_mobile?: string
  [key: string]: string | undefined
}

const HERO_FB: HeroData = {
  video_desktop_1: VIDEO_FALLBACK,
  video_desktop_2: '',
  video_desktop_3: '',
  video_mobile: VIDEO_FALLBACK,
}

/* ─────────────────────────────────────────────
   Hook: pausa/retoma video baseado em visibilidade
   Threshold baixo (0.1) para o hero que ocupa 100vh
───────────────────────────────────────────── */
function useVideoVisibility(threshold = 0.1) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {})
        else el.pause()
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return ref
}

/* ─────────────────────────────────────────────
   VideoItem — carrega apenas quando liberado pelo pai
   'unlocked' = pai ja carregou o video anterior
───────────────────────────────────────────── */
function VideoItem({
  src,
  eager = false,
  unlocked = true,
  onReady,
}: {
  src: string
  eager?: boolean
  unlocked?: boolean
  onReady?: () => void
}) {
  const ref = useVideoVisibility(0.1)
  const [preload, setPreload] = useState<string>(eager ? 'auto' : 'none')

  // Quando desbloqueado pelo pai, libera o preload
  useEffect(() => {
    if (unlocked && !eager) setPreload('metadata')
  }, [unlocked, eager])

  const handleCanPlay = useCallback(() => {
    onReady?.()
  }, [onReady])

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      // eager = autoPlay no HTML garante inicio imediato independente do observer
      autoPlay={eager}
      preload={preload}
      onCanPlay={handleCanPlay}
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

/* ─────────────────────────────────────────────
   HeroSection
───────────────────────────────────────────── */
export function HeroSection() {
  const t = useTranslations('home')
  const locale = useLocale()
  const [isMobile, setIsMobile] = useState(false)

  // Controle de sequenciamento: video 2 so carrega apos video 1 estar pronto
  // video 3 so carrega apos video 2 estar pronto
  // Fallback: desbloqueia apos 3s mesmo sem canplay (conexao lenta)
  const [v2Unlocked, setV2Unlocked] = useState(false)
  const [v3Unlocked, setV3Unlocked] = useState(false)

  useEffect(() => {
    const t2 = setTimeout(() => setV2Unlocked(true), 3000)
    const t3 = setTimeout(() => setV3Unlocked(true), 5000)
    return () => { clearTimeout(t2); clearTimeout(t3) }
  }, [])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const raw = useSiteContent<HeroData>('hero', HERO_FB)
  const hero: HeroData = { ...HERO_FB, ...raw }

  const d1  = hero.video_desktop_1 || VIDEO_FALLBACK
  const d2  = hero.video_desktop_2 || ''
  const d3  = hero.video_desktop_3 || ''
  const mob = hero.video_mobile    || VIDEO_FALLBACK

  const desktopVideos = [d1, d2, d3].filter(Boolean)

  return (
    <section
      className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ height: '100dvh' }}
    >
      {/* Camada de vídeo */}
      <div className="absolute inset-0 z-0">
        {isMobile ? (
          <VideoItem src={mob} eager />
        ) : (
          <div style={{ display: 'flex', width: '100%', height: '100%' }}>
            {desktopVideos.map((src, i) => (
              <div key={i} style={{ flex: 1, height: '100%', overflow: 'hidden' }}>
                {i === 0 && (
                  <VideoItem
                    src={src}
                    eager
                    unlocked
                    onReady={() => setV2Unlocked(true)}
                  />
                )}
                {i === 1 && (
                  <VideoItem
                    src={src}
                    unlocked={v2Unlocked}
                    onReady={() => setV3Unlocked(true)}
                  />
                )}
                {i === 2 && (
                  <VideoItem
                    src={src}
                    unlocked={v3Unlocked}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 z-10"
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
          style={{
            fontSize: 'clamp(2.8rem,7vw,5.5rem)',
            textShadow: '0 4px 32px rgba(0,0,0,0.6)',
          }}
        >
          {t('hero_tagline')
            .split('\n')
            .map((line, i) => (
              <span key={i}>
                {line}
                {i === 0 && <br />}
              </span>
            ))}
        </h1>
        <div
          className="flex items-center justify-center gap-3 mb-8 mx-auto"
          style={{ maxWidth: 220 }}
        >
          <span
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(90deg,transparent,rgba(212,168,67,0.55))' }}
          />
          <span
            className="font-display text-pc-gold"
            style={{ fontSize: '0.9rem', letterSpacing: '0.2em' }}
          >
            ✦
          </span>
          <span
            className="flex-1 h-px"
            style={{ background: 'linear-gradient(90deg,rgba(212,168,67,0.55),transparent)' }}
          />
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
            style={{
              border: '1px solid rgba(255,255,255,0.45)',
              backdropFilter: 'blur(8px)',
              background: 'rgba(255,255,255,0.07)',
            }}
          >
            {t('cta_cardapio')}
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-60">
        <svg
          width="28" height="28" viewBox="0 0 24 24"
          fill="none" stroke="currentColor"
          strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          className="text-white"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  )
}

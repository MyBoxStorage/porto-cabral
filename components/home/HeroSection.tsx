'use client'
import { useEffect, useRef, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

const VIDEOS = [
  'https://res.cloudinary.com/djhevgyvi/video/upload/v1774204726/BANNER_LENTO_1_idcad3.mp4',
  'https://res.cloudinary.com/djhevgyvi/video/upload/v1774204724/BANNER_LENTO_2_uzz8l5.mp4',
  'https://res.cloudinary.com/djhevgyvi/video/upload/v1774203528/video_banner_rapido_2_vio4zz.mp4',
]

const videoStyle: React.CSSProperties = {
  objectFit: 'cover',
  objectPosition: 'center',
  filter: 'brightness(0.5)',
}

function HeroVideos() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  const [secondaryReady, setSecondaryReady] = useState(false)
  const primaryRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)').matches
    setIsMobile(mobile)

    // No mobile: forçar preload=none no vídeo primário para reduzir consumo de memória.
    // autoPlay continua funcionando — o browser carrega apenas o suficiente para iniciar.
    if (mobile && primaryRef.current) {
      primaryRef.current.preload = 'none'
    }
  }, [])

  const handlePrimaryReady = () => {
    // Só carrega os vídeos secundários no desktop
    if (!isMobile) requestAnimationFrame(() => setSecondaryReady(true))
  }

  // Enquanto isMobile não foi determinado (SSR), renderizar apenas o painel primário
  // para evitar hydration mismatch e não montar os vídeos desnecessariamente
  return (
    <div className="absolute inset-0 z-0 flex">
      {/* Painel 1 — único vídeo no mobile, 1/3 no desktop */}
      <div className="relative w-full md:flex-1 overflow-hidden">
        <video
          ref={primaryRef}
          autoPlay muted loop playsInline
          // desktop: preload=auto para carregar logo; mobile: será sobrescrito para 'none' no useEffect
          preload="auto"
          className="absolute inset-0 w-full h-full"
          style={videoStyle}
          onCanPlayThrough={handlePrimaryReady}
        >
          <source src={VIDEOS[0]} type="video/mp4" />
        </video>
      </div>

      {/* Painéis 2 e 3 — NÃO montados no mobile (isMobile===true).
          No desktop (isMobile===false) são lazy: só carregam após o vídeo primário. */}
      {isMobile === false && VIDEOS.slice(1).map((src, idx) => (
        <div key={idx + 1} className="relative flex-1 overflow-hidden">
          <video muted loop playsInline preload="none"
            className="absolute inset-0 w-full h-full" style={videoStyle}
            ref={(el) => {
              if (!el || !secondaryReady) return
              el.load()
              el.play().catch(() => {})
            }}>
            <source src={src} type="video/mp4" />
          </video>
        </div>
      ))}
    </div>
  )
}

export function HeroSection() {
  const t = useTranslations('home')
  const locale = useLocale()

  return (
    <section className="relative w-full overflow-hidden flex items-center justify-center"
      style={{ height: '100dvh' }}>

      <HeroVideos />

      {/* Overlay */}
      <div className="absolute inset-0 z-10" style={{
        background: 'linear-gradient(180deg,rgba(0,20,50,0.5) 0%,rgba(26,95,168,0.06) 38%,rgba(26,95,168,0.06) 62%,rgba(0,20,50,0.65) 100%)',
      }} />

      {/* Conteúdo */}
      <div className="relative z-20 text-center px-4 sm:px-6 max-w-3xl mx-auto w-full">
        <p className="font-accent text-[10px] tracking-[0.5em] uppercase mb-6"
          style={{ color: 'rgba(212,168,67,0.8)' }}>
          {t('hero_eyebrow')}
        </p>
        <h1 className="font-display italic text-white leading-[1.05] mb-7"
          style={{ fontSize: 'clamp(2.8rem,7vw,5.5rem)', textShadow: '0 4px 32px rgba(0,0,0,0.6)' }}>
          {t('hero_tagline').split('\n').map((line, i) => (
            <span key={i}>{line}{i === 0 && <br />}</span>
          ))}
        </h1>
        <div className="flex items-center justify-center gap-3 mb-8 mx-auto" style={{ maxWidth: 220 }}>
          <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(212,168,67,0.55))' }} />
          <span className="font-display text-pc-gold" style={{ fontSize: '0.9rem', letterSpacing: '0.2em' }}>✦</span>
          <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,rgba(212,168,67,0.55),transparent)' }} />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-4 sm:px-0">
          <a href="#reserva"
            className="shimmer w-full sm:w-auto px-8 md:px-10 py-4 font-accent font-semibold text-xs tracking-[0.22em] uppercase text-pc-navy rounded shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-200 text-center min-h-[48px] flex items-center justify-center">
            {t('cta_reserva')}
          </a>
          <a href={`/${locale}/cardapio`}
            className="w-full sm:w-auto px-8 md:px-10 py-4 font-accent font-semibold text-xs tracking-[0.22em] uppercase text-white rounded transition-all duration-200 hover:bg-white/15 text-center min-h-[48px] flex items-center justify-center"
            style={{ border: '1px solid rgba(255,255,255,0.45)', backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.07)' }}>
            {t('cta_cardapio')}
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-60">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  )
}

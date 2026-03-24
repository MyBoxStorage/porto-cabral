'use client'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useSiteContent } from '@/lib/useSiteContent'
import { IconAncora, IconBussola } from '@/components/icons'
import { type HistoryData, HISTORY_FB } from '@/types/home'

type Locale = 'pt' | 'en' | 'es'

function localeField(obj: Record<string, unknown>, base: string, locale: Locale): string {
  return (obj[`${base}_${locale}`] ?? obj[`${base}_pt`] ?? '') as string
}

function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('visible'); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

type HistoryDataExtended = HistoryData & { bg_video_url?: string }

export function HistorySection() {
  const t = useTranslations('home')
  const locale = useLocale() as Locale
  const ref = useFadeUp()
  const videoRef = useRef<HTMLVideoElement>(null)
  const raw = useSiteContent<HistoryDataExtended>('history', HISTORY_FB)
  const data = (raw ?? HISTORY_FB) as HistoryDataExtended
  const d = (obj: Record<string, unknown>, base: string) => localeField(obj, base, locale)
  const bgVideo = data.bg_video_url || ''

  // Inicia o vídeo assim que o ref estiver pronto e pausa/retoma com visibilidade
  useEffect(() => {
    const el = videoRef.current
    if (!el || !bgVideo) return
    // Força play imediato (autoPlay nem sempre dispara em SSR/hydration)
    el.play().catch(() => {})
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
    <section className="relative pt-14 md:pt-20 pb-16 md:pb-32 px-4 md:px-12 overflow-hidden">
      {/* Vídeo de fundo — puxado do banco via painel admin */}
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
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 35%',
              filter: 'brightness(0.18) saturate(0.8)',
              zIndex: 0,
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(160deg, rgba(254,249,241,0.93) 0%, rgba(242,237,229,0.90) 50%, rgba(254,249,241,0.93) 100%)',
              zIndex: 1,
            }}
          />
        </>
      )}
      {!bgVideo && (
        <div style={{ position: 'absolute', inset: 0, background: 'var(--pc-surface-2, #f2ede5)', zIndex: 0 }} />
      )}
      <div ref={ref} className="fade-up relative max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-24" style={{ zIndex: 2 }}>

        {/* Imagem
            Mobile: largura total, ratio 4/3 (mais paisagem — menos espaço vertical)
            Desktop: 2/5 da largura, ratio 4/5 (mais retrato)
        */}
        <div className="w-full lg:w-2/5 flex-shrink-0 flex justify-center">
          <div
            className="relative rounded-2xl overflow-hidden w-full lg:max-w-[380px]"
            style={{
              aspectRatio: 'var(--hist-ratio, 4/3)',
              background: 'linear-gradient(135deg,#005fa3 0%,#0074bf 50%,#0087d9 100%)',
            }}
          >
            <style>{`
              @media (min-width: 1024px) {
                [style*="--hist-ratio"] { --hist-ratio: 4/5; }
              }
            `}</style>

            {data.image_url ? (
              <Image
                src={data.image_url}
                alt="Nossa História"
                fill
                className="object-cover"
                style={{ filter: 'brightness(0.85)' }}
                sizes="(max-width: 1024px) 100vw, 380px"
              />
            ) : (
              <>
                <div
                  className="absolute inset-0 opacity-[0.07]"
                  style={{
                    backgroundImage: 'radial-gradient(rgba(212,168,67,1) 1.5px,transparent 1.5px)',
                    backgroundSize: '28px 28px',
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-pc-gold/25">
                    <IconAncora size={160} strokeWidth={0.6} />
                  </span>
                </div>
              </>
            )}

            {/* Badge */}
            <div className="absolute bottom-4 left-4 right-4">
              <div
                className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg"
                style={{
                  background: 'rgba(0,10,30,0.7)',
                  border: '1px solid rgba(212,168,67,0.25)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <span className="text-pc-gold"><IconBussola size={16} strokeWidth={1.5} /></span>
                <div>
                  <p className="font-display italic text-white text-sm leading-tight">Molhe da Barra Sul</p>
                  <p className="font-accent text-[10px] tracking-[0.2em] uppercase text-pc-gold/70">Since 1998</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Texto */}
        <div className="w-full lg:w-1/2 space-y-5 md:space-y-7">
          <p className="eyebrow">{t('history_eyebrow')}</p>

          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-pc-navy leading-tight">
            {d(data as Record<string, unknown>, 'title').split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h2>

          <div className="w-10 h-[2px] bg-pc-gold" />

          <div className="space-y-4 text-pc-muted leading-relaxed text-sm md:text-base">
            <p>{d(data as Record<string, unknown>, 'p1')}</p>
            <p>{d(data as Record<string, unknown>, 'p2')}</p>
          </div>

          <blockquote className="border-l-[3px] border-pc-gold pl-5 md:pl-6 py-1">
            <p className="font-display italic text-lg md:text-xl text-pc-navy leading-snug mb-2 md:mb-3">
              &ldquo;{d(data as Record<string, unknown>, 'quote')}&rdquo;
            </p>
            <footer className="font-accent text-[10px] tracking-[0.25em] uppercase text-amber-800">
              {d(data as Record<string, unknown>, 'quote_author')}
            </footer>
          </blockquote>
        </div>

      </div>
    </section>
  )
}

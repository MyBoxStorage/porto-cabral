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
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

export function HistorySection() {
  const t = useTranslations('home')
  const locale = useLocale() as Locale
  const ref = useFadeUp()
  const data = useSiteContent<HistoryData>('history', HISTORY_FB) ?? HISTORY_FB
  const d = (obj: Record<string, unknown>, base: string) => localeField(obj, base, locale)

  return (
    <section className="pt-16 md:pt-20 pb-20 md:pb-32 px-4 md:px-12 overflow-hidden bg-pc-surface-2">
      <div ref={ref} className="fade-up max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

        {/* Imagem / placeholder */}
        <div className="w-full lg:w-2/5 flex-shrink-0 flex justify-center">
          <div className="relative rounded-2xl overflow-hidden w-full max-w-[280px] md:max-w-[380px]"
            style={{ aspectRatio: '4/5', background: 'linear-gradient(135deg,#0a1e3d 0%,#1a3a6b 50%,#0d2545 100%)' }}>
            {data.image_url ? (
              <Image src={data.image_url} alt="Nossa História" fill className="object-cover"
                style={{ filter: 'brightness(0.85)' }} sizes="(max-width: 768px) 100vw, 380px" />
            ) : (
              <>
                <div className="absolute inset-0 opacity-[0.07]"
                  style={{ backgroundImage: 'radial-gradient(rgba(212,168,67,1) 1.5px,transparent 1.5px)', backgroundSize: '28px 28px' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-pc-gold/25"><IconAncora size={220} strokeWidth={0.6} /></span>
                </div>
              </>
            )}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="inline-flex items-center gap-3 px-5 py-3 rounded-lg"
                style={{ background: 'rgba(0,10,30,0.7)', border: '1px solid rgba(212,168,67,0.25)', backdropFilter: 'blur(12px)' }}>
                <span className="text-pc-gold"><IconBussola size={18} strokeWidth={1.5} /></span>
                <div>
                  <p className="font-display italic text-white text-sm leading-tight">Molhe da Barra Sul</p>
                  <p className="font-accent text-[10px] tracking-[0.2em] uppercase text-pc-gold/70">Since 1998</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Texto */}
        <div className="w-full lg:w-1/2 space-y-7">
          <p className="eyebrow">{t('history_eyebrow')}</p>
          <h2 className="font-display text-4xl md:text-5xl text-pc-navy leading-tight">
            {d(data as Record<string, unknown>, 'title').split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h2>
          <div className="w-10 h-[2px] bg-pc-gold" />
          <div className="space-y-5 text-pc-muted leading-relaxed">
            <p>{d(data as Record<string, unknown>, 'p1')}</p>
            <p>{d(data as Record<string, unknown>, 'p2')}</p>
          </div>
          <blockquote className="border-l-[3px] border-pc-gold pl-6 py-1">
            <p className="font-display italic text-xl text-pc-navy leading-snug mb-3">
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

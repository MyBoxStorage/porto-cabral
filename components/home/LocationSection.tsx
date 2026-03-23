'use client'
import { useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useSiteContent } from '@/lib/useSiteContent'
import { IconCarta } from '@/components/icons'
import { type LocationData, LOCATION_FB } from '@/types/home'

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

export function LocationSection() {
  const t = useTranslations('home')
  const locale = useLocale() as Locale
  const ref = useFadeUp()
  const data = useSiteContent<LocationData>('location', LOCATION_FB) ?? LOCATION_FB
  const d = (obj: Record<string, unknown>, base: string) => localeField(obj, base, locale)

  return (
    <section className="py-28 px-6 md:px-12 bg-pc-surface">
      <div ref={ref} className="fade-up max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-14">

        {/* Google Maps embed — Molhe da Barra Sul */}
        <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden relative shadow-2xl"
          style={{ aspectRatio: '16/9' }}>
          <iframe
            title="Porto Cabral BC — Molhe da Barra Sul"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3543.6!2d-48.6368!3d-26.9982!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94d8e5b1b1b1b1b1%3A0x0!2sMolhe+da+Barra+Sul%2C+Balne%C3%A1rio+Cambori%C3%BA!5e0!3m2!1spt!2sbr!4v1700000000000!5m2!1spt!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full"
          />
          {/* Badge de identidade sobre o mapa */}
          <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
              style={{ background: 'rgba(0,10,30,0.82)', border: '1px solid rgba(212,168,67,0.3)', backdropFilter: 'blur(10px)' }}>
              <span className="text-pc-gold text-xs">⚓</span>
              <div>
                <p className="font-display italic text-white text-xs leading-tight">Porto Cabral BC</p>
                <p className="font-accent text-[9px] tracking-[0.2em] uppercase text-pc-gold/70">Molhe da Barra Sul</p>
              </div>
            </div>
          </div>
        </div>

        {/* Texto */}
        <div className="w-full lg:w-1/2 space-y-6">
          <p className="eyebrow">{d(data as Record<string, unknown>, 'eyebrow')}</p>
          <div className="flex items-start gap-3">
            <span className="text-pc-gold mt-1 flex-shrink-0"><IconCarta size={24} strokeWidth={1.4} /></span>
            <h3 className="font-display text-4xl text-pc-navy leading-tight">
              {d(data as Record<string, unknown>, 'title').split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h3>
          </div>
          <div className="w-10 h-[2px] bg-pc-gold" />
          <p className="text-pc-muted leading-relaxed">{d(data as Record<string, unknown>, 'desc')}</p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a href={data.maps_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-accent text-xs tracking-[0.18em] uppercase text-white px-7 py-3 rounded transition-all duration-200 hover:bg-pc-navy-deep bg-pc-navy">
              {t('location_maps')}
              <span>→</span>
            </a>
            <a href="#reserva"
              className="inline-flex items-center gap-2 font-accent text-xs tracking-[0.18em] uppercase text-pc-navy px-7 py-3 rounded transition-all duration-200 border border-pc-navy">
              {t('cta_reserva')}
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}

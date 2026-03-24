'use client'
import { useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ReservationForm } from '@/components/home/ReservationForm'
import { IconAncora } from '@/components/icons'
import { useSiteContent } from '@/lib/useSiteContent'

type ReservaData = {
  bg_image_url?: string
}

const RESERVA_FB: ReservaData = {
  bg_image_url: '',
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

export function ReservaSection() {
  const t = useTranslations('home')
  const ref = useFadeUp()
  const raw = useSiteContent<ReservaData>('reserva', RESERVA_FB)
  const data: ReservaData = { ...RESERVA_FB, ...raw }
  const bgImage = data.bg_image_url || ''

  return (
    <section
      id="reserva"
      className="relative overflow-hidden"
      style={{ background: bgImage ? undefined : 'var(--pc-surface-2, #f2ede5)' }}
    >
      {/* ── Foto de fundo (portrait) com overlay escuro ── */}
      {bgImage && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImage}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
          />
          {/* Overlay gradiente — garante legibilidade do formulário */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(105deg, rgba(0,20,50,0.75) 0%, rgba(0,36,81,0.65) 40%, rgba(0,20,50,0.55) 60%, rgba(0,10,30,0.45) 100%)',
            }}
          />
        </>
      )}

      {/* Âncora decorativa — apenas sem foto (não briga com overlay) */}
      {!bgImage && (
        <div className="absolute -left-12 bottom-0 pointer-events-none text-pc-navy/[0.04]">
          <IconAncora size={340} strokeWidth={0.4} />
        </div>
      )}

      {/* ── Layout principal ── */}
      <div
        ref={ref}
        className="fade-up relative z-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center min-h-0"
        style={{ minHeight: bgImage ? '100%' : undefined }}
      >

        {/* ── Lado esquerdo: espaço da foto com título sobreposto (desktop) ──
            No mobile isso fica oculto — o fundo já aparece atrás de tudo */}
        {bgImage && (
          <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-center py-16 px-12 relative">
            {/* Título flutuante sobre a foto */}
            <div className="space-y-4">
              <p
                className="font-accent uppercase tracking-[0.4em] text-[10px]"
                style={{ color: 'rgba(212,168,67,0.85)' }}
              >
                {t('reserva_eyebrow')}
              </p>
              <h2
                className="font-display italic text-white leading-tight"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
              >
                {t('reserva_title')}
              </h2>
              <p
                className="font-display italic text-lg"
                style={{ color: 'rgba(212,168,67,0.8)' }}
              >
                {t('reserva_sub')}
              </p>
              <div className="w-12 h-[2px]" style={{ background: 'rgba(212,168,67,0.6)' }} />
            </div>
          </div>
        )}

        {/* ── Lado direito (ou centro sem foto): formulário ── */}
        <div
          className={`
            relative z-10 w-full
            ${bgImage
              ? 'lg:w-7/12 xl:w-1/2 py-12 md:py-16 px-4 sm:px-6 lg:px-12'
              : 'max-w-4xl mx-auto py-16 md:py-28 px-4 md:px-6'
            }
          `}
        >
          {/* Cabeçalho — só aparece quando NÃO há foto, ou no mobile com foto */}
          <div className={`text-center mb-10 md:mb-14 ${bgImage ? 'lg:hidden' : ''}`}>
            <p className="eyebrow mb-3" style={bgImage ? { color: 'rgba(212,168,67,0.85)' } : {}}>
              {t('reserva_eyebrow')}
            </p>
            <h2
              className={`font-display text-3xl md:text-4xl md:text-5xl mb-3 ${bgImage ? 'text-white' : 'text-pc-navy'}`}
            >
              {t('reserva_title')}
            </h2>
            <p
              className="font-display italic text-lg"
              style={{ color: bgImage ? 'rgba(212,168,67,0.8)' : '#92400e' }}
            >
              {t('reserva_sub')}
            </p>
            <div
              className="w-16 h-[2px] mx-auto mt-5"
              style={{ background: bgImage ? 'rgba(212,168,67,0.6)' : 'var(--pc-gold)' }}
            />
          </div>

          {/* Formulário */}
          <ReservationForm />
        </div>
      </div>
    </section>
  )
}

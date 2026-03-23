'use client'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ReservationForm } from '@/components/home/ReservationForm'
import { IconAncora } from '@/components/icons'

/* Reutiliza o mesmo hook de fade-up sem duplicar a lógica */
import { useEffect } from 'react'

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

export function ReservaSection() {
  const t = useTranslations('home')
  const ref = useFadeUp()

  return (
    <section id="reserva" className="py-28 px-6 relative overflow-hidden bg-pc-surface-2">
      <div className="absolute -left-12 bottom-0 pointer-events-none text-pc-navy/[0.04]">
        <IconAncora size={340} strokeWidth={0.4} />
      </div>
      <div ref={ref} className="fade-up max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <p className="eyebrow mb-3">{t('reserva_eyebrow')}</p>
          <h2 className="font-display text-4xl md:text-5xl text-pc-navy mb-3">{t('reserva_title')}</h2>
          <p className="font-display italic text-amber-800 text-lg">{t('reserva_sub')}</p>
          <div className="w-16 h-[2px] bg-pc-gold mx-auto mt-5" />
        </div>
        <ReservationForm />
      </div>
    </section>
  )
}

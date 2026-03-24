'use client'
import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'

type Review = { author_name: string; text: string; rating: number }

const reviews: Review[] = [
  {
    author_name: 'Ricardo Alencastro',
    rating: 5,
    text: 'Uma experiência transcendental. O serviço é impecável e a lagosta grelhada foi a melhor que já comi. Ver o pôr do sol no deck é indispensável.',
  },
  {
    author_name: 'Ana Paula Costa',
    rating: 5,
    text: 'Ambiente único, flutuante sobre as águas de Balneário Camboriú. Frutos do mar fresquíssimos e atendimento de excelência.',
  },
  {
    author_name: 'Marco Vieira',
    rating: 5,
    text: 'Levei minha esposa no aniversário dela. Perfeito em todos os detalhes — a mesa com vista para o horizonte foi mágica.',
  },
]

const rating = 4.9
const INTERVAL_MS = 5000

export function Testimonials() {
  const t = useTranslations('testimonials')
  const [active, setActive] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((idx: number) => {
    if (idx === active) return
    setAnimating(true)
    setTimeout(() => {
      setActive(idx)
      setAnimating(false)
    }, 300)
  }, [active])

  useEffect(() => {
    const timer = setInterval(() => {
      goTo((active + 1) % reviews.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [active, goTo])

  const review = reviews[active]

  return (
    <section className="py-16 md:py-24 bg-pc-navy-deep relative overflow-hidden">
      {/* Pontilhado decorativo */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px,transparent 1px)', backgroundSize: '20px 20px' }}
      />

      <div className="max-w-3xl mx-auto px-5 sm:px-6 relative z-10 text-center">
        {/* Estrelas + rating */}
        <div className="flex justify-center gap-1 mb-3 text-pc-gold text-lg md:text-xl">{'★★★★★'}</div>
        <p className="text-pc-gold font-accent text-xs uppercase tracking-widest mb-2">{rating} / 5</p>
        <h2 className="text-white font-display text-2xl md:text-3xl mb-8 md:mb-10">{t('title')}</h2>

        {/* Card do depoimento
            min-h maior no mobile para acomodar textos longos sem pular de tamanho */}
        <div className="relative min-h-[260px] sm:min-h-[220px] flex items-center">
          <div
            className="w-full bg-white/[0.06] backdrop-blur-md px-5 py-7 sm:p-6 md:p-10 rounded-2xl border border-white/10 shadow-2xl transition-opacity duration-300"
            style={{ opacity: animating ? 0 : 1 }}
          >
            {/* Texto do depoimento — tamanho controlado no mobile */}
            <p className="text-base sm:text-xl md:text-2xl text-slate-200 font-light leading-relaxed mb-6 md:mb-8 italic">
              &ldquo;{review.text}&rdquo;
            </p>

            <div className="flex items-center justify-center gap-3 md:gap-4">
              {/* Avatar */}
              <div
                className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-white font-bold text-base md:text-lg flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, var(--pc-navy) 0%, var(--pc-gold) 100%)' }}
              >
                {review.author_name[0]}
              </div>
              <div className="text-left">
                <span className="block text-white font-bold text-sm md:text-base">{review.author_name}</span>
                <span className="text-pc-gold text-xs font-accent uppercase tracking-tighter">{t('source')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Indicadores de navegação — área de toque 44×44px */}
        <div className="flex justify-center gap-1 mt-6 md:mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Depoimento ${i + 1}`}
              className="flex items-center justify-center transition-all duration-300"
              style={{ width: 44, height: 44 }}
            >
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: i === active ? '28px' : '8px',
                  height: '8px',
                  background: i === active ? 'var(--pc-gold)' : 'rgba(255,255,255,0.25)',
                }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

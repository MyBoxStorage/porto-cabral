'use client'
import { useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useSiteContent } from '@/lib/useSiteContent'
import { type DishesData, DISHES_FB } from '@/types/home'

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
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          el.querySelectorAll<HTMLElement>('.card-fade').forEach((card) => {
            card.classList.add('visible')
          })
          obs.disconnect()
        }
      },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return ref
}

export function DishesSection() {
  const t = useTranslations('home')
  const locale = useLocale() as Locale
  const ref = useFadeUp()

  const raw = useSiteContent<DishesData>('dishes', DISHES_FB)
  const data: DishesData = {
    ...DISHES_FB,
    ...raw,
    items: raw?.items?.length ? raw.items : DISHES_FB.items,
  }

  const d = (obj: Record<string, unknown>, base: string) => localeField(obj, base, locale)

  return (
    <section className="pt-14 md:pt-28 pb-10 md:pb-16 px-4 md:px-12 bg-pc-surface overflow-x-hidden">
      <div ref={ref} className="fade-up max-w-7xl mx-auto">

        {/* Cabeçalho */}
        <div className="text-center mb-10 md:mb-16">
          <p className="eyebrow mb-3">{t('dishes_eyebrow')}</p>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-pc-navy mb-5">
            {d(data as Record<string, unknown>, 'section_title')}
          </h2>
          <div className="w-16 h-[2px] bg-pc-gold mx-auto" />
        </div>

        {/* Grid de cards
            Mobile: 2 colunas lado a lado para aproveitar a tela
            Tablet: 2 colunas
            Desktop: 3 colunas
        */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {data.items.map((dish, i) => (
            <div
              key={i}
              className={`card-fade fade-up delay-${i + 1} card-lift group relative overflow-hidden rounded-xl bg-[#1a4a7a]`}
              style={{
                /* Mobile: ratio 3/4 (menos alto que 4/5) — cabe melhor em 2 colunas */
                aspectRatio: 'var(--dish-ratio, 3/4)',
              }}
            >
              <style>{`
                @media (min-width: 768px) {
                  [style*="--dish-ratio"] { --dish-ratio: 4/5; }
                }
              `}</style>

              {dish.image_url ? (
                <img
                  src={dish.image_url}
                  alt={d(dish as Record<string, unknown>, 'title')}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  style={{ filter: 'brightness(0.55)' }}
                />
              ) : (
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'radial-gradient(rgba(212,168,67,0.6) 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                  }}
                />
              )}

              {/* Gradiente de fundo */}
              <div className="absolute inset-0 bg-gradient-to-t from-pc-navy-deep via-pc-navy-deep/30 to-transparent z-10" />

              {/* Borda dourada esquerda no hover */}
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-pc-gold/50 to-transparent z-20
                scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center" />

              {/* Conteúdo */}
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-3 sm:p-5 md:p-8">
                {/* Número decorativo — menor no mobile */}
                <span className="font-accent text-pc-gold/30 text-2xl sm:text-4xl md:text-5xl font-bold leading-none mb-1 sm:mb-2 md:mb-3 select-none">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Título — escala fluida */}
                <h4 className="font-display italic text-base sm:text-xl md:text-2xl text-pc-gold mb-1 sm:mb-2 leading-tight">
                  {d(dish as Record<string, unknown>, 'title')}
                </h4>

                {/* Descrição — oculta no mobile muito pequeno, visível a partir de sm */}
                <p className="hidden sm:block text-xs sm:text-sm text-slate-300/80 font-light leading-relaxed line-clamp-2 md:line-clamp-none">
                  {d(dish as Record<string, unknown>, 'desc')}
                </p>

                {/* CTA hover — só desktop */}
                <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                  <a
                    href={`/${locale}/cardapio`}
                    className="font-accent text-[10px] tracking-[0.2em] uppercase text-pc-gold flex items-center gap-2"
                  >
                    {t('dish_cta')}
                    <span className="text-base leading-none">→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA mobile para o cardápio — substitui o hover que não existe no touch */}
        <div className="md:hidden text-center mt-8">
          <a
            href={`/${locale}/cardapio`}
            className="inline-flex items-center gap-2 font-accent text-xs tracking-[0.2em] uppercase text-pc-navy border border-pc-navy px-6 py-3 rounded transition-all duration-200 active:scale-95"
          >
            {t('dish_cta')}
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

'use client'
import { useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useSiteContent } from '@/lib/useSiteContent'
import { ReservationForm } from '@/components/home/ReservationForm'
import { Testimonials } from '@/components/home/Testimonials'
import {
  IconAncora, IconOnda, IconHorizonte,
  IconTridente, IconBussola, IconCarta,
} from '@/components/icons'

/* Fade-up on scroll */
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

const VIDEOS = [
  'https://res.cloudinary.com/djhevgyvi/video/upload/v1774204726/BANNER_LENTO_1_idcad3.mp4',
  'https://res.cloudinary.com/djhevgyvi/video/upload/v1774204724/BANNER_LENTO_2_uzz8l5.mp4',
  'https://res.cloudinary.com/djhevgyvi/video/upload/v1774203528/video_banner_rapido_2_vio4zz.mp4',
]

const PILLAR_ICONS = [IconOnda, IconHorizonte, IconTridente]

// Fallbacks tipados
type DishItem    = { title_pt:string; title_en:string; title_es:string; desc_pt:string; desc_en:string; desc_es:string; image_url?:string }
type PillarItem  = { title_pt:string; title_en:string; title_es:string; desc_pt:string; desc_en:string; desc_es:string }
type DishesData  = { section_title_pt:string; section_title_en:string; section_title_es:string; items: DishItem[] }
type PillarsData = { title_pt:string; title_en:string; title_es:string; eyebrow_pt:string; eyebrow_en:string; eyebrow_es:string; items: PillarItem[] }
type HistoryData = { title_pt:string; title_en:string; title_es:string; p1_pt:string; p1_en:string; p1_es:string; p2_pt:string; p2_en:string; p2_es:string; quote_pt:string; quote_en:string; quote_es:string; quote_author_pt:string; quote_author_en:string; quote_author_es:string }
type LocationData= { title_pt:string; title_en:string; title_es:string; eyebrow_pt:string; eyebrow_en:string; eyebrow_es:string; desc_pt:string; desc_en:string; desc_es:string; maps_url:string }

const DISHES_FB: DishesData = { section_title_pt:'Iguarias do Mar', section_title_en:'Treasures of the Sea', section_title_es:'Delicias del Mar', items:[
  {title_pt:'Capitão Cabral',title_en:'Capitão Cabral',title_es:'Capitão Cabral',desc_pt:'Polvo à moda da casa, arroz cremoso de limão siciliano e batata sauté.',desc_en:'Octopus in our signature style, creamy lemon risotto and sautéed potatoes.',desc_es:'Pulpo al estilo de la casa, arroz cremoso de limón y papas salteadas.',image_url:''},
  {title_pt:'Paella do Porto',title_en:'Porto Paella',title_es:'Paella del Porto',desc_pt:'Prato típico com arroz, marisco, lula, polvo e camarão.',desc_en:'Traditional dish with rice, seafood, squid, octopus and shrimp.',desc_es:'Plato típico con arroz, marisco, calamar, pulpo y camarones.',image_url:''},
  {title_pt:'King Crab',title_en:'King Crab',title_es:'King Crab',desc_pt:'King crab inteiro com molhos especiais. Chef indica.',desc_en:'Whole king crab with special sauces. Chef recommends.',desc_es:'King crab entero con salsas especiales. El chef recomienda.',image_url:''},
  {title_pt:'Tábua de Frios',title_en:'Charcuterie Board',title_es:'Tabla de Embutidos',desc_pt:'Parma, presunto, salaminho, queijos, frutas, pães e geleia de pimenta.',desc_en:'Prosciutto, ham, salami, cheeses, fruits, breads and pepper jelly.',desc_es:'Jamón, embutidos, quesos, frutas, panes y mermelada de pimienta.',image_url:''},
  {title_pt:'Tartare de Atum e Salmão',title_en:'Tuna & Salmon Tartare',title_es:'Tartare de Atún y Salmón',desc_pt:'Base de abacate, cream cheese, crispy de alho-poró e chips de batata doce.',desc_en:'Avocado base, cream cheese, crispy leek and sweet potato chips.',desc_es:'Base de aguacate, queso crema, crujiente de puerro y chips de batata.',image_url:''},
  {title_pt:'Camarão à Romana',title_en:'Roman-style Shrimp',title_es:'Camarones a la Romana',desc_pt:'Empanados com queijo parmesão. Uma entrada clássica do Porto.',desc_en:'Breaded with parmesan cheese. A classic Porto starter.',desc_es:'Empanados con queso parmesano. Una entrada clásica del Porto.',image_url:''},
]}
const PILLARS_FB: PillarsData = { title_pt:'Três razões para vir', title_en:'Three reasons to visit', title_es:'Tres razones para venir', eyebrow_pt:'A Experiência Completa', eyebrow_en:'The Complete Experience', eyebrow_es:'La Experiencia Completa', items:[
  {title_pt:'Sobre o Mar',title_en:'Over the Sea',title_es:'Sobre el Mar',desc_pt:'Sinta a brisa do oceano e o balanço suave sobre as águas da Barra Sul.',desc_en:'Feel the ocean breeze over the waters.',desc_es:'Siente la brisa del océano.'},
  {title_pt:'Melhor Sunset',title_en:'Best Sunset',title_es:'Mejor Atardecer',desc_pt:'O pôr do sol mais icônico de Balneário Camboriú.',desc_en:'The most iconic sunset in Balneário Camboriú.',desc_es:'El atardecer más icónico.'},
  {title_pt:'Alta Gastronomia',title_en:'Fine Dining',title_es:'Alta Gastronomía',desc_pt:'Ingredientes frescos do oceano e técnicas contemporâneas.',desc_en:'Fresh ocean ingredients and contemporary techniques.',desc_es:'Ingredientes frescos del océano.'},
]}
const HISTORY_FB: HistoryData = { title_pt:'Nossa História:\nO Legado dos Mares', title_en:'Our Story:\nThe Legacy of the Seas', title_es:'Nuestra Historia:\nEl Legado de los Mares', p1_pt:'Fundado por Edson Cabral, o Porto Cabral BC nasceu de uma paixão visceral pelo mar e pela hospitalidade.', p1_en:'Founded by Edson Cabral, Porto Cabral BC was born from a visceral passion for the sea.', p1_es:'Fundado por Edson Cabral, Porto Cabral BC nació de una pasión visceral por el mar.', p2_pt:'Cada detalhe foi pensado para proporcionar uma imersão total no luxo náutico.', p2_en:'Every detail was designed to provide a total immersion in nautical luxury.', p2_es:'Cada detalle fue pensado para proporcionar una inmersión total en el lujo náutico.', quote_pt:'O Porto Cabral não é apenas um restaurante, é o meu convite pessoal.', quote_en:'Porto Cabral is not just a restaurant, it is my personal invitation.', quote_es:'Porto Cabral no es solo un restaurante, es mi invitación personal.', quote_author_pt:'— Edson Cabral, Fundador', quote_author_en:'— Edson Cabral, Founder', quote_author_es:'— Edson Cabral, Fundador' }
const LOCATION_FB: LocationData = { title_pt:'Localização\nPrivilegiada', title_en:'Prime\nLocation', title_es:'Ubicación\nPrivilegiada', eyebrow_pt:'Como nos encontrar', eyebrow_en:'How to find us', eyebrow_es:'Cómo encontrarnos', desc_pt:'No Molhe da Barra Sul — o ponto mais exclusivo de Balneário Camboriú.', desc_en:'At the Molhe da Barra Sul — the most exclusive point.', desc_es:'En el Molhe da Barra Sul — el punto más exclusivo.', maps_url:'https://maps.google.com/?q=-26.9982,-48.6358' }

export default function HomePage() {
  const t = useTranslations('home')
  const locale = useLocale() as 'pt' | 'en' | 'es'
  const L = locale

  const secDishes   = useFadeUp()
  const secHistory  = useFadeUp()
  const secPillars  = useFadeUp()
  const secLocation = useFadeUp()
  const secReserva  = useFadeUp()

  // Conteúdo dinâmico do banco — fallback para hardcode até carregar
  const dishesData  = useSiteContent<DishesData>('dishes', DISHES_FB)
  const pillarsData = useSiteContent<PillarsData>('pillars', PILLARS_FB)
  const historyData = useSiteContent<HistoryData>('history', HISTORY_FB)
  const locationData= useSiteContent<LocationData>('location', LOCATION_FB)

  // Helpers de locale
  const d = <K extends string>(obj: Record<string,unknown>, base: K) =>
    (obj[`${base}_${L}`] ?? obj[`${base}_pt`] ?? '') as string

  return (
    <main>
      {/* ══════════════════════════════════════════
          HERO
          ══════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden flex items-center justify-center"
        style={{ height: '100dvh' }}>

        {/* Vídeos */}
        <div className="absolute inset-0 z-0 flex">
          {VIDEOS.map((src, i) => (
            <div key={i} className="relative flex-1 overflow-hidden">
              <video autoPlay muted loop playsInline
                className="absolute inset-0 w-full h-full"
                style={{ objectFit: 'cover', objectPosition: 'center', filter: 'brightness(0.5)' }}>
                <source src={src} type="video/mp4" />
              </video>
            </div>
          ))}
        </div>

        {/* Overlay */}
        <div className="absolute inset-0 z-10" style={{
          background: 'linear-gradient(180deg,rgba(0,10,30,0.5) 0%,rgba(0,10,30,0.08) 38%,rgba(0,10,30,0.08) 62%,rgba(0,10,30,0.65) 100%)',
        }} />

        {/* Conteúdo */}
        <div className="relative z-20 text-center px-6 max-w-3xl mx-auto">
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
            <span className="font-display text-[#D4A843]" style={{ fontSize: '0.9rem', letterSpacing: '0.2em' }}>✦</span>
            <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,rgba(212,168,67,0.55),transparent)' }} />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="#reserva"
              className="shimmer px-10 py-4 font-accent font-semibold text-xs tracking-[0.22em] uppercase text-[#002451] rounded shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-200">
              {t('cta_reserva')}
            </a>
            <a href={`/${locale}/cardapio`}
              className="px-10 py-4 font-accent font-semibold text-xs tracking-[0.22em] uppercase text-white rounded transition-all duration-200 hover:bg-white/15"
              style={{ border: '1px solid rgba(255,255,255,0.45)', backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.07)' }}>
              {t('cta_cardapio')}
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-60">
          <IconOnda size={26} className="text-white" />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          IGUARIAS DO MAR
          ══════════════════════════════════════════ */}
      <section className="py-28 px-6 md:px-12 bg-[#fef9f1]">
        <div ref={secDishes} className="fade-up max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="eyebrow mb-3">{d(dishesData as Record<string,unknown>, 'section_title')}</p>
            <h2 className="font-display text-5xl md:text-6xl text-[#002451] mb-5">{d(dishesData as Record<string,unknown>, 'section_title')}</h2>
            <div className="w-16 h-[2px] bg-[#D4A843] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishesData.items.map((dish, i) => (
              <div key={i}
                className="card-lift group relative overflow-hidden rounded-xl bg-[#0d2040]"
                style={{ aspectRatio: '4/5' }}>
                {/* Foto de fundo quando disponível */}
                {dish.image_url ? (
                  <img src={dish.image_url} alt={d(dish as Record<string,unknown>, 'title')}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    style={{ filter: 'brightness(0.55)' }}/>
                ) : (
                  <div className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(rgba(212,168,67,0.6) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
                )}
                {/* Gradiente overlay sempre presente */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#001428] via-[#001428]/30 to-transparent z-10" />
                <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#D4A843]/50 to-transparent z-20
                  scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-center" />
                <div className="absolute inset-0 z-20 flex flex-col justify-end p-8">
                  <span className="font-accent text-[#D4A843]/30 text-5xl font-bold leading-none mb-3 select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h4 className="font-display italic text-2xl text-[#D4A843] mb-2 leading-tight">{d(dish as Record<string,unknown>, 'title')}</h4>
                  <p className="text-sm text-slate-300/80 font-light leading-relaxed">{d(dish as Record<string,unknown>, 'desc')}</p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a href={`/${locale}/cardapio`}
                      className="font-accent text-[10px] tracking-[0.2em] uppercase text-[#D4A843] flex items-center gap-2">
                      {t('dish_cta')}
                      <span className="text-base leading-none">→</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          NOSSA HISTÓRIA
          ══════════════════════════════════════════ */}
      <section className="py-32 px-6 md:px-12 overflow-hidden" style={{ background: '#f2ede5' }}>
        <div ref={secHistory} className="fade-up max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2 flex-shrink-0">
            <div className="relative rounded-2xl overflow-hidden"
              style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg,#0a1e3d 0%,#1a3a6b 50%,#0d2545 100%)' }}>
              <div className="absolute inset-0 opacity-[0.07]"
                style={{ backgroundImage: 'radial-gradient(rgba(212,168,67,1) 1.5px,transparent 1.5px)', backgroundSize: '28px 28px' }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[#D4A843]/25"><IconAncora size={220} strokeWidth={0.6} /></span>
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="inline-flex items-center gap-3 px-5 py-3 rounded-lg"
                  style={{ background: 'rgba(0,10,30,0.7)', border: '1px solid rgba(212,168,67,0.25)', backdropFilter: 'blur(12px)' }}>
                  <span className="text-[#D4A843]"><IconBussola size={18} strokeWidth={1.5} /></span>
                  <div>
                    <p className="font-display italic text-white text-sm leading-tight">Molhe da Barra Sul</p>
                    <p className="font-accent text-[10px] tracking-[0.2em] uppercase text-[#D4A843]/70">Since 1998</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-7">
            <p className="eyebrow">{t('history_eyebrow')}</p>
            <h2 className="font-display text-4xl md:text-5xl text-[#002451] leading-tight">
              {d(historyData as Record<string,unknown>, 'title').split('\n').map((line, i) => (
                <span key={i}>{line}{i === 0 && <br />}</span>
              ))}
            </h2>
            <div className="w-10 h-[2px] bg-[#D4A843]" />
            <div className="space-y-5 text-[#43474f] leading-relaxed">
              <p>{d(historyData as Record<string,unknown>, 'p1')}</p>
              <p>{d(historyData as Record<string,unknown>, 'p2')}</p>
            </div>
            <blockquote className="border-l-[3px] border-[#D4A843] pl-6 py-1">
              <p className="font-display italic text-xl text-[#002451] leading-snug mb-3">
                &ldquo;{d(historyData as Record<string,unknown>, 'quote')}&rdquo;
              </p>
              <footer className="font-accent text-[10px] tracking-[0.25em] uppercase text-[#795900]">
                {d(historyData as Record<string,unknown>, 'quote_author')}
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3 PILARES
          ══════════════════════════════════════════ */}
      <section className="py-28 px-6 md:px-12" style={{ background: '#002451' }}>
        <div ref={secPillars} className="fade-up max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-accent text-[10px] tracking-[0.4em] uppercase text-[#D4A843]/60 mb-3">
              {d(pillarsData as Record<string,unknown>, 'eyebrow')}
            </p>
            <h2 className="font-display italic text-4xl md:text-5xl text-white">{d(pillarsData as Record<string,unknown>, 'title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {pillarsData.items.map((pillar, i) => {
              const Icon = PILLAR_ICONS[i]
              return (
                <div key={i} className={`fade-up delay-${i + 1} group flex flex-col items-center text-center`}>
                  <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6 text-[#D4A843]
                    transition-all duration-500 group-hover:scale-110"
                    style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(212,168,67,0.25)', boxShadow:'0 0 0 0 rgba(212,168,67,0)' }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 0 6px rgba(212,168,67,0.12)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 0 0 rgba(212,168,67,0)')}>
                    <Icon size={34} strokeWidth={1.25} />
                  </div>
                  <p className="font-accent text-[10px] tracking-[0.3em] uppercase text-[#D4A843]/40 mb-2">{String(i+1).padStart(2,'0')}</p>
                  <h3 className="font-display text-2xl text-white mb-3">{d(pillar as Record<string,unknown>, 'title')}</h3>
                  <div className="w-8 h-px bg-[#D4A843]/40 mb-3" />
                  <p className="text-slate-400 leading-relaxed text-sm">{d(pillar as Record<string,unknown>, 'desc')}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          DEPOIMENTOS
          ══════════════════════════════════════════ */}
      <Testimonials />

      {/* ══════════════════════════════════════════
          LOCALIZAÇÃO
          ══════════════════════════════════════════ */}
      <section className="py-28 px-6 md:px-12 bg-[#fef9f1]">
        <div ref={secLocation} className="fade-up max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-14">
          <div className="w-full lg:w-1/2 rounded-2xl overflow-hidden relative"
            style={{ aspectRatio: '16/9', background: 'linear-gradient(135deg,#0a1e3d,#1a3a6b)' }}>
            <div className="absolute inset-0 opacity-[0.06]"
              style={{ backgroundImage: 'radial-gradient(rgba(212,168,67,1) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <span className="text-[#D4A843] animate-pulse"><IconBussola size={56} strokeWidth={1.25} /></span>
              <div className="text-center">
                <p className="font-display italic text-white text-xl">Porto Cabral BC</p>
                <p className="font-accent text-[10px] tracking-[0.3em] uppercase text-[#D4A843]/70 mt-1">Molhe da Barra Sul</p>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 space-y-6">
            <p className="eyebrow">{d(locationData as Record<string,unknown>, 'eyebrow')}</p>
            <div className="flex items-start gap-3">
              <span className="text-[#D4A843] mt-1 flex-shrink-0"><IconCarta size={24} strokeWidth={1.4} /></span>
              <h3 className="font-display text-4xl text-[#002451] leading-tight">
                {d(locationData as Record<string,unknown>, 'title').split('\n').map((line, i) => (
                  <span key={i}>{line}{i === 0 && <br />}</span>
                ))}
              </h3>
            </div>
            <div className="w-10 h-[2px] bg-[#D4A843]" />
            <p className="text-[#43474f] leading-relaxed">{d(locationData as Record<string,unknown>, 'desc')}</p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a href={locationData.maps_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-accent text-xs tracking-[0.18em] uppercase text-white px-7 py-3 rounded transition-all duration-200 hover:bg-[#1a3a6b]"
                style={{ background: '#002451' }}>
                {t('location_maps')}
                <span>→</span>
              </a>
              <a href="#reserva"
                className="inline-flex items-center gap-2 font-accent text-xs tracking-[0.18em] uppercase text-[#002451] px-7 py-3 rounded transition-all duration-200"
                style={{ border: '1px solid #002451' }}>
                {t('cta_reserva')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FORMULÁRIO DE RESERVA
          ══════════════════════════════════════════ */}
      <section id="reserva" className="py-28 px-6 relative overflow-hidden" style={{ background: '#f2ede5' }}>
        <div className="absolute -left-12 bottom-0 pointer-events-none text-[#002451]/[0.04]">
          <IconAncora size={340} strokeWidth={0.4} />
        </div>
        <div ref={secReserva} className="fade-up max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <p className="eyebrow mb-3">{t('reserva_eyebrow')}</p>
            <h2 className="font-display text-4xl md:text-5xl text-[#002451] mb-3">{t('reserva_title')}</h2>
            <p className="font-display italic text-[#795900] text-lg">{t('reserva_sub')}</p>
            <div className="w-16 h-[2px] bg-[#D4A843] mx-auto mt-5" />
          </div>
          <ReservationForm />
        </div>
      </section>
    </main>
  )
}

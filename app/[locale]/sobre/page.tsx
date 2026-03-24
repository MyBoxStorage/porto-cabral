'use client'
import Image from 'next/image'
import { useSiteContent } from '@/lib/useSiteContent'
import {
  IconAncora, IconOnda, IconHorizonte, IconLagosta,
  IconBussola, IconVela,
} from '@/components/icons'

type SobreData = {
  hero_eyebrow?: string
  hero_title?: string
  section_title?: string
  p1?: string
  p2?: string
  p3?: string
  quote?: string
  quote_author?: string
  image_url?: string
  feat_1_title?: string
  feat_1_desc?: string
  feat_2_title?: string
  feat_2_desc?: string
  feat_3_title?: string
  feat_3_desc?: string
}

const FB: SobreData = {
  hero_eyebrow:   'Since 1998',
  hero_title:     'Nossa História',
  section_title:  'O Legado dos Mares',
  p1: 'Fundado por Edson Cabral, o Porto Cabral BC nasceu de uma paixão visceral pelo mar e pela hospitalidade. O que começou como um pequeno píer familiar tornou-se o destino gastronômico mais emblemático da Barra Sul.',
  p2: 'Cada detalhe, da arquitetura que remete aos antigos galeões à curadoria dos vinhos, foi pensado para proporcionar uma imersão total no luxo náutico.',
  p3: 'Localizado no Molhe da Barra Sul, o Porto Cabral oferece a experiência única de jantar sobre as águas de Balneário Camboriú, com vista panorâmica para o skyline mais famoso do Brasil.',
  quote:        'O Porto Cabral não é apenas um restaurante, é o meu convite pessoal para que você sinta a alma de Balneário Camboriú.',
  quote_author: '— Edson Cabral, Fundador',
  image_url:    '',
  feat_1_title: 'Sobre o Mar',
  feat_1_desc:  'Única plataforma flutuante gastronômica de Balneário Camboriú.',
  feat_2_title: 'Melhor Sunset',
  feat_2_desc:  'Vista panorâmica inigualável para o pôr do sol da Barra Sul.',
  feat_3_title: 'Alta Gastronomia',
  feat_3_desc:  'Ingredientes frescos e técnicas contemporâneas que elevam o sabor do mar.',
}

const FEATURES = [
  {
    icon: <IconOnda size={32} strokeWidth={1.4} />,
    titleKey: 'feat_1_title' as const,
    descKey:  'feat_1_desc'  as const,
  },
  {
    icon: <IconHorizonte size={32} strokeWidth={1.4} />,
    titleKey: 'feat_2_title' as const,
    descKey:  'feat_2_desc'  as const,
  },
  {
    icon: <IconLagosta size={32} strokeWidth={1.4} />,
    titleKey: 'feat_3_title' as const,
    descKey:  'feat_3_desc'  as const,
  },
]

type PageBannersData = { sobre?: string; cardapio?: string; blog?: string }

export default function SobrePage() {
  const raw  = useSiteContent<SobreData>('sobre', FB)
  const data: SobreData = { ...FB, ...raw }
  const banners  = useSiteContent<PageBannersData>('page_banners', {})
  const bgImage  = banners?.sobre || ''

  return (
    <main className="min-h-screen bg-[#fef9f1] overflow-x-hidden">

      {/* ── Hero ── */}
      <section
        className="pt-[calc(72px+4rem)] pb-16 md:pt-[calc(72px+5rem)] md:pb-24 px-4 text-center relative overflow-hidden"
        style={{ background: bgImage ? undefined : '#0074bf' }}
      >
        {/* Foto de fundo do banner (definida no painel admin) */}
        {bgImage && (
          <>
            <img src={bgImage} alt="" aria-hidden="true" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(0,20,50,0.55) 0%,rgba(0,36,81,0.48) 100%)' }} />
          </>
        )}
        {!bgImage && (
          <>
            <div style={{ position:'absolute', inset:0, background:'#0074bf' }} />
            {/* pontilhado sutil — só sem foto */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,1) 1px,transparent 1px)', backgroundSize: '24px 24px' }} />
          </>
        )}
        <div className="relative z-10">
          <span className="font-accent text-[#D4A843] tracking-[0.3em] uppercase text-sm block mb-4">
            {data.hero_eyebrow}
          </span>
          <h1 className="font-display text-3xl md:text-6xl text-white mb-5">
            {data.hero_title}
          </h1>
          <div className="flex items-center justify-center gap-4 max-w-[220px] mx-auto">
            <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,transparent,rgba(212,168,67,0.6))' }} />
            <span className="text-[#D4A843]"><IconAncora size={18} strokeWidth={1.4} /></span>
            <span className="flex-1 h-px" style={{ background: 'linear-gradient(90deg,rgba(212,168,67,0.6),transparent)' }} />
          </div>
        </div>
      </section>

      {/* ── Conteúdo principal ── */}
      <section className="py-16 md:py-24 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10 md:gap-16 items-center">

          {/* Imagem ou placeholder com ícone */}
          <div className="w-full max-w-[320px] mx-auto lg:mx-0 lg:w-2/5 flex-shrink-0">
            <div className="relative rounded-2xl overflow-hidden w-full"
              style={{ aspectRatio: '4/5', background: 'linear-gradient(135deg,#005fa3 0%,#0074bf 60%,#0087d9 100%)' }}>
              {data.image_url ? (
                <Image src={data.image_url} alt="Nossa História" fill className="object-cover"
                  style={{ filter: 'brightness(0.88)' }} sizes="(max-width: 768px) 100vw, 320px" />
              ) : (
                <>
                  <div className="absolute inset-0 opacity-[0.06]"
                    style={{ backgroundImage: 'radial-gradient(rgba(212,168,67,1) 1.5px,transparent 1.5px)', backgroundSize: '24px 24px' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white/20"><IconVela size={180} strokeWidth={0.7} /></span>
                  </div>
                  {/* Badge sobreposto */}
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="inline-flex items-center gap-3 px-4 py-3 rounded-lg"
                      style={{ background: 'rgba(0,10,30,0.6)', border: '1px solid rgba(212,168,67,0.25)', backdropFilter: 'blur(10px)' }}>
                      <span className="text-[#D4A843]"><IconBussola size={16} strokeWidth={1.4} /></span>
                      <div>
                        <p className="font-display italic text-white text-xs leading-tight">Porto Cabral BC</p>
                        <p className="font-accent text-[9px] tracking-[0.2em] uppercase text-[#D4A843]/70">Since 1998</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Texto */}
          <div className="w-full lg:w-3/5 space-y-6">
            <p className="font-accent text-[0.6rem] tracking-[0.35em] uppercase text-[#795900]">Nossa História</p>
            <h2 className="font-display text-2xl md:text-4xl text-[#0074bf] leading-tight">
              {data.section_title}
            </h2>
            <div className="w-10 h-[2px] bg-[#D4A843]" />
            <div className="space-y-4 text-[#43474f] leading-relaxed text-[0.97rem]">
              <p>{data.p1}</p>
              <p>{data.p2}</p>
              <p>{data.p3}</p>
            </div>
          </div>
        </div>

        {/* ── Citação ── */}
        <blockquote className="mt-16 border-l-[3px] border-[#D4A843] pl-6 md:pl-8 py-4 bg-[#f2ede5] rounded-r-2xl">
          <p className="font-display text-xl md:text-2xl text-[#0074bf] italic mb-4 leading-snug">
            &ldquo;{data.quote}&rdquo;
          </p>
          <footer className="text-xs font-accent text-[#795900] uppercase tracking-widest">
            {data.quote_author}
          </footer>
        </blockquote>

        {/* ── Cards de destaque ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-16">
          {FEATURES.map((f) => (
            <div key={f.titleKey}
              className="text-center space-y-4 p-8 bg-white rounded-2xl shadow-sm border border-[#f2ede5] hover:border-[#D4A843]/30 hover:shadow-md transition-all group">
              <div className="flex justify-center text-[#0074bf] group-hover:text-[#D4A843] transition-colors">
                {f.icon}
              </div>
              <h3 className="font-display text-xl text-[#0074bf]">{data[f.titleKey]}</h3>
              <p className="text-[#43474f] text-sm leading-relaxed">{data[f.descKey]}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

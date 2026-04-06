'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useSiteContent } from '@/lib/useSiteContent'

type PageBannersData = { blog?: string; cardapio?: string; sobre?: string }

const posts = [
  {
    slug: 'experiencia-flutuante',
    title: 'A Experiência Flutuante de Jantar Sobre o Mar',
    date: '2026-03-10',
    category: 'Experiências',
    excerpt: 'Descubra como é jantar sobre as águas cristalinas da Barra Sul, com o pôr do sol tingindo o horizonte de dourado.',
    image: 'https://res.cloudinary.com/djhevgyvi/image/upload/v1774314820/EXPERIENCIA_lqnygf.jpg',
  },
  {
    slug: 'frutos-do-mar-frescos',
    title: 'Da Rede à Mesa: Nossos Frutos do Mar',
    date: '2026-02-28',
    category: 'Gastronomia',
    excerpt: 'Conheça os fornecedores locais que garantem que cada prato chegue à sua mesa com a máxima frescura e sabor.',
    image: 'https://res.cloudinary.com/djhevgyvi/image/upload/v1774314820/GASTRONOMIA_gspshf.jpg',
  },
  {
    slug: 'carta-de-vinhos-2025',
    title: 'Nova Carta de Vinhos 2025',
    date: '2026-02-14',
    category: 'Vinhos',
    excerpt: 'Nossa sommelière selecionou rótulos exclusivos de Portugal, França e Argentina para harmonizar perfeitamente com o menu.',
    image: 'https://res.cloudinary.com/djhevgyvi/image/upload/v1774314822/VINHOS_cfut07.jpg',
  },
]

export default function BlogPage() {
  const banners = useSiteContent<PageBannersData>('page_banners', {})
  const bgImage = banners?.blog || ''
  const params = useParams()
  const locale = (params?.locale as string) || 'pt'

  return (
    <main className="min-h-screen bg-[#fef9f1] overflow-x-hidden">
      {/* Hero */}
      <section
        className="relative pt-[calc(72px+4rem)] pb-16 md:pt-[calc(72px+5rem)] md:pb-24 px-4 text-center overflow-hidden"
        style={{ background: bgImage ? undefined : '#0074bf' }}
      >
        {bgImage && (
          <>
            <img src={bgImage} alt="" aria-hidden="true" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(0,20,50,0.55) 0%,rgba(0,36,81,0.48) 100%)' }} />
          </>
        )}
        {!bgImage && <div style={{ position:'absolute', inset:0, background:'#0074bf' }} />}
        <div className="relative z-10">
          <span className="font-accent text-[#D4A843] tracking-[0.3em] uppercase text-sm block mb-4">
            Histórias do Porto
          </span>
          <h1 className="font-display text-3xl md:text-6xl text-white mb-4">Blog</h1>
          <div className="w-24 h-1 bg-[#D4A843] mx-auto" />
        </div>
      </section>

      <section className="py-12 md:py-16 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.slug}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f2ede5] hover:border-[#D4A843]/30 hover:shadow-md transition-all group">
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6 space-y-3">
                <span className="text-xs font-accent text-[#795900] uppercase tracking-widest">
                  {post.category}
                </span>
                <h2 className="font-display text-xl text-[#0074bf] group-hover:text-[#005fa3] transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-[#43474f] text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex justify-between items-center pt-2">
                  <time className="text-xs text-slate-400">
                    {new Date(post.date).toLocaleDateString('pt-BR')}
                  </time>
                  <Link
                    href={`/${locale}/blog/${post.slug}`}
                    className="text-xs font-accent text-[#D4A843] hover:text-[#b8922e] tracking-widest uppercase transition-colors"
                  >
                    Ler Mais →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

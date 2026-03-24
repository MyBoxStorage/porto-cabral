import Image from 'next/image'

const posts = [
  {
    slug: 'experiencia-flutuante',
    title: 'A Experiência Flutuante de Jantar Sobre o Mar',
    date: '2025-03-10',
    category: 'Experiências',
    excerpt: 'Descubra como é jantar sobre as águas cristalinas da Barra Sul, com o pôr do sol tingindo o horizonte de dourado.',
    image: 'https://res.cloudinary.com/djhevgyvi/image/upload/v1774314820/EXPERIENCIA_lqnygf.jpg',
  },
  {
    slug: 'frutos-do-mar-frescos',
    title: 'Da Rede à Mesa: Nossos Frutos do Mar',
    date: '2025-02-28',
    category: 'Gastronomia',
    excerpt: 'Conheça os fornecedores locais que garantem que cada prato chegue à sua mesa com a máxima frescura e sabor.',
    image: 'https://res.cloudinary.com/djhevgyvi/image/upload/v1774314820/GASTRONOMIA_gspshf.jpg',
  },
  {
    slug: 'carta-de-vinhos-2025',
    title: 'Nova Carta de Vinhos 2025',
    date: '2025-02-14',
    category: 'Vinhos',
    excerpt: 'Nossa sommelière selecionou rótulos exclusivos de Portugal, França e Argentina para harmonizar perfeitamente com o menu.',
    image: 'https://res.cloudinary.com/djhevgyvi/image/upload/v1774314822/VINHOS_cfut07.jpg',
  },
]

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-[#fef9f1] overflow-x-hidden">
      {/* Hero — começa no topo absoluto (por baixo da navbar transparente) */}
      <section className="bg-[#0074bf] pt-[calc(72px+4rem)] pb-16 md:pt-[calc(72px+5rem)] md:pb-24 px-4 text-center">
        <span className="font-accent text-[#D4A843] tracking-[0.3em] uppercase text-sm block mb-4">
          Histórias do Porto
        </span>
        <h1 className="font-display text-3xl md:text-6xl text-white mb-4">Blog</h1>
        <div className="w-24 h-1 bg-[#D4A843] mx-auto" />
      </section>

      <section className="py-12 md:py-16 px-4 md:px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.slug}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f2ede5] hover:border-[#D4A843]/30 hover:shadow-md transition-all group cursor-pointer">
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
                  <span className="text-[#D4A843] text-sm font-accent uppercase tracking-wide hover:underline">
                    Ler mais →
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

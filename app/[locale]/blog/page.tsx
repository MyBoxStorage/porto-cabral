export default function BlogPage() {
  const posts = [
    { slug: 'experiencia-flutuante', title: 'A Experiência Flutuante de Jantar Sobre o Mar', date: '2025-03-10', category: 'Experiências', excerpt: 'Descubra como é jantar sobre as águas cristalinas da Barra Sul, com o pôr do sol tingindo o horizonte de dourado.' },
    { slug: 'frutos-do-mar-frescos',  title: 'Da Rede à Mesa: Nossos Frutos do Mar',        date: '2025-02-28', category: 'Gastronomia',  excerpt: 'Conheça os fornecedores locais que garantem que cada prato chegue à sua mesa com a máxima frescura e sabor.' },
    { slug: 'carta-de-vinhos-2025',   title: 'Nova Carta de Vinhos 2025',                    date: '2025-02-14', category: 'Vinhos',       excerpt: 'Nossa sommelière selecionou rótulos exclusivos de Portugal, França e Argentina para harmonizar perfeitamente com o menu.' },
  ]

  return (
    <main className="min-h-screen bg-[#fef9f1] pt-[72px] overflow-x-hidden">
      <section className="bg-[#002451] py-16 md:py-24 px-4 text-center">
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
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f2ede5] hover:border-[#D4A843]/30 hover:shadow-md transition-all group">
              <div className="bg-[#1a3a6b] h-48 flex items-center justify-center">
                <span className="text-[#D4A843] text-5xl">⚓</span>
              </div>
              <div className="p-6 space-y-3">
                <span className="text-xs font-accent text-[#795900] uppercase tracking-widest">{post.category}</span>
                <h2 className="font-display text-xl text-[#002451] group-hover:text-[#1a3a6b] transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-[#43474f] text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                <div className="flex justify-between items-center pt-2">
                  <time className="text-xs text-slate-400">{new Date(post.date).toLocaleDateString('pt-BR')}</time>
                  <span className="text-[#D4A843] text-sm font-accent uppercase tracking-wide hover:underline cursor-pointer">
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

export default function SobrePage() {
  return (
    <main className="min-h-screen bg-[#fef9f1] pt-[72px]">
      <section className="bg-[#002451] py-24 px-6 text-center">
        <span className="font-accent text-[#D4A843] tracking-[0.3em] uppercase text-sm block mb-4">Since 1998</span>
        <h1 className="font-display text-4xl md:text-6xl text-white mb-4">Nossa História</h1>
        <div className="w-24 h-1 bg-[#D4A843] mx-auto" />
      </section>

      <section className="py-24 px-6 max-w-4xl mx-auto space-y-12">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/3 bg-[#1a3a6b] rounded-xl h-64 flex items-center justify-center flex-shrink-0">
            <span className="text-[#D4A843] text-8xl">⚓</span>
          </div>
          <div className="space-y-6 text-[#43474f] leading-relaxed">
            <h2 className="font-display text-3xl text-[#002451]">O Legado dos Mares</h2>
            <p>Fundado por Edson Cabral, o Porto Cabral BC nasceu de uma paixão visceral pelo mar e pela hospitalidade. O que começou como um pequeno píer familiar tornou-se o destino gastronômico mais emblemático da Barra Sul.</p>
            <p>Cada detalhe, da arquitetura que remete aos antigos galeões à curadoria dos vinhos, foi pensado para proporcionar uma imersão total no luxo náutico.</p>
            <p>Localizado no Molhe da Barra Sul, o Porto Cabral oferece a experiência única de jantar sobre as águas de Balneário Camboriú, com vista panorâmica para o skyline mais famoso do Brasil.</p>
          </div>
        </div>

        <blockquote className="border-l-4 border-[#D4A843] pl-8 py-4 bg-[#f2ede5] rounded-r-xl">
          <p className="font-display text-2xl text-[#002451] italic mb-4">
            &ldquo;O Porto Cabral não é apenas um restaurante, é o meu convite pessoal para que você sinta a alma de Balneário Camboriú.&rdquo;
          </p>
          <footer className="text-sm font-accent text-[#795900] uppercase tracking-widest">
            — Edson Cabral, Fundador
          </footer>
        </blockquote>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
          {[
            { icon: '🌊', title: 'Sobre o Mar',      desc: 'Única plataforma flutuante gastronômica de Balneário Camboriú.' },
            { icon: '🌅', title: 'Melhor Sunset',    desc: 'Vista panorâmica inigualável para o pôr do sol da Barra Sul.' },
            { icon: '🦞', title: 'Alta Gastronomia', desc: 'Ingredientes frescos e técnicas contemporâneas que elevam o sabor do mar.' },
          ].map((item) => (
            <div key={item.title} className="text-center space-y-4 p-6 bg-white rounded-xl shadow-sm">
              <div className="text-4xl">{item.icon}</div>
              <h3 className="font-display text-xl text-[#002451]">{item.title}</h3>
              <p className="text-[#43474f] text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

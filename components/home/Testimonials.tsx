'use client'

type Review = { author_name?: string; text?: string; rating?: number }

const reviews: Review[] = [
  { author_name: 'Ricardo Alencastro', rating: 5, text: 'Uma experiência transcendental. O serviço é impecável e a lagosta grelhada foi a melhor que já comi. Ver o pôr do sol no deck é indispensável.' },
  { author_name: 'Ana Paula Costa', rating: 5, text: 'Ambiente único, flutuante sobre as águas de Balneário Camboriú. Frutos do mar fresquíssimos e atendimento de excelência.' },
  { author_name: 'Marco Vieira', rating: 5, text: 'Levei minha esposa no aniversário dela. Perfeito em todos os detalhes — a mesa com vista para o horizonte foi mágica.' },
]

const rating = 4.9

export function Testimonials() {
  const review = reviews[0]

  return (
    <section className="py-24 bg-[#1a3a6b] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#ffffff 1px,transparent 1px)', backgroundSize: '20px 20px' }} />
      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <div className="flex justify-center gap-1 mb-4 text-[#D4A843] text-xl">
          {'★★★★★'}
        </div>
        <p className="text-[#D4A843] font-accent text-sm uppercase tracking-widest mb-2">{rating} / 5</p>
        <h2 className="text-white font-display text-3xl mb-12">O que dizem nossos tripulantes</h2>
        <div className="bg-[#002451]/40 backdrop-blur-md p-10 rounded-2xl border border-white/10 shadow-2xl">
          <p className="text-xl md:text-2xl text-slate-200 font-light leading-relaxed mb-8 italic">
            &ldquo;{review?.text}&rdquo;
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-lg">
              {review?.author_name?.[0] ?? '?'}
            </div>
            <div className="text-left">
              <span className="block text-white font-bold">{review?.author_name}</span>
              <span className="text-[#D4A843] text-sm font-accent uppercase tracking-tighter">Google Review</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

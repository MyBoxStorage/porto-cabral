'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'

// ─── Conteúdo de cada post ──────────────────────────────────────────────────
const posts: Record<string, {
  title: string
  date: string
  category: string
  image: string
  body: { heading?: string; text: string }[]
}> = {
  'experiencia-flutuante': {
    title: 'A Experiência Flutuante de Jantar Sobre o Mar',
    date: '2025-03-10',
    category: 'Experiências',
    image: 'https://res.cloudinary.com/djhevgyvi/image/upload/v1774314820/EXPERIENCIA_lqnygf.jpg',
    body: [
      {
        text: 'Há algo de singular em sentar à mesa enquanto a água balança suavemente sob seus pés. No Porto Cabral, essa sensação não é um acidente — é o coração de tudo que fazemos. Nossa estrutura flutuante foi projetada para que cada mesa tenha vista direta para a Barra Sul, com o skyline de Balneário Camboriú recortado ao fundo e o reflexo dourado do entardecer na superfície do mar.',
      },
      {
        heading: 'Um cenário que começa antes de você sentar',
        text: 'A experiência começa já na chegada. O cais de madeira, levemente inclinado sobre a maré, cria aquele som inconfundível de prancha sobre água — um convite para desacelerar antes mesmo de conferir o cardápio. A decoração marítima respeita o ambiente sem forçar a temática: madeira escurecida pelo sal, luminárias de corda trançada e vegetação costeira nos vasos completam um cenário que parece surgir naturalmente do lugar.',
      },
      {
        heading: 'O pôr do sol como parte do menu',
        text: 'Entre 18h e 19h30, a luz do entardecer transforma a sala. O tom alaranjado que entra pelas janelas amplas confunde-se com a cor do salmão curado e do camarão ao alho — uma coincidência calculada pela nossa equipe de design. Para quem reserva antecipando esse momento, recomendamos a mesa da proa: posição privilegiada, ventilação natural e o barulho manso das ondas a poucos metros.',
      },
      {
        heading: 'Mais do que um jantar',
        text: 'Clientes frequentes contam que voltam não apenas pela comida, mas por algo difícil de nomear: a sensação de estar em duas dimensões ao mesmo tempo — dentro de um restaurante elegante e, simultaneamente, no meio da natureza. É esse contraste que define o Porto Cabral. Se você ainda não experimentou, a reserva pode ser feita diretamente pelo site. Se já conhece, sabe do que estamos falando.',
      },
    ],
  },

  'frutos-do-mar-frescos': {
    title: 'Da Rede à Mesa: Nossos Frutos do Mar',
    date: '2025-02-28',
    category: 'Gastronomia',
    image: 'https://res.cloudinary.com/djhevgyvi/image/upload/v1774314820/GASTRONOMIA_gspshf.jpg',
    body: [
      {
        text: 'A cadeia de fornecimento de um prato começa muito antes da cozinha. No Porto Cabral, essa cadeia começa ainda na madrugada, quando as embarcações de pequenos pescadores da região partem para os pesqueiros da costa catarinense. O que chega até nós poucas horas depois carrega frescura impossível de replicar em câmaras frias ou transporte refrigerado de longa distância.',
      },
      {
        heading: 'Parceiros que o cliente nunca vê, mas sempre sente',
        text: 'Trabalhamos com quatro famílias de pescadores artesanais da região da Barra Sul e do Taquarinhas. Eles entregam diretamente ao nosso cozinheiro-chefe três vezes por semana — pescado nobre variável conforme a safra, além de mariscos, lulas e camarões quando a temporada permite. Não existe lista fixa. O cardápio de frutos do mar do dia é literalmente ditado pelo que o mar ofereceu nas últimas 24 horas.',
      },
      {
        heading: 'Do tanque direto para a frigideira',
        text: 'Ostras e mexilhões chegam vivos em caixas refrigeradas e passam por processo de depuração antes de ir à cozinha. Esse detalhe, quase invisível para o cliente, é o que garante o sabor limpo e a textura firme que diferencia o produto fresco do produto que "parece fresco". Nossa equipe de cozinha faz a triagem na chegada e devolve qualquer item que não atinja o padrão estabelecido — a relação com os fornecedores é tão próxima que essa devolução raramente acontece, mas o protocolo existe.',
      },
      {
        heading: 'Sazonalidade como filosofia',
        text: 'Em certos meses, o camarão-rosa some do cardápio porque não é a sua temporada. Em outros, o linguado aparece em pratos que não existem no menu impresso. Esse ritmo pode surpreender clientes que procuram um prato específico — mas é exatamente ele que garante que cada visita ao Porto Cabral seja uma experiência diferente, honesta com o mar e com a estação.',
      },
    ],
  },

  'carta-de-vinhos-2025': {
    title: 'Nova Carta de Vinhos 2025',
    date: '2025-02-14',
    category: 'Vinhos',
    image: 'https://res.cloudinary.com/djhevgyvi/image/upload/v1774314822/VINHOS_cfut07.jpg',
    body: [
      {
        text: 'Renovar uma carta de vinhos é um exercício de equilíbrio entre continuidade e descoberta. Nossa sommelière passou o segundo semestre de 2024 revisitando importadores, degustando safras novas e recalibrando as harmonizações com o menu atual. O resultado chegou em fevereiro: uma seleção enxuta, sem rótulos por obrigação de prestígio, construída para funcionar com o que servimos.',
      },
      {
        heading: 'Portugal: a âncora da carta',
        text: 'Os brancos portugueses continuam sendo nossa espinha dorsal para frutos do mar. O Vinho Verde ganhou um representante de produtor independente do Minho — colheita 2023, acidez precisa, sem a doçura excessiva de versões comerciais. Para peixes grelhados mais encorpados, dois Alentejanos entram na lista: um branco com passagem em madeira usada e um tinto de Trincadeira que aguentam a estrutura do atum fresco sem dominar o prato.',
      },
      {
        heading: 'Argentina e França nos momentos de celebração',
        text: 'Para quem quer celebrar, a carta traz dois espumantes: um Crémant d\'Alsace francês (método tradicional, relação qualidade-preço imbatível) e um Espumante Brut de Mendoza que funciona surpreendentemente bem com ostras. Completando a seleção, dois Malbecs argentinos de altitude — escolhidos não pelo rótulo, mas pela frescura incomum para a casta, o que os torna parceiros improváveis e certeiros para a lagosta.',
      },
      {
        heading: 'A lógica por trás da seleção',
        text: 'A carta 2025 tem 22 rótulos. Pode parecer pouco para um restaurante, mas é uma decisão deliberada: preferimos conhecer profundamente cada garrafa do que oferecer uma lista enciclopédica onde ninguém sabe o que recomendar. O serviço de vinhos no Porto Cabral é uma conversa — pergunte ao sommelier o que está bebendo hoje, e você vai entender o que queremos dizer.',
      },
    ],
  },
}

// ─── Componente da página ────────────────────────────────────────────────────
export default function BlogPostPage() {
  const params = useParams()
  const slug = params?.slug as string
  const locale = (params?.locale as string) || 'pt'
  const post = posts[slug]

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#fef9f1] overflow-x-hidden">
      {/* Hero com imagem do post */}
      <section className="relative h-[380px] md:h-[460px] flex items-end overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#001432]/80 via-[#001432]/40 to-transparent" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 pb-10 w-full">
          <span className="text-xs font-accent text-[#D4A843] tracking-[0.3em] uppercase block mb-3">
            {post.category}
          </span>
          <h1 className="font-display text-2xl md:text-4xl text-white leading-tight">
            {post.title}
          </h1>
          <time className="text-sm text-slate-300 mt-3 block">
            {new Date(post.date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </time>
        </div>
      </section>

      {/* Conteúdo do post */}
      <section className="py-12 px-6 max-w-3xl mx-auto">
        <div className="prose prose-lg max-w-none text-[#43474f]">
          {post.body.map((block, i) => (
            <div key={i} className="mb-8">
              {block.heading && (
                <h2 className="font-display text-xl md:text-2xl text-[#0074bf] mb-3">
                  {block.heading}
                </h2>
              )}
              <p className="leading-relaxed text-[#43474f]">{block.text}</p>
            </div>
          ))}
        </div>

        {/* Divisor */}
        <div className="w-16 h-px bg-[#D4A843] my-10" />

        {/* Voltar */}
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-2 text-sm font-accent text-[#0074bf] hover:text-[#D4A843] uppercase tracking-widest transition-colors"
        >
          ← Voltar ao Blog
        </Link>
      </section>
    </main>
  )
}

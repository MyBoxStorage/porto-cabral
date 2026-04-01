import { getLocale } from 'next-intl/server'
import Link from 'next/link'

export default async function TermosPage() {
  const locale = await getLocale()

  return (
    <main className="min-h-screen bg-pc-surface py-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <p className="font-accent text-[10px] tracking-[0.4em] uppercase text-pc-gold mb-3">Porto Cabral BC</p>
          <h1 className="font-display italic text-4xl text-pc-navy mb-4">Termos de Uso</h1>
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-16 bg-pc-gold/40" />
            <span className="text-pc-gold text-sm">✦</span>
            <span className="h-px w-16 bg-pc-gold/40" />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="prose prose-slate max-w-none space-y-6 text-pc-muted leading-relaxed">
          <p className="text-xs text-slate-400 font-accent tracking-widest uppercase">Última atualização: janeiro de 2025</p>

          <section>
            <h2 className="font-display text-xl text-pc-navy mb-3">1. Aceitação dos Termos</h2>
            <p>
              Ao criar uma conta ou utilizar os serviços do Porto Cabral BC, você concorda com estes Termos de Uso.
              A área exclusiva &ldquo;Cabine do Comandante&rdquo; é destinada a clientes que desejam gerenciar reservas e preferências.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-pc-navy mb-3">2. Cadastro e Conta</h2>
            <p>
              Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas com sua conta.
              O Porto Cabral BC reserva-se o direito de encerrar contas que violem estes termos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-pc-navy mb-3">3. Reservas</h2>
            <p>
              As reservas realizadas pelo site estão sujeitas à disponibilidade e confirmação pelo restaurante.
              Em caso de cancelamento, solicitamos contato com antecedência mínima de 24 horas.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-pc-navy mb-3">4. Dados Pessoais</h2>
            <p>
              O tratamento de seus dados pessoais é regido pela nossa{' '}
              <Link href={`/${locale}/privacidade`} className="text-pc-gold underline underline-offset-2 hover:text-pc-navy transition-colors">
                Política de Privacidade
              </Link>
              , em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-pc-navy mb-3">5. Limitação de Responsabilidade</h2>
            <p>
              O Porto Cabral BC não se responsabiliza por danos decorrentes do uso inadequado da plataforma ou por
              indisponibilidades temporárias do sistema.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-pc-navy mb-3">6. Contato</h2>
            <p>
              Em caso de dúvidas sobre estes Termos, entre em contato pelo WhatsApp ou pelo e-mail disponíveis no site.
            </p>
          </section>
        </div>

        {/* Botão voltar */}
        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/cliente/login`}
            className="inline-flex items-center gap-2 font-accent text-xs tracking-[0.18em] uppercase text-pc-navy border border-pc-navy px-6 py-3 rounded hover:bg-pc-navy hover:text-white transition-all"
          >
            ← Voltar ao login
          </Link>
        </div>
      </div>
    </main>
  )
}

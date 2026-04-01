import { getLocale } from 'next-intl/server'
import Link from 'next/link'

export default async function PrivacidadePage() {
  const locale = await getLocale()

  return (
    <main className="min-h-screen bg-pc-surface py-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <p className="font-accent text-[10px] tracking-[0.4em] uppercase text-pc-gold mb-3">Porto Cabral BC</p>
          <h1 className="font-display italic text-4xl text-pc-navy mb-4">Política de Privacidade</h1>
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
            <h2 className="font-display text-xl text-pc-navy mb-3">1. Controlador dos Dados</h2>
            <p>
              O Porto Cabral BC, restaurante flutuante localizado no Molhe da Barra Sul em Balneário Camboriú/SC,
              é o controlador dos dados pessoais coletados por meio deste site, nos termos da LGPD (Lei nº 13.709/2018).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-pc-navy mb-3">2. Dados Coletados</h2>
            <p>Coletamos os seguintes dados pessoais:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Nome completo</li>
              <li>Endereço de e-mail</li>
              <li>Número de telefone/WhatsApp</li>
              <li>Preferências de reserva (data, horário, ocasião)</li>
              <li>Preferências alimentares (informadas voluntariamente)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-pc-navy mb-3">3. Finalidade do Tratamento</h2>
            <p>Seus dados são utilizados para:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Gerenciar reservas e confirmações</li>
              <li>Envio de comunicações transacionais (confirmação de reserva, boas-vindas)</li>
              <li>Personalização da experiência na Cabine do Comandante</li>
              <li>Comunicações de marketing, mediante consentimento expresso</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-pc-navy mb-3">4. Base Legal</h2>
            <p>
              O tratamento se fundamenta no consentimento do titular (art. 7º, I, LGPD) para fins de marketing,
              e na execução de contrato (art. 7º, V, LGPD) para o processamento de reservas.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-pc-navy mb-3">5. Compartilhamento</h2>
            <p>
              Seus dados podem ser compartilhados com parceiros comerciais do Porto Cabral BC apenas mediante
              consentimento expresso e específico (opt-in de parceiros). Não vendemos dados pessoais a terceiros.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-pc-navy mb-3">6. Seus Direitos (LGPD)</h2>
            <p>Você tem direito a:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a exclusão dos dados</li>
              <li>Revogar o consentimento a qualquer momento</li>
              <li>Portabilidade dos dados</li>
            </ul>
            <p className="mt-3">
              Para exercer seus direitos, entre em contato pelo WhatsApp ou e-mail disponíveis no site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-pc-navy mb-3">7. Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger seus dados, incluindo criptografia em trânsito
              (HTTPS/TLS) e armazenamento seguro via Supabase (infraestrutura certificada).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-pc-navy mb-3">8. Retenção</h2>
            <p>
              Os dados são mantidos pelo período necessário à prestação dos serviços e cumprimento de obrigações legais,
              ou até a solicitação de exclusão pelo titular.
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

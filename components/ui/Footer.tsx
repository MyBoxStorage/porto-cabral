import Link from 'next/link'
import { IconAncora, IconLeme, IconBussola, IconOnda, IconSino } from '@/components/icons'
import { Logo } from '@/components/brand/Logo'

export function Footer() {
  return (
    <footer style={{ background: '#001432' }} className="w-full text-slate-400">

      {/* Linha dourada topo */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg,transparent,rgba(212,168,67,0.4),transparent)' }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* ── Brand ── */}
          <div className="md:col-span-1 space-y-5">
            <div className="flex items-center gap-3">
              {/* Logo símbolo 32px + nome */}
              <Logo variant="symbol" size={32} color="#ffffff" />
              <span className="font-display italic text-xl text-white">
                Porto Cabral <span className="text-[#D4A843]">BC</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500">
              A essência da sofisticação náutica em Balneário Camboriú.
              Uma jornada sensorial onde o luxo encontra as águas.
            </p>
            {/* Redes sociais placeholder */}
            <div className="flex gap-3 pt-1">
              {['Ig', 'Fb', 'Wa'].map(s => (
                <span key={s}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-accent text-[10px] text-[#D4A843]/60 cursor-pointer hover:text-[#D4A843] transition-colors"
                  style={{ border: '1px solid rgba(212,168,67,0.2)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* ── Navegação ── */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-[#D4A843]"><IconLeme size={13} strokeWidth={1.5} /></span>
              <h4 className="font-accent text-[10px] tracking-[0.3em] uppercase text-white">Navegação</h4>
            </div>
            <ul className="space-y-3">
              {[
                { href: '/',         label: 'Home' },
                { href: '/cardapio', label: 'Cardápio' },
                { href: '/sobre',    label: 'Sobre' },
                { href: '/blog',     label: 'Blog' },
                { href: '/cliente',  label: 'Área do Cliente' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-sm text-slate-500 hover:text-[#D4A843] transition-colors flex items-center gap-2 group">
                    <span className="w-3 h-px bg-[#D4A843]/0 group-hover:bg-[#D4A843]/60 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Horários ── */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-[#D4A843]"><IconSino size={13} strokeWidth={1.5} /></span>
              <h4 className="font-accent text-[10px] tracking-[0.3em] uppercase text-white">Horários</h4>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                { d: 'Ter – Qui', h: '12h – 23h', closed: false },
                { d: 'Sex – Sáb', h: '12h – 00h', closed: false },
                { d: 'Domingo',   h: '12h – 22h', closed: false },
                { d: 'Segunda',   h: 'Fechado',    closed: true  },
              ].map(({ d, h, closed }) => (
                <li key={d} className="flex justify-between items-baseline gap-4">
                  <span className="text-slate-500">{d}</span>
                  <span className={closed ? 'text-[#D4A843]/70 italic' : 'text-white'}>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Localização + Newsletter ── */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-[#D4A843]"><IconBussola size={13} strokeWidth={1.5} /></span>
              <h4 className="font-accent text-[10px] tracking-[0.3em] uppercase text-white">Localização</h4>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="text-[#D4A843] mt-0.5 flex-shrink-0"><IconOnda size={13} strokeWidth={1.5} /></span>
              <p className="text-slate-500 leading-relaxed">Molhe da Barra Sul<br />Balneário Camboriú, SC</p>
            </div>
            {/* Newsletter */}
            <div className="pt-2">
              <h4 className="font-accent text-[10px] tracking-[0.3em] uppercase text-white mb-2">Newsletter</h4>
              <p className="text-xs text-slate-600 mb-3">Convites para eventos exclusivos.</p>
              <div className="flex overflow-hidden rounded"
                style={{ border: '1px solid rgba(212,168,67,0.2)' }}>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="flex-1 bg-white/[0.04] px-4 py-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:bg-white/[0.07] transition-colors"
                />
                <button className="px-4 text-[#D4A843]/70 hover:text-[#D4A843] transition-colors"
                  style={{ background: 'rgba(212,168,67,0.07)', borderLeft: '1px solid rgba(212,168,67,0.2)' }}>
                  →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="font-accent text-[10px] tracking-[0.2em] uppercase text-slate-600">
            © {new Date().getFullYear()} Porto Cabral BC · Todos os direitos reservados
          </p>
          <div className="flex items-center gap-4 text-[#D4A843]/25">
            <IconAncora size={14} strokeWidth={1.5} />
            <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-slate-700">
              Gastronomia Flutuante
            </span>
            <IconOnda size={14} strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </footer>
  )
}

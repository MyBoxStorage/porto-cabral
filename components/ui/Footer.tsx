import { getTranslations, getLocale } from 'next-intl/server'
import Link from 'next/link'
import { IconAncora, IconLeme, IconBussola, IconOnda, IconSino } from '@/components/icons'
import { Logo } from '@/components/brand/Logo'
import { FooterNewsletter } from '@/components/ui/FooterNewsletter'

export async function Footer() {
  const locale = await getLocale()
  const t = await getTranslations('footer')

  const navLinks = [
    { href: `/${locale}`,          label: t('links.home') },
    { href: `/${locale}/cardapio`, label: t('links.cardapio') },
    { href: `/${locale}/sobre`,    label: t('links.sobre') },
    { href: `/${locale}/blog`,     label: t('links.blog') },
    { href: `/${locale}/cliente`,  label: t('links.cliente') },
  ]

  const hours = [
    { d: 'Ter – Qui', h: '12h – 23h', closed: false },
    { d: 'Sex – Sáb', h: '12h – 00h', closed: false },
    { d: 'Domingo',   h: '12h – 22h', closed: false },
    { d: 'Segunda',   h: t('closed'),  closed: true  },
  ]

  return (
    <footer className="w-full text-slate-400 bg-pc-navy">
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg,transparent,rgba(212,168,67,0.4),transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 md:px-12 pt-14 md:pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* ── Brand ── */}
          <div className="md:col-span-1 space-y-5">
            <div className="flex items-center gap-3">
              <Logo variant="symbol" size={32} color="#ffffff" />
              <span className="font-display italic text-xl text-white">
                Porto Cabral <span className="text-pc-gold">BC</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/60">{t('tagline')}</p>
            <div className="flex gap-3 pt-1">
              {['Ig', 'Fb', 'Wa'].map(s => (
                <span key={s}
                  className="w-8 h-8 rounded-full flex items-center justify-center font-accent text-[10px] text-pc-gold/60 cursor-pointer hover:text-pc-gold transition-colors"
                  style={{ border: '1px solid rgba(212,168,67,0.2)' }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* ── Navegação ── */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-pc-gold"><IconLeme size={13} strokeWidth={1.5} /></span>
              <h4 className="font-accent text-[10px] tracking-[0.3em] uppercase text-white">{t('nav_title')}</h4>
            </div>
            <ul className="space-y-3">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href}
                    className="text-sm text-white/60 hover:text-pc-gold transition-colors flex items-center gap-2 group">
                    <span className="w-3 h-px bg-pc-gold/0 group-hover:bg-pc-gold/60 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Horários ── */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-pc-gold"><IconSino size={13} strokeWidth={1.5} /></span>
              <h4 className="font-accent text-[10px] tracking-[0.3em] uppercase text-white">{t('hours_title')}</h4>
            </div>
            <ul className="space-y-3 text-sm">
              {hours.map(({ d, h, closed }) => (
                <li key={d} className="flex justify-between items-baseline gap-4">
                  <span className="text-white/60">{d}</span>
                  <span className={closed ? 'text-pc-gold/70 italic' : 'text-white'}>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Localização + Newsletter ── */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-pc-gold"><IconBussola size={13} strokeWidth={1.5} /></span>
              <h4 className="font-accent text-[10px] tracking-[0.3em] uppercase text-white">{t('location_title')}</h4>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="text-pc-gold mt-0.5 flex-shrink-0"><IconOnda size={13} strokeWidth={1.5} /></span>
              <p className="text-white/60 leading-relaxed">Molhe da Barra Sul<br />Balneário Camboriú, SC</p>
            </div>
            {/* Newsletter — client component com feedback */}
            <FooterNewsletter
              title={t('newsletter_title')}
              desc={t('newsletter_desc')}
              placeholder={t('newsletter_placeholder')}
              successMsg={t('newsletter_success')}
            />
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="font-accent text-[11px] md:text-[10px] tracking-[0.2em] uppercase text-white/40">
            © {new Date().getFullYear()} Porto Cabral BC · {t('copyright')}
          </p>
          <div className="flex items-center gap-4 text-pc-gold/25">
            <IconAncora size={14} strokeWidth={1.5} />
            <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-white/35">
              Gastronomia Flutuante
            </span>
            <IconOnda size={14} strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </footer>
  )
}

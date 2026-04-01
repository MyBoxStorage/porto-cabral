import { getTranslations, getLocale } from 'next-intl/server'
import Link from 'next/link'
import { IconAncora, IconLeme, IconBussola, IconOnda, IconSino } from '@/components/icons'
import { Logo } from '@/components/brand/Logo'
import { FooterNewsletter } from '@/components/ui/FooterNewsletter'
import { getDb } from '@/lib/db'
import { siteContent } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

/* ── Ícones SVG das redes sociais — inline, zero dependência externa ── */
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" width="17" height="17" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function IconWhatsApp() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12.05 2C6.495 2 2 6.495 2 12.05c0 1.853.487 3.594 1.34 5.106L2 22l4.984-1.307A10.01 10.01 0 0 0 12.05 22.1C17.604 22.1 22.1 17.605 22.1 12.05 22.1 6.495 17.604 2 12.05 2zm0 18.3a8.31 8.31 0 0 1-4.237-1.162l-.303-.18-3.149.826.842-3.074-.198-.315A8.3 8.3 0 0 1 3.732 12.05c0-4.596 3.741-8.337 8.337-8.337 4.596 0 8.335 3.741 8.335 8.337 0 4.596-3.74 8.25-8.334 8.25z" />
    </svg>
  )
}

/* ── Busca site_info do banco (whatsapp, instagram, facebook) ── */
async function getSiteInfo(): Promise<{ whatsapp?: string; instagram_url?: string; facebook_url?: string }> {
  try {
    const db = getDb()
    const [row] = await db.select().from(siteContent).where(eq(siteContent.key, 'site_info')).limit(1)
    if (!row?.value) return {}
    const val = typeof row.value === 'string' ? JSON.parse(row.value) : row.value
    return val as { whatsapp?: string; instagram_url?: string; facebook_url?: string }
  } catch {
    return {}
  }
}

export async function Footer() {
  const locale = await getLocale()
  const t = await getTranslations('footer')
  const siteInfo = await getSiteInfo()

  const waNumber = (siteInfo.whatsapp ?? '').replace(/\D/g, '')
  const waHref   = waNumber ? `https://wa.me/55${waNumber}` : 'https://wa.me/554733000000'
  const igHref   = siteInfo.instagram_url ?? 'https://instagram.com/portocabralbc'
  const fbHref   = siteInfo.facebook_url  ?? 'https://facebook.com/portocabralbc'

  const socialLinks = [
    { key: 'instagram', href: igHref, label: 'Instagram', icon: <IconInstagram /> },
    { key: 'facebook',  href: fbHref, label: 'Facebook',  icon: <IconFacebook />  },
    { key: 'whatsapp',  href: waHref, label: 'WhatsApp',  icon: <IconWhatsApp />  },
  ]

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

      <div className="max-w-7xl mx-auto px-5 md:px-12 pt-12 md:pt-20 pb-8 md:pb-10">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">

          {/* ── Brand ── */}
          <div className="col-span-2 md:col-span-1 space-y-4 md:space-y-5">
            <div className="flex items-center gap-3">
              <Logo variant="symbol" size={28} color="#ffffff" />
              <span className="font-display italic text-lg md:text-xl text-white">
                Porto Cabral <span className="text-pc-gold">BC</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-white/60">{t('tagline')}</p>

            {/* Ícones das redes sociais */}
            <div className="flex gap-2.5 pt-1">
              {socialLinks.map(({ key, href, label, icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-pc-gold/55 hover:text-pc-gold hover:bg-white/5 transition-all duration-200"
                  style={{ border: '1px solid rgba(212,168,67,0.22)' }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Navegação ── */}
          <div className="space-y-4 md:space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-pc-gold"><IconLeme size={12} strokeWidth={1.5} /></span>
              <h4 className="font-accent text-[10px] tracking-[0.3em] uppercase text-white">{t('nav_title')}</h4>
            </div>
            <ul className="space-y-2.5 md:space-y-3">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/60 hover:text-pc-gold transition-colors flex items-center gap-2 group min-h-[36px] md:min-h-0"
                  >
                    <span className="w-3 h-px bg-pc-gold/0 group-hover:bg-pc-gold/60 transition-all duration-200 hidden md:block" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Horários ── */}
          <div className="space-y-4 md:space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-pc-gold"><IconSino size={12} strokeWidth={1.5} /></span>
              <h4 className="font-accent text-[10px] tracking-[0.3em] uppercase text-white">{t('hours_title')}</h4>
            </div>
            <ul className="space-y-2 md:space-y-3 text-sm">
              {hours.map(({ d, h, closed }) => (
                <li key={d} className="flex justify-between items-baseline gap-2">
                  <span className="text-white/60 text-xs md:text-sm">{d}</span>
                  <span className={closed ? 'text-pc-gold/70 italic text-xs md:text-sm' : 'text-white text-xs md:text-sm'}>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Localização + Newsletter ── */}
          <div className="col-span-2 md:col-span-1 space-y-4 md:space-y-5">
            <div className="flex items-center gap-2">
              <span className="text-pc-gold"><IconBussola size={12} strokeWidth={1.5} /></span>
              <h4 className="font-accent text-[10px] tracking-[0.3em] uppercase text-white">{t('location_title')}</h4>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <span className="text-pc-gold mt-0.5 flex-shrink-0"><IconOnda size={13} strokeWidth={1.5} /></span>
              <p className="text-white/60 leading-relaxed">Molhe da Barra Sul<br />Balneário Camboriú, SC</p>
            </div>
            <FooterNewsletter
              title={t('newsletter_title')}
              desc={t('newsletter_desc')}
              placeholder={t('newsletter_placeholder')}
              successMsg={t('newsletter_success')}
            />
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="mt-12 md:mt-16 pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          <p className="font-accent text-[10px] tracking-[0.2em] uppercase text-white/40 text-center md:text-left">
            © {new Date().getFullYear()} Porto Cabral BC · {t('copyright')}
          </p>
          <div className="flex items-center gap-3 text-pc-gold/25">
            <IconAncora size={13} strokeWidth={1.5} />
            <span className="font-accent text-[10px] tracking-[0.3em] uppercase text-white/35">
              Gastronomia Flutuante
            </span>
            <IconOnda size={13} strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </footer>
  )
}

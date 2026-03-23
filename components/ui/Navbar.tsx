'use client'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { useState, useEffect } from 'react'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { Logo } from '@/components/brand/Logo'

export function Navbar() {
  const locale = useLocale()
  const t = useTranslations('nav')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: `/${locale}`,          label: t('home') },
    { href: `/${locale}/cardapio`, label: t('cardapio') },
    { href: `/${locale}/sobre`,    label: t('sobre') },
    { href: `/${locale}/blog`,     label: t('blog') },
    { href: `/${locale}/cliente`,  label: t('cliente') },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b border-white/10 ${scrolled ? 'nav-scrolled' : ''}`}
      style={!scrolled ? { background: 'rgba(26,95,168,0.55)', backdropFilter: 'blur(16px)' } : {}}
    >
      <div className="flex justify-between items-center px-6 md:px-12 py-3 max-w-7xl mx-auto">

        {/* ── Brand: logo símbolo + wordmark ── */}
        <Link href={`/${locale}`} className="flex items-center gap-3 group" aria-label="Porto Cabral BC — Home">
          {/* Veleiro: 35px de altura, traço branco fino */}
          <span className="flex-shrink-0 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            <Logo variant="symbol" size={44} color="white" />
          </span>

          {/* Divider vertical sutil */}
          <span className="hidden md:block h-8 w-px" style={{ background: 'rgba(255,255,255,0.18)' }} />

          {/* Wordmark texto */}
          <span className="hidden md:flex flex-col gap-0 leading-none">
            <span
              className="font-accent uppercase text-white/60 tracking-[0.38em]"
              style={{ fontSize: '0.55rem', letterSpacing: '0.38em' }}
            >
              ·PORTO·
            </span>
            <span
              className="font-display italic text-white tracking-wide"
              style={{ fontSize: '1.15rem', lineHeight: 1.1 }}
            >
              Cabral
            </span>
            <span
              className="font-accent uppercase text-[#D4A843]/70"
              style={{ fontSize: '0.42rem', letterSpacing: '0.22em', marginTop: '4px' }}
            >
              GASTRONOMIA FLUTUANTE
            </span>
          </span>
        </Link>

        {/* ── Desktop links ── */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((l) => (
            <Link key={l.href} href={l.href}
              className="font-accent text-xs tracking-[0.15em] uppercase text-white/75 hover:text-[#D4A843] transition-colors duration-200 relative group">
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#D4A843] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          {/* Mobile hamburger */}
          <button className="md:hidden text-white p-1" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-1"
          style={{ background: 'rgba(26,64,107,0.97)', borderTop: '1px solid rgba(212,168,67,0.15)' }}>
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenuOpen(false)}
              className="font-accent text-xs tracking-[0.15em] uppercase text-white/70 hover:text-[#D4A843] transition-colors py-3 border-b border-white/5">
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

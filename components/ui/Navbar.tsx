'use client'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import { LanguageSelector } from '@/components/ui/LanguageSelector'
import { Logo } from '@/components/brand/Logo'

export function Navbar() {
  const locale = useLocale()
  const t = useTranslations('nav')
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const checkScroll = useCallback(() => {
    setScrolled(window.scrollY > 60)
  }, [])

  useEffect(() => {
    checkScroll()
    window.addEventListener('scroll', checkScroll, { passive: true })
    return () => window.removeEventListener('scroll', checkScroll)
  }, [checkScroll])

  // Fecha o menu mobile ao navegar
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  const links = [
    { href: `/${locale}`,          label: t('home') },
    { href: `/${locale}/cardapio`, label: t('cardapio') },
    { href: `/${locale}/sobre`,    label: t('sobre') },
    { href: `/${locale}/blog`,     label: t('blog') },
    { href: `/${locale}/cliente`,  label: t('cliente') },
  ]

  return (
    <nav
      className="fixed top-0 w-full z-50"
      style={{
        background: scrolled ? 'rgba(0,95,163,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 24px rgba(0,0,0,0.35)' : 'none',
        transition: 'background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease',
      }}
    >
      <div className="flex justify-between items-center px-6 md:px-12 py-3 max-w-7xl mx-auto">

        {/* Brand — some quando não scrollou */}
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 group"
          aria-label="Porto Cabral BC — Home"
          style={{
            opacity: scrolled ? 1 : 0,
            pointerEvents: scrolled ? 'auto' : 'none',
            transition: 'opacity 0.4s ease',
          }}
        >
          <span className="flex-shrink-0 opacity-90 group-hover:opacity-100 transition-opacity duration-300">
            <Logo variant="symbol" size={44} color="white" />
          </span>
          <span className="hidden md:block h-8 w-px" style={{ background: 'rgba(255,255,255,0.18)' }} />
          <span className="hidden md:flex flex-col gap-0 leading-none">
            <span className="font-accent uppercase text-white/60" style={{ fontSize: '0.55rem', letterSpacing: '0.38em' }}>
              ·PORTO·
            </span>
            <span className="font-display italic text-white tracking-wide" style={{ fontSize: '1.15rem', lineHeight: 1.1 }}>
              Cabral
            </span>
            <span className="font-accent uppercase text-[#D4A843]/70" style={{ fontSize: '0.42rem', letterSpacing: '0.22em', marginTop: '4px' }}>
              GASTRONOMIA FLUTUANTE
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex gap-8 items-center">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="font-accent text-xs tracking-[0.15em] uppercase hover:text-[#D4A843] transition-colors duration-200 relative group"
              style={{
                color: 'rgba(255,255,255,0.9)',
                textShadow: !scrolled ? '0 1px 8px rgba(0,0,0,0.6)' : 'none',
              }}
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#D4A843] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          <button
            className="md:hidden text-white min-w-[44px] min-h-[44px] flex items-center justify-center -mr-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
            style={{ filter: !scrolled ? 'drop-shadow(0 1px 4px rgba(0,0,0,0.6))' : 'none' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden"
        style={{
          maxHeight: menuOpen ? '400px' : '0',
          transition: 'max-height 0.3s ease',
          background: 'rgba(0,36,81,0.98)',
          borderTop: menuOpen ? '1px solid rgba(212,168,67,0.15)' : 'none',
        }}
      >
        <div className="px-6 py-4 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="font-accent text-xs tracking-[0.15em] uppercase text-white/70 hover:text-[#D4A843] active:text-[#D4A843] transition-colors min-h-[48px] flex items-center border-b border-white/5"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

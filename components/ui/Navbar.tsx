'use client'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { useState, useEffect } from 'react'
import { LanguageSelector } from '@/components/ui/LanguageSelector'

export function Navbar() {
  const locale = useLocale()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: `/${locale}`,          label: 'Home' },
    { href: `/${locale}/cardapio`, label: 'Cardápio' },
    { href: `/${locale}/sobre`,    label: 'Sobre' },
    { href: `/${locale}/blog`,     label: 'Blog' },
    { href: `/${locale}/cliente`,  label: 'Área do Cliente' },
    { href: `/${locale}/admin`,    label: '⚙️ Admin' },
  ]

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 border-b border-white/10 ${scrolled ? 'nav-scrolled' : ''}`}
      style={!scrolled ? { background: 'rgba(0,18,54,0.55)', backdropFilter: 'blur(16px)' } : {}}
    >
      <div className="flex justify-between items-center px-6 md:px-12 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href={`/${locale}`}
          className="font-display italic text-lg md:text-2xl text-white tracking-wide hover:text-[#D4A843] transition-colors duration-300">
          Porto Cabral <span className="text-[#D4A843]">BC</span>
        </Link>

        {/* Desktop links */}
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-1"
          style={{ background: 'rgba(0,18,54,0.97)', borderTop: '1px solid rgba(212,168,67,0.15)' }}>
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

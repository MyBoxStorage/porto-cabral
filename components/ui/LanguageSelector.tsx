'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

const languages = [
  { code: 'pt', label: 'PT', flag: '🇧🇷' },
  { code: 'en', label: 'EN', flag: '🇺🇸' },
  { code: 'es', label: 'ES', flag: '🇦🇷' },
]

export function LanguageSelector() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLanguage(newLocale: string) {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => switchLanguage(lang.code)}
          className={`px-2 py-1 rounded text-xs font-accent uppercase tracking-widest transition-all ${
            locale === lang.code
              ? 'text-[#D4A843] bg-white/10'
              : 'text-white/70 hover:text-white hover:bg-white/5'
          }`}
        >
          <span className="mr-1">{lang.flag}</span>{lang.label}
        </button>
      ))}
    </div>
  )
}

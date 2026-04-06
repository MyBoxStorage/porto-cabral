import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'
import { Playfair_Display, Inter, Josefin_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { routing } from '@/i18n/routing'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { PreloaderWrapper } from '@/components/brand/PreloaderWrapper'
import { getDb } from '@/lib/db'
import { siteContent } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

import '../globals.css'

// ---------------------------------------------------------------------------
// Fontes via next/font — sem request externo, sem render-blocking
// Cada fonte expõe uma CSS variable que é aplicada ao <html>
// ---------------------------------------------------------------------------
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

const josefin = Josefin_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-josefin',
  display: 'swap',
})

// ---------------------------------------------------------------------------
// Tipos e dados de metadata por locale
// ---------------------------------------------------------------------------
type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

const ogLocaleMap: Record<string, string> = {
  pt: 'pt_BR',
  en: 'en_US',
  es: 'es_ES',
}

const metaByLocale: Record<string, { title: string; description: string; ogDescription: string }> = {
  pt: {
    title: 'Porto Cabral BC — Restaurante Flutuante Premium',
    description: 'Restaurante flutuante premium em Balneário Camboriú — alta gastronomia sobre as águas da Barra Sul.',
    ogDescription: 'Restaurante flutuante premium em Balneário Camboriú.',
  },
  en: {
    title: 'Porto Cabral BC — Premium Floating Restaurant',
    description: 'Premium floating restaurant in Balneário Camboriú — high gastronomy on the waters of Barra Sul.',
    ogDescription: 'Premium floating restaurant in Balneário Camboriú.',
  },
  es: {
    title: 'Porto Cabral BC — Restaurante Flotante Premium',
    description: 'Restaurante flotante premium en Balneário Camboriú — alta gastronomía sobre las aguas de Barra Sul.',
    ogDescription: 'Restaurante flotante premium en Balneário Camboriú.',
  },
}

// URL estática de fallback para OG image — usada enquanto nenhuma imagem
// estiver configurada no painel admin. Aponta para o gerador dinâmico do Next.js.
const OG_STATIC_FALLBACK = '/opengraph-image'

async function getOgImageUrl(): Promise<string | null> {
  try {
    const db = getDb()
    const [row] = await db
      .select()
      .from(siteContent)
      .where(eq(siteContent.key, 'og_image'))
      .limit(1)
    if (!row?.value) return null
    const val = typeof row.value === 'string' ? JSON.parse(row.value) : row.value
    return (val as { url?: string })?.url ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const meta = metaByLocale[locale] ?? metaByLocale.pt
  const siteUrl = process.env.NEXT_PUBLIC_PC_SITE_URL ?? 'https://porto-cabral.vercel.app'
  const ogImageUrl = (await getOgImageUrl()) ?? `${siteUrl}${OG_STATIC_FALLBACK}`

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: 'Porto Cabral BC',
      description: meta.ogDescription,
      locale: ogLocaleMap[locale] ?? 'pt_BR',
      type: 'website',
      siteName: 'Porto Cabral BC',
      url: siteUrl,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'Porto Cabral BC — Restaurante Flutuante Premium',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Porto Cabral BC',
      description: meta.ogDescription,
      images: [ogImageUrl],
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

// ---------------------------------------------------------------------------
// Schema.org JSON-LD — melhora rich results nas buscas locais do Google
// ---------------------------------------------------------------------------
function RestaurantJsonLd({ locale }: { locale: string }) {
  const siteUrl = process.env.NEXT_PUBLIC_PC_SITE_URL ?? 'https://porto-cabral.vercel.app'
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Porto Cabral BC',
    alternateName: 'Restaurante Flutuante Porto Cabral',
    url: siteUrl,
    description:
      locale === 'en'
        ? 'Premium floating restaurant in Balneário Camboriú, Santa Catarina, Brazil.'
        : locale === 'es'
        ? 'Restaurante flotante premium en Balneário Camboriú, Santa Catarina, Brasil.'
        : 'Restaurante flutuante premium em Balneário Camboriú, Santa Catarina, Brasil.',
    servesCuisine: ['Frutos do Mar', 'Gastronomia Brasileira', 'Culinária Internacional'],
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Balneário Camboriú',
      addressRegion: 'Santa Catarina',
      addressCountry: 'BR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -26.9906,
      longitude: -48.6348,
    },
    sameAs: [
      'https://www.instagram.com/portocabralbc',
    ],
    image: `${siteUrl}/opengraph-image`,
    hasMap: `https://www.google.com/maps/search/Porto+Cabral+BC+Balneario+Camboriu`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }
  setRequestLocale(locale)
  const messages = await getMessages()

  // Classes das fontes: cada uma injeta a CSS variable no <html>
  const fontClasses = [playfair.variable, inter.variable, josefin.variable].join(' ')

  return (
    <html lang={locale} suppressHydrationWarning className={fontClasses}>
      <head>
        {/* Schema.org structured data — melhora rich results no Google */}
        <RestaurantJsonLd locale={locale} />
        {/* Script inline — injeta pc-loading no <html> antes do primeiro paint.
            suppressHydrationWarning no <html> silencia o mismatch de classe,
            padrão usado por next-themes e outros sistemas de tema/preloader. */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{if(!sessionStorage.getItem('pc_preloader_shown')){document.documentElement.classList.add('pc-loading');}}catch(e){}})();` }} />
        {/*
          BC Connect Widget — DESATIVADO até ativação da parceria.
          Para ativar: descomente o bloco abaixo, substitua BC_CONNECT_WIDGET_KEY
          pela chave real (formato: bcc_XXXXX) e configure data-auto="true".
        */}
        {/* process.env.NEXT_PUBLIC_BC_CONNECT_WIDGET_KEY && (
          <script
            src="https://bc-connect-api-v2.fly.dev/widget.js"
            data-key={process.env.NEXT_PUBLIC_BC_CONNECT_WIDGET_KEY}
            data-primary="#c9a84c"
            data-bg="#1a1208"
            data-text="#fef9f1"
            data-radius="8"
            data-font="Playfair Display, Georgia, serif"
            data-auto="true"
            async
          />
        ) */}
      </head>
      <body className="min-h-screen bg-[#fef9f1] text-[#1d1c17] antialiased">
        <NextIntlClientProvider messages={messages}>
          {/* Preloader aparece só no primeiro acesso da sessão */}
          <PreloaderWrapper />
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
        {/* Vercel Analytics + Speed Insights — gratuito no plano Hobby/Pro */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

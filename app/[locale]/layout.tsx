import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { routing } from '@/i18n/routing'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { PreloaderWrapper } from '@/components/brand/PreloaderWrapper'
import { getDb } from '@/lib/db'
import { siteContent } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

import '../globals.css'

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
  const siteUrl = process.env.NEXT_PUBLIC_PC_SITE_URL ?? 'https://portocabralbc.com.br'
  const ogImageUrl = await getOgImageUrl()

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
      ...(ogImageUrl
        ? {
            images: [
              {
                url: ogImageUrl,
                width: 1200,
                height: 630,
                alt: 'Porto Cabral BC — Restaurante Flutuante Premium',
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Porto Cabral BC',
      description: meta.ogDescription,
      ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
    },
  }
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound()
  }
  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;600&display=swap" rel="stylesheet" />
        {/* Script inline — injeta pc-loading no <html> antes do primeiro paint.
            suppressHydrationWarning no <html> silencia o mismatch de classe,
            padrão usado por next-themes e outros sistemas de tema/preloader. */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{if(!sessionStorage.getItem('pc_preloader_shown')){document.documentElement.classList.add('pc-loading');}}catch(e){}})();` }} />
        {/*
          BC Connect Widget — Captura de leads opt-in LGPD-compliant
          ─────────────────────────────────────────────────────────────
          PARCERIA PENDENTE: o Porto Cabral ainda não possui parceria ativa com o BC Connect.
          O widget está instalado mas desativado (data-auto="false") até que as credenciais
          reais sejam fornecidas pelo gestor da plataforma.

          QUANDO A PARCERIA FOR ATIVADA:
          1. Substitua "AGUARDANDO_PARCERIA" pela API Key real (formato: bcc_XXXXX)
          2. Mude data-auto de "false" para "true"
          3. Para disparar o modal após submit do formulário de reserva, adicione em
             ReservationForm.tsx (após sucesso):
               if (typeof window !== 'undefined' && window.BCConnect) {
                 window.BCConnect.show()
               }

          Tema configurado para o design premium do Porto Cabral:
          • data-primary="#c9a84c"  — dourado premium da marca
          • data-bg="#1a1208"       — marrom escuro sofisticado
          • data-text="#fef9f1"     — creme do background do site
          • data-radius="8"         — bordas moderadas
          • data-font               — Playfair Display já carregada pelo projeto
        */}
        <script
          src="https://bc-connect-api-v2.fly.dev/widget.js"
          data-key="AGUARDANDO_PARCERIA"
          data-primary="#c9a84c"
          data-bg="#1a1208"
          data-text="#fef9f1"
          data-radius="8"
          data-font="Playfair Display, Georgia, serif"
          data-auto="false"
          async
        />
      </head>
      <body className="min-h-screen bg-[#fef9f1] text-[#1d1c17] antialiased">
        <NextIntlClientProvider messages={messages}>
          {/* Preloader aparece só no primeiro acesso da sessão */}
          <PreloaderWrapper />
          <Navbar />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

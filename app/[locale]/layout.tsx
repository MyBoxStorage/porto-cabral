import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { routing } from '@/i18n/routing'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { PreloaderWrapper } from '@/components/brand/PreloaderWrapper'

import '../globals.css'

type Props = {
  children: ReactNode
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Porto Cabral BC — Restaurante Flutuante Premium',
  description: 'Restaurante flutuante premium em Balneário Camboriú — alta gastronomia sobre as águas da Barra Sul.',
  openGraph: {
    title: 'Porto Cabral BC',
    description: 'Restaurante flutuante premium em Balneário Camboriú.',
    locale: 'pt_BR',
    type: 'website',
    siteName: 'Porto Cabral BC',
  },
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
    <html lang={locale}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Inter:wght@300;400;500;600;700&family=Josefin+Sans:wght@300;400;600&display=swap" rel="stylesheet" />
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

import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import { withSentryConfig } from '@sentry/nextjs'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

// NextAuth v5 beta le AUTH_SECRET do ambiente antes de processar o config.
// Para evitar conflito com outros projetos no Vercel, mapeamos PC_NEXTAUTH_SECRET -> AUTH_SECRET
// apenas para este projeto, sem precisar de uma variavel AUTH_SECRET separada no Vercel.
if (process.env.PC_NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = process.env.PC_NEXTAUTH_SECRET
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh3.google.com' },
    ],
  },
}

// Encadeamento original preservado: withPayload(withNextIntl(nextConfig))
// withSentryConfig envolve tudo por fora — não interfere no Payload nem no NextIntl
export default withSentryConfig(
  withPayload(withNextIntl(nextConfig)),
  {
    // Organização e projeto no Sentry (preenchidos pela env SENTRY_ORG e SENTRY_PROJECT)
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,

    // Upload de source maps apenas em builds de produção
    silent: true,

    // Desabilita o túnel automático para não conflitar com as rotas do Payload
    tunnelRoute: undefined,

    // Não injeta statements de release automaticamente (evita conflito com Payload)
    disableLogger: true,

    // Oculta source maps do bundle público (segurança)
    hideSourceMaps: true,

    // Sem telemetria do Sentry CLI
    telemetry: false,
  }
)

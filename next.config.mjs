import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'
import { withSentryConfig } from '@sentry/nextjs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

// NextAuth v5 beta lê AUTH_SECRET do ambiente antes de processar o config.
// Mapeamos PC_NEXTAUTH_SECRET -> AUTH_SECRET para evitar conflito com outros
// projetos no Vercel sem precisar de uma variável AUTH_SECRET separada.
if (process.env.PC_NEXTAUTH_SECRET && !process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = process.env.PC_NEXTAUTH_SECRET
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      // Alias @payload-config exigido pelo @payloadcms/next@3.31.0
      '@payload-config': resolve(__dirname, 'payload.config.ts'),
      // Alias @/ necessário porque o withPayload pode sobrescrever a resolução
      // do tsconfig paths em algumas versões
      '@': resolve(__dirname),
    }
    return config
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'lh3.google.com' },
    ],
  },
}

// Encadeamento: withPayload(withNextIntl(nextConfig))
// withSentryConfig envolve tudo por fora — não interfere no Payload nem no NextIntl
export default withSentryConfig(
  withPayload(withNextIntl(nextConfig)),
  {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    silent: true,
    tunnelRoute: undefined,
    disableLogger: true,
    hideSourceMaps: true,
    telemetry: false,
  }
)

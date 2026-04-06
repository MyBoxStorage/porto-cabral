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

// ---------------------------------------------------------------------------
// Headers de segurança aplicados a TODAS as rotas (páginas + API).
// A rota /api/* recebe headers adicionais via vercel.json.
// ---------------------------------------------------------------------------
const securityHeaders = [
  // Bloqueia clickjacking em todas as páginas
  { key: 'X-Frame-Options', value: 'DENY' },
  // Impede MIME sniffing — crítico para /api/img/* que serve binários
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Não enviar Referer em cross-origin
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Desabilitar features de browser não utilizadas
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // HSTS: força HTTPS por 2 anos — só ativo em produção (Vercel já serve HTTPS)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  // CSP: permite scripts do próprio domínio + inline necessário para Next.js.
  // 'unsafe-eval' foi removido — não necessário em produção com Next.js 15.
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://bc-connect-api-v2.fly.dev",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.supabase.co https://res.cloudinary.com https://maps.googleapis.com https://maps.gstatic.com",
      "media-src 'self' blob: https://res.cloudinary.com https://*.supabase.co",
      "connect-src 'self' https://*.supabase.co https://bc-connect-api-v2.fly.dev https://*.upstash.io wss://*.supabase.co https://res.cloudinary.com",
      "frame-src https://www.google.com https://maps.google.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // Aplica a todas as rotas
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@payload-config': resolve(__dirname, 'payload.config.ts'),
      '@': resolve(__dirname),
    }
    return config
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
}

// Encadeamento: withPayload(withNextIntl(nextConfig))
// withSentryConfig envolve tudo por fora
export default withSentryConfig(
  withPayload(withNextIntl(nextConfig)),
  {
    org:           process.env.SENTRY_ORG,
    project:       process.env.SENTRY_PROJECT,
    silent:        true,
    tunnelRoute:   undefined,
    disableLogger: true,
    hideSourceMaps: true,
    telemetry:     false,
  },
)

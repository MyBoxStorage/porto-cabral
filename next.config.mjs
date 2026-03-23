import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

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

export default withPayload(withNextIntl(nextConfig))

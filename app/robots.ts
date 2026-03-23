import type { MetadataRoute } from 'next'

const BASE_URL =
  process.env.NEXT_PUBLIC_PC_SITE_URL?.replace(/\/$/, '') ||
  'https://porto-cabral.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Bloqueia rotas privadas/admin de crawlers
        disallow: [
          '/api/',
          '/pt/cliente/',
          '/en/cliente/',
          '/es/cliente/',
          '/pt/painel/',
          '/en/painel/',
          '/es/painel/',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}

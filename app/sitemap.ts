import type { MetadataRoute } from 'next'

const BASE_URL =
  process.env.NEXT_PUBLIC_PC_SITE_URL?.replace(/\/$/, '') ||
  'https://porto-cabral.vercel.app'

const locales = ['pt', 'en', 'es'] as const

// Rotas estáticas do site (sem parâmetros dinâmicos)
const staticRoutes = [
  { path: '',          priority: 1.0,  changeFrequency: 'weekly'  },
  { path: '/cardapio', priority: 0.9,  changeFrequency: 'weekly'  },
  { path: '/sobre',    priority: 0.7,  changeFrequency: 'monthly' },
  { path: '/blog',     priority: 0.6,  changeFrequency: 'weekly'  },
  { path: '/cliente',  priority: 0.3,  changeFrequency: 'monthly' },
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  for (const locale of locales) {
    for (const route of staticRoutes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      })
    }
  }

  return entries
}

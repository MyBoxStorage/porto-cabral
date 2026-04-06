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

// Busca slugs dos posts publicados no Payload CMS
async function getPublishedPostSlugs(): Promise<{ slug: string; updatedAt?: Date }[]> {
  try {
    // Usa a REST API do Payload para buscar posts publicados
    const res = await fetch(
      `${BASE_URL}/api/posts?where[published][equals]=true&limit=100&depth=0`,
      {
        // Durante o build estático, precisamos que esta chamada funcione
        // mesmo que o servidor ainda não esteja no ar — retorna [] graciosamente
        next: { revalidate: 3600 },
      }
    )
    if (!res.ok) return []
    const json = await res.json() as {
      docs?: Array<{ slug: string; updatedAt?: string }>
    }
    return (json.docs ?? []).map((d) => ({
      slug: d.slug,
      updatedAt: d.updatedAt ? new Date(d.updatedAt) : undefined,
    }))
  } catch {
    // Se a API não estiver disponível durante o build, retorna vazio silenciosamente
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = []

  // Rotas estáticas — todas as localidades
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

  // Posts dinâmicos do blog — todas as localidades
  const posts = await getPublishedPostSlugs()
  for (const locale of locales) {
    for (const post of posts) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: post.updatedAt ?? new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      })
    }
  }

  return entries
}

import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Porto Cabral BC — Restaurante Flutuante',
    short_name: 'Porto Cabral',
    description: 'Restaurante flutuante premium em Balneário Camboriú',
    start_url: '/pt',
    display: 'standalone',
    background_color: '#001432',
    theme_color: '#0074bf',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}

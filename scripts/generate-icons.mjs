/**
 * scripts/generate-icons.mjs
 * Gera todos os ícones PWA + favicon a partir do logo SVG master.
 * Uso: node scripts/generate-icons.mjs
 */
import sharp from 'sharp'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT      = resolve(__dirname, '..')
const SVG_SRC   = resolve(ROOT, 'public/brand/logo-master.svg')
const PUBLIC    = resolve(ROOT, 'public')

const svgBuffer = readFileSync(SVG_SRC)

const icons = [
  // Favicon padrão
  { name: 'favicon-32x32.png',     size: 32,  bg: '#001432' },
  // Apple Touch Icon
  { name: 'apple-touch-icon.png',  size: 180, bg: '#001432' },
  // PWA — maskable (com fundo azul, logo centralizada com padding)
  { name: 'icon-192.png',          size: 192, bg: '#001432', padding: 32 },
  // PWA — any (sem fundo, transparente)
  { name: 'icon-512.png',          size: 512, bg: '#001432', padding: 64 },
]

console.log('Gerando ícones PWA a partir do logo SVG...\n')

for (const icon of icons) {
  const logoSize = icon.size - (icon.padding ?? 0) * 2

  await sharp(svgBuffer)
    .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({
      top:    icon.padding ?? 0,
      bottom: icon.padding ?? 0,
      left:   icon.padding ?? 0,
      right:  icon.padding ?? 0,
      background: icon.bg
        // converte hex #001432 → { r, g, b }
        ? {
            r: parseInt(icon.bg.slice(1, 3), 16),
            g: parseInt(icon.bg.slice(3, 5), 16),
            b: parseInt(icon.bg.slice(5, 7), 16),
            alpha: 1,
          }
        : { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(resolve(PUBLIC, icon.name))

  console.log(`  ✓ ${icon.name} (${icon.size}×${icon.size})`)
}

console.log('\nFeito! Coloque os arquivos gerados em /public/.')
console.log('Copie também o favicon-32x32.png renomeado para favicon.ico\n')
console.log('Ou converta para .ico com: npx png-to-ico public/favicon-32x32.png > public/favicon.ico')

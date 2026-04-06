import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// ---------------------------------------------------------------------------
// Validação crítica em runtime — impede boot com secret vazio
// ---------------------------------------------------------------------------
if (!process.env.PAYLOAD_SECRET) {
  throw new Error(
    '[payload.config] PAYLOAD_SECRET não está definido. ' +
    'Configure esta variável de ambiente no Vercel antes de fazer deploy.'
  )
}

const menuCategoryOptions = [
  'entradas-quentes',
  'entradas-frias',
  'saladas',
  'iguarias-do-mar',
  'peixes',
  'camaroes',
  'trattoria',
  'carnes-aves',
  'horta-ao-prato',
  'sobremesas',
  'bebidas',
  'drinks',
  'caipirinhas',
  'doses',
].map((value) => ({
  label: value.replace(/-/g, ' '),
  value,
}))

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET,
  serverURL: process.env.NEXT_PUBLIC_PC_SITE_URL || 'https://porto-cabral.vercel.app',
  admin: {
    user: 'admins',
  },
  editor: lexicalEditor(),
  // GraphQL não é utilizado neste projeto — desabilitar reduz bundle e surface de ataque
  graphQL: {
    disable: true,
  },
  collections: [
    {
      slug: 'menu-items',
      labels: { singular: 'Prato', plural: 'Pratos' },
      hooks: {
        afterChange: [
          async () => {
            const secret = process.env.SYNC_MENU_SECRET
            const siteUrl = process.env.NEXT_PUBLIC_PC_SITE_URL || 'https://porto-cabral.vercel.app'
            if (!secret) return
            try {
              await fetch(`${siteUrl}/api/admin/sync-menu`, {
                method: 'POST',
                headers: { 'x-sync-key': secret },
              })
            } catch {
              // falha silenciosa — não bloqueia o save
            }
          },
        ],
      },
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'name_en', type: 'text' },
        { name: 'name_es', type: 'text' },
        {
          name: 'category',
          type: 'select',
          options: menuCategoryOptions,
        },
        { name: 'description', type: 'textarea' },
        { name: 'description_en', type: 'textarea' },
        { name: 'description_es', type: 'textarea' },
        { name: 'price', type: 'number' },
        { name: 'price_note', type: 'text' },
        { name: 'photo', type: 'upload', relationTo: 'media' },
        { name: 'featured', type: 'checkbox' },
        { name: 'available', type: 'checkbox', defaultValue: true },
        { name: 'vegan', type: 'checkbox' },
        { name: 'lactose_free', type: 'checkbox' },
        { name: 'serves_two', type: 'checkbox' },
        { name: 'sort_order', type: 'number' },
      ],
    },
    {
      slug: 'posts',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true, unique: true },
        { name: 'cover', type: 'upload', relationTo: 'media' },
        { name: 'content', type: 'richText' },
        { name: 'category', type: 'text' },
        { name: 'published_at', type: 'date' },
        { name: 'published', type: 'checkbox' },
      ],
    },
    {
      slug: 'experiences',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'textarea' },
        { name: 'background_image', type: 'upload', relationTo: 'media' },
        { name: 'cta_label', type: 'text' },
        { name: 'sort_order', type: 'number' },
      ],
    },
    {
      slug: 'site-settings',
      fields: [
        { name: 'whatsapp', type: 'text' },
        { name: 'phone', type: 'text' },
        { name: 'address', type: 'text' },
        {
          name: 'opening_hours',
          type: 'array',
          fields: [
            { name: 'days', type: 'text' },
            { name: 'hours', type: 'text' },
          ],
        },
        { name: 'instagram_url', type: 'text' },
        { name: 'hero_video_url', type: 'text' },
        { name: 'google_maps_url', type: 'text' },
      ],
    },
    {
      slug: 'media',
      upload: {
        staticDir: path.resolve(dirname, 'public/media'),
      },
      fields: [{ name: 'alt', type: 'text' }],
    },
    {
      slug: 'admins',
      auth: true,
      fields: [{ name: 'name', type: 'text' }],
    },
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.PC_DATABASE_URL || '',
    },
  }),
  sharp,
})

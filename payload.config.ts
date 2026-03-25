import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_PC_SITE_URL || 'http://localhost:3000',
  admin: {
    user: 'admins',
  },
  editor: lexicalEditor(),
  collections: [
    {
      slug: 'menu-items',
      labels: { singular: 'Prato', plural: 'Pratos' },
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
  // @ts-ignore — incompatibilidade de tipos entre @payloadcms/db-postgres@0.8.10 e payload@3.31.0
  // Funciona corretamente em runtime. Erro gerado por versões pinadas do Payload CLI.
  db: postgresAdapter({
    pool: {
      connectionString: process.env.PC_DATABASE_URL || '',
    },
  }),
  sharp,
})

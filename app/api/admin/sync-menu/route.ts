import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import { siteContent } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/adminAuth'
import { sql } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

// Mapeamento: category value do Payload → section id/title/subtitle usados na página
const CATEGORY_MAP: Record<string, { id: string; title: string; subtitle: string }> = {
  'entradas-quentes': { id: 'entradas-quentes', title: 'Entradas Quentes',     subtitle: 'O começo de uma experiência flutuante' },
  'entradas-frias':   { id: 'entradas-frias',   title: 'Entradas Frias',       subtitle: 'Frescor do oceano em cada garfada' },
  'saladas':          { id: 'saladas',           title: 'Saladas',              subtitle: 'O jardim encontra o mar' },
  'iguarias-do-mar':  { id: 'iguarias',          title: 'Iguarias do Mar',      subtitle: 'Todos os pratos acompanham arroz branco e pirão de peixe' },
  'peixes':           { id: 'peixes',            title: 'Peixes',               subtitle: 'Todos os pratos acompanham arroz branco e pirão de peixe' },
  'camaroes':         { id: 'camaroes',          title: 'Camarões',             subtitle: 'Todos os pratos acompanham arroz branco e pirão de peixe' },
  'trattoria':        { id: 'trattoria',         title: 'Trattoria',            subtitle: 'Sabores tradicionais com um toque autoral' },
  'carnes-aves':      { id: 'carnes',            title: 'Carnes & Aves',        subtitle: 'Dias em que o mar não está para peixe' },
  'horta-ao-prato':   { id: 'horta',             title: 'Da Horta ao Prato',    subtitle: 'Para todos os gostos e fome' },
  'sobremesas':       { id: 'sobremesas',        title: 'Sobremesas',           subtitle: 'Seu grand finale' },
  'bebidas':          { id: 'bebidas',           title: 'Bebidas',              subtitle: 'Para acompanhar cada momento' },
  'drinks':           { id: 'drinks',            title: 'Drinks & Caipirinhas', subtitle: 'Criações do Porto e clássicos de sempre' },
  'caipirinhas':      { id: 'drinks',            title: 'Drinks & Caipirinhas', subtitle: 'Criações do Porto e clássicos de sempre' },
  'doses':            { id: 'drinks',            title: 'Drinks & Caipirinhas', subtitle: 'Criações do Porto e clássicos de sempre' },
}

// Ordem visual das seções no cardápio
const SECTION_ORDER = [
  'entradas-quentes', 'entradas-frias', 'saladas', 'iguarias',
  'peixes', 'camaroes', 'trattoria', 'carnes', 'horta',
  'sobremesas', 'bebidas', 'drinks',
]

type PayloadItem = {
  id: string
  name: string
  category: string | null
  description: string | null
  price: number | null
  price_note: string | null
  featured: boolean | null
  available: boolean | null
  vegan: boolean | null
  lactose_free: boolean | null
  sort_order: number | null
}

type SectionItem = {
  name: string
  price: string
  desc?: string
  tag?: 'vegano' | 'sem-lactose' | 'destaque'
}

type Section = {
  id: string
  title: string
  subtitle: string
  items: SectionItem[]
}

export async function POST(req: Request) {
  // Permite chamada interna sem sessão (ex: hook do Payload) com chave secreta,
  // OU chamada autenticada do painel admin
  const internalKey = req.headers.get('x-sync-key')
  const isInternal = internalKey === process.env.PAYLOAD_SECRET

  if (!isInternal) {
    const authError = await requireAdmin()
    if (authError) return authError
  }

  try {
    const db = getDb()

    // Lê menu_items diretamente do banco (tabela gerada pelo Payload — slug com _ )
    // Com postgres-js, db.execute retorna Row[] diretamente
    const rows = await db.execute(
      sql`SELECT id, name, category, description, price, price_note,
               featured, available, vegan, lactose_free, sort_order
          FROM menu_items
          WHERE available = true
          ORDER BY sort_order ASC NULLS LAST, name ASC`
    ) as unknown as PayloadItem[]

    // Agrupa por section id usando CATEGORY_MAP
    const grouped = new Map<string, { meta: { id: string; title: string; subtitle: string }; items: SectionItem[] }>()

    for (const row of rows) {
      const meta = CATEGORY_MAP[row.category ?? '']
      if (!meta) continue

      if (!grouped.has(meta.id)) {
        grouped.set(meta.id, { meta, items: [] })
      }

      // Tag: vegan > sem-lactose > destaque
      const tag: SectionItem['tag'] = row.vegan
        ? 'vegano'
        : row.lactose_free
          ? 'sem-lactose'
          : row.featured
            ? 'destaque'
            : undefined

      // Preço: price_note tem prioridade (cobre "780/kg" e similares)
      const priceStr = row.price_note
        ? row.price_note
        : row.price != null
          ? String(Math.round(row.price))
          : '—'

      grouped.get(meta.id)!.items.push({
        name: row.name,
        price: priceStr,
        ...(row.description ? { desc: row.description } : {}),
        ...(tag ? { tag } : {}),
      })
    }

    // Monta seções na ordem correta, descartando seções vazias
    const sections: Section[] = SECTION_ORDER
      .map(id => grouped.get(id))
      .filter((s): s is NonNullable<typeof s> => !!s && s.items.length > 0)
      .map(s => ({ id: s.meta.id, title: s.meta.title, subtitle: s.meta.subtitle, items: s.items }))

    if (sections.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum item disponível encontrado no Payload. Verifique se os pratos estão cadastrados e marcados como disponíveis.' },
        { status: 422 }
      )
    }

    // Salva/atualiza site_content com key "menu_full"
    await db
      .insert(siteContent)
      .values({ key: 'menu_full', value: { sections }, updated_by: 'sync-menu' })
      .onConflictDoUpdate({
        target: siteContent.key,
        set: { value: { sections }, updated_at: new Date(), updated_by: 'sync-menu' },
      })

    const totalItems = sections.reduce((acc, s) => acc + s.items.length, 0)

    return NextResponse.json({
      success: true,
      sections: sections.length,
      items: totalItems,
      synced_at: new Date().toISOString(),
    })
  } catch (e) {
    console.error('[sync-menu]', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Erro interno' },
      { status: 500 }
    )
  }
}

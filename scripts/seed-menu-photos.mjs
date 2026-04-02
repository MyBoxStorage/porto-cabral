/**
 * seed-menu-photos.mjs
 * Lê as fotos do cardápio, salva cada uma no banco e atualiza o menu_full.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// ── Carregar .env.local ──────────────────────────────────────────
const envPath = path.join(ROOT, '.env.local')
const envLines = fs.readFileSync(envPath, 'utf8').split('\n')
for (const line of envLines) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eq = trimmed.indexOf('=')
  if (eq === -1) continue
  const k = trimmed.slice(0, eq).trim()
  const v = trimmed.slice(eq + 1).trim()
  if (!process.env[k]) process.env[k] = v
}

const DATABASE_URL = process.env.PC_DATABASE_URL
if (!DATABASE_URL) {
  console.error('❌ PC_DATABASE_URL não encontrada no .env.local')
  process.exit(1)
}

console.log('🔗 Conectando ao banco...')
console.log('   URL:', DATABASE_URL.slice(0, 35) + '...')

// ── Importar postgres ────────────────────────────────────────────
let postgres
try {
  const pgPath = new URL('file:///' + path.join(ROOT, 'node_modules', 'postgres', 'src', 'index.js').replace(/\\\\/g, '/'))
  const mod = await import(pgPath)
  postgres = mod.default
} catch (e) {
  console.error('❌ Falha ao importar postgres:', String(e))
  process.exit(1)
}

const txUrl = DATABASE_URL.replace(':5432/', ':6543/')
const sql = postgres(txUrl, { ssl: 'require', max: 1, prepare: false, connect_timeout: 15, idle_timeout: 20 })

// ── Diretório das fotos ──────────────────────────────────────────
const FOTOS_DIR = 'C:\\Users\\pc\\Desktop\\Projetos\\porto-cabral-bc\\imagens-org\\fotos cardapio'

// ── Mapeamento foto → item do cardápio ──────────────────────────
const PHOTO_MAP = {
  'bacalhau a portuguesa.jpg': {
    itemName: 'Bacalhau à Portuguesa',
    sectionId: 'peixes',
    longDesc: 'Bacalhau confitado lentamente no azeite de oliva extra virgem, servido com batatas ao murro assadas e arroz branco. Uma receita que respeita a tradição portuguesa com ingredientes frescos e técnica contemporânea.',
  },
  'bacalhau na crosta de grao-de-bico.jpg': {
    itemName: 'Bacalhau na Crosta de Grão de Bico',
    sectionId: 'peixes',
    longDesc: 'Filé de bacalhau empanado em crocante crosta de grão de bico torrado, servido sobre legumes salteados e batatas gratinadas ao forno.',
  },
  'Camaroes a Romana.jpg': {
    itemName: 'Camarão à Romana',
    sectionId: 'entradas-quentes',
    longDesc: 'Camarões selecionados empanados em massa levíssima com queijo parmesão ralado, fritos até dourar. Servidos com molho especial da casa. Uma entrada clássica e irresistível do Porto Cabral BC.',
  },
  'Entradas Isca de Mingnon.jpg': {
    itemName: 'Isca de Mignon',
    sectionId: 'entradas-quentes',
    longDesc: 'Tiras de filé mignon grelhadas ao ponto, aceboladas com cebolas caramelizadas e temperadas com ervas frescas da casa. Entrada generosa para compartilhar à beira das águas da Barra Sul.',
  },
  'file a duxelles.jpg': {
    itemName: 'Filé à Duxelles',
    sectionId: 'trattoria',
    longDesc: 'Filé mignon ao molho cremoso de nata com cebola caramelizada, servido sobre massa pappardelle com cogumelos frescos salteados. Clássico da culinária francesa com identidade autoral do Porto Cabral.',
  },
  'King Crab.jpg': {
    itemName: 'King Crab',
    sectionId: 'iguarias',
    longDesc: 'King crab inteiro, preparado com molhos especiais da casa. Vendido por kg, servido ao natural para preservar a doçura única da carne. Uma experiência gastronômica de alto luxo sobre as águas de Balneário Camboriú.',
  },
  'Paella.jpg': {
    itemName: 'Paella do Porto',
    sectionId: 'iguarias',
    longDesc: 'Paella autêntica preparada com arroz arbóreo, açafrão, marisco, lula, polvo e camarão frescos. Cozida lentamente para que cada grão absorva os sabores do mar. Um prato para compartilhar e celebrar.',
  },
  'picanha do capitao.jpg': {
    itemName: 'Picanha do Capitão',
    sectionId: 'carnes',
    longDesc: 'Quatro fatias de picanha grelhadas ao ponto, servidas com polenta frita crocante, aipim com bacon, arroz com brócolis e farofa especial da casa. O prato predileto do Capitão para os dias em que o mar não está para peixe.',
  },
  'Polvo Grelhado com Arroz Cremoso.jpg': {
    itemName: 'Capitão Cabral',
    sectionId: 'iguarias',
    longDesc: 'O prato ícone do Porto Cabral BC. Polvo grelhado à moda da casa com arroz cremoso de limão siciliano, pimentões coloridos e batata sauté. Técnica rigorosa para textura macia e sabor inesquecível.',
  },
  'prato executivo de salmao.jpg': {
    itemName: 'Fettuccine de Salmão',
    sectionId: 'trattoria',
    longDesc: 'Massa fettuccine ao molho cremoso de nata com tomate seco, azeitona preta e generosas lascas de salmão fresco. Apresentação elegante e sabor equilibrado que une o mar à tradição italiana.',
  },
  'Tabua de Frios.jpg': {
    itemName: 'Tábua de Frios',
    sectionId: 'entradas-frias',
    longDesc: 'Seleção premium de presunto parma, presunto cozido, salaminho italiano, queijos especiais, frutas frescas da estação, pães artesanais e geleia de pimenta. Entrada suntuosa para iniciar uma noite memorável no Porto Cabral.',
  },
  'Tartare de Atum.jpg': {
    itemName: 'Tartare de Atum e Salmão',
    sectionId: 'entradas-frias',
    longDesc: 'Atum e salmão frescos em corte clássico de tartare, sobre base de abacate temperado, cream cheese, crispy de alho-poró e chips de batata doce. Refinamento e sabores vibrantes do oceano em sua forma mais pura.',
  },
}

// ── Salva imagem no banco ────────────────────────────────────────
async function saveImageToDb(filePath, filename) {
  const data = fs.readFileSync(filePath)
  const ext  = path.extname(filename).toLowerCase()
  const mime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }
  const mimeType = mime[ext] || 'image/jpeg'
  const base64   = data.toString('base64')
  const dataUri  = `data:${mimeType};base64,${base64}`
  const key      = `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
  const value    = JSON.stringify({ dataUri, filename, size: data.length })

  await sql`
    INSERT INTO site_content (key, value, updated_by)
    VALUES (${key}, ${value}::jsonb, 'seed-script')
    ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = now()
  `
  return `/api/img/${key}`
}

// ── Main ─────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚢 Porto Cabral — Seed de fotos do cardápio\n')

  // 1. Testar conexão
  try {
    await sql`SELECT 1`
    console.log('✅ Banco conectado\n')
  } catch (e) {
    console.error('❌ Falha na conexão:', String(e))
    process.exit(1)
  }

  // 2. Buscar menu_full do banco
  let menuData
  try {
    const rows = await sql`SELECT value FROM site_content WHERE key = 'menu_full' LIMIT 1`
    if (!rows.length) {
      console.error('❌ menu_full não encontrado. Acesse o painel e sincronize o cardápio primeiro.')
      process.exit(1)
    }
    menuData = rows[0].value
    console.log(`📋 ${menuData.sections?.length} seções encontradas no banco\n`)
  } catch (e) {
    console.error('❌ Erro ao buscar menu_full:', String(e))
    process.exit(1)
  }

  const sections = menuData.sections
  if (!sections?.length) {
    console.error('❌ Nenhuma seção no menu_full')
    process.exit(1)
  }

  // 3. Processar cada foto
  let updatedCount = 0
  const files = fs.readdirSync(FOTOS_DIR).filter(f => !f.startsWith('.'))

  for (const filename of files) {
    const mapping = PHOTO_MAP[filename]
    if (!mapping) {
      console.log(`⚠️  Sem mapeamento para: "${filename}" — pulando`)
      continue
    }

    const { itemName, sectionId, longDesc } = mapping
    console.log(`📸 ${filename}`)
    console.log(`   → "${itemName}" | seção: ${sectionId}`)

    // Salvar imagem no banco
    let photoUrl
    try {
      const filePath = path.join(FOTOS_DIR, filename)
      photoUrl = await saveImageToDb(filePath, filename)
      const sizekb = Math.round(fs.statSync(path.join(FOTOS_DIR, filename)).size / 1024)
      console.log(`   ✅ Imagem salva no banco (${sizekb} KB) → ${photoUrl}`)
    } catch (e) {
      console.error(`   ❌ Erro ao salvar imagem: ${String(e)}`)
      continue
    }

    // Encontrar seção
    const section = sections.find(s => s.id === sectionId)
    if (!section) {
      console.log(`   ❌ Seção "${sectionId}" não encontrada`)
      continue
    }

    // Encontrar item — normaliza acentos e pontuação para comparação
    const normalize = s => s.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '').trim()

    let item = section.items.find(it => normalize(it.name) === normalize(itemName))
    if (!item) {
      // Fallback: match na primeira palavra significativa
      const firstWord = normalize(itemName).split(' ')[0]
      item = section.items.find(it => normalize(it.name).startsWith(firstWord))
    }

    if (!item) {
      console.log(`   ❌ Item "${itemName}" não encontrado na seção`)
      console.log(`      Itens disponíveis: ${section.items.map(i => i.name).join(', ')}`)
      continue
    }

    item.photo_url = photoUrl
    item.long_desc = longDesc
    console.log(`   ✅ Item atualizado: "${item.name}"`)
    updatedCount++
    console.log()
  }

  // 4. Salvar menu_full atualizado
  if (updatedCount === 0) {
    console.log('\n⚠️  Nenhum item foi atualizado.')
    await sql.end()
    return
  }

  console.log(`\n💾 Salvando menu_full com ${updatedCount} fotos no banco...`)
  try {
    const newValue = JSON.stringify(menuData)
    await sql`
      INSERT INTO site_content (key, value, updated_by, updated_at)
      VALUES ('menu_full', ${newValue}::jsonb, 'seed-script', now())
      ON CONFLICT (key) DO UPDATE
        SET value = EXCLUDED.value,
            updated_by = 'seed-script',
            updated_at = now()
    `
    console.log(`✅ Concluído! ${updatedCount} itens do cardápio receberam foto e descrição.`)
    console.log('🔄 O cardápio atualiza automaticamente na próxima visita (cache: 5 min).')
  } catch (e) {
    console.error('❌ Erro ao salvar menu_full:', String(e))
  }

  await sql.end()
}

main().catch(async e => {
  console.error('\n❌ Erro fatal:', String(e))
  console.error(e)
  try { await sql.end() } catch {}
  process.exit(1)
})

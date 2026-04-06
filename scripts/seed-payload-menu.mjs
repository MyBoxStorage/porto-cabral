/**
 * seed-payload-menu.mjs
 * Popula a tabela menu_items do Payload CMS com todos os pratos do cardápio.
 * Seguro para re-executar: faz TRUNCATE antes de inserir.
 *
 * Uso: node scripts/seed-payload-menu.mjs
 * Requer: PC_DATABASE_URL no .env.local
 */
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import postgres from 'postgres'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

function loadEnvLocal() {
  const raw = readFileSync(join(root, '.env.local'), 'utf8')
  const out = {}
  for (const line of raw.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const k = t.slice(0, i).trim()
    let v = t.slice(i + 1).trim()
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1)
    out[k] = v
  }
  return out
}

// cat = category (enum value do Payload), featured/vegan/lactose_free = boolean
// price_note sobrescreve price na exibição (ex: '780/kg')
const ALL_ITEMS = [
  // ENTRADAS QUENTES
  { name:'Vieiras Canadenses',       cat:'entradas-quentes', desc:'6 un. na manteiga de ervas e pesto.',                                   price:199 },
  { name:'Camarão à Romana',         cat:'entradas-quentes', desc:'Empanado com queijo parmesão.',                                          price:162 },
  { name:'Camarão Soltinho',         cat:'entradas-quentes', desc:'Empanado.',                                                              price:142 },
  { name:'Camarão Alho e Óleo',      cat:'entradas-quentes', desc:'Grelhado ao alho e óleo.',                                              price:149 },
  { name:'Ostra Gratinada',          cat:'entradas-quentes', desc:'12 unidades.',                                                          price:99  },
  { name:'Ostra ao Bafo',            cat:'entradas-quentes', desc:'12 un. com espuma de manga e limão siciliano.',                         price:99  },
  { name:'Mariscada à Marago',       cat:'entradas-quentes', desc:'Mariscos com leite de coco, manteiga de ervas e temperos frescos.',     price:89  },
  { name:'Isca de Mignon',           cat:'entradas-quentes', desc:'Grelhadas e aceboladas.',                                               price:139 },
  { name:'Isca de Peixe Empanadas',  cat:'entradas-quentes',                                                                               price:139 },
  { name:'Lula à Milanesa',          cat:'entradas-quentes', desc:'Empanada ao gergelim.',                                                 price:119 },
  { name:'Bolinho de Camarão',       cat:'entradas-quentes', desc:'1 unidade.',                                                            price:24  },
  { name:'Bolinho de Lagosta',       cat:'entradas-quentes', desc:'1 unidade.',                                                            price:29  },
  { name:'Bolinho de Bacalhau',      cat:'entradas-quentes', desc:'6 unidades.',                                                           price:74  },
  { name:'Batata Frita',             cat:'entradas-quentes', desc:'400g.',                                                                 price:42  },
  { name:'Descobridor de 7 Mares',   cat:'entradas-quentes', desc:'Camarão soltinho, isca de peixe, lula ao gergelim e batata frita.',     price:239, featured:true },
  { name:'Dadinho de Bacalhau',      cat:'entradas-quentes', desc:'6 un. com vinagrete de polvo.',                                        price:79  },
  { name:'Burrata ao Pomodoro',      cat:'entradas-quentes', desc:'Burrata empanada no panko, pães artesanais e molho pomodoro.',          price:109 },
  // ENTRADAS FRIAS
  { name:'Tartare de Atum e Salmão',       cat:'entradas-frias', desc:'Base de abacate, cream cheese, crispy de alho-poró e chips de batata doce.',    price:99  },
  { name:'Ceviche — Salmão ou Tilápia',    cat:'entradas-frias', desc:'Cebola roxa, maçã verde e crispy de alho poró.',                                 price:94  },
  { name:'Bruschettas de Salmão Defumado', cat:'entradas-frias', desc:'Focaccia, mostarda dijon, salmão defumado e raspas de limão siciliano. 4 un.',   price:89  },
  { name:'Burrata Caprese',                cat:'entradas-frias', desc:'Burrata de tomate confit com foccaccia e presunto parma. Prato frio.',            price:109 },
  { name:'Steak Tartare',                  cat:'entradas-frias', desc:'Mignon com especiarias, azeite de ervas, gema de ovo e chips de batata doce.',   price:109 },
  { name:'Tábua de Frios',                 cat:'entradas-frias', desc:'Parma, presunto, salaminho, queijos, frutas, pães e geleia de pimenta. (Sob disponibilidade)', price:139 },
  // SALADAS
  { name:'Salada Mediterrânea',       cat:'saladas', desc:'Folhas, caesar, manga, parmesão, lula, polvo e camarão grelhado.',            price:259 },
  { name:'Salada de Camarão',         cat:'saladas', desc:'Folhas, abacate, gorgonzola, mostarda e mel, camarão panko e teryaki.',       price:99  },
  { name:'Salada de Salmão Defumado', cat:'saladas', desc:'Folhas, repolho roxo, gruyere, damasco, morango, amêndoas e mostarda e mel.', price:99  },
  { name:'Salada Mista',              cat:'saladas', desc:'Beterraba, cenoura, grão de bico, rúcula, tomate, pepino e palmito.',         price:84, vegan:true },
  // IGUARIAS DO MAR
  { name:'Capitão Cabral',       cat:'iguarias-do-mar', desc:'Polvo à moda da casa com arroz cremoso de limão siciliano, pimentões e batata sauté.',                  price:319, featured:true },
  { name:'A Imperatriz',         cat:'iguarias-do-mar', desc:'Polvo à lagareiro com alho em lascas, batatas aos murros e arroz com brócolis.',                         price:319 },
  { name:'Paella do Porto',      cat:'iguarias-do-mar', desc:'Prato típico com arroz, marisco, lula, polvo e camarão.',                                                price:299 },
  { name:'Sol Poente',           cat:'iguarias-do-mar', desc:'Fritada de frutos do mar, polvo, camarão, peixe e lula com molho de camarão.',                           price:309 },
  { name:'Tesouros do Mar',      cat:'iguarias-do-mar', desc:'4 filés de lagosta, 4 camarões, 250g de congrio ou salmão, 4 bolinhos e 4 ostras gratinadas.',           price:499, featured:true },
  { name:'Ohana',                cat:'iguarias-do-mar', desc:'Salmão grelhado, 4 ostras gratinadas, 4 bolinhos, 4 camarões à romana e arroz cremoso.',                 price:339 },
  { name:'Lagosta Grelhada',     cat:'iguarias-do-mar', desc:'Grelhada na manteiga com batatas gratinadas e molho de camarão.',                                        price:399 },
  { name:'Lagosta a Fiorentina', cat:'iguarias-do-mar', desc:'Grelhada e gratinada com espinafre e bacon, guarnecida de batata palha.',                                price:399 },
  { name:'Lagosta ao Champagne', cat:'iguarias-do-mar', desc:'Grelhada ao molho cremoso de espumante com batata sauté.',                                               price:399 },
  { name:'Estrela do Mar',       cat:'iguarias-do-mar', desc:'Moqueca de peixe e camarão com farofa de dendê e batata sauté.',                                         price:289 },
  { name:'King Crab',            cat:'iguarias-do-mar', desc:'King crab inteiro e molhos especiais.',                           price_note:'780/kg',                    featured:true },
  // PEIXES
  { name:'Bacalhau às Natas',                      cat:'peixes', desc:'Bacalhau em lascas ao molho de nata. Arroz branco e batata palha.',                          price:289 },
  { name:'Bacalhau à Portuguesa',                  cat:'peixes', desc:'Bacalhau confitado no azeite de oliva. Arroz branco e batata ao murro.',                     price:289 },
  { name:'Bacalhau na Crosta de Grão de Bico',     cat:'peixes', desc:'Com arroz branco, legumes e batatas gratinadas.',                                            price:289 },
  { name:'Congrio com Castanha e Banana',          cat:'peixes', desc:'Grelhado na cama de banana ao molho de castanha do Pará.',                                  price:269 },
  { name:'Peixe a Pomodoro',                       cat:'peixes', desc:'4 enrolados de linguado com palmito ao molho pomodoro.',                                     price:259 },
  { name:'Belle Meunière — Congrio',               cat:'peixes', desc:'Grelhado com alcaparras, champignon e camarão.',                                            price:269 },
  { name:'Belle Meunière — Salmão / Linguado',     cat:'peixes', desc:'Grelhado com alcaparras, champignon e camarão.',                                            price:259 },
  { name:'Almirante do Porto — Congrio',           cat:'peixes', desc:'Com legumes, batata portuguesa, arroz com brócolis e molho de camarão.',                    price:269 },
  { name:'Almirante do Porto — Salmão / Linguado', cat:'peixes', desc:'Com legumes, batata portuguesa, arroz com brócolis e molho de camarão.',                    price:259 },
  { name:'Peixe à Fiorentina — Congrio',           cat:'peixes', desc:'Gratinado com espinafre e bacon. Arroz branco e batata palha.',                             price:269 },
  { name:'Peixe à Fiorentina — Salmão / Linguado', cat:'peixes', desc:'Gratinado com espinafre e bacon. Arroz branco e batata palha.',                            price:259 },
  // CAMARÕES
  { name:'Camarão Grelhado',       cat:'camaroes', desc:'Grelhados com batatas gratinadas e molho de camarão.',                                  price:289 },
  { name:'Camarão à Girassol',     cat:'camaroes', desc:'Com casca, arroz cremoso, bacon e batatas sauté.',                                      price:289 },
  { name:'Camarão à La Grega',     cat:'camaroes', desc:'Empanados com queijo prato, arroz à grega e batata frita.',                             price:289 },
  { name:'Camarão a La Maragogi',  cat:'camaroes', desc:'Cremoso com leite de coco, batata frita e legumes.',                                    price:289 },
  { name:'Camarão a La Cordazzo',  cat:'camaroes', desc:'Grelhado ao molho de nata com rúcula, tomate seco e batata sauté.',                     price:289 },
  { name:'Camarão a Catupiry',     cat:'camaroes', desc:'Gratinado ao molho branco com catupiry e batata palha.',                                price:289 },
  { name:'Pérola do Porto',        cat:'camaroes', desc:'Empanados com catupiry, arroz cremoso com limão, parmesão e crispy de alho poró.',      price:289, featured:true },
  { name:'Costa del Mar',          cat:'camaroes', desc:'4 grelhados, 4 à grega, 4 à romana e 250g gratinados com batata frita.',                price:429, featured:true },
  // TRATTORIA
  { name:'Nhoque à Zanzibar',           cat:'trattoria', desc:'Ao molho de nata com queijo gorgonzola e manjericão fresco.',                         price:129 },
  { name:'Fettuccine de Salmão',        cat:'trattoria', desc:'Ao molho de nata com tomate seco, azeitona e lascas de salmão.',                     price:219 },
  { name:'Filé à Duxelles',             cat:'trattoria', desc:'Filé mignon ao molho de nata e cebola, massa pappardelle com cogumelos.',            price:219 },
  { name:'Risoto Carret de Cordeiro',   cat:'trattoria', desc:'Risoto de gorgonzola com carré de cordeiro ao molho de vinho tinto.',                price:259, featured:true },
  { name:'Risoto de Camarão',           cat:'trattoria',                                                                                             price:289 },
  { name:'Risoto de Mignon com Funghi', cat:'trattoria', desc:'Cubos de mignon e funghi.',                                                          price:219 },
  // CARNES & AVES
  { name:'Filé Mignon a Parmegiana', cat:'carnes-aves', desc:'Guarnecido de arroz branco e fritas.',                                                price:219 },
  { name:'Picanha do Capitão',       cat:'carnes-aves', desc:'4 fatias de picanha, polenta frita, aipim com bacon. Arroz com brócolis e farofa.',   price:229, featured:true },
  { name:'Frango à Brasileira',      cat:'carnes-aves', desc:'Grelhado com arroz de ovo, farofa especial, batata frita e banana a milanesa.',       price:149 },
  { name:'Filé ao Molho Poivre',     cat:'carnes-aves', desc:'Filé ao molho de pimenta do reino em grãos, conhaque, manteiga e nata.',             price:219 },
  { name:'Frango na Mostarda',       cat:'carnes-aves', desc:'Filé de frango ao molho de mostarda.',                                                price:149 },
  // DA HORTA AO PRATO
  { name:'A(MAR)',         cat:'horta-ao-prato', desc:'Fettucine com legumes.',                                               price:59, vegan:true },
  { name:'Mahalo',         cat:'horta-ao-prato', desc:'Isca de peixe vegetal, arroz, feijão, batata frita e salada.',         price:59, vegan:true },
  { name:'Moqueca Vegana', cat:'horta-ao-prato', desc:'Moqueca de vegetais e legumes.',                                       price:59, vegan:true },
  // SOBREMESAS
  { name:'Pérola Negra',           cat:'sobremesas', desc:'Brownie de chocolate com calda, amêndoas laminadas, sorvete de creme e morango.',  price:35 },
  { name:'Pudim Tradicional',      cat:'sobremesas', desc:'Pudim a base de leite de ovelha.',                                                 price:35, lactose_free:true },
  { name:'Pudim de Doce de Leite', cat:'sobremesas', desc:'Pudim a base de leite de ovelha com doce de leite.',                               price:35, lactose_free:true },
  { name:'Pudim de Pistache',      cat:'sobremesas', desc:'Pudim a base de leite de ovelha com pistache.',                                    price:35, lactose_free:true },
  { name:'Crème Brûlée',           cat:'sobremesas', desc:'Creme de leite, açúcar, leite de ovelha, baunilha e gema de ovos.',               price:45, lactose_free:true },
  // BEBIDAS
  { name:'Água',                cat:'bebidas', desc:'Com ou sem gás.',                                               price:8  },
  { name:'Água San Pellegrino', cat:'bebidas',                                                                       price:38 },
  { name:'Água Acqua Panna',    cat:'bebidas',                                                                       price:38 },
  { name:'Água de Coco',        cat:'bebidas',                                                                       price:20 },
  { name:'Refrigerante',        cat:'bebidas', desc:'Coca-Cola, Coca Zero, Guaraná, Sprite, Tônica e versões Zero.', price:9  },
  { name:'Sucos',               cat:'bebidas', desc:'Laranja, limão, abacaxi, abacaxi com hortelã e maracujá.',      price:14 },
  { name:'Suco de Uva',         cat:'bebidas',                                                                       price:18 },
  { name:'Limonada Suíça',      cat:'bebidas', desc:'Com leite condensado e água com gás.',                         price:18 },
  { name:'Soda Italiana',       cat:'bebidas', desc:'Maçã verde, limão siciliano ou frutas vermelhas.',             price:16 },
  { name:'Chá da Casa',         cat:'bebidas', desc:'Chá gelado de mate, mel, limão e gengibre.',                   price:18 },
  { name:'Chopp',               cat:'bebidas',                                                                       price:16 },
  { name:'Chopp IPA',           cat:'bebidas',                                                                       price:18 },
  { name:'Heineken',            cat:'bebidas', desc:'Long neck.',                                                    price:16 },
  { name:'Heineken Zero',       cat:'bebidas', desc:'Long neck.',                                                    price:16 },
  { name:'Corona',              cat:'bebidas', desc:'Long neck.',                                                    price:16 },
  { name:'Red Bull',            cat:'bebidas', desc:'Consulte os sabores.',                                         price:20 },
  // DRINKS & CAIPIRINHAS
  { name:'Blue Ocean',               cat:'drinks', desc:'Malibu, vodka, sprite e curaçao azul. ✦ Autoral Porto Cabral',                         price:48, featured:true },
  { name:'Love on Board',            cat:'drinks', desc:'Sake, xarope de frutas vermelhas e espumante de gengibre. ✦ Autoral',                   price:28 },
  { name:'Relax',                    cat:'drinks', desc:'Gin, chá de camomila, maracujá, hortelã, limão e bitter. ✦ Autoral',                    price:38 },
  { name:'Éden',                     cat:'drinks', desc:'Gin, xarope de maçã verde, limão, energético tropical e espuma de gengibre.',            price:45 },
  { name:'New York Sour',            cat:'drinks', desc:'Mistura clarificada e vinho.',                                                          price:52 },
  { name:'Porto Dubai',              cat:'drinks', desc:'Xarope de romã, vinho do porto, siciliano e whisky.',                                   price:69, featured:true },
  { name:'Moscow Mule',              cat:'drinks', desc:'Vodka, limão, xarope de gengibre, hortelã e espuma de gengibre.',                       price:34 },
  { name:'Aperol Spritz',            cat:'drinks', desc:'Aperol, espumante brut, água com gás e laranja.',                                      price:34 },
  { name:'Mojito',                   cat:'drinks', desc:'Rum, hortelã e água com gás.',                                                         price:32 },
  { name:'Negroni',                  cat:'drinks', desc:'Gin, vermouth Rosso, Campari e laranja.',                                               price:38 },
  { name:'Gin Tônica',               cat:'drinks', desc:'Gin e água tônica com limão.',                                                         price:32 },
  { name:'Holandês Voador',          cat:'drinks', desc:'Xarope de frutas vermelhas, curaçau blue, laranja e tequila.',                          price:36 },
  { name:'Caipirinha Clássica',      cat:'drinks', desc:'Vodka, cachaça, vinho ou sakê. Limão, morango, abacaxi, maracujá ou kiwi.',             price:30 },
  { name:'Caipira Tropical Especial', cat:'drinks', desc:'Morango + kiwi + maracujá ou gengibre + caju + manjericão.',                           price:42 },
]

// ── Main ───────────────────────────────────────────────────────────────────
const env = loadEnvLocal()
const dbUrl = env.PC_DATABASE_URL
if (!dbUrl) {
  console.error('❌  PC_DATABASE_URL não encontrado no .env.local')
  process.exit(1)
}

const sql = postgres(dbUrl, { ssl: 'require', max: 1 })

try {
  console.log('🔌  Conectado ao banco de dados.')
  console.log(`📋  ${ALL_ITEMS.length} itens a inserir...`)

  // TRUNCATE garante idempotência — seguro re-executar quantas vezes quiser
  await sql`TRUNCATE menu_items RESTART IDENTITY CASCADE`
  console.log('🗑   Tabela menu_items limpa.')

  // Insere com sort_order sequencial por categoria
  const counters = {}
  let inserted = 0
  for (const item of ALL_ITEMS) {
    counters[item.cat] = (counters[item.cat] ?? 0) + 1
    await sql`
      INSERT INTO menu_items (name, category, description, price, price_note, featured, available, vegan, lactose_free, sort_order)
      VALUES (
        ${item.name},
        ${item.cat},
        ${item.desc ?? null},
        ${item.price ?? null},
        ${item.price_note ?? null},
        ${item.featured ?? false},
        ${true},
        ${item.vegan ?? false},
        ${item.lactose_free ?? false},
        ${counters[item.cat]}
      )
    `
    inserted++
  }

  console.log(`\n✅  ${inserted} pratos inseridos com sucesso.\n`)

  const rows = await sql`SELECT category, COUNT(*) as total FROM menu_items GROUP BY category ORDER BY category`
  console.log('📊  Resumo por categoria:')
  for (const r of rows) console.log(`   ${String(r.category).padEnd(22)} ${r.total} itens`)

  console.log('\n🎯  Próximo passo — sincronize o cardápio:')
  console.log('    Opção A: Painel admin → aba "Cardápio" → botão "Sincronizar Cardápio"')
  console.log('    Opção B: curl -X POST https://SEU_DOMINIO/api/admin/sync-menu \\')
  console.log('                  -H "x-sync-key: SEU_SYNC_MENU_SECRET"')

} catch (err) {
  console.error('❌  Erro:', err.message)
  process.exit(1)
} finally {
  await sql.end()
}

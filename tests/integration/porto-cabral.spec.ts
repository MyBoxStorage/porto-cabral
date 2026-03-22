/**
 * Testes de integração — Porto Cabral BC
 * Executar com: npx tsx tests/integration/porto-cabral.spec.ts
 * (requer a app rodando em localhost:3000)
 */
export {}

const BASE = process.env.TEST_BASE_URL ?? 'http://localhost:3000'

async function post(path: string, body: unknown) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return { status: res.status, data: await res.json().catch(() => ({})) }
}

async function get(path: string) {
  const res = await fetch(`${BASE}${path}`)
  return { status: res.status, data: await res.json().catch(() => ({})) }
}

function assert(condition: boolean, msg: string) {
  if (!condition) { console.error(`  ✗ FALHOU: ${msg}`); process.exitCode = 1 }
  else console.log(`  ✓ ${msg}`)
}

async function run(label: string, fn: () => Promise<void>) {
  console.log(`\n▶ ${label}`)
  try { await fn() }
  catch (e) { console.error('  ✗ ERRO:', e); process.exitCode = 1 }
}

await run('1 — POST /api/reserva — reserva válida', async () => {
  const { status, data } = await post('/api/reserva', {
    name: 'Teste Integração', email: 'teste@portocabralbc.com.br',
    whatsapp: '47999999999', reservation_date: '2026-12-31',
    reservation_time: '20:00', party_size: 2, optin_accepted: true, locale: 'pt',
  })
  assert(status === 200, `status 200 (recebeu ${status})`)
  assert(data.success === true, 'data.success === true')
  assert(typeof data.reservationId === 'string', 'reservationId é string')
})

await run('2 — POST /api/reserva — schema inválido retorna 400', async () => {
  const { status } = await post('/api/reserva', { name: 'X', email: 'invalido' })
  assert(status === 400, `status 400 (recebeu ${status})`)
})

await run('3 — GET /api/reviews — retorna estrutura correta', async () => {
  const { status, data } = await get('/api/reviews')
  assert(status === 200 || status === 503, `status 200 ou 503 (recebeu ${status})`)
  if (status === 200) assert(Array.isArray(data.reviews), 'data.reviews é array')
})

await run('4 — GET /api/cliente/reservas sem auth retorna 401', async () => {
  const { status } = await get('/api/cliente/reservas')
  assert(status === 401, `status 401 (recebeu ${status})`)
})

await run('5 — POST /api/cliente/quiz sem auth retorna 401', async () => {
  const { status } = await post('/api/cliente/quiz', { visit_frequency: 'monthly' })
  assert(status === 401, `status 401 (recebeu ${status})`)
})

await run('6 — PUT /api/cliente/perfil sem auth retorna 401', async () => {
  const res = await fetch(`${BASE}/api/cliente/perfil`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Teste' }),
  })
  assert(res.status === 401, `status 401 (recebeu ${res.status})`)
})

console.log('\n─────────────────────────────────────────')
console.log(process.exitCode ? '❌ Alguns testes falharam.' : '✅ Todos os testes passaram!')
console.log('─────────────────────────────────────────\n')

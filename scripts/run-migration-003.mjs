/**
 * Executa supabase/migrations/003_site_content_videos.sql usando PC_DATABASE_URL ou DATABASE_URI do .env.local
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
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1)
    }
    out[k] = v
  }
  return out
}

function withPooler6543(url) {
  try {
    const u = new URL(url.replace(/^postgresql:/, 'http:'))
    if (u.port === '5432' || u.port === '') {
      u.port = '6543'
    }
    return 'postgresql:' + u.toString().replace(/^http:/, '')
  } catch {
    return url
  }
}

function ensureSslMode(url) {
  if (!/[?&]sslmode=/.test(url)) {
    return url + (url.includes('?') ? '&' : '?') + 'sslmode=require'
  }
  return url
}

const env = loadEnvLocal()
const baseUrl = env.PC_DATABASE_URL || env.DATABASE_URI
if (!baseUrl) {
  console.error('Defina PC_DATABASE_URL ou DATABASE_URI no .env.local')
  process.exit(1)
}

const sqlPath = join(root, 'supabase/migrations/003_site_content_videos.sql')
const full = readFileSync(sqlPath, 'utf8')
const chunks = full
  .split(';')
  .map((s) => s.replace(/--[^\n]*/g, '').trim())
  .filter((s) => s.length > 0)

async function runWithUrl(url) {
  const db = postgres(url, { max: 1, prepare: false, ssl: 'require' })
  try {
    for (const chunk of chunks) {
      await db.unsafe(chunk + ';')
    }
  } finally {
    await db.end()
  }
}

const forcePooler = process.argv.includes('--pooler')
const urlsToTry = forcePooler
  ? [ensureSslMode(withPooler6543(baseUrl))]
  : [ensureSslMode(baseUrl), ensureSslMode(withPooler6543(baseUrl))]

let lastErr
for (let i = 0; i < urlsToTry.length; i++) {
  const u = urlsToTry[i]
  const label = u.includes(':6543') ? 'pooler :6543' : 'direto :5432'
  try {
    if (urlsToTry.length > 1) console.log(`Tentando Postgres (${label})…`)
    await runWithUrl(u)
    console.log('OK: 003_site_content_videos.sql aplicado no Postgres.')
    process.exit(0)
  } catch (e) {
    lastErr = e
    const timeout =
      e?.code === 'ETIMEDOUT' ||
      (e?.name === 'AggregateError' &&
        e?.errors?.some((x) => x?.code === 'ETIMEDOUT'))
    if (timeout && i < urlsToTry.length - 1) {
      console.warn(`Timeout em ${label}; tentando pooler…`)
      continue
    }
    break
  }
}

console.error('Erro ao executar SQL:', lastErr?.message || lastErr)
if (lastErr?.code) console.error('code:', lastErr.code)
if (lastErr?.detail) console.error('detail:', lastErr.detail)
process.exit(1)

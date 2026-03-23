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

const env = loadEnvLocal()
const url = env.PC_DATABASE_URL || env.DATABASE_URI
if (!url) {
  console.error('Defina PC_DATABASE_URL ou DATABASE_URI no .env.local')
  process.exit(1)
}

const sqlPath = join(root, 'supabase/migrations/003_site_content_videos.sql')
const sql = readFileSync(sqlPath, 'utf8')

const db = postgres(url, { max: 1, prepare: false, ssl: 'require' })
try {
  await db.unsafe(sql)
  console.log('OK: 003_site_content_videos.sql aplicado no Postgres.')
} catch (e) {
  console.error('Erro ao executar SQL:', e.message)
  process.exit(1)
} finally {
  await db.end()
}

import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

type Db = ReturnType<typeof drizzle<typeof schema>>

let _client: ReturnType<typeof postgres> | null = null
let _db: Db | null = null

export function getDb(): Db {
  const connectionString = process.env.PC_DATABASE_URL
  if (!connectionString) {
    throw new Error('PC_DATABASE_URL is not configured')
  }
  if (!_db) {
    // Troca porta 5432 (Session mode) por 6543 (Transaction mode)
    // Transaction mode suporta muitas conexões simultâneas em serverless
    const txUrl = connectionString.replace(':5432/', ':6543/')
    _client = postgres(txUrl, {
      max: 1,
      prepare: false,
      ssl: 'require',
      connect_timeout: 15,
      idle_timeout: 20,
    })
    _db = drizzle(_client, { schema })
  }
  return _db
}

export { schema }

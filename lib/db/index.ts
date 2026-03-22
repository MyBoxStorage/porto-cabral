import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from './schema'

type Db = ReturnType<typeof drizzle<typeof schema>>

let _client: ReturnType<typeof postgres> | null = null
let _db: Db | null = null

export function getDb(): Db {
  const connectionString = process.env.DATABASE_URI
  if (!connectionString) {
    throw new Error('DATABASE_URI is not configured')
  }
  if (!_db) {
    _client = postgres(connectionString, { max: 1, prepare: false })
    _db = drizzle(_client, { schema })
  }
  return _db
}

export { schema }

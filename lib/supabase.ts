import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL_PC
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PC
const serviceRoleKey  = process.env.PC_SUPABASE_SERVICE_ROLE_KEY

export function createSupabaseBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL_PC and NEXT_PUBLIC_SUPABASE_ANON_KEY_PC are required')
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

export function createSupabaseAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL_PC and PC_SUPABASE_SERVICE_ROLE_KEY are required')
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

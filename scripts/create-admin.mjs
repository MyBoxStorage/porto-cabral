// scripts/create-admin.mjs
// Cria ou atualiza o usuario admin no Supabase Auth
// Uso: node scripts/create-admin.mjs

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL_PC
const SERVICE_KEY  = process.env.PC_SUPABASE_SERVICE_ROLE_KEY

const EMAIL    = process.env.ADMIN_EMAIL    // ex: admin@portocabralbc.com.br
const PASSWORD = process.env.ADMIN_PASSWORD // senha forte, min 16 chars

if (!SUPABASE_URL || !SERVICE_KEY || !EMAIL || !PASSWORD) {
  console.error('Defina as variáveis: NEXT_PUBLIC_SUPABASE_URL_PC, PC_SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, ADMIN_PASSWORD')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// Verifica se usuario ja existe
const { data: list } = await supabase.auth.admin.listUsers()
const existing = list?.users?.find(u => u.email === EMAIL)

if (existing) {
  // Atualiza senha
  const { error } = await supabase.auth.admin.updateUserById(existing.id, {
    password: PASSWORD,
    email_confirm: true,
  })
  if (error) {
    console.error('Erro ao atualizar:', error.message)
    process.exit(1)
  }
  console.log(`OK: usuario ${EMAIL} atualizado com nova senha`)
} else {
  // Cria novo
  const { error } = await supabase.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
    user_metadata: { name: 'Admin Porto Cabral' },
  })
  if (error) {
    console.error('Erro ao criar:', error.message)
    process.exit(1)
  }
  console.log(`OK: usuario ${EMAIL} criado com sucesso`)
}

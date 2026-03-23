// scripts/create-admin.mjs
// Cria ou atualiza o usuario admin no Supabase Auth
// Uso: node scripts/create-admin.mjs

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://zoigiwmgddweiaagtdcv.supabase.co'
const SERVICE_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvaWdpd21nZGR3ZWlhYWd0ZGN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDIwMjcyNywiZXhwIjoyMDg5Nzc4NzI3fQ.9htQ8uJ8UfLH2Y3LqdxAwcwElLfEn9H1_lfNncGoWBY'

const EMAIL    = 'admin@admin.com.br'
const PASSWORD = '123456789'

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

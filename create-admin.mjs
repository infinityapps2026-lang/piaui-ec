/**
 * Cria o usuário super_admin inicial.
 * ANTES de rodar: execute o SQL de migração no Supabase dashboard.
 *
 * Como usar:
 *   1. Preencha SERVICE_ROLE_KEY (Supabase → Settings → API → service_role)
 *   2. Preencha SENHA desejada
 *   3. node create-admin.mjs
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://rwfecphtxrwxhzuctudk.supabase.co'
const SERVICE_ROLE_KEY = 'COLE_AQUI_A_SERVICE_ROLE_KEY'

const EMAIL = 'contato1gabriel@gmail.com'
const SENHA  = 'COLE_AQUI_A_SENHA'
const NOME   = 'Gabriel'

if (SERVICE_ROLE_KEY === 'COLE_AQUI_A_SERVICE_ROLE_KEY') {
  console.error('Erro: preencha SERVICE_ROLE_KEY antes de rodar.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// Verifica se já existe no auth
const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
if (listError) { console.error('Erro:', listError.message); process.exit(1) }

const existing = users.find((u) => u.email === EMAIL)
let userId = existing?.id

if (existing) {
  console.log('Usuário já existe no auth. Apenas atualizando role...')
} else {
  const { data, error } = await supabase.auth.admin.createUser({
    email: EMAIL,
    password: SENHA,
    email_confirm: true,
  })
  if (error) { console.error('Erro ao criar usuário:', error.message); process.exit(1) }
  userId = data.user.id
  console.log('Usuário criado. ID:', userId)
}

const { error: profileError } = await supabase
  .from('profiles')
  .update({ nome: NOME, role: 'super_admin' })
  .eq('id', userId)

if (profileError) {
  console.error('Erro ao atualizar perfil (rodou o SQL de migração?):', profileError.message)
  process.exit(1)
}

console.log('✓ super_admin configurado com sucesso!')
console.log('  Email:', EMAIL)
console.log('  Role:  super_admin')

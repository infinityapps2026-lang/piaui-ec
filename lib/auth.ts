import { createClient } from './supabase-server'
import { redirect } from 'next/navigation'
import { type Role, ROLE_WEIGHT } from './types'

export type { Role }
export { ROLE_WEIGHT }

export async function getCurrentUserWithRole() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { user: null, role: null as Role | null, nome: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, nome, ativo')
    .eq('id', user.id)
    .single()

  return {
    user,
    role: (profile?.role ?? 'editor') as Role,
    nome: (profile?.nome ?? null) as string | null,
    ativo: profile?.ativo ?? true,
  }
}

export async function requireRole(allowedRoles: Role[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, ativo')
    .eq('id', user.id)
    .single()

  const role = (profile?.role ?? 'editor') as Role
  const ativo = profile?.ativo ?? true

  if (!ativo || !allowedRoles.includes(role)) redirect('/admin')

  return { user, role }
}

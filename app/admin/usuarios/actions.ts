'use server'

import { requireRole } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase-admin'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function criarUsuario(formData: FormData) {
  await requireRole(['super_admin'])

  const email = formData.get('email') as string
  const senha = formData.get('senha') as string
  const nome = formData.get('nome') as string
  const role = formData.get('role') as string

  const supabase = createAdminClient()

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
  })

  if (error) throw new Error(error.message)

  await supabase
    .from('profiles')
    .update({ nome, role })
    .eq('id', data.user.id)

  revalidatePath('/admin/usuarios')
  redirect('/admin/usuarios')
}

export async function atualizarUsuario(id: string, formData: FormData) {
  await requireRole(['super_admin'])

  const nome = formData.get('nome') as string
  const role = formData.get('role') as string

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('profiles')
    .update({ nome, role })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/usuarios')
  redirect('/admin/usuarios')
}

export async function toggleAtivo(formData: FormData) {
  await requireRole(['super_admin'])

  const id = formData.get('id') as string
  const ativo = formData.get('ativo') === 'true'

  const supabase = createAdminClient()

  const { error } = await supabase
    .from('profiles')
    .update({ ativo: !ativo })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/usuarios')
}

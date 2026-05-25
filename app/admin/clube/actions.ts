'use server'

import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function atualizarInfo(id: string, formData: FormData) {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const { error } = await supabase
    .from('clube_info')
    .update({
      titulo: formData.get('titulo') as string,
      conteudo: formData.get('conteudo') as string,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/clube')
  redirect('/admin/clube')
}

export async function criarInfo(formData: FormData) {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const chave = (formData.get('chave') as string)
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')

  const { error } = await supabase.from('clube_info').insert({
    chave,
    titulo: formData.get('titulo') as string,
    conteudo: formData.get('conteudo') as string,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/admin/clube')
  redirect('/admin/clube')
}

export async function deletarInfo(formData: FormData) {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const { error } = await supabase.from('clube_info').delete().eq('id', formData.get('id'))
  if (error) throw new Error(error.message)

  revalidatePath('/admin/clube')
}

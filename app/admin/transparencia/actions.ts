'use server'

import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function criarDocumento(formData: FormData) {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const { error } = await supabase.from('transparencia').insert({
    titulo: formData.get('titulo') as string,
    descricao: (formData.get('descricao') as string) || null,
    tipo: formData.get('tipo') as string,
    valor: toDecimal(formData.get('valor')),
    arquivo_url: (formData.get('arquivo_url') as string) || null,
    data_documento: (formData.get('data_documento') as string) || null,
    publicado: formData.get('publicado') === 'true',
  })

  if (error) throw new Error(error.message)

  revalidatePath('/admin/transparencia')
  redirect('/admin/transparencia')
}

export async function atualizarDocumento(id: string, formData: FormData) {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const { error } = await supabase
    .from('transparencia')
    .update({
      titulo: formData.get('titulo') as string,
      descricao: (formData.get('descricao') as string) || null,
      tipo: formData.get('tipo') as string,
      valor: toDecimal(formData.get('valor')),
      arquivo_url: (formData.get('arquivo_url') as string) || null,
      data_documento: (formData.get('data_documento') as string) || null,
      publicado: formData.get('publicado') === 'true',
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/transparencia')
  redirect('/admin/transparencia')
}

export async function deletarDocumento(formData: FormData) {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const { error } = await supabase.from('transparencia').delete().eq('id', formData.get('id'))
  if (error) throw new Error(error.message)

  revalidatePath('/admin/transparencia')
}

function toDecimal(value: FormDataEntryValue | null): number | null {
  if (value === null || value === '') return null
  const n = parseFloat(value as string)
  return isNaN(n) ? null : n
}

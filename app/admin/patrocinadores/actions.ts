'use server'

import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function criarPatrocinador(formData: FormData) {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const { error } = await supabase.from('patrocinadores').insert({
    nome: formData.get('nome') as string,
    logo_url: (formData.get('logo_url') as string) || null,
    site_url: (formData.get('site_url') as string) || null,
    categoria: formData.get('categoria') as string,
    ativo: formData.get('ativo') === 'true',
    ordem_exibicao: toInt(formData.get('ordem_exibicao')) ?? 0,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/admin/patrocinadores')
  redirect('/admin/patrocinadores')
}

export async function atualizarPatrocinador(id: string, formData: FormData) {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const { error } = await supabase
    .from('patrocinadores')
    .update({
      nome: formData.get('nome') as string,
      logo_url: (formData.get('logo_url') as string) || null,
      site_url: (formData.get('site_url') as string) || null,
      categoria: formData.get('categoria') as string,
      ativo: formData.get('ativo') === 'true',
      ordem_exibicao: toInt(formData.get('ordem_exibicao')) ?? 0,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/patrocinadores')
  redirect('/admin/patrocinadores')
}

export async function deletarPatrocinador(formData: FormData) {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const { error } = await supabase.from('patrocinadores').delete().eq('id', formData.get('id'))
  if (error) throw new Error(error.message)

  revalidatePath('/admin/patrocinadores')
}

function toInt(value: FormDataEntryValue | null): number | null {
  if (value === null || value === '') return null
  const n = parseInt(value as string, 10)
  return isNaN(n) ? null : n
}

'use server'

import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type ClassificacaoFormState = { error: string | null }

export async function criarTime(prevState: ClassificacaoFormState, formData: FormData): Promise<ClassificacaoFormState> {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const { error } = await supabase.from('classificacao').insert({
    grupo:      formData.get('grupo') as string,
    pos:        parseInt(formData.get('pos') as string, 10),
    nome:       formData.get('nome') as string,
    pts:        parseInt(formData.get('pts') as string, 10),
    j:          parseInt(formData.get('j') as string, 10),
    v:          parseInt(formData.get('v') as string, 10),
    e:          parseInt(formData.get('e') as string, 10),
    d:          parseInt(formData.get('d') as string, 10),
    sg:         formData.get('sg') as string,
    classified: formData.get('classified') === 'true',
    highlight:  formData.get('highlight') === 'true',
  })

  if (error) return { error: error.message }

  revalidatePath('/admin/classificacao')
  redirect('/admin/classificacao')
}

export async function atualizarTime(id: string, prevState: ClassificacaoFormState, formData: FormData): Promise<ClassificacaoFormState> {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const { error } = await supabase
    .from('classificacao')
    .update({
      grupo:      formData.get('grupo') as string,
      pos:        parseInt(formData.get('pos') as string, 10),
      nome:       formData.get('nome') as string,
      pts:        parseInt(formData.get('pts') as string, 10),
      j:          parseInt(formData.get('j') as string, 10),
      v:          parseInt(formData.get('v') as string, 10),
      e:          parseInt(formData.get('e') as string, 10),
      d:          parseInt(formData.get('d') as string, 10),
      sg:         formData.get('sg') as string,
      classified: formData.get('classified') === 'true',
      highlight:  formData.get('highlight') === 'true',
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/classificacao')
  redirect('/admin/classificacao')
}

export async function deletarTime(formData: FormData) {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const { error } = await supabase.from('classificacao').delete().eq('id', formData.get('id'))
  if (error) throw new Error(error.message)

  revalidatePath('/admin/classificacao')
}

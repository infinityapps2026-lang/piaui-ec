'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function criarJogador(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { error } = await supabase.from('jogadores').insert({
    nome: formData.get('nome') as string,
    apelido: (formData.get('apelido') as string) || null,
    numero: toInt(formData.get('numero')),
    posicao: formData.get('posicao') as string,
    foto: (formData.get('foto') as string) || null,
    data_nascimento: (formData.get('data_nascimento') as string) || null,
    altura_cm: toInt(formData.get('altura_cm')),
    pe_dominante: (formData.get('pe_dominante') as string) || null,
    ativo: formData.get('ativo') === 'true',
    ordem_exibicao: toInt(formData.get('ordem_exibicao')) ?? 0,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/admin/elenco')
  redirect('/admin/elenco')
}

export async function atualizarJogador(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { error } = await supabase
    .from('jogadores')
    .update({
      nome: formData.get('nome') as string,
      apelido: (formData.get('apelido') as string) || null,
      numero: toInt(formData.get('numero')),
      posicao: formData.get('posicao') as string,
      foto: (formData.get('foto') as string) || null,
      data_nascimento: (formData.get('data_nascimento') as string) || null,
      altura_cm: toInt(formData.get('altura_cm')),
      pe_dominante: (formData.get('pe_dominante') as string) || null,
      ativo: formData.get('ativo') === 'true',
      ordem_exibicao: toInt(formData.get('ordem_exibicao')) ?? 0,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/elenco')
  redirect('/admin/elenco')
}

export async function deletarJogador(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { error } = await supabase.from('jogadores').delete().eq('id', formData.get('id'))
  if (error) throw new Error(error.message)

  revalidatePath('/admin/elenco')
}

function toInt(value: FormDataEntryValue | null): number | null {
  if (value === null || value === '') return null
  const n = parseInt(value as string, 10)
  return isNaN(n) ? null : n
}

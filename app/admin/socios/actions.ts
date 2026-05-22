'use server'

import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function criarSocio(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { error } = await supabase.from('socios').insert({
    nome_completo: formData.get('nome_completo') as string,
    cpf: (formData.get('cpf') as string) || null,
    email: (formData.get('email') as string) || null,
    telefone: (formData.get('telefone') as string) || null,
    plano: formData.get('plano') as string,
    status: formData.get('status') as string,
    cep: (formData.get('cep') as string) || null,
    logradouro: (formData.get('logradouro') as string) || null,
    numero: (formData.get('numero') as string) || null,
    complemento: (formData.get('complemento') as string) || null,
    bairro: (formData.get('bairro') as string) || null,
    cidade: (formData.get('cidade') as string) || null,
    uf: (formData.get('uf') as string) || null,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/admin/socios')
  redirect('/admin/socios')
}

export async function atualizarSocio(id: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { error } = await supabase
    .from('socios')
    .update({
      nome_completo: formData.get('nome_completo') as string,
      cpf: (formData.get('cpf') as string) || null,
      email: (formData.get('email') as string) || null,
      telefone: (formData.get('telefone') as string) || null,
      plano: formData.get('plano') as string,
      status: formData.get('status') as string,
      cep: (formData.get('cep') as string) || null,
      logradouro: (formData.get('logradouro') as string) || null,
      numero: (formData.get('numero') as string) || null,
      complemento: (formData.get('complemento') as string) || null,
      bairro: (formData.get('bairro') as string) || null,
      cidade: (formData.get('cidade') as string) || null,
      uf: (formData.get('uf') as string) || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/socios')
  redirect('/admin/socios')
}

export async function deletarSocio(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { error } = await supabase.from('socios').delete().eq('id', formData.get('id'))
  if (error) throw new Error(error.message)

  revalidatePath('/admin/socios')
}

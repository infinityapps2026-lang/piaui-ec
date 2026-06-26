'use server'

import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type PlanoFormState = { error: string | null }

function parseFeatures(formData: FormData): string[] {
  const raw = (formData.get('features') as string) ?? ''
  return raw
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean)
}

export async function atualizarPlano(id: string, prevState: PlanoFormState, formData: FormData): Promise<PlanoFormState> {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const nome = (formData.get('nome') as string ?? '').trim()
  if (!nome) return { error: 'Informe o nome do plano.' }

  const { error } = await supabase
    .from('planos')
    .update({
      nome,
      preco:    (formData.get('preco') as string).trim(),
      periodo:  (formData.get('periodo') as string).trim(),
      tagline:  (formData.get('tagline') as string).trim(),
      features: parseFeatures(formData),
      cta:      (formData.get('cta') as string).trim(),
      btn_url:  (formData.get('btn_url') as string).trim(),
      badge:    (formData.get('badge') as string).trim() || null,
      featured: formData.get('featured') === 'true',
      ativo:    formData.get('ativo') === 'true',
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/admin/planos')
  redirect('/admin/planos')
}

export async function criarPlano(prevState: PlanoFormState, formData: FormData): Promise<PlanoFormState> {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const tipo = (formData.get('tipo') as string)?.trim()
  if (tipo !== 'pf' && tipo !== 'pj') {
    return { error: 'Tipo deve ser "pf" (Pessoa Física) ou "pj" (Empresas).' }
  }

  const ordemRaw = (formData.get('ordem') as string)?.trim()
  const ordem = ordemRaw ? Number(ordemRaw) : null

  const { error } = await supabase
    .from('planos')
    .insert({
      tipo,
      nome:     (formData.get('nome') as string).trim(),
      preco:    (formData.get('preco') as string).trim(),
      periodo:  (formData.get('periodo') as string).trim(),
      tagline:  (formData.get('tagline') as string).trim(),
      features: parseFeatures(formData),
      cta:      (formData.get('cta') as string).trim(),
      btn_url:  (formData.get('btn_url') as string).trim(),
      badge:    (formData.get('badge') as string).trim() || null,
      featured: formData.get('featured') === 'true',
      ativo:    formData.get('ativo') !== 'false',
      ordem,
    })

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/admin/planos')
  redirect('/admin/planos')
}

export async function deletarPlano(formData: FormData) {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const id = formData.get('id') as string
  if (!id) throw new Error('ID do plano não informado.')

  const { error } = await supabase.from('planos').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/planos')
  redirect('/admin/planos')
}

export async function atualizarConfigCategoria(formData: FormData) {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const tipo = (formData.get('tipo') as string)?.trim()
  if (tipo !== 'pf' && tipo !== 'pj') throw new Error('Tipo inválido.')

  const ativo = formData.get('ativo') === 'true'

  const { error } = await supabase
    .from('planos_config')
    .upsert({ tipo, ativo }, { onConflict: 'tipo' })

  if (error) throw new Error(error.message)

  revalidatePath('/')
  revalidatePath('/admin/planos')
}

'use server'

import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type PlanoFormState = { error: string | null }

export async function atualizarPlano(id: string, prevState: PlanoFormState, formData: FormData): Promise<PlanoFormState> {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const featuresRaw = (formData.get('features') as string) ?? ''
  const features = featuresRaw
    .split('\n')
    .map((f) => f.trim())
    .filter(Boolean)

  const { error } = await supabase
    .from('planos')
    .update({
      preco:      (formData.get('preco') as string).trim(),
      periodo:    (formData.get('periodo') as string).trim(),
      tagline:    (formData.get('tagline') as string).trim(),
      features,
      cta:        (formData.get('cta') as string).trim(),
      link_botao: (formData.get('link_botao') as string).trim(),
      badge:      (formData.get('badge') as string).trim() || null,
      featured:   formData.get('featured') === 'true',
    })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/admin/planos')
  redirect('/admin/planos')
}

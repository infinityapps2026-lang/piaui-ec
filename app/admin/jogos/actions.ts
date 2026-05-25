'use server'

import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function criarJogo(formData: FormData) {
  await requireRole(['super_admin', 'admin', 'editor'])
  const supabase = await createClient()

  const { error } = await supabase.from('jogos').insert({
    competicao: formData.get('competicao') as string,
    rodada: formData.get('rodada') as string || null,
    data_jogo: formData.get('data_jogo') as string || null,
    estadio: formData.get('estadio') as string || null,
    mandante: formData.get('mandante') === 'true',
    adversario: formData.get('adversario') as string,
    adversario_uf: formData.get('adversario_uf') as string || null,
    placar_pec: toInt(formData.get('placar_pec')),
    placar_adversario: toInt(formData.get('placar_adversario')),
    status: formData.get('status') as string,
    link_ingresso: formData.get('link_ingresso') as string || null,
    escudo_pec_url: formData.get('escudo_pec_url') as string || null,
    adversario_escudo_url: formData.get('adversario_escudo_url') as string || null,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/admin/jogos')
  redirect('/admin/jogos')
}

export async function atualizarJogo(id: string, formData: FormData) {
  await requireRole(['super_admin', 'admin', 'editor'])
  const supabase = await createClient()

  const { error } = await supabase
    .from('jogos')
    .update({
      competicao: formData.get('competicao') as string,
      rodada: formData.get('rodada') as string || null,
      data_jogo: formData.get('data_jogo') as string || null,
      estadio: formData.get('estadio') as string || null,
      mandante: formData.get('mandante') === 'true',
      adversario: formData.get('adversario') as string,
      adversario_uf: formData.get('adversario_uf') as string || null,
      placar_pec: toInt(formData.get('placar_pec')),
      placar_adversario: toInt(formData.get('placar_adversario')),
      status: formData.get('status') as string,
      link_ingresso: formData.get('link_ingresso') as string || null,
      escudo_pec_url: formData.get('escudo_pec_url') as string || null,
      adversario_escudo_url: formData.get('adversario_escudo_url') as string || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/jogos')
  redirect('/admin/jogos')
}

export async function deletarJogo(formData: FormData) {
  await requireRole(['super_admin', 'admin', 'editor'])
  const supabase = await createClient()

  const { error } = await supabase.from('jogos').delete().eq('id', formData.get('id'))
  if (error) throw new Error(error.message)

  revalidatePath('/admin/jogos')
}

function toInt(value: FormDataEntryValue | null): number | null {
  if (value === null || value === '') return null
  const n = parseInt(value as string, 10)
  return isNaN(n) ? null : n
}

'use server'

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export type FormState = { error: string } | null

export async function cadastrarSocio(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const nome_completo = (formData.get('nome_completo') as string ?? '').trim()
  const email = (formData.get('email') as string ?? '').trim()
  const telefone = ((formData.get('telefone') as string) ?? '').trim() || null
  const cpf = ((formData.get('cpf') as string) ?? '').trim() || null
  const plano = formData.get('plano') as string

  if (!nome_completo || !email || !plano) {
    return { error: 'Preencha todos os campos obrigatórios.' }
  }

  const supabase = await createClient()

  const { error } = await supabase.from('socios').insert({
    nome_completo,
    email,
    telefone,
    cpf,
    plano,
    status: 'pendente',
  })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Este e-mail já está cadastrado.' }
    }
    return { error: 'Erro ao realizar cadastro. Por favor, tente novamente.' }
  }

  redirect('/seja-socio/obrigado')
}

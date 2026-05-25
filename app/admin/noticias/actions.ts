'use server'

import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function criarNoticia(formData: FormData) {
  await requireRole(['super_admin', 'admin', 'editor'])
  const supabase = await createClient()

  const titulo = formData.get('titulo') as string
  const resumo = formData.get('resumo') as string
  const conteudo = formData.get('conteudo') as string
  const categoria = formData.get('categoria') as string
  const imagem_capa = formData.get('imagem_capa') as string
  const autor = formData.get('autor') as string
  const publicado = formData.get('publicado') === 'true'
  const data_publicacao = formData.get('data_publicacao') as string

  const slug = slugify(titulo)

  const { error } = await supabase.from('noticias').insert({
    titulo,
    slug,
    resumo,
    conteudo,
    categoria,
    imagem_capa: imagem_capa || null,
    autor,
    publicado,
    data_publicacao: data_publicacao || null,
  })

  if (error) throw new Error(error.message)

  revalidatePath('/admin/noticias')
  redirect('/admin/noticias')
}

export async function atualizarNoticia(id: string, formData: FormData) {
  await requireRole(['super_admin', 'admin', 'editor'])
  const supabase = await createClient()

  const titulo = formData.get('titulo') as string
  const resumo = formData.get('resumo') as string
  const conteudo = formData.get('conteudo') as string
  const categoria = formData.get('categoria') as string
  const imagem_capa = formData.get('imagem_capa') as string
  const autor = formData.get('autor') as string
  const publicado = formData.get('publicado') === 'true'
  const data_publicacao = formData.get('data_publicacao') as string

  const slug = slugify(titulo)

  const { error } = await supabase
    .from('noticias')
    .update({
      titulo,
      slug,
      resumo,
      conteudo,
      categoria,
      imagem_capa: imagem_capa || null,
      autor,
      publicado,
      data_publicacao: data_publicacao || null,
    })
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/admin/noticias')
  redirect('/admin/noticias')
}

export async function deletarNoticia(formData: FormData) {
  await requireRole(['super_admin', 'admin', 'editor'])
  const supabase = await createClient()

  const id = formData.get('id') as string

  const { error } = await supabase.from('noticias').delete().eq('id', id)
  if (error) throw new Error(error.message)

  revalidatePath('/admin/noticias')
}

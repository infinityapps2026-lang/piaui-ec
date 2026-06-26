'use server'

import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import { CATEGORIAS_NOTICIAS } from '@/app/_lib/categorias-noticias'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export type NoticiaFormState = { error: string | null }

const CATEGORIAS_VALIDAS: Set<string> = new Set(CATEGORIAS_NOTICIAS.map((c) => c.value))

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

type NoticiaPayload = {
  titulo: string
  slug: string
  categoria: string
  resumo: string
  conteudo: string
  imagem_capa: string | null
  autor: string
  publicado: boolean
  data_publicacao: string | null
}

type ParseResult = { ok: true; payload: NoticiaPayload } | { ok: false; error: string }

function parseForm(formData: FormData): ParseResult {
  const titulo = ((formData.get('titulo') as string) ?? '').trim()
  const categoria = ((formData.get('categoria') as string) ?? '').trim()

  if (!titulo) return { ok: false, error: 'Informe o título da notícia.' }
  if (!CATEGORIAS_VALIDAS.has(categoria)) {
    return { ok: false, error: 'Selecione uma categoria válida.' }
  }

  return {
    ok: true,
    payload: {
      titulo,
      categoria,
      slug: slugify(titulo),
      resumo: ((formData.get('resumo') as string) ?? '').trim(),
      conteudo: ((formData.get('conteudo') as string) ?? '').trim(),
      imagem_capa: ((formData.get('imagem_capa') as string) ?? '').trim() || null,
      autor: ((formData.get('autor') as string) ?? '').trim(),
      publicado: formData.get('publicado') === 'true',
      data_publicacao: ((formData.get('data_publicacao') as string) ?? '').trim() || null,
    },
  }
}

export async function criarNoticia(prevState: NoticiaFormState, formData: FormData): Promise<NoticiaFormState> {
  await requireRole(['super_admin', 'admin', 'editor'])
  const supabase = await createClient()

  const parsed = parseForm(formData)
  if (!parsed.ok) return { error: parsed.error }

  const { error } = await supabase.from('noticias').insert(parsed.payload)
  if (error) return { error: error.message }

  revalidatePath('/admin/noticias')
  redirect('/admin/noticias')
}

export async function atualizarNoticia(id: string, prevState: NoticiaFormState, formData: FormData): Promise<NoticiaFormState> {
  await requireRole(['super_admin', 'admin', 'editor'])
  const supabase = await createClient()

  const parsed = parseForm(formData)
  if (!parsed.ok) return { error: parsed.error }

  const { error } = await supabase.from('noticias').update(parsed.payload).eq('id', id)
  if (error) return { error: error.message }

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

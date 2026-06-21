'use client'

import { useActionState, useRef, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { criarNoticia, atualizarNoticia, type NoticiaFormState } from '../actions'
import { CATEGORIAS_NOTICIAS } from '@/app/_lib/categorias-noticias'

type Noticia = {
  id: string
  titulo: string
  resumo: string | null
  conteudo: string | null
  categoria: string | null
  imagem_capa: string | null
  autor: string | null
  publicado: boolean
  data_publicacao: string | null
}

export default function NoticiaForm({ noticia }: { noticia?: Noticia }) {
  const boundAction = noticia
    ? atualizarNoticia.bind(null, noticia.id)
    : criarNoticia

  const [state, formAction, pending] = useActionState<NoticiaFormState, FormData>(
    boundAction,
    { error: null }
  )

  const [imagemUrl, setImagemUrl] = useState<string | null>(noticia?.imagem_capa ?? null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(file: File) {
    setUploadError(null)
    setUploading(true)
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      )
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage.from('noticias').upload(path, file, { upsert: true })
      if (error) throw new Error(error.message)
      const { data: { publicUrl } } = supabase.storage.from('noticias').getPublicUrl(path)
      setImagemUrl(publicUrl)
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Erro ao enviar imagem')
    } finally {
      setUploading(false)
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Título *
          </label>
          <input
            name="titulo"
            required
            defaultValue={noticia?.titulo ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="Título da notícia"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Categoria
          </label>
          <select
            name="categoria"
            defaultValue={noticia?.categoria ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] bg-white"
          >
            <option value="">Selecione...</option>
            {CATEGORIAS_NOTICIAS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Autor
          </label>
          <input
            name="autor"
            defaultValue={noticia?.autor ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="Nome do autor"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Data de Publicação
          </label>
          <input
            name="data_publicacao"
            type="datetime-local"
            defaultValue={
              noticia?.data_publicacao
                ? noticia.data_publicacao.slice(0, 16)
                : ''
            }
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Imagem de Capa
          </label>
          <input type="hidden" name="imagem_capa" value={imagemUrl ?? ''} />

          {imagemUrl ? (
            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagemUrl}
                alt="Prévia da capa"
                className="w-48 h-32 object-cover rounded-lg border border-slate-200 bg-slate-50"
              />
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold transition-colors"
                >
                  Trocar imagem
                </button>
                <button
                  type="button"
                  onClick={() => setImagemUrl(null)}
                  className="text-xs px-3 py-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors text-left"
                >
                  Remover
                </button>
              </div>
            </div>
          ) : (
            <label
              className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-[#0a1f4f] hover:bg-slate-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <span className="text-sm text-slate-500">Enviando...</span>
              ) : (
                <>
                  <svg className="w-8 h-8 text-slate-300 mb-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  <span className="text-sm text-slate-500 font-semibold">Clique para enviar a imagem</span>
                  <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (recomendado 1200×630)</span>
                </>
              )}
            </label>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleUpload(file)
            }}
          />

          {uploadError && (
            <p className="mt-2 text-xs text-red-600">{uploadError}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Resumo
          </label>
          <textarea
            name="resumo"
            rows={2}
            defaultValue={noticia?.resumo ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent resize-none"
            placeholder="Breve descrição para listagens e redes sociais"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Conteúdo *
          </label>
          <textarea
            name="conteudo"
            rows={12}
            required
            defaultValue={noticia?.conteudo ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent resize-y font-mono"
            placeholder="Conteúdo completo da notícia..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                name="publicado"
                type="checkbox"
                value="true"
                defaultChecked={noticia?.publicado ?? false}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-300 peer-checked:bg-[#e30613] rounded-full transition-colors" />
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
            </div>
            <span className="text-sm font-semibold text-slate-700">Publicar notícia</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={pending || uploading}
          className="px-6 py-2.5 bg-[#0a1f4f] hover:bg-[#1a3a8f] disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
        >
          {pending ? 'Salvando...' : noticia ? 'Salvar Alterações' : 'Criar Notícia'}
        </button>
        <a
          href="/admin/noticias"
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}

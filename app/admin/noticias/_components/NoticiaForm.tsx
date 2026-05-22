'use client'

import { useFormStatus } from 'react-dom'
import { criarNoticia, atualizarNoticia } from '../actions'

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

const CATEGORIAS = ['Notícia', 'Jogo', 'Contratação', 'Institucional', 'Sócio']

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2.5 bg-[#0a1f4f] hover:bg-[#1a3a8f] disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
    >
      {pending ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Criar Notícia'}
    </button>
  )
}

export default function NoticiaForm({ noticia }: { noticia?: Noticia }) {
  const action = noticia
    ? atualizarNoticia.bind(null, noticia.id)
    : criarNoticia

  return (
    <form action={action} className="space-y-6">
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
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
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

        <div>
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

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            URL da Imagem de Capa
          </label>
          <input
            name="imagem_capa"
            type="url"
            defaultValue={noticia?.imagem_capa ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="https://..."
          />
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
        <SubmitButton isEdit={!!noticia} />
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

'use client'

import { useActionState } from 'react'
import { criarInfo, atualizarInfo, type ClubeFormState } from '../actions'

type Info = {
  id: string
  chave: string
  titulo: string
  conteudo: string | null
}

export default function ClubeForm({ info }: { info?: Info }) {
  const boundAction = info ? atualizarInfo.bind(null, info.id) : criarInfo
  const [state, formAction, pending] = useActionState<ClubeFormState, FormData>(
    boundAction,
    { error: null }
  )

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {state.error}
        </div>
      )}

      {info ? (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Chave</label>
          <input
            value={info.chave}
            disabled
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-mono bg-slate-50 text-slate-400 cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 mt-1">A chave não pode ser alterada após criação.</p>
        </div>
      ) : (
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Chave (identificador) *
          </label>
          <input
            name="chave"
            required
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="ex: historia, missao, valores"
          />
          <p className="text-xs text-slate-400 mt-1">
            Identificador único usado pelo site para buscar este texto. Apenas letras, números e underscore.
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Título *</label>
        <input
          name="titulo"
          required
          defaultValue={info?.titulo ?? ''}
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
          placeholder="Ex: História do Clube"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1">Conteúdo *</label>
        <textarea
          name="conteudo"
          required
          rows={info ? 12 : 10}
          defaultValue={info?.conteudo ?? ''}
          className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent resize-y"
          placeholder="Texto completo..."
        />
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 bg-[#0a1f4f] hover:bg-[#1a3a8f] disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
        >
          {pending ? 'Salvando...' : info ? 'Salvar Alterações' : 'Criar Entrada'}
        </button>
        <a
          href="/admin/clube"
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}

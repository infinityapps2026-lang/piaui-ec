'use client'

import { useActionState } from 'react'
import { atualizarPlano, criarPlano, type PlanoFormState } from '../actions'

export type Plano = {
  id: string
  tipo: string
  nome: string
  preco: string
  periodo: string
  tagline: string
  features: string[]
  cta: string
  btn_url: string
  featured: boolean
  badge: string | null
  ordem?: number | null
}

export default function PlanoForm({ plano }: { plano?: Plano }) {
  const isNovo = !plano
  const boundAction = isNovo ? criarPlano : atualizarPlano.bind(null, plano.id)
  const [state, formAction, pending] = useActionState<PlanoFormState, FormData>(
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

      {/* Identificação (só na criação) */}
      {isNovo && (
        <div className="border-b border-slate-100 pb-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Identificação</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Nome do plano *
              </label>
              <input
                name="nome"
                required
                defaultValue=""
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
                placeholder="Ex: Sócio Bronze, Patrono PJ..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Tipo *
              </label>
              <select
                name="tipo"
                required
                defaultValue=""
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] bg-white"
              >
                <option value="">Selecione...</option>
                <option value="pf">Pessoa Física</option>
                <option value="pj">Empresas (PJ)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Ordem <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input
                name="ordem"
                type="number"
                defaultValue=""
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
                placeholder="1, 2, 3..."
              />
              <p className="text-xs text-slate-400 mt-1">Define a posição do plano no grid do site.</p>
            </div>
          </div>
        </div>
      )}

      {/* Preço */}
      <div className="border-b border-slate-100 pb-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Preço</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Valor *
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-semibold text-sm">R$</span>
              <input
                name="preco"
                required
                defaultValue={plano?.preco ?? ''}
                className="flex-1 border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent font-bold"
                placeholder="0"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">Use ponto como separador de milhar (ex: 1.999)</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Período / sufixo do preço
            </label>
            <input
              name="periodo"
              defaultValue={plano?.periodo ?? ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
              placeholder=",90 / mês"
            />
            <p className="text-xs text-slate-400 mt-1">Aparece ao lado do preço. Ex: &quot;,90 / mês&quot; ou &quot;/mês&quot;</p>
          </div>
        </div>
      </div>

      {/* Botão */}
      <div className="border-b border-slate-100 pb-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Botão de ação</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Texto do botão *
            </label>
            <input
              name="cta"
              required
              defaultValue={plano?.cta ?? ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
              placeholder="Assinar agora"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Link do botão *
            </label>
            <input
              name="btn_url"
              required
              defaultValue={plano?.btn_url ?? ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent font-mono text-xs"
              placeholder="https://... ou /seja-socio?plano=..."
            />
            <p className="text-xs text-slate-400 mt-1">URL completa ou caminho relativo (ex: /seja-socio)</p>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="border-b border-slate-100 pb-6">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Conteúdo</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Tagline</label>
            <input
              name="tagline"
              defaultValue={plano?.tagline ?? ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
              placeholder="Breve descrição do plano"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Benefícios <span className="text-slate-400 font-normal">(um por linha)</span>
            </label>
            <textarea
              name="features"
              rows={6}
              defaultValue={plano?.features?.join('\n') ?? ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent resize-y font-mono"
              placeholder={'Ingresso gratuito\n20% off na loja\nCarteirinha digital'}
            />
          </div>
        </div>
      </div>

      {/* Destaques */}
      <div className="pb-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Destaque visual</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Badge <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <input
              name="badge"
              defaultValue={plano?.badge ?? ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
              placeholder="★ Mais popular"
            />
          </div>

          <div className="flex items-end pb-1">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div className="relative">
                <input
                  name="featured"
                  type="checkbox"
                  value="true"
                  defaultChecked={plano?.featured ?? false}
                  className="sr-only peer"
                />
                <div className="w-10 h-6 bg-slate-300 peer-checked:bg-[#0a1f4f] rounded-full transition-colors" />
                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
              </div>
              <span className="text-sm font-semibold text-slate-700">Plano em destaque (borda vermelha)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 bg-[#0a1f4f] hover:bg-[#1a3a8f] disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
        >
          {pending ? 'Salvando...' : isNovo ? 'Criar Plano' : 'Salvar Alterações'}
        </button>
        <a
          href="/admin/planos"
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}

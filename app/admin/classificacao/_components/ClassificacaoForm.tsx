'use client'

import { useActionState } from 'react'
import { criarTime, atualizarTime, type ClassificacaoFormState } from '../actions'

type Time = {
  id: string
  grupo: string
  pos: number
  nome: string
  pts: number
  j: number
  v: number
  e: number
  d: number
  sg: string
  classified: boolean
  highlight: boolean
}

function Toggle({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div className="relative">
        <input name={name} type="checkbox" value="true" defaultChecked={defaultChecked} className="sr-only peer" />
        <div className="w-10 h-6 bg-slate-300 peer-checked:bg-[#0a1f4f] rounded-full transition-colors" />
        <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
      </div>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </label>
  )
}

function NumInput({ name, label, defaultValue, min = 0 }: { name: string; label: string; defaultValue?: number | string; min?: number }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1">{label}</label>
      <input
        name={name}
        type="number"
        min={min}
        required
        defaultValue={defaultValue ?? 0}
        className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
      />
    </div>
  )
}

export default function ClassificacaoForm({ time }: { time?: Time }) {
  const boundAction = time ? atualizarTime.bind(null, time.id) : criarTime
  const [state, formAction, pending] = useActionState<ClassificacaoFormState, FormData>(
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Nome */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Nome do time *</label>
          <input
            name="nome"
            required
            defaultValue={time?.nome ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="Ex: Piauí EC"
          />
        </div>

        {/* Grupo */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Grupo *</label>
          <input
            name="grupo"
            required
            defaultValue={time?.grupo ?? 'B'}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="Ex: A, B, C..."
          />
        </div>

        {/* Posição */}
        <NumInput name="pos" label="Posição *" defaultValue={time?.pos} min={1} />

        {/* Stats */}
        <div className="md:col-span-2 border-t border-slate-100 pt-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Estatísticas</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            <NumInput name="pts" label="Pts" defaultValue={time?.pts} />
            <NumInput name="j"   label="J"   defaultValue={time?.j} />
            <NumInput name="v"   label="V"   defaultValue={time?.v} />
            <NumInput name="e"   label="E"   defaultValue={time?.e} />
            <NumInput name="d"   label="D"   defaultValue={time?.d} />
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">SG</label>
              <input
                name="sg"
                required
                defaultValue={time?.sg ?? '0'}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
                placeholder="+3"
              />
            </div>
          </div>
        </div>

        {/* Flags */}
        <div className="md:col-span-2 border-t border-slate-100 pt-4 space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Marcações visuais</p>
          <Toggle name="classified" label="Zona de classificação (destaque verde)" defaultChecked={time?.classified ?? false} />
          <Toggle name="highlight" label="Piauí EC (destaque vermelho)" defaultChecked={time?.highlight ?? false} />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 bg-[#0a1f4f] hover:bg-[#1a3a8f] disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
        >
          {pending ? 'Salvando...' : time ? 'Salvar Alterações' : 'Adicionar Time'}
        </button>
        <a
          href="/admin/classificacao"
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}

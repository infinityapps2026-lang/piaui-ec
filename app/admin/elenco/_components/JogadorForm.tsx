'use client'

import { useFormStatus } from 'react-dom'
import { criarJogador, atualizarJogador } from '../actions'

type Jogador = {
  id: string
  nome: string
  apelido: string | null
  numero: number | null
  posicao: string
  foto: string | null
  data_nascimento: string | null
  altura_cm: number | null
  pe_dominante: string | null
  ativo: boolean
  ordem_exibicao: number | null
}

const POSICOES = [
  'Goleiro',
  'Lateral Direito',
  'Lateral Esquerdo',
  'Zagueiro',
  'Volante',
  'Meio-Campo',
  'Meia-Atacante',
  'Atacante',
  'Centroavante',
]

const PES = ['Direito', 'Esquerdo', 'Ambidestro']

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2.5 bg-[#0a1f4f] hover:bg-[#1a3a8f] disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
    >
      {pending ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Cadastrar Jogador'}
    </button>
  )
}

export default function JogadorForm({ jogador }: { jogador?: Jogador }) {
  const action = jogador
    ? atualizarJogador.bind(null, jogador.id)
    : criarJogador

  return (
    <form action={action} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Nome completo */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Nome completo *
          </label>
          <input
            name="nome"
            required
            defaultValue={jogador?.nome ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="Ex: João da Silva"
          />
        </div>

        {/* Apelido */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Apelido / Nome de guerra
          </label>
          <input
            name="apelido"
            defaultValue={jogador?.apelido ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="Ex: Joãozinho"
          />
        </div>

        {/* Número */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Número da camisa
          </label>
          <input
            name="numero"
            type="number"
            min={1}
            max={99}
            defaultValue={jogador?.numero ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="Ex: 10"
          />
        </div>

        {/* Posição */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Posição *
          </label>
          <select
            name="posicao"
            required
            defaultValue={jogador?.posicao ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] bg-white"
          >
            <option value="">Selecione...</option>
            {POSICOES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Pé dominante */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Pé dominante
          </label>
          <select
            name="pe_dominante"
            defaultValue={jogador?.pe_dominante ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] bg-white"
          >
            <option value="">Selecione...</option>
            {PES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Data de nascimento */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Data de nascimento
          </label>
          <input
            name="data_nascimento"
            type="date"
            defaultValue={jogador?.data_nascimento?.slice(0, 10) ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
          />
        </div>

        {/* Altura */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Altura (cm)
          </label>
          <input
            name="altura_cm"
            type="number"
            min={150}
            max={220}
            defaultValue={jogador?.altura_cm ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="Ex: 180"
          />
        </div>

        {/* Ordem de exibição */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Ordem de exibição
          </label>
          <input
            name="ordem_exibicao"
            type="number"
            min={0}
            defaultValue={jogador?.ordem_exibicao ?? 0}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
          />
        </div>

        {/* URL da foto */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            URL da foto
          </label>
          <input
            name="foto"
            type="url"
            defaultValue={jogador?.foto ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="https://..."
          />
        </div>

        {/* Ativo */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                name="ativo"
                type="checkbox"
                value="true"
                defaultChecked={jogador?.ativo ?? true}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-300 peer-checked:bg-[#0a1f4f] rounded-full transition-colors" />
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
            </div>
            <span className="text-sm font-semibold text-slate-700">Jogador ativo no elenco</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <SubmitButton isEdit={!!jogador} />
        <a
          href="/admin/elenco"
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}

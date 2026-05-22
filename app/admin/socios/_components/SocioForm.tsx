'use client'

import { useFormStatus } from 'react-dom'
import { criarSocio, atualizarSocio } from '../actions'

type Socio = {
  id: string
  nome_completo: string
  cpf: string | null
  email: string | null
  telefone: string | null
  plano: string
  status: string
  cep: string | null
  logradouro: string | null
  numero: string | null
  complemento: string | null
  bairro: string | null
  cidade: string | null
  uf: string | null
}

const PLANOS = ['Torcedor', 'Sócio Prata', 'Sócio Ouro', 'Sócio Master']

const STATUS_OPTIONS = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'pendente', label: 'Pendente' },
  { value: 'inativo', label: 'Inativo' },
  { value: 'cancelado', label: 'Cancelado' },
]

const UFS = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA',
  'MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN',
  'RO','RR','RS','SC','SE','SP','TO',
]

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-2.5 bg-[#0a1f4f] hover:bg-[#1a3a8f] disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
    >
      {pending ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Cadastrar Sócio'}
    </button>
  )
}

export default function SocioForm({ socio }: { socio?: Socio }) {
  const action = socio ? atualizarSocio.bind(null, socio.id) : criarSocio

  return (
    <form action={action} className="space-y-8">

      {/* Dados pessoais */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Dados pessoais</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nome completo *</label>
            <input
              name="nome_completo"
              required
              defaultValue={socio?.nome_completo ?? ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
              placeholder="Nome completo"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">CPF</label>
            <input
              name="cpf"
              defaultValue={socio?.cpf ?? ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
              placeholder="000.000.000-00"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Telefone</label>
            <input
              name="telefone"
              defaultValue={socio?.telefone ?? ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
              placeholder="(86) 99999-9999"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
            <input
              name="email"
              type="email"
              defaultValue={socio?.email ?? ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
              placeholder="email@exemplo.com"
            />
          </div>
        </div>
      </div>

      {/* Plano e status */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Associação</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Plano *</label>
            <select
              name="plano"
              required
              defaultValue={socio?.plano ?? ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] bg-white"
            >
              <option value="">Selecione...</option>
              {PLANOS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Status *</label>
            <select
              name="status"
              required
              defaultValue={socio?.status ?? 'pendente'}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] bg-white"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Endereço</p>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">CEP</label>
            <input
              name="cep"
              defaultValue={socio?.cep ?? ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
              placeholder="00000-000"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Logradouro</label>
            <input
              name="logradouro"
              defaultValue={socio?.logradouro ?? ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
              placeholder="Rua, Avenida..."
            />
          </div>

          <div className="md:col-span-1">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Número</label>
            <input
              name="numero"
              defaultValue={socio?.numero ?? ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
              placeholder="Nº"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Complemento</label>
            <input
              name="complemento"
              defaultValue={socio?.complemento ?? ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
              placeholder="Apto, Bloco..."
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Bairro</label>
            <input
              name="bairro"
              defaultValue={socio?.bairro ?? ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
              placeholder="Bairro"
            />
          </div>

          <div className="md:col-span-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Cidade</label>
            <input
              name="cidade"
              defaultValue={socio?.cidade ?? ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
              placeholder="Teresina"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">UF</label>
            <select
              name="uf"
              defaultValue={socio?.uf ?? 'PI'}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] bg-white"
            >
              <option value="">—</option>
              {UFS.map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <SubmitButton isEdit={!!socio} />
        <a
          href="/admin/socios"
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}

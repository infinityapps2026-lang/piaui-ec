'use client'

import { useState, useRef } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { criarJogo, atualizarJogo } from '../actions'

type Jogo = {
  id: string
  competicao: string
  rodada: string | null
  data_jogo: string | null
  estadio: string | null
  mandante: boolean
  adversario: string
  adversario_uf: string | null
  escudo_pec_url: string | null
  adversario_escudo_url: string | null
  placar_pec: number | null
  placar_adversario: number | null
  status: string
  link_ingresso: string | null
}

const STATUS_OPTIONS = [
  { value: 'agendado', label: 'Agendado' },
  { value: 'ao_vivo', label: 'Ao vivo' },
  { value: 'encerrado', label: 'Encerrado' },
  { value: 'cancelado', label: 'Cancelado' },
]

const UFS = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA',
  'MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN',
  'RO','RR','RS','SC','SE','SP','TO',
]

type EscudoState = { file: File | null; preview: string | null }

function EscudoUpload({
  label,
  state,
  onChange,
  onRemove,
}: {
  label: string
  state: EscudoState
  onChange: (file: File) => void
  onRemove: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>

      {state.preview ? (
        <div className="flex flex-col items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={state.preview}
            alt={label}
            className="w-24 h-24 object-contain rounded-lg border border-slate-200 bg-slate-50 p-2 shadow-sm"
          />
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-700 underline"
          >
            Remover
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-28 h-28 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-[#0a1f4f] hover:bg-slate-50 transition-colors">
          <svg className="w-8 h-8 text-slate-300 mb-1.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          <span className="text-[11px] text-slate-400 text-center leading-tight px-2">
            PNG, JPG<br />ou SVG
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) onChange(file)
            }}
          />
        </label>
      )}
    </div>
  )
}

export default function JogoForm({ jogo }: { jogo?: Jogo }) {
  const [escudoPec, setEscudoPec] = useState<EscudoState>({
    file: null,
    preview: jogo?.escudo_pec_url ?? null,
  })
  const [escudoAdv, setEscudoAdv] = useState<EscudoState>({
    file: null,
    preview: jogo?.adversario_escudo_url ?? null,
  })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function uploadEscudo(file: File): Promise<string> {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    )
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('escudos')
      .upload(path, file, { upsert: true })
    if (uploadError) throw new Error(uploadError.message)
    const { data: { publicUrl } } = supabase.storage.from('escudos').getPublicUrl(path)
    return publicUrl
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setUploading(true)

    try {
      const formData = new FormData(e.currentTarget)

      let pecUrl: string | null = escudoPec.preview && !escudoPec.file ? escudoPec.preview : null
      let advUrl: string | null = escudoAdv.preview && !escudoAdv.file ? escudoAdv.preview : null

      if (escudoPec.file) pecUrl = await uploadEscudo(escudoPec.file)
      if (escudoAdv.file) advUrl = await uploadEscudo(escudoAdv.file)

      formData.set('escudo_pec_url', pecUrl ?? '')
      formData.set('adversario_escudo_url', advUrl ?? '')

      if (jogo) {
        await atualizarJogo(jogo.id, formData)
      } else {
        await criarJogo(formData)
      }
    } catch (err) {
      if (isRedirectError(err)) throw err
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
      setUploading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Competição */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Competição *</label>
          <input
            name="competicao"
            required
            defaultValue={jogo?.competicao ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="Ex: Campeonato Piauiense 2026"
          />
        </div>

        {/* Rodada */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Rodada</label>
          <input
            name="rodada"
            defaultValue={jogo?.rodada ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="Ex: 1ª Rodada, Semifinal"
          />
        </div>

        {/* Data e hora */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Data e hora</label>
          <input
            name="data_jogo"
            type="datetime-local"
            defaultValue={jogo?.data_jogo ? jogo.data_jogo.slice(0, 16) : ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
          />
        </div>

        {/* Estádio */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Estádio</label>
          <input
            name="estadio"
            defaultValue={jogo?.estadio ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="Ex: Albertão"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Status *</label>
          <select
            name="status"
            required
            defaultValue={jogo?.status ?? 'agendado'}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] bg-white"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* ===== ESCUDOS ===== */}
        <div className="md:col-span-2 border-t border-slate-100 pt-5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-5">Escudos dos times</p>

          <div className="flex items-center justify-around gap-6 bg-slate-50 rounded-xl p-6 border border-slate-200">
            <EscudoUpload
              label="Piauí EC"
              state={escudoPec}
              onChange={(file) => setEscudoPec({ file, preview: URL.createObjectURL(file) })}
              onRemove={() => setEscudoPec({ file: null, preview: null })}
            />

            <div className="text-2xl font-black text-slate-300">×</div>

            <EscudoUpload
              label="Adversário"
              state={escudoAdv}
              onChange={(file) => setEscudoAdv({ file, preview: URL.createObjectURL(file) })}
              onRemove={() => setEscudoAdv({ file: null, preview: null })}
            />
          </div>
        </div>

        {/* ===== ADVERSÁRIO ===== */}
        <div className="md:col-span-2 border-t border-slate-100 pt-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Adversário</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Nome do adversário *</label>
              <input
                name="adversario"
                required
                defaultValue={jogo?.adversario ?? ''}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
                placeholder="Ex: River-PI"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">UF do adversário</label>
              <select
                name="adversario_uf"
                defaultValue={jogo?.adversario_uf ?? ''}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] bg-white"
              >
                <option value="">Selecione...</option>
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div className="relative">
                  <input
                    name="mandante"
                    type="checkbox"
                    value="true"
                    defaultChecked={jogo?.mandante ?? true}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-6 bg-slate-300 peer-checked:bg-[#0a1f4f] rounded-full transition-colors" />
                  <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                </div>
                <span className="text-sm font-semibold text-slate-700">Piauí EC é o mandante (joga em casa)</span>
              </label>
            </div>
          </div>
        </div>

        {/* ===== PLACAR ===== */}
        <div className="md:col-span-2 border-t border-slate-100 pt-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            Placar <span className="font-normal normal-case">(preencher apenas após o jogo)</span>
          </p>
          <div className="grid grid-cols-2 gap-6 max-w-xs">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Piauí EC</label>
              <input
                name="placar_pec"
                type="number"
                min={0}
                defaultValue={jogo?.placar_pec ?? ''}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
                placeholder="—"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Adversário</label>
              <input
                name="placar_adversario"
                type="number"
                min={0}
                defaultValue={jogo?.placar_adversario ?? ''}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm text-center font-bold focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
                placeholder="—"
              />
            </div>
          </div>
        </div>

        {/* Link ingresso */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Link para ingressos</label>
          <input
            name="link_ingresso"
            type="url"
            defaultValue={jogo?.link_ingresso ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={uploading}
          className="px-6 py-2.5 bg-[#0a1f4f] hover:bg-[#1a3a8f] disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
        >
          {uploading ? 'Enviando imagens...' : jogo ? 'Salvar Alterações' : 'Criar Jogo'}
        </button>
        <a
          href="/admin/jogos"
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}

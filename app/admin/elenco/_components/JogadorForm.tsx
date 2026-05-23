'use client'

import { useState, FormEvent } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import { criarJogador, atualizarJogador } from '../actions'
import { Upload, X, UserCircle } from 'lucide-react'

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
const BUCKET = 'jogadores'

export default function JogadorForm({ jogador }: { jogador?: Jogador }) {
  const [pending, setPending] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [foto, setFoto] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(jogador?.foto ?? null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFoto(f)
    setPreview(URL.createObjectURL(f))
  }

  function removerFoto() {
    setFoto(null)
    setPreview(null)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setErro(null)

    try {
      const formData = new FormData(e.currentTarget)
      let fotoUrl = jogador?.foto ?? ''

      if (foto) {
        const supabase = createClient()
        const ext = foto.name.split('.').pop()
        const path = `${Date.now()}.${ext}`

        const { data: upload, error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, foto, { upsert: false })

        if (uploadError) throw new Error(`Erro no upload: ${uploadError.message}`)

        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(upload.path)

        fotoUrl = publicUrl
      } else if (!preview) {
        fotoUrl = ''
      }

      formData.set('foto', fotoUrl)

      if (jogador) {
        await atualizarJogador(jogador.id, formData)
      } else {
        await criarJogador(formData)
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro inesperado')
      setPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {erro}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Foto */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Foto do jogador</label>
          <div className="flex items-start gap-6">
            {/* Preview */}
            <div className="w-24 h-28 border-2 border-dashed border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
              {preview ? (
                <Image
                  src={preview}
                  alt="Foto"
                  width={96}
                  height={112}
                  className="w-full h-full object-cover"
                  unoptimized={preview.startsWith('blob:')}
                />
              ) : (
                <UserCircle className="w-10 h-10 text-slate-300" />
              )}
            </div>

            {/* Ações */}
            <div className="flex flex-col gap-2 justify-center">
              <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                {preview ? 'Trocar foto' : 'Enviar foto'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {preview && (
                <button
                  type="button"
                  onClick={removerFoto}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Remover
                </button>
              )}
              <p className="text-xs text-slate-400">PNG ou JPG. Preferencialmente formato retrato.</p>
            </div>
          </div>
          {foto && (
            <p className="text-xs text-blue-600 mt-2 font-medium">
              {foto.name} — será enviado ao salvar
            </p>
          )}
        </div>

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
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 bg-[#0a1f4f] hover:bg-[#1a3a8f] disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
        >
          {pending ? 'Salvando...' : jogador ? 'Salvar Alterações' : 'Cadastrar Jogador'}
        </button>
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

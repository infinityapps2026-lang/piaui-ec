'use client'

import { useState, FormEvent } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { criarPatrocinador, atualizarPatrocinador } from '../actions'
import { ImageIcon, Upload, X } from 'lucide-react'

type Patrocinador = {
  id: string
  nome: string
  logo_url: string | null
  site_url: string | null
  categoria: string
  ativo: boolean
  ordem_exibicao: number | null
}

const CATEGORIAS = ['Master', 'Ouro', 'Prata', 'Bronze', 'Apoiador']
const BUCKET = 'patrocinadores'

export default function PatrocinadorForm({ pat }: { pat?: Patrocinador }) {
  const [pending, setPending] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [imagem, setImagem] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(pat?.logo_url ?? null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setImagem(f)
    setPreview(URL.createObjectURL(f))
  }

  function removerImagem() {
    setImagem(null)
    setPreview(null)
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setErro(null)

    try {
      const formData = new FormData(e.currentTarget)
      let logoUrl = pat?.logo_url ?? ''

      if (imagem) {
        const supabase = createClient()
        const ext = imagem.name.split('.').pop()
        const path = `${Date.now()}.${ext}`

        const { data: upload, error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, imagem, { upsert: false })

        if (uploadError) throw new Error(`Erro no upload: ${uploadError.message}`)

        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(upload.path)

        logoUrl = publicUrl
      } else if (!preview) {
        logoUrl = ''
      }

      formData.set('logo_url', logoUrl)

      if (pat) {
        await atualizarPatrocinador(pat.id, formData)
      } else {
        await criarPatrocinador(formData)
      }
    } catch (err) {
      if (isRedirectError(err)) throw err
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

        {/* Logo */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Logo</label>
          <div className="flex items-start gap-6">
            <div className="w-32 h-20 border-2 border-dashed border-slate-200 rounded-lg overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
              {preview ? (
                <Image
                  src={preview}
                  alt="Logo"
                  width={128}
                  height={80}
                  className="w-full h-full object-contain p-2"
                  unoptimized={preview.startsWith('blob:')}
                />
              ) : (
                <ImageIcon className="w-8 h-8 text-slate-300" />
              )}
            </div>

            <div className="flex flex-col gap-2 justify-center">
              <label className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                {preview ? 'Trocar imagem' : 'Enviar logo'}
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
                  onClick={removerImagem}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                  Remover
                </button>
              )}
              <p className="text-xs text-slate-400">PNG, JPG, SVG ou WebP. Fundo transparente recomendado.</p>
            </div>
          </div>
          {imagem && (
            <p className="text-xs text-blue-600 mt-2 font-medium">
              {imagem.name} — será enviado ao salvar
            </p>
          )}
        </div>

        {/* Nome */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Nome *</label>
          <input
            name="nome"
            required
            defaultValue={pat?.nome ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="Ex: Empresa XYZ"
          />
        </div>

        {/* Categoria */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Categoria *</label>
          <select
            name="categoria"
            required
            defaultValue={pat?.categoria ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] bg-white"
          >
            <option value="">Selecione...</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Ordem */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Ordem de exibição</label>
          <input
            name="ordem_exibicao"
            type="number"
            min={0}
            defaultValue={pat?.ordem_exibicao ?? 0}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
          />
        </div>

        {/* Site */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">Site (URL)</label>
          <input
            name="site_url"
            type="url"
            defaultValue={pat?.site_url ?? ''}
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
                defaultChecked={pat?.ativo ?? true}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-300 peer-checked:bg-[#0a1f4f] rounded-full transition-colors" />
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
            </div>
            <span className="text-sm font-semibold text-slate-700">Exibir no site</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 bg-[#0a1f4f] hover:bg-[#1a3a8f] disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
        >
          {pending ? 'Salvando...' : pat ? 'Salvar Alterações' : 'Cadastrar Patrocinador'}
        </button>
        <a
          href="/admin/patrocinadores"
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}

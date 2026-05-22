'use client'

import { useState, useRef, FormEvent } from 'react'
import { createClient } from '@/lib/supabase'
import { criarDocumento, atualizarDocumento } from '../actions'
import { FileText, Upload, X, ExternalLink } from 'lucide-react'

type Documento = {
  id: string
  titulo: string
  descricao: string | null
  tipo: string
  valor: number | null
  arquivo_url: string | null
  data_documento: string | null
  publicado: boolean
}

const TIPOS = [
  'Balancete',
  'Demonstrativo Financeiro',
  'Ata de Reunião',
  'Contrato',
  'Relatório de Gestão',
  'Estatuto / Regimento',
  'Edital',
  'Outros',
]

const BUCKET = 'transparencia'

export default function TransparenciaForm({ doc }: { doc?: Documento }) {
  const [pending, setPending] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [arquivoUrl, setArquivoUrl] = useState(doc?.arquivo_url ?? '')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setErro(null)

    try {
      const formData = new FormData(e.currentTarget)
      let urlFinal = arquivoUrl

      if (arquivo) {
        const supabase = createClient()
        const ext = arquivo.name.split('.').pop()
        const path = `${Date.now()}.${ext}`

        const { data: upload, error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(path, arquivo, { upsert: false })

        if (uploadError) throw new Error(`Erro no upload: ${uploadError.message}`)

        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(upload.path)

        urlFinal = publicUrl
      }

      formData.set('arquivo_url', urlFinal)

      if (doc) {
        await atualizarDocumento(doc.id, formData)
      } else {
        await criarDocumento(formData)
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro inesperado')
      setPending(false)
    }
  }

  function removerArquivo() {
    setArquivo(null)
    setArquivoUrl('')
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      {erro && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {erro}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Título */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Título *
          </label>
          <input
            name="titulo"
            required
            defaultValue={doc?.titulo ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="Ex: Balancete Maio/2026"
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Tipo *
          </label>
          <select
            name="tipo"
            required
            defaultValue={doc?.tipo ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] bg-white"
          >
            <option value="">Selecione...</option>
            {TIPOS.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        {/* Data do documento */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Data do documento
          </label>
          <input
            name="data_documento"
            type="date"
            defaultValue={doc?.data_documento?.slice(0, 10) ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
          />
        </div>

        {/* Valor */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Valor (R$)
          </label>
          <input
            name="valor"
            type="number"
            step="0.01"
            min="0"
            defaultValue={doc?.valor ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="Ex: 15000.00"
          />
        </div>

        {/* Descrição */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1">
            Descrição
          </label>
          <textarea
            name="descricao"
            rows={3}
            defaultValue={doc?.descricao ?? ''}
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent resize-none"
            placeholder="Descrição breve do documento..."
          />
        </div>

        {/* Upload de arquivo */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Arquivo PDF
          </label>

          {arquivoUrl && !arquivo ? (
            <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <FileText className="w-8 h-8 text-[#e30613] shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">Arquivo atual</p>
                <a
                  href={arquivoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#0a1f4f] hover:underline flex items-center gap-1 mt-0.5"
                >
                  Abrir documento <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <button
                type="button"
                onClick={removerArquivo}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : arquivo ? (
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <FileText className="w-8 h-8 text-blue-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-700 truncate">{arquivo.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {(arquivo.size / 1024 / 1024).toFixed(2)} MB — será enviado ao salvar
                </p>
              </div>
              <button
                type="button"
                onClick={removerArquivo}
                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-[#0a1f4f] hover:bg-slate-50 transition-colors">
              <Upload className="w-6 h-6 text-slate-400 mb-2" />
              <p className="text-sm text-slate-500 font-medium">Clique para selecionar o PDF</p>
              <p className="text-xs text-slate-400 mt-1">PDF até 10 MB</p>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) setArquivo(f)
                }}
              />
            </label>
          )}
        </div>

        {/* Publicado */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                name="publicado"
                type="checkbox"
                value="true"
                defaultChecked={doc?.publicado ?? false}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-300 peer-checked:bg-[#e30613] rounded-full transition-colors" />
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
            </div>
            <span className="text-sm font-semibold text-slate-700">Publicar no site</span>
          </label>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-slate-200">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2.5 bg-[#0a1f4f] hover:bg-[#1a3a8f] disabled:opacity-50 text-white text-sm font-bold rounded-lg transition-colors"
        >
          {pending ? 'Salvando...' : doc ? 'Salvar Alterações' : 'Cadastrar Documento'}
        </button>
        <a
          href="/admin/transparencia"
          className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors"
        >
          Cancelar
        </a>
      </div>
    </form>
  )
}

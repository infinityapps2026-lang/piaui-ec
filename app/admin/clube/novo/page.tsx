import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { criarInfo } from '../actions'

export default async function NovaInfoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/clube"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para O Clube
        </Link>
        <h1 className="text-2xl font-black text-[#0a1f4f]">Nova Entrada</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <form action={criarInfo} className="space-y-6">
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

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Título *
            </label>
            <input
              name="titulo"
              required
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
              placeholder="Ex: História do Clube"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Conteúdo *
            </label>
            <textarea
              name="conteudo"
              required
              rows={10}
              className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent resize-y"
              placeholder="Texto completo..."
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#0a1f4f] hover:bg-[#1a3a8f] text-white text-sm font-bold rounded-lg transition-colors"
            >
              Criar Entrada
            </button>
            <a
              href="/admin/clube"
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors"
            >
              Cancelar
            </a>
          </div>
        </form>
      </div>
    </div>
  )
}

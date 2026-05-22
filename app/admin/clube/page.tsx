import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import DeleteButton from './_components/DeleteButton'

export default async function ClubePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: infos } = await supabase
    .from('clube_info')
    .select('id, chave, titulo, conteudo')
    .order('chave', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0a1f4f]">O Clube</h1>
          <p className="text-slate-500 text-sm mt-1">Textos institucionais exibidos no site</p>
        </div>
        <Link
          href="/admin/clube/novo"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#e30613] hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Entrada
        </Link>
      </div>

      {!infos || infos.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <p className="text-slate-400 text-lg font-medium mb-2">Nenhuma entrada cadastrada</p>
          <p className="text-slate-400 text-sm">Clique em "Nova Entrada" para adicionar textos institucionais.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {infos.map((info) => (
            <div
              key={info.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-mono">
                      {info.chave}
                    </code>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">{info.titulo}</h3>
                  {info.conteudo && (
                    <p className="text-slate-500 text-sm mt-1 line-clamp-2 leading-relaxed">
                      {info.conteudo}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/clube/${info.id}/editar`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#0a1f4f] hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Editar
                  </Link>
                  <DeleteButton id={info.id} titulo={info.titulo} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

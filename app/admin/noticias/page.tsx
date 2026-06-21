import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import DeleteButton from './_components/DeleteButton'
import { labelCategoria } from '@/app/_lib/categorias-noticias'

export default async function NoticiasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: noticias } = await supabase
    .from('noticias')
    .select('id, titulo, categoria, autor, publicado, data_publicacao, created_at')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0a1f4f]">Notícias</h1>
          <p className="text-slate-500 text-sm mt-1">
            {noticias?.length ?? 0} notícia{(noticias?.length ?? 0) !== 1 ? 's' : ''} cadastrada{(noticias?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/noticias/nova"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#e30613] hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Notícia
        </Link>
      </div>

      {!noticias || noticias.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <p className="text-slate-400 text-lg font-medium mb-2">Nenhuma notícia cadastrada</p>
          <p className="text-slate-400 text-sm">Clique em "Nova Notícia" para começar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Título</th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600 hidden md:table-cell">Categoria</th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600 hidden lg:table-cell">Autor</th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600 hidden lg:table-cell">Data</th>
                <th className="text-center px-4 py-4 font-semibold text-slate-600">Status</th>
                <th className="px-4 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {noticias.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900 line-clamp-1">{n.titulo}</span>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell text-slate-600">
                    {labelCategoria(n.categoria) || '—'}
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell text-slate-600">
                    {n.autor ?? '—'}
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell text-slate-500 text-xs">
                    {n.data_publicacao
                      ? format(new Date(n.data_publicacao), "dd/MM/yyyy", { locale: ptBR })
                      : '—'}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        n.publicado
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {n.publicado ? 'Publicada' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/noticias/${n.id}/editar`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#0a1f4f] hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </Link>
                      <DeleteButton id={n.id} titulo={n.titulo} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, FileText, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import DeleteButton from './_components/DeleteButton'

export default async function TransparenciaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: documentos } = await supabase
    .from('transparencia')
    .select('id, titulo, tipo, valor, arquivo_url, data_documento, publicado, created_at')
    .order('data_documento', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0a1f4f]">Transparência</h1>
          <p className="text-slate-500 text-sm mt-1">
            {documentos?.length ?? 0} documento{(documentos?.length ?? 0) !== 1 ? 's' : ''} cadastrado{(documentos?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/transparencia/novo"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#e30613] hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Documento
        </Link>
      </div>

      {!documentos || documentos.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <p className="text-slate-400 text-lg font-medium mb-2">Nenhum documento cadastrado</p>
          <p className="text-slate-400 text-sm">Clique em "Novo Documento" para começar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Documento</th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600 hidden md:table-cell">Tipo</th>
                <th className="text-right px-4 py-4 font-semibold text-slate-600 hidden lg:table-cell">Valor</th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600 hidden lg:table-cell">Data</th>
                <th className="text-center px-4 py-4 font-semibold text-slate-600">Status</th>
                <th className="px-4 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documentos.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-[#e30613]" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900 truncate">{d.titulo}</p>
                        {d.arquivo_url && (
                          <a
                            href={d.arquivo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[#0a1f4f] hover:underline flex items-center gap-1 mt-0.5"
                          >
                            Ver PDF <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell text-slate-600">
                    {d.tipo ?? '—'}
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell text-right text-slate-700 font-medium tabular-nums">
                    {d.valor !== null
                      ? d.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
                      : '—'}
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell text-slate-500 text-xs whitespace-nowrap">
                    {d.data_documento
                      ? format(new Date(d.data_documento), 'dd/MM/yyyy', { locale: ptBR })
                      : '—'}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                        d.publicado
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {d.publicado ? 'Publicado' : 'Rascunho'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/transparencia/${d.id}/editar`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#0a1f4f] hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </Link>
                      <DeleteButton id={d.id} titulo={d.titulo} />
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

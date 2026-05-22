import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import DeleteButton from './_components/DeleteButton'

export default async function ClassificacaoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: times } = await supabase
    .from('classificacao')
    .select('*')
    .order('pos', { ascending: true })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0a1f4f]">Classificação</h1>
          <p className="text-slate-500 text-sm mt-1">
            {times?.length ?? 0} time{(times?.length ?? 0) !== 1 ? 's' : ''} cadastrado{(times?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/classificacao/novo"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#e30613] hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar Time
        </Link>
      </div>

      {!times || times.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <p className="text-slate-400 text-lg font-medium mb-2">Nenhum time cadastrado</p>
          <p className="text-slate-400 text-sm">Clique em "Adicionar Time" para começar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-center px-4 py-4 font-semibold text-slate-600 w-12">#</th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600">Time</th>
                <th className="text-center px-3 py-4 font-semibold text-slate-600">Grupo</th>
                <th className="text-center px-3 py-4 font-semibold text-slate-600">Pts</th>
                <th className="text-center px-3 py-4 font-semibold text-slate-600 hidden md:table-cell">J</th>
                <th className="text-center px-3 py-4 font-semibold text-slate-600 hidden md:table-cell">V</th>
                <th className="text-center px-3 py-4 font-semibold text-slate-600 hidden md:table-cell">E</th>
                <th className="text-center px-3 py-4 font-semibold text-slate-600 hidden md:table-cell">D</th>
                <th className="text-center px-3 py-4 font-semibold text-slate-600 hidden lg:table-cell">SG</th>
                <th className="px-4 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {times.map((t) => (
                <tr key={t.id} className={`hover:bg-slate-50 transition-colors ${t.highlight ? 'bg-red-50/40' : ''}`}>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center justify-center w-7 h-7 rounded font-bold text-xs ${
                      t.classified ? 'bg-green-100 text-green-700' :
                      t.highlight  ? 'bg-[#e30613] text-white' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {t.pos}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-900">{t.nome}</td>
                  <td className="px-3 py-4 text-center text-slate-500 text-xs font-bold tracking-widest">{t.grupo}</td>
                  <td className="px-3 py-4 text-center font-black text-slate-900">{t.pts}</td>
                  <td className="px-3 py-4 text-center text-slate-600 hidden md:table-cell">{t.j}</td>
                  <td className="px-3 py-4 text-center text-slate-600 hidden md:table-cell">{t.v}</td>
                  <td className="px-3 py-4 text-center text-slate-600 hidden md:table-cell">{t.e}</td>
                  <td className="px-3 py-4 text-center text-slate-600 hidden md:table-cell">{t.d}</td>
                  <td className="px-3 py-4 text-center text-slate-500 hidden lg:table-cell">{t.sg}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/classificacao/${t.id}/editar`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#0a1f4f] hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Editar
                      </Link>
                      <DeleteButton id={t.id} label={t.nome} />
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

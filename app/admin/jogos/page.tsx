import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import DeleteButton from './_components/DeleteButton'

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  agendado:  { label: 'Agendado',  className: 'bg-blue-100 text-blue-700' },
  ao_vivo:   { label: 'Ao vivo',   className: 'bg-red-100 text-red-700 animate-pulse' },
  encerrado: { label: 'Encerrado', className: 'bg-slate-100 text-slate-500' },
  cancelado: { label: 'Cancelado', className: 'bg-amber-100 text-amber-700' },
}

export default async function JogosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: jogos } = await supabase
    .from('jogos')
    .select('id, competicao, rodada, data_jogo, adversario, adversario_uf, mandante, placar_pec, placar_adversario, status')
    .order('data_jogo', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0a1f4f]">Jogos</h1>
          <p className="text-slate-500 text-sm mt-1">
            {jogos?.length ?? 0} jogo{(jogos?.length ?? 0) !== 1 ? 's' : ''} cadastrado{(jogos?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/jogos/novo"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#e30613] hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Jogo
        </Link>
      </div>

      {!jogos || jogos.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <p className="text-slate-400 text-lg font-medium mb-2">Nenhum jogo cadastrado</p>
          <p className="text-slate-400 text-sm">Clique em "Novo Jogo" para começar.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Confronto</th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600 hidden md:table-cell">Competição</th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600 hidden lg:table-cell">Data</th>
                <th className="text-center px-4 py-4 font-semibold text-slate-600">Placar</th>
                <th className="text-center px-4 py-4 font-semibold text-slate-600">Status</th>
                <th className="px-4 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {jogos.map((j) => {
                const badge = STATUS_BADGE[j.status] ?? STATUS_BADGE.agendado
                const pecEhMandante = j.mandante
                const timeCasa = pecEhMandante ? 'Piauí EC' : j.adversario
                const timeVisita = pecEhMandante ? j.adversario : 'Piauí EC'
                const placarCasa = pecEhMandante ? j.placar_pec : j.placar_adversario
                const placarVisita = pecEhMandante ? j.placar_adversario : j.placar_pec

                return (
                  <tr key={j.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">
                        {timeCasa} <span className="text-slate-400 font-normal">vs</span> {timeVisita}
                      </div>
                      {j.rodada && (
                        <div className="text-xs text-slate-400 mt-0.5">{j.rodada}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell text-slate-600 max-w-[180px]">
                      <span className="line-clamp-1">{j.competicao}</span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-slate-500 text-xs whitespace-nowrap">
                      {j.data_jogo
                        ? format(new Date(j.data_jogo), "dd/MM/yyyy HH'h'mm", { locale: ptBR })
                        : '—'}
                    </td>
                    <td className="px-4 py-4 text-center">
                      {placarCasa !== null && placarVisita !== null ? (
                        <span className="font-black text-slate-900 tabular-nums">
                          {placarCasa} × {placarVisita}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/jogos/${j.id}/editar`}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#0a1f4f] hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Editar
                        </Link>
                        <DeleteButton id={j.id} label={j.adversario} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

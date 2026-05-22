import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, Search } from 'lucide-react'
import DeleteButton from './_components/DeleteButton'

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  ativo:     { label: 'Ativo',     className: 'bg-green-100 text-green-700' },
  pendente:  { label: 'Pendente',  className: 'bg-amber-100 text-amber-700' },
  inativo:   { label: 'Inativo',   className: 'bg-slate-100 text-slate-500' },
  cancelado: { label: 'Cancelado', className: 'bg-red-100 text-red-600' },
}

const PLANO_COR: Record<string, string> = {
  'Sócio Master': 'text-yellow-700 font-bold',
  'Sócio Ouro':   'text-amber-600 font-bold',
  'Sócio Prata':  'text-slate-500 font-bold',
  'Torcedor':     'text-slate-600',
}

export default async function SociosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  const { q, status } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  let query = supabase
    .from('socios')
    .select('id, nome_completo, cpf, email, telefone, plano, status, cidade, uf')
    .order('nome_completo', { ascending: true })

  if (status) query = query.eq('status', status)
  if (q) query = query.ilike('nome_completo', `%${q}%`)

  const { data: socios, count } = await supabase
    .from('socios')
    .select('id', { count: 'exact', head: true })

  const { data: lista } = await query

  const totais = {
    total: count ?? 0,
    ativos: socios ? 0 : 0,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0a1f4f]">Sócios</h1>
          <p className="text-slate-500 text-sm mt-1">
            {totais.total} sócio{totais.total !== 1 ? 's' : ''} cadastrado{totais.total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/socios/novo"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#e30613] hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Sócio
        </Link>
      </div>

      {/* Filtros */}
      <form method="GET" className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            name="q"
            defaultValue={q ?? ''}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] focus:border-transparent"
            placeholder="Buscar por nome..."
          />
        </div>
        <select
          name="status"
          defaultValue={status ?? ''}
          className="border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f] bg-white"
        >
          <option value="">Todos os status</option>
          <option value="ativo">Ativo</option>
          <option value="pendente">Pendente</option>
          <option value="inativo">Inativo</option>
          <option value="cancelado">Cancelado</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2.5 bg-[#0a1f4f] text-white text-sm font-bold rounded-lg hover:bg-[#1a3a8f] transition-colors"
        >
          Filtrar
        </button>
        {(q || status) && (
          <a
            href="/admin/socios"
            className="px-4 py-2.5 bg-slate-100 text-slate-600 text-sm font-bold rounded-lg hover:bg-slate-200 transition-colors"
          >
            Limpar
          </a>
        )}
      </form>

      {!lista || lista.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <p className="text-slate-400 text-lg font-medium mb-2">
            {q || status ? 'Nenhum resultado encontrado' : 'Nenhum sócio cadastrado'}
          </p>
          {!q && !status && (
            <p className="text-slate-400 text-sm">Clique em "Novo Sócio" para começar.</p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 font-semibold text-slate-600">Nome</th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600 hidden md:table-cell">Contato</th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600 hidden lg:table-cell">Plano</th>
                <th className="text-left px-4 py-4 font-semibold text-slate-600 hidden lg:table-cell">Cidade</th>
                <th className="text-center px-4 py-4 font-semibold text-slate-600">Status</th>
                <th className="px-4 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {lista.map((s) => {
                const badge = STATUS_BADGE[s.status] ?? STATUS_BADGE.inativo
                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{s.nome_completo}</p>
                      {s.cpf && (
                        <p className="text-xs text-slate-400 mt-0.5">{s.cpf}</p>
                      )}
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      {s.email && <p className="text-slate-600 text-xs">{s.email}</p>}
                      {s.telefone && <p className="text-slate-500 text-xs mt-0.5">{s.telefone}</p>}
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className={`text-sm ${PLANO_COR[s.plano] ?? 'text-slate-600'}`}>
                        {s.plano}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell text-slate-500 text-xs">
                      {s.cidade && s.uf ? `${s.cidade}/${s.uf}` : s.cidade ?? '—'}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badge.className}`}>
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/socios/${s.id}/editar`}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#0a1f4f] hover:bg-slate-100 rounded-md transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Editar
                        </Link>
                        <DeleteButton id={s.id} nome={s.nome_completo} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {lista.length > 0 && (
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
              {lista.length} resultado{lista.length !== 1 ? 's' : ''} exibido{lista.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

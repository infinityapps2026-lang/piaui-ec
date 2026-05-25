import { requireRole } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase-admin'
import Link from 'next/link'
import { Plus, Pencil } from 'lucide-react'
import { ToggleAtivoButton } from './_components/ToggleAtivoButton'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { type Role } from '@/lib/types'

const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  editor: 'Editor',
}

const ROLE_COLORS: Record<Role, string> = {
  super_admin: 'bg-purple-100 text-purple-700',
  admin: 'bg-blue-100 text-blue-700',
  editor: 'bg-green-100 text-green-700',
}

type Profile = {
  id: string
  email: string
  nome: string | null
  role: string
  ativo: boolean
  created_at: string
}

export default async function UsuariosPage() {
  await requireRole(['super_admin'])

  const supabase = createAdminClient()
  const { data: usuarios, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0a1f4f]">Usuários</h1>
          <p className="text-slate-500 text-sm mt-1">Gerencie os usuários do painel administrativo</p>
        </div>
        <Link
          href="/admin/usuarios/novo"
          className="flex items-center gap-2 bg-[#e30613] text-white px-4 py-2 rounded-md text-sm font-bold hover:bg-[#a8000a] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Usuário
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-3 font-bold text-slate-500 uppercase tracking-wider text-xs">Nome</th>
              <th className="text-left px-6 py-3 font-bold text-slate-500 uppercase tracking-wider text-xs">Email</th>
              <th className="text-left px-6 py-3 font-bold text-slate-500 uppercase tracking-wider text-xs">Role</th>
              <th className="text-left px-6 py-3 font-bold text-slate-500 uppercase tracking-wider text-xs">Status</th>
              <th className="text-left px-6 py-3 font-bold text-slate-500 uppercase tracking-wider text-xs">Criado em</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {(usuarios as Profile[])?.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-900">{u.nome ?? '—'}</td>
                <td className="px-6 py-4 text-slate-600">{u.email}</td>
                <td className="px-6 py-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${ROLE_COLORS[u.role as Role] ?? 'bg-slate-100 text-slate-600'}`}>
                    {ROLE_LABELS[u.role as Role] ?? u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <ToggleAtivoButton id={u.id} ativo={u.ativo} />
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {format(new Date(u.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/admin/usuarios/${u.id}/editar`}
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-[#0a1f4f] text-xs font-medium"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!usuarios || usuarios.length === 0) && (
          <div className="px-6 py-12 text-center text-slate-400 text-sm">
            Nenhum usuário cadastrado.
          </div>
        )}
      </div>
    </div>
  )
}

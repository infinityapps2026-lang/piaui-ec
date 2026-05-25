import { LogOut } from 'lucide-react'
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

export default function Header({
  userEmail,
  role,
  nome,
}: {
  userEmail: string | null
  role: Role
  nome: string | null
}) {
  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-sm font-bold text-slate-500 tracking-widest uppercase">
          Bem-vindo de volta
        </h2>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-slate-900 font-semibold">
            {nome ?? userEmail}
          </p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${ROLE_COLORS[role]}`}>
            {ROLE_LABELS[role]}
          </span>
        </div>
      </div>

      <form action="/admin/logout" method="post">
        <button
          type="submit"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 hover:text-[#e30613] hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </form>
    </header>
  )
}

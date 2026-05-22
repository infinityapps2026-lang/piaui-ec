import { createClient } from '@/lib/supabase-server'
import { LogOut } from 'lucide-react'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h2 className="text-sm font-bold text-slate-500 tracking-widest uppercase">
          Bem-vindo de volta
        </h2>
        <p className="text-slate-900 font-semibold">
          {user?.email}
        </p>
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
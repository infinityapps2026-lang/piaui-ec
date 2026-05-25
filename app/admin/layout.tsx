import { createClient } from '@/lib/supabase-server'
import { type Role } from '@/lib/types'
import Sidebar from './_components/Sidebar'
import Header from './_components/Header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role: Role = 'editor'
  let nome: string | null = null

  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role, nome')
      .eq('id', user.id)
      .single()
    role = (data?.role ?? 'editor') as Role
    nome = data?.nome ?? null
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col">
        <Header userEmail={user?.email ?? null} role={role} nome={nome} />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import PatrocinadorForm from '../_components/PatrocinadorForm'

export default async function NovoPatrocinadorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/patrocinadores"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Patrocinadores
        </Link>
        <h1 className="text-2xl font-black text-[#0a1f4f]">Novo Patrocinador</h1>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <PatrocinadorForm />
      </div>
    </div>
  )
}

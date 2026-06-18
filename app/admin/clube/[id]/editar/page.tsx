import { createClient } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import ClubeForm from '../../_components/ClubeForm'

export default async function EditarInfoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: info } = await supabase
    .from('clube_info')
    .select('*')
    .eq('id', id)
    .single()

  if (!info) notFound()

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/clube"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para O Clube
        </Link>
        <h1 className="text-2xl font-black text-[#0a1f4f]">Editar Entrada</h1>
        <p className="text-slate-500 text-sm mt-1 font-mono">{info.chave}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <ClubeForm info={info} />
      </div>
    </div>
  )
}

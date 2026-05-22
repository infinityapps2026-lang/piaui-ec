import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import TransparenciaForm from '../../_components/TransparenciaForm'

export default async function EditarDocumentoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: doc } = await supabase
    .from('transparencia')
    .select('*')
    .eq('id', id)
    .single()

  if (!doc) notFound()

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/transparencia"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Transparência
        </Link>
        <h1 className="text-2xl font-black text-[#0a1f4f]">Editar Documento</h1>
        <p className="text-slate-500 text-sm mt-1">{doc.titulo}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <TransparenciaForm doc={doc} />
      </div>
    </div>
  )
}

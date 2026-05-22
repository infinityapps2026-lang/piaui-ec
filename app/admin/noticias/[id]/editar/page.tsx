import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import NoticiaForm from '../../_components/NoticiaForm'

export default async function EditarNoticiaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: noticia } = await supabase
    .from('noticias')
    .select('*')
    .eq('id', id)
    .single()

  if (!noticia) notFound()

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/noticias"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Notícias
        </Link>
        <h1 className="text-2xl font-black text-[#0a1f4f]">Editar Notícia</h1>
        <p className="text-slate-500 text-sm mt-1">{noticia.titulo}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <NoticiaForm noticia={noticia} />
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import JogoForm from '../../_components/JogoForm'

export default async function EditarJogoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: jogo } = await supabase
    .from('jogos')
    .select('*')
    .eq('id', id)
    .single()

  if (!jogo) notFound()

  const titulo = `${jogo.mandante ? 'Piauí EC' : jogo.adversario} vs ${jogo.mandante ? jogo.adversario : 'Piauí EC'}`

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/jogos"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Jogos
        </Link>
        <h1 className="text-2xl font-black text-[#0a1f4f]">Editar Jogo</h1>
        <p className="text-slate-500 text-sm mt-1">{titulo}</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <JogoForm jogo={jogo} />
      </div>
    </div>
  )
}

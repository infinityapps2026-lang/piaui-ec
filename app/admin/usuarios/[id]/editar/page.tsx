import { requireRole } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase-admin'
import { notFound } from 'next/navigation'
import UsuarioForm from '../../_components/UsuarioForm'

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireRole(['super_admin'])
  const { id } = await params

  const supabase = createAdminClient()
  const { data: usuario } = await supabase
    .from('profiles')
    .select('id, email, nome, role, ativo')
    .eq('id', id)
    .single()

  if (!usuario) notFound()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a1f4f]">Editar Usuário</h1>
        <p className="text-slate-500 text-sm mt-1">{usuario.email}</p>
      </div>
      <UsuarioForm usuario={usuario} />
    </div>
  )
}

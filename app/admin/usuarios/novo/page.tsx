import { requireRole } from '@/lib/auth'
import UsuarioForm from '../_components/UsuarioForm'
import { criarUsuario } from '../actions'

export default async function NovoUsuarioPage() {
  await requireRole(['super_admin'])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a1f4f]">Novo Usuário</h1>
        <p className="text-slate-500 text-sm mt-1">Crie um novo usuário do painel administrativo</p>
      </div>
      <UsuarioForm action={criarUsuario} />
    </div>
  )
}

'use client'

import { useFormStatus } from 'react-dom'
import Link from 'next/link'

type Usuario = {
  id: string
  email: string
  nome: string | null
  role: string
  ativo: boolean
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-[#e30613] text-white px-6 py-2.5 rounded-md font-bold text-sm hover:bg-[#a8000a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? 'Salvando...' : isEdit ? 'Salvar alterações' : 'Criar usuário'}
    </button>
  )
}

export default function UsuarioForm({
  action,
  usuario,
}: {
  action: (formData: FormData) => Promise<void>
  usuario?: Usuario
}) {
  const isEdit = !!usuario

  return (
    <form action={action} className="max-w-lg space-y-5">
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
          Nome
        </label>
        <input
          name="nome"
          type="text"
          defaultValue={usuario?.nome ?? ''}
          required
          className="w-full px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f]/20 focus:border-[#0a1f4f]"
          placeholder="Nome completo"
        />
      </div>

      {!isEdit && (
        <>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              name="email"
              type="email"
              required
              className="w-full px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f]/20 focus:border-[#0a1f4f]"
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
              Senha temporária
            </label>
            <input
              name="senha"
              type="password"
              required
              minLength={6}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f]/20 focus:border-[#0a1f4f]"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
          Nível de acesso
        </label>
        <select
          name="role"
          defaultValue={usuario?.role ?? 'editor'}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#0a1f4f]/20 focus:border-[#0a1f4f] bg-white"
        >
          <option value="editor">Editor — notícias, jogos, elenco</option>
          <option value="admin">Admin — todo o conteúdo</option>
          <option value="super_admin">Super Admin — acesso total</option>
        </select>
      </div>

      <div className="flex items-center gap-4 pt-2">
        <SubmitButton isEdit={isEdit} />
        <Link
          href="/admin/usuarios"
          className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors"
        >
          Cancelar
        </Link>
      </div>
    </form>
  )
}

'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { criarUsuario, atualizarUsuario, type UsuarioFormState } from '../actions'

type Usuario = {
  id: string
  email: string
  nome: string | null
  role: string
  ativo: boolean
}

export default function UsuarioForm({ usuario }: { usuario?: Usuario }) {
  const boundAction = usuario ? atualizarUsuario.bind(null, usuario.id) : criarUsuario
  const [state, formAction, pending] = useActionState<UsuarioFormState, FormData>(
    boundAction,
    { error: null }
  )

  return (
    <form action={formAction} className="max-w-lg space-y-5">
      {state.error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {state.error}
        </div>
      )}

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

      {!usuario && (
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
        <button
          type="submit"
          disabled={pending}
          className="bg-[#e30613] text-white px-6 py-2.5 rounded-md font-bold text-sm hover:bg-[#a8000a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {pending ? 'Salvando...' : usuario ? 'Salvar alterações' : 'Criar usuário'}
        </button>
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

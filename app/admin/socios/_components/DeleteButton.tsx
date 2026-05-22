'use client'

import { deletarSocio } from '../actions'

export default function DeleteButton({ id, nome }: { id: string; nome: string }) {
  return (
    <form action={deletarSocio}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-white hover:bg-[#e30613] rounded-md transition-colors"
        onClick={(e) => {
          if (!confirm(`Excluir sócio "${nome}"?`)) e.preventDefault()
        }}
      >
        Excluir
      </button>
    </form>
  )
}

'use client'

import { deletarTime } from '../actions'

export default function DeleteButton({ id, label }: { id: string; label: string }) {
  return (
    <form action={deletarTime}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-white hover:bg-[#e30613] rounded-md transition-colors"
        onClick={(e) => {
          if (!confirm(`Excluir "${label}" da classificação?`)) e.preventDefault()
        }}
      >
        Excluir
      </button>
    </form>
  )
}

'use client'

import { useFormStatus } from 'react-dom'
import { toggleAtivo } from '../actions'

function Button({ ativo }: { ativo: boolean }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors disabled:opacity-50 ${
        ativo
          ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700'
          : 'bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700'
      }`}
    >
      {pending ? '...' : ativo ? 'Ativo' : 'Inativo'}
    </button>
  )
}

export function ToggleAtivoButton({ id, ativo }: { id: string; ativo: boolean }) {
  return (
    <form action={toggleAtivo}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="ativo" value={String(ativo)} />
      <Button ativo={ativo} />
    </form>
  )
}

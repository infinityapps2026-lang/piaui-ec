import { requireRole } from '@/lib/auth'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import PlanoForm from '../_components/PlanoForm'

export default async function NovoPlanoPage() {
  await requireRole(['super_admin', 'admin'])

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/planos"
          className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 mb-4 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar para Planos
        </Link>
        <h1 className="text-2xl font-black text-[#0a1f4f]">Novo Plano</h1>
        <p className="text-slate-500 text-sm mt-1">
          Adicione um novo plano de associação ao site.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-8">
        <PlanoForm />
      </div>
    </div>
  )
}

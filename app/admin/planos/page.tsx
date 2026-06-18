import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Pencil } from 'lucide-react'

export default async function PlanosAdminPage() {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const { data: planos } = await supabase
    .from('planos')
    .select('*')
    .order('tipo')
    .order('ordem')

  const planosPF = planos?.filter((p) => p.tipo === 'pf') ?? []
  const planosPJ = planos?.filter((p) => p.tipo === 'pj') ?? []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a1f4f]">Planos de Associação</h1>
        <p className="text-slate-500 text-sm mt-1">
          Edite o valor, link e conteúdo de cada plano exibido no site.
        </p>
      </div>

      {(!planos || planos.length === 0) && (
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          <strong>Tabela &quot;planos&quot; não encontrada.</strong> Execute o SQL de criação no painel do Supabase para começar.
        </div>
      )}

      {planosPF.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Pessoa Física</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {planosPF.map((p) => (
              <PlanoCard key={p.id} plano={p} />
            ))}
          </div>
        </div>
      )}

      {planosPJ.length > 0 && (
        <div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Empresas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {planosPJ.map((p) => (
              <PlanoCard key={p.id} plano={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PlanoCard({ plano }: { plano: { id: string; nome: string; preco: string; periodo: string; cta: string; link_botao: string; featured: boolean; badge: string | null } }) {
  return (
    <div className={`bg-white rounded-xl border p-5 flex flex-col gap-3 ${plano.featured ? 'border-[#e30613]' : 'border-slate-200'}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-black text-[#0a1f4f] text-sm">{plano.nome}</p>
          {plano.badge && (
            <span className="text-[10px] bg-[#e30613] text-white px-2 py-0.5 rounded font-bold mt-1 inline-block">
              {plano.badge}
            </span>
          )}
        </div>
        <div className="text-right shrink-0">
          <span className="font-black text-xl text-[#0a1f4f]">R${plano.preco}</span>
          {plano.periodo && <span className="text-xs text-slate-400 ml-0.5">{plano.periodo}</span>}
        </div>
      </div>

      <div className="text-xs text-slate-500 bg-slate-50 rounded-lg p-3 font-mono break-all">
        <span className="text-slate-400">Botão: </span>{plano.cta}<br />
        <span className="text-slate-400">Link: </span>{plano.link_botao}
      </div>

      <Link
        href={`/admin/planos/${plano.id}/editar`}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 hover:bg-[#0a1f4f] hover:text-white text-slate-700 text-sm font-semibold rounded-lg transition-colors mt-auto"
      >
        <Pencil className="w-3.5 h-3.5" />
        Editar plano
      </Link>
    </div>
  )
}

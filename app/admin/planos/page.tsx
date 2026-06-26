import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Pencil, Plus } from 'lucide-react'
import { atualizarConfigCategoria } from './actions'

type ConfigRow = { tipo: string; ativo: boolean }

export default async function PlanosAdminPage() {
  await requireRole(['super_admin', 'admin'])
  const supabase = await createClient()

  const [{ data: planos }, { data: configData }] = await Promise.all([
    supabase
      .from('planos')
      .select('*')
      .order('tipo')
      .order('ordem'),
    supabase
      .from('planos_config')
      .select('tipo, ativo'),
  ])

  const config = new Map<string, boolean>(
    (configData ?? []).map((c: ConfigRow) => [c.tipo, c.ativo]),
  )
  const pfAtivo = config.get('pf') ?? true
  const pjAtivo = config.get('pj') ?? true

  const planosPF = planos?.filter((p) => p.tipo === 'pf') ?? []
  const planosPJ = planos?.filter((p) => p.tipo === 'pj') ?? []

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-black text-[#0a1f4f]">Planos de Associação</h1>
          <p className="text-slate-500 text-sm mt-1">
            Edite, ative/desative ou exclua planos. Use os toggles abaixo para esconder uma categoria inteira do site.
          </p>
        </div>
        <Link
          href="/admin/planos/novo"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0a1f4f] hover:bg-[#1a3a8f] text-white text-sm font-bold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo plano
        </Link>
      </div>

      {/* Toggles de categoria */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <CategoriaToggle tipo="pf" label="Pessoa Física" ativo={pfAtivo} qtd={planosPF.length} />
        <CategoriaToggle tipo="pj" label="Empresas" ativo={pjAtivo} qtd={planosPJ.length} />
      </div>

      {(!planos || planos.length === 0) && (
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          <strong>Tabela &quot;planos&quot; vazia ou não encontrada.</strong> Crie o primeiro plano usando o botão acima.
        </div>
      )}

      {planosPF.length > 0 && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pessoa Física</h2>
            {!pfAtivo && (
              <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Categoria desativada
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {planosPF.map((p) => (
              <PlanoCard key={p.id} plano={p} />
            ))}
          </div>
        </div>
      )}

      {planosPJ.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Empresas</h2>
            {!pjAtivo && (
              <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Categoria desativada
              </span>
            )}
          </div>
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

function CategoriaToggle({ tipo, label, ativo, qtd }: { tipo: 'pf' | 'pj'; label: string; ativo: boolean; qtd: number }) {
  return (
    <form
      action={atualizarConfigCategoria}
      className={`rounded-xl border p-4 flex items-center justify-between gap-4 transition-colors ${
        ativo ? 'bg-white border-emerald-200' : 'bg-slate-50 border-slate-200'
      }`}
    >
      <input type="hidden" name="tipo" value={tipo} />
      <input type="hidden" name="ativo" value={ativo ? 'false' : 'true'} />
      <div>
        <p className="font-black text-[#0a1f4f] text-sm">{label}</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {qtd} {qtd === 1 ? 'plano cadastrado' : 'planos cadastrados'} · {ativo ? 'Visível no site' : 'Oculta no site'}
        </p>
      </div>
      <button
        type="submit"
        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
          ativo
            ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            : 'bg-emerald-500 text-white hover:bg-emerald-600'
        }`}
      >
        {ativo ? 'Desativar' : 'Ativar'}
      </button>
    </form>
  )
}

function PlanoCard({
  plano,
}: {
  plano: {
    id: string
    nome: string
    preco: string
    periodo: string
    cta: string
    btn_url: string
    featured: boolean
    badge: string | null
    ativo?: boolean | null
  }
}) {
  const ativo = plano.ativo ?? true
  return (
    <div
      className={`relative rounded-xl border p-5 flex flex-col gap-3 transition-opacity ${
        plano.featured ? 'border-[#e30613]' : 'border-slate-200'
      } ${ativo ? 'bg-white' : 'bg-slate-50 opacity-70'}`}
    >
      {!ativo && (
        <span className="absolute top-3 right-3 text-[9px] bg-slate-300 text-slate-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
          Inativo
        </span>
      )}
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
        <span className="text-slate-400">Link: </span>{plano.btn_url}
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

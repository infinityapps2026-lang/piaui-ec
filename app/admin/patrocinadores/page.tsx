import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, ExternalLink, ImageIcon } from 'lucide-react'
import DeleteButton from './_components/DeleteButton'

const CATEGORIA_COR: Record<string, string> = {
  Master:    'bg-yellow-100 text-yellow-700 border-yellow-200',
  Ouro:      'bg-amber-100 text-amber-700 border-amber-200',
  Prata:     'bg-slate-100 text-slate-600 border-slate-200',
  Bronze:    'bg-orange-100 text-orange-700 border-orange-200',
  Apoiador:  'bg-blue-100 text-blue-700 border-blue-200',
}

const ORDEM_CATEGORIA: Record<string, number> = {
  Master: 1, Ouro: 2, Prata: 3, Bronze: 4, Apoiador: 5,
}

export default async function PatrocinadoresPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: patrocinadores } = await supabase
    .from('patrocinadores')
    .select('id, nome, logo_url, site_url, categoria, ativo, ordem_exibicao')
    .order('ordem_exibicao', { ascending: true })
    .order('nome', { ascending: true })

  const ativos = patrocinadores?.filter((p) => p.ativo) ?? []
  const inativos = patrocinadores?.filter((p) => !p.ativo) ?? []

  const porCategoria = ativos.reduce<Record<string, typeof ativos>>((acc, p) => {
    const cat = p.categoria ?? 'Outros'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(p)
    return acc
  }, {})

  const categorias = Object.keys(porCategoria).sort(
    (a, b) => (ORDEM_CATEGORIA[a] ?? 99) - (ORDEM_CATEGORIA[b] ?? 99)
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0a1f4f]">Patrocinadores</h1>
          <p className="text-slate-500 text-sm mt-1">
            {ativos.length} ativo{ativos.length !== 1 ? 's' : ''}
            {inativos.length > 0 && ` · ${inativos.length} inativo${inativos.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link
          href="/admin/patrocinadores/novo"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#e30613] hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Patrocinador
        </Link>
      </div>

      {!patrocinadores || patrocinadores.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <p className="text-slate-400 text-lg font-medium mb-2">Nenhum patrocinador cadastrado</p>
          <p className="text-slate-400 text-sm">Clique em "Novo Patrocinador" para começar.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categorias.map((cat) => (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${CATEGORIA_COR[cat] ?? 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  {cat}
                </span>
                <span className="text-xs text-slate-400 font-medium">{porCategoria[cat].length}</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {porCategoria[cat].map((p) => (
                  <PatrocinadorCard key={p.id} pat={p} />
                ))}
              </div>
            </div>
          ))}

          {inativos.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Inativos</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {inativos.map((p) => (
                  <PatrocinadorCard key={p.id} pat={p} inativo />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

type CardPat = {
  id: string
  nome: string
  logo_url: string | null
  site_url: string | null
  categoria: string
  ativo: boolean
  ordem_exibicao: number | null
}

function PatrocinadorCard({ pat: p, inativo }: { pat: CardPat; inativo?: boolean }) {
  return (
    <div className={`bg-white rounded-xl border ${inativo ? 'border-slate-100 opacity-60' : 'border-slate-200'} overflow-hidden`}>
      {/* Logo */}
      <div className="h-24 bg-slate-50 flex items-center justify-center p-3">
        {p.logo_url ? (
          <Image
            src={p.logo_url}
            alt={p.nome}
            width={120}
            height={80}
            className="max-h-full w-auto object-contain"
          />
        ) : (
          <ImageIcon className="w-8 h-8 text-slate-300" />
        )}
      </div>

      {/* Info */}
      <div className="p-3 border-t border-slate-100">
        <p className="font-bold text-slate-900 text-sm truncate">{p.nome}</p>
        {p.site_url && (
          <a
            href={p.site_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-[#0a1f4f] flex items-center gap-1 mt-0.5 truncate"
          >
            <ExternalLink className="w-3 h-3 shrink-0" />
            <span className="truncate">{p.site_url.replace(/^https?:\/\//, '')}</span>
          </a>
        )}
      </div>

      {/* Ações */}
      <div className="px-3 pb-3 flex gap-1">
        <Link
          href={`/admin/patrocinadores/${p.id}/editar`}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#0a1f4f] hover:bg-slate-100 rounded-md transition-colors"
        >
          <Pencil className="w-3 h-3" />
          Editar
        </Link>
        <DeleteButton id={p.id} nome={p.nome} />
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Pencil, User } from 'lucide-react'
import Image from 'next/image'
import DeleteButton from './_components/DeleteButton'

const POSICAO_COR: Record<string, string> = {
  'Goleiro':        'bg-amber-100 text-amber-700',
  'Zagueiro':       'bg-blue-100 text-blue-700',
  'Lateral Direito':'bg-sky-100 text-sky-700',
  'Lateral Esquerdo':'bg-sky-100 text-sky-700',
  'Volante':        'bg-green-100 text-green-700',
  'Meio-Campo':     'bg-teal-100 text-teal-700',
  'Meia-Atacante':  'bg-purple-100 text-purple-700',
  'Atacante':       'bg-red-100 text-red-700',
  'Centroavante':   'bg-rose-100 text-rose-700',
}

const ORDEM_POSICAO: Record<string, number> = {
  'Goleiro': 1,
  'Lateral Direito': 2,
  'Lateral Esquerdo': 3,
  'Zagueiro': 4,
  'Volante': 5,
  'Meio-Campo': 6,
  'Meia-Atacante': 7,
  'Atacante': 8,
  'Centroavante': 9,
}

export default async function ElencoPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const { data: jogadores } = await supabase
    .from('jogadores')
    .select('id, nome, apelido, numero, posicao, foto, ativo, ordem_exibicao')
    .order('ordem_exibicao', { ascending: true })
    .order('posicao', { ascending: true })
    .order('nome', { ascending: true })

  const ativos = jogadores?.filter((j) => j.ativo) ?? []
  const inativos = jogadores?.filter((j) => !j.ativo) ?? []

  // agrupa ativos por posição
  const porPosicao = ativos.reduce<Record<string, typeof ativos>>((acc, j) => {
    const pos = j.posicao ?? 'Outros'
    if (!acc[pos]) acc[pos] = []
    acc[pos].push(j)
    return acc
  }, {})

  const posicoes = Object.keys(porPosicao).sort(
    (a, b) => (ORDEM_POSICAO[a] ?? 99) - (ORDEM_POSICAO[b] ?? 99)
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#0a1f4f]">Elenco</h1>
          <p className="text-slate-500 text-sm mt-1">
            {ativos.length} jogador{ativos.length !== 1 ? 'es' : ''} ativo{ativos.length !== 1 ? 's' : ''}
            {inativos.length > 0 && ` · ${inativos.length} inativo${inativos.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <Link
          href="/admin/elenco/novo"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#e30613] hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Jogador
        </Link>
      </div>

      {!jogadores || jogadores.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
          <p className="text-slate-400 text-lg font-medium mb-2">Nenhum jogador cadastrado</p>
          <p className="text-slate-400 text-sm">Clique em "Novo Jogador" para começar.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posicoes.map((pos) => (
            <div key={pos}>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${POSICAO_COR[pos] ?? 'bg-slate-100 text-slate-500'}`}>
                  {pos}
                </span>
                <span>{porPosicao[pos].length}</span>
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {porPosicao[pos].map((j) => (
                  <JogadorCard key={j.id} jogador={j} />
                ))}
              </div>
            </div>
          ))}

          {inativos.length > 0 && (
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Inativos
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {inativos.map((j) => (
                  <JogadorCard key={j.id} jogador={j} inativo />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

type CardJogador = {
  id: string
  nome: string
  apelido: string | null
  numero: number | null
  posicao: string
  foto: string | null
  ativo: boolean
  ordem_exibicao: number | null
}

function JogadorCard({ jogador: j, inativo }: { jogador: CardJogador; inativo?: boolean }) {
  return (
    <div className={`bg-white rounded-xl border ${inativo ? 'border-slate-100 opacity-60' : 'border-slate-200'} overflow-hidden group`}>
      {/* Foto */}
      <div className="relative aspect-square bg-slate-100">
        {j.foto ? (
          <Image
            src={j.foto}
            alt={j.apelido ?? j.nome}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <User className="w-10 h-10 text-slate-300" />
          </div>
        )}
        {j.numero !== null && (
          <div className="absolute top-2 left-2 w-7 h-7 bg-[#e30613] text-white text-xs font-black rounded-full flex items-center justify-center shadow">
            {j.numero}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="font-bold text-slate-900 text-sm leading-tight truncate">
          {j.apelido ?? j.nome}
        </p>
        {j.apelido && (
          <p className="text-xs text-slate-400 truncate">{j.nome}</p>
        )}
      </div>

      {/* Ações */}
      <div className="px-3 pb-3 flex gap-1">
        <Link
          href={`/admin/elenco/${j.id}/editar`}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#0a1f4f] hover:bg-slate-100 rounded-md transition-colors"
        >
          <Pencil className="w-3 h-3" />
          Editar
        </Link>
        <DeleteButton id={j.id} nome={j.apelido ?? j.nome} />
      </div>
    </div>
  )
}

import { requireRole } from '@/lib/auth'
import { createClient } from '@/lib/supabase-server'
import { ROLE_WEIGHT, type Role } from '@/lib/types'
import { Newspaper, Trophy, Users, FileText, Handshake, UserCheck } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const { role } = await requireRole(['super_admin', 'admin', 'editor'])
  const supabase = await createClient()

  const [noticias, jogos, jogadores, transparencia, patrocinadores, socios] = await Promise.all([
    supabase.from('noticias').select('id', { count: 'exact', head: true }),
    supabase.from('jogos').select('id', { count: 'exact', head: true }),
    supabase.from('jogadores').select('id', { count: 'exact', head: true }).eq('ativo', true),
    supabase.from('transparencia').select('id', { count: 'exact', head: true }),
    supabase.from('patrocinadores').select('id', { count: 'exact', head: true }).eq('ativo', true),
    supabase.from('socios').select('id', { count: 'exact', head: true }),
  ])

  const allCards = [
    { label: 'Notícias', value: noticias.count ?? 0, icon: Newspaper, href: '/admin/noticias', color: 'text-blue-600 bg-blue-50', minRole: 'editor' as Role },
    { label: 'Jogos', value: jogos.count ?? 0, icon: Trophy, href: '/admin/jogos', color: 'text-amber-600 bg-amber-50', minRole: 'editor' as Role },
    { label: 'Jogadores ativos', value: jogadores.count ?? 0, icon: Users, href: '/admin/elenco', color: 'text-green-600 bg-green-50', minRole: 'editor' as Role },
    { label: 'Documentos', value: transparencia.count ?? 0, icon: FileText, href: '/admin/transparencia', color: 'text-purple-600 bg-purple-50', minRole: 'admin' as Role },
    { label: 'Patrocinadores', value: patrocinadores.count ?? 0, icon: Handshake, href: '/admin/patrocinadores', color: 'text-pink-600 bg-pink-50', minRole: 'admin' as Role },
    { label: 'Sócios', value: socios.count ?? 0, icon: UserCheck, href: '/admin/socios', color: 'text-teal-600 bg-teal-50', minRole: 'admin' as Role },
  ]

  const cards = allCards.filter((c) => ROLE_WEIGHT[role] >= ROLE_WEIGHT[c.minRole])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#0a1f4f]">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Visão geral do site do Piauí Esporte Clube</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:border-[#0a1f4f]/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{card.label}</p>
                  <p className="text-3xl font-black text-slate-900">{card.value}</p>
                </div>
                <div className={`p-2.5 rounded-lg ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

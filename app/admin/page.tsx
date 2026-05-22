import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Newspaper, Trophy, Users, FileText, Handshake, UserCheck } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/admin/login')

  const [noticias, jogos, jogadores, transparencia, patrocinadores, socios] = await Promise.all([
    supabase.from('noticias').select('id', { count: 'exact', head: true }),
    supabase.from('jogos').select('id', { count: 'exact', head: true }),
    supabase.from('jogadores').select('id', { count: 'exact', head: true }).eq('ativo', true),
    supabase.from('transparencia').select('id', { count: 'exact', head: true }),
    supabase.from('patrocinadores').select('id', { count: 'exact', head: true }).eq('ativo', true),
    supabase.from('socios').select('id', { count: 'exact', head: true }),
  ])

  const cards = [
    {
      label: 'Notícias',
      value: noticias.count ?? 0,
      icon: Newspaper,
      href: '/admin/noticias',
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Jogos',
      value: jogos.count ?? 0,
      icon: Trophy,
      href: '/admin/jogos',
      color: 'text-amber-600 bg-amber-50',
    },
    {
      label: 'Jogadores ativos',
      value: jogadores.count ?? 0,
      icon: Users,
      href: '/admin/elenco',
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'Documentos',
      value: transparencia.count ?? 0,
      icon: FileText,
      href: '/admin/transparencia',
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: 'Patrocinadores',
      value: patrocinadores.count ?? 0,
      icon: Handshake,
      href: '/admin/patrocinadores',
      color: 'text-pink-600 bg-pink-50',
    },
    {
      label: 'Sócios',
      value: socios.count ?? 0,
      icon: UserCheck,
      href: '/admin/socios',
      color: 'text-teal-600 bg-teal-50',
    },
  ]

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

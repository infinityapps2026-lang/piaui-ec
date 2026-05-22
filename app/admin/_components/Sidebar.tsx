'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Newspaper,
  Trophy,
  Users,
  FileText,
  Handshake,
  UserCheck,
  Building2,
} from 'lucide-react'

const menuItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/noticias', label: 'Notícias', icon: Newspaper },
  { href: '/admin/jogos', label: 'Jogos', icon: Trophy },
  { href: '/admin/elenco', label: 'Elenco', icon: Users },
  { href: '/admin/transparencia', label: 'Transparência', icon: FileText },
  { href: '/admin/patrocinadores', label: 'Patrocinadores', icon: Handshake },
  { href: '/admin/socios', label: 'Sócios', icon: UserCheck },
  { href: '/admin/clube', label: 'O Clube', icon: Building2 },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-[#050f2c] text-white flex flex-col h-screen sticky top-0">
      {/* Logo / Header da sidebar */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-12 bg-[#e30613] flex items-center justify-center text-white font-black text-xs relative shrink-0"
            style={{ clipPath: 'polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)' }}
          >
            <div
              className="absolute inset-1 bg-[#0a1f4f]"
              style={{ clipPath: 'polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)' }}
            />
            <span className="relative z-10">PEC</span>
          </div>
          <div>
            <div className="text-sm font-black tracking-wider">PIAUÍ EC</div>
            <div className="text-[10px] text-slate-400 tracking-widest uppercase">Painel Admin</div>
          </div>
        </div>
      </div>

      {/* Menu de navegação */}
      <nav className="flex-1 py-4 overflow-y-auto">
        <div className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Conteúdo
        </div>
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#e30613] text-white shadow-lg shadow-red-500/20'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer da sidebar */}
      <div className="p-4 border-t border-white/10 text-[10px] text-slate-500 tracking-wider">
        © 2026 Piauí Esporte Clube
      </div>
    </aside>
  )
}
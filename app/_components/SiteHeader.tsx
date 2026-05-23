'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const NAV = [
  { href: '#jogos',         label: 'Jogos' },
  { href: '#planos',        label: 'Seja Sócio' },
  { href: '/noticias',      label: 'Notícias' },
  { href: '#loja',          label: 'Loja' },
  { href: '/transparencia', label: 'Transparência' },
  { href: '#parceiros',     label: 'Parceiros' },
]

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/[0.06] transition-all duration-300"
      style={{
        padding: scrolled ? '12px 48px' : '18px 48px',
        background: scrolled ? 'rgba(2,6,15,.95)' : 'rgba(5,15,44,.78)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 font-archivo font-black text-sm tracking-widest text-white no-underline">
        <Shield size="sm" />
        <div className="flex flex-col leading-none">
          <span>PIAUÍ ESPORTE CLUBE</span>
          <span className="text-[9px] text-pec-cinza tracking-[.2em] font-normal">FUNDADO EM 1948</span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="hidden lg:block">
        <ul className="flex gap-[38px] items-center list-none">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="text-white no-underline text-[12px] tracking-[.18em] font-semibold uppercase relative py-1.5 transition-colors duration-200 hover:text-pec-vermelho group"
              >
                {item.label}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-pec-vermelho transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* CTA */}
      <div className="flex gap-2.5">
        <Link
          href="/seja-socio"
          className="inline-flex items-center gap-2 px-[22px] py-3 text-[11px] tracking-[.18em] uppercase font-bold bg-pec-vermelho text-white no-underline hover:bg-pec-vermelho-deep hover:-translate-y-0.5 transition-all shadow-[0_8px_24px_-8px_#e30613]"
        >
          Associe-se <span className="text-sm">→</span>
        </Link>
      </div>
    </header>
  )
}

export function Shield({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const px = size === 'sm' ? 40 : size === 'lg' ? 80 : 56
  return (
    <Image
      src="/imagem/logo.png"
      alt="Escudo Piauí EC"
      width={px}
      height={px}
      className="shrink-0 object-contain"
    />
  )
}

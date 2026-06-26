'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const NAV = [
  { href: '/clube',         label: 'O Clube' },
  { href: '/jogos',         label: 'Jogos' },
  { href: '/#planos',       label: 'Seja Sócio' },
  { href: '/noticias',      label: 'Notícias' },
  { href: '/#loja',         label: 'Loja' },
  { href: '/transparencia', label: 'Transparência' },
  { href: '/#parceiros',    label: 'Parceiros' },
]

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/[0.06] transition-all duration-300 px-5 md:px-10 lg:px-12"
        style={{
          paddingTop: scrolled ? 12 : 18,
          paddingBottom: scrolled ? 12 : 18,
          background: scrolled ? 'rgba(2,6,15,.95)' : 'rgba(5,15,44,.78)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex items-center gap-3 font-archivo font-black text-sm tracking-widest text-white no-underline min-w-0"
        >
          <Shield size="sm" />
          <div className="hidden sm:flex flex-col leading-none">
            <span>PIAUÍ ESPORTE CLUBE</span>
            <span className="text-[9px] text-pec-cinza tracking-[.2em] font-normal">FUNDADO EM 1948</span>
          </div>
          <div className="flex sm:hidden flex-col leading-none">
            <span className="text-[13px]">PEC</span>
            <span className="text-[8px] text-pec-cinza tracking-[.2em] font-normal">1948</span>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden lg:block">
          <ul className="flex gap-[38px] items-center list-none">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-white no-underline text-[12px] tracking-[.18em] font-semibold uppercase relative py-1.5 transition-colors duration-200 hover:text-pec-vermelho group"
                >
                  {item.label}
                  <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-pec-vermelho transition-all duration-300 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/seja-socio"
            onClick={() => setOpen(false)}
            className="hidden sm:inline-flex items-center gap-2 px-[18px] py-2.5 lg:px-[22px] lg:py-3 text-[11px] tracking-[.18em] uppercase font-bold bg-pec-vermelho text-white no-underline hover:bg-pec-vermelho-deep hover:-translate-y-0.5 transition-all shadow-[0_8px_24px_-8px_#e30613]"
          >
            Associe-se <span className="text-sm">→</span>
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 text-white hover:text-pec-vermelho transition-colors"
          >
            {open ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Drawer mobile */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        style={{ background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(4px)' }}
      />
      <nav
        id="menu-mobile"
        className={`lg:hidden fixed top-0 right-0 bottom-0 z-50 w-[82vw] max-w-[360px] flex flex-col transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: 'linear-gradient(180deg, #050f2c 0%, #02060f 100%)' }}
        aria-label="Menu principal"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-5 border-b border-white/[.08]">
          <span className="text-pec-vermelho text-[10px] tracking-[.3em] font-bold uppercase">Menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
            className="inline-flex items-center justify-center w-9 h-9 text-white/70 hover:text-pec-vermelho"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="6" y1="18" x2="18" y2="6" />
            </svg>
          </button>
        </div>

        <ul className="flex-1 overflow-y-auto list-none px-6 py-6 space-y-1">
          {NAV.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-white no-underline font-archivo font-black text-[20px] tracking-[.05em] uppercase border-b border-white/[.06] hover:text-pec-vermelho hover:pl-2 transition-all duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="px-6 pb-8 pt-4 border-t border-white/[.08]">
          <Link
            href="/seja-socio"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 w-full px-6 py-3.5 text-[12px] tracking-[.18em] uppercase font-bold bg-pec-vermelho text-white no-underline hover:bg-pec-vermelho-deep transition-colors"
          >
            Associe-se <span className="text-base">→</span>
          </Link>
        </div>
      </nav>
    </>
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

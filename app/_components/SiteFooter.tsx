import type { ReactNode } from 'react'
import { Shield } from '@/app/_components/SiteHeader'

const COL_SOCIO = [
  { href: '/seja-socio', label: 'Associe-se' },
  { href: '/#planos',    label: 'Planos e Benefícios' },
  { href: '/noticias',   label: 'Notícias do clube' },
]

const COL_INSTITUCIONAL = [
  { href: '/transparencia', label: 'Transparência' },
  { href: '/noticias',      label: 'Notícias' },
  { href: '#contato',       label: 'Contato' },
]

const COL_CONTATO = [
  { href: null, label: 'Usina Santana' },
  { href: null, label: 'Teresina/PI' },
  { href: 'mailto:timemarketing.pec@gmail.com', label: 'timemarketing.pec@gmail.com' },
  { href: 'tel:+558699465946', label: '+55 (86) 9 9946-5946' },
]

export default function SiteFooter() {
  return (
    <footer
      className="px-6 md:px-12"
      style={{ background: '#02060f', borderTop: '1px solid rgba(255,255,255,.06)' }}
    >
      <div className="max-w-[1380px] mx-auto py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 font-archivo font-black text-sm tracking-widest text-white mb-5 no-underline">
            <Shield size="sm" />
            <div className="flex flex-col leading-none">
              <span>PIAUÍ ESPORTE CLUBE</span>
              <span className="text-[9px] text-pec-cinza tracking-[.2em] font-normal mt-0.5">FUNDADO EM 1948</span>
            </div>
          </div>
          <p className="text-[13px] text-pec-cinza leading-relaxed max-w-[280px]">
            O Piauí Esporte Clube carrega o nome do estado no peito desde 1948. Nascido em Teresina, é tradição, paixão e história em campo.
          </p>
        </div>

        {/* Sócio Torcedor */}
        <FooterCol title="Sócio Torcedor" links={COL_SOCIO} />

        {/* Institucional */}
        <FooterCol title="Institucional" links={COL_INSTITUCIONAL} />

        {/* Contato */}
        <FooterCol title="Contato" links={COL_CONTATO} />
      </div>

      <div
        className="max-w-[1380px] mx-auto py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}
      >
        <span className="text-[12px] text-pec-cinza tracking-[.05em]">
          © 2026 Piauí Esporte Clube — Todos os direitos reservados.
        </span>
        <div className="flex items-center gap-4">
          <SocialLink href="#" label="Instagram">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="18" cy="6" r="1" fill="currentColor" />
            </svg>
          </SocialLink>
          <SocialLink href="#" label="Facebook">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
          </SocialLink>
          <SocialLink href="#" label="X">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </SocialLink>
          <SocialLink href="#" label="YouTube">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z" />
              <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
            </svg>
          </SocialLink>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { href: string | null; label: string }[] }) {
  return (
    <div>
      <h4 className="font-archivo font-black text-[12px] tracking-[.2em] uppercase text-white mb-5">{title}</h4>
      <ul className="space-y-3 list-none p-0">
        {links.map((l) => (
          <li key={l.label}>
            {l.href ? (
              <a
                href={l.href}
                className="text-[13px] text-pec-cinza hover:text-pec-vermelho transition-colors no-underline"
              >
                {l.label}
              </a>
            ) : (
              <span className="text-[13px] text-pec-cinza">{l.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="text-pec-cinza hover:text-pec-vermelho transition-colors no-underline"
    >
      {children}
    </a>
  )
}

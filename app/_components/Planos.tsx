'use client'

import { useState } from 'react'

const CHECK = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-[18px] h-[18px] shrink-0 text-pec-vermelho">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const PLANOS_PF = [
  {
    name: 'Iniciante',
    price: '0',
    period: '',
    tagline: 'Comece a torcer com vantagens básicas, sem custo.',
    features: ['20% de desconto em ingressos', 'Carteirinha digital', 'Newsletter exclusiva'],
    cta: 'Começar grátis',
    featured: false,
  },
  {
    name: 'Vibrante+',
    price: '29',
    period: ',90 / mês',
    tagline: 'O equilíbrio perfeito entre preço e benefícios para o torcedor de coração.',
    features: ['Ingresso gratuito (arquibancada)', '20% off na loja oficial', 'Desconto em lojas parceiras', 'Prioridade em eventos', 'Carteirinha + brinde de boas-vindas'],
    cta: 'Assinar agora',
    featured: true,
    badge: '★ Mais popular',
  },
  {
    name: 'Vibrante Plus',
    price: '49',
    period: ',90 / mês',
    tagline: 'Para quem quer estar perto do time e viver experiências exclusivas.',
    features: ['Cadeira garantida em todos os jogos', '30% off na loja oficial', 'Visitas ao CT do clube', 'Encontros com jogadores', 'Camisa oficial de presente'],
    cta: 'Quero esse plano',
    featured: false,
  },
]

const PLANOS_PJ = [
  {
    name: 'Bronze',
    price: '299',
    period: '/mês',
    tagline: 'Visibilidade básica para pequenas empresas que apoiam o clube.',
    features: ['Logo no site oficial', '4 ingressos por jogo', 'Certificado de patrocínio'],
    cta: 'Fale conosco',
    featured: false,
  },
  {
    name: 'Ouro',
    price: '799',
    period: '/mês',
    tagline: 'Exposição de marca nos jogos e canais digitais do clube.',
    features: ['Logo no uniforme de treino', '10 ingressos por jogo', 'Camarote em jogos selecionados', 'Menção nas redes sociais'],
    cta: 'Fale conosco',
    featured: true,
    badge: '★ Mais contratado',
  },
  {
    name: 'Master',
    price: '1.999',
    period: '/mês',
    tagline: 'Parceria estratégica com máxima visibilidade dentro e fora de campo.',
    features: ['Naming rights em partidas', 'Logo no uniforme oficial', 'Camarote ilimitado', 'Ações de ativação exclusivas', 'Relatório mensal de mídia'],
    cta: 'Fale conosco',
    featured: false,
  },
]

export default function Planos() {
  const [aba, setAba] = useState<'pf' | 'pj'>('pf')
  const planos = aba === 'pf' ? PLANOS_PF : PLANOS_PJ

  return (
    <section
      id="planos"
      className="py-[140px] px-6 md:px-12 relative"
      style={{
        background: 'linear-gradient(180deg, #02060f 0%, #050f2c 100%)',
      }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Section header */}
      <div className="max-w-[1380px] mx-auto mb-16 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-16 items-end relative z-10">
        <span
          className="font-bebas text-[120px] leading-none"
          style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(227,6,19,.3)' }}
        >
          03
        </span>
        <div>
          <div className="text-pec-vermelho text-[11px] tracking-[.3em] font-bold uppercase mb-3.5">Escolha o seu plano</div>
          <h2 className="font-bebas text-[clamp(48px,5vw,84px)] leading-[.95] uppercase text-white">
            Três jeitos<br />de <span className="text-pec-vermelho">vibrar junto</span>
          </h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-[1380px] mx-auto mb-16 flex justify-center border-b border-white/10 relative z-10">
        {([['pf', 'Pessoa Física'], ['pj', 'Empresas']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setAba(key)}
            className={`px-10 py-4.5 text-[12px] tracking-[.2em] uppercase font-bold border-b-2 transition-all bg-transparent cursor-pointer ${
              aba === key
                ? 'text-white border-pec-vermelho'
                : 'text-pec-cinza border-transparent hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="max-w-[1380px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-center">
        {planos.map((p) => (
          <div
            key={p.name}
            className={`relative p-[42px_32px] border transition-all duration-300 ${
              p.featured
                ? 'border-pec-vermelho shadow-[0_30px_60px_-20px_rgba(227,6,19,.4)] scale-[1.04] hover:scale-[1.04] hover:-translate-y-1.5'
                : 'border-white/[.08] hover:border-white/[.18] hover:-translate-y-1.5'
            }`}
            style={{
              background: p.featured
                ? 'linear-gradient(160deg, rgba(227,6,19,.18) 0%, rgba(10,31,79,.6) 60%)'
                : 'rgba(10,31,79,.4)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {'badge' in p && p.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-pec-vermelho text-white px-4 py-1.5 text-[10px] tracking-[.2em] font-bold uppercase whitespace-nowrap">
                {p.badge}
              </div>
            )}
            <div className={`font-archivo font-black text-[13px] tracking-[.2em] uppercase mb-6 ${p.featured ? 'text-pec-vermelho' : 'text-pec-cinza'}`}>
              {p.name}
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-archivo text-xl font-semibold text-pec-cinza">R$</span>
              <span className="font-bebas text-[88px] leading-[.9] text-white">{p.price}</span>
              {p.period && <span className="text-[14px] text-pec-cinza">{p.period}</span>}
            </div>
            <p className="text-[13px] text-pec-cinza mb-8 pb-8 border-b border-white/[.08]">{p.tagline}</p>
            <ul className="space-y-0 mb-9">
              {p.features.map((f) => (
                <li key={f} className="flex items-center gap-3 py-[11px] text-[14px] text-[#d4dcef]">
                  {CHECK}
                  {f}
                </li>
              ))}
            </ul>
            <a
              href="#contato"
              className={`w-full flex items-center justify-center gap-2 py-4 text-[11px] tracking-[.18em] uppercase font-bold no-underline transition-all ${
                p.featured
                  ? 'bg-pec-vermelho text-white hover:bg-pec-vermelho-deep'
                  : 'border border-white/25 text-white hover:border-pec-vermelho hover:text-pec-vermelho'
              }`}
            >
              {p.cta} {p.featured && <span>→</span>}
            </a>
          </div>
        ))}
      </div>

      <div className="max-w-[1380px] mx-auto text-center mt-12 relative z-10">
        <button
          onClick={() => setAba(aba === 'pf' ? 'pj' : 'pf')}
          className="text-pec-cinza text-[13px] bg-transparent border-none cursor-pointer border-b border-white/20 pb-0.5 hover:text-pec-vermelho hover:border-pec-vermelho transition-colors tracking-[.05em]"
        >
          {aba === 'pf' ? 'Ver planos para empresas →' : 'Ver planos pessoa física →'}
        </button>
      </div>
    </section>
  )
}

const PRODUTOS = [
  {
    cat: 'Camisa Oficial',
    name: 'Camisa I Piauí 2026',
    price: 'R$ 140,00',
    tag: 'Lançamento',
    svg: (
      <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M50 30 L80 20 L100 35 L120 20 L150 30 L175 50 L165 80 L150 75 L150 200 L50 200 L50 75 L35 80 L25 50 Z" fill="#0a1f4f" stroke="#fff" strokeWidth="2" />
        <rect x="80" y="100" width="40" height="8" fill="#e30613" />
        <rect x="80" y="115" width="40" height="3" fill="#fff" />
      </svg>
    ),
  },
  {
    cat: 'Camisa Oficial',
    name: 'Camisa II Piauí 2026',
    price: 'R$ 140,00',
    tag: null,
    svg: (
      <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <path d="M50 30 L80 20 L100 35 L120 20 L150 30 L175 50 L165 80 L150 75 L150 200 L50 200 L50 75 L35 80 L25 50 Z" fill="#fff" stroke="#0a1f4f" strokeWidth="2" />
        <rect x="50" y="80" width="100" height="15" fill="#e30613" />
        <rect x="50" y="100" width="100" height="6" fill="#0a1f4f" />
      </svg>
    ),
  },
  {
    cat: 'Acessório',
    name: 'Boné Oficial PEC',
    price: 'R$ 51,00',
    tag: '-20%',
    svg: (
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <ellipse cx="100" cy="120" rx="75" ry="20" fill="#0a1f4f" />
        <path d="M30 120 Q30 50 100 50 Q170 50 170 120 Z" fill="#0a1f4f" stroke="#fff" strokeWidth="2" />
        <text x="100" y="100" textAnchor="middle" fill="#e30613" fontFamily="Archivo Black, sans-serif" fontSize="22" fontWeight="900">PEC</text>
      </svg>
    ),
  },
  {
    cat: 'Torcida',
    name: 'Bandeira Oficial',
    price: 'R$ 79,00',
    tag: null,
    svg: (
      <svg viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect x="60" y="40" width="80" height="160" rx="6" fill="#e30613" stroke="#fff" strokeWidth="2" />
        <rect x="70" y="60" width="60" height="100" fill="#fff" />
        <text x="100" y="120" textAnchor="middle" fill="#0a1f4f" fontFamily="Archivo Black, sans-serif" fontSize="36" fontWeight="900">12</text>
        <text x="100" y="180" textAnchor="middle" fill="#fff" fontFamily="Archivo Black, sans-serif" fontSize="14">VIBRANTE</text>
      </svg>
    ),
  },
]

export default function Loja() {
  return (
    <section
      id="loja"
      className="relative py-[140px] px-6 md:px-12"
      style={{ background: 'linear-gradient(180deg, #050f2c 0%, #02060f 100%)' }}
    >
      {/* Grid texture */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.015) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Section header */}
      <div className="max-w-[1380px] mx-auto mb-16 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-16 items-end relative z-10">
        <span
          className="font-bebas text-[120px] leading-none"
          style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(227,6,19,.3)' }}
        >
          04
        </span>
        <div>
          <div className="text-pec-vermelho text-[11px] tracking-[.3em] font-bold uppercase mb-3.5">Loja oficial</div>
          <h2 className="font-bebas text-[clamp(48px,5vw,84px)] leading-[.95] uppercase text-white">
            Vista as <span className="text-pec-vermelho">cores</span><br />do tricolor piauiense
          </h2>
        </div>
      </div>

      {/* Products grid */}
      <div className="max-w-[1380px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
        {PRODUTOS.map((p) => (
          <div
            key={p.name}
            className="relative group cursor-pointer"
          >
            {p.tag && (
              <div className="absolute top-3 left-3 z-10 bg-pec-vermelho text-white text-[10px] font-bold tracking-[.15em] uppercase px-3 py-1">
                {p.tag}
              </div>
            )}
            <div
              className="aspect-square flex items-center justify-center p-8 mb-4 transition-all duration-300 group-hover:border-pec-vermelho/40"
              style={{
                background: 'rgba(10,31,79,.5)',
                border: '1px solid rgba(255,255,255,.07)',
              }}
            >
              <div className="w-full h-full max-w-[140px] mx-auto">{p.svg}</div>
            </div>
            <div className="px-1">
              <div className="text-pec-cinza text-[11px] tracking-[.15em] uppercase mb-1">{p.cat}</div>
              <div className="text-white font-archivo font-bold text-[15px] mb-1.5">{p.name}</div>
              <div className="text-pec-vermelho font-bebas text-[22px]">{p.price}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-[1380px] mx-auto mt-12 text-center relative z-10">
        <a
          href="#planos"
          className="inline-flex items-center gap-2 px-8 py-4 text-[11px] tracking-[.18em] uppercase font-bold border border-white/20 text-pec-cinza hover:border-pec-vermelho hover:text-white transition-colors no-underline"
        >
          Sócios têm até 30% de desconto na loja →
        </a>
      </div>
    </section>
  )
}

import Image from 'next/image'

type Props = {
  sociosCount: number
}

export default function Hero({ sociosCount }: Props) {
  return (
    <section
      className="min-h-screen relative flex items-center px-6 md:px-12 pt-[120px] pb-20 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 70% 30%, rgba(227,6,19,.18) 0%, transparent 55%),
          radial-gradient(ellipse at 20% 70%, rgba(26,58,143,.4) 0%, transparent 55%),
          linear-gradient(180deg, #050f2c 0%, #02060f 100%)
        `,
      }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      {/* Diagonal red stripe */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '140%', height: '80px',
          background: 'linear-gradient(90deg, transparent 0%, #e30613 30%, #e30613 70%, transparent 100%)',
          transform: 'rotate(-18deg)',
          top: '75%', left: '-20%',
          opacity: .08,
        }}
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-16 w-full max-w-[1380px] mx-auto items-center">
        {/* Left */}
        <div>
          <div className="inline-flex items-center gap-3 text-[11px] tracking-[.3em] text-pec-vermelho font-bold uppercase mb-7 animate-slide-in before:content-[''] before:w-9 before:h-[2px] before:bg-pec-vermelho">
            Programa Sócio Torcedor 2026
          </div>

          <h1
            className="font-bebas text-[clamp(64px,8vw,128px)] leading-[.88] tracking-tight uppercase mb-8 text-white"
            style={{ animationDelay: '.2s' }}
          >
            Faça parte<br />
            da <span className="text-pec-vermelho">história</span><br />
            <span style={{ WebkitTextStroke: '2px #fff', color: 'transparent' }}>vibrante</span>
          </h1>

          <p className="text-[18px] text-[#c9d2e8] max-w-[520px] mb-10 leading-relaxed">
            Mais que torcer — viva o Piauizão por dentro. Ingressos com desconto, experiências exclusivas e a certeza de fortalecer o clube que carrega o nome do nosso estado.
          </p>

          <div className="flex gap-3.5 flex-wrap mb-16">
            <a
              href="#planos"
              className="inline-flex items-center gap-2 px-8 py-[18px] text-[12px] tracking-[.18em] uppercase font-bold bg-pec-vermelho text-white hover:bg-pec-vermelho-deep hover:-translate-y-0.5 transition-all shadow-[0_8px_24px_-8px_#e30613] no-underline"
            >
              Quero ser sócio <span className="text-sm">→</span>
            </a>
            <a
              href="#planos"
              className="inline-flex items-center gap-2 px-8 py-[18px] text-[12px] tracking-[.18em] uppercase font-bold border border-white/25 text-white hover:border-pec-vermelho hover:text-pec-vermelho transition-colors no-underline"
            >
              Conhecer planos
            </a>
          </div>

          <div className="flex gap-12 pt-8 border-t border-white/10 flex-wrap">
            <Stat num={`+${sociosCount.toLocaleString('pt-BR')}`} label="Sócios ativos" />
            <Stat num="78" label="Anos de história" />
            <Stat num="04" label="Competições 2026" />
          </div>
        </div>

        {/* Right — shield */}
        <div className="order-first lg:order-last">
          <div className="relative w-full max-w-[420px] aspect-square mx-auto flex items-center justify-center">
            {/* Glow */}
            <div
              className="absolute inset-0 animate-pulse-slow"
              style={{
                background: 'radial-gradient(circle at center, rgba(227,6,19,.25) 0%, transparent 65%)',
                filter: 'blur(30px)',
              }}
            />
            {/* Rotating ring */}
            <div
              className="absolute animate-ring"
              style={{
                inset: '-30px',
                border: '1.5px dashed rgba(255,212,0,.4)',
                borderRadius: '50%',
              }}
            />
            {/* Static ring */}
            <div
              className="absolute"
              style={{
                inset: '-60px',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: '50%',
              }}
            />

            {/* Logo oficial */}
            <Image
              src="/imagem/rato.png"
              alt="Escudo Piauí Esporte Clube"
              width={340}
              height={340}
              priority
              className="relative z-10 w-4/5 h-auto"
              style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,.5))' }}
            />

            {/* Competition badges */}
            {[
              { label: 'Estadual', style: { top: '-5%', left: '50%', transform: 'translateX(-50%)' } },
              { label: 'Copa NE',  style: { top: '50%', right: '-15%', transform: 'translateY(-50%)' } },
              { label: 'Série D',  style: { bottom: '-5%', left: '50%', transform: 'translateX(-50%)' } },
              { label: 'Copa BR',  style: { top: '50%', left: '-15%', transform: 'translateY(-50%)' } },
            ].map((b) => (
              <div
                key={b.label}
                className="absolute text-pec-amarelo text-[10px] tracking-[.15em] font-bold uppercase px-3.5 py-2 border border-pec-amarelo/35"
                style={{
                  ...b.style,
                  background: 'rgba(5,15,44,.92)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: '0 8px 24px rgba(0,0,0,.4)',
                }}
              >
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div>
      <span className="font-bebas text-5xl leading-none text-white block">
        {num.startsWith('+') ? (
          <><span className="text-pec-vermelho">+</span>{num.slice(1)}</>
        ) : num}
      </span>
      <span className="text-[11px] text-pec-cinza tracking-[.18em] uppercase mt-1 block">{label}</span>
    </div>
  )
}

export default function CtaFinal({ sociosCount }: { sociosCount: number }) {
  return (
    <section
      className="relative py-[160px] px-6 md:px-12 overflow-hidden flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #02060f 0%, #0a1f4f 50%, #02060f 100%)',
      }}
    >
      {/* Red diagonal accent */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: '160%',
          height: '120px',
          background: 'linear-gradient(90deg, transparent 0%, #e30613 30%, #e30613 70%, transparent 100%)',
          transform: 'rotate(-12deg)',
          top: '35%',
          left: '-30%',
          opacity: 0.07,
        }}
      />

      {/* Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span
          className="font-bebas text-[clamp(120px,22vw,320px)] leading-none whitespace-nowrap"
          style={{ color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,.03)' }}
        >
          PIAUIZÃO
        </span>
      </div>

      <div className="relative z-10 max-w-[900px] mx-auto text-center">
        <div className="text-pec-vermelho text-[11px] tracking-[.35em] font-bold uppercase mb-8">
          Junte-se ao movimento
        </div>
        <h2 className="font-bebas text-[clamp(56px,8vw,120px)] leading-[.9] uppercase mb-8">
          <span className="text-white">Não é só um clube.</span><br />
          <span style={{ WebkitTextStroke: '2px #fff', color: 'transparent' }}>É a torcida</span><br />
          <span className="text-pec-vermelho">do Piauí inteiro.</span>
        </h2>
        <p className="text-[18px] text-[#c9d2e8] max-w-[560px] mx-auto mb-12 leading-relaxed">
          Junte-se aos{' '}
          <strong className="text-white">+{sociosCount.toLocaleString('pt-BR')} sócios</strong>{' '}
          que já vibram junto com o tricolor. Cadastre-se em menos de 2 minutos.
        </p>
        <a
          href="#planos"
          className="inline-flex items-center gap-3 px-10 py-5 text-[12px] tracking-[.2em] uppercase font-bold bg-pec-vermelho text-white hover:bg-pec-vermelho-deep hover:-translate-y-0.5 transition-all shadow-[0_16px_48px_-12px_#e30613] no-underline"
        >
          Quero ser sócio agora <span className="text-base">→</span>
        </a>
      </div>
    </section>
  )
}

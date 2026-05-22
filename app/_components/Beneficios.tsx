const BENEFICIOS = [
  {
    num: '/ 01',
    title: 'Ingressos com desconto',
    desc: 'De 20% a 100% off em todos os jogos como mandante. Cadeira garantida nos planos premium.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 text-pec-vermelho mb-7">
        <path d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2zM13 5v2M13 11v2M13 17v2" />
      </svg>
    ),
  },
  {
    num: '/ 02',
    title: 'Experiências únicas',
    desc: 'Visite o vestiário, conheça jogadores, entre em campo. Momentos que dinheiro nenhum compra na rua.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 text-pec-vermelho mb-7">
        <path d="M12 2L15 8l7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
      </svg>
    ),
  },
  {
    num: '/ 03',
    title: 'Loja com desconto',
    desc: 'Camisas, bonés e produtos oficiais com até 30% off exclusivo para sócios adimplentes.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 text-pec-vermelho mb-7">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    num: '/ 04',
    title: 'Apoio direto ao clube',
    desc: 'Sua mensalidade financia categorias de base, infraestrutura e o sonho de ver o PEC voar mais alto.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-14 h-14 text-pec-vermelho mb-7">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
]

export default function Beneficios() {
  return (
    <section className="py-[140px] px-6 md:px-12 bg-pec-preto">
      <div className="max-w-[1380px] mx-auto mb-20 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-16 items-end">
        <span
          className="font-bebas text-[120px] leading-none"
          style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(227,6,19,.3)' }}
        >
          01
        </span>
        <div>
          <div className="text-pec-vermelho text-[11px] tracking-[.3em] font-bold uppercase mb-3.5">
            Por que ser sócio
          </div>
          <h2 className="font-bebas text-[clamp(48px,5vw,84px)] leading-[.95] uppercase text-white">
            Vantagens que <span className="text-pec-vermelho">vibram</span><br />com você o ano inteiro
          </h2>
        </div>
      </div>

      <div
        className="max-w-[1380px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        style={{
          borderTop: '1px solid rgba(255,255,255,.1)',
          borderLeft: '1px solid rgba(255,255,255,.1)',
        }}
      >
        {BENEFICIOS.map((b) => (
          <div
            key={b.num}
            className="relative overflow-hidden cursor-default px-9 py-12 transition-colors duration-300 hover:bg-pec-vermelho/[.06] group"
            style={{
              borderRight: '1px solid rgba(255,255,255,.1)',
              borderBottom: '1px solid rgba(255,255,255,.1)',
            }}
          >
            <div
              className="absolute top-0 left-0 w-full h-[3px] bg-pec-vermelho transition-transform duration-500 origin-left scale-x-0 group-hover:scale-x-100"
            />
            <div className="text-pec-vermelho text-[14px] tracking-[.1em] mb-8 font-bebas">{b.num}</div>
            {b.icon}
            <h3 className="font-archivo font-black text-[18px] uppercase tracking-tight text-white mb-3.5 leading-snug">
              {b.title}
            </h3>
            <p className="text-[14px] text-pec-cinza leading-relaxed">{b.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

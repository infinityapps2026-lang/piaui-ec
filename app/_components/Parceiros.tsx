import { createClient } from '@/lib/supabase-server'

type Patrocinador = {
  id: string
  nome: string
  logo_url: string | null
  categoria: string
  site_url: string | null
}

export default async function Parceiros() {
  const supabase = await createClient()
  const { data: parceiros } = await supabase
    .from('patrocinadores')
    .select('id, nome, logo_url, categoria, site_url')
    .eq('ativo', true)
    .order('categoria')
    .order('nome')

  const lista: Patrocinador[] = parceiros ?? []

  return (
    <section
      id="parceiros"
      className="py-[140px] px-6 md:px-12 bg-pec-preto"
    >
      {/* Section header */}
      <div className="max-w-[1380px] mx-auto mb-16 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-16 items-end">
        <span
          className="font-bebas text-[120px] leading-none"
          style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(227,6,19,.3)' }}
        >
          05
        </span>
        <div>
          <div className="text-pec-vermelho text-[11px] tracking-[.3em] font-bold uppercase mb-3.5">Parceiros oficiais</div>
          <h2 className="font-bebas text-[clamp(48px,5vw,84px)] leading-[.95] uppercase text-white">
            Marcas que <span className="text-pec-vermelho">acreditam</span><br />no Piauizão
          </h2>
        </div>
      </div>

      {lista.length > 0 ? (
        <div className="max-w-[1380px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px"
          style={{ border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.08)' }}
        >
          {lista.map((p) => (
            <a
              key={p.id}
              href={p.site_url ?? '#'}
              target={p.site_url ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center justify-center p-8 min-h-[100px] bg-pec-preto transition-colors duration-300 hover:bg-pec-azul/20 no-underline group"
            >
              {p.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.logo_url}
                  alt={p.nome}
                  className="max-h-10 max-w-full object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300 grayscale group-hover:grayscale-0"
                />
              ) : (
                <span className="font-archivo font-black text-[13px] tracking-[.12em] uppercase text-pec-cinza group-hover:text-white transition-colors duration-300">
                  {p.nome}
                </span>
              )}
            </a>
          ))}
        </div>
      ) : (
        <div className="max-w-[1380px] mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-px"
          style={{ border: '1px solid rgba(255,255,255,.08)', background: 'rgba(255,255,255,.08)' }}
        >
          {['J.MONTE', 'DURAFIX', 'AMANCO', 'CORAL', 'USINA SANTANA', 'PARCEIRO 06'].map((nome) => (
            <div
              key={nome}
              className="flex items-center justify-center p-8 min-h-[100px] bg-pec-preto"
            >
              <span className="font-archivo font-black text-[13px] tracking-[.12em] uppercase text-pec-cinza/40">
                {nome}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="max-w-[1380px] mx-auto mt-10 text-center">
        <a
          href="#planos"
          className="text-pec-cinza text-[13px] tracking-[.05em] no-underline hover:text-pec-vermelho transition-colors border-b border-white/20 pb-0.5 hover:border-pec-vermelho"
        >
          Quer seu negócio aqui? Ver planos para empresas →
        </a>
      </div>
    </section>
  )
}

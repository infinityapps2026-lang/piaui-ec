import SiteHeader from '@/app/_components/SiteHeader'
import SiteFooter from '@/app/_components/SiteFooter'
import SocioPublicoForm from './_components/SocioPublicoForm'

export const metadata = {
  title: 'Seja Sócio — Piauí Esporte Clube',
  description: 'Associe-se ao Piauí Esporte Clube e faça parte da história do Piauizão.',
}

const BENEFICIOS = [
  'Desconto em ingressos',
  'Carteirinha oficial do sócio',
  'Acesso antecipado a jogos',
  'Descontos em parceiros oficiais',
  'Conteúdos exclusivos',
]

export default async function SejaSocioPage(props: PageProps<'/seja-socio'>) {
  const searchParams = await props.searchParams
  const planoInicial = (searchParams?.plano as string) ?? ''

  return (
    <>
      <SiteHeader />
      <main style={{ background: 'linear-gradient(180deg, #050f2c 0%, #02060f 100%)', minHeight: '100vh' }}>

        {/* Background texture */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <section className="min-h-screen pt-[120px] pb-[100px] px-6 md:px-12 relative z-10 flex items-center">
          <div className="max-w-[1100px] mx-auto w-full grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-16 items-start">

            {/* Coluna esquerda — apresentação */}
            <div className="lg:pt-8">
              <div className="inline-flex items-center gap-3 text-[11px] tracking-[.3em] text-pec-vermelho font-bold uppercase mb-7 before:content-[''] before:w-9 before:h-[2px] before:bg-pec-vermelho">
                Programa Sócio Torcedor 2026
              </div>

              <h1 className="font-bebas text-[clamp(56px,7vw,100px)] leading-[.9] tracking-tight uppercase mb-6 text-white">
                Faça parte<br />da <span className="text-pec-vermelho">história</span><br />vibrante
              </h1>

              <p className="text-[17px] text-[#c9d2e8] max-w-[480px] mb-10 leading-relaxed">
                Mais que torcer — viva o Piauizão por dentro. Preencha o formulário e nossa equipe entrará em contato para confirmar sua adesão.
              </p>

              {/* Benefícios */}
              <ul className="space-y-0">
                {BENEFICIOS.map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-3 py-3.5 text-[14px] text-[#d4dcef]"
                    style={{ borderBottom: '1px solid rgba(255,255,255,.06)' }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 shrink-0 text-pec-vermelho">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-10 text-pec-cinza text-[13px] leading-relaxed">
                Dúvidas? Fale conosco em{' '}
                <a href="mailto:timemarketing.pec@gmail.com" className="text-pec-vermelho hover:underline no-underline">
                  timemarketing.pec@gmail.com
                </a>
              </div>
            </div>

            {/* Coluna direita — formulário */}
            <div
              className="p-8 md:p-10 border border-pec-vermelho/30"
              style={{ background: 'rgba(10,31,79,.5)', backdropFilter: 'blur(12px)' }}
            >
              <div className="mb-8">
                <p className="text-pec-vermelho text-[10px] tracking-[.3em] font-bold uppercase mb-2">
                  Cadastro rápido
                </p>
                <h2 className="font-bebas text-[32px] leading-none uppercase text-white">
                  {planoInicial ? `Plano ${planoInicial}` : 'Escolha seu plano'}
                </h2>
              </div>

              <SocioPublicoForm planoInicial={planoInicial} />
            </div>

          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}

import Link from 'next/link'
import SiteHeader from '@/app/_components/SiteHeader'
import SiteFooter from '@/app/_components/SiteFooter'

export const metadata = {
  title: 'Cadastro Recebido',
  robots: { index: false, follow: false },
}

export default function ObrigadoPage() {
  return (
    <>
      <SiteHeader />
      <main
        className="min-h-screen flex items-center justify-center px-6 py-32"
        style={{ background: 'linear-gradient(180deg, #050f2c 0%, #02060f 100%)' }}
      >
        <div className="max-w-[560px] mx-auto text-center">
          {/* Ícone de check */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ background: 'rgba(74,222,128,.12)', border: '2px solid rgba(74,222,128,.4)' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" className="w-9 h-9">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <div className="text-pec-vermelho text-[11px] tracking-[.3em] font-bold uppercase mb-4">
            Cadastro recebido
          </div>

          <h1 className="font-bebas text-[clamp(48px,6vw,80px)] leading-[.9] uppercase text-white mb-6">
            Bem-vindo ao<br /><span className="text-pec-vermelho">Piauizão!</span>
          </h1>

          <p className="text-[17px] text-[#c9d2e8] leading-relaxed mb-10">
            Recebemos seu cadastro com sucesso. Nossa equipe entrará em contato em breve pelo e-mail ou WhatsApp informado para confirmar sua adesão e orientar o pagamento.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 text-[11px] tracking-[.18em] uppercase font-bold bg-pec-vermelho text-white hover:bg-pec-vermelho-deep hover:-translate-y-0.5 transition-all no-underline"
          >
            Voltar ao site
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  )
}

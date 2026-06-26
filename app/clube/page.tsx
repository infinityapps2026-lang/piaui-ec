import { createClient } from '@/lib/supabase-server'
import SiteHeader from '@/app/_components/SiteHeader'
import SiteFooter from '@/app/_components/SiteFooter'

export const revalidate = 60

export const metadata = {
  title: 'O Clube',
  description: 'História, missão, diretoria e comissão técnica do Piauí Esporte Clube.',
  alternates: { canonical: '/clube' },
  openGraph: {
    type: 'website' as const,
    url: '/clube',
    title: 'O Clube — Piauí Esporte Clube',
    description: 'História, missão, diretoria e comissão técnica do Piauí Esporte Clube.',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'O Clube — Piauí Esporte Clube',
    description: 'História, missão, diretoria e comissão técnica do Piauí Esporte Clube.',
  },
}

type Info = { id: string; chave: string; titulo: string; conteudo: string | null }

// Ordem editorial: História → Missão/Visão/Valores → Diretoria → Comissão Técnica → demais
function prioridade(chave: string): number {
  const c = chave.toLowerCase()
  if (c.includes('histor')) return 0
  if (c.includes('missao') || c.includes('miss') || c.includes('visao') || c.includes('valor')) return 1
  if (c.includes('diretor')) return 2
  if (c.includes('comiss') || c.includes('tecnic') || c.includes('tcnic')) return 3
  return 99
}

export default async function ClubePublicaPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('clube_info')
    .select('id, chave, titulo, conteudo')

  const infos: Info[] = (data ?? []).slice().sort((a, b) => {
    const pa = prioridade(a.chave)
    const pb = prioridade(b.chave)
    if (pa !== pb) return pa - pb
    return a.titulo.localeCompare(b.titulo)
  })

  return (
    <>
      <SiteHeader />
      <main className="bg-white">
        {/* Hero */}
        <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 bg-gradient-to-br from-[#050f2c] via-[#0a1f4f] to-[#02060f] text-white overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, white 0 1px, transparent 1px 18px)',
            }}
          />
          <div className="relative max-w-5xl mx-auto px-5 md:px-10">
            <p className="text-pec-vermelho text-[11px] md:text-xs tracking-[.32em] font-bold uppercase mb-4">
              Institucional
            </p>
            <h1 className="font-archivo font-black text-4xl md:text-6xl tracking-tight leading-[1.05]">
              O Clube
            </h1>
            <p className="mt-5 text-white/70 text-base md:text-lg max-w-2xl leading-relaxed">
              Conheça a história, a missão e as pessoas que fazem do Piauí Esporte Clube
              uma das instituições mais tradicionais do futebol piauiense.
            </p>
          </div>
        </section>

        {/* Conteúdo */}
        <section className="py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-5 md:px-10 space-y-14 md:space-y-20">
            {infos.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-300 rounded-2xl">
                <p className="text-slate-500 text-lg font-medium">
                  Conteúdo institucional em breve.
                </p>
              </div>
            ) : (
              infos.map((info, idx) => (
                <article key={info.id} id={info.chave} className="scroll-mt-28">
                  <p className="text-pec-vermelho text-[10px] md:text-xs tracking-[.32em] font-bold uppercase mb-3">
                    {String(idx + 1).padStart(2, '0')} — Capítulo
                  </p>
                  <h2 className="font-archivo font-black text-2xl md:text-4xl text-[#0a1f4f] tracking-tight leading-tight mb-6">
                    {info.titulo}
                  </h2>
                  <div className="h-1 w-16 bg-pec-vermelho mb-8" />
                  {info.conteudo && (
                    <div className="prose prose-slate max-w-none text-slate-700 text-base md:text-[17px] leading-[1.75] whitespace-pre-line">
                      {info.conteudo}
                    </div>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}

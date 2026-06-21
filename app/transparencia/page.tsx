import { createClient } from '@/lib/supabase-server'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import SiteHeader from '@/app/_components/SiteHeader'
import SiteFooter from '@/app/_components/SiteFooter'

export const revalidate = 60

export const metadata = {
  title: 'Transparência',
  description: 'Documentos financeiros e institucionais do Piauí Esporte Clube publicados de forma aberta para sócios e torcedores.',
  alternates: { canonical: '/transparencia' },
  openGraph: {
    type: 'website' as const,
    url: '/transparencia',
    title: 'Transparência — Piauí Esporte Clube',
    description: 'Contratos, balancetes, atas e relatórios do Piauí EC publicados de forma aberta.',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Transparência — Piauí Esporte Clube',
    description: 'Contratos, balancetes, atas e relatórios do Piauí EC publicados de forma aberta.',
  },
}

const TIPO_LABELS: Record<string, string> = {
  contrato:   'Contratos',
  balancete:  'Balancetes',
  ata:        'Atas',
  relatorio:  'Relatórios',
  outros:     'Outros',
}

type Documento = {
  id: string
  titulo: string
  descricao: string | null
  tipo: string | null
  valor: number | null
  arquivo_url: string | null
  data_documento: string | null
}

function IconePDF() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e30613" strokeWidth="1.75">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function IconeExternalLink() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function GrupoDocumentos({ tipo, docs }: { tipo: string; docs: Documento[] }) {
  const label = TIPO_LABELS[tipo] ?? tipo.charAt(0).toUpperCase() + tipo.slice(1)

  return (
    <div>
      <h2 className="font-bebas text-[28px] tracking-[.1em] text-white uppercase mb-5 flex items-center gap-4">
        {label}
        <span className="flex-1 h-px bg-white/10" />
      </h2>
      <div className="border border-white/[.08] overflow-hidden">
        {docs.map((doc, i) => (
          <div
            key={doc.id}
            className="flex items-center justify-between gap-6 px-6 py-5 transition-colors hover:bg-white/[.03]"
            style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,.06)' : undefined }}
          >
            <div className="flex items-start gap-4 min-w-0">
              {/* Ícone PDF */}
              <div className="w-10 h-10 bg-pec-vermelho/10 border border-pec-vermelho/20 flex items-center justify-center shrink-0 mt-0.5">
                <IconePDF />
              </div>

              <div className="min-w-0">
                <p className="font-archivo font-bold text-white text-[14px] leading-snug mb-1">
                  {doc.titulo}
                </p>
                {doc.descricao && (
                  <p className="text-pec-cinza text-[12px] leading-relaxed line-clamp-2">
                    {doc.descricao}
                  </p>
                )}
                <div className="flex gap-5 mt-2 flex-wrap">
                  {doc.data_documento && (
                    <span className="text-pec-cinza text-[11px]">
                      {format(new Date(doc.data_documento), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  )}
                  {doc.valor !== null && (
                    <span className="text-pec-amarelo text-[11px] font-bold tabular-nums">
                      {doc.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Botão de download */}
            {doc.arquivo_url ? (
              <a
                href={doc.arquivo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 border border-pec-vermelho/40 text-pec-vermelho hover:bg-pec-vermelho hover:text-white text-[11px] tracking-[.15em] uppercase font-bold transition-colors no-underline"
              >
                PDF <IconeExternalLink />
              </a>
            ) : (
              <span className="shrink-0 px-4 py-2.5 border border-white/[.08] text-pec-cinza/40 text-[11px] tracking-[.15em] uppercase font-bold">
                Sem PDF
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function TransparenciaPublicaPage() {
  const supabase = await createClient()
  const { data: documentos } = await supabase
    .from('transparencia')
    .select('id, titulo, descricao, tipo, valor, arquivo_url, data_documento')
    .eq('publicado', true)
    .order('data_documento', { ascending: false, nullsFirst: false })

  const lista: Documento[] = documentos ?? []

  const grupos = lista.reduce<Record<string, Documento[]>>((acc, doc) => {
    const key = doc.tipo ?? 'outros'
    acc[key] = [...(acc[key] ?? []), doc]
    return acc
  }, {})

  return (
    <>
      <SiteHeader />
      <main style={{ background: 'linear-gradient(180deg, #050f2c 0%, #02060f 100%)', minHeight: '100vh' }}>

        {/* Page header */}
        <section className="pt-[140px] pb-[60px] px-6 md:px-12 relative overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
          <div className="max-w-[1380px] mx-auto relative z-10 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-16 items-end">
            <span
              className="font-bebas text-[120px] leading-none"
              style={{ color: 'transparent', WebkitTextStroke: '1.5px rgba(227,6,19,.3)' }}
            >
              TR
            </span>
            <div>
              <div className="text-pec-vermelho text-[11px] tracking-[.3em] font-bold uppercase mb-3.5">
                Prestação de contas
              </div>
              <h1 className="font-bebas text-[clamp(48px,5vw,84px)] leading-[.95] uppercase text-white">
                Transparência<br /><span className="text-pec-vermelho">financeira</span>
              </h1>
              <p className="text-pec-cinza text-[15px] leading-relaxed mt-5 max-w-[560px]">
                O Piauí Esporte Clube publica seus documentos financeiros e institucionais de forma aberta. Acesse contratos, balancetes e atas abaixo.
              </p>
            </div>
          </div>
        </section>

        {/* Lista de documentos */}
        <section className="pb-[120px] px-6 md:px-12">
          <div className="max-w-[1380px] mx-auto">
            {lista.length === 0 ? (
              <div className="text-center py-32">
                <p className="text-pec-cinza text-lg">Nenhum documento publicado ainda.</p>
              </div>
            ) : (
              <div className="space-y-14">
                {Object.entries(grupos).map(([tipo, docs]) => (
                  <GrupoDocumentos key={tipo} tipo={tipo} docs={docs} />
                ))}
              </div>
            )}
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}

import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import SiteHeader from '@/app/_components/SiteHeader'
import SiteFooter from '@/app/_components/SiteFooter'
import NoticiasCarrossel from '@/app/_components/NoticiasCarrossel'
import { labelCategoria } from '@/app/_lib/categorias-noticias'

export const revalidate = 60

export const metadata = {
  title: 'Notícias',
  description: 'Últimas notícias do Piauizão: jogos, contratações, bastidores e muito mais.',
  alternates: { canonical: '/noticias' },
  openGraph: {
    type: 'website' as const,
    url: '/noticias',
    title: 'Notícias — Piauí Esporte Clube',
    description: 'Últimas notícias do Piauizão: jogos, contratações, bastidores e muito mais.',
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Notícias — Piauí Esporte Clube',
    description: 'Últimas notícias do Piauizão: jogos, contratações, bastidores e muito mais.',
  },
}

export default async function NoticiasPublicaPage() {
  const supabase = await createClient()
  const { data: noticias } = await supabase
    .from('noticias')
    .select('id, titulo, slug, resumo, categoria, imagem_capa, autor, data_publicacao')
    .eq('publicado', true)
    .order('data_publicacao', { ascending: false, nullsFirst: false })

  const lista = noticias ?? []
  const destaques = lista.slice(0, 5)

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
              NW
            </span>
            <div>
              <div className="text-pec-vermelho text-[11px] tracking-[.3em] font-bold uppercase mb-3.5">
                Sala de imprensa
              </div>
              <h1 className="font-bebas text-[clamp(48px,5vw,84px)] leading-[.95] uppercase text-white">
                Últimas <span className="text-pec-vermelho">notícias</span><br />do Piauizão
              </h1>
            </div>
          </div>
        </section>

        {/* Carrossel de destaques */}
        {destaques.length > 0 && (
          <NoticiasCarrossel noticias={destaques} variant="page" />
        )}

        {/* Grid de notícias */}
        <section className="pb-[120px] pt-[80px] px-6 md:px-12">
          <div className="max-w-[1380px] mx-auto">
            {lista.length === 0 ? (
              <div className="text-center py-32">
                <p className="text-pec-cinza text-lg">Nenhuma notícia publicada ainda.</p>
              </div>
            ) : (
              <>
                <div className="mb-10 flex items-center gap-4">
                  <span className="text-pec-vermelho text-[11px] tracking-[.3em] font-bold uppercase">
                    Todas as notícias
                  </span>
                  <span className="flex-1 h-px bg-white/10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lista.map((n) => (
                    <Link
                      key={n.id}
                      href={`/noticias/${n.slug}`}
                      className="group block border border-white/[.08] overflow-hidden transition-all duration-300 hover:border-pec-vermelho/40 hover:-translate-y-1 no-underline"
                      style={{ background: 'rgba(10,31,79,.3)' }}
                    >
                      <div className="aspect-video overflow-hidden bg-pec-azul-deep relative">
                        {n.imagem_capa ? (
                          <Image
                            src={n.imagem_capa}
                            alt={n.titulo}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-bebas text-[60px] text-white/10">
                              {n.categoria?.[0] ?? 'N'}
                            </span>
                          </div>
                        )}
                        {n.categoria && (
                          <span className="absolute top-3 left-3 px-2.5 py-1 bg-pec-vermelho text-white text-[10px] tracking-[.2em] uppercase font-bold">
                            {labelCategoria(n.categoria)}
                          </span>
                        )}
                      </div>

                      <div className="p-6">
                        <h2 className="font-archivo font-black text-[16px] text-white leading-snug mb-3 line-clamp-2 group-hover:text-pec-vermelho transition-colors duration-200">
                          {n.titulo}
                        </h2>
                        {n.resumo && (
                          <p className="text-pec-cinza text-[13px] leading-relaxed line-clamp-3 mb-4">
                            {n.resumo}
                          </p>
                        )}
                        <div className="flex items-center justify-between pt-4 border-t border-white/[.06]">
                          <span className="text-pec-cinza text-[11px] tracking-[.1em]">
                            {n.autor ?? 'Redação PEC'}
                          </span>
                          {n.data_publicacao && (
                            <span className="text-pec-cinza text-[11px]">
                              {format(new Date(n.data_publicacao), "dd 'de' MMM", { locale: ptBR })}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}

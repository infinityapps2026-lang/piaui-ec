'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { labelCategoria } from '@/app/_lib/categorias-noticias'

export type NoticiaCard = {
  id: string
  titulo: string
  slug: string
  resumo: string | null
  categoria: string | null
  imagem_capa: string | null
  autor: string | null
  data_publicacao: string | null
}

type Props = {
  noticias: NoticiaCard[]
  intervalo?: number
  variant?: 'home' | 'page'
}

export default function NoticiasCarrossel({ noticias, intervalo = 6000, variant = 'home' }: Props) {
  const [index, setIndex] = useState(0)
  const [pausado, setPausado] = useState(false)
  const total = noticias.length

  const proximo = useCallback(() => setIndex((i) => (i + 1) % total), [total])
  const anterior = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total])

  useEffect(() => {
    if (pausado || total <= 1) return
    const id = setInterval(proximo, intervalo)
    return () => clearInterval(id)
  }, [proximo, intervalo, pausado, total])

  if (total === 0) return null

  const isHome = variant === 'home'

  return (
    <section
      id="noticias"
      className={isHome ? 'py-[120px] px-6 md:px-12 relative' : 'pb-[60px] px-6 md:px-12 relative'}
      style={isHome ? { background: 'linear-gradient(180deg, #02060f 0%, #050f2c 100%)' } : undefined}
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
    >
      {isHome && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      )}

      {isHome && (
        <div className="max-w-[1380px] mx-auto mb-16 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-16 items-end relative z-10">
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
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <h2 className="font-bebas text-[clamp(48px,5vw,84px)] leading-[.95] uppercase text-white">
                Últimas <span className="text-pec-vermelho">notícias</span>
              </h2>
              <Link
                href="/noticias"
                className="text-pec-cinza text-[13px] tracking-[.05em] no-underline border-b border-white/20 pb-0.5 hover:text-pec-vermelho hover:border-pec-vermelho transition-colors"
              >
                Ver todas →
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[1380px] mx-auto relative z-10">
        <div className="relative overflow-hidden rounded-lg border border-white/[.08]">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${index * 100}%)` }}
          >
            {noticias.map((n, idx) => (
              <Link
                key={n.id}
                href={`/noticias/${n.slug}`}
                className="w-full shrink-0 grid grid-cols-1 md:grid-cols-2 group no-underline"
                style={{ background: 'rgba(10,31,79,.4)' }}
              >
                <div className="aspect-[16/10] md:aspect-auto md:min-h-[420px] relative overflow-hidden bg-pec-azul-deep">
                  {n.imagem_capa ? (
                    <Image
                      src={n.imagem_capa}
                      alt={n.titulo}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority={idx === 0}
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-bebas text-[100px] text-white/10">
                        {n.categoria?.[0] ?? 'N'}
                      </span>
                    </div>
                  )}
                  <div
                    className="absolute inset-0 md:hidden"
                    style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(2,6,15,.85) 100%)' }}
                  />
                </div>

                <div className="p-8 md:p-12 flex flex-col justify-center">
                  {n.categoria && (
                    <span className="self-start mb-4 px-2.5 py-1 bg-pec-vermelho text-white text-[10px] tracking-[.2em] uppercase font-bold">
                      {labelCategoria(n.categoria)}
                    </span>
                  )}
                  <h3 className="font-bebas text-[clamp(28px,3vw,44px)] leading-[1.05] uppercase text-white mb-4 group-hover:text-pec-vermelho transition-colors duration-200">
                    {n.titulo}
                  </h3>
                  {n.resumo && (
                    <p className="text-pec-cinza text-[14px] md:text-[15px] leading-relaxed mb-6 line-clamp-3">
                      {n.resumo}
                    </p>
                  )}
                  <div className="flex items-center justify-between pt-5 border-t border-white/[.08] text-[12px] text-pec-cinza tracking-[.08em]">
                    <span>{n.autor ?? 'Redação PEC'}</span>
                    {n.data_publicacao && (
                      <span>{format(new Date(n.data_publicacao), "dd 'de' MMM yyyy", { locale: ptBR })}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); anterior() }}
                aria-label="Notícia anterior"
                className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center bg-black/40 hover:bg-pec-vermelho text-white rounded-full backdrop-blur-sm transition-colors z-20"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); proximo() }}
                aria-label="Próxima notícia"
                className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center bg-black/40 hover:bg-pec-vermelho text-white rounded-full backdrop-blur-sm transition-colors z-20"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}
        </div>

        {total > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {noticias.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Ir para notícia ${i + 1}`}
                className={`h-1.5 transition-all duration-300 ${
                  i === index ? 'w-10 bg-pec-vermelho' : 'w-4 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

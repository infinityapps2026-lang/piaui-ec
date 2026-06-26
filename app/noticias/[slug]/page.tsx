import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Image from 'next/image'
import DOMPurify from 'isomorphic-dompurify'
import SiteHeader from '@/app/_components/SiteHeader'
import SiteFooter from '@/app/_components/SiteFooter'
import { labelCategoria } from '@/app/_lib/categorias-noticias'

function renderConteudo(raw: string): string {
  const hasHtmlTags = /<\/?[a-z][\s\S]*?>/i.test(raw)
  const html = hasHtmlTags
    ? raw
    : raw
        .split(/\n{2,}/)
        .map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`)
        .join('')
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
      'h2', 'h3', 'h4',
      'ul', 'ol', 'li',
      'blockquote',
      'a', 'img',
      'code', 'pre',
      'hr',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class'],
  })
}

export const revalidate = 60

export async function generateMetadata(props: PageProps<'/noticias/[slug]'>) {
  const { slug } = await props.params
  const supabase = await createClient()
  const { data } = await supabase
    .from('noticias')
    .select('titulo, resumo, autor, data_publicacao')
    .eq('slug', slug)
    .eq('publicado', true)
    .single()

  if (!data) return {}

  const title = data.titulo
  const description = data.resumo ?? `Leia ${data.titulo} no portal oficial do Piauí Esporte Clube.`
  const url = `/noticias/${slug}`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      publishedTime: data.data_publicacao ?? undefined,
      authors: data.autor ? [data.autor] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function NoticiaPage(props: PageProps<'/noticias/[slug]'>) {
  const { slug } = await props.params

  const supabase = await createClient()
  const { data: noticia } = await supabase
    .from('noticias')
    .select('id, titulo, slug, resumo, conteudo, categoria, imagem_capa, autor, data_publicacao')
    .eq('slug', slug)
    .eq('publicado', true)
    .single()

  if (!noticia) notFound()

  return (
    <>
      <SiteHeader />
      <main style={{ background: 'linear-gradient(180deg, #050f2c 0%, #02060f 100%)', minHeight: '100vh' }}>

        {/* Hero com imagem de capa */}
        {noticia.imagem_capa ? (
          <div className="relative h-[420px] overflow-hidden">
            <Image
              src={noticia.imagem_capa}
              alt={noticia.titulo}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ opacity: 0.45 }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, rgba(5,15,44,.5) 0%, #050f2c 100%)' }}
            />
          </div>
        ) : (
          <div className="h-[120px]" />
        )}

        {/* Artigo */}
        <article
          className="px-6 md:px-12 pb-[120px]"
          style={{ marginTop: noticia.imagem_capa ? '-80px' : '0', position: 'relative', zIndex: 10 }}
        >
          <div className="max-w-[800px] mx-auto">

            {/* Voltar */}
            <Link
              href="/noticias"
              className="inline-flex items-center gap-2 text-pec-cinza hover:text-pec-vermelho text-[12px] tracking-[.15em] uppercase font-bold no-underline transition-colors mb-8"
            >
              ← Todas as notícias
            </Link>

            {/* Categoria */}
            {noticia.categoria && (
              <div className="mb-5">
                <span className="inline-flex px-3 py-1 bg-pec-vermelho text-white text-[10px] tracking-[.25em] uppercase font-bold">
                  {labelCategoria(noticia.categoria)}
                </span>
              </div>
            )}

            {/* Título */}
            <h1 className="font-bebas text-[clamp(40px,5vw,72px)] leading-[.95] uppercase text-white mb-6">
              {noticia.titulo}
            </h1>

            {/* Metadata */}
            <div
              className="flex items-center gap-6 text-pec-cinza text-[12px] tracking-[.08em] pb-8 mb-8"
              style={{ borderBottom: '1px solid rgba(255,255,255,.08)' }}
            >
              {noticia.autor && (
                <span>Por <strong className="text-white font-semibold">{noticia.autor}</strong></span>
              )}
              {noticia.data_publicacao && (
                <span>
                  {format(new Date(noticia.data_publicacao), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </span>
              )}
            </div>

            {/* Resumo em destaque */}
            {noticia.resumo && (
              <p className="text-[18px] text-[#c9d2e8] leading-relaxed mb-8 font-medium">
                {noticia.resumo}
              </p>
            )}

            {/* Corpo do artigo */}
            {noticia.conteudo && (
              <div
                className="noticia-conteudo text-pec-cinza text-[15px] leading-[1.8]"
                dangerouslySetInnerHTML={{ __html: renderConteudo(noticia.conteudo) }}
              />
            )}

          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  )
}

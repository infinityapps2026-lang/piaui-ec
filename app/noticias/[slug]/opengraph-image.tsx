import { ImageResponse } from 'next/og'
import { createClient } from '@/lib/supabase-server'
import { labelCategoria } from '@/app/_lib/categorias-noticias'

export const runtime = 'nodejs'
export const alt = 'Notícia — Piauí Esporte Clube'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const supabase = await createClient()
  const { data } = await supabase
    .from('noticias')
    .select('titulo, categoria, imagem_capa, autor')
    .eq('slug', slug)
    .eq('publicado', true)
    .single()

  const titulo = data?.titulo ?? 'Piauí Esporte Clube'
  const categoria = labelCategoria(data?.categoria)
  const autor = data?.autor ?? 'Redação PEC'
  const capa = data?.imagem_capa ?? null

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: 'linear-gradient(135deg, #050f2c 0%, #02060f 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        {capa && (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img
            src={capa}
            width={1200}
            height={630}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: 0.55,
            }}
          />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(2,6,15,.35) 0%, rgba(2,6,15,.95) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '72px 80px',
            color: 'white',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 12,
                height: 56,
                background: '#e30613',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 18, letterSpacing: 6, fontWeight: 800, color: '#e30613' }}>
                PIAUÍ ESPORTE CLUBE
              </span>
              <span style={{ fontSize: 14, letterSpacing: 4, color: '#9aa3b8' }}>FUNDADO EM 1948</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {categoria && (
              <div
                style={{
                  display: 'flex',
                  alignSelf: 'flex-start',
                  padding: '8px 18px',
                  background: '#e30613',
                  fontSize: 18,
                  letterSpacing: 6,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                {categoria}
              </div>
            )}
            <div
              style={{
                fontSize: titulo.length > 80 ? 56 : 72,
                lineHeight: 1.05,
                fontWeight: 900,
                letterSpacing: -1,
                maxWidth: 1040,
                display: 'flex',
              }}
            >
              {titulo}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                fontSize: 22,
                color: '#cbd5e1',
                letterSpacing: 1,
              }}
            >
              <span>{autor}</span>
              <span style={{ color: '#475569' }}>•</span>
              <span>piauiec.com.br</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}

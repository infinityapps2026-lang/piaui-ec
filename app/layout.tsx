import type { Metadata } from 'next'
import { Bebas_Neue, Archivo } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-bebas-neue',
})

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-archivo',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.piauiec.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Piauí Esporte Clube — Sócio Torcedor Vibrante',
    template: '%s — Piauí Esporte Clube',
  },
  description:
    'Faça parte da história do Piauizão. Ingressos com desconto, experiências exclusivas e o orgulho de fortalecer o clube que carrega o nome do Piauí.',
  applicationName: 'Piauí Esporte Clube',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Piauí Esporte Clube',
    url: SITE_URL,
    title: 'Piauí Esporte Clube — Sócio Torcedor Vibrante',
    description:
      'Faça parte da história do Piauizão. Ingressos com desconto, experiências exclusivas e o orgulho de fortalecer o clube que carrega o nome do Piauí.',
    images: [{ url: '/imagem/logo.png', width: 1200, height: 1200, alt: 'Escudo Piauí Esporte Clube' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Piauí Esporte Clube — Sócio Torcedor Vibrante',
    description:
      'Faça parte da história do Piauizão. Ingressos com desconto e experiências exclusivas.',
    images: ['/imagem/logo.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      className={`${bebasNeue.variable} ${archivo.variable} antialiased`}
    >
      <body className="font-archivo">{children}</body>
    </html>
  )
}

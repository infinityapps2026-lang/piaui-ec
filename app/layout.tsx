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

export const metadata: Metadata = {
  title: 'Piauí Esporte Clube — Sócio Torcedor Vibrante',
  description:
    'Faça parte da história do Piauizão. Ingressos com desconto, experiências exclusivas e o orgulho de fortalecer o clube que carrega o nome do Piauí.',
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

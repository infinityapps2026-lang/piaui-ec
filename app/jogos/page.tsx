import { createClient } from '@/lib/supabase-server'
import SiteHeader from '@/app/_components/SiteHeader'
import SiteFooter from '@/app/_components/SiteFooter'
import Jogos from '@/app/_components/Jogos'

export const revalidate = 60

export const metadata = {
  title: 'Jogos & Tabela — Piauí Esporte Clube',
  description:
    'Próximo jogo, últimos resultados e classificação do Piauí EC na temporada.',
  alternates: { canonical: '/jogos' },
}

export default async function JogosPage() {
  const supabase = await createClient()

  const [
    { data: proximoJogoData },
    { data: jogosListaData },
    { data: classificacaoData },
  ] = await Promise.all([
    supabase
      .from('jogos')
      .select('*')
      .eq('status', 'agendado')
      .order('data_jogo', { ascending: true })
      .limit(1),
    supabase
      .from('jogos')
      .select('*')
      .order('data_jogo', { ascending: false }),
    supabase
      .from('classificacao')
      .select('*')
      .order('pos', { ascending: true }),
  ])

  const proximoJogo = proximoJogoData?.[0] ?? null
  const jogosLista = jogosListaData ?? []
  const classificacao = classificacaoData ?? []

  return (
    <>
      <SiteHeader />
      <main style={{ background: 'linear-gradient(180deg, #050f2c 0%, #02060f 100%)', minHeight: '100vh' }}>
        <div className="h-[88px]" />
        <Jogos
          proximoJogo={proximoJogo}
          jogosRecentes={jogosLista}
          classificacao={classificacao}
        />
      </main>
      <SiteFooter />
    </>
  )
}

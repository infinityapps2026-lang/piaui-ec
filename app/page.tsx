import { createClient } from '@/lib/supabase-server'
import SiteHeader from '@/app/_components/SiteHeader'
import Hero from '@/app/_components/Hero'
import Beneficios from '@/app/_components/Beneficios'
import Jogos from '@/app/_components/Jogos'
import Planos from '@/app/_components/Planos'
import Loja from '@/app/_components/Loja'
import Parceiros from '@/app/_components/Parceiros'
import CtaFinal from '@/app/_components/CtaFinal'
import SiteFooter from '@/app/_components/SiteFooter'

export const revalidate = 60

export default async function Home() {
  const supabase = await createClient()

  const [
    { count: sociosCount },
    { data: proximoJogoData },
    { data: jogosRecentesData },
  ] = await Promise.all([
    supabase
      .from('socios')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ativo'),
    supabase
      .from('jogos')
      .select('*')
      .eq('status', 'agendado')
      .order('data_jogo', { ascending: true })
      .limit(1),
    supabase
      .from('jogos')
      .select('*')
      .in('status', ['encerrado', 'ao_vivo'])
      .order('data_jogo', { ascending: false })
      .limit(6),
  ])

  const proximoJogo = proximoJogoData?.[0] ?? null
  const jogosRecentes = jogosRecentesData ?? []
  const totalSocios = sociosCount ?? 0

  return (
    <>
      <SiteHeader />
      <main>
        <Hero sociosCount={totalSocios} />
        <Beneficios />
        <Jogos proximoJogo={proximoJogo} jogosRecentes={jogosRecentes} />
        <Planos />
        <Loja />
        <Parceiros />
        <CtaFinal sociosCount={totalSocios} />
      </main>
      <SiteFooter />
    </>
  )
}

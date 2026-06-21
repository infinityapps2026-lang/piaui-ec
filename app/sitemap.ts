import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase-server'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.piauiec.com.br'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`,              lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${SITE_URL}/noticias`,      lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${SITE_URL}/seja-socio`,    lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/transparencia`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('noticias')
      .select('slug, data_publicacao')
      .eq('publicado', true)
      .order('data_publicacao', { ascending: false })

    const noticiasRoutes: MetadataRoute.Sitemap = (data ?? []).map((n) => ({
      url: `${SITE_URL}/noticias/${n.slug}`,
      lastModified: n.data_publicacao ? new Date(n.data_publicacao) : now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }))

    return [...staticRoutes, ...noticiasRoutes]
  } catch {
    return staticRoutes
  }
}

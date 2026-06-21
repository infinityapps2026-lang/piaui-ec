export const CATEGORIAS_NOTICIAS = [
  { value: 'institucional', label: 'Institucional' },
  { value: 'jogos', label: 'Jogos' },
  { value: 'contratacoes', label: 'Contratações' },
  { value: 'bastidores', label: 'Bastidores' },
] as const

export type CategoriaNoticia = (typeof CATEGORIAS_NOTICIAS)[number]['value']

const LABELS: Record<string, string> = Object.fromEntries(
  CATEGORIAS_NOTICIAS.map((c) => [c.value, c.label]),
)

export function labelCategoria(value: string | null | undefined): string {
  if (!value) return ''
  return LABELS[value] ?? value
}

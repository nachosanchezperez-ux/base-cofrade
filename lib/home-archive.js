// «El archivo en cifras» (28/11/2026): cuántas fichas tiene la central, en la
// cabecera de la portada. Reutiliza getHomeExploreStats (ya en la caché de la
// portada); una cifra sin dato no se muestra.

const FIGURES = [
  { key: 'brotherhood', label: ['hermandad', 'hermandades'], href: '/hermandades' },
  { key: 'image', label: ['imagen', 'imágenes'], href: '/imagenes' },
  { key: 'step', label: ['paso', 'pasos'], href: '/pasos' },
  { key: 'band', label: ['banda', 'bandas'], href: '/bandas' },
  { key: 'march', label: ['marcha', 'marchas'], href: '/marchas' },
  { key: 'agent', label: ['autor y artista', 'autores y artistas'], href: '/autores' },
]

const formatter = new Intl.NumberFormat('es-ES')

export function buildHomeArchiveFigures(stats = null) {
  const counts = new Map()
  for (const item of [...(stats?.directories || []), ...(stats?.graph || [])]) {
    if (item?.key && Number.isFinite(item.count) && item.count > 0) counts.set(item.key, item.count)
  }
  return FIGURES.filter((item) => counts.has(item.key)).map((item) => {
    const count = counts.get(item.key)
    return { key: item.key, figure: formatter.format(count), label: count === 1 ? item.label[0] : item.label[1], href: item.href }
  })
}

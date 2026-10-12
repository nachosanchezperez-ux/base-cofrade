// Accesos de «Descubre Hilo Cofrade» en la portada. Reutiliza las cifras que la
// Home ya carga (getHomeExploreStats); no añade consultas.

const PRIMARY = [
  { key: 'brotherhood', label: 'Hermandades', href: '/hermandades', noun: ['hermandad', 'hermandades'], source: 'directories' },
  { key: 'band', label: 'Bandas', href: '/bandas', noun: ['banda', 'bandas'], source: 'directories' },
  { key: 'march', label: 'Marchas', href: '/marchas', noun: ['marcha', 'marchas'], source: 'graph' },
  { key: 'image', label: 'Imágenes', href: '/imagenes', noun: ['imagen', 'imágenes'], source: 'directories' },
  { key: 'step', label: 'Pasos', href: '/pasos', noun: ['paso', 'pasos'], source: 'directories' },
  { key: 'agenda', label: 'Agenda', href: '/agenda-cofrade', detail: 'Hoy, mañana y fin de semana' },
]

// Accesos secundarios: cada uno con una línea que explica qué se encuentra.
export const HOME_DISCOVER_SECONDARY = [
  { label: 'Directorio completo', href: '/directorio', detail: 'Todas las fichas, por tipo' },
  { label: 'Autores', href: '/autores', detail: 'Compositores, imagineros y artistas' },
  { label: 'Crucetas musicales', href: '/crucetas-musicales', detail: 'Lo que sonó en cada salida' },
  { label: 'Igualás y ensayos', href: '/igualas-y-ensayos', detail: 'Convocatorias de las cuadrillas' },
  { label: 'Cambios musicales 2027', href: '/semana-santa/2027/cambios-musicales', detail: 'Bandas que cambian la próxima Semana Santa' },
  { label: 'Procesiones de Gloria', href: '/procesiones-de-gloria', detail: 'Salidas de gloria del año' },
  { label: 'Extraordinarias', href: '/extraordinarias', detail: 'Salidas extraordinarias anunciadas' },
]

const formatter = new Intl.NumberFormat('es-ES')

export function buildHomeDiscover(stats = null) {
  const counts = new Map()
  for (const item of [...(stats?.directories || []), ...(stats?.graph || [])]) {
    if (item?.key && Number.isFinite(item.count)) counts.set(item.key, item.count)
  }

  return PRIMARY.map((item) => {
    const count = counts.get(item.key)
    const detail = item.detail || (Number.isFinite(count)
      ? `${formatter.format(count)} ${count === 1 ? 'ficha' : 'fichas'}`
      : '')
    return { key: item.key, label: item.label, href: item.href, detail }
  })
}

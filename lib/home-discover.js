// Accesos de «Descubre Hilo Cofrade» en la portada. Reutiliza las cifras que la
// Home ya carga (getHomeExploreStats); no añade consultas.

// `hint`: qué se encuentra en cada sección. Desde el 28/11/2026 las cifras
// viven en la cabecera («El archivo en cifras»); aquí no se repiten.
const PRIMARY = [
  { key: 'brotherhood', label: 'Hermandades', href: '/hermandades', noun: ['hermandad', 'hermandades'], source: 'directories', hint: 'Historia, titulares y cultos' },
  { key: 'band', label: 'Bandas', href: '/bandas', noun: ['banda', 'bandas'], source: 'directories', hint: 'Repertorio y acompañamientos' },
  { key: 'march', label: 'Marchas', href: '/marchas', noun: ['marcha', 'marchas'], source: 'graph', hint: 'Autores y dedicatorias' },
  { key: 'image', label: 'Imágenes', href: '/imagenes', noun: ['imagen', 'imágenes'], source: 'directories', hint: 'Autoría y restauraciones' },
  { key: 'step', label: 'Pasos', href: '/pasos', noun: ['paso', 'pasos'], source: 'directories', hint: 'Patrimonio y música' },
  { key: 'agenda', label: 'Agenda', href: '/agenda-cofrade', detail: 'Hoy, mañana y fin de semana' },
]

// Accesos secundarios: cada uno con una línea que explica qué se encuentra.
export const HOME_DISCOVER_SECONDARY = [
  { label: 'Directorio completo', href: '/directorio', detail: 'Todas las fichas, por tipo' },
  { label: 'Autores', href: '/autores', detail: 'Compositores, imagineros y artistas' },
  { label: 'Crucetas musicales', href: '/crucetas-musicales', detail: 'Lo que sonó en cada salida' },
  { label: 'Igualás y ensayos', href: '/igualas-y-ensayos', detail: 'Convocatorias de las cuadrillas' },
  { label: 'Cambios musicales 2027', href: '/semana-santa/2027/cambios-musicales', detail: 'Bandas que cambian en 2027' },
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
    const hasCount = !item.detail && Number.isFinite(count)
    const unit = hasCount ? (count === 1 ? 'ficha' : 'fichas') : ''
    const total = hasCount ? formatter.format(count) : ''
    const detail = item.detail || (hasCount ? `${total} ${unit}` : '')
    // `total` y `unit` por separado para que la tarjeta destaque la cifra.
    return { key: item.key, label: item.label, href: item.href, detail, total, unit, hint: item.hint || item.detail || '' }
  })
}

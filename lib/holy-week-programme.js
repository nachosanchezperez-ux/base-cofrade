// Programa de mano de la Semana Santa de Sevilla 2027.
//
// El orden de paso por la Carrera Oficial es un dato anual y oficial del
// Consejo General de Hermandades y Cofradías: vive aquí, con su fuente, y no
// en la base de datos. Todo lo demás (escudos, colores, cortejo, bandas,
// horarios y recorridos de referencia) sale de Supabase.
//
// Funciones puras: se prueban con node --test.

export const PROGRAMME_YEAR = 2027
export const PROGRAMME_PATH = '/semana-santa-sevilla-2027'
export const REFERENCE_YEAR = 2026

export const PROGRAMME_SOURCES = {
  consejoOrden2027: {
    label: 'Consejo de Hermandades · orden de paso 2027',
    url: 'https://www.hermandades-de-sevilla.org/consejo/aprobado-el-orden-de-paso-por-la-carrera-oficial-del-miercoles-santo-jueves-santo-madrugada-y-viernes-santo-de-la-semana-santa-de-2027/',
  },
  consejoPrevias2026: {
    label: 'Consejo de Hermandades · nómina de vísperas 2026',
    url: 'https://www.hermandades-de-sevilla.org/wp-content/uploads/2026/03/nomina_previas.pdf',
  },
}

// status:
//   approved       orden aprobado para 2027
//   reference2026  se muestra el orden de 2026 hasta que se apruebe el de 2027
//   pending        sin orden: alfabético
// order:
//   carrera  el de la lista (orden por la Carrera Oficial)
//   salida   por hora de salida (vísperas, sin Carrera Oficial)
//   alfa     alfabético
// entries[].prev: puesto en 2026, solo donde el cambio está documentado.
// entries[].times: salida y entrada oficiales de 2026 (nómina de vísperas).
export const PROGRAMME_DAYS = [
  {
    id: 'viernes-de-dolores', short: 'V. Dolores', name: 'Viernes de Dolores', date: '2027-03-19',
    kind: 'visperas', status: 'approved', order: 'salida',
    entries: [
      { slug: 'bendicion-y-esperanza', times: ['17:00', '02:00'] },
      { slug: 'hermandad-de-pino-montano', times: ['17:45', '02:20'] },
      { slug: 'paz-y-misericordia-sevilla' },
      { slug: 'hermandad-de-la-mision-sevilla', times: ['18:15', '01:00'] },
      { slug: 'dulce-nombre-bellavista', times: ['18:30', '01:45'] },
      { slug: 'cristo-de-la-corona', times: ['19:00', '23:15'] },
      { slug: 'pasion-y-muerte', times: ['20:00', '00:30'] },
    ],
  },
  {
    id: 'sabado-de-pasion', short: 'S. Pasión', name: 'Sábado de Pasión', date: '2027-03-20',
    kind: 'visperas', status: 'approved', order: 'salida',
    entries: [
      { slug: 'padre-pio-sevilla', times: ['15:10', '01:30'] },
      { slug: 'la-milagrosa-sevilla', times: ['16:30', '00:00'] },
      { slug: 'torreblanca-jesus-cautivo', times: ['16:45', '02:15'] },
      { slug: 'san-jose-obrero-sevilla', times: ['16:55', '00:50'] },
      { slug: 'hermandad-del-divino-perdon', times: ['17:30', '01:00'] },
      { slug: 'agrupacion-cristo-desamparados-santo-angel' },
      { slug: 'la-espiga-sevilla' },
      { slug: 'maravillas-san-diego' },
      { slug: 'san-jeronimo-sevilla' },
    ],
  },
  {
    id: 'domingo-de-ramos', short: 'Ramos', name: 'Domingo de Ramos', date: '2027-03-21',
    kind: 'carrera', status: 'approved', order: 'carrera',
    note: 'Jesús Despojado pasa delante de la Sagrada Cena.',
    entries: [
      { slug: 'hermandad-del-amor', key: 'borriquita', label: 'La Borriquita', steps: ['paso-sagrada-entrada-jerusalen-amor'], keepOuting: true, prev: 1 },
      { slug: 'hermandad-jesus-despojado-sevilla', prev: 3 },
      { slug: 'la-cena', prev: 2 },
      { slug: 'hermandad-hiniesta-sevilla', prev: 4 },
      { slug: 'hermandad-de-la-paz', prev: 5 },
      { slug: 'hermandad-san-roque-sevilla', prev: 6 },
      { slug: 'hermandad-de-la-estrella', prev: 7 },
      { slug: 'hermandad-de-la-amargura', prev: 8 },
      { slug: 'hermandad-del-amor', withoutSteps: ['paso-sagrada-entrada-jerusalen-amor'], dropOuting: true, prev: 9 },
    ],
  },
  {
    id: 'lunes-santo', short: 'Lunes', name: 'Lunes Santo', date: '2027-03-22',
    kind: 'carrera', status: 'pending', order: 'alfa',
    note: 'El Consejo aún no ha aprobado el orden de esta jornada.',
    entries: [
      { slug: 'las-aguas-sevilla' }, { slug: 'el-museo' }, { slug: 'las-penas-de-san-vicente' },
      { slug: 'hermandad-de-la-redencion' }, { slug: 'hermandad-de-san-gonzalo' }, { slug: 'hermandad-de-san-pablo' },
      { slug: 'santa-genoveva' }, { slug: 'santa-marta-sevilla' }, { slug: 'vera-cruz-sevilla' },
    ],
  },
  {
    id: 'martes-santo', short: 'Martes', name: 'Martes Santo', date: '2027-03-23',
    kind: 'carrera', status: 'reference2026', order: 'carrera',
    note: 'Orden de 2026 mientras el Consejo aprueba el de 2027.',
    entries: [
      { slug: 'hermandad-cerro-del-aguila-sevilla' }, { slug: 'san-esteban' }, { slug: 'hermandad-candelaria-sevilla' },
      { slug: 'san-benito' }, { slug: 'hermandad-los-javieres-sevilla' }, { slug: 'hermandad-del-dulce-nombre-sevilla' },
      { slug: 'hermandad-de-los-estudiantes-sevilla' }, { slug: 'santa-cruz' },
    ],
  },
  {
    id: 'miercoles-santo', short: 'Miércoles', name: 'Miércoles Santo', date: '2027-03-24',
    kind: 'carrera', status: 'approved', order: 'carrera',
    note: 'Cierra el sistema de rotación de tres años.',
    entries: [
      { slug: 'carmen-doloroso', prev: 1 },
      { slug: 'hermandad-de-la-sed', prev: 3 },
      { slug: 'hermandad-de-san-bernardo', prev: 4 },
      { slug: 'hermandad-buen-fin-sevilla', prev: 2 },
      { slug: 'hermandad-sagrada-lanzada', prev: 5 },
      { slug: 'siete-palabras-sevilla', prev: 9 },
      { slug: 'cristo-de-burgos', prev: 8 },
      { slug: 'el-baratillo', prev: 6 },
      { slug: 'hermandad-de-los-panaderos', prev: 7 },
    ],
  },
  {
    id: 'jueves-santo', short: 'Jueves', name: 'Jueves Santo', date: '2027-03-25',
    kind: 'carrera', status: 'approved', order: 'carrera',
    entries: [
      { slug: 'hermandad-de-los-negritos' }, { slug: 'hermandad-de-la-exaltacion-sevilla' }, { slug: 'hermandad-de-las-cigarreras' },
      { slug: 'hermandad-monte-sion-sevilla' }, { slug: 'quinta-angustia-sevilla' }, { slug: 'el-valle' },
      { slug: 'hermandad-de-pasion-sevilla' },
    ],
  },
  {
    id: 'madrugada', short: 'Madrugada', name: 'Madrugada', date: '2027-03-26', dateLabel: 'Noche del 25 al 26 de marzo',
    kind: 'carrera', status: 'approved', order: 'carrera',
    note: 'Mismo orden y horarios que en 2026.',
    entries: [
      { slug: 'el-silencio-sevilla' }, { slug: 'hermandad-del-gran-poder-sevilla' }, { slug: 'hermandad-de-la-macarena' },
      { slug: 'el-calvario-sevilla' }, { slug: 'hermandad-esperanza-de-triana-sevilla' }, { slug: 'hermandad-gitanos-sevilla' },
    ],
  },
  {
    id: 'viernes-santo', short: 'Viernes', name: 'Viernes Santo', date: '2027-03-26',
    kind: 'carrera', status: 'approved', order: 'carrera',
    note: 'Mismo orden que en 2026.',
    entries: [
      { slug: 'hermandad-de-la-carreteria' }, { slug: 'soledad-san-buenaventura-sevilla' }, { slug: 'hermandad-del-cachorro' },
      { slug: 'hermandad-de-la-o' }, { slug: 'hermandad-san-isidoro-sevilla' }, { slug: 'montserrat' },
      { slug: 'sagrada-mortaja' },
    ],
  },
  {
    id: 'sabado-santo', short: 'Sábado', name: 'Sábado Santo', date: '2027-03-27',
    kind: 'carrera', status: 'approved', order: 'carrera',
    note: 'Mismo orden que en 2026.',
    entries: [
      { slug: 'hermandad-del-sol' }, { slug: 'servitas-sevilla' }, { slug: 'hermandad-de-la-trinidad-sevilla' },
      { slug: 'santo-entierro-sevilla' }, { slug: 'la-soledad-de-san-lorenzo' },
    ],
  },
  {
    id: 'domingo-de-resurreccion', short: 'Resurrección', name: 'Domingo de Resurrección', date: '2027-03-28',
    kind: 'carrera', status: 'approved', order: 'carrera',
    entries: [{ slug: 'la-resurreccion' }],
  },
]

// Orden de los pasos dentro del cortejo cuando hay dos delante del palio y el
// tipo de paso no basta para saber cuál va primero.
export const STEP_ORDER_OVERRIDES = {
  'san-benito': ['paso-de-misterio-de-la-sagrada-presentacion-de-jesus-al-pueblo', 'paso-del-cristo-de-la-sangre', 'paso-de-palio-de-nuestra-senora-de-la-encarnacion-coronada'],
  'el-valle': ['paso-cristo-coronacion-espinas-valle', 'paso-calle-amargura-valle', 'paso-palio-nuestra-senora-valle'],
  'hermandad-de-la-trinidad-sevilla': ['paso-misterio-sagrado-decreto-trinidad', 'paso-misterio-cinco-llagas-trinidad-sevilla', 'paso-palio-esperanza-trinidad-sevilla'],
  'santo-entierro-sevilla': ['paso-triunfo-santa-cruz-canina-sevilla', 'paso-urna-cristo-yacente-sevilla', 'paso-duelo-villaviciosa-sevilla'],
  'la-cena': ['paso-cristo-humildad-y-paciencia-la-cena', 'paso-misterio-sagrada-cena-sevilla', 'paso-palio-nuestra-senora-del-subterraneo'],
  'siete-palabras-sevilla': ['paso-divina-misericordia-siete-palabras', 'paso-misterio-santisimo-cristo-siete-palabras', 'paso-palio-nuestra-senora-cabeza-siete-palabras'],
  'hermandad-cerro-del-aguila-sevilla': ['paso-humildad-cerro-aguila', 'paso-misterio-desamparo-abandono-cerro-aguila', 'paso-palio-dolores-cerro-aguila'],
}

// Cortejos o pasos que salen sin acompañamiento musical (confirmado por la
// redacción). 'all' = toda la cofradía; si no, los pasos indicados.
export const SILENT = {
  'hermandad-del-gran-poder-sevilla': 'all',
  'santa-marta-sevilla': 'all',
  'la-soledad-de-san-lorenzo': 'all',
  'hermandad-san-isidoro-sevilla': 'all',
  'el-museo': ['paso-cristo-expiracion-museo-sevilla'],
  'hermandad-de-los-estudiantes-sevilla': ['paso-cristo-buena-muerte-estudiantes-sevilla'],
  'hermandad-de-pasion-sevilla': ['paso-nuestro-padre-jesus-pasion-sevilla'],
  'santo-entierro-sevilla': ['paso-triunfo-santa-cruz-canina-sevilla'],
  'hermandad-del-amor': ['paso-cristo-amor-sevilla'],
}

export function isSilentStep(brotherhoodSlug = '', stepSlug = '') {
  const rule = SILENT[brotherhoodSlug]
  if (!rule) return false
  return rule === 'all' || rule.includes(stepSlug)
}

// Bandas que se relevan en un mismo paso: una en la ida y otra en el regreso.
export const BAND_SEGMENTS = {
  'hermandad-de-la-sed': {
    'banda-musica-oliva-salteras': 'Ida',
    'banda-municipal-musica-mairena-del-alcor': 'Regreso',
  },
}

export function bandSegment(brotherhoodSlug = '', bandSlug = '') {
  return BAND_SEGMENTS[brotherhoodSlug]?.[bandSlug] || ''
}

const SEGMENT_ORDER = ['', 'Ida', 'Regreso']

export function orderBandsBySegment(bands = []) {
  return bands
    .map((band, index) => ({ band, index }))
    .sort((a, b) => SEGMENT_ORDER.indexOf(a.band.segment || '') - SEGMENT_ORDER.indexOf(b.band.segment || '') || a.index - b.index)
    .map(({ band }) => band)
}

export const PROGRAMME_BROTHERHOOD_SLUGS = [...new Set(PROGRAMME_DAYS.flatMap((day) => day.entries.map((entry) => entry.slug)))]

export function normalizeSearch(value = '') {
  return String(value || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

// Pasos que no salen en Semana Santa (glorias, custodias, procesiones eucarísticas).
export function isHolyWeekStep(stepType = '') {
  const type = normalizeSearch(stepType)
  if (!type) return true
  return !/(gloria|custodia|eucarist)/.test(type)
}

export function stepRank(step = {}) {
  const type = normalizeSearch(step.type)
  const name = normalizeSearch(step.name)
  if (type.includes('palio') || name.startsWith('paso de palio')) return 3
  return 2
}

export function orderSteps(steps = [], brotherhoodSlug = '') {
  const override = STEP_ORDER_OVERRIDES[brotherhoodSlug] || []
  return steps
    .map((step, index) => ({ step, index }))
    .sort((first, second) => {
      const a = override.indexOf(first.step.slug)
      const b = override.indexOf(second.step.slug)
      if (a >= 0 && b >= 0) return a - b
      return stepRank(first.step) - stepRank(second.step) || first.index - second.index
    })
    .map(({ step }) => step)
}

const ABBREVIATIONS = [
  [/Nuestra Señora/g, 'Ntra. Sra.'],
  [/Nuestro Padre Jesús/g, 'N. P. Jesús'],
  [/María Santísima/g, 'María Stma.'],
  [/Santísimo Cristo/g, 'Stmo. Cristo'],
  [/Santísima Virgen/g, 'Stma. Virgen'],
]

export function stepTitle(name = '') {
  let value = String(name || '').trim()
    .replace(/^Paso de misterio (del |de la |de )?/i, 'Misterio · ')
    .replace(/^Paso de palio de (la )?/i, 'Palio · ')
    .replace(/^Paso (procesional )?(del |de la |de los |de )/i, '')
  for (const [pattern, replacement] of ABBREVIATIONS) value = value.replace(pattern, replacement)
  return value ? value.charAt(0).toUpperCase() + value.slice(1) : ''
}

// «el Baratillo», «la Sed»: dentro de una frase, la Hermandad lleva su artículo.
export function brotherhoodInSentence(name = '', entityName = '') {
  const value = String(name || '').trim()
  const full = String(entityName || '').trim()
  if (/^(El|La|Los|Las) /.test(value)) return value.charAt(0).toLowerCase() + value.slice(1)
  if (/^Hermandad /.test(full)) return `la ${full}`
  if (/^Agrupaci[oó]n /.test(full)) return `la ${full}`
  return `la Hermandad de ${value}`
}

function cleanPoint(value = '') {
  const point = String(value || '').replace(/\s+/g, ' ').replace(/[.;]+$/g, '').trim()
  return point ? point.charAt(0).toUpperCase() + point.slice(1) : ''
}

// Itinerario en texto («A → B → C», «A · B», «A, B y C») → lista de calles.
// Devuelve [] cuando el texto no es una lista de calles (resúmenes genéricos).
export function routePoints(summary = '') {
  const text = String(summary || '').trim().replace(/\.\s*$/, '')
  if (!text) return []
  const usesComma = !/[→·]/.test(text) && text.includes(',')
  let parts = text.split(/\s*→\s*|\s*·\s*/)
  if (usesComma) {
    parts = text.split(/,\s*/)
    const last = parts.pop() || ''
    parts.push(...last.split(/\s+y\s+/))
  }
  const points = parts.map(cleanPoint).filter(Boolean)
  if (points.length < 4) return []
  if (points.some((point) => point.split(' ').length > 9)) return []
  return points
}

export function isCarreraOficial(point = '') {
  return /carrera oficial/i.test(point)
}

// Ida, Carrera Oficial y vuelta. Sin Carrera Oficial (vísperas), un solo tramo.
export function routeLegs(points = []) {
  const index = points.findIndex(isCarreraOficial)
  if (index < 0) return points.length ? [{ id: 'barrio', label: 'Por el barrio', points }] : []
  const outbound = points.slice(0, index)
  const inbound = points.slice(index + 1).filter((point) => !/^catedral$/i.test(point))
  return [
    ...(outbound.length ? [{ id: 'ida', label: 'Ida', points: outbound }] : []),
    { id: 'carrera', label: 'Carrera Oficial', points: [] },
    ...(inbound.length ? [{ id: 'vuelta', label: 'Vuelta', points: inbound }] : []),
  ]
}

// Color de la Hermandad utilizable con texto blanco encima y como color de
// enlace sobre blanco. Los colores claros (blanco, crema, celeste) pasan a azul
// marino para no perder contraste.
export function accentColor(hex = '') {
  const match = /^#?([0-9a-f]{6})$/i.exec(String(hex || '').trim())
  if (!match) return '#112339'
  const value = parseInt(match[1], 16)
  const r = (value >> 16) & 255
  const g = (value >> 8) & 255
  const b = value & 255
  const luminance = (0.299 * r) + (0.587 * g) + (0.114 * b)
  return luminance > 150 ? '#112339' : `#${match[1].toUpperCase()}`
}

export function shortTime(value = '') {
  const match = /^(\d{1,2}):(\d{2})/.exec(String(value || ''))
  return match ? `${match[1].padStart(2, '0')}:${match[2]}` : ''
}

function timeSortKey(time = '') {
  const value = shortTime(time)
  if (!value) return '99:99'
  // Las salidas de madrugada (antes de las 06:00) van al final de la jornada.
  return value < '06:00' ? `3${value}` : value
}

function articleless(name = '') {
  return normalizeSearch(String(name || '').replace(/^(El|La|Los|Las|Hermandad de(l| la| los| las)?) /, ''))
}

export function sortDayItems(day, items = []) {
  if (day.order === 'alfa') {
    return [...items].sort((a, b) => articleless(a.name).localeCompare(articleless(b.name), 'es'))
  }
  if (day.order === 'salida') {
    return [...items].sort((a, b) => (
      timeSortKey(a.departure).localeCompare(timeSortKey(b.departure))
      || articleless(a.name).localeCompare(articleless(b.name), 'es')
    ))
  }
  return items
}

// Posición visible: en el orden por salida solo numeran las que tienen hora.
export function dayPositions(day, items = []) {
  const numbered = day.status !== 'pending'
  return items.map((item, index) => {
    if (!numbered) return null
    if (day.order === 'salida' && !item.departure) return null
    return index + 1
  })
}

export function positionMove(day, entry, position) {
  if (day.status !== 'approved' || !entry?.prev || !position) return 0
  return entry.prev - position
}

export function dateLabel(isoDate = '') {
  const date = new Date(`${isoDate}T12:00:00Z`)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Madrid' }).format(date)
}

// Jornada que se abre por defecto: la de hoy o la siguiente; antes de la
// Semana Santa, la primera; después, la última.
export function initialDayId(days = PROGRAMME_DAYS, now = new Date()) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(now)
  const next = days.find((day) => day.date >= today)
  return (next || days[days.length - 1]).id
}

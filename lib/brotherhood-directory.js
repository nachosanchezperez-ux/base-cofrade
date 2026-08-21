export const HOLY_WEEK_DAYS = [
  'Viernes de Dolores',
  'Sábado de Pasión',
  'Domingo de Ramos',
  'Lunes Santo',
  'Martes Santo',
  'Miércoles Santo',
  'Jueves Santo',
  'Madrugada',
  'Viernes Santo',
  'Sábado Santo',
  'Domingo de Resurrección',
]

export const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

export const DIRECTORY_TYPES = [
  {
    key: 'semana-santa',
    type: 'Penitencia',
    label: 'Semana Santa',
    description: 'Hermandades organizadas por localidad y jornada de salida.',
    href: '/hermandades/semana-santa',
    icon: '/iconos/hermandades/penitencia.png',
  },
  {
    key: 'gloria',
    type: 'Gloria',
    label: 'Glorias',
    description: 'Devociones organizadas por localidad y mes principal.',
    href: '/hermandades/gloria',
    icon: '/iconos/hermandades/gloria.png',
  },
  {
    key: 'sacramentales',
    type: 'Sacramental',
    label: 'Sacramentales',
    description: 'Corporaciones sacramentales reunidas por localidad.',
    href: '/hermandades/sacramentales',
    icon: '/iconos/hermandades/sacramental.png',
  },
]

export function normalizeDirectoryValue(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function directorySlug(value = '') {
  return normalizeDirectoryValue(value)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function directoryType(key) {
  return DIRECTORY_TYPES.find((item) => item.key === key) || null
}

export function hasDirectoryType(hermandad, key) {
  const config = directoryType(key)
  if (!config) return false

  return (hermandad.tipos || []).some(
    (tipo) => normalizeDirectoryValue(tipo) === normalizeDirectoryValue(config.type)
  )
}

export function localitySlug(hermandad) {
  if (normalizeDirectoryValue(hermandad.localidad) === 'sevilla') return 'sevilla-capital'
  return directorySlug(hermandad.localidad)
}

export function localityLabel(hermandad) {
  if (normalizeDirectoryValue(hermandad.localidad) === 'sevilla') return 'Sevilla capital'
  return hermandad.localidad || 'Localidad por documentar'
}

export function gloryMonth(hermandad) {
  const processionDay = normalizeDirectoryValue(hermandad.diaSalida)
  return MONTHS.find((month) => processionDay.includes(normalizeDirectoryValue(month))) || ''
}

export function directoryPeriod(hermandad, key) {
  if (key === 'semana-santa') return hermandad.diaSalida || ''
  if (key === 'gloria') return gloryMonth(hermandad)
  return ''
}

export function directoryPath(hermandad, key) {
  const locality = localitySlug(hermandad)
  if (!locality) return ''

  if (key === 'sacramentales') {
    return `/hermandades/sacramentales/${locality}`
  }

  const period = directorySlug(directoryPeriod(hermandad, key))
  if (!period) return ''
  return `/hermandades/${key}/${locality}/${period}`
}

export function directoryContextLabel(hermandad, key) {
  const period = directoryPeriod(hermandad, key)
  if (period) return period
  if (key === 'sacramentales') return 'Sacramental'
  if (key === 'gloria') return 'Mes principal por documentar'
  return 'Jornada por documentar'
}

export function displayName(hermandad) {
  if (hermandad.slug === 'asuncion-de-cantillana') return 'La Asunción de Cantillana'
  return hermandad.nombrePopular
}

export function labelFromSlug(slug = '') {
  const knownLabels = [...HOLY_WEEK_DAYS, ...MONTHS]
  const known = knownLabels.find((label) => directorySlug(label) === slug)
  if (known) return known
  if (slug === 'sevilla-capital') return 'Sevilla capital'

  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function sortBrotherhoods(items = []) {
  return [...items].sort((first, second) => (
    displayName(first).localeCompare(displayName(second), 'es', { sensitivity: 'base' })
  ))
}

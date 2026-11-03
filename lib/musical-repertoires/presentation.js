import { HOLY_WEEK_OUTING_ORDER, resolveAccompanimentOutingType } from '../bands/accompaniments.js'

export function musicalRepertoireDateLabel(value) {
  if (!value) return ''

  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(new Date(`${value}T12:00:00`))
}

export function presentMusicalRepertoireIdentity({
  brotherhoodName = '',
  outingTitle = '',
  outingType = '',
  outingDate = '',
  year = null,
} = {}) {
  const resolvedMoment = resolveAccompanimentOutingType({
    outingType,
    processionDay: outingTitle,
  })
  const holyWeekDay = HOLY_WEEK_OUTING_ORDER.includes(resolvedMoment) ? resolvedMoment : ''
  const edition = holyWeekDay
    ? [holyWeekDay, year].filter(Boolean).join(' ')
    : musicalRepertoireDateLabel(outingDate) || (year ? String(year) : '')

  return {
    title: [brotherhoodName, edition].filter(Boolean).join(' · ') || 'Cruceta musical',
    moment: holyWeekDay,
  }
}

const OUTING_TITLE_PREFIXES = [
  /^salida procesional (?:de|del)\s+/i,
  /^procesi[oó]n (?:triunfal |de gloria )?(?:de|del)\s+/i,
  /^rosario (?:de la aurora|matutino) (?:de|del)\s+/i,
  /^traslado (?:extraordinario )?(?:de|del)\s+/i,
]

// Nombre de reserva cuando la Hermandad todavía no es pública: se toma la
// advocación del título de la salida («María Santísima de los Dolores · traslado…»).
export function musicalRepertoireFallbackName(outingTitle = '') {
  let name = String(outingTitle).split(' · ')[0].trim()
  for (const prefix of OUTING_TITLE_PREFIXES) name = name.replace(prefix, '')
  name = name.replace(/\s+(?:19|20)\d{2}$/, '').trim()
  return name ? name.charAt(0).toUpperCase() + name.slice(1) : ''
}

export function musicalRepertoireMonthLabel(value) {
  if (!value) return 'Sin fecha'
  const label = new Intl.DateTimeFormat('es-ES', {
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(new Date(`${value}T12:00:00`))
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export function musicalRepertoireShortDate(value) {
  if (!value) return ''
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'Europe/Madrid',
  }).format(new Date(`${value}T12:00:00`)).replace(/\./g, '')
}

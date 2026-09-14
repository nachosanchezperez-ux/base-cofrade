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

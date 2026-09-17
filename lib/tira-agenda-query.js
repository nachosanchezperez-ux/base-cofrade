import { agendaMunicipalitySlug } from './agenda-cofrade-location.js'
import { normalizePublishedContentText } from './tira-published-content.js'

const CATEGORY_CONFIG = {
  processions: { label: 'Procesiones', singular: 'procesión', plural: 'procesiones' },
  transfers: { label: 'Traslados', singular: 'traslado', plural: 'traslados' },
  rosaries: { label: 'Rosarios públicos', singular: 'rosario público', plural: 'rosarios públicos' },
  devotions: { label: 'Besamanos y besapiés', singular: 'besamanos o besapiés', plural: 'besamanos y besapiés' },
  concerts: { label: 'Conciertos', singular: 'concierto', plural: 'conciertos' },
}

const PERIOD_LABELS = {
  today: 'hoy',
  tomorrow: 'mañana',
  weekend: 'este fin de semana',
  week: 'esta semana',
  upcoming: 'próximos actos',
}

function addDays(value, amount) {
  const date = new Date(`${value}T12:00:00Z`)
  date.setUTCDate(date.getUTCDate() + amount)
  return date.toISOString().slice(0, 10)
}

export function agendaQueryCategory(question = '') {
  const q = normalizePublishedContentText(question)
  if (/\brosarios?\b/.test(q)) return 'rosaries'
  if (/\b(besamanos|besapies)\b/.test(q)) return 'devotions'
  if (/\bconciertos?\b/.test(q)) return 'concerts'
  if (/\btraslados?\b/.test(q)) return 'transfers'
  if (/\bprocesiones?\b/.test(q)) return 'processions'
  return ''
}

export function agendaQueryPeriod(question = '') {
  const q = normalizePublishedContentText(question)
  if (/\bhoy\b/.test(q)) return 'today'
  if (/\bmanana\b/.test(q)) return 'tomorrow'
  if (/\b(fin de semana|este finde|finde)\b/.test(q)) return 'weekend'
  if (/\b(esta semana|durante esta semana)\b/.test(q)) return 'week'
  return 'upcoming'
}

export function agendaPeriodRange(today, period = 'upcoming') {
  if (!today || period === 'upcoming') return null
  if (period === 'today') return [today, today]
  if (period === 'tomorrow') {
    const tomorrow = addDays(today, 1)
    return [tomorrow, tomorrow]
  }

  const date = new Date(`${today}T12:00:00Z`)
  const weekday = date.getUTCDay()

  if (period === 'weekend') {
    const saturdayDistance = weekday === 0 ? -1 : weekday === 6 ? 0 : 6 - weekday
    const saturday = addDays(today, saturdayDistance)
    return [saturday, addDays(saturday, 1)]
  }

  if (period === 'week') {
    const sundayDistance = weekday === 0 ? 0 : 7 - weekday
    return [today, addDays(today, sundayDistance)]
  }

  return null
}

export function agendaItemMatchesQuery(item, {
  today,
  municipality = '',
  category = '',
  period = 'upcoming',
} = {}) {
  if (!item?.isUpcoming || item?.isCancelled) return false

  if (municipality && agendaMunicipalitySlug(item.municipality) !== agendaMunicipalitySlug(municipality)) {
    return false
  }

  if (category && item.category !== category) return false

  const range = agendaPeriodRange(today, period)
  if (!range) return true
  if (!item.date) return false

  const [start, end] = range
  const itemEnd = item.endDate || item.date
  return item.date <= end && itemEnd >= start
}

export function agendaQueryCategoryLabel(category = '') {
  return CATEGORY_CONFIG[category]?.label || ''
}

export function agendaQueryPeriodLabel(period = 'upcoming') {
  return PERIOD_LABELS[period] || PERIOD_LABELS.upcoming
}

export function agendaQueryCountLabel(category = '', count = 0) {
  const config = CATEGORY_CONFIG[category]
  if (!config) return count === 1 ? 'acto' : 'actos'
  return count === 1 ? config.singular : config.plural
}

export function agendaQueryHref({
  category = '',
  period = 'upcoming',
  municipality = '',
} = {}) {
  const params = new URLSearchParams()
  if (CATEGORY_CONFIG[category]) params.set('categoria', category)

  const supportedPeriod = ['today', 'weekend', 'upcoming'].includes(period) ? period : 'upcoming'
  params.set('periodo', supportedPeriod)

  const municipalitySlug = agendaMunicipalitySlug(municipality)
  if (municipalitySlug === 'sevilla') {
    params.set('territorio', 'capital')
  } else if (municipalitySlug) {
    params.set('territorio', 'province')
    params.set('municipio', municipalitySlug)
  }

  const query = params.toString()
  return `/agenda-cofrade${query ? `?${query}` : ''}#agenda`
}

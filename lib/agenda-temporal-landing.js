import { agendaMunicipalityRouteSlug } from './agenda-cofrade-location.js'
import { addAgendaDays, agendaWeekendRange } from './municipality-temporal.js'
import { agendaTemporalRangeDate, withAgendaTemporalDay } from './agenda-temporal-display.js'

const CATEGORY_META = [
  { key: 'processions', label: 'Procesiones' },
  { key: 'transfers', label: 'Traslados' },
  { key: 'rosaries', label: 'Rosarios públicos' },
  { key: 'devotions', label: 'Besamanos y besapiés' },
  { key: 'concerts', label: 'Conciertos' },
]

export const TEMPORAL_AGENDA_PAGES = {
  today: {
    slug: 'hoy',
    title: 'Agenda cofrade de hoy en Sevilla',
    heading: 'Qué ver hoy en Sevilla y su provincia',
    eyebrow: 'Hoy · Agenda Cofrade',
    description: 'Procesiones, rosarios, besamanos, besapiés, traslados y conciertos documentados para hoy en Sevilla capital y su provincia.',
  },
  tomorrow: {
    slug: 'manana',
    title: 'Agenda cofrade de mañana en Sevilla',
    heading: 'Qué ver mañana en Sevilla y su provincia',
    eyebrow: 'Mañana · Agenda Cofrade',
    description: 'Agenda cofrade de mañana en Sevilla capital y su provincia: actos públicos documentados, municipios con actividad y entidades relacionadas.',
  },
  weekend: {
    slug: 'fin-de-semana',
    title: 'Agenda cofrade de este fin de semana en Sevilla',
    heading: 'Qué ver este fin de semana en Sevilla',
    eyebrow: 'Fin de semana · Agenda Cofrade',
    description: 'Agenda cofrade del fin de semana en Sevilla y su provincia, con procesiones, cultos, rosarios, traslados, conciertos y municipios con actividad.',
  },
}

function dateKey(value = '') {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? String(value) : ''
}

function compareItems(first, second) {
  return `${first?.temporalDate || first?.date || '9999-12-31'}T${first?.startTime || '23:59'}`
    .localeCompare(`${second?.temporalDate || second?.date || '9999-12-31'}T${second?.startTime || '23:59'}`)
}

function overlapsDay(item, day = '') {
  const start = dateKey(item?.date)
  const target = dateKey(day)
  if (!start || !target) return false
  const end = dateKey(item?.endDate) || start
  return start <= target && end >= target
}

function overlapsRange(item, start = '', end = '') {
  const itemStart = dateKey(item?.date)
  const rangeStart = dateKey(start)
  const rangeEnd = dateKey(end)
  if (!itemStart || !rangeStart || !rangeEnd) return false
  const itemEnd = dateKey(item?.endDate) || itemStart
  return itemStart <= rangeEnd && itemEnd >= rangeStart
}

function formatDate(value = '', options = {}) {
  const key = dateKey(value)
  if (!key) return ''
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid',
    ...options,
  }).format(new Date(`${key}T12:00:00Z`))
}

function dateCaption(period, today) {
  if (period === 'today') {
    const label = formatDate(today, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    return label ? `${label.charAt(0).toUpperCase()}${label.slice(1)}` : ''
  }

  if (period === 'tomorrow') {
    const tomorrow = addAgendaDays(today, 1)
    const label = formatDate(tomorrow, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    return label ? `${label.charAt(0).toUpperCase()}${label.slice(1)}` : ''
  }

  const [start, end] = agendaWeekendRange(today)
  const startLabel = formatDate(start, { weekday: 'long', day: 'numeric', month: 'long' })
  const endLabel = formatDate(end, { weekday: 'long', day: 'numeric', month: 'long' })
  return startLabel && endLabel ? `${startLabel} · ${endLabel}` : ''
}

function matchesPeriod(item, period, today) {
  if (!item?.isUpcoming || item?.isCancelled) return false
  if (period === 'today') return overlapsDay(item, today)
  if (period === 'tomorrow') return overlapsDay(item, addAgendaDays(today, 1))
  if (period === 'weekend') {
    const [start, end] = agendaWeekendRange(today)
    return overlapsRange(item, start, end)
  }
  return false
}

function calendarMeta(item) {
  const href = String(item?.categoryHref || '')
  if (href.startsWith('/procesiones-de-gloria')) return { label: 'Glorias', href: '/procesiones-de-gloria' }
  if (href.startsWith('/extraordinarias')) return { label: 'Extraordinarias', href: '/extraordinarias' }
  return { label: 'Agenda Cofrade', href: '/agenda-cofrade' }
}

function displayDateForPeriod(item, period, today) {
  if (period === 'today') return today
  if (period === 'tomorrow') return addAgendaDays(today, 1)
  if (period === 'weekend') {
    const [start, end] = agendaWeekendRange(today)
    return agendaTemporalRangeDate(item, start, end) || item.date
  }
  return item.date
}

function displayItem(item, period, today) {
  const calendar = calendarMeta(item)
  return {
    ...withAgendaTemporalDay(item, displayDateForPeriod(item, period, today)),
    calendarLabel: calendar.label,
    calendarHref: calendar.href,
    brotherhoodHref: item.organizerHref || item.relatedBrotherhoodHref || '',
  }
}

function municipalitySummaries(items = []) {
  const map = new Map()

  for (const item of items) {
    const slug = agendaMunicipalityRouteSlug(item?.municipality)
    if (!slug) continue
    const current = map.get(slug) || {
      slug,
      label: slug === 'sevilla-capital' ? 'Sevilla capital' : String(item.municipality || '').trim(),
      href: `/agenda-cofrade/localidad/${slug}`,
      count: 0,
      scope: slug === 'sevilla-capital' ? 'capital' : 'province',
    }
    current.count += 1
    map.set(slug, current)
  }

  return [...map.values()].sort((first, second) => {
    if (first.slug === 'sevilla-capital') return -1
    if (second.slug === 'sevilla-capital') return 1
    if (first.count !== second.count) return second.count - first.count
    return first.label.localeCompare(second.label, 'es', { sensitivity: 'base' })
  })
}

export function buildAgendaTemporalLanding({ period = 'today', items = [], today = '' } = {}) {
  const config = TEMPORAL_AGENDA_PAGES[period] || TEMPORAL_AGENDA_PAGES.today
  const filtered = (Array.isArray(items) ? items : [])
    .filter((item) => matchesPeriod(item, period, today))
    .map((item) => displayItem(item, period, today))
    .sort(compareItems)

  const municipalities = municipalitySummaries(filtered)
  const categories = CATEGORY_META
    .map((category) => ({
      ...category,
      count: filtered.filter((item) => item.category === category.key).length,
    }))
    .filter((category) => category.count > 0)

  return {
    period,
    ...config,
    path: `/agenda-cofrade/${config.slug}`,
    dateCaption: dateCaption(period, today),
    today,
    items: filtered,
    categories,
    municipalities,
    capitalCount: filtered.filter((item) => item.scope === 'capital').length,
    provinceCount: filtered.filter((item) => item.scope === 'province').length,
    queryPeriod: period,
  }
}

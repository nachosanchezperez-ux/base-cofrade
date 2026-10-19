import { agendaMunicipalityRouteSlug } from './agenda-cofrade-location.js'
import { addAgendaDays, agendaWeekendRange } from './municipality-temporal.js'
import { withAgendaTemporalDay } from './agenda-temporal-display.js'
import { agendaSortTime, isAgendaItemOver } from './agenda-clock.js'
import { agendaBrotherhoodHref, agendaEntityLinks } from './agenda-entity-links.js'
import { agendaItemSharePath } from './share.js'

const CATEGORY_META = [
  { key: 'processions', label: 'Procesiones' },
  { key: 'transfers', label: 'Traslados' },
  { key: 'rosaries', label: 'Rosarios públicos' },
  { key: 'romeries', label: 'Romerías' },
  { key: 'devotions', label: 'Cultos y besamanos' },
  { key: 'concerts', label: 'Conciertos' },
]

export const TEMPORAL_AGENDA_PAGES = {
  today: {
    slug: 'hoy',
    title: 'Procesiones y actos cofrades de hoy en Sevilla',
    heading: 'Qué ver hoy en Sevilla y su provincia',
    // H2 que describen su bloque (antes «Encuentra tu acto» y «Todas las citas»).
    filterHeading: 'Actos de hoy por zona y tipo',
    listHeading: 'Todos los actos cofrades de hoy',
    eyebrow: 'Hoy · Agenda Cofrade',
    description: 'Procesiones, romerías, rosarios, besamanos, besapiés, traslados y conciertos documentados para hoy en Sevilla capital y su provincia.',
  },
  tomorrow: {
    slug: 'manana',
    title: 'Procesiones y actos cofrades de mañana en Sevilla',
    heading: 'Qué ver mañana en Sevilla y su provincia',
    filterHeading: 'Actos de mañana por zona y tipo',
    listHeading: 'Todos los actos cofrades de mañana',
    eyebrow: 'Mañana · Agenda Cofrade',
    description: 'Agenda cofrade de mañana en Sevilla capital y su provincia: actos públicos documentados, municipios con actividad y entidades relacionadas.',
  },
  weekend: {
    slug: 'fin-de-semana',
    title: 'Procesiones y actos cofrades del fin de semana en Sevilla',
    heading: 'Qué ver este fin de semana en Sevilla y su provincia',
    filterHeading: 'Actos del fin de semana por zona y tipo',
    listHeading: 'Todos los actos cofrades del fin de semana',
    eyebrow: 'Fin de semana · Agenda Cofrade',
    description: 'Agenda cofrade del fin de semana en Sevilla y su provincia, con procesiones, romerías, cultos, rosarios, traslados, conciertos y municipios con actividad.',
  },
}

function dateKey(value = '') {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? String(value) : ''
}

// Por día y por hora real: «Tras la Misa de 10:00» va a las 10:00, no al final.
function compareItems(first, second) {
  return `${first?.temporalDate || first?.date || '9999-12-31'}T${agendaSortTime(first)}`
    .localeCompare(`${second?.temporalDate || second?.date || '9999-12-31'}T${agendaSortTime(second)}`)
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


function displayItem(item, day) {
  const calendar = calendarMeta(item)
  return {
    ...withAgendaTemporalDay(item, day),
    displayKey: `${item.key || item.id}@${day}`,
    calendarLabel: calendar.label,
    calendarHref: calendar.href,
    brotherhoodHref: agendaBrotherhoodHref(item),
    entityLinks: agendaEntityLinks(item),
    // Acción principal (#1264): el propio acto, en su página conservada o en su
    // tarjeta de la Agenda, que abre el detalle. Nunca la ficha de una entidad.
    eventHref: agendaItemSharePath(item),
  }
}

// Días del periodo en los que se celebra el acto. Un besamanos de sábado y
// domingo aparece en los dos días del fin de semana, con el horario de cada uno.
function periodDays(item, period, today) {
  if (period === 'today') return [today]
  if (period === 'tomorrow') return [addAgendaDays(today, 1)]
  const [start, end] = agendaWeekendRange(today)
  return [start, end].filter((day) => overlapsDay(item, day))
}

// Lo de hoy que ya terminó no se ofrece: se mira el día concreto de la tarjeta.
function isDayOver(entry, now) {
  return isAgendaItemOver({ ...entry, date: entry.temporalDate, endDate: '' }, now)
}

function distinctCount(items = []) {
  return new Set(items.map((item) => item.key || item.id)).size
}

function municipalitySummaries(items = []) {
  const map = new Map()

  const seen = new Set()
  for (const item of items) {
    const slug = agendaMunicipalityRouteSlug(item?.municipality)
    if (!slug) continue
    // Un acto de varios días cuenta una sola vez por localidad.
    const seenKey = `${slug}|${item.key || item.id}`
    if (seen.has(seenKey)) continue
    seen.add(seenKey)
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

const CATEGORY_NOUNS = {
  processions: ['procesión', 'procesiones'],
  transfers: ['traslado', 'traslados'],
  rosaries: ['rosario público', 'rosarios públicos'],
  romeries: ['romería', 'romerías'],
  devotions: ['culto o besamanos', 'cultos y besamanos'],
  concerts: ['concierto', 'conciertos'],
  cults: ['culto', 'cultos'],
}

function joinSpanish(parts = []) {
  if (parts.length <= 1) return parts.join('')
  return `${parts.slice(0, -1).join(', ')} y ${parts.at(-1)}`
}

function lowerFirst(value = '') {
  return value ? `${value.charAt(0).toLocaleLowerCase('es')}${value.slice(1)}` : ''
}

// Frase de hechos del periodo, solo con lo publicado: cuántos actos hay, de qué
// tipo y dónde. La leen visitantes, buscadores e IA («qué procesiones hay hoy»).
function dayPhrase(key = '', withYear = true) {
  const weekday = formatDate(key, { weekday: 'long' })
  const day = formatDate(key, { day: 'numeric' })
  const month = formatDate(key, { month: 'long' })
  const year = formatDate(key, { year: 'numeric' })
  if (!weekday || !day || !month) return ''
  return `${weekday} ${day} de ${month}${withYear && year ? ` de ${year}` : ''}`
}

// «sábado 17 y domingo 18 de octubre de 2026» o, si cambia el mes,
// «sábado 31 de octubre y domingo 1 de noviembre de 2026».
function weekendPhrase(today = '') {
  const [start, end] = agendaWeekendRange(today)
  if (!dateKey(start) || !dateKey(end)) return ''
  const sameMonth = formatDate(start, { month: 'long' }) === formatDate(end, { month: 'long' })
  const startText = sameMonth
    ? `${formatDate(start, { weekday: 'long' })} ${formatDate(start, { day: 'numeric' })}`
    : dayPhrase(start, false)
  return `${startText} y ${dayPhrase(end)}`
}

// Frase de hechos del periodo, solo con lo publicado: cuántos actos hay, de qué
// tipo y dónde. La leen visitantes, buscadores e IA («qué procesiones hay hoy»).
export function agendaTemporalSummary({ period = 'today', count = 0, categories = [], municipalities = [], today = '', withPlaces = true } = {}) {
  if (!count) return ''
  const target = period === 'tomorrow' ? addAgendaDays(today, 1) : today
  const when = period === 'today'
    ? `Hoy${dayPhrase(target) ? `, ${dayPhrase(target)},` : ''}`
    : period === 'tomorrow'
      ? `Mañana${dayPhrase(target) ? `, ${dayPhrase(target)},` : ''}`
      : `Este fin de semana${weekendPhrase(today) ? `, ${weekendPhrase(today)},` : ''}`
  const noun = count === 1 ? 'acto cofrade documentado' : 'actos cofrades documentados'
  const kinds = categories
    .filter((category) => CATEGORY_NOUNS[category.key] && category.count > 0)
    .map((category) => `${category.count} ${CATEGORY_NOUNS[category.key][category.count === 1 ? 0 : 1]}`)
  const counted = categories.reduce((sum, category) => sum + (CATEGORY_NOUNS[category.key] ? category.count : 0), 0)
  if (kinds.length && counted < count) kinds.push(`${count - counted} ${count - counted === 1 ? 'acto' : 'actos'} más`)
  const places = municipalities.map((entry) => entry.label).filter(Boolean)
  // Si solo sobraría una, se nombra en lugar de «y 1 localidad más».
  const shown = places.length === 5 ? places : places.slice(0, 4)
  const rest = places.length - shown.length
  const placeText = shown.length
    ? ` Hay actividad en ${joinSpanish(rest > 0 ? [...shown, `${rest} ${rest === 1 ? 'localidad' : 'localidades'} más`] : shown)}.`
    : ''
  const kindText = kinds.length > 1 || (kinds.length === 1 && counted < count) ? `: ${joinSpanish(kinds)}` : ''
  const lead = `${when} hay ${count} ${noun} en Sevilla y su provincia${kindText}.`
  return withPlaces ? `${lead}${placeText}` : lead
}

// Periodo en ISO 8601 para schema.org/temporalCoverage.
export function agendaTemporalCoverage(period = 'today', today = '') {
  if (!dateKey(today)) return ''
  if (period === 'today') return today
  if (period === 'tomorrow') return addAgendaDays(today, 1)
  const [start, end] = agendaWeekendRange(today)
  return start && end ? `${start}/${end}` : ''
}

export function buildAgendaTemporalLanding({ period = 'today', items = [], today = '', now = null } = {}) {
  const config = TEMPORAL_AGENDA_PAGES[period] || TEMPORAL_AGENDA_PAGES.today
  const filtered = (Array.isArray(items) ? items : [])
    .filter((item) => matchesPeriod(item, period, today))
    .flatMap((item) => periodDays(item, period, today).map((day) => displayItem(item, day)))
    .filter((entry) => !now || !isDayOver(entry, now))
    .sort(compareItems)

  const municipalities = municipalitySummaries(filtered)
  const categories = CATEGORY_META
    .map((category) => ({
      ...category,
      count: distinctCount(filtered.filter((item) => item.category === category.key)),
    }))
    .filter((category) => category.count > 0)

  const caption = dateCaption(period, today)

  return {
    period,
    ...config,
    path: `/agenda-cofrade/${config.slug}`,
    dateCaption: caption,
    // Visible (corta, para móvil) y completa con municipios (datos estructurados).
    summary: agendaTemporalSummary({ period, count: distinctCount(filtered), categories, municipalities, today, withPlaces: false }),
    summaryWithPlaces: agendaTemporalSummary({ period, count: distinctCount(filtered), categories, municipalities, today }),
    temporalCoverage: agendaTemporalCoverage(period, today),
    today,
    items: filtered,
    // Actos distintos: un acto de varios días aparece una vez por día en la lista.
    count: distinctCount(filtered),
    categories,
    municipalities,
    capitalCount: distinctCount(filtered.filter((item) => item.scope === 'capital')),
    provinceCount: distinctCount(filtered.filter((item) => item.scope === 'province')),
    queryPeriod: period,
  }
}

// Agenda inmediata de la portada: un único bloque con pestañas Ahora · Hoy · Mañana ·
// Fin de semana, construido a partir de buildHomeTemporalAgenda (fuente única).
// Devuelve un modelo pequeño y serializable para el componente de cliente.

import { scheduleTimeHint } from './agenda-event-presentation.js'
import { agendaItemSharePath } from './share.js'
import { getExtraordinaryLiveState } from './home-live-status.js'

export const HOME_AGENDA_CARD_LIMIT = 4

const WEEKDAYS = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

function dateKey(value = '') {
  return /^\d{4}-\d{2}-\d{2}$/.test(String(value)) ? String(value) : ''
}

export function homeAgendaDateLabel(value = '') {
  const key = dateKey(value)
  if (!key) return 'Fecha por confirmar'
  const date = new Date(`${key}T12:00:00Z`)
  return `${WEEKDAYS[date.getUTCDay()]} ${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`
}

const WEEKDAY_NAMES = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

// Partes de la fecha para la hoja de calendario de cada cita (día grande y día de
// la semana pequeño). Fechas de calendario de Madrid sin hora: se leen a mediodía UTC.
export function homeAgendaDateParts(value = '') {
  const key = dateKey(value)
  if (!key) return { day: '', weekday: '', month: '', weekdayLong: '' }
  const date = new Date(`${key}T12:00:00Z`)
  return {
    day: String(date.getUTCDate()),
    weekday: WEEKDAYS[date.getUTCDay()],
    month: MONTHS[date.getUTCMonth()],
    weekdayLong: WEEKDAY_NAMES[date.getUTCDay()],
  }
}

// Hora principal grande y, aparte, la hora de fin o el horario literal.
export function homeAgendaTimeParts(item = {}) {
  const start = String(item.startTime || '').slice(0, 5)
  const end = String(item.endTime || '').slice(0, 5)
  if (start) return { main: start, detail: end ? `hasta ${end}` : '' }
  if (item.timeText) return { main: '', detail: String(item.timeText) }
  // Salidas sin hora exacta: la franja publicada en su horario («Por la tarde»).
  const hint = scheduleTimeHint(item.schedule)
  if (/^\d{2}:\d{2}$/.test(hint)) return { main: hint, detail: '' }
  if (hint) return { main: '', detail: hint }
  return { main: '', detail: '' }
}

export function homeAgendaTimeLabel(item = {}) {
  if (item.startTime) return item.endTime ? `${item.startTime}–${item.endTime}` : item.startTime
  if (item.timeText) return item.timeText
  return ''
}

function cardFromItem(item = {}) {
  const date = item.temporalDate || item.date || ''
  const organizer = item.organizer && item.organizer !== 'Entidad organizadora' ? item.organizer : ''
  return {
    key: String(item.key || item.id || `${date}-${item.title}`),
    title: item.title || 'Acto cofrade',
    organizer,
    municipality: item.municipality || '',
    type: item.categoryLabel || item.categoryName || '',
    date,
    dateLabel: homeAgendaDateLabel(date),
    dateParts: homeAgendaDateParts(date),
    timeLabel: homeAgendaTimeLabel(item),
    time: homeAgendaTimeParts(item),
    isLive: Boolean(item.liveState?.isLive),
    href: item.href || item.calendarHref || item.organizerHref || '/agenda-cofrade',
    // Destino del propio acto (#1264): su página conservada si la tiene; si no,
    // su tarjeta en la Agenda (/agenda-cofrade#acto-…), nunca la ficha genérica.
    eventHref: agendaItemSharePath(item),
  }
}

function tab(key, label, href, items = []) {
  const list = Array.isArray(items) ? items : []
  return {
    key,
    label,
    href,
    count: list.length,
    cards: list.slice(0, HOME_AGENDA_CARD_LIMIT).map(cardFromItem),
  }
}

function isWeekendDay(temporal) {
  const { today, weekendStart } = temporal || {}
  return Boolean(today && weekendStart && weekendStart <= today)
}

// Salida en curso con su horario (#1253): en lugar de un bloque aparte, la
// Agenda muestra en su cita principal el siguiente momento del horario, las
// bandas y el enlace a la guía completa. Se casa por enlace o por título.
export function homeLiveFocus({ outing = null, briefing = null, now = new Date() } = {}) {
  if (!outing) return null
  const schedule = Array.isArray(briefing?.schedule) ? briefing.schedule : []
  const state = getExtraordinaryLiveState(outing.date, schedule, now)
  const next = state.nextId ? schedule.find((item) => item.id === state.nextId) || null : null
  const bands = (Array.isArray(briefing?.bands) ? briefing.bands : []).map((band) => band.name).filter(Boolean).slice(0, 2)
  return {
    href: outing.href || outing.calendarHref || '',
    title: String(outing.title || ''),
    next: next ? { time: next.time || '', label: next.label || '', place: next.place || '' } : null,
    bands,
    guideHref: outing.href || outing.calendarHref || '',
  }
}

function sameOuting(card, focus) {
  if (!card || !focus) return false
  if (focus.href && card.href === focus.href) return true
  const normalize = (value) => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ').trim()
  return Boolean(focus.title) && normalize(card.title) === normalize(focus.title)
}

function withFocus(tabs, focus) {
  if (!focus) return { tabs, matched: false }
  let matched = false
  const next = tabs.map((tabItem) => ({
    ...tabItem,
    cards: tabItem.cards.map((card) => {
      if (!sameOuting(card, focus)) return card
      matched = true
      // «Horarios y guía completa» lleva al acto, calculado con el ítem ya
      // normalizado de la Agenda (su clave categoría:id es la de la tarjeta).
      const guideHref = card.eventHref || focus.guideHref
      return { ...card, focus: { ...focus, guideHref }, isLive: true }
    }),
  }))
  // La salida en curso es la cita principal de su pestaña.
  const promoted = next.map((tabItem) => {
    const index = tabItem.cards.findIndex((card) => card.focus)
    if (index <= 0) return tabItem
    const cards = [...tabItem.cards]
    const [focused] = cards.splice(index, 1)
    return { ...tabItem, cards: [focused, ...cards] }
  })
  return { tabs: promoted, matched }
}

export function buildHomeAgendaNow(temporal = null, { liveFocus = null } = {}) {
  if (!temporal) return null
  const tabs = []
  if (temporal.liveItems?.length) {
    tabs.push(tab('now', 'Ahora', '/agenda-cofrade/hoy', temporal.liveItems))
  }
  tabs.push(tab('today', 'Hoy', '/agenda-cofrade/hoy', temporal.remainingTodayItems))
  tabs.push(tab('tomorrow', 'Mañana', '/agenda-cofrade/manana', temporal.tomorrowItems))
  // En sábado y domingo «Fin de semana» repetiría lo que ya muestran Hoy y
  // Mañana (el domingo, exactamente las mismas citas): solo de lunes a viernes.
  if (!isWeekendDay(temporal)) {
    tabs.push(tab('weekend', 'Fin de semana', '/agenda-cofrade/fin-de-semana', temporal.weekendItems))
  }

  const upcoming = (temporal.closestItems || []).slice(0, HOME_AGENDA_CARD_LIMIT).map(cardFromItem)
  const firstWithItems = tabs.find((item) => item.count > 0)
  if (!firstWithItems && !upcoming.length) return null

  const focused = withFocus(tabs, liveFocus)
  return {
    tabs: focused.tabs,
    defaultTab: firstWithItems?.key || 'today',
    upcoming,
    liveFocusMatched: focused.matched,
  }
}

export function homeAgendaMoreLabel(tabItem) {
  if (!tabItem?.count || tabItem.count <= tabItem.cards.length) return ''
  if (tabItem.key === 'now') return `Ver las ${tabItem.count} citas en curso`
  if (tabItem.key === 'today') return `Ver las ${tabItem.count} citas que quedan hoy`
  if (tabItem.key === 'tomorrow') return `Ver las ${tabItem.count} citas de mañana`
  return `Ver las ${tabItem.count} citas del fin de semana`
}

// Destacado de portada: la procesión en curso tiene prioridad; si no hay ninguna, el
// destacado editorial vigente. No se repite si ya figura entre los destacados del Panel.
export function selectHomeFeaturedOuting({ upcomingAgenda = [], editorialFeaturedOutingId = '', editorialHighlights = [] } = {}) {
  const liveOutings = upcomingAgenda.filter((item) => item?.liveState?.state === 'live')
  const editorial = editorialFeaturedOutingId
    ? upcomingAgenda.find((item) => item?.id === editorialFeaturedOutingId) || null
    : null
  const outing = liveOutings[0] || editorial
  if (!outing) return null
  if (editorialHighlights.some((highlight) => highlight?.outing?.id === outing.id)) return null
  return { outing, isLive: liveOutings.length > 0, liveCount: liveOutings.length }
}

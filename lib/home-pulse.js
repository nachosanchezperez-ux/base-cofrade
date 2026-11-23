// «Semana Santa 2027 en datos»: cifras vivas de la portada que cambian cada
// día (cuenta atrás, agenda, igualás y música 2027). Solo reutiliza datos que
// la Home ya tiene; no inventa nada: una cifra sin dato no se muestra.

export const HOLY_WEEK_2027 = {
  start: '2027-03-19', // Viernes de Dolores (decisión de Nacho, 23/11/2026)
  end: '2027-03-28', // Domingo de Resurrección
  // Medianoche del Viernes de Dolores en Sevilla (en marzo de 2027, UTC+1:
  // el cambio de hora es el 28/03).
  startsAt: '2027-03-19T00:00:00+01:00',
  href: '/semana-santa-sevilla-2027',
}

const DAY_MS = 86400000
const formatter = new Intl.NumberFormat('es-ES')

function dayNumber(dateKey) {
  const time = Date.parse(`${String(dateKey).slice(0, 10)}T12:00:00Z`)
  return Number.isFinite(time) ? Math.floor(time / DAY_MS) : null
}

export function addDays(dateKey, days) {
  const base = dayNumber(dateKey)
  if (base === null) return ''
  return new Date((base + days) * DAY_MS).toISOString().slice(0, 10)
}

// Días entre hoy y el Viernes de Dolores; durante la Semana Santa, «Hoy».
// `target` alimenta el reloj en vivo (components/PulseClock.js).
export function holyWeekCountdown(today, nowMs = null) {
  const now = dayNumber(today)
  const start = dayNumber(HOLY_WEEK_2027.start)
  const end = dayNumber(HOLY_WEEK_2027.end)
  if (now === null) return null
  if (now > end) return null
  if (now >= start) {
    return { key: 'countdown', figure: 'Hoy', label: 'Semana Santa 2027 · programa de mano', href: HOLY_WEEK_2027.href }
  }
  // Con la hora real, los días completos que marca el reloj (sin salto al cargar).
  const clock = Number.isFinite(nowMs) ? countdownParts(HOLY_WEEK_2027.startsAt, nowMs) : null
  const days = clock ? clock.days : start - now
  return {
    key: 'countdown',
    figure: formatter.format(days),
    label: days === 1 ? 'día para el Viernes de Dolores' : 'días para el Viernes de Dolores',
    href: HOLY_WEEK_2027.href,
    target: HOLY_WEEK_2027.startsAt,
  }
}

// Actos de la agenda de hoy a dentro de 6 días que aún no han terminado.
export function countUpcomingWeek(items = [], today) {
  const last = addDays(today, 6)
  if (!last) return 0
  return items.filter((item) => {
    const date = String(item?.date || '').slice(0, 10)
    return date && date >= today && date <= last && !item.isPast
  }).length
}

export function countDatesInWeek(dates = [], today) {
  const last = addDays(today, 6)
  if (!last) return 0
  return dates.filter((date) => {
    const value = String(date || '').slice(0, 10)
    return value && value >= today && value <= last
  }).length
}

function figureItem(key, count, singular, plural, href) {
  if (!Number.isFinite(count) || count <= 0) return null
  return { key, figure: formatter.format(count), label: count === 1 ? singular : plural, href }
}

// Hermandades del programa de mano con horario oficial de 2027 ya publicado.
// Una Hermandad cuenta una vez aunque tenga cortejos parciales (la Borriquita).
export function countOfficialSchedules(programme = null) {
  const all = new Set()
  const official = new Set()
  for (const day of programme?.days || []) {
    for (const item of day.items || []) {
      if (!item?.slug) continue
      all.add(item.slug)
      if (item.timesSource === 'oficial') official.add(item.slug)
    }
  }
  return { official: official.size, total: all.size }
}

function scheduleItem(schedules) {
  if (!schedules?.official || !schedules?.total) return null
  return {
    key: 'schedules',
    figure: `${formatter.format(schedules.official)} de ${formatter.format(schedules.total)}`,
    label: 'horarios oficiales de 2027 publicados',
    href: HOLY_WEEK_2027.href,
  }
}

export function buildHomePulse({ today, nowMs = null, agendaItems = [], crewDates = [], musicChanges = null, schedules = null } = {}) {
  if (!today) return []
  const items = [
    holyWeekCountdown(today, nowMs),
    figureItem('agenda', countUpcomingWeek(agendaItems, today), 'acto en la agenda esta semana', 'actos en la agenda esta semana', '/agenda-cofrade'),
    figureItem('crew', countDatesInWeek(crewDates, today), 'igualá o ensayo esta semana', 'igualás y ensayos esta semana', '/igualas-y-ensayos'),
    scheduleItem(schedules),
    figureItem('music', musicChanges, 'cambio de banda para 2027', 'cambios de banda para 2027', '/semana-santa/2027/cambios-musicales'),
  ]
  return items.filter(Boolean)
}

// Tiempo que falta hasta `target` (ISO con zona), desglosado para el reloj.
// Devuelve null si ya ha llegado o la fecha no es válida.
export function countdownParts(target, nowMs = Date.now()) {
  const end = Date.parse(target)
  if (!Number.isFinite(end)) return null
  const remaining = Math.floor((end - nowMs) / 1000)
  if (remaining <= 0) return null
  return {
    days: Math.floor(remaining / 86400),
    hours: Math.floor((remaining % 86400) / 3600),
    minutes: Math.floor((remaining % 3600) / 60),
    seconds: remaining % 60,
  }
}

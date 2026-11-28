// Línea de hitos de la tarjeta «Semana Santa 2027» (28/11/2026). Solo fechas
// del calendario litúrgico (Pascua 2027: 28 de marzo); nada de fechas de
// pregón o cartel sin confirmar. Cada tramo se llena según pasa el tiempo
// desde el hito anterior (el primero, desde el Adviento).

export const SEASON_START = { date: '2026-11-29', label: 'Adviento' }

export const SEASON_MILESTONES = [
  { key: 'ceniza', date: '2027-02-10', day: '10/02', label: 'Miércoles de Ceniza' },
  { key: 'dolores', date: '2027-03-19', day: '19/03', label: 'Viernes de Dolores' },
  { key: 'ramos', date: '2027-03-21', day: '21/03', label: 'Domingo de Ramos' },
  { key: 'resurreccion', date: '2027-03-28', day: '28/03', label: 'Resurrección' },
]

const DAY_MS = 86400000
const dayNumber = (value) => {
  const time = Date.parse(`${String(value || '').slice(0, 10)}T12:00:00Z`)
  return Number.isFinite(time) ? Math.floor(time / DAY_MS) : null
}

export function buildSeasonTimeline(today) {
  const now = dayNumber(today)
  if (now === null) return []
  let previous = dayNumber(SEASON_START.date)
  let nextFound = false
  return SEASON_MILESTONES.map((milestone) => {
    const at = dayNumber(milestone.date)
    const span = Math.max(1, at - previous)
    const progress = Math.min(1, Math.max(0, (now - previous) / span))
    previous = at
    const done = now >= at
    const state = done ? 'done' : nextFound ? 'later' : 'next'
    if (!done) nextFound = true
    return { ...milestone, state, progress: Math.round(progress * 100) / 100 }
  })
}

// Fecha de hoy en Sevilla (AAAA-MM-DD), para la línea de hitos.
export function sevilleDateKey(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

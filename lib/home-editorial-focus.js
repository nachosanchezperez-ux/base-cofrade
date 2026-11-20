import { eventScheduleChange } from './event-schedule-change.js'
import { usesBrotherhoodChapters } from './brotherhood-chapters-rollout.js'
// Destacados editoriales de la portada.
//
// La configuración vive en public.outings (home_featured_starts_on,
// home_featured_ends_on, home_featured_priority) y se gestiona desde
// Panel → Portada editorial → Destacados. Este módulo es puro: recibe las filas
// leídas de Supabase y las citas de la Agenda y decide qué destacar hoy.

const DATE_KEY = /^\d{4}-\d{2}-\d{2}$/

function dateKey(value) {
  const key = String(value || '').slice(0, 10)
  return DATE_KEY.test(key) ? key : ''
}

// Convierte filas de outings en focos. Descarta filas sin ventana válida.
export function homeEditorialFocusesFromRows(rows = []) {
  return (Array.isArray(rows) ? rows : []).flatMap((row) => {
    const startsOn = dateKey(row?.home_featured_starts_on)
    const endsOn = dateKey(row?.home_featured_ends_on)
    if (!row?.id || !startsOn || !endsOn || endsOn < startsOn) return []
    const priority = Number.parseInt(row.home_featured_priority, 10)
    return [{
      id: `outing:${row.id}`,
      outingId: row.id,
      startsOn,
      endsOn,
      priority: Number.isFinite(priority) ? priority : 0,
    }]
  })
}

// Focos activos en `dateKey` cuya salida sigue en la Agenda y no ha terminado.
export function getHomeEditorialFocuses(outings = [], todayKey = '', focuses = []) {
  const today = dateKey(todayKey)
  if (!today) return []

  const active = (Array.isArray(focuses) ? focuses : [])
    .filter((focus) => focus?.outingId && today >= focus.startsOn && today <= focus.endsOn)
    .sort((a, b) => (b.priority - a.priority) || a.startsOn.localeCompare(b.startsOn))

  const seen = new Set()
  const entries = active.flatMap((focus) => {
    if (seen.has(focus.outingId)) return []
    const outing = outings.find((item) => item?.id === focus.outingId && item.liveState?.state !== 'done')
    if (!outing || eventScheduleChange(outing).withdrawn) return []
    seen.add(focus.outingId)
    return [{ focus, outing }]
  })
  return groupFocusesByBrotherhood(entries)
}

function brotherhoodKey(outing = {}) {
  return outing.brotherhoodId || outing.organizerHref || ''
}

function chronologicalKey(outing = {}) {
  return `${outing.date || '9999-12-31'}T${outing.startTime || '23:59'}`
}

// Una tarjeta por Hermandad: si varias salidas suyas están destacadas a la vez
// (el traslado del sábado y el regreso del domingo), la tarjeta muestra la más
// próxima y las demás van debajo como «Y después». Conserva el orden de prioridad
// entre Hermandades.
export function groupFocusesByBrotherhood(entries = []) {
  const groups = new Map()
  const order = []
  for (const entry of entries) {
    const key = brotherhoodKey(entry.outing) || `outing:${entry.outing.id}`
    if (!groups.has(key)) {
      groups.set(key, [])
      order.push(key)
    }
    groups.get(key).push(entry)
  }
  return order.map((key) => {
    const group = groups.get(key).slice().sort((a, b) => chronologicalKey(a.outing).localeCompare(chronologicalKey(b.outing)))
    const [first, ...rest] = group
    return { ...first, followUps: rest.map((entry) => entry.outing) }
  })
}

export function getHomeEditorialFocus(outings = [], todayKey = '', focuses = []) {
  return getHomeEditorialFocuses(outings, todayKey, focuses)[0] || null
}

// «Dom 22 · 16:00» para la línea «Y después» de la tarjeta.
export function followUpWhen(outing = {}) {
  const date = dateKey(outing.date)
  const time = String(outing.startTime || outing.departureTime || '').slice(0, 5)
  if (!date) return time
  const label = new Intl.DateTimeFormat('es-ES', { timeZone: 'UTC', weekday: 'short', day: 'numeric' })
    .format(new Date(`${date}T12:00:00Z`))
    .replace(/\./g, '')
  const day = label.charAt(0).toLocaleUpperCase('es') + label.slice(1)
  return time ? `${day} · ${time}` : day
}

// Una sola página por salida: si la ficha de la Hermandad (modo aplicación)
// muestra sus salidas en el capítulo Salida, la guía lleva allí.
export function featuredGuideHref(outing = {}) {
  if (outing.brotherhoodId && outing.organizerHref && usesBrotherhoodChapters(outing.brotherhoodId)) {
    return `${outing.organizerHref}#salida`
  }
  return outing.href || outing.calendarHref || '/extraordinarias'
}

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
  return active.flatMap((focus) => {
    if (seen.has(focus.outingId)) return []
    const outing = outings.find((item) => item?.id === focus.outingId && item.liveState?.state !== 'done')
    if (!outing) return []
    seen.add(focus.outingId)
    return [{ focus, outing }]
  })
}

export function getHomeEditorialFocus(outings = [], todayKey = '', focuses = []) {
  return getHomeEditorialFocuses(outings, todayKey, focuses)[0] || null
}

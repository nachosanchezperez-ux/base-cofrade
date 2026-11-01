// The event and its timetable remain data, not a requirement for a new page.
export function agendaEventAnchor(item) {
  return `acto-${String(item.key || item.id || '').replace(/[^a-zA-Z0-9_-]/g, '-')}`
}

export function isOutingEvent(item) {
  return ['processions', 'transfers', 'rosaries', 'romeries'].includes(item.category)
}

function normalized(value) {
  return String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

export function schedulePrecision(schedule, role) {
  const row = (schedule || []).find((item) => {
    const label = normalized(item.label)
    return role === 'departure' ? /salida|inicio/.test(label) : /entrada|regreso|recogida|llegada/.test(label)
  })
  const text = normalized([row?.timeText, row?.notes].filter(Boolean).join(' '))
  if (/aproximad|aprox\b/.test(text)) return 'Aprox.'
  if (/previst|estimad/.test(text)) return 'Prevista'
  return ''
}

const DEPARTURE_LABEL = /salida|inicio|procesi|traslado|rosario|regreso|romeri/
const ARRIVAL_LABEL = /entrada|llegada|recogida/
const NO_HINT = /pendiente|por confirmar|por determinar|sin confirmar/

// Franja publicada cuando aún no hay hora exacta («Por la tarde», «Tras la Misa
// de 10:00»). Sale del horario del acto; nunca se inventa una hora.
export function scheduleTimeHint(schedule, role = 'departure') {
  const row = (schedule || []).find((item) => {
    const label = normalized(item.label)
    if (role === 'arrival') return ARRIVAL_LABEL.test(label)
    return DEPARTURE_LABEL.test(label) && !ARRIVAL_LABEL.test(label)
  })
  if (!row) return ''
  if (row.time) return String(row.time).slice(0, 5)
  const text = String(row.timeText || '').trim()
  if (!text || text.length > 40 || NO_HINT.test(normalized(text))) return ''
  return text
}

export function agendaDirectionsHref(place, municipality) {
  if (!place || !municipality) return ''
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place}, ${municipality}, Sevilla, España`)}`
}

// Título para leer en la lista (#agenda-lectura): sin las coletillas que la
// tarjeta ya dice al lado («· 2026», «· Sevilla», «· Santa Catalina» cuando el
// lugar es la Iglesia de Santa Catalina). Los datos (y el JSON-LD) no cambian.
export function agendaDisplayTitle(item = {}) {
  const title = String(item.title || '').replace(/\s+/g, ' ').trim()
  const parts = title.split(' · ')
  if (parts.length < 2) return title
  const year = String(item.temporalDate || item.date || '').slice(0, 4)
  const municipality = normalized(item.municipality).trim()
  const place = normalized(item.place).trim()
  const redundant = (segment) => {
    const value = normalized(segment).trim()
    if (!value) return true
    if (/^\d{4}$/.test(value)) return !year || value === year
    if (municipality && value === municipality) return true
    return Boolean(place && value.length > 3 && (place === value || place.endsWith(` ${value}`)))
  }
  while (parts.length > 1 && redundant(parts[parts.length - 1])) parts.pop()
  return parts.join(' · ')
}

// Estado del acto en la tarjeta de Hoy: en la calle según su horario publicado,
// o ya empezado sin hora de entrada conocida. Nunca se inventa la entrada.
export function agendaRowStatus(item = {}) {
  const state = item.liveState
  if (!state) return null
  if (state.isLive) return { kind: 'live', label: 'En la calle ahora' }
  if (state.label === 'Horario incompleto') {
    const start = String(item.startTime || item.departureTime || '').slice(0, 5)
    return { kind: 'started', label: /^\d{2}:\d{2}$/.test(start) ? `Empezó a las ${start}` : 'Ya empezó' }
  }
  return null
}

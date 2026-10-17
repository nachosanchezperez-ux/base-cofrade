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

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

export function agendaDirectionsHref(place, municipality) {
  if (!place || !municipality) return ''
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place}, ${municipality}, Sevilla, España`)}`
}

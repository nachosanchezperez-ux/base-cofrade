export const CREW_EVENT_TYPES = [
  ['iguala', 'Igualá'],
  ['ensayo', 'Ensayo'],
  ['muda', 'Mudá'],
  ['retranqueo', 'Retranqueo'],
  ['desarma', 'Desarmá'],
  ['reunion_cuadrilla', 'Reunión de cuadrilla'],
  ['acto_costalero', 'Acto costalero'],
]

export const CREW_EVENT_TYPE_LABELS = Object.fromEntries(CREW_EVENT_TYPES)

export const CREW_EVENT_STATUS_LABELS = {
  announced: 'Convocada',
  postponed: 'Aplazada',
  cancelled: 'Cancelada',
  held: 'Celebrada',
}
export function crewEventTypeLabel(value) {
  return CREW_EVENT_TYPE_LABELS[value] || 'Convocatoria'
}

export function crewEventStatusLabel(value) {
  return CREW_EVENT_STATUS_LABELS[value] || 'Convocada'
}

// Lo que se muestra en la pastilla de estado. Una convocatoria cuya fecha ya pasó
// sin otro estado registrado no puede seguir diciendo «Convocada»; tampoco se
// afirma que se celebrara si nadie lo ha confirmado: «Fecha pasada».
export function crewEventDisplayStatus(event = {}) {
  const status = event.eventStatus || 'announced'
  if (event.isPast && status === 'announced') return { status: 'past', label: 'Fecha pasada' }
  return { status, label: event.urgencyLabel || crewEventStatusLabel(status) }
}

export function crewEventTimeLabel(value) {
  return value ? String(value).slice(0, 5) : ''
}

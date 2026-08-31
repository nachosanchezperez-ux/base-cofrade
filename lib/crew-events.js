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

export function crewEventTimeLabel(value) {
  return value ? String(value).slice(0, 5) : ''
}

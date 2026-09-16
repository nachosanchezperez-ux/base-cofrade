export const CONCERT_EVENT_TYPE_LABELS = Object.freeze({
  concierto: 'Concierto',
  certamen: 'Certamen',
  presentacion: 'Presentación',
  estreno: 'Estreno',
  encuentro: 'Encuentro de bandas',
  otro_musical: 'Otro acto musical',
})

export const CONCERT_EVENT_TYPES = Object.entries(CONCERT_EVENT_TYPE_LABELS)

export function concertEventTypeLabel(value) {
  return CONCERT_EVENT_TYPE_LABELS[value] || 'Concierto'
}

export function concertEventTimeLabel(value) {
  return value ? String(value).slice(0, 5) : ''
}

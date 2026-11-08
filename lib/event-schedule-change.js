// Estado editorial y revisión de una convocatoria; nunca deducidos del texto.
export function eventScheduleChange(item = {}) {
  const status = item.eventStatus || item.event_status || 'announced'
  const change = item.scheduleChange || item.schedule_change || {}
  const withdrawn = ['postponed', 'cancelled', 'suspended'].includes(status)
  return {
    status, change, withdrawn,
    label: status === 'postponed' ? 'Aplazado · Nueva fecha por anunciar'
      : status === 'rescheduled' ? 'Reprogramado'
      : status === 'suspended' ? 'Suspendido'
      : status === 'cancelled' ? 'Cancelado' : '',
  }
}

export function withEventScheduleChange(item = {}, change = item.scheduleChange || {}) {
  const { status, withdrawn, label } = eventScheduleChange({ ...item, scheduleChange: change })
  return {
    ...item, scheduleChange: change, scheduleStatusLabel: label,
    isPostponed: status === 'postponed',
    isCancelled: ['cancelled', 'suspended'].includes(status),
    isUpcoming: !withdrawn && status !== 'held' && (status === 'rescheduled' && typeof item.isPast === 'boolean' ? Boolean(item.date) && !item.isPast : Boolean(item.isUpcoming)),
    ...(withdrawn ? { isLive: false, urgencyLabel: '', liveState: { state: 'withdrawn', isLive: false, label, timingLabel: '' } } : {}),
  }
}

// No se retiran del feed las convocatorias anuladas por su fecha pasada.
// Se conservan mientras el registro siga publicado, para clientes desconectados.
export function retainCalendarItem(item = {}) {
  return !item.isPast || eventScheduleChange(item).withdrawn
}

export function previousEventStartDate(item = {}) {
  const { change, status } = eventScheduleChange(item)
  return status === 'rescheduled' && /^\d{4}-\d{2}-\d{2}$/.test(change.previousDate || '') ? change.previousDate : ''
}

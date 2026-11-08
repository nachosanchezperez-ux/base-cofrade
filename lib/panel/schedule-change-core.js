const STATES = new Set(['announced','held','cancelled','suspended','postponed','rescheduled'])
export const EVENT_STATUS_LABELS = { announced: 'Anunciado', held: 'Celebrado', cancelled: 'Cancelado', suspended: 'Suspendido', postponed: 'Aplazado · Nueva fecha por anunciar', rescheduled: 'Reprogramado' }
export function scheduleReviewKey(id, oldDate, newDate, status, oldEnd = '', newEnd = '') {
  return [id || '', oldDate || '', newDate || '', status || 'announced', oldEnd || '', newEnd || ''].join('|')
}
export function scheduleChangePayload(form, previous, date, status, dateField = 'outing_date') {
  if (!STATES.has(status)) throw new Error('Estado de convocatoria no válido')
  const endField = dateField === 'start_date' ? 'end_date' : 'return_date'
  const oldEnd = previous?.[endField] || ''
  const newEnd = form.has(endField) ? String(form.get(endField) || '') : oldEnd
  if (!previous || (newEnd === oldEnd && String(previous[dateField] || '') === String(date || '') && previous.event_status === status)) return {}
  if (!Object.hasOwn(previous, 'schedule_change')) throw new Error('El modelo de aplazamientos necesita la migración revisada antes de editar convocatorias.')
  if (previous.updated_at && form.get('schedule_version') !== previous.updated_at) throw new Error('La convocatoria cambió desde que abriste el Panel. Recarga y revisa de nuevo.')
  const id = previous.id || previous.entity_id
  if (form.get('schedule_reviewed') !== 'yes' || form.get('schedule_review_key') !== scheduleReviewKey(id, previous[dateField], date, status, oldEnd, newEnd)) throw new Error('Revisa los hitos y actos vinculados antes de guardar el cambio de fecha o estado.')
  const reason = String(form.get('schedule_reason') || '').trim()
  const sourceUrl = String(form.get('schedule_source') || '').trim()
  let source
  try { source = new URL(sourceUrl) } catch {}
  if (!reason || !source || !['http:', 'https:'].includes(source.protocol)) throw new Error('Indica el motivo y una fuente HTTP(S) del cambio.')
  if (!date && ['postponed','rescheduled','cancelled','suspended'].includes(status)) throw new Error('Conserva la fecha de la convocatoria anterior; no inventes una nueva.')
  const previousDate = String(form.get('schedule_previous_date') || previous[dateField] || '')
  if (status === 'rescheduled' && date === previous[dateField] && (!/^\d{4}-\d{2}-\d{2}$/.test(previousDate) || Number.isNaN(Date.parse(previousDate)) || previousDate === date)) throw new Error('Indica la fecha anterior documentada de la reprogramación.')
  return { schedule_change: { ...previous.schedule_change, reason, sourceUrl, ...(status === 'rescheduled' ? { previousDate } : {}) } }
}

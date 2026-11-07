'use client'
import { useEffect, useRef, useState } from 'react'
import { scheduleReviewKey } from '@/lib/panel/schedule-change-core'
import styles from './ScheduleChangeReview.module.css'

export default function ScheduleChangeReview({ item, dateField = 'outing_date', related = [] }) {
  const endField = dateField === 'start_date' ? 'end_date' : 'return_date'
  const ref = useRef(null)
  const [current, setCurrent] = useState({ date: item?.[dateField] || '', status: item?.event_status || 'announced', end: item?.[endField] || '' })
  useEffect(() => {
    const form = ref.current?.closest('form')
    if (!form) return
    const update = () => setCurrent({ date: form.elements.namedItem(dateField)?.value || '', status: form.elements.namedItem('event_status')?.value || 'announced', end: form.elements.namedItem(endField)?.value ?? item?.[endField] ?? '' })
    form.addEventListener('change', update)
    return () => form.removeEventListener('change', update)
  }, [dateField, endField, item])
  const changed = item && (current.date !== (item[dateField] || '') || current.status !== item.event_status || current.end !== (item[endField] || ''))
  const key = scheduleReviewKey(item?.id || item?.entity_id, item?.[dateField], current.date, current.status, item?.[endField], current.end)
  return <div ref={ref} className={styles.review}>
    {changed ? <fieldset key={key}>
      <legend>Revisa el cambio de convocatoria</legend>
      <p>Fecha anterior: {item[dateField] || 'Sin fecha'}. Fecha seleccionada: {current.date || 'Sin fecha'}.</p>
      <p>Si no hay nueva fecha, elige «Aplazado» y conserva la fecha anterior. No se moverán automáticamente los actos ni los hitos.</p>
      <ul>{(item.schedule || []).map((row) => <li key={row.id}>{row.item_date || 'Sin fecha propia'} · {row.label}{row.item_time ? ` · ${row.item_time.slice(0,5)}` : ''}</li>)}</ul>
      {related.length ? <details><summary>Actos relacionados que conviene revisar</summary><ul>{related.map((row) => <li key={row.id}>{row.date || 'Sin fecha'} · {row.title}{row.href ? <> · <a href={row.href} target="_blank" rel="noreferrer">Revisar</a></> : null}</li>)}</ul></details> : <p>Revisa también los cultos, traslados y actos de la misma hermandad.</p>}
      <p>Afecta a Agenda, Próximos, destacado, horarios, calendario y datos estructurados.</p>
      {current.status === 'rescheduled' && current.date === item[dateField] ? <label>Fecha anterior documentada<input type="date" name="schedule_previous_date" required defaultValue={item.schedule_change?.previousDate || ''} /></label> : null}
      <label>Motivo público<input name="schedule_reason" defaultValue={item.schedule_change?.reason || ''} required /></label>
      <label>Fuente del cambio<input name="schedule_source" type="url" defaultValue={item.schedule_change?.sourceUrl || ''} required /></label>
      <input type="hidden" name="schedule_version" value={item.updated_at || ""} />
      <input type="hidden" name="schedule_review_key" value={key} />
      <label className={styles.confirm}><input type="checkbox" name="schedule_reviewed" value="yes" required />He revisado los actos y los hitos vinculados.</label>
    </fieldset> : null}
    <noscript>Para cambiar fechas o estados se requiere revisar los vínculos con JavaScript activado. El servidor impide guardar un cambio sin revisión.</noscript>
  </div>
}

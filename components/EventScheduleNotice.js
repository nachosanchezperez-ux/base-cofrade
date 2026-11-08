import { eventScheduleChange } from '@/lib/event-schedule-change'
import styles from './EventScheduleNotice.module.css'

export default function EventScheduleNotice({ item }) {
  const { label, change, status } = eventScheduleChange(item)
  if (!label) return null
  const previous = /^\d{4}-\d{2}-\d{2}$/.test(change.previousDate || '') && !Number.isNaN(Date.parse(change.previousDate)) ? change.previousDate : ''
  return <aside className={styles.notice} aria-label="Estado de la convocatoria">
    <strong>{label}</strong>
    {previous ? <span>{status === 'rescheduled' ? 'Antes' : 'Convocatoria anterior'}: <time dateTime={previous}>{new Intl.DateTimeFormat('es-ES', { dateStyle: 'long', timeZone: 'Europe/Madrid' }).format(new Date(`${previous}T12:00:00Z`))}</time></span> : null}
    {change.reason ? <p>{change.reason}</p> : null}
  </aside>
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getExtraordinaryScheduleEditorData } from '@/lib/panel/extraordinary-outings'
import {
  createScheduleItemAction,
  deleteScheduleItemAction,
  moveScheduleItemAction,
  updateScheduleItemAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'
import editorStyles from '../editor.module.css'

function timeInput(value) { return value ? String(value).slice(0, 5) : '' }
function placeLabel(item) { return [item.name, item.municipality].filter(Boolean).join(' · ') }

const SAVED = {
  created: 'Hito horario añadido.',
  updated: 'Hito horario actualizado.',
  moved: 'Orden de horarios actualizado.',
  deleted: 'Hito horario eliminado.',
}

export const metadata = { title: 'Horarios · Extraordinaria · Panel' }

export default async function ExtraordinarySchedulePage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getExtraordinaryScheduleEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const isAdmin = user.role === 'admin'

  return (
    <div className={`${styles.pageWrap} ${editorStyles.stack}`}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/extraordinarias">Extraordinarias</Link><span>→</span><strong>Horarios</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>{data.outing.municipality || 'Sevilla y provincia'}</span><h1>{data.outing.title || 'Extraordinaria'}</h1><p>Ordena la jornada con horas exactas, aproximadas y lugares documentados.</p></div>
          {data.outing.slug ? <Link className={styles.secondaryButton} href={`/extraordinarias/${data.outing.slug}#horarios`} target="_blank" rel="noreferrer">Ver horarios públicos ↗</Link> : null}
        </div>
      </header>

      {SAVED[query?.saved] ? <div className={styles.savedNotice} role="status">{SAVED[query.saved]}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando los horarios como colaborador.</div> : null}

      <div className={editorStyles.helpBox}><strong>Hora exacta vs. texto:</strong> usa “Hora” cuando esté confirmada. Si solo sabemos “Tras la misa”, “Sobre las 04:00” o “al atardecer”, déjalo en <strong>Hora textual</strong> para no inventar precisión.</div>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Cronología</span><h2>{data.items.length} hitos</h2></div><p>El orden de esta lista es el mismo que verá el usuario en la guía.</p></div>
        {data.items.length ? (
          <div className={editorStyles.itemList}>
            {data.items.map((item, index) => (
              <article className={editorStyles.itemCard} key={item.id}>
                <div className={editorStyles.itemHead}>
                  <div><span>#{String(item.sequence_no).padStart(2, '0')}</span><strong>{item.label}</strong><small>{[timeInput(item.item_time) || item.time_text, item.placeName].filter(Boolean).join(' · ') || 'Sin hora ni lugar'}</small></div>
                  <div className={editorStyles.inlineActions}>
                    {canEdit && index > 0 ? <form action={moveScheduleItemAction}><input type="hidden" name="outing_id" value={data.outing.id} /><input type="hidden" name="schedule_item_id" value={item.id} /><input type="hidden" name="direction" value="up" /><button className={editorStyles.tinyButton} type="submit">↑ Subir</button></form> : null}
                    {canEdit && index < data.items.length - 1 ? <form action={moveScheduleItemAction}><input type="hidden" name="outing_id" value={data.outing.id} /><input type="hidden" name="schedule_item_id" value={item.id} /><input type="hidden" name="direction" value="down" /><button className={editorStyles.tinyButton} type="submit">↓ Bajar</button></form> : null}
                    {isAdmin ? <form action={deleteScheduleItemAction}><input type="hidden" name="outing_id" value={data.outing.id} /><input type="hidden" name="schedule_item_id" value={item.id} /><button className={`${editorStyles.tinyButton} ${editorStyles.dangerButton}`} type="submit">Eliminar</button></form> : null}
                  </div>
                </div>
                <div className={editorStyles.itemBody}>
                  <form action={updateScheduleItemAction} className={styles.editorForm}>
                    <input type="hidden" name="outing_id" value={data.outing.id} />
                    <input type="hidden" name="schedule_item_id" value={item.id} />
                    <div className={styles.formGrid}>
                      <label className={styles.fieldWide}><span>Hito</span><input name="label" defaultValue={item.label || ''} required disabled={!canEdit} /></label>
                      <label><span>Fecha</span><input name="item_date" type="date" defaultValue={item.item_date || data.outing.outing_date || ''} disabled={!canEdit} /></label>
                      <label><span>Hora</span><input name="item_time" type="time" defaultValue={timeInput(item.item_time)} disabled={!canEdit} /></label>
                      <label><span>Hora textual</span><input name="time_text" defaultValue={item.time_text || ''} placeholder="Tras la misa, sobre las 04:00…" disabled={!canEdit} /></label>
                      <label><span>Lugar relacionado</span><select name="place_id" defaultValue={item.place_id || ''} disabled={!canEdit}><option value="">Sin Lugar relacionado</option>{data.places.map((place) => <option value={place.id} key={place.id}>{placeLabel(place)}</option>)}</select></label>
                      <label className={styles.fieldWide}><span>Lugar en texto</span><input name="place_text" defaultValue={item.place_text || ''} placeholder="Si todavía no existe como Lugar" disabled={!canEdit} /></label>
                      <label className={styles.fieldWide}><span>Notas públicas</span><textarea name="notes" rows="2" defaultValue={item.notes || ''} disabled={!canEdit} /></label>
                    </div>
                    <div className={styles.formActions}><small>#{item.sequence_no} en la cronología</small><button className={styles.primaryButton} type="submit" disabled={!canEdit}>Guardar hito</button></div>
                  </form>
                </div>
              </article>
            ))}
          </div>
        ) : <div className={editorStyles.empty}>Todavía no hay hitos horarios. Añade el primero abajo.</div>}
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Nuevo hito</span><h2>Añadir horario</h2></div><p>Se incorporará al final de la cronología y después podrás reordenarlo.</p></div>
        <form action={createScheduleItemAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="outing_id" value={data.outing.id} />
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Hito</span><input name="label" placeholder="Salida, misa estacional, entrada…" required disabled={!canEdit} /></label>
            <label><span>Fecha</span><input name="item_date" type="date" defaultValue={data.outing.outing_date || ''} disabled={!canEdit} /></label>
            <label><span>Hora</span><input name="item_time" type="time" disabled={!canEdit} /></label>
            <label><span>Hora textual</span><input name="time_text" placeholder="Tras la misa…" disabled={!canEdit} /></label>
            <label><span>Lugar relacionado</span><select name="place_id" defaultValue="" disabled={!canEdit}><option value="">Sin Lugar relacionado</option>{data.places.map((place) => <option value={place.id} key={place.id}>{placeLabel(place)}</option>)}</select></label>
            <label className={styles.fieldWide}><span>Lugar en texto</span><input name="place_text" disabled={!canEdit} /></label>
            <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" disabled={!canEdit} /></label>
          </div>
          <div className={styles.formActions}><small>El orden se asigna automáticamente.</small><button className={styles.primaryButton} type="submit" disabled={!canEdit}>Añadir hito</button></div>
        </form>
      </section>
    </div>
  )
}

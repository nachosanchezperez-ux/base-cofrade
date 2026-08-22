import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getExtraordinaryGeneralEditorData } from '@/lib/panel/extraordinary-outings'
import { saveExtraordinaryGeneralAction } from './actions'
import styles from '@/app/panel/panel.module.css'
import editorStyles from '../editor.module.css'

const EVENT_STATUS_LABELS = { announced: 'Anunciada', held: 'Celebrada', cancelled: 'Cancelada' }
const SAVED_MESSAGES = {
  created: 'Extraordinaria creada como borrador. Completa ahora la ficha y publícala cuando esté lista.',
  general: 'Datos generales guardados correctamente.',
}

function timeInput(value) {
  return value ? String(value).slice(0, 5) : ''
}

function optionLabel(place) {
  return [place.name, place.municipality].filter(Boolean).join(' · ')
}

export const metadata = { title: 'Datos generales · Extraordinaria · Panel' }

export default async function ExtraordinaryGeneralPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getExtraordinaryGeneralEditorData(id)
  if (!data) notFound()
  const { outing } = data
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={`${styles.pageWrap} ${editorStyles.stack}`}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/extraordinarias">Extraordinarias</Link><span>→</span><strong>General</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>{outing.municipality || 'Sevilla y provincia'}</span><h1>{outing.title || 'Extraordinaria'}</h1><p>Información estructural que alimenta el directorio y la guía pública.</p></div>
          <div className={styles.editorHeaderActions}>
            <span className={styles.statusBadge}>{EVENT_STATUS_LABELS[outing.event_status] || outing.event_status}</span>
            {outing.slug ? <Link className={styles.secondaryButton} href={`/extraordinarias/${outing.slug}`} target="_blank" rel="noreferrer">Ver guía pública ↗</Link> : null}
          </div>
        </div>
      </header>

      {SAVED_MESSAGES[query?.saved] ? <div className={styles.savedNotice} role="status">{SAVED_MESSAGES[query.saved]}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando la ficha como colaborador. Un editor debe realizar los cambios.</div> : null}

      <div className={editorStyles.summaryGrid}>
        <article><span>Fecha</span><strong>{outing.outing_date || 'Por documentar'}</strong></article>
        <article><span>Salida</span><strong>{timeInput(outing.departure_time) || '—'}</strong></article>
        <article><span>Entrada</span><strong>{timeInput(outing.return_time) || '—'}</strong></article>
        <article><span>Estado</span><strong>{EVENT_STATUS_LABELS[outing.event_status] || outing.event_status}</strong></article>
      </div>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Ficha base</span><h2>Datos generales</h2></div><p>Edita aquí la identidad de la salida, fechas, lugares, motivo y textos públicos.</p></div>
        <form action={saveExtraordinaryGeneralAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="outing_id" value={outing.id} />
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Titular / título</span><input name="title" defaultValue={outing.title || ''} required disabled={!canEdit} /></label>
            <label><span>Tipo</span><input name="outing_type" defaultValue={outing.outing_type || ''} placeholder="Procesión extraordinaria" required disabled={!canEdit} /></label>
            <label><span>REF</span><input name="reference_code" defaultValue={outing.reference_code || ''} placeholder="SEVILLA-TITULAR-2027" disabled={!canEdit} /></label>
            <label className={styles.fieldWide}><span>Slug público</span><input name="slug" defaultValue={outing.slug || ''} placeholder="Se conserva o se genera automáticamente" disabled={!canEdit} /></label>

            <label><span>Fecha</span><input name="outing_date" type="date" defaultValue={outing.outing_date || ''} disabled={!canEdit} /></label>
            <label><span>Hora de salida</span><input name="departure_time" type="time" defaultValue={timeInput(outing.departure_time)} disabled={!canEdit} /></label>
            <label><span>Fecha de entrada</span><input name="return_date" type="date" defaultValue={outing.return_date || ''} disabled={!canEdit} /></label>
            <label><span>Hora de entrada</span><input name="return_time" type="time" defaultValue={timeInput(outing.return_time)} disabled={!canEdit} /></label>

            <label><span>Localidad</span><select name="municipality_id" defaultValue={outing.municipality_id || ''} disabled={!canEdit}><option value="">Por documentar</option>{data.municipalities.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
            <label><span>Hermandad relacionada</span><select name="brotherhood_entity_id" defaultValue={outing.brotherhood_entity_id || ''} disabled={!canEdit}><option value="">Sin ficha relacionada</option>{data.brotherhoods.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>
            <label className={styles.fieldWide}><span>Organizador visible</span><input name="organizer_name" defaultValue={outing.organizer_name || ''} placeholder="Nombre literal si la Hermandad no tiene ficha" disabled={!canEdit} /></label>
            <label className={styles.fieldWide}><span>Notas internas del organizador</span><textarea name="organizer_notes" rows="2" defaultValue={outing.organizer_notes || ''} disabled={!canEdit} /></label>

            <label><span>Origen normalizado</span><select name="origin_place_id" defaultValue={outing.origin_place_id || ''} disabled={!canEdit}><option value="">Sin Lugar relacionado</option>{data.places.map((item) => <option value={item.id} key={item.id}>{optionLabel(item)}</option>)}</select></label>
            <label><span>Destino normalizado</span><select name="destination_place_id" defaultValue={outing.destination_place_id || ''} disabled={!canEdit}><option value="">Sin Lugar relacionado</option>{data.places.map((item) => <option value={item.id} key={item.id}>{optionLabel(item)}</option>)}</select></label>
            <label><span>Origen en texto</span><input name="origin_text" defaultValue={outing.origin_text || ''} placeholder="Si aún no existe como Lugar" disabled={!canEdit} /></label>
            <label><span>Destino en texto</span><input name="destination_text" defaultValue={outing.destination_text || ''} placeholder="Si aún no existe como Lugar" disabled={!canEdit} /></label>

            <label className={styles.fieldWide}><span>Motivo</span><textarea name="reason" rows="2" defaultValue={outing.reason || ''} disabled={!canEdit} /></label>
            <label className={styles.fieldWide}><span>Recorrido</span><textarea name="route_summary" rows="5" defaultValue={outing.route_summary || ''} placeholder="Recorrido completo o resumen publicado" disabled={!canEdit} /></label>
            <label className={styles.fieldWide}><span>Descripción / contexto</span><textarea name="description" rows="4" defaultValue={outing.description || ''} disabled={!canEdit} /></label>
            <label className={styles.fieldWide}><span>Notas públicas</span><textarea name="public_notes" rows="3" defaultValue={outing.public_notes || ''} disabled={!canEdit} /></label>

            <label><span>Estado del evento</span><select name="event_status" defaultValue={outing.event_status || 'announced'} disabled={!canEdit}><option value="announced">Anunciada</option><option value="held">Celebrada</option><option value="cancelled">Cancelada</option></select></label>
            <label><span>Estado editorial</span><select name="status" defaultValue={outing.status || 'draft'} disabled={!canEdit}><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicado</option></select></label>
          </div>
          <div className={styles.formActions}>
            <small>Los cambios publicados se reflejan en Home, directorio y guía individual.</small>
            <button className={styles.primaryButton} type="submit" disabled={!canEdit}>Guardar datos generales</button>
          </div>
        </form>
      </section>

      <div className={editorStyles.helpBox}><strong>Lugares normalizados:</strong> si necesitas crear una iglesia, plaza o punto de interés nuevo, hazlo en <Link href="/panel/datos/lugares">Datos → Lugares</Link>. Mientras tanto puedes usar los campos de texto sin perder información.</div>
    </div>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import { CONCERT_EVENT_TYPES, concertEventTypeLabel } from '@/lib/concert-events'
import { requirePanelUser } from '@/lib/panel/auth'
import { getConcertEventEditorData } from '@/lib/panel/concert-events'
import {
  archiveConcertBandAction,
  archiveConcertEventAction,
  saveConcertBandAction,
  updateConcertEventAction,
} from '../actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
const SAVED_MESSAGES = {
  created: 'El concierto se ha creado.',
  updated: 'El concierto se ha actualizado.',
  band: 'La Banda se ha guardado.',
  'band-archived': 'La Banda se ha retirado del concierto.',
}

function StatusSelect({ name = 'relation_status', defaultValue = 'draft' }) {
  return <select name={name} defaultValue={defaultValue}><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicado</option><option value="archived">Archivado</option></select>
}

function BandFields({ item = null, options }) {
  return <div className={styles.formGrid}>
    <EntityPicker className={styles.fieldWide} name="band_entity_id" items={options} label="Banda" placeholder="Buscar Banda…" emptyLabel="Selecciona una Banda" defaultValue={item?.band_entity_id || ''} />
    <label><span>Participación</span><input name="role_name" defaultValue={item?.role_name || 'Banda participante'} placeholder="Banda invitada, organizadora…" /></label>
    <label><span>Orden</span><input name="sort_order" type="number" min="0" defaultValue={item?.sort_order || 0} /></label>
    <label className={styles.checkField}><input name="is_primary" type="checkbox" defaultChecked={item?.is_primary || false} /><span>Banda principal</span></label>
    <label><span>Estado editorial</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
    <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" defaultValue={item?.notes || ''} placeholder="Estreno, intervención concreta, orden de actuación…" /></label>
  </div>
}

export default async function ConcertEventEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getConcertEventEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/conciertos">Conciertos</Link><span>→</span><strong>{data.entity.name}</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Editar acto musical</span><h1>{data.entity.name}</h1><p>{concertEventTypeLabel(data.event.event_type)} · {data.event.event_date}</p></div>
          <div className={styles.editorHeaderActions}>
            <span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>{STATUS_LABELS[data.entity.status]}</span>
            {data.entity.status === 'published' ? <Link className={styles.secondaryButton} href="/agenda-cofrade?categoria=concerts#agenda" target="_blank" rel="noreferrer">Ver Agenda ↗</Link> : null}
            <Link className={styles.secondaryButton} href={`/panel/multimedia?entity=${id}`}>Multimedia</Link>
            <Link className={styles.primaryButton} href={`/panel/fuentes?entity=${id}`}>Fuentes</Link>
          </div>
        </div>
      </header>

      {SAVED_MESSAGES[query?.saved] ? <div className={styles.savedNotice} role="status">{SAVED_MESSAGES[query.saved]}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.metricGrid} aria-label="Cobertura del concierto">
        <article className={styles.metricCard}><span>Bandas</span><strong>{data.coverage.bands}</strong><small>vinculadas</small></article>
        <article className={styles.metricCard}><span>Fuentes</span><strong>{data.coverage.sources}</strong><small>documentos enlazados</small></article>
        <article className={styles.metricCard}><span>Multimedia</span><strong>{data.coverage.media}</strong><small>recursos vinculados</small></article>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Acto musical</span><h2>Información general</h2></div><p>La fecha, localidad y estado editorial controlan su aparición en la Agenda Cofrade.</p></div>
        <form action={updateConcertEventAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="event_id" value={id} />
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Título</span><input name="name" required defaultValue={data.entity.name} /></label>
            <label><span>Slug</span><input name="slug" required defaultValue={data.entity.slug || ''} /></label>
            <label><span>Tipo de acto</span><select name="event_type" defaultValue={data.event.event_type}>{CONCERT_EVENT_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label><span>Fecha</span><input name="event_date" type="date" required defaultValue={data.event.event_date || ''} /></label>
            <label><span>Hora inicial</span><input name="start_time" type="time" defaultValue={String(data.event.start_time || '').slice(0, 5)} /></label>
            <label><span>Hora final</span><input name="end_time" type="time" defaultValue={String(data.event.end_time || '').slice(0, 5)} /></label>
            <label><span>Horario textual</span><input name="time_text" defaultValue={data.event.time_text || ''} placeholder="A partir de las 20:30" /></label>
            <label><span>Localidad</span><select name="municipality_id" required defaultValue={data.event.municipality_id || ''}><option value="" disabled>Selecciona una localidad</option>{data.municipalities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label><span>Lugar vinculado</span><select name="place_id" defaultValue={data.event.place_id || ''}><option value="">Sin lugar vinculado</option>{data.places.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
            <label className={styles.fieldWide}><span>Lugar o recinto</span><input name="location_text" defaultValue={data.event.location_text || ''} placeholder="Teatro, plaza, iglesia, auditorio…" /></label>
            <EntityPicker className={styles.fieldWide} name="brotherhood_entity_id" items={data.brotherhoodOptions} label="Hermandad relacionada (opcional)" placeholder="Buscar Hermandad…" emptyLabel="Sin Hermandad vinculada" defaultValue={data.event.brotherhood_entity_id || ''} />
            <label><span>Estado del acto</span><select name="event_status" defaultValue={data.event.event_status}><option value="announced">Anunciado</option><option value="postponed">Aplazado</option><option value="cancelled">Cancelado</option><option value="held">Celebrado</option></select></label>
            <label><span>Estado editorial</span><StatusSelect name="status" defaultValue={data.entity.status} /></label>
            <label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" rows="3" defaultValue={data.entity.summary || ''} /></label>
            <label className={styles.fieldWide}><span>Descripción pública</span><textarea name="description" rows="4" defaultValue={data.event.description || ''} /></label>
            <label className={styles.fieldWide}><span>Programa, repertorio o notas públicas</span><textarea name="public_notes" rows="4" defaultValue={data.event.public_notes || ''} placeholder="Programa anunciado, estrenos, motivo del concierto…" /></label>
          </div>
          <div className={styles.formActions}>{canEdit ? <button className={styles.primaryButton} type="submit">Guardar concierto</button> : null}</div>
        </form>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Relaciones</span><h2>Bandas participantes</h2></div><p>Un mismo acto puede reunir varias formaciones. Marca una como principal para usar su identidad visual en la Agenda.</p></div>
        <div className={styles.editorStack}>
          {data.bands.map((item) => <article className={styles.editorItem} key={item.id}>
            <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{item.is_primary ? 'Principal' : (item.role_name || 'Participante')}</span><h3>{item.entity?.name || 'Banda no disponible'}</h3></div><span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span></div>
            {canEdit ? <form action={saveConcertBandAction} className={styles.editorForm}><input type="hidden" name="event_id" value={id} /><input type="hidden" name="relation_id" value={item.id} /><BandFields item={item} options={data.bandOptions} /><div className={styles.formActions}><button className={styles.secondaryButton} type="submit">Guardar Banda</button></div></form> : null}
            {canEdit ? <form action={archiveConcertBandAction} className={styles.archiveForm}><input type="hidden" name="event_id" value={id} /><input type="hidden" name="relation_id" value={item.id} /><button type="submit">Retirar Banda</button></form> : null}
          </article>)}
          {canEdit ? <form action={saveConcertBandAction} className={`${styles.editorItem} ${styles.editorForm}`}><input type="hidden" name="event_id" value={id} /><div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva relación</span><h3>Añadir Banda</h3></div></div><BandFields options={data.bandOptions} /><div className={styles.formActions}><button className={styles.primaryButton} type="submit">Vincular Banda</button></div></form> : null}
        </div>
      </section>

      {canEdit ? <section className={styles.editorSection}><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Archivo</span><h2>Retirar concierto</h2></div><p>Archivar lo oculta de la Agenda sin borrar sus Bandas, Fuentes ni multimedia.</p></div><form action={archiveConcertEventAction} className={styles.archiveForm}><input type="hidden" name="event_id" value={id} /><button type="submit">Archivar concierto</button></form></section> : null}
    </div>
  )
}

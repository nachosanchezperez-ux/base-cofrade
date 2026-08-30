import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import { CREW_EVENT_TYPES, crewEventStatusLabel, crewEventTypeLabel } from '@/lib/crew-events'
import { requirePanelUser } from '@/lib/panel/auth'
import { getCrewEventEditorData } from '@/lib/panel/crew-events'
import {
  archiveCrewEventAction,
  archiveCrewEventAgentAction,
  archiveCrewEventStepAction,
  saveCrewEventAgentAction,
  saveCrewEventStepAction,
  updateCrewEventAction,
} from '../actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
const SAVED_MESSAGES = { created: 'La convocatoria se ha creado.', updated: 'La convocatoria se ha actualizado.', step: 'El Paso se ha guardado.', 'step-archived': 'El Paso se ha retirado.', agent: 'El responsable se ha guardado.', 'agent-archived': 'El responsable se ha retirado.' }

function StatusSelect({ name = 'relation_status', defaultValue = 'draft' }) {
  return <select name={name} defaultValue={defaultValue}><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicado</option><option value="archived">Archivado</option></select>
}
function StepFields({ item = null, options }) {
  return <div className={styles.formGrid}>
    <EntityPicker className={styles.fieldWide} name="step_entity_id" items={options} label="Paso" placeholder="Buscar Paso…" emptyLabel="Selecciona un Paso" defaultValue={item?.step_entity_id || ''} />
    <label><span>Orden</span><input name="sort_order" type="number" min="0" defaultValue={item?.sort_order || 0} /></label>
    <label className={styles.checkField}><input name="is_primary" type="checkbox" defaultChecked={item?.is_primary || false} /><span>Paso principal</span></label>
    <label><span>Estado editorial</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
    <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" defaultValue={item?.notes || ''} /></label>
  </div>
}

function AgentFields({ item = null, options }) {
  return <div className={styles.formGrid}>
    <EntityPicker className={styles.fieldWide} name="agent_entity_id" items={options} label="Persona" placeholder="Buscar capataz o responsable…" emptyLabel="Selecciona una Persona" defaultValue={item?.agent_entity_id || ''} />
    <label><span>Responsabilidad</span><input name="role_name" required defaultValue={item?.role_name || 'Capataz'} /></label>
    <label><span>Orden</span><input name="sort_order" type="number" min="0" defaultValue={item?.sort_order || 0} /></label>
    <label className={styles.checkField}><input name="is_primary" type="checkbox" defaultChecked={item?.is_primary || false} /><span>Responsable principal</span></label>
    <label><span>Estado editorial</span><StatusSelect defaultValue={item?.status || 'draft'} /></label>
    <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" defaultValue={item?.notes || ''} /></label>
  </div>
}

export default async function CrewEventEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getCrewEventEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/igualas-y-ensayos">Igualás y ensayos</Link><span>→</span><strong>{data.entity.name}</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Editar convocatoria</span><h1>{data.entity.name}</h1><p>{crewEventTypeLabel(data.event.event_type)} · {data.event.event_date}</p></div>
          <div className={styles.editorHeaderActions}><span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>{STATUS_LABELS[data.entity.status]}</span>{data.entity.status === 'published' && data.entity.slug ? <Link className={styles.secondaryButton} href={`/igualas-y-ensayos/${data.entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}<Link className={styles.secondaryButton} href={`/panel/multimedia?entity=${id}`}>Multimedia</Link><Link className={styles.primaryButton} href={`/panel/fuentes?entity=${id}`}>Fuentes</Link></div>
        </div>
      </header>

      {SAVED_MESSAGES[query?.saved] ? <div className={styles.savedNotice} role="status">{SAVED_MESSAGES[query.saved]}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.metricGrid} aria-label="Cobertura de la convocatoria">
        <article className={styles.metricCard}><span>Pasos</span><strong>{data.coverage.steps}</strong><small>vinculados</small></article>
        <article className={styles.metricCard}><span>Responsables</span><strong>{data.coverage.agents}</strong><small>capataces y auxiliares</small></article>
        <article className={styles.metricCard}><span>Fuentes</span><strong>{data.coverage.sources}</strong><small>documentos enlazados</small></article>
        <article className={styles.metricCard}><span>Multimedia</span><strong>{data.coverage.media}</strong><small>recursos vinculados</small></article>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Convocatoria</span><h2>Información general</h2></div><p>La fecha, Hermandad y estado editorial controlan su aparición en el calendario público.</p></div>
        <form action={updateCrewEventAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="event_id" value={id} />
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Título</span><input name="name" required defaultValue={data.entity.name} /></label>
            <label><span>Slug</span><input name="slug" required defaultValue={data.entity.slug || ''} /></label>
            <label><span>Tipo de cita</span><select name="event_type" defaultValue={data.event.event_type}>{CREW_EVENT_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
            <label><span>Fecha</span><input name="event_date" type="date" required defaultValue={data.event.event_date || ''} /></label>
            <label><span>Hora inicial</span><input name="start_time" type="time" defaultValue={String(data.event.start_time || '').slice(0, 5)} /></label>
            <label><span>Hora final</span><input name="end_time" type="time" defaultValue={String(data.event.end_time || '').slice(0, 5)} /></label>
            <label><span>Horario textual</span><input name="time_text" defaultValue={data.event.time_text || ''} placeholder="A partir de las 20:30" /></label>
            <EntityPicker className={styles.fieldWide} name="brotherhood_entity_id" items={data.brotherhoodOptions} label="Hermandad" defaultValue={data.event.brotherhood_entity_id || ''} />
            <label><span>Localidad</span><select name="municipality_id" defaultValue={data.event.municipality_id || ''}><option value="">La de la Hermandad</option>{data.municipalities.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
            <label><span>Lugar vinculado</span><select name="place_id" defaultValue={data.event.place_id || ''}><option value="">Sin lugar vinculado</option>{data.places.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
            <label className={styles.fieldWide}><span>Lugar o punto de encuentro</span><input name="location_text" defaultValue={data.event.location_text || ''} /></label>
            <label><span>Estado de la cita</span><select name="event_status" defaultValue={data.event.event_status}><option value="announced">Convocada</option><option value="postponed">Aplazada</option><option value="cancelled">Cancelada</option><option value="held">Celebrada</option></select></label>
            <label><span>Estado editorial</span><StatusSelect name="status" defaultValue={data.entity.status} /></label>
            <label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" rows="3" defaultValue={data.entity.summary || ''} /></label>
            <label className={styles.fieldWide}><span>Descripción pública</span><textarea name="description" rows="4" defaultValue={data.event.description || ''} /></label>
            <label className={styles.fieldWide}><span>Indicaciones para la cuadrilla</span><textarea name="requirements" rows="3" defaultValue={data.event.requirements || ''} placeholder="Calzado, citación, acceso u otras indicaciones comunicadas" /></label>
            <label className={styles.fieldWide}><span>Notas públicas</span><textarea name="public_notes" rows="3" defaultValue={data.event.public_notes || ''} /></label>
          </div>
          <div className={styles.formActions}><small>Estado actual: {crewEventStatusLabel(data.event.event_status)}.</small>{canEdit ? <button className={styles.primaryButton} type="submit">Guardar convocatoria</button> : null}</div>
        </form>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Relaciones</span><h2>Pasos convocados</h2></div><p>Una misma cita puede corresponder a uno o varios Pasos.</p></div>
        <div className={styles.editorStack}>
          {data.steps.map((item) => <article className={styles.editorItem} key={item.id}><div className={styles.itemHeading}><div><span className={styles.eyebrow}>{item.is_primary ? 'Principal' : 'Vinculado'}</span><h3>{item.entity?.name || 'Paso no disponible'}</h3></div><span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span></div>{canEdit ? <form action={saveCrewEventStepAction} className={styles.editorForm}><input type="hidden" name="event_id" value={id} /><input type="hidden" name="relation_id" value={item.id} /><StepFields item={item} options={data.stepOptions} /><div className={styles.formActions}><button className={styles.secondaryButton} type="submit">Guardar Paso</button></div></form> : null}{canEdit ? <form action={archiveCrewEventStepAction} className={styles.archiveForm}><input type="hidden" name="event_id" value={id} /><input type="hidden" name="relation_id" value={item.id} /><button type="submit">Retirar Paso</button></form> : null}</article>)}
          {canEdit ? <form action={saveCrewEventStepAction} className={`${styles.editorItem} ${styles.editorForm}`}><input type="hidden" name="event_id" value={id} /><div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva relación</span><h3>Añadir Paso</h3></div></div><StepFields options={data.stepOptions} /><div className={styles.formActions}><button className={styles.primaryButton} type="submit">Vincular Paso</button></div></form> : null}
        </div>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Equipo</span><h2>Capataces y responsables</h2></div><p>Las Personas se reutilizan desde el archivo para evitar nombres duplicados.</p></div>
        <div className={styles.editorStack}>
          {data.agents.map((item) => <article className={styles.editorItem} key={item.id}><div className={styles.itemHeading}><div><span className={styles.eyebrow}>{item.role_name}</span><h3>{item.entity?.name || 'Persona no disponible'}</h3></div><span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span></div>{canEdit ? <form action={saveCrewEventAgentAction} className={styles.editorForm}><input type="hidden" name="event_id" value={id} /><input type="hidden" name="relation_id" value={item.id} /><AgentFields item={item} options={data.agentOptions} /><div className={styles.formActions}><button className={styles.secondaryButton} type="submit">Guardar responsable</button></div></form> : null}{canEdit ? <form action={archiveCrewEventAgentAction} className={styles.archiveForm}><input type="hidden" name="event_id" value={id} /><input type="hidden" name="relation_id" value={item.id} /><button type="submit">Retirar responsable</button></form> : null}</article>)}
          {canEdit ? <form action={saveCrewEventAgentAction} className={`${styles.editorItem} ${styles.editorForm}`}><input type="hidden" name="event_id" value={id} /><div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva relación</span><h3>Añadir responsable</h3></div></div><AgentFields options={data.agentOptions} /><div className={styles.formActions}><button className={styles.primaryButton} type="submit">Vincular responsable</button></div></form> : null}
        </div>
      </section>

      {canEdit ? <section className={styles.editorSection}><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Archivo</span><h2>Retirar convocatoria</h2></div><p>Archivar la oculta del Front sin borrar sus Pasos, responsables ni Fuentes.</p></div><form action={archiveCrewEventAction} className={styles.archiveForm}><input type="hidden" name="event_id" value={id} /><button type="submit">Archivar convocatoria</button></form></section> : null}
    </div>
  )
}

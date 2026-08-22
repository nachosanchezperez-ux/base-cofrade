import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import { requirePanelUser } from '@/lib/panel/auth'
import { EVENT_TARGET_LABELS, getEventEditorData } from '@/lib/panel/events'
import {
  archiveEventAction,
  archiveEventRelationAction,
  saveEventRelationAction,
  updateEventAction,
} from '../actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
const SAVED_MESSAGES = { created: 'El Acontecimiento se ha creado correctamente.', updated: 'El Acontecimiento se ha actualizado.', relation: 'La relación se ha guardado.', 'relation-archived': 'La relación se ha archivado.' }

function StatusSelect({ defaultValue = 'draft' }) {
  return <select name="status" defaultValue={defaultValue}><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicado</option><option value="archived">Archivado</option></select>
}

function RelationFields({ relation = null, targetOptions }) {
  return <div className={styles.formGrid}>
    <EntityPicker className={styles.fieldWide} name="target_entity_id" items={targetOptions} label="Entidad relacionada" placeholder="Buscar Hermandad, Imagen, Paso, Banda…" emptyLabel="Selecciona una entidad" defaultValue={relation?.target_entity_id || ''} />
    <label><span>Fecha inicial</span><input name="date_from" type="date" defaultValue={relation?.date_from || ''} /></label>
    <label><span>Datación inicial</span><input name="date_from_text" defaultValue={relation?.date_from_text || ''} /></label>
    <label><span>Fecha final</span><input name="date_to" type="date" defaultValue={relation?.date_to || ''} /></label>
    <label><span>Datación final</span><input name="date_to_text" defaultValue={relation?.date_to_text || ''} /></label>
    <label><span>Estado editorial</span><StatusSelect defaultValue={relation?.status || 'draft'} /></label>
    <label className={styles.fieldWide}><span>Notas de la relación</span><textarea name="notes" rows="2" defaultValue={relation?.notes || ''} /></label>
  </div>
}

export default async function EventEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getEventEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]
  const returnPath = `/panel/acontecimientos/${id}`

  return <div className={styles.pageWrap}>
    <header className={styles.editorHeader}>
      <div className={styles.breadcrumb}><Link href="/panel/acontecimientos">Acontecimientos</Link><span>→</span><strong>{data.entity.name}</strong></div>
      <div className={styles.editorTitleRow}>
        <div><span className={styles.eyebrow}>Editar Acontecimiento</span><h1>{data.entity.name}</h1><p>{data.event.event_type}</p></div>
        <div className={styles.editorHeaderActions}><span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>{STATUS_LABELS[data.entity.status]}</span><Link className={styles.secondaryButton} href={`/panel/multimedia?entity=${id}`}>Multimedia</Link><Link className={styles.primaryButton} href={`/panel/fuentes?entity=${id}`}>Fuentes</Link></div>
      </div>
    </header>

    {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
    {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

    <section className={styles.metricGrid} aria-label="Cobertura del Acontecimiento">
      <article className={styles.metricCard}><span>Relaciones</span><strong>{data.coverage.relations}</strong><small>entidades conectadas</small></article>
      <article className={styles.metricCard}><span>Multimedia</span><strong>{data.coverage.media}</strong><small>recursos vinculados</small></article>
      <article className={styles.metricCard}><span>Fuentes</span><strong>{data.coverage.sources}</strong><small>Fuentes directas</small></article>
    </section>

    <section className={styles.editorSection}>
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Hecho histórico</span><h2>Información general</h2></div><p>Los Acontecimientos publicados pueden alimentar efemérides, cronologías y participaciones históricas.</p></div>
      <form action={updateEventAction} className={`${styles.panelCard} ${styles.editorForm}`}>
        <input type="hidden" name="event_id" value={id} />
        <div className={styles.formGrid}>
          <label className={styles.fieldWide}><span>Título</span><input name="name" defaultValue={data.entity.name} required /></label>
          <label><span>Tipo</span><input name="event_type" defaultValue={data.event.event_type} required /></label>
          <label><span>Slug</span><input name="slug" defaultValue={data.entity.slug || ''} required /></label>
          <label><span>Fecha exacta</span><input name="event_date" type="date" defaultValue={data.event.event_date || ''} /></label>
          <label><span>Datación textual</span><input name="event_date_text" defaultValue={data.event.event_date_text || ''} /></label>
          <label><span>Lugar</span><select name="place_id" defaultValue={data.event.place_id || ''}><option value="">Sin lugar vinculado</option>{data.places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}</select></label>
          <label><span>Estado editorial</span><StatusSelect defaultValue={data.entity.status} /></label>
          <label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" rows="3" defaultValue={data.entity.summary || ''} /></label>
          <label className={styles.fieldWide}><span>Descripción pública</span><textarea name="description" rows="5" defaultValue={data.event.description || ''} /></label>
        </div>
        <div className={styles.formActions}><small>La ficha no necesita página pública propia para participar en el grafo y en la Home.</small>{canEdit ? <button className={styles.primaryButton} type="submit">Guardar Acontecimiento</button> : null}</div>
      </form>
    </section>

    <section className={styles.editorSection}>
      <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Tira del hilo</span><h2>Entidades implicadas</h2></div><p>Una misma efeméride puede involucrar varias Hermandades, Imágenes, Pasos o Bandas.</p></div>
      <div className={styles.editorStack}>
        {data.relations.map((relation) => <article className={styles.editorItem} key={relation.id}>
          <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{relation.target ? EVENT_TARGET_LABELS[relation.target.entity_type] || relation.target.entity_type : 'Entidad'}</span><h3>{relation.target?.name || 'Entidad no disponible'}</h3></div><span className={`${styles.statusBadge} ${styles[relation.status]}`}>{STATUS_LABELS[relation.status]}</span></div>
          {canEdit ? <form action={saveEventRelationAction} className={styles.editorForm}><input type="hidden" name="event_id" value={id} /><input type="hidden" name="relation_id" value={relation.id} /><RelationFields relation={relation} targetOptions={data.targetOptions} /><div className={styles.formActions}><small>La relación `involves` es la que usa el Front para situar el Acontecimiento dentro del grafo.</small><button className={styles.secondaryButton} type="submit">Guardar relación</button></div></form> : null}
          <RelationSourcesEditor relationKind="entity_relation" relationId={relation.id} contextEntityId={id} sourceOptions={data.sourceOptions} links={relation.sourceLinks || []} returnPath={returnPath} canEdit={canEdit} />
          {canEdit ? <form action={archiveEventRelationAction} className={styles.archiveForm}><input type="hidden" name="event_id" value={id} /><input type="hidden" name="relation_id" value={relation.id} /><button type="submit">Archivar relación</button></form> : null}
        </article>)}

        {canEdit ? <form action={saveEventRelationAction} className={`${styles.editorItem} ${styles.editorForm}`}><input type="hidden" name="event_id" value={id} /><div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva relación</span><h3>Añadir entidad implicada</h3></div></div><RelationFields targetOptions={data.targetOptions} /><div className={styles.formActions}><small>Después podrás añadir Fuentes específicas a esta relación.</small><button className={styles.primaryButton} type="submit">Relacionar entidad</button></div></form> : null}
      </div>
    </section>

    {canEdit ? <section className={styles.editorSection}><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Archivo</span><h2>Retirar Acontecimiento</h2></div><p>Archivar lo oculta del Front sin borrar sus relaciones ni documentación.</p></div><form action={archiveEventAction} className={styles.archiveForm}><input type="hidden" name="event_id" value={id} /><button type="submit">Archivar Acontecimiento</button></form></section> : null}
  </div>
}

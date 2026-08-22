import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import { requirePanelUser } from '@/lib/panel/auth'
import { getMarchEditorData } from '@/lib/panel/marches'
import {
  archiveMarchAction,
  archiveMarchAuthorAction,
  archiveMarchDedicationAction,
  archiveMarchRecordingAction,
  saveMarchAuthorAction,
  saveMarchDedicationAction,
  saveMarchRecordingAction,
  updateMarchAction,
} from '../actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }
const SAVED_MESSAGES = {
  created: 'La Marcha se ha creado correctamente.', updated: 'La Marcha se ha actualizado.',
  author: 'La autoría se ha guardado.', 'author-archived': 'La autoría se ha archivado.',
  dedication: 'La dedicatoria se ha guardado.', 'dedication-archived': 'La dedicatoria se ha archivado.',
  recording: 'La grabación se ha guardado.', 'recording-archived': 'La grabación se ha archivado.',
}

function StatusSelect({ defaultValue = 'draft' }) {
  return <select name="status" defaultValue={defaultValue}><option value="draft">Borrador</option><option value="review">En revisión</option><option value="published">Publicado</option><option value="archived">Archivado</option></select>
}

export default async function MarchEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getMarchEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = SAVED_MESSAGES[query?.saved]
  const returnPath = `/panel/marchas/${id}`

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/marchas">Marchas</Link><span>→</span><strong>{data.entity.name}</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Editar Marcha</span><h1>{data.entity.name}</h1><p>{[data.march.music_type, data.march.composition_year || data.march.composition_date_text].filter(Boolean).join(' · ')}</p></div>
          <div className={styles.editorHeaderActions}>
            <span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>{STATUS_LABELS[data.entity.status]}</span>
            <Link className={styles.secondaryButton} href={`/panel/multimedia?entity=${id}`}>Multimedia</Link>
            <Link className={styles.secondaryButton} href={`/panel/fuentes?entity=${id}`}>Fuentes</Link>
            <Link className={styles.primaryButton} href="/panel/hoy">Home</Link>
          </div>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.metricGrid} aria-label="Cobertura de la Marcha">
        <article className={styles.metricCard}><span>Autorías</span><strong>{data.coverage.authors}</strong><small>compositores y adaptadores</small></article>
        <article className={styles.metricCard}><span>Dedicatorias</span><strong>{data.coverage.dedications}</strong><small>Hermandades e Imágenes</small></article>
        <article className={styles.metricCard}><span>Grabaciones</span><strong>{data.coverage.recordings}</strong><small>registros audiovisuales</small></article>
        <article className={styles.metricCard}><span>Fuentes</span><strong>{data.coverage.sources}</strong><small>Fuentes directas</small></article>
      </section>

      <nav className={styles.sectionTabs} aria-label="Secciones de la Marcha">
        <a href="#general">General</a><a href="#autoria">Autoría</a><a href="#dedicatorias">Dedicatorias</a><a href="#grabaciones">Grabaciones</a><a href="#fuentes">Fuentes</a>
      </nav>

      <section className={styles.editorSection} id="general">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Fuente de verdad</span><h2>Ficha musical</h2></div><p>Estos datos alimentan Patrimonio musical y Marcha del día.</p></div>
        <form action={updateMarchAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="march_id" value={id} />
          <datalist id="music-types"><option value="Banda de Música" /><option value="Cornetas y Tambores" /><option value="Agrupación Musical" /><option value="Marcha procesional" /></datalist>
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Título</span><input name="name" defaultValue={data.entity.name} required /></label>
            <label><span>Slug</span><input name="slug" defaultValue={data.entity.slug || ''} required /></label>
            <label><span>Estado editorial</span><StatusSelect defaultValue={data.entity.status} /></label>
            <label><span>Tipo / formación</span><input name="music_type" list="music-types" defaultValue={data.march.music_type || ''} /></label>
            <label><span>Año de composición</span><input name="composition_year" type="number" min="1800" max="2200" defaultValue={data.march.composition_year ?? ''} /></label>
            <label><span>Datación textual</span><input name="composition_date_text" defaultValue={data.march.composition_date_text || ''} /></label>
            <label className={styles.fieldWide}><span>Resumen</span><textarea name="summary" defaultValue={data.entity.summary || ''} rows="3" /></label>
            <label className={styles.fieldWide}><span>Descripción pública</span><textarea name="description" defaultValue={data.march.description || ''} rows="4" /></label>
            <label><span>Fecha de estreno</span><input name="premiere_date" type="date" defaultValue={data.march.premiere_date || ''} /></label>
            <label><span>Estreno en texto</span><input name="premiere_date_text" defaultValue={data.march.premiere_date_text || ''} placeholder="Ej. Cuaresma de 2026" /></label>
            <label><span>Lugar de estreno</span><select name="premiere_place_id" defaultValue={data.march.premiere_place_id || ''}><option value="">Sin lugar vinculado</option>{data.places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}</select></label>
            <EntityPicker className={styles.fieldWide} name="premiered_by_band_entity_id" items={data.bandOptions} label="Banda que la estrenó (opcional)" emptyLabel="Sin Banda de estreno vinculada" required={false} defaultValue={data.march.premiered_by_band_entity_id || ''} />
            <label className={styles.fieldWide}><span>ID de vídeo de YouTube principal</span><input name="youtube_video_id" defaultValue={data.march.youtube_video_id || ''} placeholder="Solo el ID, no la URL completa" /></label>
            <label className={styles.checkField}><input name="eligible_for_daily" type="checkbox" defaultChecked={data.march.eligible_for_daily ?? true} /><span>Elegible como Marcha del día</span></label>
            <label><span>Prioridad diaria</span><input name="daily_priority" type="number" min="0" defaultValue={data.march.daily_priority ?? 0} /></label>
          </div>
          <div className={styles.formActions}><small>Desmarcar “elegible” la excluye de la rotación automática, pero sigue siendo una Marcha publicada.</small>{canEdit ? <button className={styles.primaryButton} type="submit">Guardar Marcha</button> : null}</div>
        </form>
      </section>

      <section className={styles.editorSection} id="autoria">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Creación</span><h2>Compositores y adaptadores</h2></div><p>Relaciona Personas existentes y documenta cada autoría por separado.</p></div>
        <div className={styles.editorStack}>
          {data.authors.map((author) => (
            <article className={styles.editorItem} key={author.id}>
              <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{author.author_role === 'adapter' ? 'Adaptación' : 'Composición'}</span><h3>{author.agent?.name || 'Agente no disponible'}</h3></div><span className={`${styles.statusBadge} ${styles[author.status]}`}>{STATUS_LABELS[author.status]}</span></div>
              {canEdit ? <form action={saveMarchAuthorAction} className={styles.editorForm}><input type="hidden" name="march_id" value={id} /><input type="hidden" name="author_id" value={author.id} /><div className={styles.formGrid}><EntityPicker className={styles.fieldWide} name="agent_entity_id" items={data.agentOptions} label="Autor" defaultValue={author.agent_entity_id} /><label><span>Papel</span><select name="author_role" defaultValue={author.author_role}><option value="composer">Compositor</option><option value="adapter">Adaptador / instrumentador</option></select></label><label><span>Estado</span><StatusSelect defaultValue={author.status} /></label><label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" defaultValue={author.notes || ''} /></label></div><div className={styles.formActions}><span /><button className={styles.secondaryButton} type="submit">Guardar autoría</button></div></form> : null}
              <RelationSourcesEditor relationKind="march_author" relationId={author.id} contextEntityId={id} sourceOptions={data.sourceOptions} links={author.sourceLinks || []} returnPath={returnPath} canEdit={canEdit} />
              {canEdit ? <form action={archiveMarchAuthorAction} className={styles.archiveForm}><input type="hidden" name="march_id" value={id} /><input type="hidden" name="author_id" value={author.id} /><button type="submit">Archivar autoría</button></form> : null}
            </article>
          ))}
          {canEdit ? <form action={saveMarchAuthorAction} className={`${styles.editorItem} ${styles.editorForm}`}><input type="hidden" name="march_id" value={id} /><div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva autoría</span><h3>Añadir responsable</h3></div></div><div className={styles.formGrid}><EntityPicker className={styles.fieldWide} name="agent_entity_id" items={data.agentOptions} label="Persona / Agente" emptyLabel="Selecciona un autor" /><label><span>Papel</span><select name="author_role" defaultValue="composer"><option value="composer">Compositor</option><option value="adapter">Adaptador / instrumentador</option></select></label><label><span>Estado</span><StatusSelect defaultValue="published" /></label><label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" /></label></div><div className={styles.formActions}><small>El autor debe existir previamente en Personas.</small><button className={styles.primaryButton} type="submit">Añadir autoría</button></div></form> : null}
        </div>
      </section>

      <section className={styles.editorSection} id="dedicatorias">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Vínculo devocional</span><h2>Dedicatorias</h2></div><p>La dedicatoria conecta la Marcha con la Hermandad o Imagen y alimenta su Patrimonio musical.</p></div>
        <div className={styles.editorStack}>
          {data.dedications.map((dedication) => (
            <article className={styles.editorItem} key={dedication.id}>
              <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{dedication.dedicatee?.entity_type === 'image' ? 'Imagen' : 'Hermandad'}</span><h3>{dedication.dedicatee?.name || 'Entidad no disponible'}</h3></div><span className={`${styles.statusBadge} ${styles[dedication.status]}`}>{STATUS_LABELS[dedication.status]}</span></div>
              {canEdit ? <form action={saveMarchDedicationAction} className={styles.editorForm}><input type="hidden" name="march_id" value={id} /><input type="hidden" name="dedication_id" value={dedication.id} /><input type="hidden" name="dedication_type" value="dedicated_to" /><div className={styles.formGrid}><EntityPicker className={styles.fieldWide} name="dedicatee_entity_id" items={data.dedicateeOptions} label="Dedicada a" defaultValue={dedication.dedicatee_entity_id} /><label className={styles.fieldWide}><span>Texto de dedicatoria</span><input name="dedication_text" defaultValue={dedication.dedication_text || ''} /></label><label><span>Estado</span><StatusSelect defaultValue={dedication.status} /></label><label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" defaultValue={dedication.notes || ''} /></label></div><div className={styles.formActions}><span /><button className={styles.secondaryButton} type="submit">Guardar dedicatoria</button></div></form> : null}
              <RelationSourcesEditor relationKind="march_dedication" relationId={dedication.id} contextEntityId={id} sourceOptions={data.sourceOptions} links={dedication.sourceLinks || []} returnPath={returnPath} canEdit={canEdit} />
              {canEdit ? <form action={archiveMarchDedicationAction} className={styles.archiveForm}><input type="hidden" name="march_id" value={id} /><input type="hidden" name="dedication_id" value={dedication.id} /><button type="submit">Archivar dedicatoria</button></form> : null}
            </article>
          ))}
          {canEdit ? <form action={saveMarchDedicationAction} className={`${styles.editorItem} ${styles.editorForm}`}><input type="hidden" name="march_id" value={id} /><input type="hidden" name="dedication_type" value="dedicated_to" /><div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva dedicatoria</span><h3>Relacionar con Hermandad o Imagen</h3></div></div><div className={styles.formGrid}><EntityPicker className={styles.fieldWide} name="dedicatee_entity_id" items={data.dedicateeOptions} label="Dedicada a" emptyLabel="Selecciona una Hermandad o Imagen" /><label className={styles.fieldWide}><span>Texto de dedicatoria</span><input name="dedication_text" /></label><label><span>Estado</span><StatusSelect defaultValue="published" /></label><label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" /></label></div><div className={styles.formActions}><small>Una Marcha puede tener varias dedicatorias documentadas.</small><button className={styles.primaryButton} type="submit">Añadir dedicatoria</button></div></form> : null}
        </div>
      </section>

      <section className={styles.editorSection} id="grabaciones">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Escucha</span><h2>Grabaciones</h2></div><p>La grabación destacada es la primera opción de escucha usada por el Front.</p></div>
        <div className={styles.editorStack}>
          {data.recordings.map((recording) => (
            <article className={styles.editorItem} key={recording.id}>
              <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{recording.is_featured ? 'Destacada' : 'Grabación'}</span><h3>{recording.title || recording.band?.name || 'Grabación documentada'}</h3></div><span className={`${styles.statusBadge} ${styles[recording.status]}`}>{STATUS_LABELS[recording.status]}</span></div>
              {canEdit ? <form action={saveMarchRecordingAction} className={styles.editorForm}><input type="hidden" name="march_id" value={id} /><input type="hidden" name="recording_id" value={recording.id} /><div className={styles.formGrid}><EntityPicker className={styles.fieldWide} name="band_entity_id" items={data.bandOptions} label="Banda (opcional)" emptyLabel="Sin Banda vinculada" required={false} defaultValue={recording.band_entity_id || ''} /><label><span>Título</span><input name="title" defaultValue={recording.title || ''} /></label><label><span>Año</span><input name="recording_year" type="number" min="1800" max="2200" defaultValue={recording.recording_year ?? ''} /></label><label><span>ID YouTube</span><input name="youtube_video_id" defaultValue={recording.youtube_video_id || ''} /></label><label className={styles.fieldWide}><span>URL externa</span><input name="external_url" type="url" defaultValue={recording.external_url || ''} /></label><label><span>Lugar</span><select name="place_id" defaultValue={recording.place_id || ''}><option value="">Sin lugar</option>{data.places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}</select></label><label className={styles.checkField}><input name="is_featured" type="checkbox" defaultChecked={recording.is_featured} /><span>Grabación destacada</span></label><label><span>Estado</span><StatusSelect defaultValue={recording.status} /></label><label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" defaultValue={recording.notes || ''} /></label></div><div className={styles.formActions}><span /><button className={styles.secondaryButton} type="submit">Guardar grabación</button></div></form> : null}
              <RelationSourcesEditor relationKind="march_recording" relationId={recording.id} contextEntityId={id} sourceOptions={data.sourceOptions} links={recording.sourceLinks || []} returnPath={returnPath} canEdit={canEdit} />
              {canEdit ? <form action={archiveMarchRecordingAction} className={styles.archiveForm}><input type="hidden" name="march_id" value={id} /><input type="hidden" name="recording_id" value={recording.id} /><button type="submit">Archivar grabación</button></form> : null}
            </article>
          ))}
          {canEdit ? <form action={saveMarchRecordingAction} className={`${styles.editorItem} ${styles.editorForm}`}><input type="hidden" name="march_id" value={id} /><div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva grabación</span><h3>Añadir escucha</h3></div></div><div className={styles.formGrid}><EntityPicker className={styles.fieldWide} name="band_entity_id" items={data.bandOptions} label="Banda (opcional)" emptyLabel="Sin Banda vinculada" required={false} /><label><span>Título</span><input name="title" /></label><label><span>Año</span><input name="recording_year" type="number" min="1800" max="2200" /></label><label><span>ID YouTube</span><input name="youtube_video_id" /></label><label className={styles.fieldWide}><span>URL externa</span><input name="external_url" type="url" /></label><label><span>Lugar</span><select name="place_id"><option value="">Sin lugar</option>{data.places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}</select></label><label className={styles.checkField}><input name="is_featured" type="checkbox" /><span>Grabación destacada</span></label><label><span>Estado</span><StatusSelect defaultValue="published" /></label><label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" /></label></div><div className={styles.formActions}><small>Si la marcas como destacada, las demás dejan de serlo automáticamente.</small><button className={styles.primaryButton} type="submit">Añadir grabación</button></div></form> : null}
        </div>
      </section>

      <section className={styles.editorSection} id="fuentes">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Documentación</span><h2>Fuentes directas</h2></div><Link className={styles.secondaryButton} href={`/panel/fuentes?entity=${id}`}>Gestionar Fuentes</Link></div>
        {data.directSources.length ? <div className={styles.editorStack}>{data.directSources.map((source) => <article className={styles.editorItem} key={source.id}><strong>{source.name}</strong><small>{source.source_type}{source.url ? ` · ${source.url}` : ''}</small></article>)}</div> : <div className={styles.emptyPanel}>La Marcha todavía no tiene Fuentes directas. Las autorías, dedicatorias y grabaciones pueden tener además Fuentes propias.</div>}
      </section>

      {canEdit ? <section className={styles.editorSection}><div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Archivo</span><h2>Retirar Marcha</h2></div><p>Archivar oculta la entidad del Front sin borrar autorías, dedicatorias ni grabaciones.</p></div><form action={archiveMarchAction} className={styles.archiveForm}><input type="hidden" name="march_id" value={id} /><button type="submit">Archivar Marcha</button></form></section> : null}
    </div>
  )
}

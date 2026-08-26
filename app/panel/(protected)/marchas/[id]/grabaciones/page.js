import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import { MARCH_SAVED_MESSAGES, STATUS_LABELS, StatusSelect } from '@/components/panel/march/MarchEditorPrimitives'
import { requirePanelUser } from '@/lib/panel/auth'
import { getMarchEditorData } from '@/lib/panel/marches'
import { archiveMarchRecordingAction, saveMarchRecordingAction } from '../../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Grabaciones de Marcha · Panel' }

export default async function MarchRecordingsPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getMarchEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = MARCH_SAVED_MESSAGES[query?.saved]
  const returnPath = `/panel/marchas/${id}/grabaciones`

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/marchas">Marchas</Link><span>→</span><Link href={`/panel/marchas/${id}`}>{data.entity.name}</Link><span>→</span><strong>Grabaciones</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Escucha y referencia</span><h1>Grabaciones</h1><p>{data.entity.name}</p></div>
          <span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>{STATUS_LABELS[data.entity.status]}</span>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Archivo sonoro</span><h2>Escuchas documentadas</h2></div><p>La grabación destacada es la primera opción utilizada por el Front cuando necesita reproducir esta Marcha.</p></div>
        <div className={styles.editorStack}>
          {data.recordings.map((recording) => (
            <article className={styles.editorItem} key={recording.id}>
              <div className={styles.itemHeading}>
                <div><span className={styles.eyebrow}>{recording.is_featured ? 'Destacada' : 'Grabación'}</span><h3>{recording.title || recording.band?.name || 'Grabación documentada'}</h3></div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className={`${styles.statusBadge} ${styles[recording.status]}`}>{STATUS_LABELS[recording.status]}</span>
                  {recording.band_entity_id ? <Link className={styles.secondaryButton} href={`/panel/bandas/${recording.band_entity_id}`}>Abrir Banda</Link> : null}
                </div>
              </div>
              {canEdit ? (
                <form action={saveMarchRecordingAction} className={styles.editorForm}>
                  <input type="hidden" name="march_id" value={id} /><input type="hidden" name="recording_id" value={recording.id} />
                  <div className={styles.formGrid}>
                    <EntityPicker className={styles.fieldWide} name="band_entity_id" items={data.bandOptions} label="Banda (opcional)" emptyLabel="Sin Banda vinculada" required={false} defaultValue={recording.band_entity_id || ''} />
                    <label><span>Título</span><input name="title" defaultValue={recording.title || ''} /></label>
                    <label><span>Año</span><input name="recording_year" type="number" min="1800" max="2200" defaultValue={recording.recording_year ?? ''} /></label>
                    <label><span>ID YouTube</span><input name="youtube_video_id" defaultValue={recording.youtube_video_id || ''} /></label>
                    <label className={styles.fieldWide}><span>URL externa</span><input name="external_url" type="url" defaultValue={recording.external_url || ''} /></label>
                    <label><span>Lugar</span><select name="place_id" defaultValue={recording.place_id || ''}><option value="">Sin lugar</option>{data.places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}</select></label>
                    <label className={styles.checkField}><input name="is_featured" type="checkbox" defaultChecked={recording.is_featured} /><span>Grabación destacada</span></label>
                    <label><span>Estado</span><StatusSelect defaultValue={recording.status} /></label>
                    <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" defaultValue={recording.notes || ''} /></label>
                  </div>
                  <div className={styles.formActions}><small>Solo una grabación puede quedar destacada; al marcarla se desmarca la anterior.</small><button className={styles.secondaryButton} type="submit">Guardar grabación</button></div>
                </form>
              ) : null}
              <RelationSourcesEditor relationKind="march_recording" relationId={recording.id} contextEntityId={id} sourceOptions={data.sourceOptions} links={recording.sourceLinks || []} returnPath={returnPath} canEdit={canEdit} />
              {canEdit ? <form action={archiveMarchRecordingAction} className={styles.archiveForm}><input type="hidden" name="march_id" value={id} /><input type="hidden" name="recording_id" value={recording.id} /><button type="submit">Archivar grabación</button></form> : null}
            </article>
          ))}

          {canEdit ? (
            <form action={saveMarchRecordingAction} className={`${styles.editorItem} ${styles.editorForm}`}>
              <input type="hidden" name="march_id" value={id} />
              <div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva grabación</span><h3>Añadir escucha</h3></div></div>
              <div className={styles.formGrid}>
                <EntityPicker className={styles.fieldWide} name="band_entity_id" items={data.bandOptions} label="Banda (opcional)" emptyLabel="Sin Banda vinculada" required={false} />
                <label><span>Título</span><input name="title" /></label>
                <label><span>Año</span><input name="recording_year" type="number" min="1800" max="2200" /></label>
                <label><span>ID YouTube</span><input name="youtube_video_id" /></label>
                <label className={styles.fieldWide}><span>URL externa</span><input name="external_url" type="url" /></label>
                <label><span>Lugar</span><select name="place_id" defaultValue=""><option value="">Sin lugar</option>{data.places.map((place) => <option key={place.id} value={place.id}>{place.name}</option>)}</select></label>
                <label className={styles.checkField}><input name="is_featured" type="checkbox" /><span>Grabación destacada</span></label>
                <label><span>Estado</span><StatusSelect defaultValue="published" /></label>
                <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" /></label>
              </div>
              <div className={styles.formActions}><small>Si la marcas como destacada, las demás dejan de serlo automáticamente.</small><button className={styles.primaryButton} type="submit">Añadir grabación</button></div>
            </form>
          ) : null}
        </div>
      </section>
    </div>
  )
}

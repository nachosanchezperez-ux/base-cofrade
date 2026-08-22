import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getExtraordinaryMusicEditorData } from '@/lib/panel/extraordinary-outings'
import {
  archiveMusicAssignmentAction,
  archiveMusicPositionAction,
  createMusicAssignmentAction,
  createMusicPositionAction,
  moveMusicPositionAction,
  updateMusicAssignmentAction,
  updateMusicPositionAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'
import editorStyles from '../editor.module.css'

const POSITION_OPTIONS = [
  ['processional_music', 'Música procesional'],
  ['liturgical_music', 'Música litúrgica'],
  ['announcement_music', 'Bando / anuncio'],
  ['after_mystery', 'Tras el misterio'],
  ['after_palio', 'Tras el palio'],
  ['other', 'Otro momento'],
]
const STATUS_OPTIONS = [['published', 'Publicado'], ['review', 'En revisión'], ['draft', 'Borrador'], ['archived', 'Archivado']]
const MODE_OPTIONS = [['full_route', 'Recorrido completo'], ['segment', 'Por tramo'], ['alternating', 'Alternando'], ['unspecified', 'Sin especificar']]
const SAVED = {
  'position-created': 'Momento musical añadido.',
  'position-updated': 'Momento musical actualizado.',
  'position-archived': 'Momento musical archivado.',
  'assignment-created': 'Formación musical añadida.',
  'assignment-updated': 'Formación musical actualizada.',
  'assignment-archived': 'Formación musical archivada.',
  moved: 'Orden musical actualizado.',
}

function OptionSet({ options, value }) {
  return options.map(([key, label]) => <option value={key} key={key}>{label}{key === value && !options.some(([candidate]) => candidate === value) ? ` · ${value}` : ''}</option>)
}

export const metadata = { title: 'Música · Extraordinaria · Panel' }

export default async function ExtraordinaryMusicPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getExtraordinaryMusicEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={`${styles.pageWrap} ${editorStyles.stack}`}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/extraordinarias">Extraordinarias</Link><span>→</span><strong>Música</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>{data.outing.municipality || 'Sevilla y provincia'}</span><h1>{data.outing.title || 'Extraordinaria'}</h1><p>Momentos musicales y formaciones vinculadas por función o tramo.</p></div>
          {data.outing.slug ? <Link className={styles.secondaryButton} href={`/extraordinarias/${data.outing.slug}#musica`} target="_blank" rel="noreferrer">Ver música pública ↗</Link> : null}
        </div>
      </header>

      {SAVED[query?.saved] ? <div className={styles.savedNotice} role="status">{SAVED[query.saved]}</div> : null}
      <div className={editorStyles.helpBox}><strong>Banda existente o nombre libre:</strong> si la formación ya está en Hilo Cofrade, selecciónala para crear la relación. Si aún no existe, escribe su nombre literal; la extraordinaria seguirá siendo publicable sin crear una ficha vacía.</div>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Programa musical</span><h2>{data.positions.length} momentos</h2></div><p>El orden determina cómo se presenta la música en la ficha.</p></div>
        {data.positions.length ? <div className={editorStyles.itemList}>{data.positions.map((position, index) => (
          <article className={editorStyles.itemCard} key={position.id}>
            <div className={editorStyles.itemHead}>
              <div><span>#{String(position.sequence_no).padStart(2, '0')}</span><strong>{position.position_label || position.position_code}</strong><small>{position.assignments.filter((item) => item.status !== 'archived').length} formaciones · {position.status}</small></div>
              <div className={editorStyles.inlineActions}>
                <span className={editorStyles.statusPill} data-status={position.status}>{position.status}</span>
                {canEdit && index > 0 ? <form action={moveMusicPositionAction}><input type="hidden" name="outing_id" value={data.outing.id}/><input type="hidden" name="position_id" value={position.id}/><input type="hidden" name="direction" value="up"/><button className={editorStyles.tinyButton}>↑</button></form> : null}
                {canEdit && index < data.positions.length - 1 ? <form action={moveMusicPositionAction}><input type="hidden" name="outing_id" value={data.outing.id}/><input type="hidden" name="position_id" value={position.id}/><input type="hidden" name="direction" value="down"/><button className={editorStyles.tinyButton}>↓</button></form> : null}
                {canEdit && position.status !== 'archived' ? <form action={archiveMusicPositionAction}><input type="hidden" name="outing_id" value={data.outing.id}/><input type="hidden" name="position_id" value={position.id}/><button className={editorStyles.tinyButton}>Archivar</button></form> : null}
              </div>
            </div>
            <div className={editorStyles.itemBody}>
              <form action={updateMusicPositionAction} className={styles.editorForm}>
                <input type="hidden" name="outing_id" value={data.outing.id}/><input type="hidden" name="position_id" value={position.id}/>
                <div className={styles.formGrid}>
                  <label><span>Tipo</span><select name="position_code" defaultValue={position.position_code} disabled={!canEdit}><OptionSet options={POSITION_OPTIONS} value={position.position_code}/></select></label>
                  <label><span>Estado</span><select name="status" defaultValue={position.status} disabled={!canEdit}><OptionSet options={STATUS_OPTIONS} value={position.status}/></select></label>
                  <label className={styles.fieldWide}><span>Etiqueta visible</span><input name="position_label" defaultValue={position.position_label || ''} placeholder="Salida hasta plaza del Cabildo" disabled={!canEdit}/></label>
                  <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" defaultValue={position.notes || ''} disabled={!canEdit}/></label>
                </div>
                <div className={styles.formActions}><small>Momento #{position.sequence_no}</small><button className={styles.primaryButton} disabled={!canEdit}>Guardar momento</button></div>
              </form>

              <div className={editorStyles.assignmentList}>
                {position.assignments.map((assignment) => (
                  <div className={editorStyles.assignment} key={assignment.id}>
                    <div className={editorStyles.assignmentTop}><div><strong>{assignment.bandName}</strong><p>{[assignment.segment_start_label, assignment.segment_end_label].filter(Boolean).join(' → ') || assignment.participation_mode}</p></div><span className={editorStyles.statusPill} data-status={assignment.status}>{assignment.status}</span></div>
                    <form action={updateMusicAssignmentAction} className={styles.editorForm}>
                      <input type="hidden" name="outing_id" value={data.outing.id}/><input type="hidden" name="position_id" value={position.id}/><input type="hidden" name="assignment_id" value={assignment.id}/>
                      <div className={styles.formGrid}>
                        <label><span>Banda relacionada</span><select name="band_entity_id" defaultValue={assignment.band_entity_id || ''} disabled={!canEdit}><option value="">Sin ficha relacionada</option>{data.bands.map((band) => <option value={band.id} key={band.id}>{band.name}</option>)}</select></label>
                        <label><span>Nombre literal</span><input name="band_name_text" defaultValue={assignment.band_name_text || ''} disabled={!canEdit}/></label>
                        <label><span>Participación</span><select name="participation_mode" defaultValue={assignment.participation_mode} disabled={!canEdit}><OptionSet options={MODE_OPTIONS} value={assignment.participation_mode}/></select></label>
                        <label><span>Estado</span><select name="status" defaultValue={assignment.status} disabled={!canEdit}><OptionSet options={STATUS_OPTIONS} value={assignment.status}/></select></label>
                        <label><span>Desde</span><input name="segment_start_label" defaultValue={assignment.segment_start_label || ''} disabled={!canEdit}/></label>
                        <label><span>Hasta</span><input name="segment_end_label" defaultValue={assignment.segment_end_label || ''} disabled={!canEdit}/></label>
                        <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" defaultValue={assignment.notes || ''} disabled={!canEdit}/></label>
                      </div>
                      <div className={styles.formActions}><span>{canEdit && assignment.status !== 'archived' ? <button formAction={archiveMusicAssignmentAction} className={editorStyles.tinyButton}>Archivar formación</button> : null}</span><button className={styles.primaryButton} disabled={!canEdit}>Guardar formación</button></div>
                    </form>
                  </div>
                ))}
              </div>

              {position.status !== 'archived' ? <form action={createMusicAssignmentAction} className={`${styles.editorForm}`}>
                <input type="hidden" name="outing_id" value={data.outing.id}/><input type="hidden" name="position_id" value={position.id}/>
                <h3 className={editorStyles.formSubhead}>Añadir formación</h3>
                <div className={styles.formGrid}>
                  <label><span>Banda relacionada</span><select name="band_entity_id" defaultValue="" disabled={!canEdit}><option value="">Sin ficha relacionada</option>{data.bands.map((band) => <option value={band.id} key={band.id}>{band.name}</option>)}</select></label>
                  <label><span>Nombre literal</span><input name="band_name_text" placeholder="Obligatorio si no seleccionas Banda" disabled={!canEdit}/></label>
                  <label><span>Participación</span><select name="participation_mode" defaultValue="unspecified" disabled={!canEdit}><OptionSet options={MODE_OPTIONS}/></select></label>
                  <label><span>Estado</span><select name="status" defaultValue="published" disabled={!canEdit}><OptionSet options={STATUS_OPTIONS}/></select></label>
                  <label><span>Desde</span><input name="segment_start_label" disabled={!canEdit}/></label><label><span>Hasta</span><input name="segment_end_label" disabled={!canEdit}/></label>
                  <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" disabled={!canEdit}/></label>
                </div>
                <div className={styles.formActions}><small>Se añadirá al final de este momento.</small><button className={styles.primaryButton} disabled={!canEdit}>Añadir formación</button></div>
              </form> : null}
            </div>
          </article>
        ))}</div> : <div className={editorStyles.empty}>Todavía no hay momentos musicales.</div>}
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Nuevo momento</span><h2>Añadir bloque musical</h2></div></div>
        <form action={createMusicPositionAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="outing_id" value={data.outing.id}/>
          <div className={styles.formGrid}>
            <label><span>Tipo</span><select name="position_code" defaultValue="processional_music" disabled={!canEdit}><OptionSet options={POSITION_OPTIONS}/></select></label>
            <label><span>Estado</span><select name="status" defaultValue="published" disabled={!canEdit}><OptionSet options={STATUS_OPTIONS}/></select></label>
            <label className={styles.fieldWide}><span>Etiqueta visible</span><input name="position_label" placeholder="Procesión triunfal tras la misa" disabled={!canEdit}/></label>
            <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" disabled={!canEdit}/></label>
          </div>
          <div className={styles.formActions}><small>Después podrás añadir una o varias formaciones.</small><button className={styles.primaryButton} disabled={!canEdit}>Añadir momento musical</button></div>
        </form>
      </section>
    </div>
  )
}

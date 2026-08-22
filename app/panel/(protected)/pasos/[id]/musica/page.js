import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import { PeriodFields, SaveBar, StatusSelect, STATUS_LABELS } from '@/components/panel/step/StepEditorPrimitives'
import { requirePanelUser } from '@/lib/panel/auth'
import { getStepEditorData } from '@/lib/panel/steps'
import { archiveStepMusicAction, saveStepMusicAction } from '../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Música · Paso · Panel' }

export default async function StepMusicPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getStepEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const { entity } = data
  const returnPath = `/panel/pasos/${entity.id}/musica`

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/pasos">Pasos</Link><span>→</span><Link href={`/panel/pasos/${entity.id}`}>{entity.name}</Link><span>→</span><strong>Música</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Acompañamiento</span><h1>Música del paso</h1><p>Bandas, Hermandad, posición, salida y periodos actuales o históricos.</p></div>
          {entity.status === 'published' && entity.slug ? <Link className={styles.secondaryButton} href={`/pasos/${entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Acompañamiento musical actualizado correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Acompañamiento</span><h2>Periodos musicales</h2></div><p>{data.musicPeriods.length} acompañamiento{data.musicPeriods.length === 1 ? '' : 's'} registrado{data.musicPeriods.length === 1 ? '' : 's'}.</p></div>
        <div className={styles.editorStack}>
          {data.musicPeriods.map((item) => (
            <article className={styles.editorItem} key={item.id}>
              <div className={styles.itemHeading}>
                <div><span className={styles.eyebrow}>{item.is_current ? 'Actual' : 'Histórico'}</span><h3>{item.band?.name || 'Banda no disponible'}</h3><p>{[item.position, item.outing_type].filter(Boolean).join(' · ')}</p></div>
                <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span>
              </div>
              {canEdit ? (
                <form action={saveStepMusicAction} className={styles.editorForm}>
                  <input type="hidden" name="step_id" value={entity.id} /><input type="hidden" name="period_id" value={item.id} />
                  <div className={styles.formGrid}>
                    <EntityPicker className={styles.fieldWide} name="band_entity_id" items={data.bandOptions} label="Banda" defaultValue={item.band_entity_id} />
                    <EntityPicker className={styles.fieldWide} name="brotherhood_entity_id" items={data.brotherhoodOptions} label="Hermandad" defaultValue={item.brotherhood_entity_id} />
                    <label><span>Ubicación</span><input name="position" defaultValue={item.position} required /></label>
                    <label><span>Jornada o salida</span><input name="outing_type" defaultValue={item.outing_type || ''} /></label>
                    <PeriodFields item={item} />
                    <label className={styles.checkField}><input name="is_current" type="checkbox" defaultChecked={item.is_current} /><span>Acompañamiento actual</span></label>
                    <label><span>Estado editorial</span><StatusSelect defaultValue={item.status} /></label>
                    <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" defaultValue={item.notes || ''} rows="2" /></label>
                  </div>
                  <SaveBar label="Guardar acompañamiento" canEdit note="Este vínculo se refleja en Paso, Banda y Hermandad cuando está publicado." />
                </form>
              ) : null}
              <RelationSourcesEditor relationKind="music_accompaniment_period" relationId={item.id} contextEntityId={entity.id} sourceOptions={data.sourceOptions} links={item.sourceLinks || []} returnPath={returnPath} canEdit={canEdit} />
              {canEdit ? <form action={archiveStepMusicAction} className={styles.archiveForm}><input type="hidden" name="step_id" value={entity.id} /><input type="hidden" name="period_id" value={item.id} /><button type="submit">Archivar acompañamiento</button></form> : null}
            </article>
          ))}

          {canEdit ? (
            <article className={styles.editorItem}>
              <div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva relación</span><h3>Añadir acompañamiento musical</h3></div></div>
              <form action={saveStepMusicAction} className={styles.editorForm}>
                <input type="hidden" name="step_id" value={entity.id} />
                <div className={styles.formGrid}>
                  <EntityPicker className={styles.fieldWide} name="band_entity_id" items={data.bandOptions} label="Banda" placeholder="Buscar formación…" emptyLabel="Selecciona una Banda" />
                  <EntityPicker className={styles.fieldWide} name="brotherhood_entity_id" items={data.brotherhoodOptions} label="Hermandad" placeholder="Buscar Hermandad…" emptyLabel="Selecciona una Hermandad" />
                  <label><span>Ubicación</span><input name="position" placeholder="Tras el paso" required /></label>
                  <label><span>Jornada o salida</span><input name="outing_type" placeholder="Miércoles Santo, procesión de gloria…" /></label>
                  <PeriodFields />
                  <label className={styles.checkField}><input name="is_current" type="checkbox" defaultChecked /><span>Acompañamiento actual</span></label>
                  <label><span>Estado editorial</span><StatusSelect defaultValue="draft" /></label>
                  <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" /></label>
                </div>
                <SaveBar label="Añadir acompañamiento" canEdit note="Indica al menos año, fecha o datación textual de inicio." />
              </form>
            </article>
          ) : null}
        </div>
      </section>
    </div>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import { MARCH_SAVED_MESSAGES, STATUS_LABELS, StatusSelect } from '@/components/panel/march/MarchEditorPrimitives'
import { requirePanelUser } from '@/lib/panel/auth'
import { getMarchEditorData } from '@/lib/panel/marches'
import { archiveMarchDedicationAction, saveMarchDedicationAction } from '../../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Dedicatorias de Marcha · Panel' }

function targetHref(dedication) {
  if (!dedication?.dedicatee) return null
  if (dedication.dedicatee.entity_type === 'brotherhood') return `/panel/hermandades/${dedication.dedicatee.id}`
  if (dedication.dedicatee.entity_type === 'image') return `/panel/imagenes/${dedication.dedicatee.id}`
  return null
}

export default async function MarchDedicationsPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getMarchEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = MARCH_SAVED_MESSAGES[query?.saved]
  const returnPath = `/panel/marchas/${id}/dedicatorias`

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/marchas">Marchas</Link><span>→</span><Link href={`/panel/marchas/${id}`}>{data.entity.name}</Link><span>→</span><strong>Dedicatorias</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Vínculo devocional</span><h1>Dedicatorias</h1><p>{data.entity.name}</p></div>
          <span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>{STATUS_LABELS[data.entity.status]}</span>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Patrimonio musical</span><h2>Hermandades e Imágenes vinculadas</h2></div><p>La dedicatoria alimenta el patrimonio musical de cada entidad y conserva su propia documentación.</p></div>
        <div className={styles.editorStack}>
          {data.dedications.map((dedication) => {
            const href = targetHref(dedication)
            return (
              <article className={styles.editorItem} key={dedication.id}>
                <div className={styles.itemHeading}>
                  <div><span className={styles.eyebrow}>{dedication.dedicatee?.entity_type === 'image' ? 'Imagen' : 'Hermandad'}</span><h3>{dedication.dedicatee?.name || 'Entidad no disponible'}</h3></div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span className={`${styles.statusBadge} ${styles[dedication.status]}`}>{STATUS_LABELS[dedication.status]}</span>
                    {href ? <Link className={styles.secondaryButton} href={href}>Abrir entidad</Link> : null}
                  </div>
                </div>
                {canEdit ? (
                  <form action={saveMarchDedicationAction} className={styles.editorForm}>
                    <input type="hidden" name="march_id" value={id} /><input type="hidden" name="dedication_id" value={dedication.id} /><input type="hidden" name="dedication_type" value="dedicated_to" />
                    <div className={styles.formGrid}>
                      <EntityPicker className={styles.fieldWide} name="dedicatee_entity_id" items={data.dedicateeOptions} label="Dedicada a" defaultValue={dedication.dedicatee_entity_id} />
                      <label className={styles.fieldWide}><span>Texto de dedicatoria</span><input name="dedication_text" defaultValue={dedication.dedication_text || ''} /></label>
                      <label><span>Estado</span><StatusSelect defaultValue={dedication.status} /></label>
                      <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" defaultValue={dedication.notes || ''} /></label>
                    </div>
                    <div className={styles.formActions}><small>La relación sigue apuntando a una Hermandad o Imagen existente.</small><button className={styles.secondaryButton} type="submit">Guardar dedicatoria</button></div>
                  </form>
                ) : null}
                <RelationSourcesEditor relationKind="march_dedication" relationId={dedication.id} contextEntityId={id} sourceOptions={data.sourceOptions} links={dedication.sourceLinks || []} returnPath={returnPath} canEdit={canEdit} />
                {canEdit ? <form action={archiveMarchDedicationAction} className={styles.archiveForm}><input type="hidden" name="march_id" value={id} /><input type="hidden" name="dedication_id" value={dedication.id} /><button type="submit">Archivar dedicatoria</button></form> : null}
              </article>
            )
          })}

          {canEdit ? (
            <form action={saveMarchDedicationAction} className={`${styles.editorItem} ${styles.editorForm}`}>
              <input type="hidden" name="march_id" value={id} /><input type="hidden" name="dedication_type" value="dedicated_to" />
              <div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva dedicatoria</span><h3>Relacionar con Hermandad o Imagen</h3></div></div>
              <div className={styles.formGrid}>
                <EntityPicker className={styles.fieldWide} name="dedicatee_entity_id" items={data.dedicateeOptions} label="Dedicada a" emptyLabel="Selecciona una Hermandad o Imagen" />
                <label className={styles.fieldWide}><span>Texto de dedicatoria</span><input name="dedication_text" /></label>
                <label><span>Estado</span><StatusSelect defaultValue="published" /></label>
                <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" /></label>
              </div>
              <div className={styles.formActions}><small>Una Marcha puede tener varias dedicatorias documentadas.</small><button className={styles.primaryButton} type="submit">Añadir dedicatoria</button></div>
            </form>
          ) : null}
        </div>
      </section>
    </div>
  )
}

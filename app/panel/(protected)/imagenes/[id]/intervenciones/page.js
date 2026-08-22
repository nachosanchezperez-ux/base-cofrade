import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import { requirePanelUser } from '@/lib/panel/auth'
import { getImageInterventionsData } from '@/lib/panel/image-interventions'
import {
  createImageInterventionAction,
  updateImageInterventionAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Intervenciones · Panel' }

function InterventionFields({ item = null, agentOptions, allowReview = false }) {
  return (
    <div className={styles.formGrid}>
      <label><span>Disciplina</span><input name="discipline" required defaultValue={item?.discipline || ''} placeholder="Restauración, escultura…" /></label>
      <label><span>Tipo de intervención</span><input name="intervention_type" defaultValue={item?.intervention_type || ''} placeholder="Restauración, reforma, limpieza…" /></label>
      <EntityPicker className={styles.fieldWide} name="agent_entity_id" items={agentOptions} label="Responsable identificado (opcional)" emptyLabel="Responsable desconocido" required={false} defaultValue={item?.agent_entity_id || ''} />
      <label><span>Cronología inicial</span><input name="date_from_text" defaultValue={item?.date_from_text || ''} placeholder="Ej. 1988" /></label>
      <label><span>Cronología final</span><input name="date_to_text" defaultValue={item?.date_to_text || ''} placeholder="Opcional" /></label>
      <label className={styles.fieldWide}><span>Descripción</span><textarea name="description" defaultValue={item?.description || ''} rows="3" placeholder="Qué se documenta de la intervención" /></label>
      <label>
        <span>Estado editorial</span>
        <select name="status" defaultValue={item?.status || 'draft'}>
          <option value="draft">Borrador</option>
          {allowReview ? <option value="review">En revisión</option> : null}
          <option value="published">Publicado</option>
        </select>
      </label>
    </div>
  )
}

export default async function ImageInterventionsPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getImageInterventionsData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const returnPath = `/panel/imagenes/${data.entity.id}/intervenciones`

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/imagenes">Imágenes</Link><span>→</span>
          <Link href={`/panel/imagenes/${data.entity.id}`}>{data.entity.name}</Link><span>→</span>
          <strong>Intervenciones</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Patrimonio documentado</span><h1>Intervenciones</h1><p>{data.entity.name}</p></div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      {canEdit ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>Nueva intervención</span><h2>Registrar hecho documentado</h2></div>
            <p>El responsable puede quedar sin identificar. No se crea ningún Agente ficticio.</p>
          </div>
          <form action={createImageInterventionAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <input type="hidden" name="image_id" value={data.entity.id} />
            <InterventionFields agentOptions={data.agentOptions} />
            <div className={styles.formActions}><small>Si el responsable se identifica después, se actualizará esta misma intervención.</small><button className={styles.primaryButton} type="submit">Guardar intervención</button></div>
          </form>
        </section>
      ) : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Histórico</span><h2>Intervenciones registradas</h2></div>
          <p>{data.interventions.length} registro{data.interventions.length === 1 ? '' : 's'}.</p>
        </div>
        <div style={{ display: 'grid', gap: 14 }}>
          {data.interventions.length ? data.interventions.map((item) => (
            <article className={styles.panelCard} key={item.id}>
              {canEdit ? (
                <form action={updateImageInterventionAction} className={styles.editorForm}>
                  <input type="hidden" name="image_id" value={data.entity.id} />
                  <input type="hidden" name="intervention_id" value={item.id} />
                  <div>
                    <span className={styles.eyebrow}>Intervención existente</span>
                    <h3>{item.agent?.name || 'Responsable desconocido'}</h3>
                    <p className={styles.emptyText}>{item.intervention_type || item.discipline} · {[item.date_from_text, item.date_to_text].filter(Boolean).join(' → ') || 'Fecha por documentar'}</p>
                  </div>
                  <InterventionFields item={item} agentOptions={data.agentOptions} allowReview />
                  <div className={styles.formActions}><small>Guarda sobre este mismo registro; no crea una intervención nueva.</small><button className={styles.primaryButton} type="submit">Guardar cambios</button></div>
                </form>
              ) : (
                <>
                  <span className={styles.eyebrow}>{item.intervention_type || item.discipline}</span>
                  <h3>{item.agent?.name || 'Responsable desconocido'}</h3>
                  <p className={styles.emptyText}>{[item.date_from_text, item.date_to_text].filter(Boolean).join(' → ') || 'Fecha por documentar'}{item.description ? ` · ${item.description}` : ''}</p>
                  <small>Estado: {item.status}</small>
                </>
              )}

              <RelationSourcesEditor
                relationKind="heritage_intervention"
                relationId={item.id}
                contextEntityId={data.entity.id}
                sourceOptions={data.sourceOptions}
                links={item.sourceLinks || []}
                returnPath={returnPath}
                canEdit={canEdit}
              />
            </article>
          )) : <p className={styles.emptyText}>Todavía no hay intervenciones registradas.</p>}
        </div>
      </section>
    </div>
  )
}

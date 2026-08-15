import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import { requirePanelUser } from '@/lib/panel/auth'
import { getImageInterventionsData } from '@/lib/panel/image-interventions'
import {
  createImageInterventionAction,
  updateInterventionAgentAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Intervenciones · Panel' }

export default async function ImageInterventionsPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getImageInterventionsData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)

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
            <div className={styles.formGrid}>
              <label><span>Disciplina</span><input name="discipline" required placeholder="Restauración, escultura…" /></label>
              <label><span>Tipo de intervención</span><input name="intervention_type" placeholder="Restauración, reforma, limpieza…" /></label>
              <EntityPicker className={styles.fieldWide} name="agent_entity_id" items={data.agentOptions} label="Responsable identificado (opcional)" emptyLabel="Responsable desconocido" required={false} />
              <label><span>Fecha inicial</span><input name="date_from_text" placeholder="Ej. 1819" /></label>
              <label><span>Fecha final</span><input name="date_to_text" placeholder="Opcional" /></label>
              <label className={styles.fieldWide}><span>Descripción</span><textarea name="description" rows="3" placeholder="Qué se documenta de la intervención" /></label>
              <label><span>Estado</span><select name="status" defaultValue="draft"><option value="draft">Borrador</option><option value="published">Publicado</option></select></label>
            </div>
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
              <span className={styles.eyebrow}>{item.intervention_type || item.discipline}</span>
              <h3>{item.agent?.name || 'Responsable desconocido'}</h3>
              <p className={styles.emptyText}>{[item.date_from_text, item.date_to_text].filter(Boolean).join(' → ') || 'Fecha por documentar'}{item.description ? ` · ${item.description}` : ''}</p>
              <small>Estado: {item.status}</small>
              {canEdit ? (
                <form action={updateInterventionAgentAction} className={styles.editorForm} style={{ marginTop: 14 }}>
                  <input type="hidden" name="image_id" value={data.entity.id} />
                  <input type="hidden" name="intervention_id" value={item.id} />
                  <EntityPicker name="agent_entity_id" items={data.agentOptions} label="Responsable" emptyLabel="Responsable desconocido" required={false} defaultValue={item.agent_entity_id || ''} />
                  <div className={styles.formActions}><small>Actualiza el mismo hecho; no crea una intervención nueva.</small><button type="submit">Actualizar responsable</button></div>
                </form>
              ) : null}
            </article>
          )) : <p className={styles.emptyText}>Todavía no hay intervenciones registradas.</p>}
        </div>
      </section>
    </div>
  )
}

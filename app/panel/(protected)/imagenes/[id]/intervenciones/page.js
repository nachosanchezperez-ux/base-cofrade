import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import { requirePanelUser } from '@/lib/panel/auth'
import { getImageInterventionsData } from '@/lib/panel/image-interventions'
import { archiveImageInterventionAction, createImageInterventionAction } from './actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Intervenciones de Imagen · Panel' }

export default async function ImageInterventionsPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getImageInterventionsData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const canPublish = user.role === 'admin'
  const returnPath = `/panel/imagenes/${data.entity.id}/intervenciones`

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/imagenes">Imágenes</Link><span>→</span><Link href={`/panel/imagenes/${data.entity.id}`}>{data.entity.name}</Link><span>→</span><strong>Intervenciones</strong></div>
        <div className={styles.editorTitleRow}><div><span className={styles.eyebrow}>Patrimonio documentado</span><h1>Intervenciones</h1><p>{data.entity.name}</p></div><span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>{data.entity.status}</span></div>
      </header>
      {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      {canEdit ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Nuevo hecho documentado</span><h2>Añadir intervención</h2></div><p>El responsable puede quedar sin identificar; no es necesario crear un Agente ficticio.</p></div>
          <form action={createImageInterventionAction} className={`${styles.panelCard} ${styles.editorForm}`}>
            <input type="hidden" name="image_id" value={data.entity.id} />
            <div className={styles.formGrid}>
              <label><span>Disciplina</span><input name="discipline" required placeholder="Restauración, escultura…" /></label>
              <label><span>Tipo de intervención</span><input name="intervention_type" placeholder="Restauración, reforma, limpieza…" /></label>
              <EntityPicker className={styles.fieldWide} name="agent_entity_id" items={data.agentOptions} label="Responsable identificado (opcional)" placeholder="Buscar Agente…" emptyLabel="Responsable no identificado" required={false} />
              <label><span>Fecha / periodo inicial</span><input name="date_from_text" placeholder="Ej. 1819 o 1983/1984" /></label>
              <label><span>Fecha / periodo final</span><input name="date_to_text" placeholder="Opcional" /></label>
              <label><span>Elemento</span><input name="element_name" placeholder="Opcional" /></label>
              <label><span>Fase</span><input name="phase" placeholder="Opcional" /></label>
              <label className={styles.fieldWide}><span>Descripción</span><textarea name="description" rows="3" placeholder="Qué se documenta de la intervención" /></label>
              <label><span>Estado</span><select name="status" defaultValue="draft"><option value="draft">Borrador</option>{canPublish ? <option value="published">Publicado</option> : null}</select></label>
            </div>
            <div className={styles.formActions}><small>Si el responsable se identifica después, el mismo hecho podrá enlazarse con el Agente correspondiente.</small><button className={styles.primaryButton} type="submit">Guardar intervención</button></div>
          </form>
        </section>
      ) : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Histórico</span><h2>Intervenciones registradas</h2></div><p>{data.interventions.length} registros activos.</p></div>
        <div style={{ display: 'grid', gap: 16 }}>
          {data.interventions.length ? data.interventions.map((item) => (
            <article className={styles.panelCard} key={item.id}>
              <span className={styles.eyebrow}>{item.intervention_type || item.discipline}</span><h3>{item.agent?.name || 'Responsable no identificado'}</h3>
              <p className={styles.emptyText}>{[item.date_from_text, item.date_to_text].filter(Boolean).join(' → ') || 'Fecha pendiente de documentar'}{item.description ? ` · ${item.description}` : ''}</p><small>Estado: {item.status}</small>
              <RelationSourcesEditor relationKind="intervention" relationId={item.id} contextEntityId={data.entity.id} sourceOptions={data.sourceOptions} links={item.sourceLinks} returnPath={returnPath} canEdit={canEdit} />
              {canEdit ? <form action={archiveImageInterventionAction} style={{ marginTop: 14 }}><input type="hidden" name="image_id" value={data.entity.id} /><input type="hidden" name="intervention_id" value={item.id} /><button type="submit">Archivar intervención</button></form> : null}
            </article>
          )) : <p className={styles.emptyText}>Todavía no hay intervenciones documentadas.</p>}
        </div>
      </section>
    </div>
  )
}

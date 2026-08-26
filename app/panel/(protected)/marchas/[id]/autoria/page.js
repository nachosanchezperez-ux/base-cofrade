import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import { MARCH_SAVED_MESSAGES, STATUS_LABELS, StatusSelect } from '@/components/panel/march/MarchEditorPrimitives'
import { requirePanelUser } from '@/lib/panel/auth'
import { getMarchEditorData } from '@/lib/panel/marches'
import { archiveMarchAuthorAction, saveMarchAuthorAction } from '../../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Autoría de Marcha · Panel' }

export default async function MarchAuthorshipPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getMarchEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const savedMessage = MARCH_SAVED_MESSAGES[query?.saved]
  const returnPath = `/panel/marchas/${id}/autoria`

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/marchas">Marchas</Link><span>→</span><Link href={`/panel/marchas/${id}`}>{data.entity.name}</Link><span>→</span><strong>Autoría</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Creación musical</span><h1>Compositores y adaptadores</h1><p>{data.entity.name}</p></div>
          <span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>{STATUS_LABELS[data.entity.status]}</span>
        </div>
      </header>

      {savedMessage ? <div className={styles.savedNotice} role="status">{savedMessage}</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Autoría estructurada</span><h2>Responsables de la obra</h2></div><p>Relaciona Personas existentes y documenta composición, adaptación o instrumentación sin duplicar autores.</p></div>
        <div className={styles.editorStack}>
          {data.authors.map((author) => (
            <article className={styles.editorItem} key={author.id}>
              <div className={styles.itemHeading}>
                <div><span className={styles.eyebrow}>{author.author_role === 'adapter' ? 'Adaptación' : 'Composición'}</span><h3>{author.agent?.name || 'Agente no disponible'}</h3></div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className={`${styles.statusBadge} ${styles[author.status]}`}>{STATUS_LABELS[author.status]}</span>
                  {author.agent_entity_id ? <Link className={styles.secondaryButton} href={`/panel/agentes/${author.agent_entity_id}`}>Abrir Persona</Link> : null}
                </div>
              </div>
              {canEdit ? (
                <form action={saveMarchAuthorAction} className={styles.editorForm}>
                  <input type="hidden" name="march_id" value={id} /><input type="hidden" name="author_id" value={author.id} />
                  <div className={styles.formGrid}>
                    <EntityPicker className={styles.fieldWide} name="agent_entity_id" items={data.agentOptions} label="Autor" defaultValue={author.agent_entity_id} />
                    <label><span>Papel</span><select name="author_role" defaultValue={author.author_role}><option value="composer">Compositor</option><option value="adapter">Adaptador / instrumentador</option></select></label>
                    <label><span>Estado</span><StatusSelect defaultValue={author.status} /></label>
                    <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" defaultValue={author.notes || ''} /></label>
                  </div>
                  <div className={styles.formActions}><small>Actualiza esta misma autoría; la Persona permanece como nodo independiente.</small><button className={styles.secondaryButton} type="submit">Guardar autoría</button></div>
                </form>
              ) : null}
              <RelationSourcesEditor relationKind="march_author" relationId={author.id} contextEntityId={id} sourceOptions={data.sourceOptions} links={author.sourceLinks || []} returnPath={returnPath} canEdit={canEdit} />
              {canEdit ? <form action={archiveMarchAuthorAction} className={styles.archiveForm}><input type="hidden" name="march_id" value={id} /><input type="hidden" name="author_id" value={author.id} /><button type="submit">Archivar autoría</button></form> : null}
            </article>
          ))}

          {canEdit ? (
            <form action={saveMarchAuthorAction} className={`${styles.editorItem} ${styles.editorForm}`}>
              <input type="hidden" name="march_id" value={id} />
              <div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva autoría</span><h3>Añadir responsable</h3></div></div>
              <div className={styles.formGrid}>
                <EntityPicker className={styles.fieldWide} name="agent_entity_id" items={data.agentOptions} label="Persona / Agente" emptyLabel="Selecciona un autor" />
                <label><span>Papel</span><select name="author_role" defaultValue="composer"><option value="composer">Compositor</option><option value="adapter">Adaptador / instrumentador</option></select></label>
                <label><span>Estado</span><StatusSelect defaultValue="published" /></label>
                <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" /></label>
              </div>
              <div className={styles.formActions}><small>El autor debe existir previamente en Personas para evitar duplicidades.</small><button className={styles.primaryButton} type="submit">Añadir autoría</button></div>
            </form>
          ) : null}
        </div>
      </section>
    </div>
  )
}

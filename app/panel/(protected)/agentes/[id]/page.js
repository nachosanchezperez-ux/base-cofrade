import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { AGENT_KIND_LABELS, getAgentEditorData } from '@/lib/panel/agents'
import { updateAgentAction } from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = {
  published: 'Publicado',
  review: 'En revisión',
  draft: 'Borrador',
  archived: 'Archivado',
}

export const metadata = { title: 'Editar Agente · Panel' }

export default async function AgentEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getAgentEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/agentes">Agentes</Link>
          <span>→</span>
          <strong>{data.entity.name}</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Editar Agente</span>
            <h1>{data.entity.name}</h1>
            <p>{AGENT_KIND_LABELS[data.agent.agent_kind] || 'Agente'}</p>
          </div>
          <span className={`${styles.statusBadge} ${styles[data.entity.status]}`}>
            {STATUS_LABELS[data.entity.status]}
          </span>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando el Agente como colaborador.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div>
            <span className={styles.eyebrow}>Identidad</span>
            <h2>Información básica</h2>
          </div>
          <p>Este editor no gestiona todavía obras, disciplinas, fuentes ni publicación.</p>
        </div>

        <form action={updateAgentAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="agent_id" value={data.entity.id} />
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}>
              <span>Nombre</span>
              <input name="name" defaultValue={data.entity.name} required />
            </label>
            <label>
              <span>Tipo de Agente</span>
              <select name="agent_kind" defaultValue={data.agent.agent_kind} required>
                <option value="person">Persona</option>
                <option value="workshop">Taller</option>
                <option value="company">Empresa</option>
                <option value="institution">Institución</option>
              </select>
            </label>
            <label>
              <span>Slug</span>
              <input name="slug" defaultValue={data.entity.slug || ''} required />
            </label>
          </div>
          <div className={styles.formActions}>
            <small>{canEdit ? 'El estado editorial no cambia al guardar.' : 'Tu perfil tiene acceso de consulta.'}</small>
            {canEdit ? <button className={styles.primaryButton} type="submit">Guardar cambios</button> : null}
          </div>
        </form>
      </section>
    </div>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getAgentEditorData } from '@/lib/panel/agents'
import { PeriodFields } from '@/components/panel/agent/AgentEditorPrimitives'
import { deleteAgentRoleAction, saveAgentRoleAction } from '../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Roles · Persona · Panel' }

export default async function AgentRolesPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getAgentEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/agentes">Personas</Link><span>→</span><Link href={`/panel/agentes/${id}`}>{data.entity.name}</Link><span>→</span><strong>Roles</strong></div>
        <div className={styles.editorTitleRow}><div><span className={styles.eyebrow}>Trayectoria</span><h1>Roles y responsabilidades</h1><p>Funciones documentadas con su periodo, sin reducir la trayectoria a texto plano.</p></div></div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Roles actualizados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Trayectoria</span><h2>Responsabilidades registradas</h2></div><p>{data.roles.length} rol{data.roles.length === 1 ? '' : 'es'} documentado{data.roles.length === 1 ? '' : 's'}.</p></div>
        <div className={styles.editorStack}>
          {data.roles.map((item) => (
            <article className={styles.editorItem} key={item.id}>
              <form action={saveAgentRoleAction} className={styles.editorForm}>
                <input type="hidden" name="agent_id" value={data.entity.id} />
                <input type="hidden" name="role_id" value={item.id} />
                <div className={styles.formGrid}>
                  <label className={styles.fieldWide}><span>Rol</span><input name="role_name" defaultValue={item.role_name} required /></label>
                  <PeriodFields item={item} />
                  <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" defaultValue={item.notes || ''} rows="2" /></label>
                </div>
                {canEdit ? <div className={styles.formActions}><span /><button className={styles.secondaryButton} type="submit">Guardar rol</button></div> : null}
              </form>
              {canEdit ? <form action={deleteAgentRoleAction} className={styles.archiveForm}><input type="hidden" name="agent_id" value={data.entity.id} /><input type="hidden" name="role_id" value={item.id} /><button type="submit">Retirar rol</button></form> : null}
            </article>
          ))}

          {canEdit ? (
            <article className={styles.editorItem}>
              <div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva responsabilidad</span><h3>Añadir rol</h3></div></div>
              <form action={saveAgentRoleAction} className={styles.editorForm}>
                <input type="hidden" name="agent_id" value={data.entity.id} />
                <div className={styles.formGrid}>
                  <label className={styles.fieldWide}><span>Nuevo rol</span><input name="role_name" required placeholder="Capataz, director musical, hermano mayor…" /></label>
                  <PeriodFields />
                  <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" /></label>
                </div>
                <div className={styles.formActions}><span /><button className={styles.primaryButton} type="submit">Añadir rol</button></div>
              </form>
            </article>
          ) : null}
        </div>
      </section>
    </div>
  )
}

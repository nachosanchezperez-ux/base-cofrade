import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getAgentEditorData } from '@/lib/panel/agents'
import { deleteAgentDisciplineAction, saveAgentDisciplineAction } from '../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Disciplinas · Persona · Panel' }

export default async function AgentDisciplinesPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getAgentEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/agentes">Personas</Link><span>→</span><Link href={`/panel/agentes/${id}`}>{data.entity.name}</Link><span>→</span><strong>Disciplinas</strong></div>
        <div className={styles.editorTitleRow}><div><span className={styles.eyebrow}>Especialización</span><h1>Disciplinas</h1><p>Especialidades que permiten relacionar la persona o taller con su obra.</p></div></div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Disciplinas actualizadas correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Especialidades</span><h2>Disciplinas registradas</h2></div><p>{data.disciplines.length} disciplina{data.disciplines.length === 1 ? '' : 's'}.</p></div>
        <div className={styles.editorStack}>
          {data.disciplines.map((item) => (
            <article className={styles.editorItem} key={item.id}>
              <form action={saveAgentDisciplineAction} className={styles.editorForm}>
                <input type="hidden" name="agent_id" value={data.entity.id} />
                <input type="hidden" name="discipline_id" value={item.id} />
                <div className={styles.formGrid}>
                  <label className={styles.fieldWide}><span>Disciplina</span><input name="discipline" defaultValue={item.discipline} required /></label>
                  <label className={styles.checkField}><input name="is_primary" type="checkbox" defaultChecked={item.is_primary} /><span>Disciplina principal</span></label>
                  <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" defaultValue={item.notes || ''} rows="2" /></label>
                </div>
                {canEdit ? <div className={styles.formActions}><span /><button className={styles.secondaryButton} type="submit">Guardar disciplina</button></div> : null}
              </form>
              {canEdit ? <form action={deleteAgentDisciplineAction} className={styles.archiveForm}><input type="hidden" name="agent_id" value={data.entity.id} /><input type="hidden" name="discipline_id" value={item.id} /><button type="submit">Retirar disciplina</button></form> : null}
            </article>
          ))}

          {canEdit ? (
            <article className={styles.editorItem}>
              <div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva especialidad</span><h3>Añadir disciplina</h3></div></div>
              <form action={saveAgentDisciplineAction} className={styles.editorForm}>
                <input type="hidden" name="agent_id" value={data.entity.id} />
                <div className={styles.formGrid}>
                  <label className={styles.fieldWide}><span>Nueva disciplina</span><input name="discipline" required placeholder="Imaginería, talla, bordado, composición…" /></label>
                  <label className={styles.checkField}><input name="is_primary" type="checkbox" /><span>Disciplina principal</span></label>
                  <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" /></label>
                </div>
                <div className={styles.formActions}><span /><button className={styles.primaryButton} type="submit">Añadir disciplina</button></div>
              </form>
            </article>
          ) : null}
        </div>
      </section>
    </div>
  )
}

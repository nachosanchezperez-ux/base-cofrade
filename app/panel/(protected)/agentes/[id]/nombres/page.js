import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getAgentEditorData } from '@/lib/panel/agents'
import { NAME_TYPES, PeriodFields } from '@/components/panel/agent/AgentEditorPrimitives'
import { deleteAgentNameAction, saveAgentNameAction } from '../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Nombres · Persona · Panel' }

export default async function AgentNamesPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getAgentEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/agentes">Personas</Link><span>→</span><Link href={`/panel/agentes/${id}`}>{data.entity.name}</Link><span>→</span><strong>Nombres</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Identidad histórica</span><h1>Nombres y denominaciones</h1><p>Alias, nombres comerciales, artísticos y anteriores con su contexto temporal.</p></div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Nombres actualizados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Denominaciones</span><h2>Nombres registrados</h2></div><p>{data.names.length} nombre{data.names.length === 1 ? '' : 's'} documentado{data.names.length === 1 ? '' : 's'}.</p></div>
        <div className={styles.editorStack}>
          {data.names.map((item) => (
            <article className={styles.editorItem} key={item.id}>
              <form action={saveAgentNameAction} className={styles.editorForm}>
                <input type="hidden" name="agent_id" value={data.entity.id} />
                <input type="hidden" name="name_id" value={item.id} />
                <div className={styles.formGrid}>
                  <label className={styles.fieldWide}><span>Nombre</span><input name="alternate_name" defaultValue={item.name} required /></label>
                  <label><span>Tipo</span><select name="name_type" defaultValue={item.name_type}>{NAME_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                  <PeriodFields item={item} />
                  <label className={styles.checkField}><input name="is_current" type="checkbox" defaultChecked={item.is_current} /><span>Nombre vigente</span></label>
                  <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" defaultValue={item.notes || ''} rows="2" /></label>
                </div>
                {canEdit ? <div className={styles.formActions}><span /><button className={styles.secondaryButton} type="submit">Guardar nombre</button></div> : null}
              </form>
              {canEdit ? <form action={deleteAgentNameAction} className={styles.archiveForm}><input type="hidden" name="agent_id" value={data.entity.id} /><input type="hidden" name="name_id" value={item.id} /><button type="submit">Retirar registro de nombre</button></form> : null}
            </article>
          ))}

          {canEdit ? (
            <article className={styles.editorItem}>
              <div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva denominación</span><h3>Añadir nombre</h3></div></div>
              <form action={saveAgentNameAction} className={styles.editorForm}>
                <input type="hidden" name="agent_id" value={data.entity.id} />
                <div className={styles.formGrid}>
                  <label className={styles.fieldWide}><span>Nuevo nombre</span><input name="alternate_name" required /></label>
                  <label><span>Tipo</span><select name="name_type" defaultValue="alias">{NAME_TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                  <PeriodFields />
                  <label className={styles.checkField}><input name="is_current" type="checkbox" /><span>Nombre vigente</span></label>
                  <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" /></label>
                </div>
                <div className={styles.formActions}><span /><button className={styles.primaryButton} type="submit">Añadir nombre</button></div>
              </form>
            </article>
          ) : null}
        </div>
      </section>
    </div>
  )
}

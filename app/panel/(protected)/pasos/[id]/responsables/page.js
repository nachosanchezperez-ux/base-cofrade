import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import { PeriodFields, SaveBar, StatusSelect, STATUS_LABELS } from '@/components/panel/step/StepEditorPrimitives'
import { requirePanelUser } from '@/lib/panel/auth'
import { getStepEditorData } from '@/lib/panel/steps'
import { archiveStepPersonnelAction, saveStepPersonnelAction } from '../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Responsables · Paso · Panel' }

export default async function StepPersonnelPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getStepEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const { entity } = data
  const returnPath = `/panel/pasos/${entity.id}/responsables`

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/pasos">Pasos</Link><span>→</span><Link href={`/panel/pasos/${entity.id}`}>{entity.name}</Link><span>→</span><strong>Responsables</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Equipo del paso</span><h1>Capataces y responsables</h1><p>Periodos actuales e históricos vinculados a Personas existentes.</p></div>
          {entity.status === 'published' && entity.slug ? <Link className={styles.secondaryButton} href={`/pasos/${entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Responsables actualizados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Responsables</span><h2>Periodos documentados</h2></div><p>{data.personnel.length} responsabilidad{data.personnel.length === 1 ? '' : 'es'} registrada{data.personnel.length === 1 ? '' : 's'}.</p></div>
        <div className={styles.editorStack}>
          {data.personnel.map((item) => (
            <article className={styles.editorItem} key={item.id}>
              <div className={styles.itemHeading}>
                <div><span className={styles.eyebrow}>{item.is_current ? 'Actual' : 'Histórico'}</span><h3>{item.agent?.name || 'Persona no disponible'}</h3><p>{item.role_name}</p></div>
                <span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span>
              </div>
              {canEdit ? (
                <form action={saveStepPersonnelAction} className={styles.editorForm}>
                  <input type="hidden" name="step_id" value={entity.id} /><input type="hidden" name="period_id" value={item.id} />
                  <div className={styles.formGrid}>
                    <EntityPicker className={styles.fieldWide} name="agent_entity_id" items={data.agentOptions} label="Persona" defaultValue={item.agent_entity_id} />
                    <label><span>Responsabilidad</span><input name="role_name" defaultValue={item.role_name} required /></label>
                    <PeriodFields item={item} />
                    <label className={styles.checkField}><input name="is_current" type="checkbox" defaultChecked={item.is_current} /><span>Responsabilidad actual</span></label>
                    <label><span>Estado editorial</span><StatusSelect defaultValue={item.status} /></label>
                    <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" defaultValue={item.notes || ''} rows="2" /></label>
                  </div>
                  <SaveBar label="Guardar responsabilidad" canEdit note="Actualiza este mismo periodo; no crea una responsabilidad duplicada." />
                </form>
              ) : null}
              <RelationSourcesEditor relationKind="step_personnel" relationId={item.id} contextEntityId={entity.id} sourceOptions={data.sourceOptions} links={item.sourceLinks || []} returnPath={returnPath} canEdit={canEdit} />
              {canEdit ? <form action={archiveStepPersonnelAction} className={styles.archiveForm}><input type="hidden" name="step_id" value={entity.id} /><input type="hidden" name="period_id" value={item.id} /><button type="submit">Archivar responsabilidad</button></form> : null}
            </article>
          ))}

          {canEdit ? (
            <article className={styles.editorItem}>
              <div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva relación</span><h3>Añadir responsable</h3></div></div>
              <form action={saveStepPersonnelAction} className={styles.editorForm}>
                <input type="hidden" name="step_id" value={entity.id} />
                <div className={styles.formGrid}>
                  <EntityPicker className={styles.fieldWide} name="agent_entity_id" items={data.agentOptions} label="Persona" placeholder="Buscar capataz o profesional…" emptyLabel="Selecciona una Persona" />
                  <label><span>Responsabilidad</span><input name="role_name" placeholder="Capataz" required /></label>
                  <PeriodFields />
                  <label className={styles.checkField}><input name="is_current" type="checkbox" defaultChecked /><span>Responsabilidad actual</span></label>
                  <label><span>Estado editorial</span><StatusSelect defaultValue="draft" /></label>
                  <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" /></label>
                </div>
                <SaveBar label="Añadir responsable" canEdit note="La Persona debe existir previamente para evitar duplicidades." />
              </form>
            </article>
          ) : null}
        </div>
      </section>
    </div>
  )
}

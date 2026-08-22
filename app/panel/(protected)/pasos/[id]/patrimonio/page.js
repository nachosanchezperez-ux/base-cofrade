import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import { SaveBar, StatusSelect, STATUS_LABELS } from '@/components/panel/step/StepEditorPrimitives'
import { requirePanelUser } from '@/lib/panel/auth'
import { getStepEditorData } from '@/lib/panel/steps'
import {
  archiveStepPhaseAction,
  removeStepPhaseAgentAction,
  saveStepPhaseAction,
  saveStepPhaseAgentAction,
} from '../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Patrimonio · Paso · Panel' }

export default async function StepHeritagePage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getStepEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const { entity } = data
  const returnPath = `/panel/pasos/${entity.id}/patrimonio`

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/pasos">Pasos</Link><span>→</span><Link href={`/panel/pasos/${entity.id}`}>{entity.name}</Link><span>→</span><strong>Patrimonio</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Evolución material</span><h1>Patrimonio y evolución</h1><p>Diseño, talla, dorado, bordado, reformas y restauraciones con responsables y Fuentes propias.</p></div>
          {entity.status === 'published' && entity.slug ? <Link className={styles.secondaryButton} href={`/pasos/${entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Patrimonio del paso actualizado correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil tiene acceso de consulta.</div> : null}

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Cronología material</span><h2>Fases patrimoniales</h2></div><p>{data.phases.length} fase{data.phases.length === 1 ? '' : 's'} documentada{data.phases.length === 1 ? '' : 's'}.</p></div>
        <div className={styles.editorStack}>
          {data.phases.map((phase) => (
            <article className={styles.editorItem} key={phase.id}>
              <div className={styles.itemHeading}>
                <div><span className={styles.eyebrow}>{phase.phase_type || 'Fase'}</span><h3>{phase.phase_name}</h3></div>
                <span className={`${styles.statusBadge} ${styles[phase.status]}`}>{STATUS_LABELS[phase.status]}</span>
              </div>
              {canEdit ? (
                <form action={saveStepPhaseAction} className={styles.editorForm}>
                  <input type="hidden" name="step_id" value={entity.id} /><input type="hidden" name="phase_id" value={phase.id} />
                  <div className={styles.formGrid}>
                    <label className={styles.fieldWide}><span>Nombre de la fase</span><input name="phase_name" defaultValue={phase.phase_name} required /></label>
                    <label><span>Tipo</span><input name="phase_type" defaultValue={phase.phase_type || ''} /></label>
                    <label><span>Fecha inicial</span><input name="date_from" type="date" defaultValue={phase.date_from || ''} /></label>
                    <label><span>Datación inicial</span><input name="date_from_text" defaultValue={phase.date_from_text || ''} /></label>
                    <label><span>Fecha final</span><input name="date_to" type="date" defaultValue={phase.date_to || ''} /></label>
                    <label><span>Datación final</span><input name="date_to_text" defaultValue={phase.date_to_text || ''} /></label>
                    <label className={styles.fieldWide}><span>Descripción pública</span><textarea name="description" defaultValue={phase.description || ''} rows="4" /></label>
                    <label><span>Estado editorial</span><StatusSelect defaultValue={phase.status} /></label>
                    <label className={styles.fieldWide}><span>Notas internas</span><textarea name="notes" defaultValue={phase.notes || ''} rows="2" /></label>
                  </div>
                  <SaveBar label="Guardar fase" canEdit note="La fase publicada aparece en la cronología patrimonial del Paso." />
                </form>
              ) : null}

              <div className={styles.panelSubsection}>
                <div className={styles.subsectionHeading}><div><span className={styles.eyebrow}>Autoría</span><h4>Responsables de esta fase</h4></div></div>
                <div className={styles.editorStack}>
                  {phase.responsibles.map((responsible) => (
                    <div className={styles.editorItem} key={responsible.id}>
                      {canEdit ? (
                        <form action={saveStepPhaseAgentAction} className={styles.editorForm}>
                          <input type="hidden" name="step_id" value={entity.id} /><input type="hidden" name="phase_id" value={phase.id} /><input type="hidden" name="phase_agent_id" value={responsible.id} />
                          <div className={styles.formGrid}>
                            <EntityPicker className={styles.fieldWide} name="agent_entity_id" items={data.agentOptions} label="Persona, taller o institución" defaultValue={responsible.agent_entity_id} />
                            <label><span>Disciplina</span><input name="discipline" defaultValue={responsible.discipline} required /></label>
                            <label><span>Papel</span><input name="role_name" defaultValue={responsible.role_name || ''} /></label>
                            <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" defaultValue={responsible.notes || ''} rows="2" /></label>
                          </div>
                          <SaveBar label="Guardar responsable" canEdit note={responsible.agent?.name || 'Responsable de la fase'} />
                        </form>
                      ) : <strong>{responsible.agent?.name || 'Responsable no disponible'}</strong>}
                      {canEdit ? <form action={removeStepPhaseAgentAction} className={styles.archiveForm}><input type="hidden" name="step_id" value={entity.id} /><input type="hidden" name="phase_id" value={phase.id} /><input type="hidden" name="phase_agent_id" value={responsible.id} /><button type="submit">Retirar de esta fase</button></form> : null}
                    </div>
                  ))}
                  {canEdit ? (
                    <form action={saveStepPhaseAgentAction} className={`${styles.editorItem} ${styles.editorForm}`}>
                      <input type="hidden" name="step_id" value={entity.id} /><input type="hidden" name="phase_id" value={phase.id} />
                      <div className={styles.formGrid}>
                        <EntityPicker className={styles.fieldWide} name="agent_entity_id" items={data.agentOptions} label="Añadir responsable" placeholder="Buscar autor, taller, orfebre…" emptyLabel="Selecciona un Agente" />
                        <label><span>Disciplina</span><input name="discipline" placeholder="Diseño, talla, dorado…" required /></label>
                        <label><span>Papel</span><input name="role_name" placeholder="Autor, restaurador…" /></label>
                        <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" /></label>
                      </div>
                      <SaveBar label="Vincular responsable" canEdit note="Relaciona una entidad existente para no duplicar autores." />
                    </form>
                  ) : null}
                </div>
              </div>

              <RelationSourcesEditor relationKind="step_phase" relationId={phase.id} contextEntityId={entity.id} sourceOptions={data.sourceOptions} links={phase.sourceLinks || []} returnPath={returnPath} canEdit={canEdit} />
              {canEdit ? <form action={archiveStepPhaseAction} className={styles.archiveForm}><input type="hidden" name="step_id" value={entity.id} /><input type="hidden" name="phase_id" value={phase.id} /><button type="submit">Archivar fase</button></form> : null}
            </article>
          ))}

          {canEdit ? (
            <article className={styles.editorItem}>
              <div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva fase</span><h3>Añadir etapa patrimonial</h3></div></div>
              <form action={saveStepPhaseAction} className={styles.editorForm}>
                <input type="hidden" name="step_id" value={entity.id} />
                <div className={styles.formGrid}>
                  <label className={styles.fieldWide}><span>Nombre de la fase</span><input name="phase_name" required placeholder="Diseño y talla del canasto" /></label>
                  <label><span>Tipo</span><input name="phase_type" placeholder="Ejecución, reforma, restauración…" /></label>
                  <label><span>Fecha inicial</span><input name="date_from" type="date" /></label>
                  <label><span>Datación inicial</span><input name="date_from_text" placeholder="1945, década de 1970…" /></label>
                  <label><span>Fecha final</span><input name="date_to" type="date" /></label>
                  <label><span>Datación final</span><input name="date_to_text" /></label>
                  <label className={styles.fieldWide}><span>Descripción pública</span><textarea name="description" rows="4" /></label>
                  <label><span>Estado editorial</span><StatusSelect defaultValue="draft" /></label>
                  <label className={styles.fieldWide}><span>Notas internas</span><textarea name="notes" rows="2" /></label>
                </div>
                <SaveBar label="Crear fase" canEdit note="Después de crearla podrás añadir responsables y Fuentes a esta misma fase." />
              </form>
            </article>
          ) : null}
        </div>
      </section>
    </div>
  )
}

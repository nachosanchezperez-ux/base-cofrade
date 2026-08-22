import Link from 'next/link'
import { notFound } from 'next/navigation'
import EntityPicker from '@/components/panel/EntityPicker'
import RelationSourcesEditor from '@/components/panel/RelationSourcesEditor'
import { requirePanelUser } from '@/lib/panel/auth'
import { getStepEditorData } from '@/lib/panel/steps'
import {
  archiveStepMusicAction,
  archiveStepPersonnelAction,
  archiveStepPhaseAction,
  removeStepPhaseAgentAction,
  saveStepMusicAction,
  saveStepPersonnelAction,
  saveStepPhaseAction,
  saveStepPhaseAgentAction,
  updateStepAction,
} from './actions'
import styles from '@/app/panel/panel.module.css'

const STATUS_LABELS = { published: 'Publicado', review: 'En revisión', draft: 'Borrador', archived: 'Archivado' }

export const metadata = { title: 'Editar paso · Panel' }

function StatusSelect({ defaultValue = 'draft' }) {
  return (
    <select name="status" defaultValue={defaultValue}>
      <option value="draft">Borrador</option>
      <option value="review">En revisión</option>
      <option value="published">Publicado</option>
      <option value="archived">Archivado</option>
    </select>
  )
}

function PeriodFields({ item = null }) {
  return (
    <>
      <label><span>Fecha inicial exacta</span><input name="date_from" type="date" defaultValue={item?.date_from || ''} /></label>
      <label><span>Datación inicial</span><input name="date_from_text" defaultValue={item?.date_from_text || ''} placeholder="Ej. 2024, desde 2024…" /></label>
      <label><span>Año inicial</span><input name="year_from" type="number" min="1800" max="2200" defaultValue={item?.year_from ?? ''} /></label>
      <label><span>Fecha final exacta</span><input name="date_to" type="date" defaultValue={item?.date_to || ''} /></label>
      <label><span>Datación final</span><input name="date_to_text" defaultValue={item?.date_to_text || ''} /></label>
      <label><span>Año final</span><input name="year_to" type="number" min="1800" max="2200" defaultValue={item?.year_to ?? ''} /></label>
    </>
  )
}

export default async function StepEditorPage({ params, searchParams }) {
  const [{ id }, query, user] = await Promise.all([params, searchParams, requirePanelUser()])
  const data = await getStepEditorData(id)
  if (!data) notFound()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const { entity, step, coverage } = data
  const returnPath = `/panel/pasos/${entity.id}`

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}><Link href="/panel/pasos">Pasos</Link><span>→</span><strong>{entity.name}</strong></div>
        <div className={styles.editorTitleRow}>
          <div><span className={styles.eyebrow}>Editar paso</span><h1>{entity.name}</h1><p>{step.step_type || 'Tipo de paso pendiente de documentar'}</p></div>
          <div className={styles.editorHeaderActions}>
            <span className={`${styles.statusBadge} ${styles[entity.status]}`}>{STATUS_LABELS[entity.status]}</span>
            {entity.status === 'published' && entity.slug ? <Link className={styles.secondaryButton} href={`/pasos/${entity.slug}`} target="_blank" rel="noreferrer">Ver ficha pública ↗</Link> : null}
          </div>
        </div>
      </header>

      {query?.saved ? <div className={styles.savedNotice} role="status">Cambios guardados correctamente.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Estás consultando el paso como colaborador. Un editor debe realizar los cambios.</div> : null}

      <section className={styles.metricGrid} aria-label="Cobertura de la ficha">
        <article className={styles.metricCard}><span>Multimedia</span><strong>{coverage.media}</strong><small>{coverage.cover ? 'Portada definida' : 'Sin portada'}</small></article>
        <article className={styles.metricCard}><span>Imágenes</span><strong>{coverage.images}</strong><small>vinculadas al paso</small></article>
        <article className={styles.metricCard}><span>Fases patrimoniales</span><strong>{coverage.phases}</strong><small>cronología documentada</small></article>
        <article className={styles.metricCard}><span>Personas / música</span><strong>{coverage.personnel + coverage.music}</strong><small>{coverage.personnel} responsables · {coverage.music} acompañamientos</small></article>
      </section>

      <nav className={styles.sectionTabs} aria-label="Secciones de la ficha del paso">
        <a href="#general">General</a><a href="#personas">Personas</a><a href="#musica">Música</a><a href="#patrimonio">Patrimonio</a><a href="#fuentes">Fuentes</a>
      </nav>

      <section className={styles.editorSection} id="general">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Fuente de verdad</span><h2>Datos del paso</h2></div><p>Configuración actual, datos técnicos y estado editorial que alimentan el Front.</p></div>
        <form action={updateStepAction} className={`${styles.panelCard} ${styles.editorForm}`}>
          <input type="hidden" name="step_id" value={entity.id} />
          <div className={styles.formGrid}>
            <label className={styles.fieldWide}><span>Nombre del paso</span><input name="name" defaultValue={entity.name} required /></label>
            <label><span>Tipo de paso</span><input name="step_type" defaultValue={step.step_type || ''} placeholder="Misterio, palio, Cristo…" /></label>
            <label><span>Slug público</span><input name="slug" defaultValue={entity.slug || ''} required /></label>
            <label><span>Estado editorial</span><StatusSelect defaultValue={entity.status} /></label>
            <label className={styles.fieldWide}><span>Resumen SEO / directorio</span><textarea name="summary" defaultValue={entity.summary || ''} rows="3" /></label>
            <label className={styles.fieldWide}><span>Descripción pública</span><textarea name="description" defaultValue={step.description || ''} rows="5" /></label>
            <label><span>Estilo</span><input name="style" defaultValue={step.style || ''} /></label>
            <label><span>Materiales</span><input name="materials" defaultValue={step.materials || ''} /></label>
            <label><span>Ejecución / datación</span><input name="execution_date_text" defaultValue={step.execution_date_text || ''} placeholder="1945, 1926–1927…" /></label>
            <label><span>Sistema de portadores</span><input name="carrier_system" defaultValue={step.carrier_system || ''} placeholder="Costaleros, ruedas…" /></label>
            <label><span>Dimensiones en texto</span><input name="dimensions_text" defaultValue={step.dimensions_text || ''} /></label>
            <label><span>Largo (cm)</span><input name="length_cm" type="number" min="0" step="0.01" defaultValue={step.length_cm ?? ''} /></label>
            <label><span>Ancho (cm)</span><input name="width_cm" type="number" min="0" step="0.01" defaultValue={step.width_cm ?? ''} /></label>
            <label><span>Alto (cm)</span><input name="height_cm" type="number" min="0" step="0.01" defaultValue={step.height_cm ?? ''} /></label>
            <label><span>Número de trabajaderas</span><input name="workbenches_count" type="number" min="0" defaultValue={step.workbenches_count ?? ''} /></label>
            <label><span>Estado de conservación</span><input name="current_condition" defaultValue={step.current_condition || ''} /></label>
            <label className={styles.fieldWide}><span>Estado actual / observaciones públicas</span><textarea name="current_state_notes" defaultValue={step.current_state_notes || ''} rows="3" /></label>
            <label className={styles.fieldWide}><span>Notas internas</span><textarea name="notes" defaultValue={step.notes || ''} rows="3" /></label>
          </div>
          <div className={styles.formActions}><small>Las Imágenes vinculadas y el archivo visual se gestionan desde las herramientas conectadas de la cabecera.</small>{canEdit ? <button className={styles.primaryButton} type="submit">Guardar ficha completa</button> : null}</div>
        </form>
      </section>

      <section className={styles.editorSection} id="personas">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Responsables</span><h2>Capataces y personal del paso</h2></div><p>Los periodos permiten conservar tanto la situación actual como el histórico.</p></div>
        <div className={styles.editorStack}>
          {data.personnel.map((item) => (
            <article className={styles.editorItem} key={item.id}>
              <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{item.is_current ? 'Actual' : 'Histórico'}</span><h3>{item.agent?.name || 'Persona no disponible'}</h3><p>{item.role_name}</p></div><span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span></div>
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
                  <div className={styles.formActions}><small>Actualiza este mismo periodo; no crea una responsabilidad duplicada.</small><button className={styles.secondaryButton} type="submit">Guardar responsabilidad</button></div>
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
                <div className={styles.formActions}><small>La Persona debe existir previamente para evitar duplicidades.</small><button className={styles.primaryButton} type="submit">Añadir responsable</button></div>
              </form>
            </article>
          ) : null}
        </div>
      </section>

      <section className={styles.editorSection} id="musica">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Acompañamiento</span><h2>Música vinculada al paso</h2></div><p>La relación conserva Banda, Hermandad, posición, salida y periodo.</p></div>
        <div className={styles.editorStack}>
          {data.musicPeriods.map((item) => (
            <article className={styles.editorItem} key={item.id}>
              <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{item.is_current ? 'Actual' : 'Histórico'}</span><h3>{item.band?.name || 'Banda no disponible'}</h3><p>{[item.position, item.outing_type].filter(Boolean).join(' · ')}</p></div><span className={`${styles.statusBadge} ${styles[item.status]}`}>{STATUS_LABELS[item.status]}</span></div>
              {canEdit ? (
                <form action={saveStepMusicAction} className={styles.editorForm}>
                  <input type="hidden" name="step_id" value={entity.id} /><input type="hidden" name="period_id" value={item.id} />
                  <div className={styles.formGrid}>
                    <EntityPicker className={styles.fieldWide} name="band_entity_id" items={data.bandOptions} label="Banda" defaultValue={item.band_entity_id} />
                    <EntityPicker className={styles.fieldWide} name="brotherhood_entity_id" items={data.brotherhoodOptions} label="Hermandad" defaultValue={item.brotherhood_entity_id} />
                    <label><span>Ubicación</span><input name="position" defaultValue={item.position} required /></label>
                    <label><span>Jornada o salida</span><input name="outing_type" defaultValue={item.outing_type || ''} /></label>
                    <PeriodFields item={item} />
                    <label className={styles.checkField}><input name="is_current" type="checkbox" defaultChecked={item.is_current} /><span>Acompañamiento actual</span></label>
                    <label><span>Estado editorial</span><StatusSelect defaultValue={item.status} /></label>
                    <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" defaultValue={item.notes || ''} rows="2" /></label>
                  </div>
                  <div className={styles.formActions}><small>Este vínculo se reflejará tanto en el Paso como en la Banda y la Hermandad cuando esté publicado.</small><button className={styles.secondaryButton} type="submit">Guardar acompañamiento</button></div>
                </form>
              ) : null}
              <RelationSourcesEditor relationKind="music_accompaniment_period" relationId={item.id} contextEntityId={entity.id} sourceOptions={data.sourceOptions} links={item.sourceLinks || []} returnPath={returnPath} canEdit={canEdit} />
              {canEdit ? <form action={archiveStepMusicAction} className={styles.archiveForm}><input type="hidden" name="step_id" value={entity.id} /><input type="hidden" name="period_id" value={item.id} /><button type="submit">Archivar acompañamiento</button></form> : null}
            </article>
          ))}

          {canEdit ? (
            <article className={styles.editorItem}>
              <div className={styles.itemHeading}><div><span className={styles.eyebrow}>Nueva relación</span><h3>Añadir acompañamiento musical</h3></div></div>
              <form action={saveStepMusicAction} className={styles.editorForm}>
                <input type="hidden" name="step_id" value={entity.id} />
                <div className={styles.formGrid}>
                  <EntityPicker className={styles.fieldWide} name="band_entity_id" items={data.bandOptions} label="Banda" placeholder="Buscar formación…" emptyLabel="Selecciona una Banda" />
                  <EntityPicker className={styles.fieldWide} name="brotherhood_entity_id" items={data.brotherhoodOptions} label="Hermandad" placeholder="Buscar Hermandad…" emptyLabel="Selecciona una Hermandad" />
                  <label><span>Ubicación</span><input name="position" placeholder="Tras el paso" required /></label>
                  <label><span>Jornada o salida</span><input name="outing_type" placeholder="Miércoles Santo, procesión de gloria…" /></label>
                  <PeriodFields />
                  <label className={styles.checkField}><input name="is_current" type="checkbox" defaultChecked /><span>Acompañamiento actual</span></label>
                  <label><span>Estado editorial</span><StatusSelect defaultValue="draft" /></label>
                  <label className={styles.fieldWide}><span>Notas</span><textarea name="notes" rows="2" /></label>
                </div>
                <div className={styles.formActions}><small>Indica al menos año, fecha o datación textual de inicio.</small><button className={styles.primaryButton} type="submit">Añadir acompañamiento</button></div>
              </form>
            </article>
          ) : null}
        </div>
      </section>

      <section className={styles.editorSection} id="patrimonio">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Evolución material</span><h2>Fases patrimoniales</h2></div><p>Diseño, talla, dorado, bordado, reformas y restauraciones con responsables y Fuentes propias.</p></div>
        <div className={styles.editorStack}>
          {data.phases.map((phase) => (
            <article className={styles.editorItem} key={phase.id}>
              <div className={styles.itemHeading}><div><span className={styles.eyebrow}>{phase.phase_type || 'Fase'}</span><h3>{phase.phase_name}</h3></div><span className={`${styles.statusBadge} ${styles[phase.status]}`}>{STATUS_LABELS[phase.status]}</span></div>
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
                  <div className={styles.formActions}><small>La fase publicada aparece en la cronología patrimonial del Paso.</small><button className={styles.secondaryButton} type="submit">Guardar fase</button></div>
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
                          <div className={styles.formActions}><small>{responsible.agent?.name || 'Responsable'}</small><button className={styles.secondaryButton} type="submit">Guardar responsable</button></div>
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
                      <div className={styles.formActions}><small>Relaciona una entidad existente para no duplicar autores.</small><button className={styles.primaryButton} type="submit">Vincular responsable</button></div>
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
                <div className={styles.formActions}><small>Después de crearla podrás añadir responsables y Fuentes a esta misma fase.</small><button className={styles.primaryButton} type="submit">Crear fase</button></div>
              </form>
            </article>
          ) : null}
        </div>
      </section>

      <section className={styles.editorSection} id="fuentes">
        <div className={styles.sectionHeading}><div><span className={styles.eyebrow}>Documentación</span><h2>Fuentes directas de la ficha</h2></div><Link className={styles.secondaryButton} href={`/panel/fuentes?entity=${entity.id}`}>Gestionar Fuentes</Link></div>
        {data.sources.length ? <div className={styles.editorStack}>{data.sources.map((source) => <article className={styles.editorItem} key={source.id}><strong>{source.name}</strong><small>{source.source_type}{source.url ? ` · ${source.url}` : ''}</small></article>)}</div> : <div className={styles.emptyPanel}>Este Paso todavía no tiene Fuentes directas. Las fases, responsables y acompañamientos pueden documentarse además con Fuentes específicas.</div>}
      </section>
    </div>
  )
}

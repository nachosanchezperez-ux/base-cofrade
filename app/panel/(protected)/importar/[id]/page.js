import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import {
  IMPORT_ENTITY_LABELS,
  attributeMap,
  classifyImportRelation,
} from '@/lib/panel/document-import'
import { createClient } from '@/lib/supabase/server'
import {
  applyDocumentImportAction,
  discardDocumentImportAction,
} from '../actions'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Revisar importación · Panel' }

const STATUS = {
  review: ['En revisión', 'review'],
  applied: ['Aplicada', 'published'],
  discarded: ['Descartada', 'archived'],
  failed: ['Fallida', 'archived'],
}

function confidence(value) {
  return `${Math.round((Number(value) || 0) * 100)}%`
}

function relationName(ref, target, candidateById) {
  if (ref === '$target') return target?.name || 'Entidad objetivo no disponible'
  return candidateById.get(ref)?.name || ref
}

function newCandidateAllowed(candidate) {
  if (!candidate?.can_create_draft) return false
  if (candidate.entity_type !== 'agent') return true
  const attrs = attributeMap(candidate)
  return ['person', 'workshop', 'company', 'institution'].includes(String(attrs.agent_kind || '').toLowerCase())
}

function defaultResolution(candidate) {
  if (candidate.match_conflict) return 'ignore'
  if (candidate.recommended_match_id) return `existing:${candidate.recommended_match_id}`
  if (newCandidateAllowed(candidate) && !(candidate.matches || []).length) return 'new'
  return 'ignore'
}

export default async function DocumentImportReviewPage({ params, searchParams }) {
  const [{ id }, query, user, supabase] = await Promise.all([
    params,
    searchParams,
    requirePanelUser(),
    createClient(),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)

  const importResult = await supabase
    .from('document_imports')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (importResult.error) throw new Error(`No se pudo cargar la importación: ${importResult.error.message}`)
  if (!importResult.data) notFound()
  const item = importResult.data

  const targetResult = item.target_entity_id
    ? await supabase
        .from('entities')
        .select('id, name, entity_type, slug, status')
        .eq('id', item.target_entity_id)
        .maybeSingle()
    : { data: null, error: null }
  if (targetResult.error) throw new Error(`No se pudo cargar la entidad objetivo: ${targetResult.error.message}`)
  const target = targetResult.data || null

  const sourceResult = item.source_id
    ? await supabase.from('sources').select('id, name, url, source_type').eq('id', item.source_id).maybeSingle()
    : { data: null, error: null }
  const source = sourceResult.data || null

  const analysis = item.analysis || {}
  const entities = analysis.entities || []
  const relations = analysis.relations || []
  const warnings = analysis.warnings || []
  const candidateById = new Map(entities.map((candidate) => [candidate.local_id, candidate]))
  const typeByRef = new Map(entities.map((candidate) => [candidate.local_id, candidate.entity_type]))
  const exactMatches = entities.filter((candidate) => candidate.recommended_match_id).length
  const ambiguous = entities.filter((candidate) => (candidate.matches || []).length && !candidate.recommended_match_id).length
  const newCandidates = entities.filter((candidate) => !(candidate.matches || []).length).length
  const supportedRelations = relations.filter((relation) => classifyImportRelation(relation, typeByRef, target)).length
  const status = STATUS[item.status] || [item.status, 'review']
  const applied = item.application_summary || {}

  return (
    <div className={styles.pageWrap}>
      <header className={styles.editorHeader}>
        <div className={styles.breadcrumb}>
          <Link href="/panel/importar">Importar documentación</Link><span>→</span><strong>Revisión</strong>
        </div>
        <div className={styles.editorTitleRow}>
          <div>
            <span className={styles.eyebrow}>Fuente analizada</span>
            <h1>{analysis.source?.title || item.source_title || 'Importación documental'}</h1>
            <p>{target ? `Entidad objetivo: ${target.name}` : 'Sin entidad objetivo preseleccionada'}</p>
          </div>
          <span className={`${styles.statusBadge} ${styles[status[1]]}`}>{status[0]}</span>
        </div>
      </header>

      {query?.error ? <div className={styles.readOnlyNotice} role="alert">{String(query.error)}</div> : null}
      {query?.saved === 'applied' ? <div className={styles.savedNotice} role="status">Borrador creado correctamente. Ningún contenido se ha publicado automáticamente.</div> : null}
      {query?.saved === 'discarded' ? <div className={styles.savedNotice} role="status">Propuesta descartada. El grafo no se ha modificado.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil puede revisar esta propuesta, pero no aplicarla.</div> : null}

      <section className={styles.panelCard}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Diagnóstico</span><h2>Qué ha encontrado Hilo</h2></div>
          <p>{analysis.summary || 'Sin resumen generado.'}</p>
        </div>
        <div className={styles.formGrid}>
          <div><span>Entidades</span><strong>{entities.length}</strong><small>{exactMatches} coincidencias exactas</small></div>
          <div><span>Nuevas</span><strong>{newCandidates}</strong><small>sin coincidencia sugerida</small></div>
          <div><span>Ambiguas</span><strong>{ambiguous}</strong><small>requieren decisión humana</small></div>
          <div><span>Relaciones</span><strong>{relations.length}</strong><small>{supportedRelations} aplicables en este MVP</small></div>
        </div>
      </section>

      <section className={styles.editorSection}>
        <div className={styles.sectionHeading}>
          <div><span className={styles.eyebrow}>Fuente</span><h2>Trazabilidad documental</h2></div>
          <p>La URL y las evidencias quedan vinculadas al conocimiento aceptado.</p>
        </div>
        <article className={styles.editorItem}>
          <div className={styles.itemHeading}>
            <div>
              <span className={styles.eyebrow}>{analysis.source?.source_type || 'website'}</span>
              <h3>{analysis.source?.title || item.source_title || item.source_url}</h3>
              {analysis.source?.publisher ? <p>{analysis.source.publisher}</p> : null}
              <p><a href={item.source_url} target="_blank" rel="noreferrer">{item.source_url}</a></p>
              {analysis.source?.publication_date ? <small>Publicación: {analysis.source.publication_date}</small> : null}
            </div>
          </div>
          {source ? <small>Fuente canónica creada/reutilizada: {source.name} · <Link href="/panel/fuentes">ver Fuentes →</Link></small> : <small>La Fuente canónica se crea o reutiliza únicamente al aplicar la revisión.</small>}
        </article>
      </section>

      {item.status === 'applied' ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>Resultado</span><h2>Borrador aplicado</h2></div>
            <p>El conocimiento sigue sujeto al flujo editorial habitual antes de publicarse.</p>
          </div>
          <div className={styles.panelCard}>
            <div className={styles.formGrid}>
              <div><span>Entidades nuevas</span><strong>{applied.created_entities || 0}</strong></div>
              <div><span>Entidades reutilizadas</span><strong>{applied.reused_entities || 0}</strong></div>
              <div><span>Relaciones nuevas</span><strong>{applied.created_relations || 0}</strong></div>
              <div><span>Relaciones reutilizadas</span><strong>{applied.reused_relations || 0}</strong></div>
              <div><span>Relaciones no aplicadas</span><strong>{applied.skipped_relations || 0}</strong></div>
            </div>
          </div>
        </section>
      ) : null}

      {warnings.length ? (
        <section className={styles.editorSection}>
          <div className={styles.sectionHeading}>
            <div><span className={styles.eyebrow}>Alertas</span><h2>Datos que no deben automatizarse</h2></div>
            <p>{warnings.length} advertencia{warnings.length === 1 ? '' : 's'} detectada{warnings.length === 1 ? '' : 's'}.</p>
          </div>
          <div className={styles.editorStack}>
            {warnings.map((warning, index) => (
              <article className={styles.editorItem} key={`${warning.type}-${index}`}>
                <span className={styles.eyebrow}>{warning.type}</span>
                <h3>{warning.message}</h3>
                {warning.evidence ? <small>Fuente: “{warning.evidence}”</small> : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {item.status === 'review' ? (
        <form action={applyDocumentImportAction}>
          <input type="hidden" name="import_id" value={item.id} />

          <section className={styles.editorSection}>
            <div className={styles.sectionHeading}>
              <div><span className={styles.eyebrow}>Paso 2</span><h2>Resolver entidades</h2></div>
              <p>Para cada candidato decide si reutiliza una ficha existente, crea un borrador o se ignora.</p>
            </div>
            <div className={styles.editorStack}>
              {entities.map((candidate) => {
                const canCreate = newCandidateAllowed(candidate)
                const defaultValue = defaultResolution(candidate)
                const attrs = candidate.attributes || []
                return (
                  <article className={styles.editorItem} key={candidate.local_id}>
                    <div className={styles.itemHeading}>
                      <div>
                        <span className={styles.eyebrow}>{IMPORT_ENTITY_LABELS[candidate.entity_type] || candidate.entity_type} · confianza {confidence(candidate.confidence)}</span>
                        <h3>{candidate.name}</h3>
                        {candidate.description ? <p>{candidate.description}</p> : null}
                      </div>
                      {candidate.recommended_match_id ? <span className={`${styles.statusBadge} ${styles.published}`}>Coincidencia</span> : candidate.matches?.length ? <span className={`${styles.statusBadge} ${styles.review}`}>Revisar</span> : <span className={`${styles.statusBadge} ${styles.draft}`}>Nueva</span>}
                    </div>

                    {candidate.evidence ? <p><small>Evidencia: “{candidate.evidence}”</small></p> : null}
                    {attrs.length ? (
                      <div className={styles.formGrid}>
                        {attrs.map((attribute, index) => (
                          <div key={`${attribute.key}-${index}`}>
                            <span>{attribute.key.replaceAll('_', ' ')}</span>
                            <strong>{attribute.value}</strong>
                            {attribute.evidence ? <small>“{attribute.evidence}”</small> : null}
                          </div>
                        ))}
                      </div>
                    ) : null}

                    <label>
                      <span>Decisión editorial</span>
                      <select name={`resolution_${candidate.local_id}`} defaultValue={defaultValue}>
                        <option value="ignore">Ignorar por ahora</option>
                        {(candidate.matches || []).map((match) => (
                          <option key={match.id} value={`existing:${match.id}`}>
                            Reutilizar: {match.name} · {match.status}{match.exact ? ' · coincidencia exacta' : ` · similitud ${Math.round(match.score * 100)}%`}
                          </option>
                        ))}
                        {canCreate ? <option value="new">Crear nueva entidad como borrador</option> : null}
                      </select>
                      {!canCreate && candidate.entity_type === 'agent' ? <small>Para crear un Agente automáticamente debe estar documentado agent_kind.</small> : null}
                      {!canCreate && !candidate.matches?.length && candidate.entity_type !== 'agent' ? <small>Este tipo todavía requiere alta manual en el Panel.</small> : null}
                    </label>
                  </article>
                )
              })}
            </div>
          </section>

          <section className={styles.editorSection}>
            <div className={styles.sectionHeading}>
              <div><span className={styles.eyebrow}>Paso 3</span><h2>Revisar relaciones</h2></div>
              <p>Las relaciones soportadas se crean en borrador y conservan el vínculo exacto con la Fuente.</p>
            </div>
            {relations.length ? (
              <div className={styles.editorStack}>
                {relations.map((relation, index) => {
                  const operation = classifyImportRelation(relation, typeByRef, target)
                  const enabled = Boolean(operation)
                  return (
                    <article className={styles.editorItem} key={`${relation.source_ref}-${relation.target_ref}-${index}`}>
                      <div className={styles.itemHeading}>
                        <div>
                          <span className={styles.eyebrow}>{relation.relation_type} · confianza {confidence(relation.confidence)}</span>
                          <h3>{relationName(relation.source_ref, target, candidateById)} → {relationName(relation.target_ref, target, candidateById)}</h3>
                          {relation.notes ? <p>{relation.notes}</p> : null}
                          {relation.evidence ? <small>Evidencia: “{relation.evidence}”</small> : null}
                        </div>
                        <span className={`${styles.statusBadge} ${styles[enabled ? 'draft' : 'review']}`}>{enabled ? 'Aplicable' : 'Manual'}</span>
                      </div>
                      <label className={styles.checkField}>
                        <input
                          name="relation_candidate"
                          type="checkbox"
                          value={index}
                          defaultChecked={enabled && Number(relation.confidence) >= 0.8}
                          disabled={!enabled}
                        />
                        <span>{enabled ? 'Crear/reutilizar esta relación en borrador' : 'Conservar como propuesta; este MVP todavía no escribe esta relación'}</span>
                      </label>
                    </article>
                  )
                })}
              </div>
            ) : <div className={styles.emptyPanel}>La fuente no ha producido relaciones explícitas.</div>}
          </section>

          <section className={styles.panelCard}>
            <div className={styles.sectionHeading}>
              <div><span className={styles.eyebrow}>Confirmación</span><h2>Crear borrador seguro</h2></div>
              <p>La operación es transaccional: si algo falla, no se deja una carga parcial. Nunca cambia estados a publicado.</p>
            </div>
            <div className={styles.formActions}>
              <small>Los atributos extraídos se aplican a entidades nuevas solo mediante una lista controlada. Las fichas existentes no se sobrescriben automáticamente.</small>
              {canEdit ? <button className={styles.primaryButton} type="submit">Crear borrador con lo revisado</button> : null}
            </div>
          </section>
        </form>
      ) : null}

      {item.status === 'review' && canEdit ? (
        <form action={discardDocumentImportAction} className={styles.archiveForm}>
          <input type="hidden" name="import_id" value={item.id} />
          <button type="submit">Descartar propuesta sin modificar datos</button>
        </form>
      ) : null}
    </div>
  )
}

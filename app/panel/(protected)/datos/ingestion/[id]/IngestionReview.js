'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveAssistedReviewAction, stageAssistedImportAction } from '../actions'
import styles from '../ingestion.module.css'

const TYPE_LABELS = {
  advocation: 'Advocación',
  image: 'Imagen',
  step: 'Paso',
  agent: 'Autor / agente',
  band: 'Banda',
  march: 'Marcha',
  heritage_asset: 'Patrimonio',
}

const RELATION_LABELS = {
  has_titular: 'Hermandad → advocación titular',
  titular: 'Hermandad → imagen titular',
  processional_step: 'Hermandad → paso procesional',
  processes_on: 'Imagen → paso',
  belongs_to_brotherhood: 'Banda → Hermandad',
  authored_by: 'Marcha → autor',
  dedicated_to: 'Marcha → dedicatoria',
}

function percentage(value) {
  return `${Math.round((Number(value) || 0) * 100)}%`
}

function initialEntityChoice(entity) {
  const preferred = entity.resolution?.default_choice
  if (preferred?.startsWith('existing:')) return preferred
  if (preferred === 'new' && Number(entity.confidence) >= 0.82) return 'new'
  return 'ignore'
}

function selectedCandidate(entity, decision) {
  const value = String(decision || '')
  if (!value.startsWith('existing:')) return null
  const id = value.slice(9)
  return (entity.resolution?.candidates || []).find((candidate) => candidate.id === id) || null
}

function fieldLabel(field) {
  return String(field || '').replace(/_/g, ' ')
}

export default function IngestionReview({ documentImport, target, canEdit, batchId = null }) {
  const router = useRouter()
  const analysis = documentImport.analysis || { entities: [], relations: [], warnings: [] }
  const savedReview = documentImport.application_summary?.review || null
  const [decisions, setDecisions] = useState(() => {
    if (savedReview?.decisions) {
      return Object.fromEntries((analysis.entities || []).map((entity) => [
        entity.local_id,
        savedReview.decisions[entity.local_id] || 'ignore',
      ]))
    }
    return Object.fromEntries((analysis.entities || []).map((entity) => [entity.local_id, initialEntityChoice(entity)]))
  })
  const [selectedRelations, setSelectedRelations] = useState(() => new Set(
    Array.isArray(savedReview?.selected_relation_indexes)
      ? savedReview.selected_relation_indexes
      : (analysis.relations || [])
        .map((relation, index) => relation.stageable && Number(relation.confidence) >= 0.78 ? index : null)
        .filter((index) => index !== null),
  ))
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const stagedBatchId = documentImport.application_summary?.bulk_import_id || null
  const acceptedEntities = useMemo(() => Object.values(decisions).filter((value) => value !== 'ignore').length, [decisions])
  const stageableRelations = useMemo(() => (analysis.relations || []).filter((relation) => relation.stageable).length, [analysis.relations])
  const enrichmentSummary = useMemo(() => {
    let fills = 0
    let conflicts = 0
    for (const entity of analysis.entities || []) {
      const candidate = selectedCandidate(entity, decisions[entity.local_id])
      fills += candidate?.enrichment?.fills?.length || 0
      conflicts += candidate?.enrichment?.conflicts?.length || 0
    }
    return { fills, conflicts }
  }, [analysis.entities, decisions])

  function relationEndpointsAccepted(relation) {
    for (const ref of [relation.source_ref, relation.target_ref]) {
      if (ref === '$target') continue
      if (!decisions[ref] || decisions[ref] === 'ignore') return false
    }
    return true
  }

  function updateDecision(localId, value) {
    setDecisions((current) => ({ ...current, [localId]: value }))
    const relatedIndexes = (analysis.relations || []).map((relation, index) => ({ relation, index }))
      .filter(({ relation }) => relation.source_ref === localId || relation.target_ref === localId)
      .map(({ index }) => index)
    if (value === 'ignore' && relatedIndexes.length) {
      setSelectedRelations((current) => {
        const next = new Set(current)
        relatedIndexes.forEach((index) => next.delete(index))
        return next
      })
    }
  }

  function toggleRelation(index) {
    setSelectedRelations((current) => {
      const next = new Set(current)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  async function saveReviewForBatch() {
    if (!canEdit || !batchId || stagedBatchId || working) return
    setWorking(true)
    setError('')
    setMessage('')
    try {
      await saveAssistedReviewAction(documentImport.id, {
        decisions,
        selectedRelations: [...selectedRelations],
      })
      setMessage('Revisión guardada. Volviendo a la tanda…')
      router.push(`/panel/datos/ingestion/lotes/${batchId}`)
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo guardar la revisión editorial.')
    } finally {
      setWorking(false)
    }
  }

  async function prepareBatch() {
    if (!canEdit || stagedBatchId || working) return
    setWorking(true)
    setError('')
    setMessage('')
    try {
      const result = await stageAssistedImportAction(documentImport.id, {
        decisions,
        selectedRelations: [...selectedRelations],
      })
      setMessage(result.blocked
        ? 'El lote se ha generado, pero el preflight ha detectado incidencias. Abriendo el diagnóstico…'
        : 'Lote gobernado preparado. Abriendo el plan efectivo antes de Apply…')
      router.push(`/panel/datos/importar/${result.bulkImportId}`)
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo generar el lote gobernado.')
    } finally {
      setWorking(false)
    }
  }

  return <div className={styles.workspace}>
    <section className={styles.card}>
      <div className={styles.cardHeading}>
        <div><span className={styles.kicker}>Fuente</span><h2>Captura certificada</h2></div>
        <span className={styles.status}>SHA-256</span>
      </div>
      <div className={styles.sourceSummary}>
        <div><span>Objetivo</span><strong>{target.name}</strong></div>
        <div><span>Tipo</span><strong>{analysis.source?.source_type || '—'}</strong></div>
        <div><span>Modelo</span><strong>{documentImport.model_name || '—'}</strong></div>
        <div><span>Huella</span><code>{documentImport.content_sha256?.slice(0, 16) || '—'}…</code></div>
      </div>
      <a className={styles.sourceLink} href={documentImport.source_url} target="_blank" rel="noreferrer">{documentImport.source_url}</a>
      {analysis.capture?.truncated_for_model ? <div className={styles.warningBox}>La página superaba el límite de texto enviado al modelo. La huella SHA-256 corresponde a la descarga completa, pero la extracción utilizó los primeros bloques de contenido.</div> : null}
      {(analysis.warnings || []).length ? <div className={styles.warningBox}><strong>Avisos del análisis</strong><ul>{analysis.warnings.map((warning, index) => <li key={index}>{warning}</li>)}</ul></div> : null}
    </section>

    <section className={styles.card}>
      <div className={styles.cardHeading}>
        <div><span className={styles.kicker}>Paso 2</span><h2>Resolver entidades</h2></div>
        <span className={styles.status}>{acceptedEntities}/{analysis.entities?.length || 0} aceptadas</span>
      </div>
      <p className={styles.lead}>Las coincidencias exactas y las variantes semánticas seguras se resuelven contra el nodo existente. Los huecos vacíos pueden enriquecerse; una contradicción nunca sustituye el dato publicado automáticamente. Las entidades nuevas siguen naciendo como <code>draft</code>.</p>
      {(analysis.entities || []).length ? <div className={styles.proposalList}>{analysis.entities.map((entity) => {
        const candidate = selectedCandidate(entity, decisions[entity.local_id])
        const fills = candidate?.enrichment?.fills || []
        const conflicts = candidate?.enrichment?.conflicts || []
        return <article key={entity.local_id} className={decisions[entity.local_id] === 'ignore' ? styles.proposalMuted : ''}>
        <div className={styles.proposalHeader}>
          <div>
            <span className={styles.typePill}>{TYPE_LABELS[entity.entity_type] || entity.entity_type}</span>
            <h3>{entity.name}</h3>
          </div>
          <span className={styles.confidence}>{percentage(entity.confidence)}</span>
        </div>
        {entity.summary ? <p>{entity.summary}</p> : null}
        {entity.evidence ? <div className={styles.evidence}><strong>Evidencia</strong><span>{entity.evidence}</span></div> : null}
        {entity.attributes?.length ? <div className={styles.attributeList}>{entity.attributes.map((attribute) => <span key={`${entity.local_id}-${attribute.key}`}><b>{attribute.key}</b>{attribute.value}</span>)}</div> : null}
        <label className={styles.field}>
          <span>Decisión editorial</span>
          <select value={decisions[entity.local_id] || 'ignore'} onChange={(event) => updateDecision(entity.local_id, event.target.value)} disabled={!canEdit || working || Boolean(stagedBatchId)}>
            <option value="ignore">No incorporar</option>
            <option value="new">Crear nodo nuevo en borrador</option>
            {(entity.resolution?.candidates || []).map((candidate) => <option key={candidate.id} value={`existing:${candidate.id}`}>
              Reutilizar: {candidate.name}{candidate.matched_name && candidate.matched_name !== candidate.name ? ` · coincide con «${candidate.matched_name}»` : ''}{candidate.match_score && candidate.match_score < 1 ? ` · ${percentage(candidate.match_score)}` : ''}{candidate.status ? ` · ${candidate.status}` : ''}
            </option>)}
          </select>
        </label>
        <small className={styles.resolutionNote}>
          {entity.resolution?.state === 'exact'
            ? 'Coincidencia exacta encontrada en Hilo Cofrade, incluido su catálogo de nombres alternativos.'
            : entity.resolution?.state === 'semantic'
              ? candidate?.context_match
                ? 'Coincidencia semántica única confirmada por el contexto de esta Hermandad.'
                : 'Coincidencia semántica única. Revísala antes de aceptarla.'
              : entity.resolution?.state === 'contextual'
                ? 'Existe una coincidencia nominal fuera del grafo actual de esta Hermandad. No se reutiliza automáticamente.'
                : entity.resolution?.state === 'potential'
                  ? 'Existe una coincidencia débil por nombre corto. Se muestra para revisión, pero no se reutiliza ni se crea automáticamente.'
                  : entity.resolution?.state === 'ambiguous'
                    ? 'Hay varias coincidencias posibles: requiere elección manual.'
                    : entity.resolution?.state === 'new' && entity.resolution?.default_choice !== 'new'
                      ? 'No hay coincidencia segura, pero esta propuesta no tiene una relación escribible que justifique crearla automáticamente.'
                      : 'No se encontró una coincidencia suficientemente segura por nombre, tipo y contexto.'}
        </small>
        {candidate ? <div className={styles.enrichmentBox}>
          <div className={styles.enrichmentHeader}>
            <strong>Enriquecimiento diferencial</strong>
            <span>{fills.length} hueco{fills.length === 1 ? '' : 's'} · {conflicts.length} conflicto{conflicts.length === 1 ? '' : 's'}</span>
          </div>
          {fills.length ? <div className={styles.enrichmentList}>
            {fills.map((field) => <div key={`fill-${field.table}-${field.column}`}>
              <b>+ {fieldLabel(field.column)}</b>
              <span>{String(field.proposed_value)}</span>
            </div>)}
          </div> : <small className={styles.resolutionNote}>No hay huecos nuevos que rellenar en este nodo.</small>}
          {conflicts.length ? <div className={styles.conflictList}>
            {conflicts.map((field) => <div key={`conflict-${field.table}-${field.column}`}>
              <b>Revisión · {fieldLabel(field.column)}</b>
              <span><strong>Actual:</strong> {String(field.current_value)}</span>
              <span><strong>Fuente:</strong> {String(field.proposed_value)}</span>
              <em>No se sobrescribirá automáticamente.</em>
            </div>)}
          </div> : null}
        </div> : null}
      </article>
      })}</div> : <div className={styles.emptyBox}>La Fuente no ha generado nuevas entidades candidatas.</div>}
    </section>

    <section className={styles.card}>
      <div className={styles.cardHeading}>
        <div><span className={styles.kicker}>Paso 3</span><h2>Validar relaciones</h2></div>
        <span className={styles.status}>{selectedRelations.size}/{stageableRelations}</span>
      </div>
      <p className={styles.lead}>Una relación solo entra en el lote cuando sus dos extremos están aceptados y el contrato permite escribirla. HC-AUTO-02 comprueba además equivalencias históricas para no duplicar una relación ya existente con otro nombre.</p>
      {(analysis.relations || []).length ? <div className={styles.relationList}>{analysis.relations.map((relation, index) => {
        const endpointsReady = relationEndpointsAccepted(relation)
        const enabled = Boolean(relation.stageable && endpointsReady && canEdit && !working && !stagedBatchId)
        const checked = selectedRelations.has(index) && endpointsReady
        return <label key={`${relation.relation_type}-${index}`} className={`${styles.relationRow} ${!enabled ? styles.proposalMuted : ''}`}>
          <input type="checkbox" checked={checked} disabled={!enabled} onChange={() => toggleRelation(index)} />
          <span>
            <strong>{RELATION_LABELS[relation.relation_type] || relation.relation_type}</strong>
            <small>{relation.source_ref} → {relation.target_ref} · confianza {percentage(relation.confidence)}</small>
            {relation.evidence ? <em>{relation.evidence}</em> : null}
            {!relation.stageable ? <b className={styles.blockedText}>Conservada como propuesta; todavía no tiene contrato de escritura seguro.</b> : !endpointsReady ? <b className={styles.blockedText}>Acepta primero las entidades de ambos extremos.</b> : null}
          </span>
        </label>
      })}</div> : <div className={styles.emptyBox}>La Fuente no ha generado relaciones candidatas.</div>}
    </section>

    <section className={styles.card}>
      <div className={styles.cardHeading}>
        <div><span className={styles.kicker}>Paso 4</span><h2>Generar lote gobernado</h2></div>
        <span className={styles.status}>{stagedBatchId ? 'Preparado' : 'Sin escrituras'}</span>
      </div>
      {stagedBatchId ? <div className={styles.successBox}>
        <strong>Esta revisión ya tiene un lote asociado.</strong><br />No se puede generar un segundo lote desde la misma propuesta para evitar duplicidades.
        <div className={styles.inlineLinks}>
          <Link className={styles.primaryButton} href={`/panel/datos/importar/${stagedBatchId}`}>Ver plan efectivo</Link>
          <Link className={styles.secondaryButton} href="/panel/datos/importar">Ir a Apply</Link>
        </div>
      </div> : <>
        <div className={styles.guardrailGrid}>
          <div><strong>{acceptedEntities}</strong><span>entidades aceptadas</span></div>
          <div><strong>{selectedRelations.size}</strong><span>relaciones seleccionadas</span></div>
          <div><strong>{enrichmentSummary.fills}</strong><span>huecos seguros</span></div>
          <div><strong>{enrichmentSummary.conflicts}</strong><span>conflictos solo revisión</span></div>
        </div>
        {batchId ? <div className={styles.warningBox}>
          <strong>Esta Fuente pertenece a una tanda HC-AUTO-02.</strong><br />Guarda aquí la revisión; el preflight se ejecutará una sola vez cuando todas las Fuentes de la tanda estén revisadas.
        </div> : null}
        <div className={styles.actions}>
          {batchId
            ? <button className={styles.primaryButton} type="button" onClick={saveReviewForBatch} disabled={!canEdit || working}>
                {working ? 'Guardando revisión…' : 'Guardar revisión y volver a la tanda'}
              </button>
            : <button className={styles.primaryButton} type="button" onClick={prepareBatch} disabled={!canEdit || working}>
                {working ? 'Ejecutando preflight…' : 'Generar lote y ejecutar preflight'}
              </button>}
        </div>
      </>}
      {message ? <div className={styles.successBox}>{message}</div> : null}
      {error ? <div className={styles.errorBox}>{error}</div> : null}
    </section>
  </div>
}

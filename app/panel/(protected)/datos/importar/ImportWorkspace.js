'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  IMPORTABLE_TABLES,
  findBulkImportTargetCollisions,
  validateBulkImportRecord,
} from '@/lib/panel/bulk-import-config'
import {
  DEFAULT_IMPORT_CHUNK_BYTES,
  parseBulkImportText,
  splitImportPayload,
} from '@/lib/panel/bulk-import-parser'
import {
  appendBulkImportItemsAction,
  applyBulkImportChunkAction,
  cancelBulkImportAction,
  createBulkImportAction,
  finalizeBulkImportAction,
} from './actions'
import styles from './import.module.css'

function inferFormat(name) {
  const lower = String(name || '').toLowerCase()
  if (lower.endsWith('.csv')) return 'csv'
  if (lower.endsWith('.jsonl') || lower.endsWith('.ndjson')) return 'jsonl'
  if (lower.endsWith('.json')) return 'json'
  return null
}

function statusLabel(status) {
  return {
    staging: 'Preparando',
    ready: 'Listo',
    processing: 'Aplicando',
    completed: 'Completado',
    completed_with_errors: 'Completado con incidencias',
    cancelled: 'Cancelado',
  }[status] || status
}

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
}

function operationCounts(records = []) {
  return records.reduce((counts, record) => {
    const operation = record?.operation === 'upsert' ? 'upsert' : 'insert'
    counts[operation] += 1
    return counts
  }, { insert: 0, upsert: 0 })
}

function savedOperationCounts(batch) {
  const counts = batch?.metadata?.operation_counts || {}
  return {
    insert: Number(counts.insert) || 0,
    upsert: Number(counts.upsert) || 0,
  }
}

function pendingValidItems(batch) {
  return Math.max(0, (batch.valid_items || 0) - (batch.applied_items || 0) - (batch.failed_items || 0))
}

const JSON_EXAMPLE = `{
  "version": 1,
  "records": [
    {
      "table": "entities",
      "operation": "upsert",
      "on_conflict": "slug",
      "data": {
        "entity_type": "brotherhood",
        "name": "Nombre de la hermandad",
        "slug": "nombre-hermandad",
        "status": "draft"
      }
    },
    {
      "table": "brotherhoods",
      "operation": "upsert",
      "on_conflict": "entity_id",
      "refs": {
        "entity_id": {
          "table": "entities",
          "match": { "slug": "nombre-hermandad" }
        }
      },
      "data": {
        "official_name": "Nombre oficial"
      }
    }
  ]
}`

export default function ImportWorkspace({ initialImports, canEdit }) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [sourceName, setSourceName] = useState('')
  const [label, setLabel] = useState('')
  const [format, setFormat] = useState('json')
  const [csvTable, setCsvTable] = useState('entities')
  const [csvOperation, setCsvOperation] = useState('upsert')
  const [csvConflict, setCsvConflict] = useState('slug')
  const [analysis, setAnalysis] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [working, setWorking] = useState(false)
  const [progress, setProgress] = useState(null)
  const [confirmingImportId, setConfirmingImportId] = useState(null)
  const [cancellingImportId, setCancellingImportId] = useState(null)

  const tableSummary = useMemo(() => {
    if (!analysis) return []
    const counts = new Map()
    for (const record of analysis.records) {
      const name = String(record?.table || 'sin tabla')
      counts.set(name, (counts.get(name) || 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [analysis])

  function resetResult() {
    setAnalysis(null)
    setMessage('')
    setError('')
    setProgress(null)
  }

  async function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return
    resetResult()
    setSourceName(file.name)
    setLabel((current) => current || file.name.replace(/\.[^.]+$/, ''))
    const inferred = inferFormat(file.name)
    if (inferred) setFormat(inferred)
    setText(await file.text())
  }

  function analyse() {
    setError('')
    setMessage('')
    try {
      const parsed = parseBulkImportText(text, {
        format,
        table: csvTable,
        operation: csvOperation,
        onConflict: csvOperation === 'upsert' ? csvConflict : null,
      })
      if (!parsed.records.length) throw new Error('No se han encontrado registros.')
      const validations = parsed.records.map(validateBulkImportRecord)
      const records = validations.map((item) => item.record)
      const invalid = validations.filter((item) => item.errors.length)
      const validRecords = validations.filter((item) => !item.errors.length).map((item) => item.record)
      const collisions = findBulkImportTargetCollisions(validations)
      const transportChunks = splitImportPayload(records).length
      const operations = operationCounts(validRecords)
      setAnalysis({
        ...parsed,
        records,
        validations,
        invalidCount: invalid.length,
        collisions,
        transportChunks,
        operationCounts: operations,
      })
      setMessage(`Análisis terminado: ${parsed.records.length} registros · ${invalid.length} con incidencias de estructura · ${collisions.length} colisiones de clave · ${transportChunks} envíos protegidos.`)
    } catch (caught) {
      setAnalysis(null)
      setError(caught instanceof Error ? caught.message : 'No se pudo analizar el contenido.')
    }
  }

  async function prepareBatch() {
    if (!analysis || !canEdit) return
    if (analysis.collisions?.length) {
      setError('Corrige las colisiones de clave estable antes de preparar el lote.')
      return
    }

    let createdBatchId = null
    setWorking(true)
    setError('')
    setMessage('')
    try {
      const batches = splitImportPayload(analysis.records)
      const batch = await createBulkImportAction({
        label: label || sourceName || 'Importación masiva',
        sourceName: sourceName || null,
        sourceFormat: analysis.format,
        expectedItems: analysis.records.length,
        metadata: {
          table_counts: Object.fromEntries(tableSummary),
          operation_counts: analysis.operationCounts,
          transport_chunks: batches.length,
          transport_max_bytes: DEFAULT_IMPORT_CHUNK_BYTES,
          collision_preflight: { checked: true, collisions: 0 },
        },
      })
      createdBatchId = batch.id

      let offset = 0
      for (let index = 0; index < batches.length; index += 1) {
        setProgress({ phase: 'staging', current: offset, total: analysis.records.length })
        await appendBulkImportItemsAction(batch.id, offset, batches[index])
        offset += batches[index].length
      }
      const final = await finalizeBulkImportAction(batch.id)
      createdBatchId = null
      setProgress({ phase: 'ready', current: offset, total: analysis.records.length })
      setMessage(`Lote preparado en ${batches.length} envíos: ${final.counts.valid_items} válidos · ${final.counts.invalid_items} con incidencias. Revisa el resumen antes de confirmar la escritura en el grafo.`)
      router.refresh()
    } catch (caught) {
      if (createdBatchId) {
        try {
          await cancelBulkImportAction(createdBatchId, 'Preparación interrumpida antes de completar el staging.')
        } catch (cancelError) {
          console.error('[Hilo Cofrade] No se pudo autocancelar el lote interrumpido', cancelError)
        }
        router.refresh()
      }
      setError(caught instanceof Error ? caught.message : 'No se pudo preparar el lote.')
    } finally {
      setWorking(false)
    }
  }

  async function applyBatch(importId) {
    if (!canEdit) return
    setConfirmingImportId(null)
    setCancellingImportId(null)
    setWorking(true)
    setError('')
    setMessage('')
    try {
      let done = false
      let result = null
      while (!done) {
        result = await applyBulkImportChunkAction(importId)
        done = result.done
        setProgress({
          phase: 'applying',
          current: result.counts.applied_items + result.counts.failed_items,
          total: result.counts.valid_items,
        })
        if (!done && result.processed === 0) throw new Error('La cola de importación no avanza. Revisa las incidencias del lote.')
      }
      setMessage(result.status === 'completed'
        ? `Importación completada: ${result.counts.applied_items} registros aplicados.`
        : `Importación terminada con incidencias: ${result.counts.applied_items} aplicados · ${result.counts.failed_items} fallidos · ${result.counts.invalid_items} inválidos.`)
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo aplicar el lote.')
      router.refresh()
    } finally {
      setWorking(false)
    }
  }

  async function cancelBatch(importId) {
    if (!canEdit) return
    setConfirmingImportId(null)
    setCancellingImportId(null)
    setWorking(true)
    setError('')
    setMessage('')
    try {
      await cancelBulkImportAction(importId, 'Cancelado desde el historial del Panel antes de aplicar registros.')
      setProgress(null)
      setMessage('Lote cancelado sin aplicar registros al grafo. Se conserva en el historial para trazabilidad.')
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo cancelar el lote.')
      router.refresh()
    } finally {
      setWorking(false)
    }
  }

  const progressPercent = progress?.total ? Math.min(100, Math.round((progress.current / progress.total) * 100)) : 0
  const hasCollisions = Boolean(analysis?.collisions?.length)

  return <div className={styles.workspace}>
    <section className={styles.card}>
      <div className={styles.cardHeading}>
        <div><span className={styles.kicker}>01 · Entrada</span><h2>Archivo o bloque de datos</h2></div>
        <span className={styles.formatPill}>CSV · JSON · JSONL</span>
      </div>

      <div className={styles.gridTwo}>
        <label className={styles.field}>Nombre del lote<input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Ej. Extraordinarias Sevilla 2026" disabled={!canEdit || working} /></label>
        <label className={styles.field}>Formato<select value={format} onChange={(event) => { setFormat(event.target.value); resetResult() }} disabled={!canEdit || working}><option value="json">JSON relacional</option><option value="jsonl">JSONL / NDJSON</option><option value="csv">CSV de una tabla</option></select></label>
      </div>

      {format === 'csv' ? <div className={styles.csvOptions}>
        <label className={styles.field}>Tabla<select value={csvTable} onChange={(event) => { setCsvTable(event.target.value); resetResult() }} disabled={!canEdit || working}>{IMPORTABLE_TABLES.map((table) => <option key={table} value={table}>{table}</option>)}</select></label>
        <label className={styles.field}>Operación<select value={csvOperation} onChange={(event) => { setCsvOperation(event.target.value); resetResult() }} disabled={!canEdit || working}><option value="upsert">Actualizar o crear</option><option value="insert">Solo crear</option></select></label>
        <label className={styles.field}>Clave de conflicto<input value={csvConflict} onChange={(event) => { setCsvConflict(event.target.value); resetResult() }} placeholder="slug o entity_id" disabled={!canEdit || working || csvOperation !== 'upsert'} /></label>
      </div> : null}

      <label className={styles.fileDrop}>Seleccionar archivo<input type="file" accept=".csv,.json,.jsonl,.ndjson,text/csv,application/json" onChange={handleFile} disabled={!canEdit || working} /><small>También funciona desde Archivos en iPhone/iPad. El formato se selecciona por la extensión del archivo; si pegas datos, elige el formato antes de analizarlos.</small></label>

      <label className={styles.field}>Contenido<textarea rows={12} value={text} onChange={(event) => { setText(event.target.value); resetResult() }} placeholder="Pega aquí un CSV, un JSON o un JSONL…" disabled={!canEdit || working} /></label>
      <div className={styles.actions}><button type="button" className={styles.secondaryButton} onClick={analyse} disabled={!canEdit || working || !text.trim()}>Analizar contenido</button>{analysis ? <button type="button" className={styles.primaryButton} onClick={prepareBatch} disabled={!canEdit || working || hasCollisions}>Preparar lote</button> : null}</div>
    </section>

    {analysis ? <section className={styles.card}>
      <div className={styles.cardHeading}><div><span className={styles.kicker}>02 · Preflight</span><h2>Vista previa y validación</h2></div><strong className={analysis.invalidCount || hasCollisions ? styles.warning : styles.success}>{analysis.records.length - analysis.invalidCount}/{analysis.records.length} válidos</strong></div>
      <div className={styles.summaryGrid}>{tableSummary.slice(0, 8).map(([table, count]) => <div key={table}><span>{table}</span><strong>{count}</strong></div>)}</div>
      <p className={styles.muted}>Transporte seguro: {analysis.transportChunks} bloque{analysis.transportChunks === 1 ? '' : 's'} · máximo {Math.round(DEFAULT_IMPORT_CHUNK_BYTES / 1000)} KB por envío · {analysis.operationCounts.insert} insert · {analysis.operationCounts.upsert} upsert aplicables.</p>
      {analysis.operationCounts.upsert > 0 ? <div className={styles.warningBox}>{analysis.operationCounts.upsert} registro{analysis.operationCounts.upsert === 1 ? '' : 's'} válido{analysis.operationCounts.upsert === 1 ? '' : 's'} usa{analysis.operationCounts.upsert === 1 ? '' : 'n'} <code>upsert</code>: al aplicar el lote pueden actualizar filas existentes cuando coincida su clave estable.</div> : null}
      {hasCollisions ? <div className={styles.warningBox}>
        <strong>{analysis.collisions.length} colisión{analysis.collisions.length === 1 ? '' : 'es'} de clave estable</strong><br />Dos o más registros válidos intentan actualizar el mismo destino. Corrige estas repeticiones antes de preparar el lote.
        <div className={styles.previewList}>{analysis.collisions.slice(0, 5).map((collision) => <article key={collision.signature} className={styles.previewError}>
          <div><strong>{collision.table}</strong><span>registros {collision.positions.map((position) => `#${position}`).join(', ')}</span></div>
          <code>{collision.target}</code>
        </article>)}</div>
        {analysis.collisions.length > 5 ? <small>Hay {analysis.collisions.length - 5} colisiones adicionales.</small> : null}
      </div> : null}
      {analysis.invalidCount ? <div className={styles.warningBox}>Los registros inválidos se conservarán en el lote para revisión, pero no se aplicarán. El resto sí podrá importarse.</div> : !hasCollisions ? <div className={styles.successBox}>La estructura del lote es válida y no contiene destinos de upsert repetidos. Las restricciones y referencias se volverán a comprobar al aplicar cada registro.</div> : null}
      <div className={styles.previewList}>{analysis.validations.slice(0, 6).map((item, index) => <article key={index} className={item.errors.length ? styles.previewError : ''}><div><b>#{index + 1}</b><strong>{item.record?.table || 'sin tabla'}</strong><span>{item.record?.operation || '—'}</span></div><code>{JSON.stringify(item.record?.data || {}).slice(0, 320)}</code>{item.errors.length ? <small>{item.errors.join(' ')}</small> : null}</article>)}</div>
      {analysis.records.length > 6 ? <p className={styles.muted}>Se muestran 6 registros de {analysis.records.length}. El lote completo se valida al prepararlo.</p> : null}
    </section> : null}

    {progress ? <section className={styles.progressCard} aria-live="polite"><div><strong>{progress.phase === 'staging' ? 'Preparando lote' : progress.phase === 'ready' ? 'Lote preparado' : 'Aplicando al grafo'}</strong><span>{progress.current} / {progress.total}</span></div><progress value={progressPercent} max="100">{progressPercent}%</progress></section> : null}
    {message ? <div className={styles.successBox}>{message}</div> : null}
    {error ? <div className={styles.errorBox}>{error}</div> : null}

    <section className={styles.card}>
      <div className={styles.cardHeading}><div><span className={styles.kicker}>03 · Historial</span><h2>Últimos lotes</h2></div><span className={styles.formatPill}>{initialImports.length}</span></div>
      {initialImports.length ? <div className={styles.historyList}>{initialImports.map((batch) => {
        const pending = pendingValidItems(batch)
        const operations = savedOperationCounts(batch)
        const canApply = canEdit && ['ready', 'processing'].includes(batch.status) && pending > 0
        const canCancel = canEdit && ['staging', 'ready'].includes(batch.status) && batch.applied_items === 0 && batch.failed_items === 0
        return <article key={batch.id}>
          <div className={styles.historyMain}><div><strong>{batch.label}</strong><span>{batch.source_name || batch.source_format.toUpperCase()} · {formatDate(batch.created_at)}</span></div><span className={styles.status}>{statusLabel(batch.status)}</span></div>
          <div className={styles.historyMetrics}><span><b>{batch.staged_items}</b> preparados</span><span><b>{batch.applied_items}</b> aplicados</span><span><b>{batch.invalid_items}</b> inválidos</span><span><b>{batch.failed_items}</b> fallidos</span>{operations.upsert ? <span><b>{operations.upsert}</b> upsert</span> : null}{batch.metadata?.transport_chunks ? <span><b>{batch.metadata.transport_chunks}</b> envíos</span> : null}</div>
          <div className={styles.actions}>
            <a className={styles.secondaryButton} style={{ textDecoration: 'none' }} href={`/panel/datos/importar/${batch.id}`}>Ver detalle</a>
            {canCancel && cancellingImportId !== batch.id ? <button type="button" className={styles.secondaryButton} onClick={() => { setConfirmingImportId(null); setCancellingImportId(batch.id) }} disabled={working}>Cancelar lote</button> : null}
            {canApply && confirmingImportId !== batch.id ? <button type="button" className={styles.primaryButton} onClick={() => { setCancellingImportId(null); setConfirmingImportId(batch.id) }} disabled={working}>Revisar y aplicar</button> : null}
          </div>
          {canCancel && cancellingImportId === batch.id ? <div className={styles.warningBox}>
            <strong>Cancelar sin escribir en el grafo</strong><br />El lote quedará marcado como cancelado y se conservará en el historial. Los registros ya preparados no se aplicarán.
            <div className={styles.actions}><button type="button" className={styles.secondaryButton} onClick={() => setCancellingImportId(null)} disabled={working}>Volver</button><button type="button" className={styles.primaryButton} onClick={() => cancelBatch(batch.id)} disabled={working}>Confirmar cancelación</button></div>
          </div> : null}
          {canApply && confirmingImportId === batch.id ? <div className={styles.warningBox}>
            <strong>Confirmación antes de escribir</strong><br />Se aplicarán {pending} registros válidos. {operations.upsert > 0 ? `${operations.upsert} usan upsert y pueden actualizar filas existentes si coincide su clave.` : 'Este lote no registra upserts aplicables en sus metadatos.'}
            <div className={styles.actions}><button type="button" className={styles.secondaryButton} onClick={() => setConfirmingImportId(null)} disabled={working}>Cancelar</button><button type="button" className={styles.primaryButton} onClick={() => applyBatch(batch.id)} disabled={working}>Confirmar aplicación</button></div>
          </div> : null}
        </article>
      })}</div> : <p className={styles.muted}>Todavía no hay importaciones masivas.</p>}
    </section>

    <details className={styles.card}>
      <summary>Formato JSON relacional para paquetes generados por Hilo Cofrade</summary>
      <p className={styles.muted}>Cada registro declara tabla, operación y datos. <code>refs</code> permite resolver IDs por claves naturales, por ejemplo el <code>slug</code> de una entidad creada unas líneas antes.</p>
      <pre className={styles.codeBlock}>{JSON_EXAMPLE}</pre>
    </details>
  </div>
}

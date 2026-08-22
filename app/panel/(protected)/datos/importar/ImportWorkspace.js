'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IMPORTABLE_TABLES, validateBulkImportRecord } from '@/lib/panel/bulk-import-config'
import { parseBulkImportText, splitImportPayload } from '@/lib/panel/bulk-import-parser'
import {
  appendBulkImportItemsAction,
  applyBulkImportChunkAction,
  createBulkImportAction,
  finalizeBulkImportAction,
} from './actions'
import styles from './import.module.css'

function inferFormat(name) {
  const lower = String(name || '').toLowerCase()
  if (lower.endsWith('.csv')) return 'csv'
  if (lower.endsWith('.jsonl') || lower.endsWith('.ndjson')) return 'jsonl'
  if (lower.endsWith('.json')) return 'json'
  return 'auto'
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
  const [format, setFormat] = useState('auto')
  const [csvTable, setCsvTable] = useState('entities')
  const [csvOperation, setCsvOperation] = useState('upsert')
  const [csvConflict, setCsvConflict] = useState('slug')
  const [analysis, setAnalysis] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [working, setWorking] = useState(false)
  const [progress, setProgress] = useState(null)

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
    if (inferred !== 'auto') setFormat(inferred)
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
      const invalid = validations.filter((item) => item.errors.length)
      setAnalysis({ ...parsed, records: validations.map((item) => item.record), validations, invalidCount: invalid.length })
      setMessage(`Análisis terminado: ${parsed.records.length} registros · ${invalid.length} con incidencias de estructura.`)
    } catch (caught) {
      setAnalysis(null)
      setError(caught instanceof Error ? caught.message : 'No se pudo analizar el contenido.')
    }
  }

  async function prepareBatch() {
    if (!analysis || !canEdit) return
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
        metadata: { table_counts: Object.fromEntries(tableSummary) },
      })

      let offset = 0
      for (let index = 0; index < batches.length; index += 1) {
        setProgress({ phase: 'staging', current: offset, total: analysis.records.length })
        await appendBulkImportItemsAction(batch.id, offset, batches[index])
        offset += batches[index].length
      }
      const final = await finalizeBulkImportAction(batch.id)
      setProgress({ phase: 'ready', current: offset, total: analysis.records.length })
      setMessage(`Lote preparado: ${final.counts.valid_items} válidos · ${final.counts.invalid_items} con incidencias. Revisa el resumen y aplica los registros válidos cuando quieras.`)
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo preparar el lote.')
    } finally {
      setWorking(false)
    }
  }

  async function applyBatch(importId) {
    if (!canEdit) return
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

  const progressPercent = progress?.total ? Math.min(100, Math.round((progress.current / progress.total) * 100)) : 0

  return <div className={styles.workspace}>
    <section className={styles.card}>
      <div className={styles.cardHeading}>
        <div><span className={styles.kicker}>01 · Entrada</span><h2>Archivo o bloque de datos</h2></div>
        <span className={styles.formatPill}>CSV · JSON · JSONL</span>
      </div>

      <div className={styles.gridTwo}>
        <label className={styles.field}>Nombre del lote<input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Ej. Extraordinarias Sevilla 2026" disabled={!canEdit || working} /></label>
        <label className={styles.field}>Formato<select value={format} onChange={(event) => { setFormat(event.target.value); resetResult() }} disabled={!canEdit || working}><option value="auto">Detectar automáticamente</option><option value="json">JSON relacional</option><option value="jsonl">JSONL / NDJSON</option><option value="csv">CSV de una tabla</option></select></label>
      </div>

      {format === 'csv' ? <div className={styles.csvOptions}>
        <label className={styles.field}>Tabla<select value={csvTable} onChange={(event) => { setCsvTable(event.target.value); resetResult() }} disabled={!canEdit || working}>{IMPORTABLE_TABLES.map((table) => <option key={table} value={table}>{table}</option>)}</select></label>
        <label className={styles.field}>Operación<select value={csvOperation} onChange={(event) => { setCsvOperation(event.target.value); resetResult() }} disabled={!canEdit || working}><option value="upsert">Actualizar o crear</option><option value="insert">Solo crear</option></select></label>
        <label className={styles.field}>Clave de conflicto<input value={csvConflict} onChange={(event) => { setCsvConflict(event.target.value); resetResult() }} placeholder="slug o entity_id" disabled={!canEdit || working || csvOperation !== 'upsert'} /></label>
      </div> : null}

      <label className={styles.fileDrop}>Seleccionar archivo<input type="file" accept=".csv,.json,.jsonl,.ndjson,text/csv,application/json" onChange={handleFile} disabled={!canEdit || working} /><small>También funciona desde Archivos en iPhone/iPad. El fichero se lee en el navegador y se envía al servidor por bloques.</small></label>

      <label className={styles.field}>Contenido<textarea rows={12} value={text} onChange={(event) => { setText(event.target.value); resetResult() }} placeholder="Pega aquí un CSV, un JSON o un JSONL…" disabled={!canEdit || working} /></label>
      <div className={styles.actions}><button type="button" className={styles.secondaryButton} onClick={analyse} disabled={!canEdit || working || !text.trim()}>Analizar contenido</button>{analysis ? <button type="button" className={styles.primaryButton} onClick={prepareBatch} disabled={!canEdit || working}>Preparar lote</button> : null}</div>
    </section>

    {analysis ? <section className={styles.card}>
      <div className={styles.cardHeading}><div><span className={styles.kicker}>02 · Preflight</span><h2>Vista previa y validación</h2></div><strong className={analysis.invalidCount ? styles.warning : styles.success}>{analysis.records.length - analysis.invalidCount}/{analysis.records.length} válidos</strong></div>
      <div className={styles.summaryGrid}>{tableSummary.slice(0, 8).map(([table, count]) => <div key={table}><span>{table}</span><strong>{count}</strong></div>)}</div>
      {analysis.invalidCount ? <div className={styles.warningBox}>Los registros inválidos se conservarán en el lote para revisión, pero no se aplicarán. El resto sí podrá importarse.</div> : <div className={styles.successBox}>La estructura del lote es válida. Las restricciones y referencias se volverán a comprobar al aplicar cada registro.</div>}
      <div className={styles.previewList}>{analysis.validations.slice(0, 6).map((item, index) => <article key={index} className={item.errors.length ? styles.previewError : ''}><div><b>#{index + 1}</b><strong>{item.record?.table || 'sin tabla'}</strong><span>{item.record?.operation || '—'}</span></div><code>{JSON.stringify(item.record?.data || {}).slice(0, 320)}</code>{item.errors.length ? <small>{item.errors.join(' ')}</small> : null}</article>)}</div>
      {analysis.records.length > 6 ? <p className={styles.muted}>Se muestran 6 registros de {analysis.records.length}. El lote completo se valida al prepararlo.</p> : null}
    </section> : null}

    {progress ? <section className={styles.progressCard} aria-live="polite"><div><strong>{progress.phase === 'staging' ? 'Preparando lote' : progress.phase === 'ready' ? 'Lote preparado' : 'Aplicando al grafo'}</strong><span>{progress.current} / {progress.total}</span></div><progress value={progressPercent} max="100">{progressPercent}%</progress></section> : null}
    {message ? <div className={styles.successBox}>{message}</div> : null}
    {error ? <div className={styles.errorBox}>{error}</div> : null}

    <section className={styles.card}>
      <div className={styles.cardHeading}><div><span className={styles.kicker}>03 · Historial</span><h2>Últimos lotes</h2></div><span className={styles.formatPill}>{initialImports.length}</span></div>
      {initialImports.length ? <div className={styles.historyList}>{initialImports.map((batch) => <article key={batch.id}>
        <div className={styles.historyMain}><div><strong>{batch.label}</strong><span>{batch.source_name || batch.source_format.toUpperCase()} · {formatDate(batch.created_at)}</span></div><span className={styles.status}>{statusLabel(batch.status)}</span></div>
        <div className={styles.historyMetrics}><span><b>{batch.staged_items}</b> preparados</span><span><b>{batch.applied_items}</b> aplicados</span><span><b>{batch.invalid_items}</b> inválidos</span><span><b>{batch.failed_items}</b> fallidos</span></div>
        {canEdit && ['ready', 'processing'].includes(batch.status) && batch.valid_items > batch.applied_items + batch.failed_items ? <button type="button" className={styles.primaryButton} onClick={() => applyBatch(batch.id)} disabled={working}>Aplicar registros válidos</button> : null}
      </article>)}</div> : <p className={styles.muted}>Todavía no hay importaciones masivas.</p>}
    </section>

    <details className={styles.card}>
      <summary>Formato JSON relacional para paquetes generados por Hilo Cofrade</summary>
      <p className={styles.muted}>Cada registro declara tabla, operación y datos. <code>refs</code> permite resolver IDs por claves naturales, por ejemplo el <code>slug</code> de una entidad creada unas líneas antes.</p>
      <pre className={styles.codeBlock}>{JSON_EXAMPLE}</pre>
    </details>
  </div>
}

'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { analyseSourceAction, prepareAssistedBatchAction } from './actions'
import styles from './ingestion.module.css'

function sourceLines(value) {
  return String(value || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export default function AssistedBatchStart({ targets, canEdit, aiConfigured }) {
  const router = useRouter()
  const [targetEntityId, setTargetEntityId] = useState('')
  const [sourceUrls, setSourceUrls] = useState('')
  const [working, setWorking] = useState(false)
  const [progress, setProgress] = useState(null)
  const [error, setError] = useState('')
  const [failures, setFailures] = useState([])
  const [partialBatchId, setPartialBatchId] = useState(null)

  const lineCount = useMemo(() => sourceLines(sourceUrls).length, [sourceUrls])

  async function startBatch(event) {
    event.preventDefault()
    if (!canEdit || !aiConfigured || working) return
    setWorking(true)
    setError('')
    setFailures([])
    setPartialBatchId(null)
    setProgress(null)

    try {
      const prepared = await prepareAssistedBatchAction({
        targetEntityId,
        sourceUrls: sourceLines(sourceUrls),
      })
      const failed = []
      let completed = 0
      let successful = 0

      for (const sourceUrl of prepared.urls) {
        setProgress({
          current: completed,
          total: prepared.urls.length,
          sourceUrl,
        })
        try {
          await analyseSourceAction({
            sourceUrl,
            targetEntityId: prepared.targetEntityId,
            batchId: prepared.batchId,
          })
          successful += 1
        } catch (caught) {
          failed.push({
            sourceUrl,
            message: caught instanceof Error ? caught.message : 'No se pudo analizar esta Fuente.',
          })
        }
        completed += 1
      }

      setProgress({ current: completed, total: prepared.urls.length, sourceUrl: null })
      if (!successful) {
        setFailures(failed)
        throw new Error('Ninguna Fuente pudo incorporarse a la tanda. Revisa las incidencias antes de repetirla.')
      }

      if (failed.length) {
        setFailures(failed)
        setPartialBatchId(prepared.batchId)
      } else {
        router.push(`/panel/datos/ingestion/lotes/${prepared.batchId}`)
        router.refresh()
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo preparar la tanda de ingestión.')
    } finally {
      setWorking(false)
    }
  }

  return <section className={styles.card}>
    <div className={styles.cardHeading}>
      <div><span className={styles.kicker}>HC-AUTO-01</span><h2>Ingestión por lote de Fuentes</h2></div>
      <span className={styles.status}>2–30 URLs</span>
    </div>
    <p className={styles.lead}>Agrupa varias páginas oficiales de una misma Hermandad. Cada Fuente conserva su huella y su propuesta independiente; después se revisan y se convierten en un único lote gobernado.</p>

    {!aiConfigured ? <div className={styles.warningBox}><strong>Motor de extracción sin credencial.</strong><br />La tanda puede verse en el Panel, pero necesita <code>OPENAI_API_KEY</code> en el servidor para analizar sus Fuentes.</div> : null}

    <form onSubmit={startBatch} className={styles.formGrid}>
      <label className={styles.field}>
        <span>Hermandad objetivo</span>
        <select value={targetEntityId} onChange={(event) => setTargetEntityId(event.target.value)} required disabled={!canEdit || working}>
          <option value="">Selecciona una Hermandad…</option>
          {targets.map((target) => <option key={target.id} value={target.id}>{target.name}</option>)}
        </select>
      </label>

      <label className={styles.field}>
        <span>URLs oficiales · una por línea</span>
        <textarea
          rows={8}
          value={sourceUrls}
          onChange={(event) => setSourceUrls(event.target.value)}
          placeholder={'https://hermandad.es/historia\nhttps://hermandad.es/titulares\nhttps://hermandad.es/patrimonio'}
          disabled={!canEdit || working}
        />
        <small>{lineCount} línea{lineCount === 1 ? '' : 's'} · se eliminan duplicados y parámetros de seguimiento antes de empezar.</small>
      </label>

      <div className={styles.actions}>
        <button className={styles.primaryButton} type="submit" disabled={!canEdit || !aiConfigured || working || !targetEntityId || lineCount < 2 || lineCount > 30}>
          {working ? 'Procesando tanda…' : 'Analizar Fuentes en tanda'}
        </button>
      </div>
    </form>

    {progress ? <div className={styles.batchProgress}>
      <div><span>Progreso</span><strong>{progress.current}/{progress.total}</strong></div>
      <progress max={progress.total} value={progress.current} />
      {progress.sourceUrl ? <small>{progress.sourceUrl}</small> : null}
    </div> : null}

    {failures.length ? <div className={styles.warningBox}>
      <strong>{failures.length} Fuente{failures.length === 1 ? '' : 's'} con incidencia</strong>
      <ul>{failures.map((item) => <li key={item.sourceUrl}><b>{item.sourceUrl}</b>: {item.message}</li>)}</ul>
      {partialBatchId ? <div className={styles.inlineLinks}><Link className={styles.secondaryButton} href={`/panel/datos/ingestion/lotes/${partialBatchId}`}>Abrir las propuestas válidas</Link></div> : null}
    </div> : null}

    {error ? <div className={styles.errorBox}>{error}</div> : null}
  </section>
}
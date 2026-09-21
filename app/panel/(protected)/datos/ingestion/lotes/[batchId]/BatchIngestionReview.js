'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { stageAssistedBatchAction } from '../../actions'
import styles from '../../ingestion.module.css'

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
}

function reviewState(item) {
  if (item.application_summary?.bulk_import_id) return 'lote'
  if (item.application_summary?.review?.saved_at) return 'revisada'
  return 'pendiente'
}

function stateLabel(state) {
  return { lote: 'Lote generado', revisada: 'Revisión guardada', pendiente: 'Pendiente' }[state] || state
}

export default function BatchIngestionReview({ batchId, target, imports, canEdit }) {
  const router = useRouter()
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const states = useMemo(() => imports.map((item) => reviewState(item)), [imports])
  const reviewed = states.filter((state) => state === 'revisada').length
  const alreadyStaged = imports.find((item) => item.application_summary?.bulk_import_id)?.application_summary?.bulk_import_id || null
  const ready = reviewed === imports.length && !alreadyStaged

  async function generateBatch() {
    if (!canEdit || !ready || working) return
    setWorking(true)
    setError('')
    setMessage('')
    try {
      const result = await stageAssistedBatchAction(batchId, imports.map((item) => item.id))
      setMessage(result.blocked
        ? 'El preflight conjunto ha encontrado incidencias. Abriendo el diagnóstico del lote…'
        : `Lote conjunto preparado con ${result.sourceCount} Fuentes. Abriendo el plan efectivo antes de Apply…`)
      router.push(`/panel/datos/importar/${result.bulkImportId}`)
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo generar el lote conjunto.')
    } finally {
      setWorking(false)
    }
  }

  return <div className={styles.workspace}>
    <section className={styles.card}>
      <div className={styles.cardHeading}>
        <div><span className={styles.kicker}>Estado de la tanda</span><h2>Fuentes y revisión editorial</h2></div>
        <span className={styles.status}>{reviewed}/{imports.length} revisadas</span>
      </div>
      <div className={styles.guardrailGrid}>
        <div><strong>{imports.length}</strong><span>Fuentes capturadas</span></div>
        <div><strong>{reviewed}</strong><span>revisiones guardadas</span></div>
        <div><strong>{imports.reduce((sum, item) => sum + (item.analysis?.entities?.length || 0), 0)}</strong><span>entidades propuestas</span></div>
        <div><strong>{imports.reduce((sum, item) => sum + (item.analysis?.relations?.length || 0), 0)}</strong><span>relaciones propuestas</span></div>
      </div>
      <p className={styles.lead}>Cada Fuente se revisa por separado para conservar su evidencia. Al final, HC-AUTO-01 unifica entidades nuevas repetidas entre Fuentes y genera un solo preflight.</p>
    </section>

    <section className={styles.card}>
      <div className={styles.cardHeading}>
        <div><span className={styles.kicker}>Paso 1</span><h2>Revisar propuestas</h2></div>
        <span className={styles.status}>{target.name}</span>
      </div>
      <div className={styles.historyList}>
        {imports.map((item, index) => {
          const state = reviewState(item)
          const analysis = item.analysis || {}
          return <article key={item.id}>
            <div className={styles.historyMain}>
              <div>
                <strong>{index + 1}. {item.source_title || item.source_url}</strong>
                <span>{formatDate(item.fetched_at || item.created_at)} · {analysis.entities?.length || 0} entidades · {analysis.relations?.length || 0} relaciones</span>
              </div>
              <span className={styles.status}>{stateLabel(state)}</span>
            </div>
            <div className={styles.historyActions}>
              <span className={styles.sourceUrl}>{item.source_url}</span>
              <Link className={state === 'revisada' ? styles.secondaryButton : styles.primaryButton} href={`/panel/datos/ingestion/${item.id}?batch=${batchId}`}>
                {state === 'revisada' ? 'Revisar de nuevo' : state === 'lote' ? 'Ver propuesta' : 'Revisar propuesta'}
              </Link>
            </div>
            {analysis.warnings?.length ? <small className={styles.blockedText}>{analysis.warnings.length} aviso{analysis.warnings.length === 1 ? '' : 's'} del análisis</small> : null}
          </article>
        })}
      </div>
    </section>

    <section className={styles.card}>
      <div className={styles.cardHeading}>
        <div><span className={styles.kicker}>Paso 2</span><h2>Generar un único lote gobernado</h2></div>
        <span className={styles.status}>{alreadyStaged ? 'Preparado' : ready ? 'Listo para preflight' : 'Esperando revisión'}</span>
      </div>

      {alreadyStaged ? <div className={styles.successBox}>
        <strong>La tanda ya está vinculada a un lote.</strong>
        <div className={styles.inlineLinks}><Link className={styles.primaryButton} href={`/panel/datos/importar/${alreadyStaged}`}>Ver plan efectivo</Link></div>
      </div> : <>
        <p className={styles.lead}>El botón solo se habilita cuando todas las Fuentes tienen una revisión guardada. El lote resultante sigue sujeto al preflight global: una sola incidencia bloquea Apply.</p>
        <div className={styles.actions}>
          <button className={styles.primaryButton} type="button" onClick={generateBatch} disabled={!canEdit || !ready || working}>
            {working ? 'Construyendo lote y ejecutando preflight…' : 'Generar lote conjunto y ejecutar preflight'}
          </button>
        </div>
      </>}

      {message ? <div className={styles.successBox}>{message}</div> : null}
      {error ? <div className={styles.errorBox}>{error}</div> : null}
    </section>
  </div>
}
'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { analyseSourceAction } from './actions'
import styles from './ingestion.module.css'

function formatDate(value) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(value))
}

function statusLabel(item) {
  if (item.application_summary?.bulk_import_id) return item.application_summary.blocked ? 'Lote bloqueado' : 'Lote preparado'
  return { review: 'Pendiente de revisión', applied: 'Aplicado', discarded: 'Descartado', failed: 'Fallido' }[item.status] || item.status
}

export default function IngestionStart({ targets, recentImports, canEdit, aiConfigured }) {
  const router = useRouter()
  const [sourceUrl, setSourceUrl] = useState('')
  const [targetEntityId, setTargetEntityId] = useState('')
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const targetById = useMemo(() => new Map(targets.map((target) => [target.id, target.name])), [targets])

  async function analyse(event) {
    event.preventDefault()
    if (!canEdit || working) return
    setWorking(true)
    setError('')
    setMessage('')
    try {
      const result = await analyseSourceAction({ sourceUrl, targetEntityId })
      setMessage(result.reused ? 'Esta misma versión de la Fuente ya estaba analizada. Abriendo la propuesta existente…' : 'Fuente analizada. Abriendo la revisión editorial…')
      router.push(`/panel/datos/ingestion/${result.id}`)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'No se pudo analizar la Fuente.')
    } finally {
      setWorking(false)
    }
  }

  return <div className={styles.workspace}>
    <section className={styles.card}>
      <div className={styles.cardHeading}>
        <div><span className={styles.kicker}>Paso 1</span><h2>Capturar una Fuente</h2></div>
        <span className={styles.status}>HTML · texto</span>
      </div>
      <p className={styles.lead}>El sistema normaliza la URL, impide accesos a redes privadas, descarga un máximo de 2 MB, calcula su huella SHA-256 y evita volver a analizar la misma versión para la misma Hermandad.</p>
      {!aiConfigured ? <div className={styles.warningBox}><strong>Motor de extracción sin credencial.</strong><br />La interfaz y el circuito están disponibles, pero el servidor necesita <code>OPENAI_API_KEY</code> para ejecutar el análisis automático.</div> : null}
      <form onSubmit={analyse} className={styles.formGrid}>
        <label className={styles.field}>
          <span>Hermandad objetivo</span>
          <select value={targetEntityId} onChange={(event) => setTargetEntityId(event.target.value)} required disabled={!canEdit || working}>
            <option value="">Selecciona una Hermandad…</option>
            {targets.map((target) => <option key={target.id} value={target.id}>{target.name}</option>)}
          </select>
        </label>
        <label className={styles.field}>
          <span>URL de la Fuente</span>
          <input
            type="url"
            inputMode="url"
            placeholder="https://hermandad.es/historia"
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
            required
            disabled={!canEdit || working}
          />
        </label>
        <div className={styles.actions}>
          <button className={styles.primaryButton} type="submit" disabled={!canEdit || !aiConfigured || working || !targetEntityId || !sourceUrl}>
            {working ? 'Analizando Fuente…' : 'Analizar y preparar propuesta'}
          </button>
        </div>
      </form>
      {message ? <div className={styles.successBox}>{message}</div> : null}
      {error ? <div className={styles.errorBox}>{error}</div> : null}
    </section>

    <section className={styles.card}>
      <div className={styles.cardHeading}>
        <div><span className={styles.kicker}>Trazabilidad</span><h2>Últimas propuestas</h2></div>
        <span className={styles.status}>{recentImports.length}</span>
      </div>
      {recentImports.length ? <div className={styles.historyList}>{recentImports.map((item) => <article key={item.id}>
        <div className={styles.historyMain}>
          <div>
            <strong>{item.source_title || item.source_url}</strong>
            <span>{item.target_name || targetById.get(item.target_entity_id) || 'Hermandad'} · {formatDate(item.created_at)}</span>
          </div>
          <span className={styles.status}>{statusLabel(item)}</span>
        </div>
        <div className={styles.historyActions}>
          <span className={styles.sourceUrl}>{item.source_url}</span>
          <Link className={styles.secondaryButton} href={`/panel/datos/ingestion/${item.id}`}>Revisar</Link>
        </div>
      </article>)}</div> : <div className={styles.emptyBox}>Todavía no hay propuestas de ingestión asistida. La primera Fuente que analices quedará registrada aquí.</div>}
    </section>

    <section className={styles.card}>
      <div className={styles.cardHeading}><div><span className={styles.kicker}>Gobernanza</span><h2>Qué no hace automáticamente</h2></div></div>
      <div className={styles.guardrailGrid}>
        <div><strong>No publica</strong><span>Los nodos nuevos nacen en borrador.</span></div>
        <div><strong>No aplica</strong><span>Primero genera un lote y pasa el preflight global.</span></div>
        <div><strong>No inventa</strong><span>Cada propuesta debe conservar evidencia de la Fuente.</span></div>
        <div><strong>No duplica a ciegas</strong><span>Busca coincidencias exactas antes de proponer un nodo nuevo.</span></div>
      </div>
    </section>
  </div>
}

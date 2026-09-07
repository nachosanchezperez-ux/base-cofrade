import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requirePanelUser } from '@/lib/panel/auth'
import { getBulkImportDetail } from '@/lib/panel/bulk-import'
import { retryBulkImportFailuresAction } from '../actions'
import panelStyles from '@/app/panel/panel.module.css'
import styles from '../import.module.css'

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

function operationCounts(batch) {
  const counts = batch?.metadata?.operation_counts || {}
  return {
    insert: Number(counts.insert) || 0,
    upsert: Number(counts.upsert) || 0,
  }
}

function effectiveOperationCounts(batch) {
  const counts = batch?.metadata?.preflight?.effective_operation_counts || {}
  return {
    insert: Number(counts.insert) || 0,
    update: Number(counts.update) || 0,
    reuse: Number(counts.reuse) || 0,
  }
}

export default async function BulkImportDetailPage({ params }) {
  const { id } = await params
  const user = await requirePanelUser()
  const detail = await getBulkImportDetail(id)
  if (!detail) notFound()

  const { batch, items, issues } = detail
  const canEdit = ['admin', 'editor'].includes(user.role)
  const retryAction = retryBulkImportFailuresAction.bind(null, batch.id)
  const operations = operationCounts(batch)
  const effective = effectiveOperationCounts(batch)

  return <div className={panelStyles.pageWrap}>
    <header className={panelStyles.pageHeader}>
      <div>
        <span className={panelStyles.eyebrow}>Importación masiva · Detalle</span>
        <h1>{batch.label}</h1>
        <p>{batch.source_name || batch.source_format.toUpperCase()} · {statusLabel(batch.status)}</p>
      </div>
      <Link className={panelStyles.rowLink} href="/panel/datos/importar">← Volver a importaciones</Link>
    </header>

    <div className={styles.workspace}>
      <section className={styles.card}>
        <div className={styles.cardHeading}><div><span className={styles.kicker}>Resumen</span><h2>Estado del lote</h2></div><span className={styles.status}>{statusLabel(batch.status)}</span></div>
        <div className={styles.summaryGrid}>
          <div><span>Preparados</span><strong>{batch.staged_items}</strong></div>
          <div><span>Válidos</span><strong>{batch.valid_items}</strong></div>
          <div><span>Aplicados</span><strong>{batch.applied_items}</strong></div>
          <div><span>Incidencias</span><strong>{batch.invalid_items + batch.failed_items}</strong></div>
        </div>
        {batch.metadata?.preflight ? <p className={styles.muted}>Plan efectivo: {effective.insert} insert · {effective.update} update · {effective.reuse} reuse{batch.metadata?.transport_chunks ? ` · ${batch.metadata.transport_chunks} envíos de staging` : ''}.</p> : batch.metadata?.operation_counts || batch.metadata?.transport_chunks ? <p className={styles.muted}>Perfil solicitado: {operations.insert} insert · {operations.upsert} upsert{batch.metadata?.transport_chunks ? ` · ${batch.metadata.transport_chunks} envíos de preparación` : ''}.</p> : null}
        {batch.metadata?.preflight && !batch.metadata.preflight.can_apply ? <div className={styles.errorBox}><strong>Apply bloqueado por el preflight global</strong><br />El lote contiene incidencias deterministas. No se aplicará ningún registro hasta preparar un lote completamente válido.</div> : null}
        {batch.status === 'cancelled' && batch.metadata?.cancellation_reason ? <div className={styles.warningBox}><strong>Lote cancelado antes de aplicar registros</strong><br />{batch.metadata.cancellation_reason}</div> : null}
        {operations.upsert > 0 && ['ready', 'processing'].includes(batch.status) ? <div className={styles.warningBox}>{operations.upsert} registro{operations.upsert === 1 ? '' : 's'} usa{operations.upsert === 1 ? '' : 'n'} <code>upsert</code> y puede{operations.upsert === 1 ? '' : 'n'} actualizar filas existentes cuando coincida la clave de conflicto.</div> : null}
        {canEdit && batch.failed_items > 0 ? <form action={retryAction}><button type="submit" className={styles.secondaryButton}>Reintentar {batch.failed_items} fallido{batch.failed_items === 1 ? '' : 's'}</button></form> : null}
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeading}><div><span className={styles.kicker}>Preflight</span><h2>Plan efectivo por registro</h2></div><span className={styles.formatPill}>{items.length}</span></div>
        {items.length ? <div className={styles.previewList}>{items.map((item) => {
          const requested = item.result?.requested_operation || item.operation || '—'
          const effectiveOperation = item.result?.effective_operation || '—'
          const references = item.result?.resolved_references || []
          return <article key={item.id} className={['invalid', 'failed'].includes(item.status) ? styles.previewError : ''}>
            <div><b>#{item.position + 1}</b><strong>{item.table_name}</strong><span>{requested} → {effectiveOperation}</span><span>{item.result?.state || item.status}</span></div>
            {references.length ? <code>{references.map((ref) => `${ref.target_column}: ${ref.state}${ref.provider_position ? ` (#${ref.provider_position})` : ''}`).join(' · ')}</code> : <code>Sin referencias relacionales</code>}
            {item.validation_errors?.length ? <small>{item.validation_errors.join(' ')}</small> : null}
          </article>
        })}</div> : <div className={styles.warningBox}>El lote todavía no contiene registros de staging.</div>}
        {batch.staged_items > 500 ? <p className={styles.muted}>Se muestran los primeros 500 registros del plan. Los contadores corresponden al lote completo.</p> : null}
      </section>

      <section className={styles.card}>
        <div className={styles.cardHeading}><div><span className={styles.kicker}>Diagnóstico</span><h2>Registros con incidencias</h2></div><span className={styles.formatPill}>{issues.length}</span></div>
        {issues.length ? <div className={styles.previewList}>{issues.map((item) => <article key={item.id} className={styles.previewError}>
          <div><b>#{item.position + 1}</b><strong>{item.table_name}</strong><span>{item.status === 'invalid' ? 'Estructura inválida' : 'Falló al aplicar'}</span></div>
          <code>{JSON.stringify(item.record?.data || {}).slice(0, 500)}</code>
          <small>{item.error_text || item.validation_errors?.join(' ') || 'Incidencia sin detalle.'}</small>
        </article>)}</div> : <div className={styles.successBox}>Este lote no tiene registros inválidos ni fallidos.</div>}
        {batch.invalid_items + batch.failed_items > 500 ? <p className={styles.muted}>Se muestran las primeras 500 incidencias. Corrige el patrón de origen antes de repetir una carga de este tamaño.</p> : null}
      </section>
    </div>
  </div>
}

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

export default async function BulkImportDetailPage({ params }) {
  const { id } = await params
  const user = await requirePanelUser()
  const detail = await getBulkImportDetail(id)
  if (!detail) notFound()

  const { batch, issues } = detail
  const canEdit = ['admin', 'editor'].includes(user.role)
  const retryAction = retryBulkImportFailuresAction.bind(null, batch.id)

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
        {canEdit && batch.failed_items > 0 ? <form action={retryAction}><button type="submit" className={styles.secondaryButton}>Reintentar {batch.failed_items} fallido{batch.failed_items === 1 ? '' : 's'}</button></form> : null}
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

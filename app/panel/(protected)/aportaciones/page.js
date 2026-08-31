import Link from 'next/link'
import { requirePanelUser } from '@/lib/panel/auth'
import {
  CONTRIBUTION_STATUS_LABELS,
  CONTRIBUTION_TYPE_LABELS,
  getPanelContributions,
} from '@/lib/panel/contributions'
import { reviewContributionAction } from './actions'
import localStyles from './aportaciones.module.css'
import styles from '@/app/panel/panel.module.css'

export const metadata = { title: 'Aportaciones · Panel' }

function formatDate(value) {
  if (!value) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Madrid',
  }).format(new Date(value))
}

function safeExternalUrl(value) {
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : ''
  } catch {
    return ''
  }
}

function queryHref(query, id) {
  const params = new URLSearchParams()
  for (const key of ['status', 'type', 'search']) {
    if (query?.[key]) params.set(key, String(query[key]))
  }
  params.set('id', id)
  return `/panel/aportaciones?${params.toString()}`
}

export default async function PanelContributionsPage({ searchParams }) {
  const query = await searchParams
  const [user, data] = await Promise.all([
    requirePanelUser(),
    getPanelContributions({
      status: query?.status,
      type: query?.type,
      search: query?.search,
      focusedId: String(query?.id || ''),
    }),
  ])
  const canEdit = ['admin', 'editor'].includes(user.role)
  const pendingCount = data.contributions.filter((item) => item.status === 'pending').length
  const focused = data.focused

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Colaboración pública</span>
          <h1>Aportaciones</h1>
          <p>Cola privada para contrastar propuestas. Aceptar una aportación nunca modifica una ficha automáticamente.</p>
        </div>
      </header>

      {query?.saved === 'reviewed' ? <div className={styles.savedNotice} role="status">La revisión se ha guardado y auditado.</div> : null}
      {!canEdit ? <div className={styles.readOnlyNotice}>Tu perfil puede consultar la cola, pero no resolver aportaciones.</div> : null}

      <div className={styles.metricGrid}>
        <article className={styles.metricCard}><span>Pendientes visibles</span><strong>{pendingCount}</strong><small>Según el filtro actual</small></article>
        <article className={styles.metricCard}><span>Resultados</span><strong>{data.contributions.length}</strong><small>Máximo 100 recientes</small></article>
        <article className={styles.metricCard}><span>Archivos</span><strong>{data.contributions.reduce((sum, item) => sum + (item.contribution_attachments?.length || 0), 0)}</strong><small>Siempre en cuarentena privada</small></article>
      </div>

      <form className={styles.filters}>
        <label><span>Estado</span><select name="status" defaultValue={String(query?.status || '')}><option value="">Todos</option>{Object.entries(CONTRIBUTION_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label><span>Tipo</span><select name="type" defaultValue={String(query?.type || '')}><option value="">Todos</option>{Object.entries(CONTRIBUTION_TYPE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label><span>Buscar título</span><input name="search" defaultValue={String(query?.search || '')} maxLength={100} /></label>
        <button className={styles.secondaryButton} type="submit">Filtrar</button>
      </form>

      {focused ? (
        <article className={localStyles.detail} aria-labelledby="aportacion-abierta">
          <header className={localStyles.detailHeader}>
            <div>
              <span className={styles.eyebrow}>{CONTRIBUTION_TYPE_LABELS[focused.contribution_type]}</span>
              <h2 id="aportacion-abierta">{focused.title}</h2>
              <p>Recibida {formatDate(focused.created_at)} · Referencia HC-{focused.id.slice(0, 8).toUpperCase()}</p>
            </div>
            <span className={`${localStyles.badge} ${localStyles[focused.status] || ''}`}>{CONTRIBUTION_STATUS_LABELS[focused.status]}</span>
          </header>

          <div className={localStyles.detailGrid}>
            <section className={`${localStyles.detailBlock} ${localStyles.wide}`}><h3>Explicación</h3><pre>{focused.description}</pre></section>
            {focused.page_url && safeExternalUrl(focused.page_url) ? <section className={localStyles.detailBlock}><h3>Página relacionada</h3><p><a href={safeExternalUrl(focused.page_url)} target="_blank" rel="noopener noreferrer">Abrir URL sin previsualización</a></p></section> : null}
            <section className={localStyles.detailBlock}><h3>Contacto</h3><p>{focused.contact_name || 'Sin nombre'}{focused.contact_email ? ` · ${focused.contact_email}` : ' · Sin correo'}</p></section>
            {focused.source_urls?.length ? <section className={`${localStyles.detailBlock} ${localStyles.wide}`}><h3>Fuentes y documentos</h3><ul className={localStyles.sourceList}>{focused.source_urls.map((source) => safeExternalUrl(source) ? <li key={source}><a href={safeExternalUrl(source)} target="_blank" rel="noopener noreferrer">{source}</a></li> : null)}</ul></section> : null}
            {focused.contribution_attachments?.length ? <section className={`${localStyles.detailBlock} ${localStyles.wide}`}><h3>Fotografías en cuarentena</h3><ul className={localStyles.attachmentList}>{focused.contribution_attachments.map((attachment) => <li key={attachment.id}>{attachment.signedUrl ? <a href={attachment.signedUrl} target="_blank" rel="noopener noreferrer">Descargar {attachment.original_name}</a> : <strong>Archivo temporalmente no disponible</strong>}<span>{attachment.verified_mime_type} · {(attachment.byte_size / 1024 / 1024).toFixed(2)} MB · {attachment.width} × {attachment.height} px · {attachment.status}</span><span>Crédito: {attachment.credit || 'No indicado'} · Texto alternativo: {attachment.alt_text || 'No indicado'}</span></li>)}</ul></section> : null}
          </div>

          <p className={localStyles.privacyNote}>Datos restringidos al equipo editorial. No copies el correo ni los archivos fuera del flujo necesario para revisar la aportación.</p>

          {canEdit ? (
            <form action={reviewContributionAction} className={localStyles.reviewForm}>
              <input type="hidden" name="contribution_id" value={focused.id} />
              <div className={localStyles.reviewGrid}>
                <label><span>Estado editorial</span><select name="status" defaultValue={focused.status}>{Object.entries(CONTRIBUTION_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
                <label className={localStyles.wide}><span>Notas internas</span><textarea name="internal_notes" rows={4} maxLength={4000} defaultValue={focused.internal_notes || ''} /></label>
                <label className={localStyles.wide}><span>Resumen de resolución</span><textarea name="resolution_summary" rows={3} maxLength={2000} defaultValue={focused.resolution_summary || ''} placeholder="Qué se ha contrastado o incorporado manualmente" /></label>
              </div>
              <div className={localStyles.reviewChecks}>
                <label><input type="checkbox" name="assign_to_me" defaultChecked={focused.assigned_to === user.id} /> Asignarme esta revisión</label>
                {focused.assigned_to ? <label><input type="checkbox" name="unassign" /> Dejar sin asignar</label> : null}
              </div>
              <div className={localStyles.reviewActions}><button type="submit">Guardar revisión</button></div>
            </form>
          ) : null}
        </article>
      ) : null}

      <section className={localStyles.queue} aria-label="Cola de aportaciones">
        {data.contributions.length ? data.contributions.map((item) => (
          <Link key={item.id} href={queryHref(query, item.id)} className={localStyles.queueItem}>
            <div>
              <span className={styles.eyebrow}>{CONTRIBUTION_TYPE_LABELS[item.contribution_type]}</span>
              <h2>{item.title}</h2>
              <p>{item.contact_name || 'Remitente anónimo'} · {formatDate(item.created_at)}</p>
              <div className={localStyles.queueMeta}><span className={`${localStyles.badge} ${localStyles[item.status] || ''}`}>{CONTRIBUTION_STATUS_LABELS[item.status]}</span>{item.assigned_to ? <span className={localStyles.badge}>Asignada</span> : null}{item.contribution_attachments?.length ? <span className={localStyles.badge}>{item.contribution_attachments.length} foto{item.contribution_attachments.length === 1 ? '' : 's'}</span> : null}</div>
            </div>
            <small>HC-{item.id.slice(0, 8).toUpperCase()} →</small>
          </Link>
        )) : <div className={styles.emptyPanel}>No hay aportaciones que coincidan con estos filtros.</div>}
      </section>
    </div>
  )
}


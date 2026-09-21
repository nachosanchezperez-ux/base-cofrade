import Link from 'next/link'
import {
  EDITORIAL_FRESHNESS_LABELS,
  EDITORIAL_FRESHNESS_TYPES,
  ENTITY_TYPE_LABELS,
  effectiveContentUpdatedAt,
  panelEntityHref,
  publicEntityHref,
} from '@/lib/editorial-freshness'
import { requirePanelUser } from '@/lib/panel/auth'
import {
  getPanelEditorialFreshness,
  getPanelEditorialFreshnessSummary,
} from '@/lib/panel/editorial-freshness'
import styles from '@/app/panel/panel.module.css'
import freshnessStyles from './freshness.module.css'
import {
  markEntityContentUpdatedAction,
  markEntityReviewedAction,
} from './actions'

function dateLabel(value) {
  if (!value) return 'Sin registrar'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin registrar'
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Madrid',
  }).format(date)
}

function pageHref({ q, type, freshness, page }) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (type) params.set('type', type)
  if (freshness) params.set('freshness', freshness)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return `/panel/datos/frescura${query ? `?${query}` : ''}`
}

export const metadata = { title: 'Frescura editorial · Panel' }

export default async function PanelEditorialFreshnessPage({ searchParams }) {
  const user = await requirePanelUser()
  const canEdit = ['admin', 'editor'].includes(user.role)
  const query = await searchParams
  const q = String(query?.q || '').trim()
  const type = EDITORIAL_FRESHNESS_TYPES.includes(query?.type) ? query.type : ''
  const freshness = ['unreviewed', 'fresh', 'due', 'stale'].includes(query?.freshness)
    ? query.freshness
    : ''
  const page = Math.max(1, Number.parseInt(query?.page, 10) || 1)

  const [summary, queue] = await Promise.all([
    getPanelEditorialFreshnessSummary(),
    getPanelEditorialFreshness({ query: q, entityType: type, freshness, page }),
  ])

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Control editorial</span>
          <h1>Frescura de fichas</h1>
          <p>Separa la fecha de contenido de la revisión editorial y prioriza las fichas que necesitan una nueva comprobación.</p>
        </div>
        <Link className={styles.secondaryButton} href="/panel/datos">← Datos</Link>
      </header>

      <section className={styles.metricGrid} aria-label="Resumen de frescura editorial">
        <article className={styles.metricCard}><span>Sin revisar</span><strong>{summary.unreviewed}</strong><small>sin revisión editorial registrada</small></article>
        <article className={styles.metricCard}><span>Al día</span><strong>{summary.fresh}</strong><small>revisadas en los últimos 90 días</small></article>
        <article className={styles.metricCard}><span>Revisar pronto</span><strong>{summary.due}</strong><small>entre 91 y 180 días</small></article>
        <article className={styles.metricCard}><span>Vencidas</span><strong>{summary.stale}</strong><small>más de 180 días</small></article>
      </section>

      <div className={styles.readOnlyNotice}>
        La fecha pública «Última actualización» usa <strong>contenido actualizado</strong> cuando existe. Marcar una ficha solo como revisada no cambia esa fecha pública.
      </div>

      <form className={freshnessStyles.filters}>
        <label>
          <span className={styles.srOnly}>Buscar entidad</span>
          <input type="search" name="q" defaultValue={q} placeholder="Buscar entidad…" />
        </label>
        <label>
          <span className={styles.srOnly}>Tipo de entidad</span>
          <select name="type" defaultValue={type}>
            <option value="">Todos los tipos</option>
            {EDITORIAL_FRESHNESS_TYPES.map((item) => (
              <option value={item} key={item}>{ENTITY_TYPE_LABELS[item]}</option>
            ))}
          </select>
        </label>
        <label>
          <span className={styles.srOnly}>Estado de frescura</span>
          <select name="freshness" defaultValue={freshness}>
            <option value="">Todos los estados</option>
            <option value="unreviewed">Sin revisar</option>
            <option value="fresh">Al día</option>
            <option value="due">Revisar pronto</option>
            <option value="stale">Vencidas</option>
          </select>
        </label>
        <button className={styles.secondaryButton} type="submit">Filtrar</button>
      </form>

      <section className={styles.panelCard}>
        <div className={styles.listHeading}>
          <strong>{queue.total} {queue.total === 1 ? 'ficha' : 'fichas'}</strong>
          <small>Página {queue.page} de {queue.totalPages} · {summary.total} fichas públicas bajo control</small>
        </div>

        {queue.items.length ? (
          <div className={freshnessStyles.list}>
            {queue.items.map((item) => {
              const contentDate = effectiveContentUpdatedAt(item)
              const publicHref = publicEntityHref(item)
              const editHref = panelEntityHref(item)
              return (
                <article className={freshnessStyles.row} key={item.id}>
                  <span className={styles.listMonogram} aria-hidden="true">
                    {ENTITY_TYPE_LABELS[item.entity_type]?.slice(0, 2)}
                  </span>
                  <div className={styles.listIdentity}>
                    <strong>{item.name}</strong>
                    <span>{ENTITY_TYPE_LABELS[item.entity_type]} · Contenido: {dateLabel(contentDate)}</span>
                    <small>Revisión: {dateLabel(item.editorial_reviewed_at)}</small>
                  </div>
                  <span className={`${styles.statusBadge} ${freshnessStyles[item.freshness]}`}>
                    {EDITORIAL_FRESHNESS_LABELS[item.freshness]}
                  </span>
                  <div className={freshnessStyles.actions}>
                    {editHref ? <Link className={styles.smallButton} href={editHref}>Editar</Link> : null}
                    {publicHref ? <Link className={styles.smallButton} href={publicHref} target="_blank">Ver ficha</Link> : null}
                    {canEdit ? (
                      <>
                        <form action={markEntityReviewedAction}>
                          <input type="hidden" name="entity_id" value={item.id} />
                          <button className={styles.smallButton} type="submit">Revisada hoy</button>
                        </form>
                        <form action={markEntityContentUpdatedAction}>
                          <input type="hidden" name="entity_id" value={item.id} />
                          <button className={styles.primaryButton} type="submit">Contenido actualizado</button>
                        </form>
                      </>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        ) : <p className={styles.emptyText}>No hay fichas que coincidan con estos filtros.</p>}

        {queue.totalPages > 1 ? (
          <nav className={freshnessStyles.pagination} aria-label="Paginación de frescura editorial">
            {queue.page > 1 ? (
              <Link className={styles.smallButton} href={pageHref({ q, type, freshness, page: queue.page - 1 })}>← Anterior</Link>
            ) : <span />}
            <span>{queue.page} / {queue.totalPages}</span>
            {queue.page < queue.totalPages ? (
              <Link className={styles.smallButton} href={pageHref({ q, type, freshness, page: queue.page + 1 })}>Siguiente →</Link>
            ) : <span />}
          </nav>
        ) : null}
      </section>
    </div>
  )
}

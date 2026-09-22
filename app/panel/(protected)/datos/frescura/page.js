import Link from 'next/link'
import {
  EDITORIAL_FRESHNESS_LABELS,
  EDITORIAL_FRESHNESS_TYPES,
  EDITORIAL_PRIORITY_LABELS,
  ENTITY_TYPE_LABELS,
  editorialPriorityReasons,
  effectiveContentUpdatedAt,
  panelEntityHref,
  publicEntityHref,
} from '@/lib/editorial-freshness'
import { requirePanelUser } from '@/lib/panel/auth'
import {
  getPanelEditorialFreshness,
  getPanelEditorialFreshnessSummary,
  getPanelEditorialPrioritySummary,
} from '@/lib/panel/editorial-freshness'
import styles from '@/app/panel/panel.module.css'
import freshnessStyles from './freshness.module.css'
import {
  markEntityContentUpdatedAction,
  markEntityReviewedAction,
} from './actions'

const PRIORITY_LEVELS = ['urgent', 'high', 'medium', 'normal']
const SORT_OPTIONS = {
  priority: 'Prioridad inteligente',
  review: 'Revisión más antigua',
  updated: 'Cambio más reciente',
  name: 'Nombre',
}

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

function pageHref({ q, type, freshness, priority, sort, page }) {
  const params = new URLSearchParams()
  if (q) params.set('q', q)
  if (type) params.set('type', type)
  if (freshness) params.set('freshness', freshness)
  if (priority) params.set('priority', priority)
  if (sort && sort !== 'priority') params.set('sort', sort)
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
  const priority = PRIORITY_LEVELS.includes(query?.priority) ? query.priority : ''
  const sort = Object.hasOwn(SORT_OPTIONS, query?.sort) ? query.sort : 'priority'
  const page = Math.max(1, Number.parseInt(query?.page, 10) || 1)

  const [summary, prioritySummary, queue] = await Promise.all([
    getPanelEditorialFreshnessSummary(),
    getPanelEditorialPrioritySummary(),
    getPanelEditorialFreshness({
      query: q,
      entityType: type,
      freshness,
      priority,
      sort,
      page,
    }),
  ])

  return (
    <div className={styles.pageWrap}>
      <header className={styles.pageHeader}>
        <div>
          <span className={styles.eyebrow}>Control editorial</span>
          <h1>Frescura de fichas</h1>
          <p>Una cola de revisión ordenada por actividad próxima, vigencia editorial, cambios recientes, conexiones y documentación.</p>
        </div>
        <Link className={styles.secondaryButton} href="/panel/datos">← Datos</Link>
      </header>

      <section className={styles.metricGrid} aria-label="Prioridad de revisión editorial">
        <article className={styles.metricCard}><span>Urgente</span><strong>{prioritySummary.urgent}</strong><small>actividad o señales fuertes de revisión</small></article>
        <article className={styles.metricCard}><span>Alta</span><strong>{prioritySummary.high}</strong><small>revisar después de las urgentes</small></article>
        <article className={styles.metricCard}><span>Media</span><strong>{prioritySummary.medium}</strong><small>cola editorial activa</small></article>
        <article className={styles.metricCard}><span>Normal</span><strong>{prioritySummary.normal}</strong><small>sin señales inmediatas</small></article>
      </section>

      <div className={freshnessStyles.priorityNotice}>
        <strong>Cómo se prioriza</strong>
        <span>Actividad en 90 días → revisión pendiente → cambio reciente → conexiones → fuentes.</span>
        <small>
          Frescura actual: {summary.unreviewed} sin revisar · {summary.fresh} al día · {summary.due} próximas · {summary.stale} vencidas.
          La puntuación no se guarda: se recalcula con los datos vivos.
        </small>
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
            <option value="">Toda la frescura</option>
            <option value="unreviewed">Sin revisar</option>
            <option value="fresh">Al día</option>
            <option value="due">Revisar pronto</option>
            <option value="stale">Vencidas</option>
          </select>
        </label>
        <label>
          <span className={styles.srOnly}>Prioridad</span>
          <select name="priority" defaultValue={priority}>
            <option value="">Toda la prioridad</option>
            {PRIORITY_LEVELS.map((level) => (
              <option value={level} key={level}>{EDITORIAL_PRIORITY_LABELS[level]}</option>
            ))}
          </select>
        </label>
        <label>
          <span className={styles.srOnly}>Orden</span>
          <select name="sort" defaultValue={sort}>
            {Object.entries(SORT_OPTIONS).map(([value, label]) => (
              <option value={value} key={value}>{label}</option>
            ))}
          </select>
        </label>
        <button className={styles.secondaryButton} type="submit">Aplicar</button>
      </form>

      <section className={styles.panelCard}>
        <div className={styles.listHeading}>
          <strong>{queue.total} {queue.total === 1 ? 'ficha' : 'fichas'}</strong>
          <small>Página {queue.page} de {queue.totalPages} · orden: {SORT_OPTIONS[queue.sort]}</small>
        </div>

        {queue.items.length ? (
          <div className={freshnessStyles.list}>
            {queue.items.map((item) => {
              const contentDate = effectiveContentUpdatedAt(item)
              const publicHref = publicEntityHref(item)
              const editHref = panelEntityHref(item)
              const reasons = editorialPriorityReasons(item)
              return (
                <article className={freshnessStyles.row} key={item.id}>
                  <span className={styles.listMonogram} aria-hidden="true">
                    {ENTITY_TYPE_LABELS[item.entity_type]?.slice(0, 2)}
                  </span>
                  <div className={freshnessStyles.identity}>
                    <strong>{item.name}</strong>
                    <span>{ENTITY_TYPE_LABELS[item.entity_type]} · Contenido: {dateLabel(contentDate)}</span>
                    <small>Revisión: {dateLabel(item.editorial_reviewed_at)}</small>
                    {reasons.length ? (
                      <div className={freshnessStyles.reasons} aria-label="Motivos de prioridad">
                        {reasons.map((reason) => <span key={reason}>{reason}</span>)}
                      </div>
                    ) : null}
                  </div>
                  <div className={freshnessStyles.badges}>
                    <span className={`${freshnessStyles.priorityBadge} ${freshnessStyles[`priority_${item.priority_level}`]}`}>
                      {EDITORIAL_PRIORITY_LABELS[item.priority_level]} · {item.priority_score}
                    </span>
                    <span className={`${styles.statusBadge} ${freshnessStyles[item.freshness]}`}>
                      {EDITORIAL_FRESHNESS_LABELS[item.freshness]}
                    </span>
                  </div>
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
              <Link className={styles.smallButton} href={pageHref({ q, type, freshness, priority, sort, page: queue.page - 1 })}>← Anterior</Link>
            ) : <span />}
            <span>{queue.page} / {queue.totalPages}</span>
            {queue.page < queue.totalPages ? (
              <Link className={styles.smallButton} href={pageHref({ q, type, freshness, priority, sort, page: queue.page + 1 })}>Siguiente →</Link>
            ) : <span />}
          </nav>
        ) : null}
      </section>
    </div>
  )
}

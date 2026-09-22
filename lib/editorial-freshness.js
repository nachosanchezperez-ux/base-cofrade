export const EDITORIAL_FRESHNESS_TYPES = ['brotherhood', 'band', 'image', 'step', 'march']

export const EDITORIAL_FRESHNESS_THRESHOLDS = {
  dueDays: 90,
  staleDays: 180,
}

export const EDITORIAL_FRESHNESS_LABELS = {
  unreviewed: 'Sin revisar',
  fresh: 'Al día',
  due: 'Revisar pronto',
  stale: 'Vencida',
}

export const EDITORIAL_PRIORITY_LABELS = {
  urgent: 'Urgente',
  high: 'Alta',
  medium: 'Media',
  normal: 'Normal',
}

export const ENTITY_TYPE_LABELS = {
  brotherhood: 'Hermandad',
  band: 'Banda',
  image: 'Imagen',
  step: 'Paso',
  march: 'Marcha',
}

const PUBLIC_PATHS = {
  brotherhood: 'hermandades',
  band: 'bandas',
  image: 'imagenes',
  step: 'pasos',
  march: 'marchas',
}

const PANEL_PATHS = {
  brotherhood: 'hermandades',
  band: 'bandas',
  image: 'imagenes',
  step: 'pasos',
  march: 'marchas',
}

export function daysSince(value, now = new Date()) {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  const diff = now.getTime() - date.getTime()
  return Math.max(0, Math.floor(diff / 86_400_000))
}

export function editorialFreshnessStatus(reviewedAt, now = new Date()) {
  const age = daysSince(reviewedAt, now)
  if (age === null) return 'unreviewed'
  if (age <= EDITORIAL_FRESHNESS_THRESHOLDS.dueDays) return 'fresh'
  if (age <= EDITORIAL_FRESHNESS_THRESHOLDS.staleDays) return 'due'
  return 'stale'
}

export function effectiveContentUpdatedAt(entity = {}) {
  return entity.content_updated_at || entity.updated_at || null
}

export function publicEntityHref(entity = {}) {
  const prefix = PUBLIC_PATHS[entity.entity_type]
  return prefix && entity.slug ? `/${prefix}/${entity.slug}` : ''
}

export function panelEntityHref(entity = {}) {
  const prefix = PANEL_PATHS[entity.entity_type]
  return prefix && entity.id ? `/panel/${prefix}/${entity.id}` : ''
}

export function freshnessCutoffs(now = new Date()) {
  const fresh = new Date(now)
  fresh.setUTCDate(fresh.getUTCDate() - EDITORIAL_FRESHNESS_THRESHOLDS.dueDays)
  const stale = new Date(now)
  stale.setUTCDate(stale.getUTCDate() - EDITORIAL_FRESHNESS_THRESHOLDS.staleDays)
  return {
    fresh: fresh.toISOString(),
    stale: stale.toISOString(),
  }
}


export function editorialPriorityReasons(item = {}, now = new Date()) {
  const reasons = []
  const next = item.next_activity_date ? new Date(`${item.next_activity_date}T00:00:00Z`) : null
  if (next && !Number.isNaN(next.getTime())) {
    const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    const days = Math.max(0, Math.round((next.getTime() - today.getTime()) / 86_400_000))
    if (days === 0) reasons.push('Actividad hoy')
    else if (days === 1) reasons.push('Actividad mañana')
    else if (days <= 90) reasons.push(`Actividad en ${days} días`)
  }

  const freshness = editorialFreshnessStatus(item.editorial_reviewed_at, now)
  if (freshness === 'unreviewed') reasons.push('Sin revisión')
  else if (freshness === 'stale') reasons.push('Revisión vencida')
  else if (freshness === 'due') reasons.push('Revisión pendiente')

  const updateAge = Number(item.update_age_days)
  if (Number.isFinite(updateAge) && updateAge <= 14) reasons.push('Cambio reciente')
  else if (Number.isFinite(updateAge) && updateAge <= 45) reasons.push('Actualización reciente')

  const relations = Number(item.relation_count) || 0
  if (relations >= 5) reasons.push(`${relations} conexiones`)

  const sources = Number(item.source_count) || 0
  if (sources >= 2) reasons.push(`${sources} fuentes`)

  return reasons.slice(0, 4)
}

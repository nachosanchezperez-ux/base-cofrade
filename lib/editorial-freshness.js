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

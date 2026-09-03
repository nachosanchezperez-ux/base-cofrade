export function filterPublicPageEntities(entities = [], publicProfiles = []) {
  const readyIds = new Set(
    publicProfiles.map((profile) => profile.entity_id || profile.id).filter(Boolean)
  )
  return entities.filter((entity) => readyIds.has(entity.id))
}

export function isPublicEntityPageReady(entity, profile) {
  return entity?.status === 'published' && Boolean(entity.slug) && Boolean(profile)
}

const EDITORIAL_PLACEHOLDER_PATTERN = /(?:\bpor documentar\b|\bpendiente(?:s)? de (?:incorporar|publicar|publicaci[oó]n|documentar|confirmar|revisar|definir|datos? verificad[oa]s?)\b|\bpor confirmar\b|\bpor anunciar\b|\bsin documentar\b|\bno documentad[oa]s?\b|\bno determinad[oa]s?\b|\ben preparaci[oó]n\b)/i

export function isEditorialPlaceholder(value) {
  return typeof value === 'string' && EDITORIAL_PLACEHOLDER_PATTERN.test(value.trim())
}

export function publicText(value) {
  if (value === null || value === undefined) return ''
  const text = String(value).trim()
  return text && !isEditorialPlaceholder(text) ? text : ''
}

function containsTopLevelEditorialPlaceholder(value) {
  if (typeof value === 'string') return isEditorialPlaceholder(value)
  if (Array.isArray(value)) {
    return value.some((item) => typeof item === 'string' && isEditorialPlaceholder(item))
  }
  if (value && typeof value === 'object') {
    return Object.values(value).some((item) => (
      typeof item === 'string' && isEditorialPlaceholder(item)
    ))
  }
  return false
}

export function meetsPublicEditorialMinimum({
  identity,
  type,
  context,
  summary,
  relations = [],
  sources = [],
  publicValues = [],
} = {}) {
  return Boolean(
    publicText(identity)
    && publicText(type)
    && publicText(context)
    && publicText(summary)
    && relations.some((value) => Array.isArray(value) ? value.length > 0 : Boolean(publicText(value)))
    && sources.length > 0
    && !containsTopLevelEditorialPlaceholder(publicValues)
  )
}

export function publicEditorialRobots(isReady) {
  return {
    index: Boolean(isReady),
    follow: true,
    googleBot: {
      index: Boolean(isReady),
      follow: true,
    },
  }
}

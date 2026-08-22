function normalize(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export function safeSourceUrl(value = '') {
  const text = String(value || '').trim()
  if (!text) return ''
  try {
    const url = new URL(text)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : ''
  } catch {
    return ''
  }
}

export function sourcePriority(source = {}) {
  const type = normalize(source.source_type)
  let score = 0
  if (type.includes('web oficial')) score += 100
  else if (type.includes('fuente institucional')) score += 90
  else if (type.includes('documento oficial')) score += 85
  else if (type.includes('base de datos')) score += 70
  else if (type.includes('archivo')) score += 65
  else if (type.includes('bibliograf')) score += 60
  else if (type.includes('hemeroteca') || type.includes('prensa')) score += 50
  else score += 40

  if (safeSourceUrl(source.url)) score += 10
  if (source.publication_date) score += 4
  if (source.author_or_publisher) score += 2
  return score
}

export function rankTiraReferences(sources = [], links = [], limit = 4) {
  const linksBySource = new Map()
  for (const link of links) {
    if (!link?.source_id) continue
    const current = linksBySource.get(link.source_id) || { entities: new Set(), scopes: new Set() }
    if (link.entity_id) current.entities.add(link.entity_id)
    if (link.scope) current.scopes.add(String(link.scope).trim())
    linksBySource.set(link.source_id, current)
  }

  return sources
    .filter((source) => source?.id && linksBySource.has(source.id))
    .map((source) => {
      const info = linksBySource.get(source.id)
      return {
        id: source.id,
        name: String(source.name || 'Fuente').trim(),
        url: safeSourceUrl(source.url),
        type: String(source.source_type || '').trim(),
        publisher: String(source.author_or_publisher || '').trim(),
        publicationDate: source.publication_date || null,
        scopes: [...info.scopes].filter(Boolean).slice(0, 3),
        linkedEntityCount: info.entities.size,
        priority: sourcePriority(source),
      }
    })
    .sort((a, b) => b.priority - a.priority || b.linkedEntityCount - a.linkedEntityCount || a.name.localeCompare(b.name, 'es'))
    .slice(0, Math.max(1, Math.min(Number(limit) || 4, 6)))
    .map(({ priority, ...reference }) => reference)
}

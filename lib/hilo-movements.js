export const HILO_MOVEMENTS_PATH = '/el-hilo-se-mueve'
export const HILO_TOPIC_LABELS = { musica: 'Música', agenda: 'Salidas y cultos', patrimonio: 'Patrimonio' }
const ROUTES = { brotherhood: 'hermandades', band: 'bandas', image: 'imagenes', step: 'pasos', author: 'autores', march: 'marchas' }
const text = (value) => typeof value === 'string' ? value.trim() : ''
const scalar = (value) => text(Array.isArray(value) ? value[0] : value)
const normalize = (value) => text(value).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es')

export function validHiloDay(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false
  const date = new Date(`${value}T12:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function hiloDayLabel(value) {
  if (!validHiloDay(value)) return ''
  return new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00Z`))
}

function safeSource(source) {
  try {
    const url = new URL(source?.href)
    return text(source.label) && url.protocol === 'https:' && !url.username && !url.password
  } catch { return false }
}

function entityHref(entity, type) {
  if (!entity || entity.status !== 'published' || entity.entity_type !== type || !ROUTES[type]) return ''
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entity.slug || '') ? `/${ROUTES[type]}/${entity.slug}` : ''
}

function internalHref(value) {
  return /^\/(?!\/)[^\s\\\u0000-\u001f\u007f]*$/.test(value || '')
}

export function buildHiloMovements(records = [], entities = [], { today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date()) } = {}) {
  if (!validHiloDay(today)) return []
  const byId = new Map(entities.map((entity) => [entity.id, entity]))
  const seenIds = new Set()
  const seenEvents = new Set()
  return records.filter((record) => record && record.status === 'published')
    .slice().sort((a, b) => String(b.announcedOn || b.documentedOn).localeCompare(String(a.announcedOn || a.documentedOn)) || String(a.id).localeCompare(String(b.id)))
    .flatMap((record) => {
      const { id, eventKey, brotherhood, announcedOn, documentedOn } = record
      const root = byId.get(brotherhood?.id)
      const href = entityHref(root, 'brotherhood')
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id || '') || !text(eventKey) || seenIds.has(id) || seenEvents.has(eventKey)) return []
      if (!href || !text(brotherhood.label) || !text(record.title) || !text(record.summary) || !text(record.context)) return []
      if (!Object.hasOwn(HILO_TOPIC_LABELS, record.topic) || !text(record.municipality)) return []
      if (!validHiloDay(documentedOn) || documentedOn > today) return []
      if (announcedOn != null && (!validHiloDay(announcedOn) || announcedOn > today || announcedOn > documentedOn)) return []
      const sources = (record.sources || []).filter(safeSource)
      if (!sources.length) return []
      const seenRelations = new Set([brotherhood.id])
      const relations = (record.relations || []).flatMap((relation) => {
        const linked = entityHref(byId.get(relation.id), relation.type)
        if (!linked || seenRelations.has(relation.id) || !text(relation.label)) return []
        seenRelations.add(relation.id)
        return [{ ...relation, href: linked }]
      })
      const discover = text(record.discover?.label) && internalHref(record.discover?.href) ? record.discover : null
      seenIds.add(id)
      seenEvents.add(eventKey)
      return [{ ...record, sources, relations, discover, brotherhood: { ...brotherhood, href }, href: `${HILO_MOVEMENTS_PATH}#${id}` }]
    })
}

export function filterHiloMovements(items, { q = '', municipio = '', tema = '' } = {}) {
  const query = normalize(scalar(q)).slice(0, 120)
  const locality = scalar(municipio)
  const topic = scalar(tema)
  return items.filter((item) => (!locality || item.municipality === locality) && (!topic || item.topic === topic)
    && (!query || normalize([item.brotherhood.label, item.title, item.summary, item.municipality, ...item.relations.map((relation) => relation.label)].join(' ')).includes(query)))
}

export function selectHiloMovements(items, { brotherhoodId = '', limit = 3, diverse = false } = {}) {
  const target = Number.isFinite(Number(limit)) ? Math.max(0, Math.min(20, Math.floor(Number(limit)))) : 0
  const selected = []
  const seen = new Set()
  for (const item of items) {
    if (selected.length >= target) break
    if (brotherhoodId && item.brotherhood.id !== brotherhoodId) continue
    if (diverse && seen.has(item.brotherhood.id)) continue
    seen.add(item.brotherhood.id)
    selected.push(item)
  }
  return selected
}

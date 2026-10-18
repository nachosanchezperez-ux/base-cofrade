export const HILO_MOVEMENTS_PATH = '/el-hilo-se-mueve'
export const HILO_TOPIC_LABELS = { musica: 'Música', agenda: 'Salidas y cultos', patrimonio: 'Patrimonio', hermandad: 'Vida de hermandad' }
const ROUTES = { brotherhood: 'hermandades', band: 'bandas', image: 'imagenes', step: 'pasos', author: 'autores', march: 'marchas' }
const text = (value) => typeof value === 'string' ? value.trim() : ''
const scalar = (value) => text(Array.isArray(value) ? value[0] : value)
const normalize = (value) => text(value).normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es')

export function hiloArticlePath(id = '') {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id || '') ? `${HILO_MOVEMENTS_PATH}/${id}` : HILO_MOVEMENTS_PATH
}

// «El contexto» se escribe en párrafos separados por líneas en blanco o saltos.
export function hiloParagraphs(value = '') {
  return text(value).split(/\n\s*\n|\n/).map((part) => part.trim()).filter(Boolean)
}

// Noticias relacionadas: primero las del mismo protagonista, luego las más recientes.
export function relatedHiloMovements(items = [], current = null, limit = 3) {
  if (!current) return []
  const others = items.filter((item) => item.id !== current.id)
  const sameProtagonist = others.filter((item) => item.protagonist?.href && item.protagonist.href === current.protagonist?.href)
  const rest = others.filter((item) => !sameProtagonist.includes(item))
  return [...sameProtagonist, ...rest].slice(0, Math.max(0, limit))
}

export function validHiloDay(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return false
  const date = new Date(`${value}T12:00:00Z`)
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
}

// Noticias recientes: lo que se muestra en la portada y en las fichas. El
// archivo completo sigue en /el-hilo-se-mueve.
export const HILO_FRESH_DAYS = 45

function madridToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date())
}

function daysBetween(from, to) {
  return Math.round((Date.parse(`${to}T12:00:00Z`) - Date.parse(`${from}T12:00:00Z`)) / 86400000)
}

// Una noticia sigue siendo actualidad mientras es reciente o mientras lo que
// anuncia (eventDate) todavía no ha llegado.
// Destacada desde el Panel: lo es hasta el día featuredUntil incluido.
export function isFeaturedHiloMovement(item = {}, today = madridToday()) {
  return validHiloDay(today) && validHiloDay(item.featuredUntil) && item.featuredUntil >= today
}

// Orden editorial: primero la destacada vigente (si hay varias, la más reciente,
// que es como ya vienen ordenadas) y después el resto en su orden de fecha.
export function featuredFirstHiloMovements(items = [], today = madridToday()) {
  const list = Array.isArray(items) ? items : []
  const featured = list.filter((item) => isFeaturedHiloMovement(item, today))
  if (!featured.length) return list
  return [featured[0], ...list.filter((item) => item !== featured[0])]
}

export function isFreshHiloMovement(item = {}, today = madridToday(), days = HILO_FRESH_DAYS) {
  if (!validHiloDay(today)) return false
  if (isFeaturedHiloMovement(item, today)) return true
  if (validHiloDay(item.eventDate) && item.eventDate >= today) return true
  const date = item.announcedOn || item.documentedOn
  return validHiloDay(date) && daysBetween(date, today) <= days
}

// «Ya celebrado · 16 de octubre»: aviso cuando pasa la fecha del acto, para que
// el lector no lea en futuro algo que ya ocurrió.
export function hiloPassedLabel(item = {}, today = madridToday()) {
  if (!item.eventPassed || !validHiloDay(item.eventDate)) return ''
  const sameYear = item.eventDate.slice(0, 4) === String(today).slice(0, 4)
  const label = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', day: 'numeric', month: 'long', ...(sameYear ? {} : { year: 'numeric' }) }).format(new Date(`${item.eventDate}T12:00:00Z`))
  return `Ya celebrado · ${label}`
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
  const matchesType = entity?.entity_type === type || (type === 'author' && entity?.entity_type === 'agent')
  if (!entity || entity.status !== 'published' || !matchesType || !ROUTES[type]) return ''
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
      const subject = record.subject || (brotherhood ? { ...brotherhood, type: 'brotherhood' } : null)
      const root = byId.get(subject?.id)
      const href = ['brotherhood', 'band'].includes(subject?.type) ? entityHref(root, subject.type) : ''
      const editorialSubject = !subject && record.editorialException === true && text(record.editorialSubject?.label) && text(record.editorialSubject?.kind)
      const protagonist = href ? { ...subject, href, kind: subject.type === 'band' ? 'Banda' : '' } : editorialSubject ? { label: text(record.editorialSubject.label), kind: text(record.editorialSubject.kind), href: '' } : null
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id || '') || !text(eventKey) || seenIds.has(id) || seenEvents.has(eventKey)) return []
      if (!protagonist || !text(protagonist.label) || !text(record.title) || !text(record.summary) || !text(record.context)) return []
      if (!Object.hasOwn(HILO_TOPIC_LABELS, record.topic) || !text(record.municipality)) return []
      if (!validHiloDay(documentedOn) || documentedOn > today) return []
      if (announcedOn != null && (!validHiloDay(announcedOn) || announcedOn > today || announcedOn > documentedOn)) return []
      const sources = (record.sources || []).filter(safeSource)
      if (!sources.length) return []
      const seenRelations = new Set(subject?.id ? [subject.id] : [])
      const relations = (record.relations || []).flatMap((relation) => {
        const linked = entityHref(byId.get(relation.id), relation.type)
        if (!linked || seenRelations.has(relation.id) || !text(relation.label)) return []
        seenRelations.add(relation.id)
        return [{ ...relation, href: linked }]
      })
      const discover = text(record.discover?.label) && internalHref(record.discover?.href) ? record.discover : null
      const eventDate = validHiloDay(record.eventDate) ? record.eventDate : ''
      seenIds.add(id)
      seenEvents.add(eventKey)
      // Cada noticia tiene su página (/el-hilo-se-mueve/<id>); el ancla del índice
      // (#<id>) se conserva para los enlaces antiguos.
      return [{ ...record, eventDate, eventPassed: Boolean(eventDate && eventDate < today), sources, relations, discover, protagonist, brotherhood: brotherhood ? { ...brotherhood, href } : null, href: hiloArticlePath(id), anchorHref: `${HILO_MOVEMENTS_PATH}#${id}` }]
    })
}

export function filterHiloMovements(items, { q = '', municipio = '', tema = '' } = {}) {
  const query = normalize(scalar(q)).slice(0, 120)
  const locality = scalar(municipio)
  const topic = scalar(tema)
  return items.filter((item) => (!locality || item.municipality === locality) && (!topic || item.topic === topic)
    && (!query || normalize([item.protagonist.label, item.title, item.summary, item.municipality, ...item.relations.map((relation) => relation.label)].join(' ')).includes(query)))
}

export function selectHiloMovements(items, { brotherhoodId = '', entityId = '', entityHref = '', limit = 3, diverse = false, fresh = false, today = madridToday() } = {}) {
  const target = Number.isFinite(Number(limit)) ? Math.max(0, Math.min(20, Math.floor(Number(limit)))) : 0
  const selected = []
  const seen = new Set()
  for (const item of items) {
    if (selected.length >= target) break
    if (fresh && !isFreshHiloMovement(item, today)) continue
    if (brotherhoodId && item.brotherhood?.id !== brotherhoodId) continue
    if (entityId && item.protagonist?.id !== entityId && !item.relations.some((relation) => relation.id === entityId)) continue
    if (entityHref && item.protagonist?.href !== entityHref && !item.relations.some((relation) => relation.href === entityHref)) continue
    const protagonistId = item.protagonist?.id || item.brotherhood?.id || item.id
    if (diverse && seen.has(protagonistId)) continue
    seen.add(protagonistId)
    selected.push(item)
  }
  return selected
}

export const TIRA_SESSION_KEY = 'hc-tira-del-hilo-session-v1'

const MAX_MESSAGES = 24
const MAX_ITEMS = 12
const MAX_ENTITIES = 12

function text(value, max = 400) {
  return String(value || '').trim().slice(0, max)
}

function safeInternalHref(value = '') {
  const href = text(value, 320)
  return /^\/(hermandades|imagenes|pasos|bandas)\/[a-z0-9][a-z0-9-]*(?:[?#].*)?$/i.test(href) ? href : ''
}

function safeExternalUrl(value = '') {
  const raw = text(value, 800)
  if (!raw) return ''
  try {
    const url = new URL(raw)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : ''
  } catch {
    return ''
  }
}

function sanitizeReference(reference) {
  if (!reference || typeof reference !== 'object' || Array.isArray(reference)) return null
  return {
    id: text(reference.id, 80),
    name: text(reference.name, 220) || 'Fuente',
    url: safeExternalUrl(reference.url),
    type: text(reference.type, 80),
    publisher: text(reference.publisher, 220),
    publicationDate: text(reference.publicationDate, 40) || null,
    scopes: Array.isArray(reference.scopes) ? reference.scopes.map((scope) => text(scope, 160)).filter(Boolean).slice(0, 3) : [],
    linkedEntityCount: Math.max(0, Number(reference.linkedEntityCount) || 0),
  }
}

function sanitizeItem(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return null
  return {
    label: text(item.label, 320),
    meta: text(item.meta, 800),
    href: safeInternalHref(item.href),
    relationReferences: Array.isArray(item.relationReferences)
      ? item.relationReferences.map(sanitizeReference).filter(Boolean).slice(0, 2)
      : [],
    relationReferenceLabel: text(item.relationReferenceLabel, 100),
  }
}

function sanitizeEntity(entity) {
  if (!entity || typeof entity !== 'object' || Array.isArray(entity)) return null
  return {
    id: text(entity.id, 64),
    entityType: text(entity.entityType, 32),
    type: text(entity.type, 80),
    name: text(entity.name, 260),
    href: safeInternalHref(entity.href),
    meta: text(entity.meta, 400),
  }
}

function sanitizeEvidence(item) {
  if (!item || typeof item !== 'object' || Array.isArray(item)) return null
  return {
    key: text(item.key, 80),
    label: text(item.label, 160),
    detail: text(item.detail, 320),
  }
}

function sanitizeContext(context) {
  if (!context || typeof context !== 'object' || Array.isArray(context)) return null
  const result = {
    entityId: text(context.entityId, 64) || null,
    entityType: text(context.entityType, 32) || null,
    name: text(context.name, 160),
  }
  const set = context.resultSet
  if (set && typeof set === 'object' && !Array.isArray(set)) {
    const entityIds = Array.isArray(set.entityIds)
      ? [...new Set(set.entityIds.map((id) => text(id, 64)).filter(Boolean))].slice(0, 12)
      : []
    if (set.entityType && entityIds.length) {
      result.resultSet = {
        entityType: text(set.entityType, 32),
        entityIds,
        count: entityIds.length,
        label: text(set.label, 120),
        sourceIntent: text(set.sourceIntent, 64),
      }
    }
  }
  return result.entityId || result.resultSet ? result : null
}

function sanitizeResponse(response) {
  if (!response || typeof response !== 'object' || Array.isArray(response)) return null
  return {
    kind: text(response.kind, 32) || 'answer',
    answer: text(response.answer, 1400),
    path: Array.isArray(response.path) ? response.path.map((item) => text(item, 100)).filter(Boolean).slice(0, 10) : [],
    entities: Array.isArray(response.entities) ? response.entities.map(sanitizeEntity).filter(Boolean).slice(0, MAX_ENTITIES) : [],
    items: Array.isArray(response.items) ? response.items.map(sanitizeItem).filter(Boolean).slice(0, MAX_ITEMS) : [],
    followUps: Array.isArray(response.followUps) ? response.followUps.map((item) => text(item, 220)).filter(Boolean).slice(0, 3) : [],
    context: sanitizeContext(response.context),
    evidence: Array.isArray(response.evidence) ? response.evidence.map(sanitizeEvidence).filter(Boolean).slice(0, 4) : [],
    references: Array.isArray(response.references) ? response.references.map(sanitizeReference).filter(Boolean).slice(0, 4) : [],
    referencesNote: text(response.referencesNote, 320),
    exactRelationReferenceCount: Number(response.exactRelationReferenceCount) || 0,
    relationReferencesNote: text(response.relationReferencesNote, 320),
  }
}

export function sanitizeTiraSession(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return { messages: [], context: null }
  const messages = Array.isArray(value.messages)
    ? value.messages
        .filter((message) => message && (message.role === 'user' || message.role === 'assistant'))
        .slice(-MAX_MESSAGES)
        .map((message, index) => message.role === 'user'
          ? {
              id: text(message.id, 80) || `restored-user-${index}`,
              role: 'user',
              text: text(message.text, 320),
            }
          : {
              id: text(message.id, 80) || `restored-assistant-${index}`,
              role: 'assistant',
              response: sanitizeResponse(message.response),
            })
        .filter((message) => message.role === 'user' ? Boolean(message.text) : Boolean(message.response))
    : []

  return {
    messages,
    context: sanitizeContext(value.context),
  }
}

export function encodeTiraSession(value) {
  return JSON.stringify(sanitizeTiraSession(value))
}

export function decodeTiraSession(raw = '') {
  try {
    return sanitizeTiraSession(JSON.parse(String(raw || '')))
  } catch {
    return { messages: [], context: null }
  }
}

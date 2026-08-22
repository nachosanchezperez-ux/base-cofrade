export function normalizeFreePlannerText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const FOLLOW_UP_START = /^(?:quien|quienes|cual|cuales|que|desde cuando|cuando|compar\w*|orden\w*|ensena\w*|muestra\w*|dime\b|cuentame\b|filtra\w*|solo\b)/
const SEPARATOR = /\s+(?:y|ademas|tambien|luego|despues)\s+/gi

function cleanPart(value = '') {
  return String(value)
    .trim()
    .replace(/^[,;:.\s]+/, '')
    .replace(/[,;:.\s]+$/, '')
    .trim()
}

function startsLikeFollowUp(value = '') {
  return FOLLOW_UP_START.test(normalizeFreePlannerText(value))
}

export function planFreeCompoundQuestion(question = '') {
  const raw = String(question || '').trim()
  if (!raw || raw.length > 320) return null

  const parts = []
  let start = 0
  let match
  SEPARATOR.lastIndex = 0

  while ((match = SEPARATOR.exec(raw))) {
    const tail = raw.slice(SEPARATOR.lastIndex)
    if (!startsLikeFollowUp(tail)) continue

    const head = cleanPart(raw.slice(start, match.index))
    if (head) parts.push(head)
    start = SEPARATOR.lastIndex
  }

  if (!parts.length) return null
  const tail = cleanPart(raw.slice(start))
  if (tail) parts.push(tail)

  const queries = parts
    .map(cleanPart)
    .filter((part) => part.length >= 3)
    .slice(0, 3)

  if (queries.length < 2) return null
  if (queries[0].length < 8) return null

  return {
    mode: 'sequential',
    queries,
    summary: `Consulta compuesta gratuita en ${queries.length} pasos encadenados`,
  }
}

function dedupe(items, keyFn, limit) {
  const seen = new Set()
  const output = []
  for (const item of items || []) {
    if (!item) continue
    const key = keyFn(item)
    if (!key || seen.has(key)) continue
    seen.add(key)
    output.push(item)
    if (output.length >= limit) break
  }
  return output
}

export function mergeFreeCompoundResponses(responses = [], plan = null, finalContext = null) {
  const answered = responses.filter((response) => response?.kind === 'answer')
  if (!answered.length) return null

  const last = answered[answered.length - 1]
  const freePlan = {
    used: true,
    mode: 'sequential',
    queries: plan?.queries || [],
    plannedCount: plan?.queries?.length || answered.length,
    answeredCount: answered.length,
    partial: answered.length < (plan?.queries?.length || answered.length),
  }

  if (answered.length === 1) {
    return {
      ...answered[0],
      freePlan,
    }
  }

  const entities = dedupe(
    answered.flatMap((response) => response.entities || []),
    (entity) => entity.id || `${entity.entityType || entity.type}|${entity.name || ''}`,
    12
  )
  const evidence = dedupe(
    answered.flatMap((response) => response.evidence || []),
    (item) => item.id || `${item.label || item.title || ''}|${item.detail || item.value || item.meta || ''}`,
    12
  )
  const references = dedupe(
    answered.flatMap((response) => response.references || []),
    (item) => item.id || `${item.name || ''}|${item.url || ''}`,
    6
  )
  const fallbackItems = dedupe(
    answered.flatMap((response) => response.items || []),
    (item) => `${item.href || ''}|${item.label || ''}|${item.meta || ''}`,
    12
  )
  const items = (last.items || []).length ? last.items.slice(0, 12) : fallbackItems
  const followUps = (last.followUps || []).length
    ? last.followUps.slice(0, 3)
    : dedupe(answered.flatMap((response) => response.followUps || []), (item) => item, 3)

  return {
    kind: 'answer',
    answer: answered.map((response) => String(response.answer || '').trim()).filter(Boolean).join(' '),
    path: ['Consulta compuesta', `${answered.length} pasos verificados`, 'Respuesta'],
    entities,
    items,
    evidence,
    references,
    referencesNote: references.length
      ? 'Fuentes heredadas de los pasos documentados que componen esta respuesta.'
      : '',
    followUps,
    context: Object.prototype.hasOwnProperty.call(last, 'context') ? last.context : finalContext,
    freePlan,
  }
}

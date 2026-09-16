export function normalizeFreePlannerText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const FOLLOW_UP_START = /^(?:quien|quienes|cual|cuales|que|a quien|a que|en que ano|desde cuando|cuando|donde|compar\w*|orden\w*|ensena\w*|muestra\w*|dime\b|cuentame\b|filtra\w*|solo\b)/
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

function planMunicipalityBrotherhoodBands(question = '') {
  const raw = String(question || '').trim()
  const normalized = normalizeFreePlannerText(raw)
  const asksForBands = /\b(bandas?|musica|acompanamientos?(?: musicales?)?)\b/.test(normalized)
    && /\b(acompan\w*|tienen?|llevan?|tocan?|bandas?|musica|acompanamientos?)\b/.test(normalized)
  if (!asksForBands) return null

  const match = raw.match(/\b(?:las?\s+)?(?:hermandades|cofrad[ií]as|corporaciones\s+cofrades)\s+(?:de|en)\s+(.+?)\s*\??$/i)
  const municipality = cleanPart(match?.[1] || '')
  const municipalityKey = normalizeFreePlannerText(municipality)
  if (!municipality || municipality.length > 80) return null
  if (/^(gloria|penitencia|sacramental|vispera|víspera)\b/.test(municipalityKey)) return null

  return {
    mode: 'sequential',
    queries: [
      `¿Cuáles son las hermandades de ${municipality}?`,
      '¿Qué bandas acompañan a estas hermandades?',
    ],
    summary: `Directorio municipal y acompañamientos actuales de ${municipality}`,
  }
}

export function planFreeCompoundQuestion(question = '') {
  const raw = String(question || '').trim()
  if (!raw || raw.length > 320) return null

  const municipalityBands = planMunicipalityBrotherhoodBands(raw)
  if (municipalityBands) return municipalityBands

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
  const usable = responses.filter((response) => response?.kind === 'answer' || response?.kind === 'not_documented')
  const answered = usable.filter((response) => response.kind === 'answer')
  if (!usable.length) return null

  const last = usable[usable.length - 1]
  const lastAnswer = [...answered].reverse().find(Boolean) || null
  const freePlan = {
    used: true,
    mode: 'sequential',
    queries: plan?.queries || [],
    plannedCount: plan?.queries?.length || usable.length,
    answeredCount: answered.length,
    partial: answered.length < (plan?.queries?.length || usable.length),
  }

  if (usable.length === 1) {
    return {
      ...usable[0],
      freePlan,
    }
  }

  const entities = dedupe(
    usable.flatMap((response) => response.entities || []),
    (entity) => entity.id || `${entity.entityType || entity.type}|${entity.name || ''}`,
    12
  )
  const evidence = dedupe(
    usable.flatMap((response) => response.evidence || []),
    (item) => item.id || `${item.label || item.title || ''}|${item.detail || item.value || item.meta || ''}`,
    12
  )
  const references = dedupe(
    usable.flatMap((response) => response.references || []),
    (item) => item.id || `${item.name || ''}|${item.url || ''}`,
    6
  )
  const fallbackItems = dedupe(
    answered.flatMap((response) => response.items || []),
    (item) => `${item.href || ''}|${item.label || ''}|${item.meta || ''}`,
    12
  )
  const items = (lastAnswer?.items || []).length ? lastAnswer.items.slice(0, 12) : fallbackItems
  const followUps = (last.followUps || []).length
    ? last.followUps.slice(0, 3)
    : (lastAnswer?.followUps || []).slice(0, 3)

  return {
    kind: answered.length ? 'answer' : 'not_documented',
    answer: usable.map((response) => String(response.answer || '').trim()).filter(Boolean).join(' '),
    path: answered.length ? ['Consulta compuesta', `${answered.length} pasos verificados`, 'Respuesta'] : [],
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

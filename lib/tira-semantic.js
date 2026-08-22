export const SEMANTIC_PLAN_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    mode: { type: 'string', enum: ['delegate', 'single', 'multi', 'unsupported'] },
    queries: {
      type: 'array',
      minItems: 0,
      maxItems: 3,
      items: { type: 'string', minLength: 1, maxLength: 320 },
    },
    summary: { type: 'string', maxLength: 240 },
  },
  required: ['mode', 'queries', 'summary'],
}

export const SEMANTIC_SYNTHESIS_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  properties: {
    answer: { type: 'string', minLength: 1, maxLength: 1800 },
    follow_ups: {
      type: 'array',
      minItems: 0,
      maxItems: 3,
      items: { type: 'string', minLength: 1, maxLength: 180 },
    },
  },
  required: ['answer', 'follow_ups'],
}

export function normalizeSemanticText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function shouldUseSemanticLayer(question = '') {
  const raw = String(question || '').trim()
  const q = normalizeSemanticText(raw)
  if (!q) return false

  if (raw.length >= 105) return true
  if (/\b(explica|explicame|analiza|interpret|resume|sintetiza|por que|como ha cambiado|como cambio|evolucion|poco evidente|no evidente)\b/.test(q)) return true
  if (/\b(compara|comparame|comparala|comparalo|comparalos|comparalas)\b/.test(q) && /\b(y|con|entre|ademas|tambien)\b/.test(q)) return true
  if (/\b(encuentra|busca|descubre)\b/.test(q) && /\b(conexion|relacion|patron|diferencia|semejanza)\b/.test(q)) return true
  if ((q.match(/\b(y|ademas|tambien|despues|luego)\b/g) || []).length >= 2) return true
  return false
}

export function sanitizeSemanticPlan(plan) {
  if (!plan || typeof plan !== 'object' || Array.isArray(plan)) return null
  const mode = ['delegate', 'single', 'multi', 'unsupported'].includes(plan.mode) ? plan.mode : 'unsupported'
  const queries = Array.isArray(plan.queries)
    ? [...new Set(plan.queries.map((item) => String(item || '').trim()).filter(Boolean))].slice(0, 3)
    : []
  const summary = String(plan.summary || '').trim().slice(0, 240)

  if (mode === 'single' && queries.length !== 1) return null
  if (mode === 'multi' && queries.length < 2) return null
  if ((mode === 'delegate' || mode === 'unsupported') && queries.length) return null
  if (queries.some((query) => query.length > 320)) return null
  return { mode, queries, summary }
}

function dedupe(items, keyFn, limit) {
  const seen = new Set()
  const output = []
  for (const item of items) {
    if (!item) continue
    const key = keyFn(item)
    if (!key || seen.has(key)) continue
    seen.add(key)
    output.push(item)
    if (output.length >= limit) break
  }
  return output
}

export function groundedPacket(responses = []) {
  return responses
    .filter((response) => response?.kind === 'answer')
    .slice(0, 3)
    .map((response, index) => ({
      query_index: index + 1,
      answer: String(response.answer || '').slice(0, 1800),
      path: (response.path || []).slice(0, 8),
      entities: (response.entities || []).slice(0, 12).map((entity) => ({
        type: entity.type || entity.entityType || '',
        name: entity.name || '',
        meta: entity.meta || '',
      })),
      items: (response.items || []).slice(0, 12).map((item) => ({
        label: item.label || '',
        meta: item.meta || '',
      })),
      evidence: (response.evidence || []).slice(0, 8).map((item) => ({
        label: item.label || item.title || '',
        detail: item.detail || item.value || item.meta || '',
      })),
    }))
}

export function mergeGroundedResponses(responses = [], synthesis = null, semantic = {}) {
  const answered = responses.filter((response) => response?.kind === 'answer')
  if (!answered.length) return null
  if (answered.length === 1) {
    return {
      ...answered[0],
      semantic: { ...semantic, used: true, grounded: true, sourceCount: 1 },
    }
  }

  const items = dedupe(answered.flatMap((response) => response.items || []), (item) => `${item.href || ''}|${item.label || ''}|${item.meta || ''}`, 12)
  const entities = dedupe(answered.flatMap((response) => response.entities || []), (entity) => entity.id || `${entity.entityType || entity.type}|${entity.name}`, 12)
  const evidence = dedupe(answered.flatMap((response) => response.evidence || []), (item) => item.id || `${item.label || item.title}|${item.detail || item.value || item.meta || ''}`, 12)
  const references = dedupe(answered.flatMap((response) => response.references || []), (item) => item.id || `${item.name || ''}|${item.url || ''}`, 6)
  const fallbackAnswer = answered.map((response) => response.answer).filter(Boolean).join(' ')
  const followUps = synthesis?.follow_ups?.length
    ? synthesis.follow_ups.slice(0, 3)
    : dedupe(answered.flatMap((response) => response.followUps || []), (item) => item, 3)

  return {
    kind: 'answer',
    answer: String(synthesis?.answer || fallbackAnswer).trim(),
    path: ['Interpretación semántica', 'Consultas verificadas', 'Síntesis'],
    entities,
    items,
    evidence,
    references,
    referencesNote: references.length
      ? 'Fuentes heredadas de las consultas verificadas que sostienen esta síntesis.'
      : '',
    followUps,
    context: null,
    semantic: {
      ...semantic,
      used: true,
      grounded: true,
      sourceCount: answered.length,
    },
  }
}

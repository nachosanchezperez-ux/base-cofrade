// Tipos de relación Hermandad ↔ Imagen y utilidades compartidas entre el panel y la ficha pública.
// Módulo puro (sin dependencias de servidor) para poder probarlo con node --test.

export const FORMER_TITULAR_RELATION = 'antiguo_titular'

// Relación entre imágenes en entity_relations: antigua imagen (origen) → imagen que la sustituyó (destino).
export const IMAGE_SUCCESSION_RELATION = 'succeeded_by'

export const BROTHERHOOD_IMAGE_RELATION_OPTIONS = [
  { value: 'titular', label: 'Titular actual' },
  { value: 'cotitular', label: 'Cotitular' },
  { value: FORMER_TITULAR_RELATION, label: 'Antigua imagen titular' },
  { value: 'imagen_venerada', label: 'Imagen venerada' },
  { value: 'vinculada', label: 'Imagen vinculada' },
]

const FORMER_ALIASES = new Set([FORMER_TITULAR_RELATION, 'antigua_titular', 'antiguo_titular_de', 'former_titular'])

export function normalizeRelationType(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export function isFormerTitularRelation(value) {
  return FORMER_ALIASES.has(normalizeRelationType(value))
}

export function relationTypeLabel(value = '') {
  const normalized = normalizeRelationType(value)
  if (isFormerTitularRelation(normalized)) return 'Antigua imagen titular'
  const option = BROTHERHOOD_IMAGE_RELATION_OPTIONS.find((item) => item.value === normalized)
  return option ? option.label : String(value || '').replaceAll('_', ' ')
}

// Separa los vínculos publicados en titulares vigentes y antiguas imágenes titulares.
export function splitBrotherhoodImageLinks(links = []) {
  const current = []
  const former = []
  for (const link of links || []) {
    if (isFormerTitularRelation(link?.relation_type)) former.push(link)
    else current.push(link)
  }
  return { current, former }
}

function yearOrText(textValue, dateValue) {
  const text = String(textValue || '').trim()
  if (text) return text
  const date = String(dateValue || '').trim()
  return /^\d{4}/.test(date) ? date.slice(0, 4) : ''
}

// Periodo legible a partir de las fechas textuales (prioritarias) o de las fechas exactas.
// Nunca deduce un dato que no esté registrado.
export function formerTitularPeriod(relation = {}) {
  const from = yearOrText(relation.date_from_text, relation.date_from)
  const to = yearOrText(relation.date_to_text, relation.date_to)
  if (from && to) return `${from} – ${to}`
  if (to) return `Hasta ${to}`
  if (from) return `Desde ${from}`
  return ''
}

// Texto libre opcional con límite de longitud para formularios del panel.
export function cleanOptionalText(value, { max = 120, label = 'El campo' } = {}) {
  const text = String(value ?? '').replace(/\s+/g, ' ').trim()
  if (!text) return null
  if (text.length > max) throw new Error(`${label} no puede superar ${max} caracteres.`)
  return text
}

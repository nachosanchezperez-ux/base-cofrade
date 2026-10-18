// Reglas de presentación de la ficha de Hermandad. Funciones puras, sin
// dependencias, para poder probarlas con `node --test`.

function normalized(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

// Notas de procedencia que se cargaron como descripción de culto y no aportan
// nada al lector. Lista cerrada (no un patrón) para no ocultar nunca una
// descripción con información propia. Los datos no se modifican.
const GENERIC_CULT_DESCRIPTIONS = new Set([
  'Culto anual documentado por la corporación.',
  'Culto anual documentado por la Hermandad.',
  'Culto anual documentado por la corporación o la ficha institucional.',
  'Culto anual documentado en el calendario oficial de la Archicofradía.',
  'Culto documentado para la edición de 2026.',
  'Culto anual recogido en las Reglas y fuentes oficiales.',
  'Culto anual de la corporación.',
  'Culto interno documentado en la agenda oficial de la Hermandad.',
  'Culto anunciado en el calendario oficial de 2026.',
  'Culto incluido en el calendario oficial del curso 2026-2027 de la Archicofradía.',
  'Regla y carácter anual documentados por la Hermandad.',
].map(normalized))

export function isGenericCultDescription(value = '') {
  return GENERIC_CULT_DESCRIPTIONS.has(normalized(value))
}

export function visibleCultDescription(value = '') {
  const text = String(value || '').trim()
  return text && !isGenericCultDescription(text) ? text : ''
}

// Música actual: cada banda aparece una sola vez, en su sitio natural.
// - con paso asociado → en la tarjeta de ese paso;
// - Cruz de Guía → al frente de «Pasos procesionales»;
// - el resto (salidas sin paso, Santísimo…) → en «Acompañamiento musical».
export function isCrossGuideAccompaniment(item) {
  return !item?.pasoId && normalized(item?.posicion).startsWith('cruz de guia')
}

function hasBand(item) {
  return Boolean(String(item?.banda || '').trim())
}

export function stepAccompaniments(items = [], stepId = '') {
  if (!stepId) return []
  return items.filter((item) => item?.pasoId === stepId && hasBand(item))
}

export function crossGuideAccompaniments(items = []) {
  return items.filter((item) => isCrossGuideAccompaniment(item) && hasBand(item))
}

// Detalle tras «Cruz de Guía» («sección juvenil»), si lo hay.
export function crossGuideDetail(item) {
  const position = String(item?.posicion || '').trim()
  const [, ...rest] = position.split('·')
  return rest.join('·').trim()
}

// Periodos de acompañamiento ya mostrados en la sección de pasos.
export function accompanimentIdsShownInSteps(items = [], steps = []) {
  if (!steps.length) return []
  const stepIds = new Set(steps.map((step) => step?.id).filter(Boolean))
  return items
    .filter((item) => item?.id && hasBand(item) && (stepIds.has(item.pasoId) || isCrossGuideAccompaniment(item)))
    .map((item) => String(item.id))
}

// Campos de la túnica: solo los que tienen dato, en el orden de siempre.
const HABIT_FIELDS = [
  ['tunica', 'Túnica'],
  ['antifaz', 'Antifaz'],
  ['cordon', 'Cíngulo'],
  ['botonadura', 'Botonadura'],
  ['escudo', 'Escudo'],
  ['calzado', 'Calzado'],
  ['guantes', 'Guantes'],
]

export function habitFields(habit = {}) {
  return HABIT_FIELDS
    .map(([key, label]) => ({ key, label, value: String(habit?.[key] || '').trim() }))
    .filter((field) => field.value)
}

import { heritageTypeForValue } from './heritage-directory.js'

// «Sigue el hilo»: al resolver una palabra, el juego enlaza una ficha real de la
// enciclopedia en la que ver ese término. La ficha es un ejemplo, no una atribución:
// la palabra no se predica de esa entidad concreta, solo se invita a mirarla allí.
//
// Cada regla dice en qué sección buscar y qué candidatos sirven. Las palabras sin regla
// conservan el enlace al listado general definido en el banco editorial.

function normalize(value = '') {
  return String(value).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()
}

const stepOfType = (...slugs) => (item) => slugs.includes(heritageTypeForValue(item.type, 'pasos')?.slug)
const imageOfType = (...slugs) => (item) => slugs.includes(heritageTypeForValue(item.type, 'imagenes')?.slug)
const brotherhoodOfType = (...types) => (item) => (item.tipos || []).some((type) => types.includes(normalize(type)))
const bandOfType = (type) => (item) => normalize(item.type) === normalize(type)
const any = () => true

const SECTIONS = {
  pasos: { label: 'Míralo en un paso', fallback: 'pasos' },
  imagenes: { label: 'Míralo en una imagen', fallback: 'imagenes' },
  hermandades: { label: 'Míralo en una hermandad', fallback: 'hermandades' },
  bandas: { label: 'Escúchalo en una formación', fallback: 'bandas' },
}

const RULES = [
  { section: 'pasos', match: stepOfType('pasos-de-palio'), answers: ['PALIO', 'VARAL', 'BAMBALINA', 'CANDELERÍA', 'GLORIA'] },
  { section: 'pasos', match: stepOfType('pasos-de-misterio', 'pasos-de-cristo'), answers: ['CANASTILLA'] },
  {
    section: 'pasos',
    match: any,
    answers: ['LLAMADOR', 'RESPIRADERO', 'TRABAJADERA', 'COSTAL', 'CAPATAZ', 'CHICOTÁ', 'RELEVO', 'IGUALÁ', 'LEVANTÁ', 'ARRIÁ', 'FALDÓN', 'EXORNO'],
  },
  { section: 'imagenes', match: imageOfType('dolorosas'), answers: ['MANTO', 'SAYA', 'TOCADO', 'BORDADO', 'SALVE'] },
  { section: 'imagenes', match: any, answers: ['PEANA'] },
  {
    section: 'hermandades',
    match: brotherhoodOfType('penitencia'),
    answers: [
      'CAPIROTE', 'ANTIFAZ', 'TÚNICA', 'CÍNGULO', 'CIRIO', 'CERA', 'PENITENTE', 'INSIGNIA', 'ESTANDARTE', 'FAROL',
      'CIRIAL', 'ACÓLITO', 'NAVETA', 'INCENSARIO', 'PERTIGUERO', 'TRAMO', 'DALMÁTICA', 'PABILO', 'ESTACIÓN',
    ],
  },
  { section: 'hermandades', match: brotherhoodOfType('gloria', 'glorias'), answers: ['SIMPECADO', 'ROSARIO'] },
  { section: 'bandas', match: bandOfType('Cornetas y Tambores'), answers: ['CORNETA', 'TAMBOR', 'BAQUETA'] },
]

const RULE_BY_ANSWER = new Map(RULES.flatMap((rule) => rule.answers.map((answer) => [normalize(answer), rule])))

export const HILO_THREAD_SECTIONS = Object.keys(SECTIONS)

export function hiddenThreadRule(answer) {
  return RULE_BY_ANSWER.get(normalize(answer)) || null
}

export function hiddenThreadSectionsFor(answers = []) {
  return [...new Set(answers.map((answer) => hiddenThreadRule(answer)?.section).filter(Boolean))]
}

export function hiddenThreadLabel(section) {
  return SECTIONS[section]?.label || 'Sigue el hilo'
}

function hash(value) {
  let result = 2166136261
  for (const char of String(value)) {
    result ^= char.codePointAt(0)
    result = Math.imul(result, 16777619)
  }
  return result >>> 0
}

// Elige una ficha determinista para la palabra y el día: todos los visitantes ven la misma
// y cambia cada día. Se prefieren fichas con imagen o escudo (más completas); si hay pocas,
// se usan todas las que cumplen la regla.
export function pickHiddenThread({ answer, dayKey, items = [] }) {
  const rule = hiddenThreadRule(answer)
  if (!rule) return null
  const candidates = items
    .filter((item) => item?.href && item?.name && rule.match(item))
    .sort((a, b) => String(a.href).localeCompare(String(b.href)))
  if (!candidates.length) return null
  const withMedia = candidates.filter((item) => item.hasMedia)
  const pool = withMedia.length >= 5 ? withMedia : candidates
  const chosen = pool[hash(dayKey + ':' + normalize(answer)) % pool.length]
  return {
    section: rule.section,
    label: hiddenThreadLabel(rule.section),
    href: chosen.href,
    name: chosen.name,
    context: chosen.context || '',
  }
}

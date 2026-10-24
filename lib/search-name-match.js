// Coincidencia por nombre para el buscador universal.
//
// Módulo puro (sin Supabase ni Next) para poder probarlo con `node --test`.
// Resuelve dos cosas que el ranking por subcadena no distinguía:
//   1. «Hermandad de la O», «La O» y «la o» nombran la misma ficha: se comparan
//      por su clave (sin tipo de entidad ni artículo inicial), no por subcadena.
//   2. Una coincidencia exacta con el nombre de una ficha debe ir por delante de
//      los listados («Directorio de Hermandades») y de las coincidencias parciales.

import { normalizeHiloSearchText } from './tira-search-intent.js'

// Por encima de los listados de directorio (2400) y del relleno por ámbito (1750).
export const EXACT_NAME_SCORE = 3000

// Desempate dentro de las coincidencias exactas: la ficha principal de una
// corporación va antes que una marcha o un acontecimiento con el mismo nombre
// («Baratillo» → la Hermandad antes que la marcha «Baratillo»).
const ENTITY_TYPE_BONUS = {
  brotherhood: 60,
  band: 50,
  image: 40,
  step: 30,
  march: 20,
}

// Si la consulta nombra el tipo («Banda del Sol»), ese tipo gana el desempate
// frente a otra ficha con la misma clave (Hermandad «El Sol»).
const TYPED_ENTITY_BONUS = 100
const FULL_TEXT_BONUS = 10

const TYPE_PREFIX = /^(?:(?:la|el)\s+)?(hermandad|cofradia|archicofradia|agrupacion parroquial|agrupacion|banda|paso|imagen|marcha)\s+(?:de\s+la\s+|de\s+los\s+|de\s+las\s+|del\s+|de\s+)?/
const RAW_TYPE_PREFIX = /^(?:(?:la|el)\s+)?(?:hermandad|cofrad[ií]a|archicofrad[ií]a|agrupaci[oó]n\s+parroquial|agrupaci[oó]n|banda|paso|imagen|marcha)\s+(?:de\s+la\s+|de\s+los\s+|de\s+las\s+|del\s+|de\s+)?/i
const LEADING_ARTICLE = /^(?:el|la|los|las)\s+/
const RAW_LEADING_ARTICLE = /^(?:el|la|los|las)\s+/i

const TYPE_WORDS = new Map([
  ['hermandad', 'brotherhood'],
  ['cofradia', 'brotherhood'],
  ['archicofradia', 'brotherhood'],
  ['agrupacion', 'brotherhood'],
  ['agrupacion parroquial', 'brotherhood'],
  ['banda', 'band'],
  ['paso', 'step'],
  ['imagen', 'image'],
  ['marcha', 'march'],
])

export function normalizeSearchName(value = '') {
  return normalizeHiloSearchText(String(value || '').replace(/[-_]+/g, ' '))
}

// «Hermandad de La O» → «o»; «El Baratillo» → «baratillo»; «Banda del Sol» → «sol».
export function searchNameKey(value = '') {
  return normalizeSearchName(value)
    .replace(TYPE_PREFIX, '')
    .replace(LEADING_ARTICLE, '')
    .trim()
}

// Igual que searchNameKey pero conservando tildes y mayúsculas, para usarlo en
// filtros `ilike` de Postgres (que distinguen tildes).
export function rawSearchNameKey(value = '') {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .replace(RAW_TYPE_PREFIX, '')
    .replace(RAW_LEADING_ARTICLE, '')
    .trim()
}

export function typedEntityType(term = '') {
  const match = normalizeSearchName(term).match(TYPE_PREFIX)
  return match ? TYPE_WORDS.get(match[1]) || '' : ''
}

// Comprueba si un nombre almacenado coincide con la consulta para recuperarlo
// como candidato. Sustituye al antiguo `includes` sensible a tildes y añade la
// clave de la consulta cuando lleva tipo delante («Hermandad del Baratillo»).
export function searchNameCandidateMatch(value, term) {
  const text = normalizeSearchName(value)
  const query = normalizeSearchName(term)
  if (!text || !query) return false
  if (text.includes(query)) return true

  const key = searchNameKey(term)
  if (!key || key === query) return false
  // Claves muy cortas («o», «sol» no) solo valen como igualdad: «o» no puede
  // traer cualquier nombre que contenga esa letra.
  if (key.length < 3) return searchNameKey(value) === key
  // Palabra completa: «sol» no debe traer «Soledad».
  return ` ${text} `.includes(` ${key} `)
}

// Puntuación de coincidencia exacta o casi exacta. Devuelve 0 si no la hay.
export function exactNameScore(names = [], term = '', entityType = '') {
  const query = normalizeSearchName(term)
  const key = searchNameKey(term)
  if (!query) return 0

  let full = false
  let byKey = false
  for (const name of names) {
    const text = normalizeSearchName(name)
    if (!text) continue
    if (text === query) full = true
    if (key && searchNameKey(name) === key) byKey = true
  }
  if (!full && !byKey) return 0

  const typed = typedEntityType(term)
  return EXACT_NAME_SCORE
    + (ENTITY_TYPE_BONUS[entityType] || 0)
    + (typed && typed === entityType ? TYPED_ENTITY_BONUS : 0)
    + (full ? FULL_TEXT_BONUS : 0)
}

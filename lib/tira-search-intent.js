const PLURAL_SCOPE = /^(hermandades|bandas|imagenes|imágenes|pasos|marchas|autores|profesionales|extraordinarias)\b/i
const SEMANTIC_TARGET = /\b(conexion|conexión|relacion|relación|entre|acompanan|acompañan|acompaña|acompaña|autores|anteriores|posteriores|cuales|cuáles|quienes|quiénes|donde|dónde|cuando|cuándo|como|cómo|por que|por qué)\b/i
const QUESTION_START = /^(quien|quién|quienes|quiénes|que|qué|cual|cuál|cuales|cuáles|cuanto|cuánto|cuantos|cuántos|cuantas|cuántas|donde|dónde|como|cómo|por que|por qué|cuando|cuándo|dime|cuentame|cuéntame|hay|tiene|tienen)\b/i

export function normalizeHiloSearchText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function hiloEntityKey(value = '') {
  return normalizeHiloSearchText(value)
    .replace(/^(?:ficha|perfil)\s+(?:de\s+la\s+|del\s+|de\s+)?/, '')
    .replace(/^(?:hermandad|banda|paso|imagen|marcha)\s+(?:de\s+la\s+|del\s+|de\s+)?/, '')
    .replace(/^(?:el|la|los|las)\s+/, '')
    .trim()
}

function cleanTarget(value = '') {
  return String(value)
    .trim()
    .replace(/^[¿¡]\s*/, '')
    .replace(/[?!]\s*$/, '')
    .trim()
}

function validEntityTarget(value = '') {
  const target = cleanTarget(value)
  if (target.length < 2 || target.length > 100) return ''
  if (PLURAL_SCOPE.test(target)) return ''
  if (/^(alguna|algunas|algunos|todas|todos)\b/i.test(target)) return ''
  if (SEMANTIC_TARGET.test(target)) return ''
  return target
}

export function getHiloLookupIntent(rawValue = '', { allowBare = true } = {}) {
  const raw = String(rawValue || '').trim().slice(0, 160)
  if (!raw) return null

  const stripped = cleanTarget(raw)
  const explicitPatterns = [
    /^(?:ficha|perfil)\s+(?:de\s+la\s+|del\s+|de\s+)?(.+)$/i,
    /^(?:busca|buscar|abre|abrir|ver|ve|mostrar|muestra|enseña|ensena)\s+(?:la\s+|el\s+)?(?:ficha\s+|perfil\s+)?(?:de\s+la\s+|del\s+|de\s+)?(.+)$/i,
    /^(?:ir\s+a|ir\s+al|ir\s+a\s+la|llévame\s+a|llevame\s+a)\s+(?:la\s+|el\s+)?(?:ficha\s+|perfil\s+)?(?:de\s+la\s+|del\s+|de\s+)?(.+)$/i,
  ]

  for (const pattern of explicitPatterns) {
    const match = stripped.match(pattern)
    const term = validEntityTarget(match?.[1] || '')
    if (term) return { term, explicitNavigation: true }
  }

  if (!allowBare) return null
  if (raw.includes('?') || raw.includes('¿') || QUESTION_START.test(stripped)) return null
  if (PLURAL_SCOPE.test(stripped) || SEMANTIC_TARGET.test(stripped)) return null

  const words = normalizeHiloSearchText(stripped).split(' ').filter(Boolean)
  if (words.length < 1 || words.length > 9) return null

  return { term: stripped, explicitNavigation: false }
}

export function prioritizeHiloNavigationItems(items = []) {
  return [...items]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => Number(Boolean(b.item?.href)) - Number(Boolean(a.item?.href)) || a.index - b.index)
    .map(({ item }) => item)
}

export function selectHiloNavigationItems(items = [], term = '', { explicitNavigation = false, limit = 5 } = {}) {
  const navigable = prioritizeHiloNavigationItems(items).filter((item) => item?.href)
  if (!navigable.length) return []

  const key = hiloEntityKey(term)
  const exact = key ? navigable.filter((item) => hiloEntityKey(item?.title) === key) : []
  if (exact.length) return exact.slice(0, explicitNavigation ? 1 : limit)

  return navigable.slice(0, explicitNavigation ? 1 : limit)
}

const PLURAL_SCOPE = /^(?:(?:todas?|todos?)\s+)?(?:(?:las?|los?)\s+)?(?:hermandades|bandas|imagenes|pasos|marchas|autores|profesionales|extraordinarias|cultos|crucetas|repertorios|procesiones|rosarios|besamanos|besapies|conciertos|agenda)\b/
const CALENDAR_SCOPE = /^(?:(?:el|la)\s+)?(?:viernes de dolores|sabado de pasion|domingo de ramos|lunes santo|martes santo|miercoles santo|jueves santo|madrugada|viernes santo|sabado santo|domingo de resurreccion)\b/
const SEMANTIC_TARGET = /\b(conexion|conexión|relacion|relación|entre|acompanan|acompañan|acompaña|acompaña|autores|anteriores|posteriores|cuales|cuáles|quienes|quiénes|donde|dónde|cuando|cuándo|como|cómo|por que|por qué)\b/i
const QUESTION_START = /^(quien|quién|quienes|quiénes|que|qué|cual|cuál|cuales|cuáles|cuanto|cuánto|cuantos|cuántos|cuantas|cuántas|donde|dónde|como|cómo|por que|por qué|cuando|cuándo|dime|cuentame|cuéntame|busca|buscar|muestra|mostrar|ensena|enseña|hay|tiene|tienen)\b/i
const EXPLICIT_ENTITY_TYPE_PRIORITY = new Map([
  ['brotherhood', 0],
  ['band', 1],
  ['image', 2],
  ['step', 3],
  ['march', 4],
])
const ENTITY_TYPE_WORDS = new Map([
  ['hermandad', 'brotherhood'],
  ['cofradia', 'brotherhood'],
  ['banda', 'band'],
  ['imagen', 'image'],
  ['paso', 'step'],
  ['marcha', 'march'],
])

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
  const normalizedTarget = normalizeHiloSearchText(target)
  if (PLURAL_SCOPE.test(normalizedTarget) || CALENDAR_SCOPE.test(normalizedTarget)) return ''
  if (/^(alguna|algunas|algunos|todas|todos)\b/i.test(target)) return ''
  if (SEMANTIC_TARGET.test(target)) return ''
  return target
}

function explicitEntityTarget(value = '') {
  const target = cleanTarget(value)
  const typed = target.match(/^(?:la\s+|el\s+)?(hermandad|cofrad[ií]a|banda|imagen|paso|marcha)\s+(?:de\s+la\s+|del\s+|de\s+)?(.+)$/i)
  const preferredEntityType = ENTITY_TYPE_WORDS.get(normalizeHiloSearchText(typed?.[1] || '')) || ''
  const term = validEntityTarget(typed?.[2] || target)

  return term ? { term, preferredEntityType } : null
}

export function getHiloLookupIntent(rawValue = '', { allowBare = true } = {}) {
  const raw = String(rawValue || '').trim().slice(0, 160)
  if (!raw) return null

  const stripped = cleanTarget(raw)
  const normalizedStripped = normalizeHiloSearchText(stripped)
  const explicitPatterns = [
    /^(?:ficha|perfil)\s+(?:de\s+la\s+|del\s+|de\s+)?(.+)$/i,
    /^(?:busca|buscar|abre|abrir|ver|ve|mostrar|muestra|enseña|ensena)\s+(?:la\s+|el\s+)?(?:ficha\s+|perfil\s+)?(?:de\s+la\s+|del\s+|de\s+)?(.+)$/i,
    /^(?:ir\s+a|ir\s+al|ir\s+a\s+la|llévame\s+a|llevame\s+a)\s+(?:la\s+|el\s+)?(?:ficha\s+|perfil\s+)?(?:de\s+la\s+|del\s+|de\s+)?(.+)$/i,
  ]

  for (const pattern of explicitPatterns) {
    const match = stripped.match(pattern)
    const target = explicitEntityTarget(match?.[1] || '')
    if (target) {
      return {
        term: target.term,
        explicitNavigation: true,
        ...(target.preferredEntityType ? { preferredEntityType: target.preferredEntityType } : {}),
      }
    }
  }

  if (!allowBare) return null
  if (raw.includes('?') || raw.includes('¿') || QUESTION_START.test(stripped)) return null
  if (PLURAL_SCOPE.test(normalizedStripped) || CALENDAR_SCOPE.test(normalizedStripped) || SEMANTIC_TARGET.test(stripped)) return null

  const words = normalizeHiloSearchText(stripped).split(' ').filter(Boolean)
  if (words.length < 1 || words.length > 9) return null

  return { term: stripped, explicitNavigation: false }
}

function explicitEntityTypeRank(entityType = '', preferredEntityType = '') {
  if (preferredEntityType && entityType === preferredEntityType) return -1
  return EXPLICIT_ENTITY_TYPE_PRIORITY.get(entityType) ?? 99
}

export function prioritizeHiloNavigationItems(items = [], term = '', {
  explicitNavigation = false,
  preferredEntityType = '',
} = {}) {
  const key = explicitNavigation ? hiloEntityKey(term) : ''

  return [...items]
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const navigableDifference = Number(Boolean(b.item?.href)) - Number(Boolean(a.item?.href))
      if (navigableDifference) return navigableDifference

      const exactA = Boolean(key && hiloEntityKey(a.item?.title) === key)
      const exactB = Boolean(key && hiloEntityKey(b.item?.title) === key)
      if (exactA !== exactB) return Number(exactB) - Number(exactA)

      if (exactA && exactB) {
        const typeDifference = explicitEntityTypeRank(a.item?.entityType, preferredEntityType)
          - explicitEntityTypeRank(b.item?.entityType, preferredEntityType)
        if (typeDifference) return typeDifference
      }

      return a.index - b.index
    })
    .map(({ item }) => item)
}

export function selectHiloNavigationItems(items = [], term = '', {
  explicitNavigation = false,
  preferredEntityType = '',
  limit = 5,
} = {}) {
  const navigable = prioritizeHiloNavigationItems(items, term, {
    explicitNavigation,
    preferredEntityType,
  }).filter((item) => item?.href)
  if (!navigable.length) return []

  const key = hiloEntityKey(term)
  const exact = key ? navigable.filter((item) => hiloEntityKey(item?.title) === key) : []
  if (exact.length) return exact.slice(0, explicitNavigation ? 1 : limit)

  return navigable.slice(0, explicitNavigation ? 1 : limit)
}

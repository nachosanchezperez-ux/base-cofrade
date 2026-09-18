export function normalizeSetReasoningText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function romanToInt(value = '') {
  const roman = String(value || '').toUpperCase()
  if (!roman || !/^[IVXLCDM]+$/.test(roman)) return null
  const values = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
  let total = 0
  let previous = 0
  for (let index = roman.length - 1; index >= 0; index -= 1) {
    const current = values[roman[index]] || 0
    total += current < previous ? -current : current
    previous = Math.max(previous, current)
  }
  return total > 0 ? total : null
}

export function foundationChronologyKey(value = '') {
  const text = String(value || '').trim()
  if (!text) return null

  const candidates = []
  const years = text.match(/\b(?:1[0-9]{3}|20[0-9]{2})\b/g) || []
  years.forEach((year) => candidates.push(Number(year)))

  const centuryMatches = [...text.matchAll(/siglo\s+([ivxlcdm]+)/gi)]
  centuryMatches.forEach((match) => {
    const century = romanToInt(match[1])
    if (century && century <= 30) candidates.push(((century - 1) * 100) + 1)
  })

  const valid = candidates.filter((value) => Number.isFinite(value) && value >= 1)
  return valid.length ? Math.min(...valid) : null
}

export function setReasoningV8Intent(question = '', context = null) {
  const q = normalizeSetReasoningText(question)
  const setType = context?.resultSet?.entityType || ''
  const ids = Array.isArray(context?.resultSet?.entityIds) ? context.resultSet.entityIds : []
  if (!q || setType !== 'brotherhood' || ids.length < 2) return null

  const chronology = /\b(antiguedad|antigua|antiguas|antiguo|antiguos|fundacion|fundaciones|cronolog|mas antigua|mas antiguas|mas reciente|mas recientes)\b/.test(q)
  const ordering = /\b(ordena|ordenalas|ordenalos|ordenar|ordenadas|ordenados|clasifica|lista)\b/.test(q)
    || /\bde mas (?:antigua|antiguas|reciente|recientes) a mas (?:antigua|antiguas|reciente|recientes)\b/.test(q)
  if (chronology && ordering) {
    return {
      kind: 'brotherhood_set_foundation_order',
      direction: /\bmas reciente(?:s)?\b.*\bmas antigua(?:s)?\b/.test(q) ? 'newest_first' : 'oldest_first',
    }
  }

  const cults = /\b(culto|cultos|quinario|quinarios|triduo|triduos|novena|novenas|besamanos|besapies)\b/.test(q)
  const future = /\b(proximo|proximos|proxima|proximas|proximamente|quedan|siguientes|agenda|futuros|futuras)\b/.test(q)
  if (cults && future) return { kind: 'brotherhood_set_upcoming_cults' }

  const agents = /\b(autor|autores|artista|artistas|profesional|profesionales|escultor|escultores)\b/.test(q)
  const repeated = /\b(repiten|repite|repetidos|repetidas|comparten|compartidos|compartidas|comun|comunes|coinciden|varias|mas de una|mas de dos)\b/.test(q)
  if (agents && repeated) return { kind: 'brotherhood_set_repeated_agents' }

  return null
}

const ROMAN_VALUES = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }

function romanToNumber(value = '') {
  const roman = String(value).toUpperCase()
  let total = 0
  let previous = 0
  for (let index = roman.length - 1; index >= 0; index -= 1) {
    const current = ROMAN_VALUES[roman[index]] || 0
    total += current < previous ? -current : current
    previous = Math.max(previous, current)
  }
  return total || null
}

export function temporalValue(value = '') {
  const text = String(value || '').trim()
  if (!text) return null

  const exact = text.match(/\b(1[0-9]{3}|20[0-9]{2})\b/)
  if (exact) {
    const year = Number(exact[1])
    return { sort: year, precision: 'year', label: text, year }
  }

  const centuryMatch = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .match(/siglo\s+([ivxlcdm]+|\d{1,2})/i)
  if (!centuryMatch) return null

  const century = /^\d+$/.test(centuryMatch[1])
    ? Number(centuryMatch[1])
    : romanToNumber(centuryMatch[1])
  if (!century) return null

  // El valor solo sirve para ordenar siglos entre sí. No se presenta como un año inferido.
  return { sort: (century - 1) * 100 + 50, precision: 'century', label: text, century }
}

export function sortTemporal(entries = [], direction = 'oldest') {
  const dated = entries
    .map((entry) => ({ ...entry, temporal: temporalValue(entry.dateText) }))
    .filter((entry) => entry.temporal)
    .sort((a, b) => {
      const difference = a.temporal.sort - b.temporal.sort
      if (difference !== 0) return direction === 'newest' ? -difference : difference
      return String(a.name || '').localeCompare(String(b.name || ''), 'es')
    })

  const undated = entries
    .filter((entry) => !temporalValue(entry.dateText))
    .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'es'))

  return { dated, undated }
}

function orderDirection(q) {
  const oldCandidates = ['mas antigua', 'mas antiguo']
  const newCandidates = ['mas reciente', 'mas moderna', 'mas moderno', 'mas nueva', 'mas nuevo']
  const firstIndex = (candidates) => candidates
    .map((candidate) => q.indexOf(candidate))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0]

  const oldIndex = firstIndex(oldCandidates)
  const newIndex = firstIndex(newCandidates)
  if (oldIndex === undefined && newIndex === undefined) return 'oldest'
  if (oldIndex === undefined) return 'newest'
  if (newIndex === undefined) return 'oldest'
  return oldIndex < newIndex ? 'oldest' : 'newest'
}

export function temporalIntent(question = '') {
  const q = String(question || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  const asksOrder = /\b(ordena|ordenalas|ordenalos|ordenar|de mas antigua|de mas antiguo|de mas reciente|cronologic)\w*/.test(q)
  const asksOldest = /\b(mas antigua|mas antiguo|la primera|el primero|oldest)\b/.test(q)
  const asksNewest = /\b(mas reciente|mas moderna|mas moderno|mas nueva|mas nuevo|ultima|ultimo|newest)\b/.test(q)

  if (asksOrder) return { direction: orderDirection(q), mode: 'sort' }
  if (asksNewest) return { direction: 'newest', mode: 'extreme' }
  if (asksOldest) return { direction: 'oldest', mode: 'extreme' }
  return null
}

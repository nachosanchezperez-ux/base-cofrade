export function normalizeDiscovery(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function isDiscoveryIntent(question = '') {
  const q = normalizeDiscovery(question)
  return /\b(tira de (?:algun|un|otro) hilo|sorprendeme|sorprende me|algo curioso|relacion curiosa|conexion curiosa|hilo curioso|descubre(?:me)?|ensename una conexion|muestrame una conexion)\b/.test(q)
}

export function stableHash(value = '') {
  let hash = 2166136261
  const text = String(value)
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function chooseDiscoveryCandidate(candidates = [], seed = '') {
  const unique = []
  const seen = new Set()
  for (const candidate of candidates) {
    if (!candidate?.id || seen.has(candidate.id)) continue
    seen.add(candidate.id)
    unique.push(candidate)
  }
  if (!unique.length) return null

  const ranked = [...unique]
    .sort((a, b) => (b.score || 0) - (a.score || 0) || String(a.name || '').localeCompare(String(b.name || ''), 'es'))
    .slice(0, 8)

  return ranked[stableHash(seed) % ranked.length] || ranked[0]
}

export function discoveryDateKey(date = new Date()) {
  try {
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Europe/Madrid',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  } catch {
    return date.toISOString().slice(0, 10)
  }
}

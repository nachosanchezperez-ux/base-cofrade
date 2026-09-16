export function normalizePublishedContentText(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[¿?¡!.,;:()«»"']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const STOP_WORDS = new Set([
  'a', 'al', 'con', 'cual', 'cuales', 'de', 'del', 'dime', 'el', 'en', 'hay',
  'la', 'las', 'los', 'me', 'muestra', 'que', 'se', 'son', 'un', 'una', 'ver',
])

export function publishedContentIntent(question = '') {
  const q = normalizePublishedContentText(question)
  if (!q) return null

  if (/\b(cruceta|crucetas|repertorio musical|repertorios musicales|repertorio procesional|repertorios procesionales)\b/.test(q)) {
    return { kind: 'musical_repertoires' }
  }
  if (/\b(procesion|procesiones) de gloria\b/.test(q)) {
    return { kind: 'glory_processions' }
  }
  if (/\b(extraordinaria|extraordinarias|salida extraordinaria|salidas extraordinarias)\b/.test(q)) {
    return { kind: 'extraordinary_outings' }
  }
  if (/\b(culto|cultos|quinario|quinarios|triduo|triduos|novena|novenas|funcion principal|funciones principales)\b/.test(q)) {
    return { kind: 'cults' }
  }
  if (/\b(agenda|rosario|rosarios|besamanos|besapies|concierto|conciertos|traslado|traslados)\b/.test(q)
    || /^(?:que hay|agenda|actos?|eventos?)(?:\s+en\s+[a-z ]+)?\s+(?:hoy|este fin de semana)$/.test(q)) {
    return { kind: 'agenda' }
  }
  return null
}

export function publishedContentScore(values = [], question = '') {
  const q = normalizePublishedContentText(question)
  const haystack = normalizePublishedContentText(values.filter(Boolean).join(' '))
  if (!q || !haystack) return 0
  if (haystack === q) return 2000
  if (haystack.includes(q)) return 1500

  const tokens = q
    .split(' ')
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token))
  if (!tokens.length) return 0
  const matched = tokens.filter((token) => haystack.includes(token)).length
  return matched * 100 + Math.round((matched / tokens.length) * 100)
}

export function outingPublicHref(item = {}, brotherhoodSlug = '') {
  if (item.character === 'extraordinary' && item.slug) return `/extraordinarias/${item.slug}`
  if (normalizePublishedContentText(item.outingType || item.outing_type).includes('procesion de gloria') && item.slug) {
    return `/procesiones-de-gloria/${item.slug}`
  }
  return brotherhoodSlug ? `/hermandades/${brotherhoodSlug}#salidas` : ''
}

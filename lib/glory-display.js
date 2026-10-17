export function gloryDisplayTitle(title = '', year = null) {
  const source = String(title || '').trim()
  if (!source) return ''

  const withoutPrefix = source
    .replace(/^(?:Solemne\s+)?Procesión(?:\s+Triunfal)?(?:\s+de\s+Gloria)?\s+(?:del|de\s+(?:la|el|los|las)|de)\s+/i, '')
    .replace(/^(?:la|el|los|las)\s+(?=[A-ZÁÉÍÓÚÜÑ])/i, '')

  const expectedYear = Number(year)
  const withoutYear = expectedYear
    ? withoutPrefix.replace(new RegExp(`\\s+${expectedYear}$`), '')
    : withoutPrefix.replace(/\s+(?:19|20)\d{2}$/, '')

  // «… de la Macarena · 2026» deja un «·» colgando al quitar el año.
  return withoutYear.replace(/[\s·,:;–-]+$/u, '').trim() || source
}

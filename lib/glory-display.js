export function gloryDisplayTitle(title = '', year = null) {
  const source = String(title || '').trim()
  if (!source) return ''

  const withoutPrefix = source
    .replace(/^(?:Solemne\s+)?Procesión(?:\s+Triunfal)?(?:\s+de\s+Gloria)?\s+de\s+/i, '')
    .replace(/^(?:la|el|los|las)\s+(?=[A-ZÁÉÍÓÚÜÑ])/i, '')

  const expectedYear = Number(year)
  const withoutYear = expectedYear
    ? withoutPrefix.replace(new RegExp(`\\s+${expectedYear}$`), '')
    : withoutPrefix.replace(/\s+(?:19|20)\d{2}$/, '')

  return withoutYear.trim() || source
}

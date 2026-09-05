function normalized(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .replace(/\s+/g, ' ')
    .trim()
}

export function publicOutingRouteSlug(outing = {}, extraordinarySlugs = new Set()) {
  const slug = String(outing.slug || '').trim()
  if (!slug) return ''

  if (extraordinarySlugs.has(slug)) return slug

  const isOrdinaryGlory = normalized(outing.caracter) === 'ordinary'
    && normalized(outing.tipo) === 'procesion de gloria'

  return isOrdinaryGlory ? `gloria/${slug}` : ''
}

export function uniquePublicOutings(items = []) {
  const seenIds = new Set()
  const seenSemantic = new Set()

  return items.filter((item) => {
    // El Vía Crucis del Consejo se presenta como participación institucional
    // en su módulo específico. Conservamos la salida histórica en datos, pero
    // evitamos duplicarla dentro del bloque genérico de Salidas.
    if (normalized(item?.tipo) === 'via crucis del consejo') return false

    const id = String(item?.id || '').trim()
    if (id && seenIds.has(id)) return false

    const semanticKey = [
      normalized(item?.tipo),
      normalized(item?.nombre).replace(/\b(?:19|20)\d{2}\b/g, '').trim(),
      normalized(item?.momento),
      normalized(item?.caracter),
    ].join('|')

    if (semanticKey !== '|||' && seenSemantic.has(semanticKey)) return false

    if (id) seenIds.add(id)
    if (semanticKey !== '|||') seenSemantic.add(semanticKey)
    return true
  })
}

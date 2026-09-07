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
  const seriesWithConcreteEdition = new Set(
    items
      .filter((item) => normalized(item?.caracter) !== 'anual')
      .map((item) => String(item?.serieId || '').trim())
      .filter(Boolean)
  )

  return items.filter((item) => {
    // El Vía Crucis del Consejo se presenta como participación institucional
    // en su módulo específico. Conservamos la salida histórica en datos, pero
    // evitamos duplicarla dentro del bloque genérico de Salidas.
    const institutionalLabel = normalized(`${item?.tipo || ''} ${item?.nombre || ''}`)
    if (
      institutionalLabel.includes('via crucis')
      && (institutionalLabel.includes('del consejo') || institutionalLabel.includes('de las cofradias'))
    ) return false

    const seriesId = String(item?.serieId || '').trim()
    if (normalized(item?.caracter) === 'anual' && seriesId && seriesWithConcreteEdition.has(seriesId)) return false

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

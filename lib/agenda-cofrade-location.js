export function agendaMunicipalitySlug(value = '') {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function agendaMunicipalityRouteSlug(value = '') {
  const slug = agendaMunicipalitySlug(value)
  if (!slug) return ''
  return slug === 'sevilla' || slug === 'sevilla-capital' ? 'sevilla-capital' : slug
}

export function agendaMunicipalityOptions(items = []) {
  const bySlug = new Map()

  for (const item of items) {
    if (item?.scope !== 'province' || !item?.municipality) continue
    const slug = agendaMunicipalitySlug(item.municipality)
    if (!slug || bySlug.has(slug)) continue
    bySlug.set(slug, {
      slug,
      label: String(item.municipality).trim(),
    })
  }

  return [...bySlug.values()].sort((first, second) => (
    first.label.localeCompare(second.label, 'es', { sensitivity: 'base' })
  ))
}

export function agendaLocationMatches(item, territory = 'all', municipality = '') {
  if (territory === 'all') return true
  if (territory === 'capital') return item?.scope === 'capital'
  if (territory !== 'province' || item?.scope !== 'province') return false

  const selectedMunicipality = agendaMunicipalitySlug(municipality)
  if (!selectedMunicipality) return true
  return agendaMunicipalitySlug(item?.municipality) === selectedMunicipality
}

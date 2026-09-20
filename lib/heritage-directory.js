const MIN_LOCALITY_ITEMS = 3

function compareLabels(first = '', second = '') {
  return String(first).localeCompare(String(second), 'es', { sensitivity: 'base' })
}

export function heritageDirectoryLocalityPath(section, slug) {
  if (!['imagenes', 'pasos'].includes(section) || !slug) return ''
  return `/${section}/localidad/${slug}`
}

export function heritageDirectoryLocalities(items = [], section, minimum = MIN_LOCALITY_ITEMS) {
  const localities = new Map()

  items.forEach((item) => {
    if (!item.municipalitySlug || !item.municipality) return
    const current = localities.get(item.municipalitySlug) || {
      slug: item.municipalitySlug,
      label: item.municipality,
      count: 0,
    }
    current.count += 1
    localities.set(item.municipalitySlug, current)
  })

  return [...localities.values()]
    .filter((item) => item.count >= minimum)
    .map((item) => ({
      ...item,
      href: heritageDirectoryLocalityPath(section, item.slug),
    }))
    .sort((first, second) => {
      if (first.slug === 'sevilla') return -1
      if (second.slug === 'sevilla') return 1
      return compareLabels(first.label, second.label)
    })
}

export function heritageItemsForLocality(items = [], section, slug) {
  const facet = heritageDirectoryLocalities(items, section).find((item) => item.slug === slug)
  return facet ? items.filter((item) => item.municipalitySlug === slug) : []
}

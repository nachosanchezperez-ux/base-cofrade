import {
  displayName,
  localityLabel,
  localitySlug,
  normalizeDirectoryValue,
} from './brotherhood-directory.js'

export const MIN_BROTHERHOOD_LOCALITY_ITEMS = 3

function compareText(first, second) {
  return first.localeCompare(second, 'es', { sensitivity: 'base' })
}

export function groupBrotherhoodsByLocality(brotherhoods = []) {
  const groups = new Map()

  for (const brotherhood of brotherhoods) {
    if (!brotherhood?.slug) continue
    const locality = String(brotherhood.localidad || 'Localidad por documentar').trim()
    const key = normalizeDirectoryValue(locality) || 'sin-localidad'

    if (!groups.has(key)) groups.set(key, {
      key,
      locality,
      slug: localitySlug(brotherhood),
      items: [],
    })
    groups.get(key).items.push(brotherhood)
  }

  return [...groups.values()]
    .map((group) => ({
      ...group,
      items: [...group.items].sort((first, second) => compareText(displayName(first), displayName(second))),
    }))
    .sort((first, second) => {
      if (first.key === 'sevilla') return -1
      if (second.key === 'sevilla') return 1
      return compareText(first.locality, second.locality)
    })
}

export function brotherhoodLocalityPath(slug = '') {
  return slug ? `/hermandades/localidad/${slug}` : ''
}

export function brotherhoodDirectoryLocalities(
  brotherhoods = [],
  minimum = MIN_BROTHERHOOD_LOCALITY_ITEMS
) {
  return groupBrotherhoodsByLocality(brotherhoods)
    .filter((group) => group.slug && group.items.length >= minimum)
    .map((group) => ({
      slug: group.slug,
      label: localityLabel(group.items[0]),
      count: group.items.length,
      href: brotherhoodLocalityPath(group.slug),
    }))
}

export function brotherhoodsForLocality(brotherhoods = [], slug = '') {
  const locality = brotherhoodDirectoryLocalities(brotherhoods)
    .find((item) => item.slug === slug)

  return locality
    ? brotherhoods.filter((brotherhood) => localitySlug(brotherhood) === slug)
    : []
}

export function filterIndexableBrotherhoods(brotherhoods = [], indexableEntries = []) {
  const indexableIds = new Set(
    indexableEntries
      .filter((entry) => entry.entityType === 'brotherhood')
      .map((entry) => entry.id)
      .filter(Boolean)
  )

  return brotherhoods.filter((brotherhood) => indexableIds.has(brotherhood.id))
}

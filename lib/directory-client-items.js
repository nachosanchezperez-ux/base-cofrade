// RelationalEntityDirectory is a client component: every field of every item is
// serialized into the page payload (~700 Imágenes, ~490 Pasos). Keep only what
// the card and the in-page search actually read; ficha data stays server-side.

export function compactImageDirectoryItem(item) {
  return {
    id: item.id,
    name: item.name,
    href: item.href,
    type: item.type,
    date: item.date,
    brotherhoodName: item.brotherhoodName,
    municipality: item.municipality,
    municipalitySlug: item.municipalitySlug,
    place: item.place,
    authorNames: item.authorNames || [],
    coverPath: item.coverPath,
    coverAlt: item.coverAlt,
  }
}

export function compactStepDirectoryItem(item) {
  return {
    id: item.id,
    name: item.name,
    href: item.href,
    type: item.type,
    date: item.date,
    brotherhoodName: item.brotherhoodName,
    municipality: item.municipality,
    municipalitySlug: item.municipalitySlug,
    imageNames: (item.imageNames || []).slice(0, 2),
    authorNames: (item.authorNames || []).slice(0, 2),
    coverPath: item.coverPath,
    coverAlt: item.coverAlt || [item.name, item.brotherhoodName].filter(Boolean).join(' · '),
    searchText: [
      item.style,
      item.materials,
      item.condition,
      ...(item.imageNames || []),
      ...(item.authorNames || []),
      ...(item.disciplines || []),
    ].filter(Boolean).join(' '),
  }
}

export function compactHeritageDirectoryItems(items = [], kind) {
  if (kind === 'image') return items.map(compactImageDirectoryItem)
  if (kind === 'step') return items.map(compactStepDirectoryItem)
  return items
}

// RelationalEntityDirectory is a client component: every field of every item is
// serialized into the page payload (~700 Imágenes, ~490 Pasos). Keep only what
// the card and the in-page search actually read; ficha data stays server-side.
//
// Medido en producción (17/10/2026): el array de items pesaba 258 KB en /imagenes
// y 286 KB en /pasos. Se omiten los campos que el cliente puede deducir:
// - id: la clave de la tarjeta es el href, que ya es único;
// - municipalitySlug: solo si no coincide con slugify(municipality);
// - coverAlt: solo cuando hay foto;
// - searchText de Pasos: sin repetir los nombres que ya viajan en imageNames y authorNames.

// Tarjetas que el directorio pinta al cargar y en cada «Mostrar más». Vive aquí
// (módulo normal) porque las páginas de servidor lo usan para el ItemList, y un
// export de un módulo 'use client' llega al servidor como referencia, no como número.
export const DIRECTORY_PAGE_SIZE = 48

function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Quita claves vacías: undefined, null, '' y listas vacías no se serializan.
function withoutEmpty(object) {
  return Object.fromEntries(Object.entries(object).filter(([, value]) => (
    value !== undefined && value !== null && value !== '' && !(Array.isArray(value) && !value.length)
  )))
}

function municipalitySlugIfNeeded(item) {
  return item.municipalitySlug && item.municipalitySlug !== slugify(item.municipality) ? item.municipalitySlug : undefined
}

export function compactImageDirectoryItem(item) {
  return withoutEmpty({
    name: item.name,
    href: item.href,
    type: item.type,
    date: item.date,
    brotherhoodName: item.brotherhoodName,
    municipality: item.municipality,
    municipalitySlug: municipalitySlugIfNeeded(item),
    place: item.place,
    authorNames: item.authorNames || [],
    coverPath: item.coverPath,
    coverAlt: item.coverPath ? item.coverAlt : undefined,
  })
}

export function compactStepDirectoryItem(item, { nameLimit = 2 } = {}) {
  const imageNames = item.imageNames || []
  const authorNames = item.authorNames || []
  const limit = nameLimit ?? Infinity
  return withoutEmpty({
    name: item.name,
    href: item.href,
    type: item.type,
    date: item.date,
    brotherhoodName: item.brotherhoodName,
    municipality: item.municipality,
    municipalitySlug: municipalitySlugIfNeeded(item),
    imageNames: imageNames.slice(0, limit),
    authorNames: authorNames.slice(0, limit),
    coverPath: item.coverPath,
    coverAlt: item.coverPath ? (item.coverAlt || [item.name, item.brotherhoodName].filter(Boolean).join(' · ')) : undefined,
    // Solo lo que no viaja ya en otros campos: estilo, materiales y los
    // nombres que no caben en la tarjeta siguen siendo buscables. El estado de
    // conservación es un código interno («preserved») y no se busca.
    searchText: [
      item.style,
      item.materials,
      ...imageNames.slice(limit),
      ...authorNames.slice(limit),
      ...(item.disciplines || []),
    ].filter(Boolean).join(' '),
  })
}

export function compactHeritageDirectoryItems(items = [], kind) {
  if (kind === 'image') return items.map(compactImageDirectoryItem)
  // Facet pages always showed the full name lists ("· +N" on the card); only
  // the /pasos hub trimmed them. Keep each page's visible text unchanged.
  if (kind === 'step') return items.map((item) => compactStepDirectoryItem(item, { nameLimit: null }))
  return items
}

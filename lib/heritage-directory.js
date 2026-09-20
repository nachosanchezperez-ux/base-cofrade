const MIN_LOCALITY_ITEMS = 3
const MIN_TYPE_ITEMS = 3

function normalize(value = '') {
  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const HERITAGE_TYPES = {
  imagenes: [
    { slug: 'dolorosas', label: 'Dolorosas', matches: (value) => /dolorosa|piedad/.test(value) && !/cristo/.test(value) },
    { slug: 'imagenes-de-gloria', label: 'Imágenes de gloria', matches: (value) => /gloria|virgen con nino|maria con nino|inmaculada|nino jesus|imagen mariana sedente|candelero con nino/.test(value) },
    { slug: 'crucificados', label: 'Crucificados', matches: (value) => /crucific/.test(value) },
    { slug: 'nazarenos', label: 'Nazarenos', matches: (value) => /nazareno/.test(value) },
    { slug: 'imagenes-cristiferas', label: 'Imágenes cristíferas', matches: (value) => /cristo|cristifer|yacente|cautivo|resucitado|descendimiento|varon de dolores|entrada en jerusalen/.test(value) },
    { slug: 'imagenes-secundarias', label: 'Imágenes secundarias', matches: (value) => /misterio|secundaria|figura|grupo escultorico|angel|alegoria|grupo alegorico/.test(value) },
    { slug: 'santos', label: 'Santos', matches: (value) => /^(santo|santa|san juan|apostol)/.test(value) },
  ],
  pasos: [
    { slug: 'pasos-de-palio', label: 'Pasos de palio', matches: (value) => /palio/.test(value) },
    { slug: 'pasos-de-misterio', label: 'Pasos de misterio', matches: (value) => /misterio|entrada en jerusalen/.test(value) },
    { slug: 'pasos-de-cristo', label: 'Pasos de Cristo', matches: (value) => /paso de cristo|^cristo$|nazareno|crucificado|piedad|stabat mater|resucitado/.test(value) },
    { slug: 'pasos-de-gloria', label: 'Pasos de gloria', matches: (value) => /gloria|paso de virgen|mariano/.test(value) },
    { slug: 'custodias-y-pasos-eucaristicos', label: 'Custodias y pasos eucarísticos', matches: (value) => /custodia|eucaristic/.test(value) },
    { slug: 'santos-entierros', label: 'Santos Entierros', matches: (value) => /urna|santo sepulcro|santo entierro/.test(value) },
    { slug: 'pasos-alegoricos', label: 'Pasos alegóricos', matches: (value) => /alegoric/.test(value) },
  ],
}

function compareLabels(first = '', second = '') {
  return String(first).localeCompare(String(second), 'es', { sensitivity: 'base' })
}

export function heritageDirectoryLocalityPath(section, slug) {
  if (!['imagenes', 'pasos'].includes(section) || !slug) return ''
  return `/${section}/localidad/${slug}`
}

export function heritageDirectoryTypePath(section, slug) {
  if (!['imagenes', 'pasos'].includes(section) || !slug) return ''
  return `/${section}/tipo/${slug}`
}

export function heritageTypeForValue(value, section) {
  const normalized = normalize(value)
  if (!normalized) return null
  return (HERITAGE_TYPES[section] || []).find((type) => type.matches(normalized)) || null
}

export function heritageDirectoryTypes(items = [], section, minimum = MIN_TYPE_ITEMS) {
  const counts = new Map()

  items.forEach((item) => {
    const type = heritageTypeForValue(item.type, section)
    if (type) counts.set(type.slug, (counts.get(type.slug) || 0) + 1)
  })

  return (HERITAGE_TYPES[section] || [])
    .map(({ slug, label }) => ({
      slug,
      label,
      count: counts.get(slug) || 0,
      href: heritageDirectoryTypePath(section, slug),
    }))
    .filter((item) => item.count >= minimum)
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

export function heritageItemsForType(items = [], section, slug) {
  const facet = heritageDirectoryTypes(items, section).find((item) => item.slug === slug)
  return facet
    ? items.filter((item) => heritageTypeForValue(item.type, section)?.slug === slug)
    : []
}

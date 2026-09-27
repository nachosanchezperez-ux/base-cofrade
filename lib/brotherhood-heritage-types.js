const MUSICAL_HERITAGE_TYPES = new Set([
  'musica de capilla',
  'copla',
  'marcha',
  'marcha procesional',
  'himno',
  'adaptacion',
  'plegaria',
  'alabado',
  'canto liturgico',
  'misa',
  'oracion musicada',
  'sonata da chiesa',
])

export function isMusicalHeritageType(value = '') {
  return MUSICAL_HERITAGE_TYPES.has(String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim())
}

export function isBrotherhoodEditorialHeritageType(value = '') {
  return !isMusicalHeritageType(value) && !String(value).toLowerCase().includes('cartel')
}

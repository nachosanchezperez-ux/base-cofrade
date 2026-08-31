const PREMIERE_TYPES = new Map([
  ['estreno absoluto', 'Estreno absoluto'],
  ['adaptacion', 'Adaptación'],
  ['estreno por la formacion', 'Estreno por la formación'],
  ['incorporacion al repertorio', 'Incorporación al repertorio'],
  ['recuperacion historica', 'Recuperación histórica'],
  ['estreno patrimonial', 'Estreno patrimonial'],
])

function normalizedType(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('es')
    .trim()
}

export function presentBandPremiere(description = '') {
  const text = String(description || '').trim()
  const prefix = text.match(/^Tipo de novedad:\s*([^.]*)\.\s*/i)
  if (!prefix) return { type: 'Novedad musical', description: text }

  const type = PREMIERE_TYPES.get(normalizedType(prefix[1]))
  if (!type) return { type: 'Novedad musical', description: text }

  return {
    type,
    description: text.slice(prefix[0].length).trim(),
  }
}

function normalize(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
    .trim()
}

function hasFormationLabel(name = '') {
  const value = normalize(name)
  return [
    'banda',
    'agrupacion musical',
    'capilla musical',
    'escolania',
    'coro',
  ].some((label) => value.includes(label))
}

export function bandSeoIdentity({ popularName = '', officialName = '', type = '' } = {}) {
  const name = String(popularName || officialName || '').trim()
  if (!name || hasFormationLabel(name)) return name

  const normalizedType = normalize(type)

  if (normalizedType.includes('agrupacion')) return `Agrupación Musical ${name}`
  if (normalizedType.includes('banda de musica') || normalizedType === 'bm') return `Banda de Música ${name}`
  if (normalizedType.includes('capilla')) return `Capilla Musical ${name}`
  if (normalizedType.includes('escolania')) return `Escolanía ${name}`
  if (normalizedType.includes('coro')) return `Coro ${name}`
  if (normalizedType.includes('corneta') || normalizedType.includes('tambor')) return `Banda ${name}`

  return `Banda ${name}`
}

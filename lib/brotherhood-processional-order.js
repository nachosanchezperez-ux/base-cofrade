function normalized(value = '') {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function processionalRank(item = {}) {
  const value = normalized([
    item.tipo,
    item.type,
    item.nombre,
    item.name,
  ].filter(Boolean).join(' '))

  if (value.includes('misterio')) return 10
  if (/\b(jesus|senor|cristo|nazareno|crucificado|cautivo)\b/.test(value)) return 20
  if (/\b(virgen|palio|dolorosa|madre|maria)\b/.test(value)) return 30
  return 40
}

export function orderProcessionalItems(items = []) {
  return items
    .map((item, index) => ({ item, index }))
    .sort((first, second) => (
      processionalRank(first.item) - processionalRank(second.item)
      || first.index - second.index
    ))
    .map(({ item }) => item)
}

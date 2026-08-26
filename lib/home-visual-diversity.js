const DIRECTORY_ORDER = ['brotherhood', 'image', 'step', 'band']

function stableIndex(key, length) {
  if (!length) return 0
  const hash = [...String(key || '')].reduce((total, char) => ((total * 31) + char.charCodeAt(0)) >>> 0, 7)
  return hash % length
}

function rotate(items = [], start = 0) {
  if (!items.length) return []
  const index = ((start % items.length) + items.length) % items.length
  return [...items.slice(index), ...items.slice(0, index)]
}

export function selectDiverseHomeSpotlights(groups = {}, familyByEntityId = new Map(), dateKey = '') {
  const selected = {}
  const usedFamilies = new Set()

  for (const type of DIRECTORY_ORDER) {
    const items = groups[type] || []
    if (!items.length) continue

    const ordered = rotate(items, stableIndex(`${dateKey}:${type}:home-visual`, items.length))
    const candidate = ordered.find((item) => {
      const family = familyByEntityId.get(item.id) || `entity:${item.id}`
      return !usedFamilies.has(family)
    }) || ordered[0]

    selected[type] = candidate
    usedFamilies.add(familyByEntityId.get(candidate.id) || `entity:${candidate.id}`)
  }

  return selected
}

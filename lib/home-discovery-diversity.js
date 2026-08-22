export function selectDiverseHomeThreads(candidates = [], familyByThreadId = new Map(), limit = 3) {
  const target = Math.max(0, Number(limit) || 0)
  if (!target) return []

  const primary = []
  const deferred = []
  const seenFamilies = new Set()

  for (const thread of candidates || []) {
    if (!thread?.id) continue
    const family = familyByThreadId.get(thread.id) || `thread:${thread.id}`
    if (seenFamilies.has(family)) {
      deferred.push(thread)
      continue
    }
    seenFamilies.add(family)
    primary.push(thread)
    if (primary.length >= target) break
  }

  if (primary.length >= target) return primary.slice(0, target)

  const selectedIds = new Set(primary.map((thread) => thread.id))
  for (const thread of deferred) {
    if (!thread?.id || selectedIds.has(thread.id)) continue
    primary.push(thread)
    selectedIds.add(thread.id)
    if (primary.length >= target) break
  }

  if (primary.length < target) {
    for (const thread of candidates || []) {
      if (!thread?.id || selectedIds.has(thread.id)) continue
      primary.push(thread)
      selectedIds.add(thread.id)
      if (primary.length >= target) break
    }
  }

  return primary.slice(0, target)
}

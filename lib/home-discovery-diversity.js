function threadKind(thread) {
  return String(thread?.activityKind || '').trim() || `kind:${thread?.id || ''}`
}

export function selectDiverseHomeThreads(candidates = [], familyByThreadId = new Map(), limit = 3) {
  const target = Math.max(0, Number(limit) || 0)
  if (!target) return []

  const selected = []
  const selectedIds = new Set()
  const seenFamilies = new Set()
  const seenKinds = new Set()

  const pick = (predicate) => {
    for (const thread of candidates || []) {
      if (selected.length >= target) break
      if (!thread?.id || selectedIds.has(thread.id)) continue

      const family = familyByThreadId.get(thread.id) || `thread:${thread.id}`
      const kind = threadKind(thread)
      if (!predicate({ thread, family, kind })) continue

      selected.push(thread)
      selectedIds.add(thread.id)
      seenFamilies.add(family)
      seenKinds.add(kind)
    }
  }

  // Primera pasada: maximiza a la vez variedad de universo y de tipo de relación.
  pick(({ family, kind }) => !seenFamilies.has(family) && !seenKinds.has(kind))

  // Segunda: prioriza universos nuevos aunque el tipo de relación se repita.
  if (selected.length < target) {
    pick(({ family }) => !seenFamilies.has(family))
  }

  // Tercera: si faltan huecos, intenta aportar un tipo de relación distinto.
  if (selected.length < target) {
    pick(({ kind }) => !seenKinds.has(kind))
  }

  // Último recurso: respeta el orden de actualidad original.
  if (selected.length < target) {
    pick(() => true)
  }

  return selected.slice(0, target)
}

function threadKind(thread) {
  return String(thread?.activityKind || '').trim() || `kind:${thread?.id || ''}`
}

export function selectDiverseHomeThreads(candidates = [], familyByThreadId = new Map(), limit = 3) {
  const target = Math.max(0, Number(limit) || 0)
  if (!target) return []

  const ordered = Array.isArray(candidates) ? candidates : []
  const recentPoolSize = Math.max(target, target * 2)
  const recentPool = ordered.slice(0, recentPoolSize)
  const selected = []
  const selectedIds = new Set()
  const seenFamilies = new Set()
  const seenKinds = new Set()

  const pickFrom = (pool, predicate) => {
    for (const thread of pool) {
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

  const diversify = (pool) => {
    // Primero intenta variedad total, pero sin abandonar la ventana más reciente.
    pickFrom(pool, ({ family, kind }) => !seenFamilies.has(family) && !seenKinds.has(kind))

    // Si la actividad reciente comparte tipo de relación, prioriza universos nuevos.
    if (selected.length < target) {
      pickFrom(pool, ({ family }) => !seenFamilies.has(family))
    }

    // Después aporta un tipo distinto si todavía quedan huecos.
    if (selected.length < target) {
      pickFrom(pool, ({ kind }) => !seenKinds.has(kind))
    }

    if (selected.length < target) {
      pickFrom(pool, () => true)
    }
  }

  // La recencia manda: diversificamos primero dentro de la cabecera cronológica.
  diversify(recentPool)

  // Solo si no hay suficiente material reciente ampliamos al histórico.
  if (selected.length < target) {
    diversify(ordered)
  }

  return selected.slice(0, target)
}

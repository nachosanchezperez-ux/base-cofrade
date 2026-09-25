export function selectCandidatesForEnrichment(
  candidates = [],
  {
    limit = 8,
    scoreById = new Map(),
    alwaysIncludeTypes = ['brotherhood'],
  } = {}
) {
  const rows = Array.isArray(candidates) ? candidates : []
  if (!rows.length) return []

  const keepTypes = new Set(alwaysIncludeTypes || [])
  const boundedLimit = Math.max(1, Number(limit) || 8)
  const selectable = rows.filter((entity) => !keepTypes.has(entity?.entity_type))

  if (selectable.length <= boundedLimit) return rows

  const ranked = selectable
    .map((entity, index) => ({
      entity,
      index,
      score: Number(scoreById.get(entity?.id)) || 0,
    }))
    .sort((a, b) => b.score - a.score || a.index - b.index)

  const cutoff = ranked[Math.min(boundedLimit - 1, ranked.length - 1)]?.score ?? -Infinity
  const selectedIds = new Set(
    ranked
      .filter((item) => item.score >= cutoff)
      .map((item) => item.entity?.id)
      .filter(Boolean)
  )

  return rows.filter((entity) => (
    keepTypes.has(entity?.entity_type)
    || selectedIds.has(entity?.id)
  ))
}

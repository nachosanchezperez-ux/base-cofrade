import 'server-only'

import { normalizeIdentity } from '@/lib/panel/document-import'

export function guardIntraImportDuplicates(analysis) {
  const entities = Array.isArray(analysis?.entities) ? analysis.entities : []
  if (!entities.length) return analysis

  const counts = new Map()
  for (const candidate of entities) {
    const identity = normalizeIdentity(candidate?.name)
    if (!identity) continue
    const key = `${candidate.entity_type}:${identity}`
    counts.set(key, (counts.get(key) || 0) + 1)
  }

  const conflicts = new Set(
    [...counts.entries()]
      .filter(([, count]) => count > 1)
      .map(([key]) => key)
  )
  if (!conflicts.size) return analysis

  const conflictNames = []
  const guardedEntities = entities.map((candidate) => {
    const key = `${candidate.entity_type}:${normalizeIdentity(candidate.name)}`
    if (!conflicts.has(key)) return candidate
    conflictNames.push(candidate.name)
    return {
      ...candidate,
      intra_import_conflict: true,
      match_conflict: true,
      can_create_draft: false,
    }
  })

  const uniqueNames = [...new Set(conflictNames)]
  const message = uniqueNames.length === 1
    ? `La fuente ha producido más de un candidato para «${uniqueNames[0]}». Hilo bloquea el alta automática hasta resolver si es una repetición o una homonimia real.`
    : `La fuente ha producido candidatos repetidos para ${uniqueNames.length} nombres. Hilo bloquea su alta automática hasta resolver si son repeticiones o homonimias reales.`

  return {
    ...analysis,
    entities: guardedEntities,
    warnings: [
      ...(Array.isArray(analysis.warnings) ? analysis.warnings : []),
      {
        type: 'conflict',
        message,
        evidence: null,
      },
    ],
  }
}

import 'server-only'

import { askHiloCofradeV9 } from '@/lib/supabase/tira-del-hilo-v9'

function mergeExactReferences(response = {}) {
  const exactById = new Map()

  for (const item of response.items || []) {
    for (const reference of item.relationReferences || []) {
      const key = reference.id || `${reference.name}-${reference.url || ''}`
      const current = exactById.get(key) || {
        ...reference,
        scopes: [],
        exact: true,
      }
      const scope = `Exacta · ${item.label}`
      if (!current.scopes.includes(scope)) current.scopes.push(scope)
      exactById.set(key, current)
    }
  }

  const exact = [...exactById.values()]
  if (!exact.length) return response

  const existing = response.references || []
  const exactKeys = new Set(exact.map((reference) => reference.id || `${reference.name}-${reference.url || ''}`))
  const remaining = existing.filter((reference) => {
    const key = reference.id || `${reference.name}-${reference.url || ''}`
    return !exactKeys.has(key)
  })

  return {
    ...response,
    references: [...exact, ...remaining].slice(0, 4),
    referencesNote: 'Las referencias marcadas como “Exacta” están enlazadas directamente al registro de la relación mostrada. Las restantes son fuentes vinculadas a las entidades implicadas.',
  }
}

export async function askHiloCofradeV10(question, context = null) {
  const response = await askHiloCofradeV9(question, context)
  if (response?.kind !== 'answer') return response
  return mergeExactReferences(response)
}

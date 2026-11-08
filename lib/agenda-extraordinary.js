// Acto extraordinario (#agenda-prioridad, 08/11/2026). Marca editorial del
// Panel, en la salida (outings) o en la ocurrencia concreta del culto
// (cult_occurrences), que pone el acto por delante dentro de su día en la
// Agenda, la portada y la ficha. Módulo puro.

export const EXTRAORDINARY_KINDS = Object.freeze({
  coronation: 'Coronación',
  extraordinary_outing: 'Salida extraordinaria',
  anniversary: 'Aniversario',
})

export function normalizeExtraordinaryKind(value) {
  const kind = String(value || '').trim()
  return Object.hasOwn(EXTRAORDINARY_KINDS, kind) ? kind : ''
}

export function extraordinaryKindLabel(value) {
  return EXTRAORDINARY_KINDS[normalizeExtraordinaryKind(value)] || ''
}

// Grupos de la Agenda: [rosarios, extraordinarias, glorias, salidas generales,
// cultos, conciertos]. Los cuatro primeros son salidas (id = outings.id); los
// cultos son ocurrencias (id = cult_occurrences.id).
export function applyExtraordinaryMarks(groups = [], { outings = new Map(), occurrences = new Map() } = {}) {
  if (!outings.size && !occurrences.size) return groups
  return groups.map((group, index) => {
    const marks = index < 4 ? outings : index === 4 ? occurrences : null
    if (!marks?.size || !Array.isArray(group)) return group
    return group.map((item) => {
      const kind = normalizeExtraordinaryKind(marks.get(item?.id))
      return kind ? { ...item, extraordinaryKind: kind } : item
    })
  })
}

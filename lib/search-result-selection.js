// Selección final de resultados del buscador universal.
//
// Módulo puro para poder probarlo con `node --test`. Recibe los resultados ya
// puntuados (con `score`) y decide cuáles se muestran:
//   1. Ordena por puntuación.
//   2. Agrupa los que llevan a la misma página («Cachorro Eterno» como marcha y
//      como dos estrenos → una sola tarjeta), prefiriendo la ficha de la entidad.
//   3. Si hay fichas navegables, deja como mucho un resultado sin página
//      (autores o acontecimientos que solo abren una pregunta).

const MAX_UNLINKED_WITH_LINKED = 1

function byScore(a, b) {
  return (b.score || 0) - (a.score || 0) || String(a.title || '').localeCompare(String(b.title || ''), 'es')
}

export function selectHiloSearchResults(items = [], limit = 8) {
  const sorted = [...(Array.isArray(items) ? items : [])]
    .filter(Boolean)
    .sort(byScore)

  // Una tarjeta por destino. Se conserva la posición del mejor resultado y, si
  // alguno de los duplicados es la ficha de la entidad, se muestra esa ficha.
  const kept = []
  const indexByHref = new Map()
  for (const item of sorted) {
    if (!item.href) {
      kept.push(item)
      continue
    }
    const index = indexByHref.get(item.href)
    if (index === undefined) {
      indexByHref.set(item.href, kept.length)
      kept.push(item)
    } else if (!kept[index].entityId && item.entityId) {
      kept[index] = { ...item, score: kept[index].score }
    }
  }

  const hasLinked = kept.some((item) => item.href)
  let unlinked = 0
  const selected = kept.filter((item) => {
    if (item.href || !hasLinked) return true
    unlinked += 1
    return unlinked <= MAX_UNLINKED_WITH_LINKED
  })

  return selected
    .slice(0, Math.max(1, Number(limit) || 8))
    .map(({ score, ...item }) => item)
}

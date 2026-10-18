// Lecturas completas para el Panel.
//
// Supabase (PostgREST) devuelve como máximo 1.000 filas por petición y corta el resto sin
// avisar. Además, un filtro «in» con cientos de identificadores supera el tamaño máximo de
// la URL y la petición falla con «Bad Request». Estas dos utilidades evitan ambos límites
// y conservan la forma { data, error } de Supabase, para que cada pantalla siga tratando
// los errores como hasta ahora.
//
// Módulo puro (sin dependencias de servidor) para poder probarlo con node --test.

export const PANEL_PAGE_SIZE = 1000
export const PANEL_ID_BATCH_SIZE = 150

// Lee todas las filas de una consulta, página a página.
// buildQuery() debe crear la consulta completa (filtros y orden) en cada llamada.
// Se añade un desempate estable (por defecto, 'id') para que ninguna fila se repita
// ni se pierda entre páginas cuando varias comparten el mismo nombre.
export async function selectAllRows(buildQuery, { tieBreaker = 'id', pageSize = PANEL_PAGE_SIZE } = {}) {
  const data = []
  for (let from = 0; ; from += pageSize) {
    let query = buildQuery()
    if (tieBreaker) query = query.order(tieBreaker)
    const result = await query.range(from, from + pageSize - 1)
    if (result.error) return { data: null, error: result.error }
    const page = result.data || []
    data.push(...page)
    if (page.length < pageSize) return { data, error: null }
  }
}

// Ejecuta un filtro «in» por lotes y une los resultados.
// buildQuery(batch) recibe cada lote de identificadores.
export async function selectRowsByIds(ids, buildQuery, { batchSize = PANEL_ID_BATCH_SIZE } = {}) {
  const unique = [...new Set((ids || []).filter(Boolean))]
  const batches = []
  for (let offset = 0; offset < unique.length; offset += batchSize) batches.push(unique.slice(offset, offset + batchSize))
  const results = await Promise.all(batches.map((batch) => buildQuery(batch)))
  const failed = results.find((result) => result.error)
  if (failed) return { data: null, error: failed.error }
  return { data: results.flatMap((result) => result.data || []), error: null }
}

// Orden alfabético en español, para listas que se leen por lotes.
export function sortByName(rows = [], key = 'name') {
  return [...rows].sort((a, b) => String(a?.[key] || '').localeCompare(String(b?.[key] || ''), 'es', { sensitivity: 'base' }))
}

// «En la calle» (24/11/2026): lo que la Hermandad pone en la calle, visible y
// visual. Política pura: qué estrenos y restauraciones son «novedad» (de este
// año o del anterior) y cuáles quedan en el archivo de Patrimonio, sin repetir.

export const STREET_UPDATES_MAX = 6

function updateYear(item) {
  const match = String(item?.ano || item?.fechaIso || '').match(/(19|20)\d{2}/)
  return match ? Number(match[0]) : 0
}

export function splitStreetUpdates(updates = [], currentYear = new Date().getUTCFullYear()) {
  const list = Array.isArray(updates) ? updates : []
  const recent = list
    .filter((item) => item?.titulo && updateYear(item) >= currentYear - 1)
    .sort((a, b) => updateYear(b) - updateYear(a)
      // A igualdad de año, primero los estrenos y después las restauraciones.
      || Number(a.tipo === 'Restauración') - Number(b.tipo === 'Restauración'))
  const street = recent.slice(0, STREET_UPDATES_MAX)
  const shown = new Set(street.map((item) => item.id))
  return { street, archive: list.filter((item) => !shown.has(item.id)) }
}

export function streetBadge(item) {
  const year = updateYear(item)
  const kind = item?.tipo === 'Restauración' ? 'Restaurado' : 'Estreno'
  return year ? `${kind} ${year}` : kind
}

// Etiqueta del capítulo: Cortejo (Penitencia) y Procesión (Gloria) se presentan
// como «En la calle».
export const STREET_CHAPTER_LABEL = 'En la calle'

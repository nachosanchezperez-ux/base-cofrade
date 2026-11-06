// Salida destacada del capítulo Procesión (ficha por capítulos de Gloria).
// Elige la salida concreta más útil para quien abre la ficha: la próxima por
// celebrarse o, si no hay ninguna anunciada, la última celebrada. Las salidas
// recurrentes («Anual · Noviembre») no se destacan: no tienen fecha ni horario.

export function featuredBrotherhoodOuting(salidas = [], today = '') {
  const concrete = salidas
    .filter((salida) => salida?.id && /^\d{4}-\d{2}-\d{2}$/.test(String(salida.fecha || '')) && salida.estado !== 'recurring')
    // Solo la procesión de Gloria: es la que tiene horario, bandas y recorrido.
    .filter((salida) => !salida.tipo || /gloria/i.test(String(salida.tipo)))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
  if (!concrete.length) return null
  const upcoming = today ? concrete.find((salida) => salida.fecha >= today) : null
  return upcoming || concrete[concrete.length - 1]
}

// El resto de salidas, sin repetir la destacada ni la serie anual a la que
// pertenece (que solo dice «Noviembre» y ya queda cubierta por la tarjeta).
export function otherBrotherhoodOutings(salidas = [], featured = null) {
  if (!featured) return salidas
  return salidas.filter((salida) => salida.id !== featured.id && !(featured.serieId && salida.id === featured.serieId))
}

function cleanStop(value = '') {
  return String(value || '').replace(/\s+/g, ' ').replace(/[.;,\s]+$/, '').trim()
}

function sameStop(a = '', b = '') {
  const norm = (value) => cleanStop(value).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  return Boolean(a && b) && norm(a) === norm(b)
}

// Recorrido «A → B → C» en calles. Si el primer o el último tramo es el templo
// de salida o de entrada, se quita de la lista: la tarjeta ya los pinta como
// extremos destacados.
export function outingRouteStops(routeSummary = '', { origin = '', destination = '' } = {}) {
  const stops = String(routeSummary || '').split(/\s*(?:→|->)\s*/).map(cleanStop).filter(Boolean)
  if (stops.length < 2) return { origin: cleanStop(origin), destination: cleanStop(destination), streets: [] }
  const start = cleanStop(origin) || stops[0]
  const end = cleanStop(destination) || stops[stops.length - 1]
  let streets = stops
  if (sameStop(streets[0], start)) streets = streets.slice(1)
  if (streets.length && sameStop(streets[streets.length - 1], end)) streets = streets.slice(0, -1)
  return { origin: start, destination: end, streets }
}

// Calles visibles y plegadas: con recorridos largos se ven las primeras y las
// últimas, y el tramo central queda en un desplegable que sigue la misma línea.
export function splitRouteStreets(streets = [], { head = 4, tail = 3 } = {}) {
  if (streets.length <= head + tail + 2) return { head: streets, hidden: [], tail: [] }
  return {
    head: streets.slice(0, head),
    hidden: streets.slice(head, streets.length - tail),
    tail: streets.slice(streets.length - tail),
  }
}

const WEEKDAYS = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

// Fecha en piezas para el bloque grande de la tarjeta (sin depender de la zona
// horaria del servidor: la fecha es un día civil).
export function outingDateParts(date = '') {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(date || ''))
  if (!match) return null
  const [, year, month, day] = match.map(Number)
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay()
  return { weekday: WEEKDAYS[weekday], day: String(day), month: MONTHS[month - 1], year: String(year) }
}

// Título de la tarjeta sin lo que ya dice la ficha: el año y el nombre de la
// Hermandad o de su titular. Si no queda nada propio, el tipo de salida.
export function outingCardTitle(title = '', { names = [], fallback = 'Procesión de Gloria' } = {}) {
  let text = String(title || '').replace(/\s*[·,-]?\s*(?:18|19|20)\d{2}\s*$/, '').trim()
  const generic = /^(salida procesional|procesi[oó]n(?: de gloria)?|salida)(?: de)?$/i
  // Primero el nombre más largo: «Nuestra Señora Reina…» antes que «Reina…».
  for (const name of names.filter(Boolean).sort((a, b) => String(b).length - String(a).length)) {
    const escaped = String(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    text = text.replace(new RegExp(`\\s*(?:de\\s+)?${escaped}\\s*$`, 'i'), '').trim()
  }
  return !text || generic.test(text) ? fallback : text
}

function stopKey(value = '') {
  return cleanStop(value).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

// Posición de una etiqueta de tramo («Ayuntamiento de Sevilla · Plaza de San
// Francisco») en la lista de paradas: coincide si la etiqueta contiene la
// parada o al revés. Devuelve -1 si no se reconoce. `from` evita volver atrás
// en recorridos de ida y vuelta que repiten calles.
function stopIndex(stops, label, from = 0) {
  const key = stopKey(label)
  if (!key) return -1
  for (let index = from; index < stops.length; index += 1) {
    const stop = stopKey(stops[index])
    if (stop && (key === stop || key.includes(stop) || stop.includes(key))) return index
  }
  return -1
}

// Tramos de las bandas que no hacen todo el recorrido, sobre la lista completa
// de paradas [salida, ...calles, entrada]. Solo se devuelven los tramos cuyos
// dos extremos se reconocen en el recorrido: si no, no se dibuja nada.
export function bandSegments(music = [], route = { origin: '', streets: [], destination: '' }) {
  const stops = [route.origin, ...(route.streets || []), route.destination]
  return music
    .filter((band) => band.segmentStart || band.segmentEnd)
    .map((band) => {
      const start = band.segmentStart ? stopIndex(stops, band.segmentStart) : 0
      const end = start >= 0 && band.segmentEnd ? stopIndex(stops, band.segmentEnd, start) : stops.length - 1
      if (start < 0 || end < 0 || end < start) return null
      return { id: band.id || band.name, name: band.name, href: band.href || '', start, end, endLabel: cleanStop(stops[end]) }
    })
    .filter(Boolean)
}

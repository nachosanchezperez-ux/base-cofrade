// Salida destacada del capítulo Procesión (ficha por capítulos de Gloria).
// Elige la salida concreta más útil para quien abre la ficha: la próxima por
// celebrarse o, si no hay ninguna anunciada, la última celebrada. Las salidas
// recurrentes («Anual · Noviembre») no se destacan: no tienen fecha ni horario.

export function featuredBrotherhoodOuting(salidas = [], today = '') {
  const concrete = salidas
    .filter((salida) => salida?.id && /^\d{4}-\d{2}-\d{2}$/.test(String(salida.fecha || '')) && salida.estado !== 'recurring')
    // La procesión de Gloria o un rosario (vespertino, de la aurora): son las
    // salidas con horario, acompañamiento y recorrido.
    .filter((salida) => !salida.tipo || /gloria|rosario/i.test(String(salida.tipo)))
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

// Mismo templo aunque uno lleve la localidad («…de Padua, Sevilla») o un
// añadido tras «·» («… · Entrada»).
function sameStop(a = '', b = '') {
  const norm = (value) => cleanStop(String(value || '').split(/\s+·\s+/)[0].split(',')[0])
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  return Boolean(a && b) && norm(a) === norm(b)
}

export function isSameStop(a = '', b = '') {
  return sameStop(a, b)
}

// Hitos del recorrido (una misa, una parada, el regreso): puntos con hora o
// nota que no son los extremos. Se alinean con las calles por posición y, si no
// cuadran, por nombre. Devuelve un mapa índice de calle → { time, note }.
export function routeMilestones(points = [], streets = []) {
  const ordered = [...(points || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const middle = ordered.slice(1, -1)
  const aligned = middle.length === streets.length && middle.every((point, index) => sameStop(point.label, streets[index]))
  const result = new Map()
  middle.forEach((point, position) => {
    const time = String(point.time || '').slice(0, 5)
    const note = String(point.notes || '').trim()
    if (!time && !note) return
    const index = aligned ? position : streets.findIndex((name) => sameStop(name, point.label))
    if (index < 0 || result.has(index)) return
    result.set(index, { time, note })
  })
  return result
}

// Recorrido «A → B → C» en calles. Si el primer o el último tramo es el templo
// de salida o de entrada, se quita de la lista: la tarjeta ya los pinta como
// extremos destacados.
export function outingRouteStops(routeSummary = '', { origin = '', destination = '' } = {}) {
  const stops = String(routeSummary || '').split(/\s*(?:→|->)\s*/).map(cleanStop).filter(Boolean)
  if (stops.length < 2) return { origin: cleanStop(origin), destination: cleanStop(destination), streets: [] }
  // Si el recorrido nombra el mismo templo, se usa su forma (sin «, Sevilla»).
  const start = (cleanStop(origin) && sameStop(stops[0], origin) ? stops[0] : cleanStop(origin)) || stops[0]
  const end = (cleanStop(destination) && sameStop(stops[stops.length - 1], destination) ? stops[stops.length - 1] : cleanStop(destination)) || stops[stops.length - 1]
  // Templo duplicado al principio o al final («…, Sevilla» frente a «…»).
  if (stops.length > 2 && sameStop(stops[0], start) && sameStop(stops[1], start)) stops.shift()
  if (stops.length > 2 && sameStop(stops[stops.length - 1], end) && sameStop(stops[stops.length - 2], end)) stops.pop()
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
  // «Procesión de la» tras quitar el nombre: fuera el artículo colgante.
  text = text.replace(/\s+(?:de(?:\s+(?:la|los|las))?|del)$/i, '').trim()
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

// «Su semana»: la salida cae en los próximos días (hoy, mañana o esta semana).
// Devuelve el texto de la cabecera («Este domingo, 8 · 17:00») o '' si no toca.
export function outingWeekLabel(outing) {
  if (!outing?.isUpcoming || outing.isCancelled) return ''
  const label = String(outing.urgencyLabel || '').trim()
  if (!/^(HOY|MAÑANA|ESTE\s)/.test(label)) return ''
  const parts = outingDateParts(outing.date)
  const when = `${label.charAt(0)}${label.slice(1).toLocaleLowerCase('es')}`
  return [parts ? `${when}, ${parts.day}` : when, outing.departureTime || ''].filter(Boolean).join(' · ')
}

// Resumen del acceso a Procesión: la próxima salida con fecha y hora
// («Dom 8 nov · 17:00»); sin salida próxima, ''.
export function outingTileSummary(outing) {
  if (!outing?.isUpcoming || outing.isCancelled) return ''
  const parts = outingDateParts(outing.date)
  if (!parts) return ''
  const day = `${parts.weekday} ${parts.day} ${parts.month}`
  const pretty = day.charAt(0).toLocaleUpperCase('es') + day.slice(1)
  return [pretty, outing.departureTime || ''].filter(Boolean).join(' · ')
}

// «la Parroquia de San Lorenzo», «el Convento de Santa Ana»: artículo para
// nombrar un lugar en una frase («En …», «Hacia …»). Las calles van sin él.
export function placeWithArticle(name = '') {
  const text = String(name || '').trim()
  if (/^(real\s+)?(parroquia|iglesia|capilla|bas[ií]lica|catedral|plaza|ermita|casa)\b/i.test(text)) return `la ${text}`
  if (/^(convento|templo|monasterio|santuario|hospital|colegio|ayuntamiento|palacio)\b/i.test(text)) return `el ${text}`
  return text
}

// Horario por puntos para el «dónde está ahora»: la salida, los puntos del
// recorrido con hora y la entrada. Un punto con nota (misa, visita) es parada.
export function outingSchedule(outing = {}) {
  const points = [...(outing.routePoints || [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  const middle = points.slice(1, -1)
    .filter((point) => point.time)
    .map((point) => ({ time: point.time, label: placeWithArticle(String(point.label || '').split(/\s+·\s+/)[0]), stop: Boolean(String(point.notes || '').trim()) }))
  if (!middle.length || !outing.departureTime || !outing.returnTime) return []
  return [
    { time: outing.departureTime, label: 'la salida', stop: false },
    ...middle,
    { time: outing.returnTime, label: 'la entrada', stop: false },
  ]
}

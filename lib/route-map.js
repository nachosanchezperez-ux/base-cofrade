// Mapa del recorrido sin dependencias: proyección Web Mercator a mano y
// teselas de OpenStreetMap como imágenes dentro de un SVG. Se calcula en el
// servidor; el navegador solo pinta un SVG escalable (sin JavaScript).

const TILE = 256

function project(lat, lng, zoom) {
  const scale = TILE * 2 ** zoom
  const x = ((lng + 180) / 360) * scale
  const sin = Math.sin((lat * Math.PI) / 180)
  const y = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale
  return { x, y }
}

export function validRoutePoints(points = []) {
  return points.filter((point) => Number.isFinite(Number(point?.lat)) && Number.isFinite(Number(point?.lng)))
    .map((point) => ({ ...point, lat: Number(point.lat), lng: Number(point.lng) }))
}

// Encuadre del recorrido en un lienzo de `width` × `height` píxeles, con margen.
// Devuelve las teselas necesarias y los puntos ya en coordenadas del lienzo.
// Sin al menos `minPoints` puntos geolocalizados no hay mapa (null).
export function routeMapLayout(points = [], { width = 640, height = 400, padding = 36, maxZoom = 18, minZoom = 12, minPoints = 3 } = {}) {
  const valid = validRoutePoints(points)
  if (valid.length < minPoints) return null

  let zoom = maxZoom
  let projected = []
  for (; zoom >= minZoom; zoom -= 1) {
    projected = valid.map((point) => ({ ...point, ...project(point.lat, point.lng, zoom) }))
    const xs = projected.map((point) => point.x)
    const ys = projected.map((point) => point.y)
    if (Math.max(...xs) - Math.min(...xs) <= width - padding * 2 && Math.max(...ys) - Math.min(...ys) <= height - padding * 2) break
  }
  if (zoom < minZoom) return null

  const xs = projected.map((point) => point.x)
  const ys = projected.map((point) => point.y)
  const centerX = (Math.min(...xs) + Math.max(...xs)) / 2
  const centerY = (Math.min(...ys) + Math.max(...ys)) / 2
  const left = centerX - width / 2
  const top = centerY - height / 2

  const tiles = []
  const max = 2 ** zoom
  for (let tx = Math.floor(left / TILE); tx <= Math.floor((left + width) / TILE); tx += 1) {
    for (let ty = Math.floor(top / TILE); ty <= Math.floor((top + height) / TILE); ty += 1) {
      if (ty < 0 || ty >= max) continue
      tiles.push({
        key: `${zoom}-${tx}-${ty}`,
        href: `https://tile.openstreetmap.org/${zoom}/${((tx % max) + max) % max}/${ty}.png`,
        x: Math.round(tx * TILE - left),
        y: Math.round(ty * TILE - top),
      })
    }
  }

  return {
    width,
    height,
    zoom,
    tiles,
    points: projected.map((point) => ({ ...point, x: +(point.x - left).toFixed(1), y: +(point.y - top).toFixed(1) })),
  }
}

export function svgPath(points = []) {
  return points.map((point, index) => `${index ? 'L' : 'M'}${point.x} ${point.y}`).join(' ')
}

// Recorrido escalado para llenar un lienzo sin teselas (imágenes para redes):
// misma proyección, escala libre y centrado, manteniendo la proporción.
export function fitRoutePoints(points = [], { width = 900, height = 620, padding = 40, minPoints = 3 } = {}) {
  const valid = validRoutePoints(points)
  if (valid.length < minPoints) return null
  const projected = valid.map((point) => ({ ...point, ...project(point.lat, point.lng, 20) }))
  const xs = projected.map((point) => point.x)
  const ys = projected.map((point) => point.y)
  const spanX = Math.max(...xs) - Math.min(...xs) || 1
  const spanY = Math.max(...ys) - Math.min(...ys) || 1
  const scale = Math.min((width - padding * 2) / spanX, (height - padding * 2) / spanY)
  const offsetX = (width - spanX * scale) / 2
  const offsetY = (height - spanY * scale) / 2
  return {
    width,
    height,
    points: projected.map((point) => ({
      ...point,
      x: +((point.x - Math.min(...xs)) * scale + offsetX).toFixed(1),
      y: +((point.y - Math.min(...ys)) * scale + offsetY).toFixed(1),
    })),
  }
}

// Rótulos de calle para el mapa ampliado: cada tramo entre dos esquinas
// consecutivas es la calle del punto de llegada. Se rotula una sola vez cada
// nombre, en el centro de su primer tramo; los templos no se rotulan aquí.
export function streetLabels(points = [], { minLength = 40 } = {}) {
  const seen = new Set()
  const labels = []
  for (let index = 1; index < points.length; index += 1) {
    const from = points[index - 1]
    const to = points[index]
    const name = String(to?.label || '').trim()
    if (!name || to.type === 'place' && /parroquia|iglesia|capilla|bas[ií]lica|convento/i.test(name)) continue
    if (seen.has(name)) continue
    const length = Math.hypot(to.x - from.x, to.y - from.y)
    if (length < minLength) continue
    seen.add(name)
    let angle = (Math.atan2(to.y - from.y, to.x - from.x) * 180) / Math.PI
    if (angle > 90) angle -= 180
    if (angle < -90) angle += 180
    labels.push({ name, x: +((from.x + to.x) / 2).toFixed(1), y: +((from.y + to.y) / 2).toFixed(1), angle: +angle.toFixed(1) })
  }
  return labels
}

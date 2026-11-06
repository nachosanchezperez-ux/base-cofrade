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

import test from 'node:test'
import assert from 'node:assert/strict'
import { routeMapLayout, svgPath, validRoutePoints } from '../lib/route-map.js'

// Puntos ficticios en el centro de una ciudad (solo para probar la geometría).
const points = [
  { lat: 37.3900, lng: -5.9970 },
  { lat: 37.3880, lng: -5.9950 },
  { lat: 37.3870, lng: -5.9980 },
  { lat: 37.3900, lng: -5.9970 },
]

test('sin coordenadas suficientes no hay mapa', () => {
  assert.equal(routeMapLayout([]), null)
  assert.equal(routeMapLayout([{ lat: null, lng: null }, { lat: 37.39, lng: -5.99 }]), null)
  assert.equal(validRoutePoints([{ lat: '37.1', lng: '-5.9' }, { lat: '', lng: undefined }]).length, 1)
  // Sin coordenadas (null) no hay mapa: no se pinta el punto 0,0.
  assert.equal(validRoutePoints([{ lat: null, lng: null }, { lat: 0, lng: 0 }]).length, 1)
  assert.equal(routeMapLayout([{ lat: null, lng: null }, { lat: null, lng: null }, { lat: null, lng: null }]), null)
})

test('el recorrido cabe en el lienzo con su margen y se cubre de teselas', () => {
  const layout = routeMapLayout(points, { width: 640, height: 400, padding: 36 })
  assert.ok(layout.zoom >= 12 && layout.zoom <= 18)
  for (const point of layout.points) {
    assert.ok(point.x >= 36 - 0.5 && point.x <= 640 - 36 + 0.5, `x ${point.x}`)
    assert.ok(point.y >= 36 - 0.5 && point.y <= 400 - 36 + 0.5, `y ${point.y}`)
  }
  assert.ok(layout.tiles.length >= 4)
  assert.match(layout.tiles[0].href, /^https:\/\/tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png$/)
  assert.match(svgPath(layout.points), /^M[\d.]+ [\d.]+ L/)
})

test('el recorrido para redes llena el lienzo respetando el margen', async () => {
  const { fitRoutePoints } = await import('../lib/route-map.js')
  const fit = fitRoutePoints(points, { width: 900, height: 620, padding: 40 })
  const xs = fit.points.map((p) => p.x); const ys = fit.points.map((p) => p.y)
  const fillsWidth = Math.abs(Math.min(...xs) - 40) < 1 && Math.abs(Math.max(...xs) - 860) < 1
  const fillsHeight = Math.abs(Math.min(...ys) - 40) < 1 && Math.abs(Math.max(...ys) - 580) < 1
  assert.ok(fillsWidth || fillsHeight)
  assert.equal(fitRoutePoints([]), null)
})

test('el mapa ampliado rotula cada calle una vez, a lo largo de su tramo', async () => {
  const { streetLabels } = await import('../lib/route-map.js')
  const pts = [
    { x: 0, y: 0, label: 'Real Parroquia de Omnium Sanctorum', type: 'place' },
    { x: 100, y: 0, label: 'Feria', type: 'street' },
    { x: 100, y: 100, label: 'Relator', type: 'street' },
    { x: 100, y: 110, label: 'Amargura', type: 'street' },
    { x: 0, y: 110, label: 'Feria', type: 'street' },
  ]
  const labels = streetLabels(pts)
  assert.deepEqual(labels.map((l) => l.name), ['Feria', 'Relator'])
  assert.equal(labels[1].angle, 90)
})

test('con fill el recorrido llena el lienzo y las teselas se escalan igual', async () => {
  const { routeMapLayout } = await import('../lib/route-map.js')
  const plain = routeMapLayout(points, { width: 720, height: 1080, padding: 56 })
  const filled = routeMapLayout(points, { width: 720, height: 1080, padding: 56, fill: true })
  const span = (layout) => Math.max(...layout.points.map((p) => p.x)) - Math.min(...layout.points.map((p) => p.x))
  assert.ok(span(filled) >= span(plain))
  assert.ok(filled.scale >= 1 && filled.scale <= 2)
  assert.equal(filled.tiles[0].size, +(256 * filled.scale).toFixed(1))
})

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

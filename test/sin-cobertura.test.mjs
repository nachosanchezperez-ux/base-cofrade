// La app funciona sin cobertura (24/11/2026): service worker, página
// «Sin conexión» y «Guardar sin cobertura» en el programa de mano.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { buildServiceWorker, OFFLINE_PATH, swRoute } from '../lib/service-worker.js'

const origin = 'https://hilocofrade.es'
const route = (path, extra = {}) => swRoute({ url: `${origin}${path}`, origin, mode: 'navigate', accept: 'text/html', ...extra })

test('qué guarda y qué no', () => {
  assert.equal(route('/hermandades/baratillo-sevilla'), 'page')
  assert.equal(route('/_next/static/chunks/abc.js', { mode: 'no-cors', accept: '*/*' }), 'static')
  assert.equal(route('/_next/image?url=x&w=64', { mode: 'no-cors', accept: 'image/*' }), 'image')
  assert.equal(route('/brand/icon-192.png', { mode: 'no-cors', accept: 'image/*' }), 'image')
  for (const path of ['/panel/hoy', '/api/novedades', '/sw.js', '/calendario/hermandad/x', '/salidas/1/estado']) {
    assert.equal(route(path), 'skip', path)
  }
  assert.equal(route('/hermandades', { rsc: true }), 'skip')
  assert.equal(route('/hermandades?_rsc=1x2'), 'skip')
  assert.equal(route('/hermandades', { method: 'POST' }), 'skip')
  assert.equal(swRoute({ url: 'https://kcevwkucqzcyrqaimyhl.supabase.co/x.jpg', origin, mode: 'no-cors' }), 'skip')
})

test('el service worker generado es JavaScript válido y lleva el programa', () => {
  const code = buildServiceWorker({ version: 'abc123', programmeUrls: ['/semana-santa-sevilla-2027', '/semana-santa-sevilla-2027/lunes-santo'] })
  assert.doesNotThrow(() => new Function(code))
  assert.match(code, /"version":"abc123"/)
  assert.match(code, /"\/semana-santa-sevilla-2027\/lunes-santo"/)
  assert.match(code, new RegExp(`cache\\.addAll\\(\\[CONFIG\\.offline\\]\\)`))
  assert.match(code, /!response\.redirected/)
  assert.equal(OFFLINE_PATH, '/sin-conexion')
})

test('registro, aviso sin red, página sin conexión y botón del programa', () => {
  const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
  assert.match(read('app/layout.js'), /<HiloServiceWorker \/>/)
  assert.match(read('components/HiloServiceWorker.js'), /register\('\/sw\.js', \{ scope: '\/' \}\)/)
  assert.match(read('app/sw.js/route.js'), /PROGRAMME_DAYS\.map\(\(day\) => dayPath\(day\.id\)\)/)
  assert.match(read('app/sin-conexion/page.js'), /robots: \{ index: false, follow: false \}/)
  assert.doesNotMatch(read('components/OfflineSavedPages.js'), /next\/link/)
  assert.match(read('app/semana-santa-sevilla-2027/ProgrammeShell.js'), /<ProgrammeOfflineSave \/>/)
})

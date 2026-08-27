import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const [component, loader, css] = await Promise.all([
  readFile(new URL('../components/HomeTodayV2.js', import.meta.url), 'utf8'),
  readFile(new URL('../lib/supabase/home-v2.js', import.meta.url), 'utf8'),
  readFile(new URL('../components/HomeTodayV2.module.css', import.meta.url), 'utf8'),
])

test('presenta el recorrido relacional como una secuencia legible', () => {
  assert.match(component, /function RelationshipTrail/)
  assert.match(component, /Recorrido:/)
  assert.match(component, /kickerArrow/)
  assert.match(css, /\.kickerStep/)
})

test('la Marcha del día resuelve interpretación, lanzamiento y portada publicados', () => {
  assert.match(loader, /band_entity_id, title, is_featured/)
  assert.match(loader, /cover_image_path, cover_image_alt/)
  assert.match(loader, /performedBy:/)
  assert.match(loader, /releaseHref:/)
  assert.match(loader, /coverImagePath:/)
  assert.match(component, /Interpretación/)
  assert.match(component, /Grabación/)
  assert.match(component, /Ver la discografía/)
})

test('el Hilo para descubrir mantiene la concordancia en singular', () => {
  assert.match(loader, /agree\(count, 'queda conectado', 'quedan conectados'\)/)
  assert.doesNotMatch(loader, /\$\{plural\(count, 'paso', 'pasos'\)\} quedan conectados/)
})

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const palette = read('components/panel/PanelCommandPalette.js')
const creation = read('lib/panel/creation.js')
const paletteStyles = read('components/panel/PanelCommandPalette.module.css')
const searchRoute = read('app/api/panel/search/route.js')
const layout = read('app/panel/(protected)/layout.js')

test('la paleta global abre con comando de teclado y acciones explícitas', () => {
  assert.match(palette, /event\.metaKey \|\| event\.ctrlKey/)
  assert.match(palette, /event\.key\.toLowerCase\(\) === 'k'/)
  assert.match(palette, /panel-command-open/)
  assert.match(palette, /mode === 'recent'/)
  assert.match(palette, /mode === 'new'/)
  assert.match(palette, /aria-label="Navegación rápida del Panel"/)
})

test('la búsqueda global conserva recientes y ofrece altas editoriales seguras', () => {
  assert.match(palette, /hilo-panel-recents-v1/)
  assert.match(palette, /localStorage\.setItem/)
  assert.match(palette, /PANEL_CREATE_ITEMS/)
  assert.match(palette, /canEdit \? PANEL_CREATE_ITEMS/)
  assert.match(creation, /\/panel\/hermandades\/nueva/)
  assert.match(creation, /\/panel\/imagenes\/nueva/)
  assert.match(creation, /\/panel\/pasos\/nuevo/)
  assert.match(creation, /\/panel\/bandas\/nueva/)
  assert.match(creation, /\/panel\/agentes\/nuevo/)
})

test('el endpoint de búsqueda exige sesión editorial y limita las entidades navegables', () => {
  assert.match(searchRoute, /getPanelUser\(\)/)
  assert.match(searchRoute, /No autorizado/)
  assert.match(searchRoute, /Cache-Control': 'private, no-store'/)
  for (const type of ['brotherhood', 'image', 'step', 'band', 'march', 'agent']) {
    assert.match(searchRoute, new RegExp(`${type}:`))
  }
  assert.match(searchRoute, /character', 'extraordinary'/)
  assert.match(searchRoute, /\/panel\/extraordinarias\/\$\{item\.id\}/)
  assert.match(searchRoute, /\.slice\(0, 16\)/)
})

test('la paleta se monta una sola vez en el layout protegido y tiene adaptación móvil', () => {
  assert.match(layout, /PanelCommandPalette/)
  assert.match(layout, /canEdit=\{canEdit\}/)
  assert.match(layout, /role=\{user\.role\}/)
  assert.match(paletteStyles, /z-index: 120/)
  assert.match(paletteStyles, /@media \(max-width: 860px\)/)
  assert.match(paletteStyles, /max-height: min\(78vh, 720px\)/)
})

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const mobile = read('app/panel/panel-mobile.css')
const editState = read('components/panel/PanelEditState.module.css')
const nav = read('components/panel/PanelNav.js')

test('el Panel cambia completamente a operación móvil en el mismo breakpoint que la navegación', () => {
  assert.match(mobile, /@media \(max-width: 860px\)/)
  assert.match(mobile, /\[data-panel-shell\] \{[\s\S]*display: block !important/)
  assert.match(mobile, /grid-template-columns: 1fr !important/)
  assert.match(nav, /mobileBar/)
  assert.match(nav, /Buscar/)
  assert.match(nav, /Recientes/)
  assert.match(nav, /Nuevo/)
})

test('los filtros no fuerzan ancho de escritorio en móvil', () => {
  assert.match(mobile, /\[data-panel-main\] \[class\*='filters'\] \{[\s\S]*width: 100% !important/)
  assert.match(mobile, /\[data-panel-main\] \[class\*='filters'\] \{[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\) !important/)
  assert.match(mobile, /\[class\*='filters'\] > :first-child,[\s\S]*grid-column: 1 \/ -1/)
  assert.match(mobile, /\[class\*='filters'\] > button:last-child[\s\S]*width: 100% !important/)
})

test('los formularios están preparados para tacto e iPhone sin zoom automático', () => {
  assert.match(mobile, /font-size: 16px !important/)
  assert.match(mobile, /min-height: 48px !important/)
  assert.match(mobile, /textarea \{[\s\S]*min-height: 112px !important/)
  assert.match(mobile, /touch-action: manipulation/)
  assert.match(mobile, /input\[type='checkbox'\]/)
})

test('la navegación de ficha y las acciones priorizan una mano y poco desplazamiento', () => {
  assert.match(mobile, /\[class\*='sectionTabs'\][\s\S]*scroll-snap-type: x proximity/)
  assert.match(mobile, /\[class\*='breadcrumb'\][\s\S]*overflow-x: auto/)
  assert.match(mobile, /\[class\*='formActions'\][\s\S]*flex-direction: column !important/)
  assert.match(mobile, /\[class\*='formActions'\] button\[type='submit'\][\s\S]*width: 100% !important/)
})

test('el guardado rápido acompaña al usuario por todo el rango móvil y respeta el área segura', () => {
  assert.match(editState, /@media \(max-width: 860px\)/)
  assert.match(editState, /env\(safe-area-inset-bottom, 0px\)/)
  assert.match(editState, /min-height: 44px/)
  assert.match(editState, /touch-action: manipulation/)
})

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la navegación contextual mantiene activa y accesible la sección visible', () => {
  const component = source('components/panel/EntityWorkspaceNav.js')
  const styles = source('components/panel/EntityWorkspaceNav.module.css')

  assert.match(component, /ResizeObserver/)
  assert.match(component, /aria-label="Ver más secciones"/)
  assert.match(component, /aria-label="Ver secciones anteriores"/)
  assert.match(component, /active\.offsetLeft/)
  assert.match(component, /items\.length > 7/)
  assert.match(styles, /font-size: 11\.5px/)
  assert.match(styles, /min-height: 42px/)
  assert.match(styles, /\.scrollButton/)
})

test('los guardados del Panel generan feedback central y reutilizan el mensaje de la página', () => {
  const toast = source('components/panel/PanelSaveToast.js')
  const styles = source('components/panel/PanelSaveToast.module.css')
  const layout = source('app/panel/(protected)/layout.js')

  assert.match(toast, /\[role="status"\]/)
  assert.match(toast, /candidate\.hidden = true/)
  assert.match(toast, /Actualización completada/)
  assert.match(toast, /3000/)
  assert.match(styles, /place-items: center/)
  assert.match(styles, /position: fixed/)
  assert.match(layout, /PanelSaveToast/)
  assert.match(layout, /<Suspense fallback=\{null\}>/)
})

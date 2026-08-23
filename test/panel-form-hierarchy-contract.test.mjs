import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const group = read('components/panel/PanelFormGroup.js')
const groupStyles = read('components/panel/PanelFormGroup.module.css')
const panelUx = read('app/panel/panel-ux.css')

const editors = [
  'app/panel/(protected)/hermandades/[id]/page.js',
  'app/panel/(protected)/imagenes/[id]/page.js',
  'app/panel/(protected)/pasos/[id]/page.js',
  'app/panel/(protected)/bandas/[id]/page.js',
  'app/panel/(protected)/extraordinarias/[id]/general/page.js',
  'app/panel/(protected)/hermandades/[id]/habito/page.js',
].map(read)

test('los formularios largos comparten una jerarquía editorial reutilizable', () => {
  assert.match(group, /data-panel-form-group/)
  assert.match(group, /PanelFormGroup\.module\.css/)
  assert.match(group, /panelStyles\.formGrid/)
  assert.match(groupStyles, /\.group \+ \.group/)
  assert.match(groupStyles, /grid-template-columns:\s*minmax\(0, 1fr\) minmax\(220px, 38%\)/)
  assert.match(groupStyles, /@media \(max-width: 860px\)/)

  for (const editor of editors) {
    assert.match(editor, /PanelFormGroup/)
    assert.match(editor, /<PanelFormGroup/)
  }
})

test('las superficies de edición reducen cajas y convierten el guardado en pie del formulario', () => {
  assert.match(panelUx, /form\[class\*="panelCard"\]\[class\*="editorForm"\]/)
  assert.match(panelUx, /box-shadow:\s*none !important/)
  assert.match(panelUx, /margin:\s*0 -24px/)
  assert.match(panelUx, /background:\s*var\(--panel-editor-soft\)/)
  assert.match(panelUx, /\[class\*="editorStack"\] > \[class\*="editorItem"\]/)
})

test('la cobertura se presenta como resumen compacto y conserva navegación accesible', () => {
  assert.match(panelUx, /section\[aria-label\^="Cobertura"\]/)
  assert.match(panelUx, /grid-template-columns:\s*auto minmax\(0, 1fr\)/)
  assert.match(panelUx, /grid-template-columns:\s*auto minmax\(0, 1fr\) 28px/)
  assert.match(panelUx, /\.panelMetricLink \.panelMetricArrow/)
  assert.match(panelUx, /@media \(max-width: 480px\)/)
})

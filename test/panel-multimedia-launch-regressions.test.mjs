import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const mediaLoader = read('lib/panel/media.js')
const panelCss = read('app/panel/panel.module.css')

test('Multimedia conserva URL externas y normaliza rutas del bucket con el resolver canónico', () => {
  assert.match(mediaLoader, /resolveHiloMediaReference/)
  assert.doesNotMatch(mediaLoader, /function publicUrl/)
  assert.doesNotMatch(mediaLoader, /getPublicUrl\(storagePath\)/)
})

test('las tarjetas editoriales pueden encogerse dentro del ancho disponible del Panel', () => {
  assert.match(panelCss, /\.editorItem \{ min-width: 0; padding: 24px; \}/)
  assert.match(panelCss, /\.editorForm \{ display: grid; grid-template-columns: minmax\(0, 1fr\);/)
  assert.match(panelCss, /\.formGrid > \*,\n\.movementForm > \* \{ min-width: 0; \}/)
})

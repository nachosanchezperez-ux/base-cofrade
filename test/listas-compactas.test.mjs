import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const read = (path) => readFileSync(path, 'utf8')

test('igualás: en móvil cada convocatoria es una fila compacta', () => {
  const css = read('components/CrewEventDirectory.module.css')
  const block = css.slice(css.lastIndexOf('/* Lista compacta en móvil'))
  assert.match(block, /\.relations>span,\.relations span\{padding:0;border-radius:0;background:none/)
  assert.match(block, /\.detailLink\{display:none\}/)
  assert.match(block, /\.dateBlock small\{display:none\}/)
  assert.match(read('components/CrewEventDirectory.js'), /<ShareActions compact iconsOnly className=\{styles\.cardShare\}/)
})

test('cambios 2027: menos aire entre cambios en móvil, enlaces de al menos 24 px', () => {
  const css = read('app/semana-santa/2027/cambios-musicales/cambios-musicales.module.css')
  const block = css.slice(css.lastIndexOf('/* Lista compacta en móvil'))
  assert.match(block, /\.movement \+ \.movement \{\s*margin-top: 10px;/)
  const minHeight = Number(block.match(/min-height: (\d+)px/)[1])
  assert.ok(minHeight >= 24)
})

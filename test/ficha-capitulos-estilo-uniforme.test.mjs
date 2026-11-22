import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { heritageFoldCount } from '../lib/heritage-fold-count.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('el plegable de Patrimonio cuenta piezas, estrenos y restauraciones', () => {
  const pieces = Array.from({ length: 11 }, (_, i) => ({ id: i }))
  const updates = [...Array.from({ length: 6 }, () => ({ tipo: 'Estreno' })), { tipo: 'Restauración' }]
  assert.equal(heritageFoldCount(pieces, updates), '11 piezas · 6 estrenos · 1 restauración')
  assert.equal(heritageFoldCount([], [{ tipo: 'Estreno' }]), '1 estreno')
  assert.equal(heritageFoldCount([{}], []), '1 pieza')
  assert.equal(heritageFoldCount(null, null), '')
})

test('la ficha por capítulos usa el recuento completo', () => {
  const layout = read('components/BrotherhoodChaptersLayout.js')
  assert.match(layout, /title="Patrimonio y estrenos" count=\{heritageFoldCount\(h\.patrimonio, h\.estrenos\)\}/)
})

test('un solo estilo de plegable para los bloques de cierre de la ficha', () => {
  const css = read('components/BrotherhoodChaptersLayout.module.css')
  for (const selector of ['#conoce-hermandad', '#fuentes details', '#el-hilo-se-mueve details']) {
    assert.ok(css.includes(selector), `falta ${selector}`)
  }
  assert.match(css, /:global\(#historia\) \{\s*background: transparent !important;/)
})

test('los hitos destacados de Historia no cambian de tamaño de letra', () => {
  const css = read('components/BrotherhoodChapterHistory.module.css')
  assert.doesNotMatch(css, /\.highlighted \.copy h3 \{/)
})

test('los recuentos de los plegables llevan su palabra', () => {
  const layout = read('components/BrotherhoodChaptersLayout.js')
  assert.match(layout, /plural\(h\.curiosidades\.length, 'curiosidad', 'curiosidades'\)/)
  assert.doesNotMatch(layout, /count=\{h\.[a-zA-Z]+\.length\}/)
})

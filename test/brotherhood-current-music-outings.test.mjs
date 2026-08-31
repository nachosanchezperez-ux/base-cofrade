import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const [component, css] = await Promise.all([
  readFile(new URL('../components/BrotherhoodRelationalExtras.js', import.meta.url), 'utf8'),
  readFile(new URL('../components/BrotherhoodCurrentMusic.module.css', import.meta.url), 'utf8'),
])

test('agrupa los acompañamientos actuales por la salida canónica', () => {
  assert.match(component, /function groupCurrentAccompaniments/)
  assert.match(component, /const label = outingLabel\(item\.salida\)/)
  assert.match(component, /salida: period\.outing_type \|\| ''/)
  assert.match(component, /group\.label/)
})

test('una Hermandad de Penitencia no fuerza todos sus acompañamientos bajo Semana Santa', () => {
  assert.doesNotMatch(component, /penitencia \? 'Semana Santa'/)
  assert.doesNotMatch(component, /loadBrotherhoodTypes/)
  assert.match(component, /Música procesional/)
})

test('la ficha presenta cada salida como un subgrupo legible y responsive', () => {
  assert.match(component, /styles\.groups/)
  assert.match(component, /styles\.outingGroup/)
  assert.match(component, /styles\.outingHeader/)
  assert.match(css, /\.groups/)
  assert.match(css, /\.outingHeader/)
  assert.match(css, /@media \(max-width: 760px\)/)
})

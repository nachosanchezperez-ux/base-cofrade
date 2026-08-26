import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../app/extraordinarias/[slug]/extraordinary-detail.module.css', import.meta.url), 'utf8')

test('la cabecera elimina Anunciada y destaca el motivo y los datos clave', () => {
  assert.equal(css.includes('[data-status="announced"]{display:none}'), true)
  assert.equal(css.includes('.reason::before{content:"Motivo"'), true)
  assert.equal(css.includes('.dateFact{grid-column:1/-1}'), true)
  assert.equal(css.includes('.keyFacts strong{font-size:15px}'), true)
  assert.equal(css.includes('.dateFact strong{text-transform:none}'), true)
})

test('las secciones a ancho completo no provocan scroll horizontal', () => {
  assert.equal(css.includes('.page{overflow-x:clip}'), true)
  assert.equal(css.includes('margin-inline:calc(50% - 50vw)'), true)
})

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('Extraordinarias alinea el title con la consulta principal observada en GSC', () => {
  const seo = read('lib/seo-calendar.js')
  const page = read('app/extraordinarias/page.js')

  assert.match(seo, /Extraordinarias en Sevilla \$\{year\}: procesiones y salidas/)
  assert.match(page, /Procesiones y salidas extraordinarias de Sevilla \{currentYear\}/)
  assert.match(page, /Consulta las extraordinarias de Sevilla en \{currentYear\}/)
})

test('las fichas extraordinarias incorporan la Hermandad cuando aporta intención de búsqueda', () => {
  const page = read('app/extraordinarias/[slug]/page.js')

  assert.match(page, /function shortBrotherhoodName/)
  assert.match(page, /const eventLead = brotherhood && !titleIncludesBrotherhood/)
  assert.match(page, /compactSeoTitle\(seoTitle\(item\), 58\)/)
})

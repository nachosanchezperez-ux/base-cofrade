import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('las fichas de Banda destacan visualmente desde cuándo existe cada acompañamiento', () => {
  const layout = read('app/bandas/[slug]/layout.js')
  const css = read('app/bandas/[slug]/band-period-emphasis.module.css')

  assert.match(layout, /band-period-emphasis\.module\.css/)
  assert.match(layout, /periodStyles\.periodScope/)
  assert.match(css, /:global\(#acompanamientos\)/)
  assert.match(css, /:global\(#proximos-acompanamientos\)/)
  assert.match(css, /:global\(#glorias\)/)
  assert.match(css, /font-size: 15px;/)
  assert.match(css, /font-weight: 800;/)
  assert.match(css, /background: #fff;/)
  assert.match(css, /font-variant-numeric: tabular-nums;/)
})

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../components/SiteBreadcrumb.module.css', import.meta.url), 'utf8')

test('la ruta de navegación no baja de 11px, ni en escritorio ni en móvil', () => {
  const sizes = [...css.matchAll(/\.breadcrumb a,\s*\.breadcrumb span\[aria-current="page"\],\s*\.breadcrumb li > span:not\(\[aria-current\]\)\s*\{[^}]*?font-size:\s*(\d+)px/g)].map((m) => Number(m[1]))
  assert.equal(sizes.length, 2)
  for (const size of sizes) assert.ok(size >= 11, `ruta a ${size}px`)
})

test('en móvil, los títulos largos se acortan con «…» en la última etiqueta', () => {
  const mobile = css.slice(css.indexOf('@media (max-width: 620px)'))
  assert.match(mobile, /\.breadcrumb li:last-child \{[^}]*flex: 0 1 auto;[^}]*min-width: 0;/)
  assert.match(mobile, /\.breadcrumb li:last-child span\[aria-current="page"\] \{[^}]*text-overflow: ellipsis/)
})

test('el Vía Crucis tampoco baja de 11px en móvil', () => {
  const via = readFileSync(new URL('../app/via-crucis-sevilla/via-crucis.module.css', import.meta.url), 'utf8')
  const mobile = via.slice(via.lastIndexOf('@media (max-width: 620px)'))
  assert.match(mobile, /span\[aria-current="page"\] \{\s*font-size: 11px;/)
})

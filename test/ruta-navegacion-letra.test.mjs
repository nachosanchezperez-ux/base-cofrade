import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../components/SiteBreadcrumb.module.css', import.meta.url), 'utf8')

test('la ruta de navegación no baja de 11px, ni en escritorio ni en móvil', () => {
  const sizes = [...css.matchAll(/\.breadcrumb a,\s*\.breadcrumb span\[aria-current="page"\],\s*\.breadcrumb li > span:not\(\[aria-current\]\)\s*\{[^}]*?font-size:\s*(\d+)px/g)].map((m) => Number(m[1]))
  assert.equal(sizes.length, 2)
  for (const size of sizes) assert.ok(size >= 11, `ruta a ${size}px`)
})

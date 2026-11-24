// Directorio de Marchas con el color heredado de cada marcha (24/11/2026).
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { selectMarchPalette } from '../lib/march-palette.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la tarjeta usa la misma herencia de color que la ficha', () => {
  const loader = read('lib/supabase/public-marches.js')
  assert.match(loader, /async function loadDirectoryMarchPalettes/)
  assert.match(loader, /selectMarchPalette\(\{/)
  assert.match(loader, /color: paletteByMarch\.get\(item\.id\) \|\| ''/)
  // Sin herencia, sin color propio (la tarjeta queda en azul de Hilo).
  assert.match(loader, /if \(palette\.source\) result\.set/)
  assert.equal(selectMarchPalette({}).source, null)
})

test('la tarjeta pinta la franja y el año con el color de la marcha', () => {
  const page = read('app/marchas/page.js')
  assert.match(page, /'--march-card-color': march\.color/)
  const css = read('app/marchas/marchas.module.css')
  assert.match(css, /\.card::before \{[^}]*background: var\(--march-card-color\)/)
  assert.match(css, /\.cardCopy strong \{ font-size: 16px/)
  assert.doesNotMatch(css, /\.cardMeta \.pending \{[^}]*font-size: 8px/)
  const cache = read('lib/supabase/public-directory-cache.js')
  assert.match(cache, /public-directory-public-marches-strict-v3-color/)
})

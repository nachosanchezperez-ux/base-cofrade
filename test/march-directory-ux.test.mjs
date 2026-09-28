import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('Marchas permite buscar por título o compositor y acotar por década', () => {
  const page = read('app/marchas/page.js')

  assert.match(page, /placeholder="Ej\. Amarguras, Font de Anta, Macarena…"/)
  assert.match(page, /name="q"/)
  assert.match(page, /name="decada"/)
  assert.match(page, /matchesQuery/)
  assert.match(page, /march\.authors\.map\(\(author\) => author\.name\)/)
  assert.match(page, /decadeFor/)
})

test('el índice alfabético filtra el archivo completo y no solo la página actual', () => {
  const page = read('app/marchas/page.js')

  assert.match(page, /const initialGroups = groupsFor\(decadeItems\)/)
  assert.match(page, /const availableInitials = initialGroups\.map/)
  assert.match(page, /letter: initial/)
  assert.match(page, /availableInitials\.map/)
})

test('Marchas ofrece filtros rápidos y últimas incorporaciones', () => {
  const page = read('app/marchas/page.js')
  const data = read('lib/supabase/public-marches.js')

  assert.match(page, /Nuevas incorporaciones/)
  assert.match(page, /Con autoría/)
  assert.match(page, /Con fecha/)
  assert.match(page, /Últimas marchas publicadas/)
  assert.match(page, /createdAt/)
  assert.match(data, /created_at/)
  assert.match(data, /createdAt: item\.created_at/)
})

test('la exploración de Marchas se adapta a móvil sin envolver el alfabeto', () => {
  const css = read('app/marchas/marchas.module.css')

  assert.match(css, /\.finder/)
  assert.match(css, /\.quickFilters/)
  assert.match(css, /@media \(max-width: 620px\)/)
  assert.match(css, /\.alphabet \{[\s\S]*flex-wrap: nowrap;[\s\S]*overflow-x: auto;/)
  assert.match(css, /\.latestGrid \{[\s\S]*overflow-x: auto;/)
})


test('el directorio de Marchas invalida la caché al incorporar createdAt', () => {
  const cache = read('lib/supabase/public-directory-cache.js')
  assert.match(cache, /public-directory-public-marches-strict-v2/)
})


test('el filtro Nuevas se limita a una ventana reciente útil', () => {
  const page = read('app/marchas/page.js')
  assert.match(page, /const RECENT_DAYS = 7/)
})

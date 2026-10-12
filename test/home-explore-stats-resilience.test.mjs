import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('las magnitudes de Home aíslan fallos parciales y no convierten error en cero', async () => {
  const loader = await read('lib/supabase/home-v2.js')

  assert.match(loader, /Promise\.allSettled/)
  assert.match(loader, /count: null/)
  assert.match(loader, /counts\.has\(item\.key\) \? counts\.get\(item\.key\) : null/)
  assert.match(loader, /result\.value\.error/)
})

test('la vista no convierte un dato no disponible en cero: muestra la sección sin cifra', async () => {
  const { buildHomeDiscover } = await import('../lib/home-discover.js')
  const items = buildHomeDiscover({
    directories: [{ key: 'brotherhood', count: null }, { key: 'band', count: 0 }],
    graph: [{ key: 'march', count: 1234 }],
  })
  const byKey = Object.fromEntries(items.map((item) => [item.key, item.detail]))

  assert.equal(byKey.brotherhood, '')
  assert.equal(byKey.band, '0 fichas')
  assert.equal(byKey.march, `${new Intl.NumberFormat('es-ES').format(1234)} fichas`)
  assert.equal(byKey.agenda, 'Hoy, mañana y fin de semana')
  assert.equal(buildHomeDiscover(null).length, 6)
})

test('las magnitudes de Home reutilizan el directorio público cacheado', async () => {
  const loader = await read('lib/supabase/home-v2.js')

  assert.match(loader, /from '@\/lib\/supabase\/public-directory-cache'/)
  assert.doesNotMatch(loader, /from '@\/lib\/supabase\/public-entity-directory'/)
})

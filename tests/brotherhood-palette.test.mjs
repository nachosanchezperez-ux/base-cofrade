import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { DEFAULT_BROTHERHOOD_PALETTE, resolveBrotherhoodPalette } from '../lib/brotherhood-palette.js'

const cabeza = [
  { color_name: 'Verde', hex_value: '#1F5A3A', color_role: 'primary', sort_order: 1 },
  { color_name: 'Blanco', hex_value: '#FFFFFF', color_role: 'identity', sort_order: 2 },
  { color_name: 'Dorado', hex_value: '#B08D3C', color_role: 'accent', sort_order: 3 },
]
const id = '2e5a02f7-7d7c-4488-a6a3-042d4bd104b6'
const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8')

function loadPaletteFunction(local) {
  const source = read('../lib/supabase/brotherhood-palette.js')
    .replace(/^import .*$/gm, '')
    .replace('export async function', 'async function')
  return new Function('getHermandadBySlug', 'resolveBrotherhoodPalette', `${source}\nreturn loadPublishedBrotherhoodPalette`)(
    () => local, resolveBrotherhoodPalette
  )
}

function fakeClient(data, error = null) {
  const calls = []
  const query = {
    from(...args) { calls.push(['from', ...args]); return this },
    select(...args) { calls.push(['select', ...args]); return this },
    eq(...args) { calls.push(['eq', ...args]); return this },
    order(...args) { calls.push(['order', ...args]); return this },
    then(resolve) { return Promise.resolve({ data, error }).then(resolve) },
  }
  return { query, calls }
}

test('Cabeza inherits all five colors without falling back to blue/red', () => {
  assert.deepEqual(resolveBrotherhoodPalette(cabeza), {
    primario: '#1F5A3A', secundario: '#B08D3C', claro: '#FFFFFF',
    oscuro: '#102f1e', sobreSecundario: '#FFFFFF', nombres: ['Verde', 'Blanco', 'Dorado'],
  })
})

test('input order cannot change the corporate palette and input is not mutated', () => {
  const rows = [...cabeza].reverse()
  const before = JSON.stringify(rows)
  assert.deepEqual(resolveBrotherhoodPalette(rows), resolveBrotherhoodPalette(cabeza))
  assert.equal(JSON.stringify(rows), before)
})

test('published colors take precedence over legacy local colors', () => {
  assert.equal(resolveBrotherhoodPalette(cabeza, { primario: '#000000' }).primario, '#1F5A3A')
})

test('white primary stays white and uses the established dark contrast on a light accent', () => {
  const palette = resolveBrotherhoodPalette([
    { color_name: 'Blanco', hex_value: '#FFFFFF', color_role: 'primary', sort_order: 1 },
    { color_name: 'Celeste', hex_value: '#66B8D4', color_role: 'accent', sort_order: 2 },
  ])
  assert.equal(palette.primario, '#FFFFFF')
  assert.equal(palette.secundario, '#66B8D4')
  assert.equal(palette.sobreSecundario, '#153B50')
})

test('cream identity surface is preserved, not replaced by a generic white', () => {
  const palette = resolveBrotherhoodPalette([
    { color_name: 'Verde', hex_value: '#1F5A3A', color_role: 'primary', sort_order: 1 },
    { color_name: 'Dorado', hex_value: '#B08D3C', color_role: 'accent', sort_order: 2 },
    { color_name: 'Crema', hex_value: '#F7F1E3', color_role: 'identity', sort_order: 3 },
  ])
  assert.equal(palette.claro, '#F7F1E3')
})

test('one corporate color remains one color; no unrelated red accent is invented', () => {
  const palette = resolveBrotherhoodPalette([cabeza[0]])
  assert.equal(palette.secundario, palette.primario)
})

test('missing palette has the same complete site fallback for every entity', () => {
  assert.deepEqual(resolveBrotherhoodPalette([]), { ...DEFAULT_BROTHERHOOD_PALETTE, nombres: [] })
  assert.equal(resolveBrotherhoodPalette([], { primario: '#112233' }).primario, '#112233')
})

test('draft colors are excluded and invalid CSS cannot enter the palette', () => {
  const palette = resolveBrotherhoodPalette([
    { ...cabeza[0], status: 'draft' },
    { color_name: 'Sin color', hex_value: 'url(bad)', color_role: 'primary' },
  ], { claro: 'var(--bad)' })
  assert.equal(palette.primario, DEFAULT_BROTHERHOOD_PALETTE.primario)
  assert.equal(palette.claro, '#FFFFFF')
})

test('legacy named white is supported', () => {
  assert.equal(resolveBrotherhoodPalette([{ color_name: 'BLÁNCO', color_role: 'primary' }]).primario, '#FFFFFF')
})

test('shared loader requests only the published palette for the resolved brotherhood', async () => {
  const { query, calls } = fakeClient(cabeza)
  const palette = await loadPaletteFunction()(query, { id, slug: 'hermandad-virgen-cabeza-sevilla' })
  assert.deepEqual(palette, resolveBrotherhoodPalette(cabeza))
  assert.deepEqual(calls.filter(([method]) => method === 'from'), [['from', 'brotherhood_colors']])
  assert.ok(calls.some((call) => call.join('|') === `eq|brotherhood_entity_id|${id}`))
  assert.ok(calls.some((call) => call.join('|') === 'eq|status|published'))
})

test('a changed brotherhood palette is inherited on the next load without child writes', async () => {
  const load = loadPaletteFunction()
  const first = await load(fakeClient(cabeza).query, { id })
  const updated = cabeza.map((row) => row.color_role === 'primary' ? { ...row, hex_value: '#552266' } : row)
  const second = await load(fakeClient(updated).query, { id })
  assert.equal(first.primario, '#1F5A3A')
  assert.equal(second.primario, '#552266')
  assert.equal(second.secundario, first.secundario)
})

test('a database failure is not cached as a successful generic palette', async () => {
  await assert.rejects(loadPaletteFunction()(fakeClient(null, { message: 'timeout' }).query, { id }), /timeout/)
})

test('local-only brotherhood does not query a UUID column with a legacy id', async () => {
  const { query, calls } = fakeClient([])
  const palette = await loadPaletteFunction({ colores: { primario: '#112233' } })(query, { id: 'H0001' })
  assert.equal(palette.primario, '#112233')
  assert.equal(calls.length, 0)
})

test('brotherhood and child pages use the same lightweight palette loader', () => {
  const parent = read('../lib/supabase/brotherhood-page.js')
  const children = read('../lib/supabase/public-entity-pages.js')
  assert.match(parent, /loadPublishedBrotherhoodPalette\(supabase, hermandad\)/)
  assert.match(children, /loadPublishedBrotherhoodPalette\(supabase, brotherhoodEntity\)/)
  assert.match(children, /escudoPath: brotherhood\.crest_path \|\| '',\s+colores,/)
  assert.match(children, /'brotherhood_images', 'image_entity_id'/)
  assert.match(children, /'brotherhood_steps', 'step_entity_id'/)
  assert.doesNotMatch(children, /import .*from ['"]@\/lib\/supabase\/brotherhood-page/)
})

test('both child routes consume every inherited palette token', () => {
  for (const path of ['../app/imagenes/[slug]/page.js', '../app/pasos/[slug]/page.js']) {
    const page = read(path)
    for (const key of ['primario', 'secundario', 'claro', 'oscuro', 'sobreSecundario']) {
      assert.ok(page.includes(`hermandad?.colores?.${key}`), `${path}: ${key}`)
    }
  }
})

test('brotherhood cache invalidation also covers inherited image and step palettes', () => {
  const children = read('../lib/supabase/public-entity-pages.js')
  assert.match(children, /tags: \['public-image-detail', 'public-brotherhood-detail'\]/)
  assert.match(children, /tags: \['public-step-detail', 'public-brotherhood-detail'\]/)
})

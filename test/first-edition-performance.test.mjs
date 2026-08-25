import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('public functions execute next to the Supabase region', async () => {
  const config = JSON.parse(await read('vercel.json'))

  assert.deepEqual(config.regions, ['dub1'])
  assert.ok(config.functionFailoverRegions?.length)
  assert.notEqual(config.functionFailoverRegions[0], config.regions[0])
})

test('extraordinary source links have a targeted covering index', async () => {
  const migration = await read(
    'supabase/migrations/20260825141316_index_extraordinary_source_links.sql',
  )

  assert.match(migration, /create index if not exists source_links_outing_idx/i)
  assert.match(migration, /on public\.source_links \(outing_id, source_id\)/i)
  assert.match(migration, /where outing_id is not null/i)
})

test('extraordinary sources are loaded in the source-link query', async () => {
  const loader = await read('lib/supabase/extraordinary-detail.js')

  assert.match(loader, /source_links'[\s\S]*sources\(id, name, url,/)
  assert.doesNotMatch(loader, /\.from\('sources'\)/)
})

test('the homepage offers two clear first-visit paths', async () => {
  const home = await read('components/HomePageV2.js')

  assert.match(home, /aria-label="Accesos principales"/)
  assert.match(home, /href="\/directorio"[\s\S]*Explorar la enciclopedia/)
  assert.match(home, /href="\/extraordinarias"[\s\S]*Ver próximas extraordinarias/)
})

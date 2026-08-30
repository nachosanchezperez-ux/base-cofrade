import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('el calendario público ofrece filtros relacionales, próximas citas e histórico', async () => {
  const [page, directory, loader] = await Promise.all([
    source('app/igualas-y-ensayos/page.js'),
    source('components/CrewEventDirectory.js'),
    source('lib/supabase/crew-events.js'),
  ])

  assert.match(page, /Calendario de Igualás y Ensayos/)
  assert.match(directory, /Próximas/)
  assert.match(directory, /Histórico/)
  for (const filter of ['Hermandad', 'Paso', 'Capataz', 'Localidad', 'Tipo']) {
    assert.match(directory, new RegExp(filter))
  }
  assert.match(loader, /createPublicClient/)
  assert.doesNotMatch(loader, /@\/lib\/supabase\/server/)
  assert.match(loader, /\.eq\('event_category', 'crew_call'\)/)
  assert.match(loader, /municipality\?\.province !== 'Sevilla'/)
})

test('la agenda es descubrible desde cabecera, buscador y sitemap', async () => {
  const [header, search, sitemap] = await Promise.all([
    source('components/HiloHeader.js'),
    source('lib/supabase/search-live.js'),
    source('app/sitemap.js'),
  ])

  assert.match(header, /Igualás y ensayos/)
  assert.match(header, /\/igualas-y-ensayos/)
  assert.match(search, /`\/igualas-y-ensayos\/\$\{entity\.slug\}`/)
  assert.match(sitemap, /getCrewEventDirectory/)
  assert.match(sitemap, /crewEventEntries/)
})

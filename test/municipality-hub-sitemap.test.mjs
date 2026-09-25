import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('el sitemap de Agenda descubre hubs municipales evergreen', () => {
  const sitemap = read('app/sitemap.js')

  assert.match(sitemap, /getIndexableBrotherhoodDirectory/)
  assert.match(sitemap, /item\.localidad/)
  assert.match(sitemap, /const indexableBrotherhoods = await getIndexableBrotherhoodDirectory\(\)/)
  assert.match(
    sitemap,
    /agendaMunicipalityEntries\(\[[\s\S]*indexableBrotherhoods[\s\S]*\]\)/
  )
})

test('la fuente territorial usa el mismo contrato indexable que Hermandades', () => {
  const hub = read('app/agenda-cofrade/localidad/[localidad]/page.js')
  const locality = read('app/hermandades/localidad/[localidad]/page.js')
  const indexable = read('lib/supabase/indexable-brotherhood-directory.js')

  assert.match(hub, /getIndexableBrotherhoodDirectory/)
  assert.match(locality, /getIndexableBrotherhoodDirectory/)
  assert.match(indexable, /filterIndexableBrotherhoods/)
})

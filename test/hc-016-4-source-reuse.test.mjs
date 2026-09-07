import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs'

const page = fs.readFileSync('app/panel/(protected)/datos/salud/page.js', 'utf8')
const actions = fs.readFileSync('app/panel/(protected)/datos/salud/actions.js', 'utf8')
const helper = fs.readFileSync('lib/panel/data-health-reuse.js', 'utf8')

test('Salud propone Fuentes existentes sin aplicarlas directamente', () => {
  assert.match(page, /prepareSourceReuseProposalAction/)
  assert.match(page, /Selecciona una Fuente existente/)
  assert.match(page, /revisas el lote antes de Apply/)
  assert.match(actions, /table: 'source_links'/)
  assert.match(actions, /operation: 'insert'/)
  assert.match(actions, /proposal_mode: 'assisted-reuse'/)
  assert.match(actions, /finalizeBulkImportAction/)
  assert.doesNotMatch(actions, /from\('source_links'\)\.insert/)
})

test('solo ofrece Fuentes que ya documentan relaciones de la misma entidad', () => {
  assert.match(helper, /like\('scope', 'relation:%'\)/)
  assert.match(helper, /\.in\('entity_id', ids\)/)
  assert.match(actions, /eq\('entity_id', entityId\).*eq\('source_id', sourceId\).*like\('scope', 'relation:%'\)/s)
})

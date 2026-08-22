import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('Dirección de Bandas reutiliza Personas completas y admite Fuentes por relación', () => {
  const page = source('app/panel/(protected)/bandas/[id]/direccion/page.js')
  const actions = source('app/panel/(protected)/bandas/[id]/direccion/actions.js')
  const sourceConfig = source('lib/panel/relation-sources.js')
  const sourceActions = source('app/panel/(protected)/fuentes/relation-actions.js')

  assert.match(page, /Buscar Persona existente/)
  assert.match(page, /Abrir Persona/)
  assert.match(page, /relationKind="band_agent"/)
  assert.doesNotMatch(page, /name="person_name" defaultValue=\{item\?\.agent\?\.name/)

  assert.match(actions, /from\('agents'\)\.insert\(\{ entity_id: agentId, agent_kind: 'person' \}\)/)
  assert.match(actions, /date_from:/)
  assert.match(actions, /date_to_text:/)
  assert.doesNotMatch(actions, /from\('entities'\)\.update\(\{ name: personName \}/)

  assert.match(sourceConfig, /band_agent: \{ mode: 'scope' \}/)
  assert.match(sourceActions, /band_agent: \{ table: 'band_agents', contextField: 'band_entity_id' \}/)
})

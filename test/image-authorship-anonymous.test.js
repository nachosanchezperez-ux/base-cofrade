import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la autoría desconocida no necesita un Agente ficticio', () => {
  const migration = source('supabase/migrations/20260822150900_image_authorship_anonymous.sql')
  const action = source('app/panel/(protected)/imagenes/[id]/autorias/anonymous-action.js')
  const editor = source('components/panel/ImageAuthorshipEditor.js')

  assert.match(migration, /alter column agent_entity_id drop not null/)
  assert.match(migration, /authorship_type = 'anonymous' and agent_entity_id is null and certainty = 'unknown'/)
  assert.match(action, /agent_entity_id: null/)
  assert.match(action, /authorship_type: 'anonymous'/)
  assert.match(action, /certainty: 'unknown'/)
  assert.match(editor, /Documentar autor desconocido/)
  assert.match(editor, /No crea una Persona llamada «Anónimo»/)
})

test('el Front publica la autoría anónima desde la relación canónica', () => {
  const publicPages = source('lib/supabase/public-entity-pages.js')
  const brotherhoodDisplay = source('lib/supabase/brotherhood-display.js')

  assert.match(publicPages, /authorship\.authorship_type === 'anonymous'/)
  assert.match(publicPages, /return 'Autor desconocido'/)
  assert.match(publicPages, /const legacyAgentIds = authorships\.length \? \[\] :/)
  assert.doesNotMatch(publicPages, /\/autor desconocido\/i\.test\(image\.notes/)

  assert.match(brotherhoodDisplay, /authorship\.authorship_type === 'anonymous'/)
  assert.match(brotherhoodDisplay, /return 'Autor desconocido'/)
})

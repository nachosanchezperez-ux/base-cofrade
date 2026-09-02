import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const migration = await readFile(
  new URL('../supabase/migrations/20260902115830_restituye_madruga_centuria_macarena.sql', import.meta.url),
  'utf8',
)

test('Centuria conserva las dos posiciones de la Macarena dentro de la Madrugá', () => {
  assert.match(migration, /outing_type='Madrugá'/)
  assert.match(migration, /<> 2/)
  assert.match(migration, /step_entity_id=v_misterio/)
  assert.match(migration, /position='Tras el paso del Señor'/)
})

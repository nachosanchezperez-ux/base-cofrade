import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

test('el motor principal aplica la intención Hermandad → Pasos antes de la ficha genérica', async () => {
  const source = await readFile(new URL('../lib/supabase/tira-del-hilo.js', import.meta.url), 'utf8')
  const intentCall = source.indexOf('singleEntityRelationIntent(question')
  const genericCall = source.indexOf('return await genericEntity')

  assert.match(source, /import \{ singleEntityRelationIntent \} from '@\/lib\/tira-context'/)
  assert.ok(intentCall > 0)
  assert.ok(genericCall > intentCall)
})

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const actions = readFileSync(
  new URL('../app/panel/(protected)/extraordinarias/[id]/musica/actions.js', import.meta.url),
  'utf8'
)

test('el Panel exige normalizar referencias documentales antes de publicar notas musicales', () => {
  assert.match(actions, /SOURCE_FRAMING_PATTERN/)
  assert.match(actions, /Normaliza el texto público/)
  assert.match(actions, /referencia documental para Fuentes/)
})

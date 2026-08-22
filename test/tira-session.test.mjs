import test from 'node:test'
import assert from 'node:assert/strict'

import { decodeTiraSession, encodeTiraSession, sanitizeTiraSession } from '../lib/tira-session.js'

test('conserva conversación y contexto mínimos', () => {
  const session = sanitizeTiraSession({
    messages: [
      { id: 'u1', role: 'user', text: '¿Qué bandas acompañan?' },
      { id: 'a1', role: 'assistant', response: { kind: 'answer', answer: 'Dos.', items: [{ label: 'A' }] } },
    ],
    context: {
      resultSet: { entityType: 'band', entityIds: ['a', 'b'], label: '2 bandas' },
    },
  })

  assert.equal(session.messages.length, 2)
  assert.equal(session.context.resultSet.entityIds.length, 2)
  assert.equal(session.context.resultSet.label, '2 bandas')
})

test('recorta historial y listas grandes', () => {
  const messages = Array.from({ length: 40 }, (_, index) => ({
    id: `u${index}`,
    role: 'user',
    text: `Pregunta ${index}`,
  }))
  const session = sanitizeTiraSession({ messages })
  assert.equal(session.messages.length, 24)
  assert.equal(session.messages[0].text, 'Pregunta 16')
})

test('decodifica de forma segura una sesión corrupta', () => {
  assert.deepEqual(decodeTiraSession('{no'), { messages: [], context: null })
})

test('encode y decode mantienen el contrato saneado', () => {
  const encoded = encodeTiraSession({ messages: [{ role: 'user', text: 'Hola' }] })
  assert.equal(decodeTiraSession(encoded).messages[0].text, 'Hola')
})

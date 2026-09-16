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

test('conserva jornadas y directorios territoriales seguros al restaurar la conversación', () => {
  const restored = decodeTiraSession(encodeTiraSession({
    messages: [{
      id: 'assistant-directory',
      role: 'assistant',
      response: {
        kind: 'answer',
        answer: 'Nueve hermandades publicadas.',
        items: [{
          label: 'San Gonzalo',
          group: 'Lunes Santo',
          href: '/hermandades/san-gonzalo',
        }],
        links: [{
          label: 'Ver el Lunes Santo de Sevilla',
          href: '/hermandades/semana-santa/sevilla-capital/lunes-santo',
        }],
        compactItemLimit: 9,
      },
    }],
  }))

  const response = restored.messages[0].response
  assert.equal(response.items[0].group, 'Lunes Santo')
  assert.equal(response.links[0].href, '/hermandades/semana-santa/sevilla-capital/lunes-santo')
  assert.equal(response.compactItemLimit, 9)
})

test('elimina enlaces peligrosos de una sesión manipulada', () => {
  const session = sanitizeTiraSession({
    messages: [{
      role: 'assistant',
      response: {
        kind: 'answer',
        answer: 'Resultado',
        entities: [{ id: 'e1', entityType: 'band', type: 'Banda', name: 'Banda', href: 'javascript:alert(1)' }],
        items: [{ label: 'Ficha', href: 'javascript:alert(1)' }],
        links: [{ label: 'Directorio', href: 'javascript:alert(1)' }],
        references: [{ id: 's1', name: 'Fuente', url: 'javascript:alert(1)' }],
      },
    }],
  })

  const response = session.messages[0].response
  assert.equal(response.entities[0].href, '')
  assert.equal(response.items[0].href, '')
  assert.deepEqual(response.links, [])
  assert.equal(response.references[0].url, '')
})

test('conserva las superficies públicas de contenido documentado', () => {
  const restored = sanitizeTiraSession({
    messages: [{
      role: 'assistant',
      response: {
        items: [
          { label: 'Marcha', href: '/marchas/refugiame' },
          { label: 'Cruceta', href: '/crucetas-musicales/san-gonzalo-lunes-santo-2026' },
          { label: 'Gloria', href: '/procesiones-de-gloria/pastora-de-cantillana-2026' },
          { label: 'Extraordinaria', href: '/extraordinarias/santa-ana-2026' },
          { label: 'Cultos', href: '/hermandades/el-baratillo#cultos' },
          { label: 'Agenda', href: '/agenda-cofrade?municipio=sevilla' },
        ],
      },
    }],
  })

  assert.deepEqual(
    restored.messages[0].response.items.map((item) => item.href),
    [
      '/marchas/refugiame',
      '/crucetas-musicales/san-gonzalo-lunes-santo-2026',
      '/procesiones-de-gloria/pastora-de-cantillana-2026',
      '/extraordinarias/santa-ana-2026',
      '/hermandades/el-baratillo#cultos',
      '/agenda-cofrade?municipio=sevilla',
    ],
  )
})

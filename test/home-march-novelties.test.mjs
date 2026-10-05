import test from 'node:test'
import assert from 'node:assert/strict'
import { buildRecentMarchPublicationThread } from '../lib/home-march-novelties.js'

const now = new Date('2026-09-28T13:00:00Z')

function march(id, name, slug, createdAt) {
  return {
    id,
    name,
    slug,
    created_at: createdAt,
    entity_type: 'march',
    status: 'published',
  }
}

test('agrupa las Marchas recién publicadas para no inundar Últimos hilos', () => {
  const rows = [
    march('1', 'Morena de luz de luna', 'morena-de-luz-de-luna', '2026-09-27T22:09:44Z'),
    march('2', 'La Virgen del Carmen', 'la-virgen-del-carmen', '2026-09-27T20:51:27Z'),
    march('3', 'Señora de Santa Genoveva', 'senora-de-santa-genoveva', '2026-09-27T20:51:27Z'),
    march('4', 'Mercedes', 'mercedes', '2026-09-27T20:51:27Z'),
    march('5', 'Virgen de las Mercedes', 'virgen-de-las-mercedes', '2026-09-27T20:51:27Z'),
    march('6', 'La Virgen de las Mercedes', 'la-virgen-de-las-mercedes', '2026-09-27T20:51:27Z'),
    march('7', 'Reina de las Mercedes', 'reina-de-las-mercedes', '2026-09-27T20:51:27Z'),
    march('8', 'Virgen Macarena', 'virgen-macarena', '2026-09-27T20:51:27Z'),
  ]

  const thread = buildRecentMarchPublicationThread(rows, { now })

  assert.equal(thread.activityStatus, 'NUEVO')
  assert.equal(thread.activityKind, 'march_publications')
  assert.equal(thread.title, '8 nuevas marchas')
  assert.equal(thread.metric, '8 fichas incorporadas')
  assert.equal(thread.href, '/marchas')
  assert.match(thread.summary, /Morena de luz de luna/)
  assert.match(thread.summary, /La Virgen del Carmen/)
  assert.match(thread.summary, /y 5 más/)
  assert.equal(thread.latestAt, '2026-09-27T22:09:44Z')
})

test('una sola Marcha nueva enlaza directamente con su ficha', () => {
  const thread = buildRecentMarchPublicationThread([
    march('1', 'Morena de luz de luna', 'morena-de-luz-de-luna', '2026-09-27T22:09:44Z'),
  ], { now })

  assert.equal(thread.title, 'Morena de luz de luna')
  assert.equal(thread.metric, 'Nueva ficha publicada')
  assert.equal(thread.href, '/marchas/morena-de-luz-de-luna')
  assert.deepEqual(thread.path, ['Marcha', 'Autores', 'Crucetas'])
})

test('las publicaciones antiguas dejan de competir como novedad', () => {
  const thread = buildRecentMarchPublicationThread([
    march('old', 'Marcha antigua', 'marcha-antigua', '2026-09-24T12:00:00Z'),
  ], { now })

  assert.equal(thread, null)
})

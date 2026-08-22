import test from 'node:test'
import assert from 'node:assert/strict'

import {
  mergeFreeCompoundResponses,
  planFreeCompoundQuestion,
} from '../lib/tira-free-planner.js'

test('encadena una consulta y una repregunta en la misma frase', () => {
  const plan = planFreeCompoundQuestion(
    '¿Qué imágenes de La Cena son anteriores al siglo XX y quién hizo cada una?'
  )

  assert.deepEqual(plan?.queries, [
    '¿Qué imágenes de La Cena son anteriores al siglo XX',
    'quién hizo cada una?',
  ])
})

test('admite hasta tres pasos contextuales gratuitos', () => {
  const plan = planFreeCompoundQuestion(
    '¿Qué imágenes de La Cena son anteriores al siglo XX y quién hizo cada una y cuáles han sido restauradas?'
  )

  assert.equal(plan?.mode, 'sequential')
  assert.equal(plan?.queries.length, 3)
  assert.equal(plan?.queries[2], 'cuáles han sido restauradas?')
})

test('no rompe nombres unidos por y', () => {
  assert.equal(
    planFreeCompoundQuestion('Busca alguna conexión entre El Baratillo y La Cena'),
    null
  )
})

test('reconoce filtros y operaciones sobre el conjunto anterior', () => {
  assert.deepEqual(
    planFreeCompoundQuestion(
      '¿Qué bandas acompañan a hermandades de gloria en Cantillana y desde cuándo acompaña cada una?'
    )?.queries,
    [
      '¿Qué bandas acompañan a hermandades de gloria en Cantillana',
      'desde cuándo acompaña cada una?',
    ]
  )

  assert.deepEqual(
    planFreeCompoundQuestion(
      '¿Qué autores han trabajado en más de un paso y enséñame solo los orfebres?'
    )?.queries,
    [
      '¿Qué autores han trabajado en más de un paso',
      'enséñame solo los orfebres?',
    ]
  )
})

test('encadena autoría y dedicatoria de una marcha sin IA', () => {
  assert.deepEqual(
    planFreeCompoundQuestion(
      '¿Quién compuso Refúgiame y a quién está dedicada?'
    )?.queries,
    [
      '¿Quién compuso Refúgiame',
      'a quién está dedicada?',
    ]
  )

  assert.deepEqual(
    planFreeCompoundQuestion(
      '¿De qué año es Refúgiame y cuándo se estrenó?'
    )?.queries,
    [
      '¿De qué año es Refúgiame',
      'cuándo se estrenó?',
    ]
  )
})

test('fusiona la consulta compuesta manteniendo el contexto del último paso', () => {
  const first = {
    kind: 'answer',
    answer: 'He encontrado tres imágenes.',
    entities: [{ id: 'h1', name: 'La Cena', type: 'Hermandad' }],
    items: [{ label: 'Imagen A', meta: 'Siglo XVII', href: '/imagenes/a' }],
    references: [{ id: 'r1', name: 'Fuente', url: 'https://example.com' }],
    context: { resultSet: { entityType: 'image', entityIds: ['i1', 'i2', 'i3'] } },
  }
  const second = {
    kind: 'answer',
    answer: 'Estas son sus autorías documentadas.',
    items: [{ label: 'Imagen A', meta: 'Autor A', href: '/imagenes/a' }],
    followUps: ['¿Cuáles han sido restauradas?'],
    context: { resultSet: { entityType: 'image', entityIds: ['i1', 'i2', 'i3'] } },
  }
  const plan = {
    mode: 'sequential',
    queries: ['Primera', 'Segunda'],
  }

  const merged = mergeFreeCompoundResponses([first, second], plan)

  assert.equal(merged.kind, 'answer')
  assert.match(merged.answer, /He encontrado tres imágenes\./)
  assert.match(merged.answer, /Estas son sus autorías documentadas\./)
  assert.equal(merged.items[0].meta, 'Autor A')
  assert.equal(merged.context.resultSet.entityType, 'image')
  assert.equal(merged.freePlan.used, true)
  assert.equal(merged.freePlan.partial, false)
  assert.equal(merged.semantic, undefined)
})

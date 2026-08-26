import test from 'node:test'
import assert from 'node:assert/strict'

import {
  mergeGroundedResponses,
  sanitizeSemanticPlan,
  shouldUseSemanticLayer,
} from '../lib/tira-semantic.js'

test('activa la capa semántica para peticiones compuestas y explicativas', () => {
  assert.equal(
    shouldUseSemanticLayer('Explícame cómo ha cambiado la música del Baratillo y compárala con otra hermandad del Miércoles Santo'),
    true
  )
  assert.equal(shouldUseSemanticLayer('¿Quién compuso Refúgiame?'), false)
})

test('solo admite planes coherentes y acotados', () => {
  assert.deepEqual(
    sanitizeSemanticPlan({
      mode: 'multi',
      queries: ['Pregunta uno', 'Pregunta dos', 'Pregunta dos'],
      summary: 'Dos cruces',
    }),
    { mode: 'multi', queries: ['Pregunta uno', 'Pregunta dos'], summary: 'Dos cruces' }
  )

  assert.equal(
    sanitizeSemanticPlan({ mode: 'single', queries: ['Una', 'Dos'], summary: '' }),
    null
  )
})

test('fusiona varias respuestas grounded sin duplicar entidades ni referencias', () => {
  const first = {
    kind: 'answer',
    answer: 'Primera respuesta.',
    path: ['A'],
    entities: [{ id: '1', name: 'Entidad', type: 'Hermandad' }],
    items: [{ label: 'Elemento 1', meta: 'Dato', href: '/uno' }],
    references: [{ id: 'r1', name: 'Fuente 1', url: 'https://example.com/1' }],
    followUps: ['Pregunta A'],
  }
  const second = {
    kind: 'answer',
    answer: 'Segunda respuesta.',
    path: ['B'],
    entities: [{ id: '1', name: 'Entidad', type: 'Hermandad' }],
    items: [{ label: 'Elemento 2', meta: 'Otro dato', href: '/dos' }],
    references: [{ id: 'r1', name: 'Fuente 1', url: 'https://example.com/1' }],
    followUps: ['Pregunta B'],
  }

  const merged = mergeGroundedResponses(
    [first, second],
    { answer: 'Síntesis verificada.', follow_ups: ['Sigue tirando del hilo'] },
    { model: 'test-model', planMode: 'multi' }
  )

  assert.equal(merged.answer, 'Síntesis verificada.')
  assert.equal(merged.entities.length, 1)
  assert.equal(merged.references.length, 1)
  assert.equal(merged.items.length, 2)
  assert.equal(merged.semantic.grounded, true)
  assert.equal(merged.semantic.sourceCount, 2)
})

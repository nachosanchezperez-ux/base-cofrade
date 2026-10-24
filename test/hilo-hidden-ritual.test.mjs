import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  HILO_HIDDEN_WORDS,
  getHiddenChallenge,
  hiddenStreakLine,
  makeHiddenProgress,
  normalizeHiddenAnswer,
} from '../lib/hilo-hidden-game.js'
import { hiddenShareData } from '../lib/hilo-hidden-share.js'
import { hiddenThreadRule, hiddenThreadSectionsFor, pickHiddenThread } from '../lib/hilo-hidden-threads.js'

// «El juego como ritual»: racha visible y compartible, y una ficha real al resolver.

const steps = [
  { href: '/pasos/palio-a', name: 'Paso de palio de la Virgen A', type: 'Paso de palio', context: 'Hermandad A · Sevilla capital', hasMedia: true },
  { href: '/pasos/palio-b', name: 'Paso de palio de la Virgen B', type: 'Paso de palio', context: 'Hermandad B', hasMedia: false },
  { href: '/pasos/misterio-c', name: 'Paso de misterio C', type: 'Paso de misterio', context: 'Hermandad C', hasMedia: true },
]

test('cada palabra con regla apunta a una sección que el juego sabe cargar', () => {
  const sections = new Set(['pasos', 'imagenes', 'hermandades', 'bandas'])
  const withRule = HILO_HIDDEN_WORDS.filter((word) => hiddenThreadRule(word.answer))
  assert.ok(withRule.length >= 40, 'la mayoría de palabras deben llevar a una ficha real')
  for (const word of withRule) assert.ok(sections.has(hiddenThreadRule(word.answer).section), word.answer)
})

test('las palabras del palio solo eligen pasos de palio', () => {
  for (let day = 10; day <= 30; day++) {
    const thread = pickHiddenThread({ answer: 'PALIO', dayKey: '2026-10-' + day, items: steps })
    assert.match(thread.href, /^\/pasos\/palio-/)
    assert.equal(thread.section, 'pasos')
  }
  const canastilla = pickHiddenThread({ answer: 'CANASTILLA', dayKey: '2026-10-18', items: steps })
  assert.equal(canastilla.href, '/pasos/misterio-c')
})

test('la ficha elegida es la misma para todos el mismo día y no depende del orden recibido', () => {
  const a = pickHiddenThread({ answer: 'CAPATAZ', dayKey: '2026-10-18', items: steps })
  const b = pickHiddenThread({ answer: 'CAPATAZ', dayKey: '2026-10-18', items: [...steps].reverse() })
  assert.deepEqual(a, b)
  assert.ok(a.name && a.label)
})

test('sin candidatos o sin regla no se inventa ninguna ficha', () => {
  assert.equal(pickHiddenThread({ answer: 'PALIO', dayKey: '2026-10-18', items: [] }), null)
  assert.equal(pickHiddenThread({ answer: 'SAETA', dayKey: '2026-10-18', items: steps }), null)
  assert.equal(pickHiddenThread({ answer: 'CRUCETA', dayKey: '2026-10-18', items: steps }), null)
})

test('las hermandades se filtran por tipo y las bandas por formación', () => {
  const brotherhoods = [
    { href: '/hermandades/gloria-x', name: 'Gloria X', tipos: ['Gloria'] },
    { href: '/hermandades/penitencia-y', name: 'Penitencia Y', tipos: ['Penitencia', 'Sacramental'] },
  ]
  assert.equal(pickHiddenThread({ answer: 'CAPIROTE', dayKey: '2026-10-18', items: brotherhoods }).href, '/hermandades/penitencia-y')
  assert.equal(pickHiddenThread({ answer: 'SIMPECADO', dayKey: '2026-10-18', items: brotherhoods }).href, '/hermandades/gloria-x')
  const bands = [
    { href: '/bandas/musica', name: 'Banda de música', type: 'Banda de Música' },
    { href: '/bandas/cct', name: 'Cornetas', type: 'Cornetas y Tambores' },
  ]
  assert.equal(pickHiddenThread({ answer: 'CORNETA', dayKey: '2026-10-18', items: bands }).href, '/bandas/cct')
})

test('solo se cargan las secciones de las palabras del día', () => {
  const answers = [
    ...getHiddenChallenge('2026-10-18', 'daily').words,
    ...getHiddenChallenge('2026-10-18', 'expert').words,
  ].map((word) => word.answer)
  const sections = hiddenThreadSectionsFor(answers)
  assert.ok(sections.length >= 1 && sections.length <= 4)
  assert.deepEqual(hiddenThreadSectionsFor(['TRABAJADERA']), ['pasos'])
})

test('la racha se comparte desde dos días, solo en el hilo del día y sin revelar la palabra', () => {
  assert.equal(hiddenStreakLine(1), '')
  assert.equal(hiddenStreakLine(3), 'Racha: 3 días seguidos')
  assert.equal(hiddenStreakLine(3, 'expert'), '')

  const challenge = getHiddenChallenge('2026-10-18', 'daily')
  const progress = makeHiddenProgress(challenge)
  progress.rounds[0] = { status: 'won', guesses: [normalizeHiddenAnswer(challenge.words[0].answer)], hints: [] }
  progress.finished = true
  const withStreak = hiddenShareData(challenge, progress, { streak: 5 })
  assert.equal(withStreak.streak, 5)
  assert.ok(withStreak.text.includes('Racha: 5 días seguidos'))
  assert.ok(withStreak.tweet.includes('Racha: 5 días seguidos'))
  assert.ok(!withStreak.text.toUpperCase().includes(challenge.words[0].answer))

  const firstDay = hiddenShareData(challenge, progress, { streak: 1 })
  assert.equal(firstDay.streak, 0)
  assert.ok(!firstDay.text.includes('Racha'))
})

test('el tablero muestra la racha y la solución enlaza la ficha del día', () => {
  const game = readFileSync(new URL('../components/HiddenThreadGame.js', import.meta.url), 'utf8')
  assert.match(game, /styles\.streak/)
  assert.match(game, /styles\.threadCard/)
  // La ficha del servidor solo vale para su día; si cambia sin recargar, queda el listado general.
  assert.match(game, /challenge\?\.dateKey === initialDayKey/)
  assert.match(game, /hiddenShareData\(challenge, progress, \{ streak: isArchive \? 0 : streak \}\)/)
})

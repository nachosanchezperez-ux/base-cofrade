import test from 'node:test'
import assert from 'node:assert/strict'
import { HILO_HIDDEN_CHAINS } from '../lib/hilo-hidden-game-data.js'
import {
  getHiddenChallenge,
  HILO_HIDDEN_WORDS,
  HILO_GAME_MAX_ERRORS,
  hiddenDaySerial,
  hiddenPriorDayKey,
  hiddenRoundScore,
  hiddenShareText,
  hiddenTotalScore,
  hiddenWordBankAudit,
  madridHiddenDayKey,
  makeHiddenProgress,
  normalizeHiddenAnswer,
  validHiddenProgress,
} from '../lib/hilo-hidden-game.js'

test('el banco editorial tiene suficientes términos únicos y tres pistas por palabra', () => {
  assert.ok(HILO_HIDDEN_WORDS.length >= 40)
  const normalized = HILO_HIDDEN_WORDS.map((word) => normalizeHiddenAnswer(word.answer))
  assert.equal(new Set(normalized).size, normalized.length)
  for (const word of HILO_HIDDEN_WORDS) {
    assert.ok(normalizeHiddenAnswer(word.answer).length >= 4)
    assert.ok(word.category && word.clue && word.definition)
    assert.equal(word.hints.length, 3)
    assert.ok(word.hints.every((hint) => hint.title && hint.text))
    assert.ok(word.link.href.startsWith('/'))
    assert.ok(word.link.text)
  }
  assert.ok(hiddenWordBankAudit())
  assert.ok(HILO_HIDDEN_CHAINS.length >= 8)
})

test('se aceptan tildes y se preserva la Ñ', () => {
  assert.equal(normalizeHiddenAnswer(' chicotá '), 'CHICOTA')
  assert.equal(normalizeHiddenAnswer('Igualá'), 'IGUALA')
  assert.equal(normalizeHiddenAnswer('pañuelo'), 'PAÑUELO')
  assert.equal(normalizeHiddenAnswer('traba-jadera'), 'TRABAJADERA')
  assert.equal(normalizeHiddenAnswer(''), '')
})

test('el día cofrade cambia a medianoche en Madrid, no en UTC', () => {
  assert.equal(madridHiddenDayKey(new Date('2026-10-12T21:59:59.000Z')), '2026-10-12')
  assert.equal(madridHiddenDayKey(new Date('2026-10-12T22:00:00.000Z')), '2026-10-13')
  assert.equal(madridHiddenDayKey(new Date('2026-12-31T23:15:00.000Z')), '2027-01-01')
})

test('la rotación del reto diario es determinista y estable entre días', () => {
  const first = getHiddenChallenge('2026-10-12', 'daily')
  const same = getHiddenChallenge('2026-10-12', 'daily')
  const next = getHiddenChallenge('2026-10-13', 'daily')
  assert.equal(first.id, same.id)
  assert.equal(first.words[0].answer, same.words[0].answer)
  assert.notEqual(first.words[0].answer, next.words[0].answer)
  assert.equal(first.words.length, 1)
  assert.equal(hiddenDaySerial('2026-10-12'), 0)
  assert.equal(hiddenPriorDayKey('2026-01-01'), '2025-12-31')
})

test('fechas y modos inválidos no se aceptan', () => {
  assert.throws(() => getHiddenChallenge('2026-02-31'), RangeError)
  assert.throws(() => getHiddenChallenge('2026-10-12', 'desconocido'), RangeError)
  assert.throws(() => hiddenDaySerial('hoy'), RangeError)
})

test('el reto experto tiene tres términos relacionados válidos', () => {
  for (let index = 0; index < HILO_HIDDEN_CHAINS.length; index++) {
    const date = new Date(Date.UTC(2026, 9, 12 + index)).toISOString().slice(0, 10)
    const expert = getHiddenChallenge(date, 'expert')
    assert.equal(expert.words.length, 3)
    assert.equal(new Set(expert.words.map((word) => word.answer)).size, 3)
    assert.ok(expert.connection)
    assert.ok(expert.words.every((word) => word && word.definition))
  }
})

test('la partida empieza sin datos y las partidas de otros días no se reutilizan', () => {
  const challenge = getHiddenChallenge('2026-10-12')
  const fresh = makeHiddenProgress(challenge)
  assert.equal(fresh.finished, false)
  assert.equal(fresh.stage, 0)
  assert.equal(fresh.rounds[0].status, 'playing')
  assert.equal(validHiddenProgress(fresh, challenge), true)
  assert.equal(validHiddenProgress(fresh, getHiddenChallenge('2026-10-13')), false)
  assert.equal(validHiddenProgress({ ...fresh, stage: 99 }, challenge), false)
})

test('la puntuación penaliza pistas y errores, nunca una palabra no acertada', () => {
  assert.equal(hiddenRoundScore({ status: 'won', guesses: ['LLAMADOR'], hints: [] }), 100)
  assert.equal(hiddenRoundScore({ status: 'won', guesses: ['CAMPANAS', 'LLAMADOR'], hints: [1] }), 67)
  assert.equal(hiddenRoundScore({ status: 'lost', guesses: ['CAMPANAS'], hints: [0, 1, 2] }), 0)
  assert.equal(hiddenRoundScore({ status: 'won', guesses: ['X', 'Y', 'Z', 'W'], hints: [0, 1, 2] }), 10)
  const game = getHiddenChallenge('2026-10-12')
  const progress = makeHiddenProgress(game)
  progress.rounds[0] = { status: 'won', guesses: [normalizeHiddenAnswer(game.words[0].answer)], hints: [] }
  progress.finished = true
  assert.equal(hiddenTotalScore(progress), 100)
  assert.ok(hiddenShareText(game, progress).includes('100/100 puntos'))
  assert.ok(!hiddenShareText(game, progress).includes(game.words[0].answer))
  assert.equal(hiddenShareText(game, { ...progress, finished: false }), '')
  assert.equal(HILO_GAME_MAX_ERRORS, 4)
})

test('no se permite completar una partida con cabos pendientes', () => {
  const expert = getHiddenChallenge('2026-10-12', 'expert')
  const progress = makeHiddenProgress(expert)
  progress.finished = true
  assert.equal(validHiddenProgress(progress, expert), false)
  progress.stage = 2
  assert.equal(validHiddenProgress(progress, expert), false)
})

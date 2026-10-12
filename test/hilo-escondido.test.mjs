import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DAILY_PUZZLES, EXPERT_PUZZLES, MAX_ATTEMPTS, getMadridDayKey,
  normalizeAnswer, puzzleForDay, roundScore, shareResult,
} from '../lib/hilo-escondido.js'

test('el banco contiene palabras únicas, pistas completas y enlaces internos', () => {
  const entries = [...DAILY_PUZZLES, ...EXPERT_PUZZLES]
  assert.ok(DAILY_PUZZLES.length >= 14)
  assert.equal(EXPERT_PUZZLES.length, 3)
  assert.equal(new Set(entries.map((entry) => normalizeAnswer(entry.answer))).size, entries.length)
  for (const entry of entries) {
    assert.ok(entry.id && entry.riddle.length >= 35)
    assert.equal(entry.hints.length, 3)
    assert.ok(entry.definition.length >= 65)
    assert.match(entry.related.href, /^\/(pasos|hermandades|imagenes|igualas-y-ensayos|procesiones-de-gloria)$/)
    assert.match(normalizeAnswer(entry.answer), /^[A-ZÑ]{4,15}$/)
    assert.ok(entry.hints.every((hint) => hint.label && hint.text.length >= 20))
  }
})

test('la palabra cambia con el día de Madrid y no con el huso local del jugador', () => {
  assert.equal(getMadridDayKey(new Date('2026-10-11T21:30:00Z')), '2026-10-11')
  assert.equal(getMadridDayKey(new Date('2026-10-11T22:30:00Z')), '2026-10-12')
  assert.equal(getMadridDayKey(new Date('2026-10-12T22:30:00Z')), '2026-10-13')
  assert.equal(puzzleForDay('2026-10-12').id, 'llamador')
  assert.equal(puzzleForDay('2026-10-13').id, 'peana')
  assert.equal(puzzleForDay('fecha-no-valida').id, 'llamador')
})

test('acepta mayúsculas y tildes, sin desdibujar la eñe', () => {
  assert.equal(normalizeAnswer('  chicotá  '), 'CHICOTA')
  assert.equal(normalizeAnswer('candelería'), 'CANDELERIA')
  assert.equal(normalizeAnswer('caña'), 'CAÑA')
  assert.notEqual(normalizeAnswer('caña'), normalizeAnswer('cana'))
})

test('la puntuación recompensa resolver con pocas pistas', () => {
  assert.equal(MAX_ATTEMPTS, 4)
  assert.equal(roundScore(['LLAMADOR'], [], true), 100)
  assert.equal(roundScore(['OTRA', 'LLAMADOR'], [1], true), 70)
  assert.equal(roundScore(['OTRA'], [0, 1], false), 0)
})

test('el mensaje compartido nunca contiene la solución', () => {
  const text = shareResult({ mode: 'daily', dayKey: '2026-10-12', guesses: ['LLAMADOR'], revealed: [], solved: true })
  assert.match(text, /100\/100/)
  assert.match(text, /hilocofrade\.es\/juegos\/el-hilo-escondido/)
  assert.doesNotMatch(text, /LLAMADOR/)
})

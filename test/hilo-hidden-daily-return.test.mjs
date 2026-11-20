import test from 'node:test'
import assert from 'node:assert/strict'
import { getHiddenChallenge, makeHiddenProgress, evaluateHiddenGuess, nextHiddenStreak, hiddenEffectiveStreak, madridHiddenDayKey, millisecondsUntilMadridMidnight, minutesUntilMadridMidnight, hiddenShareText, normalizeHiddenAnswer } from '../lib/hilo-hidden-game.js'
import { hiddenPlayerStats } from '../lib/hilo-hidden-archive.js'
import { hiddenGameCompleteParams } from '../lib/hilo-hidden-analytics.js'

function finish(mode, won) {
  const challenge = getHiddenChallenge('2026-11-07', mode)
  const progress = makeHiddenProgress(challenge)
  for (let i = 0; i < challenge.words.length; i++) {
    const word = challenge.words[i]
    let round = progress.rounds[i]
    round.hints = [0]
    const guesses = won ? [word.answer] : ['X', 'Y', 'Z'].map(letter => letter.repeat(normalizeHiddenAnswer(word.answer).length))
    for (const value of guesses) round = evaluateHiddenGuess({ word, round, value, isChoice: mode === 'daily' }).nextRound
    progress.rounds[i] = round
  }
  progress.stage = challenge.words.length - 1
  progress.finished = true
  return { challenge, progress }
}

for (const mode of ['daily', 'expert']) {
  for (const won of [true, false]) test(`${mode}: ${won ? 'acierto' : 'fallo'}, intentos, pistas y compartir sin soluciones`, () => {
    const { challenge, progress } = finish(mode, won)
    assert.ok(progress.rounds.every(r => r.status === (won ? 'won' : 'lost')))
    const params = hiddenGameCompleteParams({ challenge, progress, todayKey: challenge.dateKey })
    assert.equal(params.resultado, won ? 'acierto' : 'fallo')
    assert.equal(params.intentos, challenge.words.length * (won ? 1 : 3))
    assert.equal(params.pistas, challenge.words.length)
    const text = hiddenShareText(challenge, progress, 2)
    assert.match(text, /#27/)
    assert.ok(text.includes(won ? '🧵 1/3' : '🪢 X/3'))
    assert.match(text, /Racha diaria: 2 días/)
    for (const word of challenge.words) assert.ok(!text.toUpperCase().includes(word.answer))
  })
}

test('tres días consecutivos, recarga sin duplicar, día saltado y derrota conservan la máxima', () => {
  let streak = { date: '', count: 0, best: 0 }
  for (const [index, day] of ['2026-11-05', '2026-11-06', '2026-11-07'].entries()) {
    streak = nextHiddenStreak(streak, day, true)
    assert.equal(streak.count, index + 1)
    assert.deepEqual(nextHiddenStreak(streak, day, true), streak)
  }
  assert.equal(hiddenEffectiveStreak(streak, '2026-11-08'), 3)
  assert.equal(hiddenEffectiveStreak(streak, '2026-11-09'), 0)
  streak = nextHiddenStreak(streak, '2026-11-09', true)
  assert.deepEqual(streak, { date: '2026-11-09', count: 1, best: 3 })
  assert.deepEqual(nextHiddenStreak(streak, '2026-11-10', false), { date: '2026-11-10', count: 0, best: 3 })
})

test('estadísticas separan modalidades y distribuyen palabras acertadas, no derrotas', () => {
  const records = [finish('daily', true), finish('expert', true), finish('daily', false), finish('expert', false)]
  const stats = hiddenPlayerStats({ records, todayKey: '2026-11-07' })
  assert.equal(stats.played, 4)
  assert.equal(stats.winRate, 50)
  assert.deepEqual(stats.distribution, { daily: [1, 0, 0], expert: [3, 0, 0] })
})

test('medianoche Madrid: un milisegundo antes/después, verano, invierno y ambos cambios de hora', () => {
  for (const midnight of ['2026-11-07T23:00:00Z', '2026-07-07T22:00:00Z', '2026-03-29T22:00:00Z', '2026-10-25T23:00:00Z']) {
    const stamp = Date.parse(midnight)
    const before = new Date(stamp - 1)
    assert.equal(millisecondsUntilMadridMidnight(before), 1)
    assert.notEqual(madridHiddenDayKey(before), madridHiddenDayKey(new Date(stamp)))
  }
  assert.equal(minutesUntilMadridMidnight(new Date('2026-03-28T23:00:00Z')), 23 * 60)
  assert.equal(minutesUntilMadridMidnight(new Date('2026-10-24T22:00:00Z')), 25 * 60)
  assert.equal(minutesUntilMadridMidnight(new Date('2026-11-07T19:48:00Z')), 192)
})

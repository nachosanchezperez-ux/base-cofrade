import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  hiddenArchiveDays,
  hiddenNextChallenge,
  hiddenPlayerStats,
  hiddenRoundMark,
} from '../lib/hilo-hidden-archive.js'

// Retener al jugador: archivo de días pasados, siguiente partida y números propios.

test('el archivo solo ofrece días pasados desde el primer reto, del más reciente al más antiguo', () => {
  const days = hiddenArchiveDays('2026-10-25')
  assert.equal(days.length, 13)
  assert.equal(days[0], '2026-10-24')
  assert.equal(days.at(-1), '2026-10-12')
  assert.ok(!days.includes('2026-10-25'), 'hoy no está en el archivo')
  assert.ok(days.every((day) => day < '2026-10-25'), 'nunca un día futuro')
  assert.deepEqual(hiddenArchiveDays('2026-10-12'), [])
  assert.deepEqual(hiddenArchiveDays('fecha-rota'), [])
})

test('al terminar se ofrece primero lo de hoy y después el archivo, sin repetir la partida actual', () => {
  const done = new Set()
  const isFinished = (day, mode) => done.has(mode + ':' + day)
  assert.deepEqual(hiddenNextChallenge({ todayKey: '2026-10-25', isFinished }), { dayKey: '2026-10-25', mode: 'daily' })

  done.add('daily:2026-10-25')
  assert.deepEqual(
    hiddenNextChallenge({ todayKey: '2026-10-25', isFinished, current: { dayKey: '2026-10-25', mode: 'daily' } }),
    { dayKey: '2026-10-25', mode: 'expert' }
  )

  done.add('expert:2026-10-25')
  assert.deepEqual(hiddenNextChallenge({ todayKey: '2026-10-25', isFinished }), { dayKey: '2026-10-24', mode: 'daily' })

  for (const day of ['2026-10-25', ...hiddenArchiveDays('2026-10-25')]) {
    done.add('daily:' + day)
    done.add('expert:' + day)
  }
  assert.equal(hiddenNextChallenge({ todayKey: '2026-10-25', isFinished }), null)
})

test('los números cuentan retos, aciertos por palabra, perfectas y la mejor racha', () => {
  const won = { status: 'won', guesses: ['X'], hints: [] }
  const wonWithHint = { status: 'won', guesses: ['X'], hints: [0] }
  const lost = { status: 'lost', guesses: ['A', 'B', 'C'], hints: [] }
  const stats = hiddenPlayerStats({
    todayKey: '2026-10-25',
    streak: { count: 2, best: 5 },
    records: [
      { progress: { rounds: [won] } },
      { progress: { rounds: [wonWithHint, lost, won] } },
    ],
  })
  assert.equal(stats.played, 2)
  assert.equal(stats.available, 28)
  assert.equal(stats.words, 4)
  assert.equal(stats.wonWords, 3)
  assert.equal(stats.winRate, 75)
  assert.equal(stats.perfect, 2)
  assert.equal(stats.currentStreak, 2)
  assert.equal(stats.bestStreak, 5)
  assert.equal(hiddenPlayerStats({ todayKey: '2026-10-25', streak: { count: 7 } }).bestStreak, 7)
  assert.equal(hiddenPlayerStats({ todayKey: '2026-10-25' }).winRate, 0)
  assert.equal(hiddenRoundMark(won), '✦')
  assert.equal(hiddenRoundMark(wonWithHint), '✓')
  assert.equal(hiddenRoundMark(lost), '✕')
})

test('el archivo no toca la racha ni la comparte', () => {
  const game = readFileSync(new URL('../components/HiddenThreadGame.js', import.meta.url), 'utf8')
  assert.match(game, /if \(mode !== 'daily' \|\| isArchive \|\| !progress\?\.finished/)
  assert.match(game, /hiddenShareData\(challenge, progress, \{ streak: isArchive \? 0 : streak \}\)/)
  assert.match(game, /isDaily && !isArchive && streak > 0/)
  assert.match(game, /no cuenta para la racha/)
  // La mejor racha se conserva al escribir la racha del día.
  assert.match(game, /best: Math\.max\(previous\.best, count\)/)
})

test('al terminar hay siempre una siguiente partida o un cierre claro', () => {
  const game = readFileSync(new URL('../components/HiddenThreadGame.js', import.meta.url), 'utf8')
  assert.match(game, /hiddenNextChallenge\(/)
  assert.match(game, /'Siguiente: ' \+ MODE_LABEL\[nextChallenge\.mode\]/)
  assert.match(game, /Has desenredado todos los hilos publicados/)
  assert.match(game, /Retos anteriores/)
  assert.match(game, /Tus números/)
})

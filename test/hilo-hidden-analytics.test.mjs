import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { getHiddenChallenge, makeHiddenProgress, normalizeHiddenAnswer } from '../lib/hilo-hidden-game.js'
import { hiddenGameCompleteParams, hiddenGameContext, hiddenShareParams } from '../lib/hilo-hidden-analytics.js'

// Medición de El hilo escondido: datos de juego, nunca la palabra.

test('el contexto distingue hoy y archivo, y la modalidad', () => {
  assert.deepEqual(hiddenGameContext({ mode: 'daily', dayKey: '2026-10-25', todayKey: '2026-10-25' }), {
    game_mode: 'hilo_del_dia', game_origin: 'hoy', game_day: '2026-10-25', days_ago: 0,
  })
  const archive = hiddenGameContext({ mode: 'expert', dayKey: '2026-10-20', todayKey: '2026-10-25' })
  assert.equal(archive.game_mode, 'ultima_chicota')
  assert.equal(archive.game_origin, 'archivo')
  assert.equal(archive.days_ago, 5)
})

test('la partida terminada resume el resultado sin la palabra', () => {
  const challenge = getHiddenChallenge('2026-10-25', 'daily')
  const progress = makeHiddenProgress(challenge)
  progress.rounds[0] = { status: 'won', guesses: ['XXXXXX', normalizeHiddenAnswer(challenge.words[0].answer)], hints: [0] }
  progress.finished = true
  const params = hiddenGameCompleteParams({ challenge, progress, todayKey: '2026-10-25', streak: 3 })
  assert.equal(params.game_result, 'acertado')
  assert.equal(params.words_won, 1)
  assert.equal(params.hints_used, 1)
  assert.equal(params.perfect, false)
  assert.equal(params.streak, 3)
  assert.equal(params.max_score, 100)
  assert.ok(params.score > 0 && params.score < 100)
  const serialized = JSON.stringify(params).toUpperCase()
  assert.ok(!serialized.includes(challenge.words[0].answer), 'nunca se envía la palabra')
})

test('la última chicotá parcial y las partidas del archivo no llevan racha', () => {
  const challenge = getHiddenChallenge('2026-10-20', 'expert')
  const progress = makeHiddenProgress(challenge)
  progress.rounds = challenge.words.map((word, i) => (i === 1
    ? { status: 'lost', guesses: ['A', 'B', 'C'], hints: [] }
    : { status: 'won', guesses: [normalizeHiddenAnswer(word.answer)], hints: [] }))
  progress.stage = 2
  progress.finished = true
  const params = hiddenGameCompleteParams({ challenge, progress, todayKey: '2026-10-25', streak: 9 })
  assert.equal(params.game_result, 'parcial')
  assert.equal(params.words_total, 3)
  assert.equal('streak' in params, false)
  for (const word of challenge.words) assert.ok(!JSON.stringify(params).toUpperCase().includes(word.answer))
})

test('compartir reutiliza el evento común con el método y el contexto del juego', () => {
  const params = hiddenShareParams({ method: 'instagram', mode: 'daily', dayKey: '2026-10-25', todayKey: '2026-10-25' })
  assert.equal(params.share_method, 'instagram')
  assert.equal(params.content_type, 'juego')
  assert.equal(params.item_name, 'El hilo escondido')
  assert.equal(params.game_origin, 'hoy')
})

test('el juego mide terminar, abrir, pistas y compartir mediante trackEvent (con consentimiento)', () => {
  const game = readFileSync(new URL('../components/HiddenThreadGame.js', import.meta.url), 'utf8')
  assert.match(game, /import \{ trackEvent \} from '@\/lib\/analytics\/client'/)
  for (const name of ['game_complete', 'game_open', 'game_hint', 'content_share']) {
    assert.match(game, new RegExp("trackEvent\\('" + name + "'"))
  }
  for (const source of ['siguiente', 'archivo', 'volver_hoy']) {
    assert.match(game, new RegExp("'" + source + "'\\)"))
  }
  // No hay otra vía de envío que salte el consentimiento.
  assert.doesNotMatch(game, /gtag\(|dataLayer|window\.va\(/)
  assert.match(game, /data-analytics-context="juego_sigue_el_hilo"/)
})

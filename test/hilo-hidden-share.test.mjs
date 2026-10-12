import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  getHiddenChallenge,
  makeHiddenProgress,
  normalizeHiddenAnswer,
} from '../lib/hilo-hidden-game.js'
import {
  HILO_SHARE_URL,
  hiddenInviteText,
  hiddenShareData,
  hiddenShareSocialLinks,
  hiddenStoryFilename,
} from '../lib/hilo-hidden-share.js'

test('el resultado para redes omite la palabra y conserva el vínculo a la única URL del juego', () => {
  const challenge = getHiddenChallenge('2026-10-12', 'daily')
  const progress = makeHiddenProgress(challenge)
  assert.equal(hiddenShareData(challenge, progress), null)
  progress.rounds[0] = {
    status: 'won',
    guesses: [normalizeHiddenAnswer(challenge.words[0].answer)],
    hints: [0],
  }
  progress.finished = true
  const card = hiddenShareData(challenge, progress)
  assert.equal(card.url, HILO_SHARE_URL)
  assert.equal(card.score, 85)
  assert.equal(card.maxScore, 100)
  assert.equal(card.rounds, 1)
  assert.equal(card.winners, 1)
  assert.equal(card.marks, '✓')
  assert.equal(card.mode, 'El hilo del día')
  assert.equal(card.date, '12/10/2026')
  for (const value of [card.text, card.tweet, card.marks]) {
    assert.ok(!value.toUpperCase().includes(normalizeHiddenAnswer(challenge.words[0].answer)))
  }
})

test('WhatsApp y X reciben el marcador sin soluciones', () => {
  const challenge = getHiddenChallenge('2026-10-12', 'expert')
  const progress = makeHiddenProgress(challenge)
  progress.rounds = challenge.words.map((word, i) => ({
    status: i === 2 ? 'lost' : 'won',
    guesses: i === 2
      ? ['A', 'B', 'C']
      : [normalizeHiddenAnswer(word.answer)],
    hints: [],
  }))
  progress.stage = 2
  progress.finished = true
  const data = hiddenShareData(challenge, progress)
  assert.equal(data.winners, 2)
  assert.equal(data.rounds, 3)
  assert.equal(data.marks, '✦  ✦  ✕')
  assert.equal(data.mode, 'La última chicotá')
  const links = hiddenShareSocialLinks(data)
  assert.ok(links.whatsapp.startsWith('https://wa.me/?text='))
  assert.ok(links.x.startsWith('https://twitter.com/intent/tweet?text='))
  assert.ok(decodeURIComponent(links.whatsapp.split('text=')[1]).includes(HILO_SHARE_URL))
  assert.ok(decodeURIComponent(links.x.split('text=')[1]).includes('200/300'))
  for (const word of challenge.words) {
    for (const value of [data.text, data.tweet, links.whatsapp, links.x]) {
      assert.ok(!value.toUpperCase().includes(normalizeHiddenAnswer(word.answer)))
    }
  }
})

test('no se ofrecen controles sociales para partidas inacabadas ni cruzadas', () => {
  const challenge = getHiddenChallenge('2026-10-12', 'daily')
  const next = getHiddenChallenge('2026-10-13', 'daily')
  const progress = makeHiddenProgress(challenge)
  progress.finished = true
  assert.equal(hiddenShareData(next, progress), null)
  assert.equal(hiddenShareSocialLinks(null), null)
  assert.equal(hiddenShareData(null, progress), null)
})

test('la tarjeta de historias usa formato 9:16 y un nombre reconocible por reto', () => {
  const challenge = getHiddenChallenge('2026-10-12', 'daily')
  const expert = getHiddenChallenge('2026-10-12', 'expert')
  assert.equal(hiddenStoryFilename(challenge), 'hilo-escondido-2026-10-12-reto-diario.png')
  assert.equal(hiddenStoryFilename(expert), 'hilo-escondido-2026-10-12-ultima-chicota.png')
  const source = readFileSync(new URL('../lib/hilo-hidden-share-card.js', import.meta.url), 'utf8')
  assert.match(source, /HILO_STORY_WIDTH = 1080/)
  assert.match(source, /HILO_STORY_HEIGHT = 1920/)
  assert.match(source, /new File\(\[bytes\], filename, \{ type: 'image\/png' \}\)/)
  assert.match(source, /saveHiddenStoryFile/)
  assert.doesNotMatch(source, /word\.answer/)
})


test('la invitación a jugar existe incluso sin haber completado la partida', () => {
  const text=hiddenInviteText()
  assert.ok(text.includes('¿Sabes desenredar el hilo de hoy?'))
  assert.ok(text.includes(HILO_SHARE_URL))
  for (const answer of ['LLAMADOR','PALIO','COSTAL']) {
    assert.ok(!text.includes(answer),'La invitación no debe revelar palabras')
  }
})

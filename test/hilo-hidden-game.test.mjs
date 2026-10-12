import test from 'node:test'
import assert from 'node:assert/strict'
import { HILO_HIDDEN_CHAINS } from '../lib/hilo-hidden-game-data.js'
import {
  getHiddenChallenge,
  getHiddenChoiceOptions,
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

// ── Revisión integral (12/10): rotación, sinónimos, rachas y contenido ──
import {
  HILO_HIDDEN_DAILY_ORDER,
  HILO_HIDDEN_EXPERT_SCHEDULE,
  hiddenEffectiveStreak,
  hiddenGuessMatches,
  minutesUntilMadridMidnight,
} from '../lib/hilo-hidden-game.js'

function dayKeyFrom(offset) {
  return new Date(Date.UTC(2026, 9, 12 + offset)).toISOString().slice(0, 10)
}

test('el reto diario no repite palabra en todo el ciclo ni encadena dos días del mismo ámbito', () => {
  assert.equal(HILO_HIDDEN_DAILY_ORDER.length, HILO_HIDDEN_WORDS.length)
  const seen = new Set()
  let previous = null
  for (let day = 0; day < HILO_HIDDEN_WORDS.length; day++) {
    const word = getHiddenChallenge(dayKeyFrom(day)).words[0]
    assert.ok(!seen.has(word.answer), 'repetida antes de cerrar el ciclo: ' + word.answer)
    seen.add(word.answer)
    if (previous) assert.notEqual(word.category, previous.category, dayKeyFrom(day))
    previous = word
  }
  // También al cerrar un ciclo y empezar el siguiente.
  assert.notEqual(HILO_HIDDEN_DAILY_ORDER.at(-1).category, HILO_HIDDEN_DAILY_ORDER[0].category)
})

test('la última chicotá no destripa el reto diario cercano ni repite cadena en días próximos', () => {
  const lastSeen = new Map()
  for (let day = 0; day < 365; day++) {
    const expert = getHiddenChallenge(dayKeyFrom(day), 'expert')
    const answers = new Set(expert.words.map((word) => word.answer))
    for (let offset = -5; offset <= 5; offset++) {
      const daily = getHiddenChallenge(dayKeyFrom(day + offset)).words[0]
      assert.ok(!answers.has(daily.answer), dayKeyFrom(day) + ' revela ' + daily.answer)
    }
    const chainId = expert.id.slice(('expert-' + dayKeyFrom(day) + '-').length)
    if (lastSeen.has(chainId)) assert.ok(day - lastSeen.get(chainId) >= 6, chainId + ' se repite demasiado pronto')
    lastSeen.set(chainId, day)
  }
  assert.equal(new Set(HILO_HIDDEN_EXPERT_SCHEDULE.map((chain) => chain.id)).size, HILO_HIDDEN_CHAINS.length)
})

test('las cadenas expertas son únicas y solo usan términos del banco', () => {
  assert.equal(new Set(HILO_HIDDEN_CHAINS.map((chain) => chain.id)).size, HILO_HIDDEN_CHAINS.length)
  const signatures = HILO_HIDDEN_CHAINS.map((chain) => chain.answers.map(normalizeHiddenAnswer).sort().join('|'))
  assert.equal(new Set(signatures).size, signatures.length)
  for (const chain of HILO_HIDDEN_CHAINS) {
    assert.equal(chain.answers.length, 3)
    assert.ok(chain.title && chain.connection)
  }
  assert.ok(hiddenWordBankAudit())
})

test('ninguna adivinanza ni pista contiene la propia respuesta', () => {
  for (const word of HILO_HIDDEN_WORDS) {
    const target = normalizeHiddenAnswer(word.answer)
    for (const text of [word.clue, ...word.hints.map((hint) => hint.text)]) {
      const tokens = text.split(/[^\p{L}]+/u).map(normalizeHiddenAnswer)
      assert.ok(!tokens.includes(target), word.answer + ' aparece en: ' + text)
    }
  }
})

test('se aceptan los sinónimos documentados y no chocan con otras respuestas', () => {
  const answers = new Set(HILO_HIDDEN_WORDS.map((word) => normalizeHiddenAnswer(word.answer)))
  for (const word of HILO_HIDDEN_WORDS) {
    for (const option of word.accepted) assert.ok(!answers.has(normalizeHiddenAnswer(option)), option)
  }
  const llamador = HILO_HIDDEN_WORDS.find((word) => word.answer === 'LLAMADOR')
  assert.equal(hiddenGuessMatches(llamador, 'martillo'), true)
  assert.equal(hiddenGuessMatches(llamador, 'Llamador'), true)
  assert.equal(hiddenGuessMatches(llamador, 'capataz'), false)
  assert.equal(hiddenGuessMatches(llamador, ''), false)
  const pabilo = HILO_HIDDEN_WORDS.find((word) => word.answer === 'PABILO')
  assert.equal(hiddenGuessMatches(pabilo, 'mecha'), true)
})

test('la racha visible caduca si se deja pasar un día', () => {
  assert.equal(hiddenEffectiveStreak({ date: '2026-10-12', count: 4 }, '2026-10-12'), 4)
  assert.equal(hiddenEffectiveStreak({ date: '2026-10-11', count: 4 }, '2026-10-12'), 4)
  assert.equal(hiddenEffectiveStreak({ date: '2026-10-09', count: 4 }, '2026-10-12'), 0)
  assert.equal(hiddenEffectiveStreak({ date: '', count: 0 }, '2026-10-12'), 0)
  assert.equal(hiddenEffectiveStreak(null, '2026-10-12'), 0)
})

test('la cuenta atrás llega a medianoche de Madrid', () => {
  assert.equal(minutesUntilMadridMidnight(new Date('2026-10-12T21:30:00.000Z')), 30)
  assert.equal(minutesUntilMadridMidnight(new Date('2026-12-31T22:00:00.000Z')), 60)
  assert.equal(minutesUntilMadridMidnight(new Date('2026-10-12T22:00:00.000Z')), 24 * 60)
})

test('el resultado compartido resume cada cabo sin revelar soluciones', () => {
  const expert = getHiddenChallenge('2026-10-12', 'expert')
  const progress = makeHiddenProgress(expert)
  progress.rounds = [
    { status: 'won', guesses: [normalizeHiddenAnswer(expert.words[0].answer)], hints: [] },
    { status: 'won', guesses: ['XXXX', normalizeHiddenAnswer(expert.words[1].answer)], hints: [0] },
    { status: 'lost', guesses: ['A', 'B', 'C', 'D'], hints: [0, 1, 2] },
  ]
  progress.stage = 2
  progress.finished = true
  assert.equal(validHiddenProgress(progress, expert), true)
  const text = hiddenShareText(expert, progress)
  assert.ok(text.includes('Cabos: ✦ ✓ ✕'))
  for (const word of expert.words) assert.ok(!text.toUpperCase().includes(word.answer))
})

test('en la última chicotá ninguna pista adelanta la respuesta de un cabo posterior', () => {
  const byAnswer = new Map(HILO_HIDDEN_WORDS.map((word) => [normalizeHiddenAnswer(word.answer), word]))
  for (const chain of HILO_HIDDEN_CHAINS) {
    chain.answers.forEach((answer, index) => {
      const word = byAnswer.get(normalizeHiddenAnswer(answer))
      const later = chain.answers.slice(index + 1).map(normalizeHiddenAnswer)
      for (const text of [word.clue, ...word.hints.map((hint) => hint.text)]) {
        const tokens = text.split(/[^\p{L}]+/u).map(normalizeHiddenAnswer)
        for (const target of later) {
          assert.ok(!tokens.some((token) => token === target || token === target + 'S'), chain.id + ': «' + text + '» adelanta ' + target)
        }
      }
    })
  }
})


test('las opciones se pueden tocar y son iguales para todos los visitantes del mismo día', () => {
  for (const day of ['2026-10-12','2026-10-13','2026-11-04','2027-01-01']) {
    for (const mode of ['daily','expert']) {
      const challenge=getHiddenChallenge(day,mode)
      challenge.words.forEach((word,index)=>{
        const options=getHiddenChoiceOptions(challenge,index)
        assert.equal(options.length,4)
        assert.equal(new Set(options.map(normalizeHiddenAnswer)).size,4)
        assert.equal(options.filter(answer=>normalizeHiddenAnswer(answer)===normalizeHiddenAnswer(word.answer)).length,1)
        assert.deepEqual(options,getHiddenChoiceOptions(challenge,index))
        assert.ok(options.every(answer=>HILO_HIDDEN_WORDS.some(w=>w.answer===answer)))
        for(const later of challenge.words.filter(w=>w.answer!==word.answer)){
          assert.ok(!options.includes(later.answer),'una respuesta futura no puede aparecer como opción')
        }
      })
    }
  }
})

test('las opciones en el modo visual resultan próximas a la temática de la respuesta', () => {
  const challenge=getHiddenChallenge('2026-10-12','daily')
  const options=getHiddenChoiceOptions(challenge,0)
  const category=challenge.words[0].category
  const entries=options.map(answer=>HILO_HIDDEN_WORDS.find(w=>w.answer===answer))
  const count=HILO_HIDDEN_WORDS.filter(w=>w.category===category).length
  if(count>=4)assert.ok(entries.filter(w=>w.category===category).length>=2)
  assert.deepEqual(getHiddenChoiceOptions(null),[])
})

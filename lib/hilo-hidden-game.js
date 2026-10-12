import { HILO_HIDDEN_WORD_ROWS, HILO_HIDDEN_CHAINS } from './hilo-hidden-game-data.js'

export const HILO_GAME_PATH = '/juegos/el-hilo-escondido'
export const HILO_GAME_MAX_ERRORS = 4
export const HILO_GAME_HINT_COST = 15
export const HILO_GAME_ERROR_COST = 18

const FIRST_DAY = Date.UTC(2026, 9, 12)
const DAILY_LABEL = 'El hilo del día'
const EXPERT_LABEL = 'La última chicotá'

export const HILO_HIDDEN_WORDS = HILO_HIDDEN_WORD_ROWS.map((
  [answer, category, clue, location, functionHint, detail, definition, href, linkText, accepted = []]
) => ({
  answer,
  accepted,
  category,
  clue,
  hints: [
    { title: '¿Por dónde va?', text: location },
    { title: '¿Para qué sirve?', text: functionHint },
    { title: 'El último cabo', text: detail },
  ],
  definition,
  link: { href, text: linkText },
}))

const wordsByAnswer = new Map(HILO_HIDDEN_WORDS.map((word) => [normalizeHiddenAnswer(word.answer), word]))

export function normalizeHiddenAnswer(value) {
  return String(value || '')
    .toLocaleUpperCase('es-ES')
    .replace(/Ñ/g, '~')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/~/g, 'Ñ')
    .replace(/[^A-ZÑ]/g, '')
}

export function madridHiddenDayKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const part = (type) => parts.find((item) => item.type === type)?.value || ''
  return part('year') + '-' + part('month') + '-' + part('day')
}

export function hiddenDaySerial(dayKey) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dayKey || ''))) throw new RangeError('Fecha del juego inválida')
  const [year, month, day] = dayKey.split('-').map(Number)
  const stamp = Date.UTC(year, month - 1, day)
  if (new Date(stamp).toISOString().slice(0, 10) !== dayKey) throw new RangeError('Fecha del juego inválida')
  return Math.floor((stamp - FIRST_DAY) / 86400000)
}

function cyclicIndex(serial, length) {
  return ((serial % length) + length) % length
}

// Orden diario: reparte cada ámbito a lo largo de todo el ciclo para que dos días seguidos
// no caigan en el mismo tema (el banco está agrupado). Determinista y común a todos.
function buildDailyOrder(words) {
  const groups = new Map()
  for (const word of words) {
    if (!groups.has(word.category)) groups.set(word.category, [])
    groups.get(word.category).push(word)
  }
  const placed = []
  let groupIndex = 0
  for (const list of groups.values()) {
    list.forEach((word, index) => {
      placed.push({ word, position: (index + 0.5 + groupIndex * 0.137) / list.length })
    })
    groupIndex++
  }
  placed.sort((a, b) => a.position - b.position)
  const order = placed.map((item) => item.word)
  // Si dos ámbitos coinciden en días seguidos, se intercambia con el siguiente distinto.
  for (let i = 1; i < order.length; i++) {
    if (order[i].category !== order[i - 1].category) continue
    const swap = order.findIndex((word, j) => j > i
      && word.category !== order[i - 1].category
      && (j + 1 >= order.length || order[j + 1].category !== order[i].category)
      && order[j - 1].category !== order[i].category)
    if (swap > -1) [order[i], order[swap]] = [order[swap], order[i]]
  }
  return order
}

export const HILO_HIDDEN_DAILY_ORDER = buildDailyOrder(HILO_HIDDEN_WORDS)
const CYCLE = HILO_HIDDEN_DAILY_ORDER.length
const SPOILER_WINDOW = 5
const CHAIN_GAP = 6

function dailyWordForSerial(serial) {
  return HILO_HIDDEN_DAILY_ORDER[cyclicIndex(serial, CYCLE)]
}

// Calendario experto alineado con el ciclo diario: cada cadena evita las palabras del reto
// diario de los días cercanos (para que un modo no destripe al otro) y no se repite en
// varios días seguidos. Se elige siempre la cadena que lleva más tiempo sin salir.
function buildExpertSchedule() {
  const lastUsed = new Map()
  const schedule = []
  for (let position = 0; position < CYCLE; position++) {
    const nearby = new Set()
    for (let offset = -SPOILER_WINDOW; offset <= SPOILER_WINDOW; offset++) {
      nearby.add(normalizeHiddenAnswer(dailyWordForSerial(position + offset).answer))
    }
    const ranked = HILO_HIDDEN_CHAINS
      .map((chain, index) => ({ chain, index, last: lastUsed.has(chain.id) ? lastUsed.get(chain.id) : -Infinity }))
      .sort((a, b) => a.last - b.last || a.index - b.index)
    const clean = (item) => !item.chain.answers.some((answer) => nearby.has(normalizeHiddenAnswer(answer)))
    const rested = (item) => {
      if (position - item.last < CHAIN_GAP) return false
      const first = schedule.indexOf(item.chain)
      // Al cerrar el ciclo, tampoco debe repetirse pronto respecto al inicio del siguiente.
      return first === -1 || first + CYCLE - position >= CHAIN_GAP
    }
    const pick = ranked.find((item) => clean(item) && rested(item))
      || ranked.find(clean)
      || ranked[0]
    schedule.push(pick.chain)
    lastUsed.set(pick.chain.id, position)
  }
  return schedule
}

export const HILO_HIDDEN_EXPERT_SCHEDULE = buildExpertSchedule()

function expertChainForSerial(serial) {
  return HILO_HIDDEN_EXPERT_SCHEDULE[cyclicIndex(serial, CYCLE)]
}

// Opciones deterministas para responder tocando una tarjeta, sin pedir el teclado.
// Descarta las soluciones de los otros cabos para no adelantarlas en el modo experto.
export function getHiddenChoiceOptions(challenge, stage = 0) {
  const word = challenge?.words?.[stage]
  if (!word) return []

  const answer = normalizeHiddenAnswer(word.answer)
  const blocked = new Set(challenge.words.map((item) => normalizeHiddenAnswer(item.answer)))
  const hash = (value) => [...value].reduce(
    (total, char) => ((total * 33) + char.charCodeAt(0)) >>> 0, 5381
  )
  const seed = hash(challenge.id + ':' + stage)
  const pool = HILO_HIDDEN_WORDS
    .filter((item) => !blocked.has(normalizeHiddenAnswer(item.answer)))
    .map((item) => ({
      answer: item.answer,
      priority: (item.category === word.category ? 0 : 100)
        + (Math.abs(normalizeHiddenAnswer(item.answer).length - answer.length) * 8)
        + (hash(item.answer + ':' + seed) % 11),
    }))
    .sort((a, b) => a.priority - b.priority || a.answer.localeCompare(b.answer, 'es'))
  const distractors = pool.slice(0, 3).map((item) => item.answer)
  if (distractors.length !== 3) return [word.answer]
  const choices = [...distractors]
  choices.splice(seed % 4, 0, word.answer)
  return choices
}

export function hiddenGuessMatches(word, guess) {
  const proposed = normalizeHiddenAnswer(guess)
  if (!proposed) return false
  return [word.answer, ...(word.accepted || [])].some((option) => normalizeHiddenAnswer(option) === proposed)
}

export function hiddenEffectiveStreak(streak, dayKey) {
  if (!streak || !Number.isInteger(streak.count) || !streak.date) return 0
  if (streak.date === dayKey || streak.date === hiddenPriorDayKey(dayKey)) return streak.count
  return 0
}

export function minutesUntilMadridMidnight(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date)
  const part = (type) => Number(parts.find((item) => item.type === type)?.value || 0)
  return Math.max(1, 24 * 60 - (part('hour') * 60 + part('minute')))
}

export function getHiddenChallenge(dayKey, mode = 'daily') {
  const serial = hiddenDaySerial(dayKey)
  if (mode === 'daily') {
    return {
      id: 'daily-' + dayKey,
      dateKey: dayKey,
      mode,
      title: DAILY_LABEL,
      subtitle: 'Una palabra cofrade al día. Tú eliges cuántas pistas pedir.',
      words: [dailyWordForSerial(serial)],
      connection: '',
    }
  }
  if (mode !== 'expert') throw new RangeError('Modalidad de juego inválida')
  const chain = expertChainForSerial(serial)
  return {
    id: 'expert-' + dayKey + '-' + chain.id,
    dateKey: dayKey,
    mode,
    title: EXPERT_LABEL,
    subtitle: chain.title + ': tres palabras para descubrir el vínculo.',
    words: chain.answers.map((answer) => wordsByAnswer.get(normalizeHiddenAnswer(answer))),
    connection: chain.connection,
  }
}

export function makeHiddenProgress(challenge) {
  return {
    version: 1,
    challengeId: challenge.id,
    stage: 0,
    finished: false,
    rounds: challenge.words.map(() => ({
      guesses: [],
      hints: [],
      status: 'playing',
    })),
  }
}

export function validHiddenProgress(value, challenge) {
  if (!value || value.version !== 1 || value.challengeId !== challenge.id || !Array.isArray(value.rounds)) return false
  if (value.rounds.length !== challenge.words.length) return false
  if (!Number.isInteger(value.stage) || value.stage < 0 || value.stage >= challenge.words.length) return false
  if (typeof value.finished !== 'boolean') return false
  if (!value.rounds.every((round) => (
    Array.isArray(round.guesses)
    && round.guesses.length <= HILO_GAME_MAX_ERRORS + 1
    && round.guesses.every((guess) => typeof guess === 'string' && guess.length <= 30)
    && Array.isArray(round.hints)
    && round.hints.length <= 3
    && new Set(round.hints).size === round.hints.length
    && round.hints.every((i) => Number.isInteger(i) && i >= 0 && i < 3)
    && ['playing', 'won', 'lost'].includes(round.status)
  ))) return false
  if (value.finished && (
    value.stage !== challenge.words.length - 1
    || value.rounds.some((round) => round.status === 'playing')
  )) return false
  if (value.rounds.slice(0, value.stage).some((round) => round.status === 'playing')) return false
  return true
}

export function hiddenRoundScore(round) {
  if (round?.status !== 'won') return 0
  const errors = Math.max(0, round.guesses.length - 1)
  return Math.max(10, 100 - round.hints.length * HILO_GAME_HINT_COST - errors * HILO_GAME_ERROR_COST)
}

export function hiddenTotalScore(progress) {
  return progress.rounds.reduce((score, round) => score + hiddenRoundScore(round), 0)
}

export function hiddenPriorDayKey(dayKey) {
  const serial = hiddenDaySerial(dayKey)
  const day = new Date(FIRST_DAY + (serial - 1) * 86400000)
  return day.toISOString().slice(0, 10)
}

export function hiddenShareText(challenge, progress) {
  if (!progress.finished) return ''
  const date = challenge.dateKey.split('-').reverse().join('/')
  const successes = progress.rounds.filter((round) => round.status === 'won').length
  const maxScore = challenge.words.length * 100
  const score = hiddenTotalScore(progress)
  const hints = progress.rounds.reduce((n, round) => n + round.hints.length, 0)
  const knots = progress.rounds.map((round) => (
    round.status !== 'won' ? '✕' : round.hints.length === 0 && round.guesses.length === 1 ? '✦' : '✓'
  )).join(' ')
  return [
    '🧵 El hilo escondido · ' + date,
    challenge.title + ' · ' + successes + '/' + challenge.words.length + ' palabras',
    'Cabos: ' + knots,
    '✨ ' + score + '/' + maxScore + ' puntos · ' + hints + (hints === 1 ? ' pista' : ' pistas'),
    '¿Tú también puedes desenredarlo?',
    'https://hilocofrade.es' + HILO_GAME_PATH,
  ].join('\n')
}

export function hiddenWordBankAudit() {
  return HILO_HIDDEN_CHAINS.every((chain) => chain.answers.every((answer) => (
    wordsByAnswer.has(normalizeHiddenAnswer(answer))
  )))
}

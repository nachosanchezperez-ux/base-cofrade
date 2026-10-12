import { HILO_HIDDEN_WORD_ROWS, HILO_HIDDEN_CHAINS } from './hilo-hidden-game-data.js'

export const HILO_GAME_PATH = '/juegos/el-hilo-escondido'
export const HILO_GAME_MAX_ERRORS = 4
export const HILO_GAME_HINT_COST = 15
export const HILO_GAME_ERROR_COST = 18

const FIRST_DAY = Date.UTC(2026, 9, 12)
const DAILY_LABEL = 'El hilo del día'
const EXPERT_LABEL = 'La última chicotá'

export const HILO_HIDDEN_WORDS = HILO_HIDDEN_WORD_ROWS.map((
  [answer, category, clue, location, functionHint, detail, definition, href, linkText]
) => ({
  answer,
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

export function getHiddenChallenge(dayKey, mode = 'daily') {
  const serial = hiddenDaySerial(dayKey)
  if (mode === 'daily') {
    return {
      id: 'daily-' + dayKey,
      dateKey: dayKey,
      mode,
      title: DAILY_LABEL,
      subtitle: 'Una palabra cofrade al día. Tú eliges cuántas pistas pedir.',
      words: [HILO_HIDDEN_WORDS[cyclicIndex(serial, HILO_HIDDEN_WORDS.length)]],
      connection: '',
    }
  }
  if (mode !== 'expert') throw new RangeError('Modalidad de juego inválida')
  const chain = HILO_HIDDEN_CHAINS[cyclicIndex(serial + 1, HILO_HIDDEN_CHAINS.length)]
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
  return [
    '🧵 El hilo escondido · ' + date,
    challenge.title + ' · ' + successes + '/' + challenge.words.length + ' palabras',
    '✨ ' + score + '/' + maxScore + ' puntos · ' + hints + ' pistas',
    '¿Tú también puedes desenredarlo?',
    'https://hilocofrade.es' + HILO_GAME_PATH,
  ].join('\n')
}

export function hiddenWordBankAudit() {
  return HILO_HIDDEN_CHAINS.every((chain) => chain.answers.every((answer) => (
    wordsByAnswer.has(normalizeHiddenAnswer(answer))
  )))
}

import {
  HILO_GAME_PATH,
  hiddenShareText,
  hiddenTotalScore,
} from './hilo-hidden-game.js'

export const HILO_SHARE_URL = 'https://hilocofrade.es' + HILO_GAME_PATH

// Invitación visible desde el inicio; nunca lleva respuestas ni datos de partida.
export function hiddenInviteText() {
  return [
    '🧵 ¿Sabes desenredar el hilo de hoy?',
    'Juega al reto cofrade de Hilo Cofrade y pon a prueba tus conocimientos.',
    HILO_SHARE_URL,
  ].join('\n')
}

export function hiddenShareData(challenge, progress) {
  if (!challenge || !progress?.finished || progress.challengeId !== challenge.id) return null
  if (!Array.isArray(progress.rounds) || progress.rounds.length !== challenge.words.length) return null

  const winners = progress.rounds.filter((round) => round.status === 'won').length
  const score = hiddenTotalScore(progress)
  const maxScore = challenge.words.length * 100
  const marks = progress.rounds.map((round) => (
    round.status !== 'won'
      ? '✕'
      : round.hints.length === 0 && round.guesses.length === 1 ? '✦' : '✓'
  )).join('  ')
  const date = challenge.dateKey.split('-').reverse().join('/')
  const mode = challenge.mode === 'expert' ? 'La última chicotá' : 'El hilo del día'
  const result = {
    title: 'El hilo escondido · Hilo Cofrade',
    challengeId: challenge.id,
    date,
    mode,
    score,
    maxScore,
    winners,
    rounds: challenge.words.length,
    marks,
    url: HILO_SHARE_URL,
    text: hiddenShareText(challenge, progress),
  }
  result.tweet = [
    '🧵 El hilo escondido · ' + result.date,
    result.mode + ' · ' + winners + '/' + result.rounds + ' cabos',
    '✦ ' + score + '/' + maxScore + ' puntos · ' + marks.replace(/\s{2}/g, ' '),
    '¿Superas mi resultado?',
    HILO_SHARE_URL,
  ].join('\n')
  return result
}

export function hiddenShareSocialLinks(data) {
  if (!data) return null
  return {
    whatsapp: 'https://wa.me/?text=' + encodeURIComponent(data.text),
    x: 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(data.tweet),
  }
}

export function hiddenStoryFilename(challenge) {
  return 'hilo-escondido-' + challenge.dateKey + '-' + (
    challenge.mode === 'expert' ? 'ultima-chicota' : 'reto-diario'
  ) + '.png'
}

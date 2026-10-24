import {
  HILO_GAME_PATH,
  hiddenShareText,
  hiddenStreakLine,
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

export function hiddenShareData(challenge, progress, { streak = 0 } = {}) {
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
    streak: hiddenStreakLine(streak, challenge.mode) ? streak : 0,
    url: HILO_SHARE_URL,
    text: hiddenShareText(challenge, progress, streak),
  }
  result.tweet = [
    '🧵 El hilo escondido · ' + result.date,
    result.mode + ' · ' + winners + '/' + result.rounds + ' cabos',
    '✦ ' + score + '/' + maxScore + ' puntos · ' + marks.replace(/\s{2}/g, ' '),
    result.streak ? '🔥 ' + hiddenStreakLine(result.streak) : '',
    '¿Superas mi resultado?',
    HILO_SHARE_URL,
  ].filter(Boolean).join('\n')
  return result
}

// Texto sin la línea final del enlace: el menú nativo recibe el enlace aparte (`url`), así
// las apps que solo aceptan enlaces (Facebook, LinkedIn, Telegram en iOS…) no lo pierden
// y las que muestran ambos no lo duplican.
function withoutTrailingUrl(text = '') {
  return String(text).split('\n').filter((line) => line.trim() !== HILO_SHARE_URL).join('\n')
}

export function hiddenNativeSharePayload(data) {
  if (!data) return null
  return { title: data.title, text: withoutTrailingUrl(data.text), url: data.url }
}

// Destinos directos para cuando el navegador no tiene menú de compartir (o falla): cada uno
// abre la aplicación o la web con el resultado ya escrito. Nunca dependen del portapapeles.
export function hiddenShareTargets(data) {
  if (!data) return []
  const text = encodeURIComponent(data.text)
  const bare = encodeURIComponent(withoutTrailingUrl(data.text))
  const url = encodeURIComponent(data.url)
  return [
    { id: 'whatsapp', label: 'WhatsApp', href: 'https://wa.me/?text=' + text },
    { id: 'telegram', label: 'Telegram', href: 'https://t.me/share/url?url=' + url + '&text=' + bare },
    { id: 'x', label: 'X', href: 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(data.tweet) },
    { id: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/sharer/sharer.php?u=' + url },
    { id: 'email', label: 'Correo', href: 'mailto:?subject=' + encodeURIComponent(data.title) + '&body=' + text },
  ]
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

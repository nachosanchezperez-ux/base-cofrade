import { hiddenDaySerial, hiddenTotalScore } from './hilo-hidden-game.js'
import { hiddenRoundMark } from './hilo-hidden-archive.js'

// Parámetros de analítica de El hilo escondido. Solo datos de juego: nunca la palabra
// (sería un destripe en los informes) ni nada personal. Los envía trackEvent(), que ya
// respeta el consentimiento de cookies.

export const HILO_GAME_ANALYTICS_NAME = 'El hilo escondido'

const MODE_VALUE = { daily: 'hilo_del_dia', expert: 'ultima_chicota' }

function daysAgo(dayKey, todayKey) {
  try {
    return Math.max(0, hiddenDaySerial(todayKey) - hiddenDaySerial(dayKey))
  } catch {
    return 0
  }
}

// Contexto común: qué modalidad, de qué día y si es de hoy o del archivo.
export function hiddenGameContext({ mode, dayKey, todayKey }) {
  const ago = daysAgo(dayKey, todayKey)
  return {
    game_mode: MODE_VALUE[mode] || 'desconocido',
    game_origin: ago === 0 ? 'hoy' : 'archivo',
    game_day: dayKey,
    days_ago: ago,
  }
}

// Partida terminada: resultado sin revelar las palabras.
export function hiddenGameCompleteParams({ challenge, progress, todayKey, streak = 0 }) {
  const rounds = progress?.rounds || []
  const won = rounds.filter((round) => round.status === 'won').length
  const context = hiddenGameContext({ mode: challenge.mode, dayKey: challenge.dateKey, todayKey })
  return {
    ...context,
    game_result: won === rounds.length ? 'acertado' : won === 0 ? 'fallado' : 'parcial',
    score: hiddenTotalScore(progress),
    max_score: rounds.length * 100,
    words_won: won,
    words_total: rounds.length,
    hints_used: rounds.reduce((total, round) => total + round.hints.length, 0),
    perfect: rounds.length > 0 && rounds.every((round) => hiddenRoundMark(round) === '✦'),
    // La racha solo existe en el hilo del día jugado en su día.
    ...(challenge.mode === 'daily' && context.game_origin === 'hoy' ? { streak } : {}),
  }
}

// Compartir: se reutiliza el evento común `content_share` de la web.
export function hiddenShareParams({ method, mode, dayKey, todayKey }) {
  return {
    share_method: method,
    content_type: 'juego',
    item_name: HILO_GAME_ANALYTICS_NAME,
    ...hiddenGameContext({ mode, dayKey, todayKey }),
  }
}

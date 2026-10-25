import { hiddenDaySerial, hiddenPriorDayKey } from './hilo-hidden-game.js'

// Archivo, encadenado y estadísticas de El hilo escondido.
// Solo se ofrecen días ya pasados: nunca se adelanta un reto futuro (el banco es un ciclo).

export const HILO_GAME_MODES = ['daily', 'expert']

// Días anteriores a hoy con reto publicado, del más reciente al más antiguo.
export function hiddenArchiveDays(todayKey) {
  let serial
  try {
    serial = hiddenDaySerial(todayKey)
  } catch {
    return []
  }
  const days = []
  let day = todayKey
  for (let i = serial; i > 0; i--) {
    day = hiddenPriorDayKey(day)
    days.push(day)
  }
  return days
}

export function hiddenRoundMark(round) {
  if (!round || round.status === 'playing') return ''
  if (round.status !== 'won') return '✕'
  return round.hints.length === 0 && round.guesses.length === 1 ? '✦' : '✓'
}

// Siguiente partida pendiente: primero las de hoy (del día y la última chicotá), después
// el archivo del día más reciente al más antiguo. `isFinished(dayKey, mode)` consulta el
// progreso guardado. Devuelve null si no queda nada por jugar.
export function hiddenNextChallenge({ todayKey, isFinished, current = null }) {
  const days = [todayKey, ...hiddenArchiveDays(todayKey)]
  for (const dayKey of days) {
    for (const mode of HILO_GAME_MODES) {
      if (current && current.dayKey === dayKey && current.mode === mode) continue
      if (!isFinished(dayKey, mode)) return { dayKey, mode }
    }
  }
  return null
}

// `records`: partidas terminadas [{ dayKey, mode, progress }]. `streak`: { count, best }.
export function hiddenPlayerStats({ records = [], streak = null, todayKey }) {
  const rounds = records.flatMap((record) => record.progress?.rounds || [])
  const wonRounds = rounds.filter((round) => round.status === 'won')
  const available = (hiddenArchiveDays(todayKey).length + 1) * HILO_GAME_MODES.length
  const current = Number.isInteger(streak?.count) ? streak.count : 0
  const best = Math.max(current, Number.isInteger(streak?.best) ? streak.best : 0)
  return {
    played: records.length,
    available,
    words: rounds.length,
    wonWords: wonRounds.length,
    winRate: rounds.length ? Math.round((wonRounds.length / rounds.length) * 100) : 0,
    perfect: wonRounds.filter((round) => hiddenRoundMark(round) === '✦').length,
    currentStreak: current,
    bestStreak: best,
  }
}

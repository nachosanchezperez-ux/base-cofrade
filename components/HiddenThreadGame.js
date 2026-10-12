'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  getHiddenChallenge,
  hiddenEffectiveStreak,
  hiddenGuessMatches,
  HILO_GAME_HINT_COST,
  HILO_GAME_MAX_ERRORS,
  hiddenPriorDayKey,
  hiddenRoundScore,
  hiddenShareText,
  hiddenTotalScore,
  madridHiddenDayKey,
  makeHiddenProgress,
  minutesUntilMadridMidnight,
  normalizeHiddenAnswer,
  validHiddenProgress,
} from '@/lib/hilo-hidden-game'
import styles from './HiddenThreadGame.module.css'

const GAME_STORAGE = 'hc-hilo-escondido-v1:'
const STREAK_STORAGE = 'hc-hilo-escondido-racha-v1'

function getProgress(challenge, storageKey) {
  try {
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) return makeHiddenProgress(challenge)
    const parsed = JSON.parse(raw)
    return validHiddenProgress(parsed, challenge) ? parsed : makeHiddenProgress(challenge)
  } catch {
    return makeHiddenProgress(challenge)
  }
}

function getStreak() {
  try {
    const value = JSON.parse(window.localStorage.getItem(STREAK_STORAGE) || 'null')
    return Number.isInteger(value?.count) && value.count >= 0 ? value : { date: '', count: 0 }
  } catch {
    return { date: '', count: 0 }
  }
}

function readableDay(dayKey) {
  const [year, month, day] = dayKey.split('-').map(Number)
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, day, 12)))
}

function countdownLabel(minutes) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!hours) return rest + ' min'
  return hours + ' h ' + String(rest).padStart(2, '0') + ' min'
}

function roundErrors(round) {
  return round.guesses.length - (round.status === 'won' ? 1 : 0)
}

export default function HiddenThreadGame() {
  const [dateKey, setDateKey] = useState('')
  const [mode, setMode] = useState('daily')
  const [state, setState] = useState(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedbackState] = useState({ text: '', tone: '' })
  const setFeedback = (text, tone = 'info') => setFeedbackState({ text, tone: text ? tone : '' })
  const [shareStatus, setShareStatus] = useState('')
  const [streak, setStreak] = useState(0)
  const [minutesLeft, setMinutesLeft] = useState(0)

  useEffect(() => {
    const updateDay = () => setDateKey(madridHiddenDayKey())
    const onVisibility = () => {
      if (document.visibilityState === 'visible') updateDay()
    }
    updateDay()
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('focus', updateDay)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('focus', updateDay)
    }
  }, [])

  const challenge = useMemo(
    () => (dateKey ? getHiddenChallenge(dateKey, mode) : null),
    [dateKey, mode]
  )
  const storageKey = challenge ? GAME_STORAGE + challenge.id : ''

  useEffect(() => {
    if (!challenge) return
    setState({ key: storageKey, progress: getProgress(challenge, storageKey) })
    setAnswer('')
    setFeedback('')
    setShareStatus('')
    setStreak(hiddenEffectiveStreak(getStreak(), challenge.dateKey))
  }, [challenge, storageKey])

  const progress = state?.key === storageKey ? state.progress : null
  const round = progress?.rounds[progress.stage] || null
  const word = challenge?.words[progress?.stage || 0] || null
  const completed = Boolean(progress?.finished)
  const canPlay = Boolean(progress && round && word && round.status === 'playing')

  useEffect(() => {
    if (mode !== 'daily' || !progress?.finished || !dateKey) return
    const previous = getStreak()
    if (previous.date === dateKey) {
      setStreak(previous.count)
      return
    }
    if (progress.challengeId !== 'daily-' + dateKey) return
    const won = progress.rounds[0]?.status === 'won'
    const count = won
      ? (previous.date === hiddenPriorDayKey(dateKey) ? previous.count + 1 : 1)
      : 0
    const next = { date: dateKey, count }
    try {
      window.localStorage.setItem(STREAK_STORAGE, JSON.stringify(next))
    } catch {
      // La partida sigue funcionando si el navegador bloquea el almacenamiento.
    }
    setStreak(count)
  }, [mode, dateKey, progress?.finished, progress?.rounds])

  useEffect(() => {
    if (!completed) return undefined
    const tick = () => setMinutesLeft(minutesUntilMadridMidnight())
    tick()
    const timer = window.setInterval(tick, 30000)
    return () => window.clearInterval(timer)
  }, [completed])

  function saveProgress(next) {
    if (!progress || !storageKey) return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next))
    } catch {
      // El almacenamiento es opcional. Nunca impide jugar.
    }
    setState({ key: storageKey, progress: next })
  }

  function patchRound(nextRound, otherFields = {}) {
    const rounds = progress.rounds.map((item, index) => (
      index === progress.stage ? nextRound : item
    ))
    saveProgress({ ...progress, ...otherFields, rounds })
  }

  function revealHint(index) {
    if (!canPlay || round.hints.includes(index)) return
    patchRound({ ...round, hints: [...round.hints, index] })
    setFeedback('')
  }

  function submitAnswer(event) {
    event.preventDefault()
    if (!canPlay) return
    const proposed = normalizeHiddenAnswer(answer)
    const expected = normalizeHiddenAnswer(word.answer)
    const won = hiddenGuessMatches(word, proposed)
    if (!won && proposed.length !== expected.length) {
      setFeedback('La palabra tiene ' + expected.length + ' letras y tú has escrito ' + proposed.length + '. No te cuenta como intento.')
      return
    }
    if (round.guesses.includes(proposed)) {
      setFeedback('Ya habías probado esa palabra. No te cuenta como intento.')
      return
    }
    const guesses = [...round.guesses, proposed]
    const lost = !won && guesses.length >= HILO_GAME_MAX_ERRORS
    const status = won ? 'won' : lost ? 'lost' : 'playing'
    patchRound(
      { ...round, guesses, status },
      { finished: status !== 'playing' && progress.stage === challenge.words.length - 1 }
    )
    setAnswer('')
    const remaining = HILO_GAME_MAX_ERRORS - guesses.length
    if (won) {
      setFeedback(
        proposed === expected ? '¡Has desenredado este cabo!'
          : '¡Correcto! «' + answer.trim().toLocaleUpperCase('es-ES') + '» también vale: la palabra que buscábamos es ' + word.answer + '.',
        'success'
      )
    } else if (lost) {
      setFeedback('Se han agotado los intentos. Así se desenreda este cabo:', 'error')
    } else {
      setFeedback(
        remaining === 1
          ? 'No es esa. Te queda un intento: te regalamos la primera letra.'
          : 'No es esa. Te quedan ' + remaining + ' intentos.',
        'error'
      )
    }
  }

  function nextStage() {
    if (!round || round.status === 'playing' || progress.stage === challenge.words.length - 1) return
    saveProgress({ ...progress, stage: progress.stage + 1 })
    setAnswer('')
    setFeedback('')
  }

  async function share() {
    if (!completed) return
    const text = hiddenShareText(challenge, progress)
    if (navigator.share) {
      try {
        await navigator.share({ text })
        setShareStatus('Resultado compartido.')
        return
      } catch (error) {
        if (error?.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(text)
      setShareStatus('Resultado copiado para compartir.')
    } catch {
      setShareStatus('Tu navegador no permite copiarlo automáticamente.')
    }
  }

  function changeMode(nextMode) {
    if (mode === nextMode) return
    setMode(nextMode)
    setFeedback('')
    setShareStatus('')
  }

  const careerPoints = progress ? hiddenTotalScore(progress) : 0
  const earnedBadge = streak >= 7 ? 'Siete días de hilo' : completed && careerPoints >= 80 ? 'Buen conocedor' : completed ? 'Primer cabo' : 'Por descubrir'
  const topicCards = [
    { icon: '✦', title: 'Vocabulario', caption: 'La palabra escondida', live: true },
    { icon: '♜', title: 'Hermandades', caption: 'Su historia y sus titulares' },
    { icon: '✧', title: 'Imágenes', caption: 'La talla y su advocación' },
    { icon: '♫', title: 'Marchas', caption: 'Tras los sones' },
    { icon: '✎', title: 'Autores', caption: 'La firma de cada obra' },
  ]

  const isFinalRound = Boolean(progress && progress.stage === challenge.words.length - 1)
  const stagePoints = round ? hiddenRoundScore(round) : 0
  const usedErrors = round ? roundErrors(round) : 0

  return (
    <section className={styles.gameSection} aria-label="Juega a El hilo escondido">
      <div className={'shell ' + styles.wrap}>
        <div className={styles.gameLobby}>
          <div className={styles.lobbyIntro}>
            <span className={styles.eyebrow}>La enciclopedia también se juega</span>
            <h2>Un cabo por descubrir. Una historia por contar.</h2>
            <p>Resuelve el desafío del día y sigue el hilo hacia la historia que se esconde detrás de cada respuesta.</p>
          </div>
          <div className={styles.lobbyScoreboard} aria-label="Tu progreso en el juego">
            <div><span aria-hidden="true">♜</span><strong>{streak}</strong><small>{streak === 1 ? 'Día de racha' : 'Días de racha'}</small></div>
            <div><span aria-hidden="true">✦</span><strong>{careerPoints}</strong><small>Puntos de este reto</small></div>
            <div><span aria-hidden="true">❖</span><strong>{earnedBadge}</strong><small>Tu distinción</small></div>
          </div>
          <div className={styles.lobbyTopics}>
            <div className={styles.topicHeader}><h3>Los universos del Hilo</h3><span>Una enciclopedia, muchos retos</span></div>
            <div className={styles.topicGrid}>
              {topicCards.map((item) => (
                <div key={item.title} className={styles.topicCard + (item.live ? ' ' + styles.topicLive : '')}>
                  <span className={styles.topicSymbol} aria-hidden="true">{item.icon}</span>
                  <strong>{item.title}</strong>
                  <small>{item.caption}</small>
                  <span className={styles.topicStatus}>{item.live ? 'Disponible ahora' : 'En preparación'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.modes} role="group" aria-label="Elige una modalidad">
          <button type="button" aria-pressed={mode === 'daily'} className={mode === 'daily' ? styles.modeActive : ''} onClick={() => changeMode('daily')}>
            <span className={styles.modeIcon} aria-hidden="true">✦</span>
            <span><strong>El hilo del día</strong><small>Una palabra</small></span>
          </button>
          <button type="button" aria-pressed={mode === 'expert'} className={mode === 'expert' ? styles.modeActive : ''} onClick={() => changeMode('expert')}>
            <span className={styles.modeIcon} aria-hidden="true">♜</span>
            <span><strong>La última chicotá</strong><small>Tres palabras conectadas</small></span>
          </button>
        </div>

        {!progress || !challenge || !word ? (
          <div className={styles.loading} role="status">Preparando el reto cofrade de hoy…</div>
        ) : (
          <div className={styles.layout} id="partida-del-hilo">
            <div className={styles.gameCard}>
              <header className={styles.gameHeader}>
                <div>
                  <span className={styles.eyebrow}>Reto del {readableDay(dateKey)}</span>
                  <h2>{challenge.title}</h2>
                  <p>{challenge.subtitle}</p>
                </div>
                {mode === 'expert' ? (
                  <span className={styles.gameNumber}>{String(progress.stage + 1).padStart(2, '0')} / 03</span>
                ) : null}
              </header>

              {mode === 'expert' ? (
                <div className={styles.stageSteps} role="list" aria-label="Progreso de los tres cabos">
                  {challenge.words.map((item, index) => (
                    <span
                      key={index}
                      role="listitem"
                      className={index < progress.stage || completed ? styles.stageDone : index === progress.stage ? styles.stageCurrent : ''}
                      aria-label={'Cabo ' + (index + 1) + ': ' + (
                        index < progress.stage || completed ? 'terminado'
                          : index === progress.stage ? 'en curso' : 'pendiente'
                      )}
                    >{index < progress.stage || completed ? '✓' : index + 1}</span>
                  ))}
                </div>
              ) : null}

              <div className={styles.riddle}>
                <span className={styles.riddleLabel}>El primer cabo · {word.category}</span>
                <blockquote>{word.clue}</blockquote>
                <span className={styles.letters}>
                  {normalizeHiddenAnswer(word.answer).length} letras
                  {canPlay && usedErrors === HILO_GAME_MAX_ERRORS - 1 ? (
                    <> · empieza por <strong>«{word.answer.charAt(0)}»</strong></>
                  ) : null}
                </span>
              </div>

              {canPlay ? (
                <form className={styles.guessForm} onSubmit={submitAnswer}>
                  <label htmlFor="hidden-thread-answer">¿Qué palabra se esconde?</label>
                  <div className={styles.guessRow}>
                    <input
                      id="hidden-thread-answer"
                      type="text"
                      name="respuesta"
                      value={answer}
                      onChange={(event) => {
                        setAnswer(event.target.value)
                        setFeedback('')
                      }}
                      maxLength={32}
                      autoCapitalize="characters"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      placeholder="Escribe tu respuesta"
                    />
                    <button type="submit" disabled={!answer.trim()}>Probar <span aria-hidden="true">→</span></button>
                  </div>
                  <span className={styles.attemptInfo}>Intentos disponibles: <strong>{HILO_GAME_MAX_ERRORS - usedErrors}</strong> de {HILO_GAME_MAX_ERRORS}</span>
                </form>
              ) : null}

              {round.guesses.length ? (
                <div className={styles.guesses} aria-label="Historial de respuestas">
                  <span>Lo que has probado</span>
                  <div>
                    {round.guesses.map((guess, index) => (
                      <span key={index} className={hiddenGuessMatches(word, guess) ? styles.guessCorrect : styles.guessWrong}>
                        {hiddenGuessMatches(word, guess) ? '✓ ' : '× '}{guess}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <p
                className={styles.feedback + (feedback.tone ? ' ' + styles['feedback_' + feedback.tone] : '')}
                role="status"
                aria-live="polite"
                hidden={!feedback.text}
              >{feedback.text}</p>

              {canPlay ? (
                <div className={styles.hints}>
                  <div className={styles.hintHeader}>
                    <h3>Tira de otro cabo</h3>
                    <span>Cada pista resta {HILO_GAME_HINT_COST} puntos</span>
                  </div>
                  <div className={styles.hintButtons}>
                    {word.hints.map((hint, index) => (
                      <button
                        type="button"
                        key={index}
                        disabled={!canPlay || round.hints.includes(index)}
                        className={round.hints.includes(index) ? styles.hintRevealed : ''}
                        onClick={() => revealHint(index)}
                        aria-label={round.hints.includes(index) ? hint.title + ', pista abierta' : 'Abrir pista: ' + hint.title}
                      >
                        <span aria-hidden="true">{round.hints.includes(index) ? '✓' : '+'}</span>
                        {hint.title}
                      </button>
                    ))}
                  </div>
                  {round.hints.length > 0 ? (
                    <div className={styles.revealedHints} aria-live="polite">
                      {round.hints.map((index) => (
                        <p key={index}><strong>{word.hints[index].title}</strong> {word.hints[index].text}</p>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {round.status !== 'playing' ? (
                <div className={styles.answerCard + ' ' + (round.status === 'won' ? styles.answerWon : styles.answerLost)}>
                  <span className={styles.answerKicker}>{round.status === 'won' ? 'Cabo desenredado' : 'El hilo se ha descubierto'}</span>
                  <h3>{word.answer}</h3>
                  <p>{word.definition}</p>
                  <div className={styles.answerFooter}>
                    <Link href={word.link.href}>{word.link.text} <span aria-hidden="true">↗</span></Link>
                    <strong>{round.status === 'won' ? '+' + stagePoints + ' puntos' : '0 puntos'}</strong>
                  </div>
                  {!isFinalRound ? (
                    <button className={styles.nextButton} type="button" onClick={nextStage}>Tira del siguiente cabo <span aria-hidden="true">→</span></button>
                  ) : null}
                </div>
              ) : null}

              {completed ? (
                <div className={styles.summary}>
                  <div className={styles.summaryTop}>
                    <div>
                      <span className={styles.eyebrow}>Reto completado</span>
                      <h3>{hiddenTotalScore(progress)} <span>/ {challenge.words.length * 100} puntos</span></h3>
                    </div>
                    <button type="button" onClick={share}>Compartir resultado <span aria-hidden="true">↗</span></button>
                  </div>
                  <div className={styles.achievement} aria-label="Distinción conseguida">
                    <span aria-hidden="true">❖</span>
                    <div><strong>{earnedBadge}</strong><small>Tu distinción cofrade de esta partida</small></div>
                  </div>
                  {mode === 'expert' ? (
                    <div className={styles.connection}>
                      <strong>Ahí estaba la conexión</strong>
                      <p>{challenge.connection}</p>
                      <div className={styles.connectionWords}>
                        {challenge.words.map((item) => <span key={item.answer}>{item.answer}</span>)}
                      </div>
                    </div>
                  ) : (
                    <p className={styles.dailyDone}>
                      {streak > 1 ? 'Llevas ' + streak + ' días seguidos acertando. ' : ''}
                      Un nuevo hilo se esconde mañana.
                    </p>
                  )}
                  {minutesLeft ? (
                    <p className={styles.countdown}>Próximo reto en <strong>{countdownLabel(minutesLeft)}</strong>, a medianoche en Sevilla.</p>
                  ) : null}
                  {shareStatus ? <p className={styles.shareStatus} role="status">{shareStatus}</p> : null}
                </div>
              ) : null}
            </div>

            <aside className={styles.aside} aria-label="Información del juego">
              <div className={styles.asideCard}>
                <span className={styles.eyebrow}>Tu partida</span>
                <div className={styles.gameStat}><span>Pistas abiertas</span><strong>{round.hints.length} / 3</strong></div>
                <div className={styles.gameStat}><span>Errores de este cabo</span><strong>{usedErrors} / {HILO_GAME_MAX_ERRORS}</strong></div>
                <div className={styles.gameStat}><span>Racha diaria de aciertos</span><strong>{streak} {streak === 1 ? 'día' : 'días'}</strong></div>
              </div>
              <div className={styles.howTo}>
                <span className={styles.eyebrow}>Cómo se juega</span>
                <h3>¿Sabes de qué estamos hablando?</h3>
                <p>Lee la adivinanza, escribe una palabra y descubre pistas solo cuando las necesites. Cuantas menos ayudas utilices, más puntos sumarás.</p>
                <p>En el nivel experto hay tres palabras enlazadas. Cada una descubre un pedazo de la historia.</p>
              </div>
              <div className={styles.privacyNote}>
                <span aria-hidden="true">↳</span>
                <p>Una partida nueva cada día, según la hora de Sevilla. Tu progreso se guarda solo en este navegador, sin registro ni clasificación pública.</p>
              </div>
              <div className={styles.anotherGame}>
                <span className={styles.eyebrow}>¿Más retos cofrades?</span>
                <p>Puedes seguir jugando en <a href="https://cofradle.es/" target="_blank" rel="noopener noreferrer">Cofradle ↗</a>, una web externa e independiente.</p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  getHiddenChallenge,
  getHiddenChoiceOptions,
  hiddenEffectiveStreak,
  evaluateHiddenGuess,
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
import { hiddenShareData, hiddenShareSocialLinks, hiddenStoryFilename } from '@/lib/hilo-hidden-share'
import { createHiddenStoryFile, saveHiddenStoryFile } from '@/lib/hilo-hidden-share-card'

const GAME_STORAGE = 'hc-hilo-escondido-v2:'
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

export default function HiddenThreadGame({ initialDayKey = '' }) {
  const [dateKey, setDateKey] = useState(initialDayKey)
  const gameHeadingRef = useRef(null)
  const [mode, setMode] = useState('daily')
  // La pista debe existir en SSR: el almacenamiento local se reconcilia al hidratar.
  const [state, setState] = useState(() => initialDayKey ? {
    key: GAME_STORAGE + 'daily-' + initialDayKey,
    progress: makeHiddenProgress(getHiddenChallenge(initialDayKey, 'daily')),
  } : null)
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
  const options = useMemo(
    () => (challenge?.mode === 'daily' && progress ? getHiddenChoiceOptions(challenge, progress.stage) : []),
    [challenge, progress?.stage]
  )
  const shareData = useMemo(
    () => completed ? hiddenShareData(challenge, progress) : null,
    [challenge, progress, completed]
  )
  const socialLinks = useMemo(
    () => hiddenShareSocialLinks(shareData),
    [shareData]
  )

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

  function tryGuess(value, tapped = false) {
    if (!canPlay || (mode === 'daily') !== tapped) return
    const result = evaluateHiddenGuess({ word, round, value, isChoice: tapped })
    if (result.kind === 'empty') {
      setFeedback('Escribe una palabra o toca una tarjeta.')
      return
    }
    if (result.kind === 'length') {
      setFeedback('Buscamos ' + result.expectedLength + ' letras. No cuenta como intento.')
      return
    }
    if (result.kind === 'duplicate') {
      setFeedback('Esa respuesta ya se ha probado. No cuenta como intento.')
      return
    }
    if (!result.nextRound) return

    patchRound(result.nextRound, {
      finished: result.nextRound.status !== 'playing' && progress.stage === challenge.words.length - 1,
    })
    setAnswer('')
    if (result.kind === 'won') {
      setFeedback(
        result.proposed === normalizeHiddenAnswer(word.answer)
          ? '¡Eso es! Has desenredado el hilo.'
          : '¡Correcto! «' + String(value).trim().toLocaleUpperCase('es-ES') + '» también vale. La palabra es ' + word.answer + '.',
        'success'
      )
    } else if (result.kind === 'lost') {
      setFeedback('No quedan intentos. Descubre la respuesta y sigue aprendiendo.', 'error')
    } else {
      setFeedback(
        result.remaining === 1
          ? '¡Último intento! Puedes pedir una pista antes de responder.'
          : 'No era esa. Te quedan ' + result.remaining + ' intentos.',
        'error'
      )
    }
  }

  function submitAnswer(event) {
    event.preventDefault()
    tryGuess(answer)
  }

  function chooseAnswer(value) {
    tryGuess(value, true)
  }

  function nextStage() {
    if (!round || round.status === 'playing' || progress.stage === challenge.words.length - 1) return
    saveProgress({ ...progress, stage: progress.stage + 1 })
    setAnswer('')
    setFeedback('')
    window.requestAnimationFrame(() => {
      gameHeadingRef.current?.focus({ preventScroll: true })
      gameHeadingRef.current?.scrollIntoView({
        behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: 'start',
      })
    })
  }

  async function share() {
    if (!shareData) return
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: shareData.title, text: shareData.text })
        setShareStatus('Has enviado tu resultado a la aplicación elegida.')
        return
      } catch (error) {
        if (error?.name === 'AbortError') return
      }
    }
    await copyResult()
  }

  async function copyResult() {
    if (!shareData) return
    try {
      await navigator.clipboard.writeText(shareData.text)
      setShareStatus('Resultado copiado. Pégalo en tu red social o conversación.')
    } catch {
      setShareStatus('Tu navegador no permite copiar automáticamente. Puedes usar WhatsApp o X.')
    }
  }

  async function shareStory() {
    if (!shareData || !challenge) return
    try {
      // Se genera en el mismo gesto del usuario, para no perder activación del diálogo nativo.
      const image = createHiddenStoryFile(shareData, hiddenStoryFilename(challenge))
      if (typeof navigator.share === 'function'
        && typeof navigator.canShare === 'function'
        && navigator.canShare({ files: [image] })) {
        try {
          await navigator.share({
            files: [image],
            title: shareData.title,
            text: '¿Superas mi resultado? ' + shareData.url,
          })
          setShareStatus('Imagen enviada a la aplicación elegida.')
          return
        } catch (error) {
          if (error?.name === 'AbortError') return
        }
      }
      saveHiddenStoryFile(image)
      setShareStatus('Imagen preparada para subir como historia. Puedes compartirla desde tu galería.')
    } catch {
      setShareStatus('No ha sido posible crear la imagen. Comparte el resultado como texto.')
    }
  }

  function changeMode(nextMode) {
    if (mode === nextMode) return
    setMode(nextMode)
    setFeedback('')
    setShareStatus('')
    window.requestAnimationFrame(() => document.getElementById('partida-del-hilo')?.scrollIntoView({
      behavior: window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    }))
  }

  const careerPoints = progress ? hiddenTotalScore(progress) : 0
  const earnedBadge = streak >= 7 ? 'Siete días de hilo' : completed && careerPoints >= 80 ? 'Buen conocedor' : completed ? 'Primer cabo' : 'Por descubrir'
  const isFinalRound = Boolean(progress && progress.stage === challenge.words.length - 1)
  const stagePoints = round ? hiddenRoundScore(round) : 0
  const usedErrors = round ? roundErrors(round) : 0
  const nextHintIndex = canPlay ? word.hints.findIndex((_, index) => !round.hints.includes(index)) : -1

  return (
    <section className={styles.gameSection} aria-label="Juega a El hilo escondido">
      <div className={'shell ' + styles.wrap}>
        <div className={styles.modes} id="partida-del-hilo" role="group" aria-label="Elige una modalidad">
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
          <>
          <div className={styles.layout}>
            <div className={styles.gameCard}>
              <header className={styles.gameHeader}>
                <div>
                  <span className={styles.eyebrow}>Reto del {readableDay(dateKey)}</span>
                  <h2 ref={gameHeadingRef} tabIndex={-1} className={styles.gameFocusHeading}>{challenge.title}</h2>
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
                <div className={styles.riddleTop}>
                  <span className={styles.riddleLabel}>{word.category} · Cabo {progress.stage + 1}</span>
                  <span className={styles.potentialScore}>✦ {round.status === 'won' ? stagePoints : Math.max(10, 100 - (round.hints.length * HILO_GAME_HINT_COST) - (usedErrors * 18))} puntos</span>
                </div>
                <div className={styles.riddleScene}>
                  <span className={styles.riddleEmblem} aria-hidden="true">?</span>
                  <blockquote>{word.clue}</blockquote>
                </div>
                <span className={styles.riddleFootnote}>
                  {canPlay ? 'Sigue el hilo: descubre la palabra oculta' : 'El misterio de este cabo ya está resuelto'}
                </span>
              </div>

              {mode === 'daily' ? (
              <section className={styles.choicePanel} aria-label="Adivina tocando una opción">
                <div className={styles.choiceHeading}>
                  <h3>¿Cuál es la respuesta?</h3>
                  <span>Elige una tarjeta</span>
                </div>
                <div className={styles.choiceGrid} role="group" aria-label="Cuatro respuestas posibles">
                  {options.map((option, index) => {
                    const selected = round.guesses.includes(normalizeHiddenAnswer(option))
                    const correct = !canPlay && hiddenGuessMatches(word, option)
                    const wrong = selected && !hiddenGuessMatches(word, option)
                    return (
                      <button
                        type="button"
                        key={option}
                        className={[
                          styles.choiceTile,
                          wrong ? styles.choiceWrong : '',
                          correct ? styles.choiceCorrect : '',
                        ].filter(Boolean).join(' ')}
                        onClick={() => chooseAnswer(option)}
                        disabled={!canPlay || wrong}
                        aria-label={'Respuesta ' + (index + 1) + ': ' + option}
                      >
                        <span className={styles.choiceLetter} aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                        <span className={styles.choiceName}>{option.toLocaleLowerCase('es-ES')}</span>
                        <span className={styles.choiceIndicator} aria-hidden="true">{wrong ? '×' : correct ? '✓' : '↗'}</span>
                      </button>
                    )
                  })}
                </div>
                {canPlay ? (
                  <div className={styles.choiceAttempts}>
                    <span className={styles.attemptLights} aria-hidden="true">
                      {Array.from({ length: HILO_GAME_MAX_ERRORS }, (_, index) => index).map((index) => (
                        <i key={index} className={index < usedErrors ? styles.attemptSpent : ''} />
                      ))}
                    </span>
                    <span>{Math.max(0, HILO_GAME_MAX_ERRORS - usedErrors)} intentos · elige una tarjeta</span>
                  </div>
                ) : null}
              </section>
              ) : canPlay ? (
                <section className={styles.expertPanel} aria-label="Escribe la palabra en el nivel experto">
                  <div className={styles.expertLabel}>
                    <span>✎ LA ÚLTIMA CHICOTÁ</span>
                    <strong>{normalizeHiddenAnswer(word.answer).length} letras</strong>
                  </div>
                  <form className={styles.expertForm} onSubmit={submitAnswer}>
                    <label htmlFor="hidden-thread-answer">¿Qué palabra une este cabo?</label>
                    <div className={styles.guessRow}>
                      <input
                        id="hidden-thread-answer"
                        type="text"
                        name="respuesta"
                        value={answer}
                        onChange={(event) => { setAnswer(event.target.value); setFeedback('') }}
                        maxLength={40}
                        autoCapitalize="characters"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        placeholder="Escribe la palabra"
                      />
                      <button type="submit" disabled={!answer.trim()}>Responder <span aria-hidden="true">→</span></button>
                    </div>
                    <span className={styles.attemptInfo}>
                      {Math.max(0, HILO_GAME_MAX_ERRORS - usedErrors)} intentos disponibles.
                      {usedErrors === HILO_GAME_MAX_ERRORS - 1 ? ' Pista final: comienza por «' + word.answer.charAt(0) + '».' : ''}
                    </span>
                  </form>
                </section>
              ) : null}

              <p
                className={styles.feedback + (feedback.tone ? ' ' + styles['feedback_' + feedback.tone] : '')}
                role="status"
                aria-live="polite"
                hidden={!feedback.text}
              >{feedback.text}</p>

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
                  <button
                    type="button"
                    className={styles.continuePlaying}
                    onClick={() => changeMode(mode === 'daily' ? 'expert' : 'daily')}
                  >
                    {mode === 'daily' ? 'Seguir con La última chicotá' : 'Jugar al reto del día'}
                    <span aria-hidden="true">→</span>
                  </button>
                  {shareStatus ? <p className={styles.shareStatus} role="status">{shareStatus}</p> : null}
                </div>
              ) : null}
              {canPlay ? (
                <section className={styles.hints} aria-label="Pistas del juego">
                  {nextHintIndex >= 0 ? (
                    <button
                      type="button"
                      className={styles.progressiveHint}
                      onClick={() => revealHint(nextHintIndex)}
                      aria-label={round.hints.length ? 'Desvelar otra pista (resta 15 puntos)' : 'Pedir una pista (resta 15 puntos)'}
                    >
                      <span className={styles.progressiveHintIcon} aria-hidden="true">✧</span>
                      <span className={styles.progressiveHintCopy}>
                        <strong>{round.hints.length ? 'Dame otra pista' : '¿Necesitas una pista?'}</strong>
                        <small>{round.hints.length} de {word.hints.length} descubiertas</small>
                      </span>
                      <span className={styles.progressiveHintCost}>−{HILO_GAME_HINT_COST} pts</span>
                    </button>
                  ) : null}
                  {round.hints.length > 0 ? (
                    <div className={styles.revealedHints} aria-live="polite">
                      {round.hints.map((index) => (
                        <p key={index}><strong>{word.hints[index].title}</strong> {word.hints[index].text}</p>
                      ))}
                    </div>
                  ) : null}
                </section>
              ) : null}

              {round.guesses.length ? (
                <div className={styles.guesses} aria-label="Historial de respuestas">
                  <span>Respuestas anteriores</span>
                  <div>
                    {round.guesses.map((guess, index) => (
                      <span key={index} className={hiddenGuessMatches(word, guess) ? styles.guessCorrect : styles.guessWrong}>
                        {hiddenGuessMatches(word, guess) ? '✓ ' : '× '}{guess}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

            </div>

            <aside className={styles.aside} aria-label="Tu marcador">
              <div className={styles.scoreCard}>
                <span className={styles.eyebrow}>Así va tu partida</span>
                <div className={styles.scoreBig}><span aria-hidden="true">✦</span><strong>{careerPoints}</strong><small>puntos</small></div>
                <div className={styles.scoreLine}><span>Racha de aciertos</span><strong>{streak} {streak === 1 ? 'día' : 'días'}</strong></div>
                <div className={styles.scoreLine}><span>Pistas utilizadas</span><strong>{round.hints.length} / 3</strong></div>
                <p>Una nueva palabra cada día. Tus resultados se guardan en este navegador.</p>
              </div>
            </aside>
          </div>
          <div className={styles.nextTopics} aria-label="Próximos retos de la enciclopedia">
            <span className={styles.eyebrow}>El juego seguirá creciendo</span>
            <p>Próximamente: hermandades, imágenes, marchas y autores.</p>
          </div>
          </>
        )}
      </div>
    </section>
  )
}

'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  EXPERT_PUZZLES, GAME_PATH, MAX_ATTEMPTS,
  normalizeAnswer, roundScore, shareResult,
} from '@/lib/hilo-escondido'
import styles from './page.module.css'

const EMPTY = { guesses: [], hints: [] }

function readProgress(key, puzzle) {
  try {
    const stored = JSON.parse(window.localStorage.getItem(key) || 'null')
    const guesses = Array.isArray(stored?.guesses)
      ? stored.guesses.filter((value) => typeof value === 'string')
        .map(normalizeAnswer).filter(Boolean).slice(0, MAX_ATTEMPTS)
      : []
    const hints = Array.isArray(stored?.hints)
      ? [...new Set(stored.hints.filter((value) => Number.isInteger(value) && value >= 0 && value < puzzle.hints.length))]
      : []
    return { guesses, hints }
  } catch {
    return EMPTY
  }
}

function dayCaption(dayKey) {
  const [year, month, day] = dayKey.split('-').map(Number)
  const localNoon = new Date(Date.UTC(year, month - 1, day, 12))
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid' }).format(localNoon)
}

export default function HiloEscondidoClient({ dayKey, dailyPuzzle }) {
  const [mode, setMode] = useState('daily')
  const [expertStep, setExpertStep] = useState(0)
  const [entry, setEntry] = useState('')
  const [message, setMessage] = useState('')
  const [sharedText, setSharedText] = useState('')
  const [record, setRecord] = useState({ key: null, ...EMPTY })

  const puzzle = mode === 'daily' ? dailyPuzzle : EXPERT_PUZZLES[expertStep]
  const key = mode === 'daily' ? 'hc-hilo-escondido:v1:daily:' + dayKey : 'hc-hilo-escondido:v1:expert:' + puzzle.id
  const loaded = record.key === key
  const guesses = loaded ? record.guesses : []
  const hints = loaded ? record.hints : []
  const normalizedSolution = normalizeAnswer(puzzle.answer)
  const solved = guesses.includes(normalizedSolution)
  const lost = guesses.length >= MAX_ATTEMPTS && !solved
  const ended = solved || lost
  const score = roundScore(guesses, hints, solved)

  useEffect(() => {
    setRecord({ key, ...readProgress(key, puzzle) })
  }, [key, puzzle])

  useEffect(() => {
    if (!loaded) return
    try {
      window.localStorage.setItem(key, JSON.stringify({ guesses: record.guesses, hints: record.hints }))
    } catch {
      // El navegador puede bloquear el almacenamiento: la ronda sigue funcionando.
    }
  }, [key, loaded, record])

  const resetInput = () => {
    setEntry('')
    setMessage('')
    setSharedText('')
  }

  const changeMode = (nextMode) => {
    if (nextMode === mode) return
    setMode(nextMode)
    setExpertStep(0)
    resetInput()
  }

  const revealHint = (index) => {
    if (!loaded || ended || hints.includes(index)) return
    setRecord((current) => ({ ...current, hints: [...current.hints, index] }))
    setMessage('')
  }

  const onGuess = (event) => {
    event.preventDefault()
    if (!loaded || ended) return
    const value = normalizeAnswer(entry)
    if (!value) {
      setMessage('Escribe una palabra antes de responder.')
      return
    }
    if (value.length !== normalizedSolution.length) {
      setMessage('Busca una palabra de ' + normalizedSolution.length + ' letras.')
      return
    }
    if (guesses.includes(value)) {
      setMessage('Ya has probado esa palabra. Intenta otra.')
      return
    }
    setRecord((current) => ({ ...current, guesses: [...current.guesses, value] }))
    setEntry('')
    setMessage(value === normalizedSolution ? '¡Has dado con la palabra!' : 'Ese no es el cabo que buscamos. Sigue intentándolo.')
  }

  const nextExpert = () => {
    if (expertStep >= EXPERT_PUZZLES.length - 1) return
    setExpertStep((current) => current + 1)
    resetInput()
  }

  const share = async () => {
    const text = shareResult({ mode, dayKey, guesses, revealed: hints, solved, step: expertStep })
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({ text })
        setSharedText('')
        return
      } catch (error) {
        if (error?.name === 'AbortError') return
      }
    }
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        setSharedText('Resultado copiado. ¡Compártelo con quien quieras!')
        return
      }
    } catch {
      // Fallback accesible: se muestra el texto para copiarlo manualmente.
    }
    setSharedText(text)
  }

  return (
    <div className={styles.gameArea}>
      <nav className={styles.modeSwitch} aria-label="Seleccionar modalidad del juego">
        <button type="button" aria-pressed={mode === 'daily'} className={mode === 'daily' ? styles.modeActive : ''} onClick={() => changeMode('daily')}>
          <span>El cabo del día</span><small>Un reto cada mañana</small>
        </button>
        <button type="button" aria-pressed={mode === 'expert'} className={mode === 'expert' ? styles.modeActive : ''} onClick={() => changeMode('expert')}>
          <span>La última chicotá</span><small>Tres cabos · nivel experto</small>
        </button>
      </nav>

      <section className={styles.board} aria-labelledby="game-heading">
        <div className={styles.gameHeader}>
          <div>
            <span className={styles.kicker}>{mode === 'daily' ? 'Reto diario · ' + dayCaption(dayKey) : 'Nivel experto · cabo ' + (expertStep + 1) + ' de 3'}</span>
            <h2 id="game-heading">{mode === 'daily' ? '¿Qué palabra se esconde hoy?' : 'La última chicotá'}</h2>
          </div>
          <div className={styles.scoreCard} aria-label={score + ' puntos obtenidos'}>
            <strong>{ended ? score : '100'}</strong>
            <span>{ended ? 'Puntos' : 'Máximo'}</span>
          </div>
        </div>

        {mode === 'expert' ? (
          <div className={styles.expertTrack} aria-label={'Cabo ' + (expertStep + 1) + ' de 3'}>
            {EXPERT_PUZZLES.map((item, index) => (
              <span key={item.id} className={index === expertStep ? styles.currentStep : index < expertStep ? styles.pastStep : ''}>{'0' + (index + 1)}</span>
            ))}
          </div>
        ) : null}

        <div className={styles.mystery}>
          <span className={styles.category}>{puzzle.category}</span>
          <p className={styles.riddle}>“{puzzle.riddle}”</p>
          <div className={styles.hiddenWord} aria-label={'Palabra oculta de ' + normalizedSolution.length + ' letras'}>
            {Array.from({ length: normalizedSolution.length }, (_, index) => (
              <span key={index} className={ended ? styles.letterSolved : styles.letterBlank} aria-hidden="true">
                {ended ? Array.from(puzzle.answer)[index] : ''}
              </span>
            ))}
          </div>
          <span className={styles.letterLabel}>{normalizedSolution.length} letras · {MAX_ATTEMPTS - guesses.length} intentos disponibles</span>
        </div>

        <div className={styles.cluesHeader}>
          <div><h3>Los cabos del hilo</h3><p>Cada pista te acerca a la solución, pero resta 18 puntos.</p></div>
          <span>{hints.length}/3 descubiertos</span>
        </div>
        <div className={styles.hintGrid}>
          {puzzle.hints.map((hint, index) => {
            const revealed = hints.includes(index)
            return (
              <button
                className={revealed ? styles.hintShown : styles.hintHidden}
                key={hint.label}
                type="button"
                disabled={!loaded || ended || revealed}
                onClick={() => revealHint(index)}
                aria-label={revealed ? hint.label + ': ' + hint.text : 'Descubrir pista: ' + hint.label + ', cuesta 18 puntos'}
              >
                <span className={styles.hintNumber}>{'0' + (index + 1)}</span>
                <strong>{hint.label}</strong>
                <span>{revealed ? hint.text : 'Tirar de este cabo →'}</span>
              </button>
            )
          })}
        </div>

        {!loaded ? <p className={styles.loading} role="status">Preparando tu reto…</p> : !ended ? (
          <form className={styles.answerForm} onSubmit={onGuess}>
            <label htmlFor="hilo-game-answer">¿Te atreves a desenredarlo?</label>
            <div className={styles.answerRow}>
              <input
                id="hilo-game-answer"
                type="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                maxLength={32}
                value={entry}
                onChange={(event) => setEntry(event.target.value)}
                placeholder="Escribe la palabra…"
              />
              <button type="submit">Probar palabra <span aria-hidden="true">→</span></button>
            </div>
            <p className={styles.attempts}>Intento {guesses.length + 1} de {MAX_ATTEMPTS}. No se muestran letras acertadas: aquí mandan las pistas.</p>
          </form>
        ) : (
          <div className={styles.solution} role="status">
            <span className={styles.solutionEyebrow}>{solved ? '¡Has desenredado el hilo!' : 'Esta vez se ha enredado el hilo'}</span>
            <h3>{puzzle.answer}</h3>
            <p>{puzzle.definition}</p>
            <div className={styles.solutionActions}>
              <Link href={puzzle.related.href}>{puzzle.related.label} <span aria-hidden="true">→</span></Link>
              <button type="button" onClick={share}>Compartir resultado ↗</button>
            </div>
            {mode === 'expert' && expertStep < EXPERT_PUZZLES.length - 1 ? (
              <button type="button" className={styles.nextButton} onClick={nextExpert}>Tirar del siguiente cabo →</button>
            ) : null}
            {mode === 'expert' && expertStep === EXPERT_PUZZLES.length - 1 ? (
              <p className={styles.expertFinal}>Has llegado al final de la última chicotá. ¡El hilo sigue en la enciclopedia!</p>
            ) : null}
            {sharedText ? (
              <div className={styles.shareFeedback} role="status">
                {sharedText.startsWith('🧵') ? <textarea aria-label="Resultado para copiar" value={sharedText} readOnly rows={5} onFocus={(event) => event.currentTarget.select()} /> : <p>{sharedText}</p>}
              </div>
            ) : null}
          </div>
        )}
        {loaded && !ended && message ? <p className={styles.feedback} role="status">{message}</p> : null}
        {loaded && guesses.length > 0 && !ended ? (
          <p className={styles.previous}>Palabras probadas: {guesses.join(' · ')}</p>
        ) : null}
      </section>

      <p className={styles.privacyNote}>Sin registro ni clasificación pública. Tu progreso se guarda solo en este navegador. Las respuestas cambian cada día según la hora de Sevilla.</p>
      <div className={styles.bottomLink}><Link href={GAME_PATH} prefetch={false}>El hilo escondido · Una única página para todos los retos</Link></div>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  getHiddenChallenge,
  getHiddenChoiceOptions,
  hiddenEffectiveStreak,
  evaluateHiddenGuess,
  hiddenGuessMatches,
  HILO_GAME_ERROR_COST,
  HILO_GAME_HINT_COST,
  HILO_GAME_MAX_ERRORS,
  hiddenPriorDayKey,
  hiddenRoundScore,
  hiddenTotalScore,
  madridHiddenDayKey,
  makeHiddenProgress,
  minutesUntilMadridMidnight,
  normalizeHiddenAnswer,
  validHiddenProgress,
} from '@/lib/hilo-hidden-game'
import { HILO_SHARE_URL, hiddenInviteText, hiddenNativeSharePayload, hiddenShareData, hiddenShareTargets, hiddenStoryFilename } from '@/lib/hilo-hidden-share'
import { createHiddenStoryFile, saveHiddenStoryFile } from '@/lib/hilo-hidden-share-card'
import { hiddenArchiveDays, hiddenNextChallenge, hiddenPlayerStats, hiddenRoundMark } from '@/lib/hilo-hidden-archive'
import styles from './HiddenThreadGame.module.css'

const GAME_STORAGE = 'hc-hilo-escondido-v2:'
const STREAK_STORAGE = 'hc-hilo-escondido-racha-v1'
// Pausa breve para que se vea la tarjeta elegida antes de revelar si es correcta.
const SELECT_DELAY_MS = 380

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
    if (!Number.isInteger(value?.count) || value.count < 0) return { date: '', count: 0, best: 0 }
    return { ...value, best: Math.max(value.count, Number.isInteger(value.best) ? value.best : 0) }
  } catch {
    return { date: '', count: 0, best: 0 }
  }
}

// Partida terminada guardada en este navegador para un día y una modalidad (o null).
function getFinished(dayKey, mode) {
  try {
    const challenge = getHiddenChallenge(dayKey, mode)
    const raw = window.localStorage.getItem(GAME_STORAGE + challenge.id)
    if (!raw) return null
    const progress = JSON.parse(raw)
    return validHiddenProgress(progress, challenge) && progress.finished ? progress : null
  } catch {
    return null
  }
}

// Todo lo jugado: hoy y el archivo. Solo en el navegador; nunca se envía a ningún sitio.
function readLedger(todayKey) {
  const ledger = {}
  for (const dayKey of [todayKey, ...hiddenArchiveDays(todayKey)]) {
    for (const mode of ['daily', 'expert']) {
      const progress = getFinished(dayKey, mode)
      if (progress) ledger[mode + ':' + dayKey] = progress
    }
  }
  return ledger
}

function readableDay(dayKey) {
  const [year, month, day] = dayKey.split('-').map(Number)
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid', weekday: 'long', day: 'numeric', month: 'long',
  }).format(new Date(Date.UTC(year, month - 1, day, 12)))
}

function shortDay(dayKey) {
  const [year, month, day] = dayKey.split('-').map(Number)
  return new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid', weekday: 'short', day: 'numeric', month: 'short',
  }).format(new Date(Date.UTC(year, month - 1, day, 12)))
}

function ledgerMark(progress) {
  if (!progress) return ''
  return progress.rounds.map(hiddenRoundMark).join('')
}

const MODE_LABEL = { daily: 'El hilo del día', expert: 'La última chicotá' }

function countdownLabel(minutes) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!hours) return rest + ' min'
  return hours + ' h ' + String(rest).padStart(2, '0') + ' min'
}

function roundErrors(round) {
  return round.guesses.length - (round.status === 'won' ? 1 : 0)
}

function prefersReducedMotion() {
  return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)
}

export default function HiddenThreadGame({ initialDayKey = '', threads = {} }) {
  const [dateKey, setDateKey] = useState(initialDayKey)
  const [mode, setMode] = useState('daily')
  // Día que se está jugando: null es hoy; una fecha pasada es una partida del archivo.
  const [playDay, setPlayDay] = useState(null)
  // Lo jugado en este navegador (hoy y archivo). Se lee tras hidratar para no desajustar el HTML.
  const [ledger, setLedger] = useState(null)
  const [streakRecord, setStreakRecord] = useState(null)
  // La adivinanza existe ya en el HTML del servidor; el progreso local se reconcilia al hidratar.
  const [state, setState] = useState(() => initialDayKey ? {
    key: GAME_STORAGE + 'daily-' + initialDayKey,
    progress: makeHiddenProgress(getHiddenChallenge(initialDayKey, 'daily')),
  } : null)
  const [answer, setAnswer] = useState('')
  const [pending, setPending] = useState('')
  const [feedback, setFeedbackState] = useState({ text: '', tone: '' })
  const setFeedback = (text, tone = 'info') => setFeedbackState({ text, tone: text ? tone : '' })
  const [shareStatus, setShareStatus] = useState('')
  const [streak, setStreak] = useState(0)
  const [minutesLeft, setMinutesLeft] = useState(0)
  // null hasta hidratar: el menú nativo solo existe en algunos navegadores (sobre todo móviles).
  const [canNativeShare, setCanNativeShare] = useState(null)
  const targetsRef = useRef(null)
  const riddleRef = useRef(null)
  const resultRef = useRef(null)
  const pendingTimer = useRef(0)

  useEffect(() => {
    setCanNativeShare(typeof navigator.share === 'function')
  }, [])

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
      window.clearTimeout(pendingTimer.current)
    }
  }, [])

  const activeDay = playDay && playDay !== dateKey ? playDay : dateKey
  const isArchive = Boolean(dateKey && activeDay !== dateKey)
  const challenge = useMemo(
    () => (activeDay ? getHiddenChallenge(activeDay, mode) : null),
    [activeDay, mode]
  )
  const storageKey = challenge ? GAME_STORAGE + challenge.id : ''

  useEffect(() => {
    if (!challenge) return
    setState({ key: storageKey, progress: getProgress(challenge, storageKey) })
    setAnswer('')
    setPending('')
    setFeedback('')
    setShareStatus('')
    setStreak(hiddenEffectiveStreak(getStreak(), dateKey))
  }, [challenge, storageKey, dateKey])

  const progress = state?.key === storageKey ? state.progress : null
  const round = progress?.rounds[progress.stage] || null
  const word = challenge?.words[progress?.stage || 0] || null
  const completed = Boolean(progress?.finished)
  const canPlay = Boolean(progress && round && word && round.status === 'playing')
  // «Sigue el hilo»: ficha real elegida en el servidor para este día. Si el día cambia sin
  // recargar, se usa el enlace general del banco editorial.
  const thread = word && challenge?.dateKey === initialDayKey ? threads?.[word.answer] || null : null
  const options = useMemo(
    () => (challenge?.mode === 'daily' && progress ? getHiddenChoiceOptions(challenge, progress.stage) : []),
    [challenge, progress?.stage]
  )
  const shareData = useMemo(
    () => completed ? hiddenShareData(challenge, progress, { streak: isArchive ? 0 : streak }) : null,
    [challenge, progress, completed, streak, isArchive]
  )
  const shareTargets = useMemo(() => hiddenShareTargets(shareData), [shareData])

  useEffect(() => {
    // La racha solo cuenta el hilo del día jugado en su día: el archivo no la toca.
    if (mode !== 'daily' || isArchive || !progress?.finished || !dateKey) return
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
    try {
      window.localStorage.setItem(STREAK_STORAGE, JSON.stringify({ date: dateKey, count, best: Math.max(previous.best, count) }))
    } catch {
      // La partida sigue funcionando si el navegador bloquea el almacenamiento.
    }
    setStreak(count)
    setStreakRecord({ count, best: Math.max(previous.best, count) })
  }, [mode, isArchive, dateKey, progress?.finished, progress?.rounds])

  // Archivo y estadísticas: se recalculan al cambiar de día o al guardar una partida.
  useEffect(() => {
    if (!dateKey) return
    setLedger(readLedger(dateKey))
    const saved = getStreak()
    setStreakRecord({ count: hiddenEffectiveStreak(saved, dateKey), best: saved.best })
  }, [dateKey, state])

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
    const rounds = progress.rounds.map((item, index) => (index === progress.stage ? nextRound : item))
    saveProgress({ ...progress, ...otherFields, rounds })
  }

  function revealHint(index) {
    if (!canPlay || round.hints.includes(index)) return
    patchRound({ ...round, hints: [...round.hints, index] })
    setFeedback('')
  }

  function bringResultIntoView() {
    window.requestAnimationFrame(() => resultRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'nearest',
    }))
  }

  function tryGuess(value, tapped = false) {
    if (!canPlay || (mode === 'daily') !== tapped) return
    const result = evaluateHiddenGuess({ word, round, value, isChoice: tapped })
    if (result.kind === 'empty') {
      setFeedback('Escribe una palabra.')
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

    setShareStatus('')
    patchRound(result.nextRound, {
      finished: result.nextRound.status !== 'playing' && progress.stage === challenge.words.length - 1,
    })
    setAnswer('')
    if (result.kind === 'won') {
      setFeedback(
        result.proposed === normalizeHiddenAnswer(word.answer)
          ? '¡Eso es!'
          : '¡Correcto! «' + String(value).trim().toLocaleUpperCase('es-ES') + '» también vale.',
        'success'
      )
      bringResultIntoView()
    } else if (result.kind === 'lost') {
      setFeedback('Se acabaron los intentos.', 'error')
      bringResultIntoView()
    } else {
      setFeedback(
        result.remaining === 1
          ? 'No es esa. Último intento: una pista puede ayudarte.'
          : 'No es esa. Te quedan ' + result.remaining + ' intentos.',
        'error'
      )
    }
  }

  function chooseAnswer(option) {
    if (!canPlay || pending) return
    if (prefersReducedMotion()) {
      tryGuess(option, true)
      return
    }
    setPending(option)
    pendingTimer.current = window.setTimeout(() => {
      setPending('')
      tryGuess(option, true)
    }, SELECT_DELAY_MS)
  }

  function submitAnswer(event) {
    event.preventDefault()
    tryGuess(answer)
  }

  function nextStage() {
    if (!round || round.status === 'playing' || progress.stage === challenge.words.length - 1) return
    saveProgress({ ...progress, stage: progress.stage + 1 })
    setAnswer('')
    setFeedback('')
    window.requestAnimationFrame(() => {
      riddleRef.current?.focus({ preventScroll: true })
      riddleRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
    })
  }

  function openChallenge(nextDay, nextMode) {
    const day = nextDay && nextDay !== dateKey ? nextDay : null
    if (day === (isArchive ? activeDay : null) && nextMode === mode) return
    window.clearTimeout(pendingTimer.current)
    setPlayDay(day)
    setMode(nextMode)
    setFeedback('')
    setShareStatus('')
    window.requestAnimationFrame(() => document.getElementById('partida-del-hilo')?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    }))
  }

  function changeMode(nextMode) {
    openChallenge(activeDay, nextMode)
  }

  async function shareInvitation() {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: 'El hilo escondido · Hilo Cofrade',
          text: '🧵 ¿Te atreves con el reto cofrade de hoy?',
          url: HILO_SHARE_URL,
        })
        setShareStatus('Invitación compartida.')
        return
      } catch (error) {
        if (error?.name === 'AbortError') return
      }
    }
    try {
      await navigator.clipboard.writeText(hiddenInviteText())
      setShareStatus('Invitación copiada. Pégala donde quieras.')
    } catch {
      setShareStatus('Comparte este enlace: ' + HILO_SHARE_URL)
    }
  }

  function offerShareTargets(message) {
    setShareStatus(message)
    window.requestAnimationFrame(() => targetsRef.current?.querySelector('a')?.focus({ preventScroll: false }))
  }

  // Nunca termina en el portapapeles sin avisar: si no hay menú nativo o falla, se ofrecen
  // las aplicaciones directamente. Copiar queda como opción explícita.
  async function shareResult() {
    if (!shareData) return
    if (typeof navigator.share !== 'function') {
      offerShareTargets('Elige dónde compartirlo.')
      return
    }
    try {
      await navigator.share(hiddenNativeSharePayload(shareData))
      setShareStatus('Resultado compartido.')
    } catch (error) {
      if (error?.name === 'AbortError') return
      offerShareTargets('No se ha podido abrir el menú. Elige dónde compartirlo.')
    }
  }

  async function copyResult() {
    if (!shareData) return
    try {
      await navigator.clipboard.writeText(shareData.text)
      setShareStatus('Resultado copiado. Pégalo en tu red social o conversación.')
    } catch {
      offerShareTargets('Tu navegador no permite copiar. Elige dónde compartirlo.')
    }
  }

  function storyImage() {
    // Se genera dentro del mismo gesto para no perder el permiso del menú nativo.
    return createHiddenStoryFile(shareData, hiddenStoryFilename(challenge))
  }

  // Instagram no admite enlaces para compartir desde la web: se le envía la imagen 9:16.
  // Con menú nativo, Instagram aparece entre las aplicaciones (historia, publicación o
  // mensaje). Sin él, se descarga la imagen y se abre Instagram para subirla.
  async function shareInstagram() {
    if (!shareData || !challenge) return
    let image
    try {
      image = storyImage()
    } catch {
      setShareStatus('No se ha podido crear la imagen. Elige otra aplicación.')
      return
    }
    const canShareFile = typeof navigator.share === 'function'
      && typeof navigator.canShare === 'function'
      && navigator.canShare({ files: [image] })
    if (canShareFile) {
      try {
        await navigator.share({ files: [image] })
        setShareStatus('Imagen lista. Si no la has publicado, elige Instagram en el menú.')
        return
      } catch (error) {
        if (error?.name === 'AbortError') return
      }
      saveHiddenStoryFile(image)
      setShareStatus('Imagen descargada. Abre Instagram y súbela desde tu galería.')
      return
    }
    saveHiddenStoryFile(image)
    window.open('https://www.instagram.com/', '_blank', 'noopener,noreferrer')
    setShareStatus('Imagen descargada. Súbela en Instagram desde tu galería.')
  }

  function downloadStory() {
    if (!shareData || !challenge) return
    try {
      saveHiddenStoryFile(storyImage())
      setShareStatus('Imagen descargada (formato 9:16).')
    } catch {
      setShareStatus('No se ha podido crear la imagen. Comparte el resultado como texto.')
    }
  }

  if (!progress || !challenge || !word) {
    return (
      <section className={styles.game} aria-label="El hilo escondido">
        <div className={'shell ' + styles.wrap}>
          <p className={styles.loading} role="status">Preparando el reto de hoy…</p>
        </div>
      </section>
    )
  }

  // Destinos directos: sin menú nativo van delante (son la acción principal); con él, debajo.
  const shareTargetsBlock = shareData ? (
    <div className={styles.shareTargets} ref={targetsRef} role="group" aria-label="Compartir el resultado en">
      <span className={styles.shareTargetsLabel}>{canNativeShare === false ? 'Compártelo en' : 'O directamente en'}</span>
      <div className={styles.shareTargetList}>
        {shareTargets.map((target) => target.id === 'instagram' ? (
          <button
            key={target.id}
            type="button"
            className={styles.shareTarget}
            data-target={target.id}
            onClick={shareInstagram}
          >
            {target.label}
          </button>
        ) : (
          <a
            key={target.id}
            className={styles.shareTarget}
            data-target={target.id}
            href={target.href}
            {...(target.id === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
          >
            {target.label}
          </a>
        ))}
      </div>
    </div>
  ) : null

  const isDaily = mode === 'daily'
  // Encadenado: al terminar, la siguiente partida pendiente (hoy primero, luego el archivo).
  const nextChallenge = ledger && completed
    ? hiddenNextChallenge({
      todayKey: dateKey,
      current: { dayKey: activeDay, mode },
      isFinished: (dayKey, item) => Boolean(ledger[item + ':' + dayKey]),
    })
    : null
  const stats = ledger
    ? hiddenPlayerStats({
      records: Object.values(ledger).map((item) => ({ progress: item })),
      streak: streakRecord,
      todayKey: dateKey,
    })
    : null
  const archiveDays = ledger ? hiddenArchiveDays(dateKey) : []
  const isFinalRound = progress.stage === challenge.words.length - 1
  const usedErrors = roundErrors(round)
  const attemptsLeft = Math.max(0, HILO_GAME_MAX_ERRORS - usedErrors)
  const roundPoints = round.status === 'won'
    ? hiddenRoundScore(round)
    : round.status === 'lost' ? 0
      : Math.max(10, 100 - (round.hints.length * HILO_GAME_HINT_COST) - (usedErrors * HILO_GAME_ERROR_COST))
  const nextHintIndex = canPlay ? word.hints.findIndex((_, index) => !round.hints.includes(index)) : -1
  const totalScore = hiddenTotalScore(progress)

  return (
    <section className={styles.game} aria-label="El hilo escondido">
      <div className={'shell ' + styles.wrap}>
        <div className={styles.modes} role="tablist" aria-label="Modalidad">
          <button
            type="button"
            role="tab"
            aria-selected={isDaily}
            className={styles.mode}
            onClick={() => changeMode('daily')}
          >
            <strong>El hilo del día</strong>
            <small>1 palabra</small>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={!isDaily}
            className={styles.mode}
            onClick={() => changeMode('expert')}
          >
            <strong>La última chicotá</strong>
            <small>3 palabras · experto</small>
          </button>
        </div>

        <article className={styles.board} id="partida-del-hilo" aria-labelledby="hilo-reto-titulo">
          <header className={styles.boardTop}>
            <h2 id="hilo-reto-titulo" className={styles.srOnly}>{challenge.title} · {readableDay(activeDay)}</h2>
            <span className={styles.boardMeta}>
              <span className={styles.boardDate} aria-hidden="true">{readableDay(activeDay)}</span>
              {isDaily && !isArchive && streak > 0 ? (
                <span className={styles.streak} aria-label={'Racha: ' + streak + (streak === 1 ? ' día' : ' días') + ' seguidos acertando'}>
                  <span aria-hidden="true">🔥</span> {streak} {streak === 1 ? 'día' : 'días'}
                </span>
              ) : null}
            </span>
            <button type="button" className={styles.inviteButton} onClick={shareInvitation}>
              <span aria-hidden="true">↗</span> Compartir juego
            </button>
          </header>

          {isArchive ? (
            <p className={styles.archiveBanner}>
              <span>Reto del archivo · no cuenta para la racha</span>
              <button type="button" onClick={() => openChallenge(dateKey, 'daily')}>Volver al de hoy</button>
            </p>
          ) : null}

          <div className={styles.scoreboard} aria-label="Marcador">
            <span className={styles.scorePoints}>
              <strong>{isDaily ? roundPoints : totalScore + (canPlay ? roundPoints : 0)}</strong>
              <small>{canPlay ? 'puntos en juego' : 'puntos'}</small>
            </span>
            {!isDaily ? (
              <ol className={styles.stages} aria-label="Cabos">
                {challenge.words.map((item, index) => {
                  const status = completed || index < progress.stage
                    ? progress.rounds[index].status
                    : index === progress.stage ? 'current' : 'pending'
                  return (
                    <li key={index} className={styles['stage_' + status]} aria-label={'Cabo ' + (index + 1) + ': ' + (
                      status === 'won' ? 'acertado' : status === 'lost' ? 'fallado' : status === 'current' ? 'en juego' : 'pendiente'
                    )}>
                      {status === 'won' ? '✓' : status === 'lost' ? '✕' : index + 1}
                    </li>
                  )
                })}
              </ol>
            ) : null}
            <span className={styles.attempts} aria-label={attemptsLeft + ' intentos de ' + HILO_GAME_MAX_ERRORS}>
              {Array.from({ length: HILO_GAME_MAX_ERRORS }, (_, index) => (
                <i key={index} className={index < usedErrors ? styles.attemptUsed : ''} aria-hidden="true" />
              ))}
              <small>{attemptsLeft} {attemptsLeft === 1 ? 'intento' : 'intentos'}</small>
            </span>
          </div>

          {shareStatus && !completed ? <p className={styles.status} role="status">{shareStatus}</p> : null}

          <div className={styles.riddle} ref={riddleRef} tabIndex={-1}>
            <span className={styles.riddleLabel}>
              {isDaily ? word.category : 'Cabo ' + (progress.stage + 1) + ' de 3 · ' + word.category}
            </span>
            <blockquote>{word.clue}</blockquote>
            <span className={styles.riddleLetters}>
              {normalizeHiddenAnswer(word.answer).length} letras
              {canPlay && attemptsLeft === 1 ? <> · empieza por <strong>«{word.answer.charAt(0)}»</strong></> : null}
            </span>
          </div>

          {isDaily ? (
            <div className={styles.choices} role="group" aria-label="Elige la respuesta">
              {options.map((option) => {
                const tried = round.guesses.includes(normalizeHiddenAnswer(option))
                const isAnswer = hiddenGuessMatches(word, option)
                const state = pending === option ? 'selected'
                  : tried && !isAnswer ? 'wrong'
                    : !canPlay && isAnswer ? 'correct'
                      : 'idle'
                return (
                  <button
                    type="button"
                    key={option}
                    className={styles.choice}
                    data-state={state}
                    onClick={() => chooseAnswer(option)}
                    disabled={!canPlay || state === 'wrong' || Boolean(pending)}
                    aria-pressed={state === 'selected'}
                  >
                    <span>{option.toLocaleLowerCase('es-ES')}</span>
                    {state === 'wrong' ? <b aria-label="incorrecta">✕</b> : null}
                    {state === 'correct' ? <b aria-label="correcta">✓</b> : null}
                  </button>
                )
              })}
            </div>
          ) : canPlay ? (
            <form className={styles.expertForm} onSubmit={submitAnswer}>
              <label htmlFor="hidden-thread-answer" className={styles.srOnly}>Escribe la palabra</label>
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
                enterKeyHint="send"
                placeholder="Escribe la palabra"
              />
              <button type="submit" disabled={!answer.trim()}>Responder</button>
            </form>
          ) : null}

          <p
            className={styles.feedback}
            data-tone={feedback.tone || undefined}
            role="status"
            aria-live="polite"
            hidden={!feedback.text}
          >{feedback.text}</p>

          {canPlay ? (
            <div className={styles.hints}>
              {nextHintIndex >= 0 ? (
                <button type="button" className={styles.hintButton} onClick={() => revealHint(nextHintIndex)}>
                  <span>{round.hints.length ? 'Otra pista' : 'Pedir una pista'}</span>
                  <small>{round.hints.length}/{word.hints.length} · −{HILO_GAME_HINT_COST} puntos</small>
                </button>
              ) : null}
              {round.hints.length ? (
                <ul className={styles.hintList} aria-live="polite">
                  {round.hints.map((index) => (
                    <li key={index}><strong>{word.hints[index].title}</strong> {word.hints[index].text}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          {round.status !== 'playing' ? (
            <section className={styles.result} data-status={round.status} ref={resultRef} aria-label="Solución">
              <span className={styles.resultKicker}>
                {round.status === 'won' ? '+' + hiddenRoundScore(round) + ' puntos' : 'La palabra era'}
              </span>
              <h3>{word.answer}</h3>
              <p>{word.definition}</p>
              {thread ? (
                <Link className={styles.threadCard} href={thread.href}>
                  <small>{thread.label}</small>
                  <strong>{thread.name}</strong>
                  {thread.context ? <span>{thread.context}</span> : null}
                  <i aria-hidden="true">→</i>
                </Link>
              ) : null}
              <Link className={styles.resultLink} href={word.link.href}>{word.link.text} <span aria-hidden="true">→</span></Link>
              {!isFinalRound ? (
                <button className={styles.primaryButton} type="button" onClick={nextStage}>
                  Siguiente cabo ({progress.stage + 2} de 3) <span aria-hidden="true">→</span>
                </button>
              ) : null}
            </section>
          ) : null}

          {completed && shareData ? (
            <section className={styles.finale} aria-labelledby="hilo-final-titulo">
              <h3 id="hilo-final-titulo">¡Reto completado! Comparte tu resultado</h3>

              {!isDaily ? (
                <div className={styles.connection}>
                  <strong>{challenge.words.map((item) => item.answer).join(' · ')}</strong>
                  <p>{challenge.connection}</p>
                </div>
              ) : null}

              <div className={styles.shareCard} aria-label={'Tu resultado: ' + shareData.score + ' de ' + shareData.maxScore + ' puntos'}>
                <span className={styles.shareBrand}>Hilo Cofrade · El hilo escondido</span>
                <span className={styles.shareMode}>{shareData.mode} · {shareData.date}</span>
                <strong className={styles.shareScore}>{shareData.score}<small> / {shareData.maxScore}</small></strong>
                <span className={styles.shareMarks} aria-label={shareData.winners + ' de ' + shareData.rounds + ' acertadas'}>{shareData.marks}</span>
                <span className={styles.shareInvite}>¿Lo superas? hilocofrade.es</span>
              </div>

              {canNativeShare === false ? shareTargetsBlock : null}
              <div className={styles.shareActions}>
                {canNativeShare !== false ? (
                  <button type="button" className={styles.primaryButton} onClick={shareResult}>
                    Compartir resultado <span aria-hidden="true">↗</span>
                  </button>
                ) : null}
                <button type="button" className={styles.secondaryButton} onClick={downloadStory} aria-label="Guardar la imagen del resultado (formato 9:16)">
                  Guardar imagen
                </button>
                <button type="button" className={styles.secondaryButton} onClick={copyResult}>Copiar texto</button>
              </div>
              {canNativeShare === false ? null : shareTargetsBlock}
              {shareStatus ? <p className={styles.status} role="status">{shareStatus}</p> : null}
              <p className={styles.shareNote}>Sin respuestas ni pistas. A Instagram se envía como imagen.</p>

              <p className={styles.comeBack}>
                {isArchive ? <>Partida del archivo: no cuenta para la racha. </> : isDaily ? (
                  progress.rounds[0]?.status === 'won'
                    ? (streak > 1
                      ? <>Llevas <strong>{streak} días</strong> seguidos acertando. </>
                      : <>Empieza tu racha: <strong>1 día</strong>. </>)
                    : <>La racha vuelve a empezar. </>
                ) : null}
                {minutesLeft ? <>Nuevo reto en <strong>{countdownLabel(minutesLeft)}</strong>.</> : 'Nuevo reto mañana.'}
              </p>
              {nextChallenge ? (
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => openChallenge(nextChallenge.dayKey, nextChallenge.mode)}
                >
                  {nextChallenge.dayKey === dateKey
                    ? (nextChallenge.mode === 'expert' ? 'Jugar a La última chicotá' : 'Jugar al hilo del día')
                    : 'Siguiente: ' + MODE_LABEL[nextChallenge.mode] + ' del ' + shortDay(nextChallenge.dayKey)}
                  {' '}<span aria-hidden="true">→</span>
                </button>
              ) : ledger ? (
                <p className={styles.allDone}>Has desenredado todos los hilos publicados. Mañana, uno nuevo.</p>
              ) : null}
              {isArchive ? (
                <button type="button" className={styles.secondaryButton + ' ' + styles.backToday} onClick={() => openChallenge(dateKey, 'daily')}>
                  Volver al reto de hoy
                </button>
              ) : null}

              {stats && stats.played ? (
                <div className={styles.stats} aria-label="Tus números en El hilo escondido">
                  <span className={styles.statsTitle}>Tus números</span>
                  <dl className={styles.statsGrid}>
                    <div><dt>Retos</dt><dd>{stats.played}<small>/{stats.available}</small></dd></div>
                    <div><dt>Aciertos</dt><dd>{stats.winRate}<small>%</small></dd></div>
                    <div><dt>Racha</dt><dd>{stats.currentStreak}<small> · mejor {stats.bestStreak}</small></dd></div>
                    <div><dt>Perfectas</dt><dd>{stats.perfect}<small> ✦</small></dd></div>
                  </dl>
                </div>
              ) : null}
            </section>
          ) : null}
        </article>

        {archiveDays.length ? (
          <section className={styles.archive} aria-labelledby="hilo-archivo-titulo">
            <header className={styles.archiveTop}>
              <h2 id="hilo-archivo-titulo">Retos anteriores</h2>
              {stats ? <span>{stats.played} de {stats.available} completados</span> : null}
            </header>
            <p className={styles.archiveNote}>Juega los días que te perdiste. No cuentan para la racha.</p>
            <ol className={styles.archiveList}>
              {archiveDays.map((dayKey) => (
                <li key={dayKey}>
                  <span className={styles.archiveDay}>{shortDay(dayKey)}</span>
                  {['daily', 'expert'].map((item) => {
                    const done = ledger?.[item + ':' + dayKey]
                    const current = isArchive && activeDay === dayKey && mode === item
                    return (
                      <button
                        key={item}
                        type="button"
                        className={styles.archiveItem}
                        data-done={done ? 'true' : 'false'}
                        aria-current={current ? 'true' : undefined}
                        aria-label={MODE_LABEL[item] + ' del ' + shortDay(dayKey) + (done ? ', jugado: ' + ledgerMark(done) : ', pendiente')}
                        onClick={() => openChallenge(dayKey, item)}
                      >
                        <small>{item === 'daily' ? 'Del día' : 'Chicotá'}</small>
                        <strong>{done ? ledgerMark(done) : 'Jugar'}</strong>
                      </button>
                    )
                  })}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <p className={styles.privacy}>Una partida nueva cada día. Tu progreso se guarda solo en este navegador.</p>
      </div>
    </section>
  )
}

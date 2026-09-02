'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import styles from '../bandas.module.css'

function measureRail(element, total) {
  const cards = Array.from(element?.children || [])
  const firstCard = cards[0]
  if (!element || !firstCard || !total) {
    return { first: 0, last: 0, canGoBack: false, canGoForward: false }
  }

  const gap = Number.parseFloat(window.getComputedStyle(element).columnGap) || 0
  const step = firstCard.getBoundingClientRect().width + gap
  const first = Math.min(total - 1, Math.max(0, Math.round(element.scrollLeft / step)))
  const visible = Math.max(1, Math.floor((element.clientWidth + gap) / step))
  const maxScroll = Math.max(0, element.scrollWidth - element.clientWidth)

  return {
    first,
    last: Math.min(total, first + visible),
    canGoBack: element.scrollLeft > 6,
    canGoForward: element.scrollLeft < maxScroll - 6,
  }
}

export default function HistoricalAccompanimentsRail({ children, count }) {
  const railRef = useRef(null)
  const [state, setState] = useState({
    first: 0,
    last: Math.min(count, 3),
    canGoBack: false,
    canGoForward: count > 3,
  })

  const updateState = useCallback(() => {
    setState(measureRail(railRef.current, count))
  }, [count])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return undefined

    updateState()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateState)
    observer?.observe(rail)
    rail.addEventListener('scroll', updateState, { passive: true })

    return () => {
      observer?.disconnect()
      rail.removeEventListener('scroll', updateState)
    }
  }, [updateState])

  function move(direction) {
    const rail = railRef.current
    const card = rail?.firstElementChild
    if (!rail || !card) return
    const gap = Number.parseFloat(window.getComputedStyle(rail).columnGap) || 0
    rail.scrollBy({
      left: direction * (card.getBoundingClientRect().width + gap),
      behavior: 'smooth',
    })
  }

  function handleKeyDown(event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    move(event.key === 'ArrowLeft' ? -1 : 1)
  }

  return <div className={styles.historicalRail}>
    <div className={styles.historicalRailToolbar}>
      <div className={styles.historicalRailStatus} id="historical-accompaniments-status" aria-live="polite">
        <strong>{state.first + 1}–{state.last} de {count}</strong>
        <span>De la etapa más reciente a la más antigua</span>
      </div>
      {count > 1 ? <div className={styles.historicalRailControls}>
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={!state.canGoBack}
          aria-label="Ver acompañamientos históricos anteriores"
          aria-controls="historical-accompaniments-rail"
        >
          <span aria-hidden="true">←</span>
        </button>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={!state.canGoForward}
          aria-label="Ver más acompañamientos históricos"
          aria-controls="historical-accompaniments-rail"
        >
          <span aria-hidden="true">→</span>
        </button>
      </div> : null}
    </div>
    <div
      className={styles.historicalList}
      id="historical-accompaniments-rail"
      ref={railRef}
      role="region"
      aria-label="Archivo cronológico de acompañamientos históricos"
      aria-describedby="historical-accompaniments-status"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  </div>
}

'use client'

import { useEffect, useState } from 'react'
import { countdownParts } from '@/lib/home-pulse'
import styles from './HomePulse.module.css'

const pad = (value) => String(value).padStart(2, '0')

// Reloj en vivo hasta el Viernes de Dolores. El servidor pinta los días; las
// horas, minutos y segundos aparecen al cargar en el navegador (sin desajustes
// de hidratación) y se actualizan cada segundo.
export default function PulseClock({ target, figure, label }) {
  const [parts, setParts] = useState(null)

  useEffect(() => {
    const tick = () => setParts(countdownParts(target))
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [target])

  const days = parts ? new Intl.NumberFormat('es-ES').format(parts.days) : figure
  const dayLabel = parts && parts.days === 1 ? label.replace(/^días/, 'día') : label

  return (
    <>
      <span className={styles.clockRow}>
        <svg className={styles.clockIcon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <b className={styles.figure}>{days}</b>
        <span className={styles.label}>{dayLabel}</span>
      </span>
      <span className={styles.clock} aria-hidden="true">
        {parts ? (
          <>
            <span><b>{pad(parts.hours)}</b> h</span>
            <span><b>{pad(parts.minutes)}</b> min</span>
            <span><b>{pad(parts.seconds)}</b> s</span>
          </>
        ) : (
          <span>&nbsp;</span>
        )}
      </span>
    </>
  )
}

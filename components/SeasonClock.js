'use client'

import { useEffect, useState } from 'react'
import { countdownParts } from '@/lib/home-pulse'
import styles from './HomeSeason2027.module.css'

const pad = (value) => String(value).padStart(2, '0')

// Reloj grande de la tarjeta «Semana Santa 2027». El servidor pinta los días;
// horas, minutos y segundos aparecen en el navegador (sin desajuste de
// hidratación) y se actualizan cada segundo.
export default function SeasonClock({ target, days }) {
  const [parts, setParts] = useState(null)

  useEffect(() => {
    const tick = () => setParts(countdownParts(target))
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [target])

  const dayValue = parts ? new Intl.NumberFormat('es-ES').format(parts.days) : days
  return (
    <p className={styles.clock}>
      <span><b>{dayValue}</b>d</span>
      {parts ? (
        <span aria-hidden="true">
          {' '}<b>{pad(parts.hours)}</b>h <b>{pad(parts.minutes)}</b>m <b>{pad(parts.seconds)}</b>s
        </span>
      ) : null}
    </p>
  )
}

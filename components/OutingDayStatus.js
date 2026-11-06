'use client'

import { useEffect, useState } from 'react'
import { countdownLabel, getProcessionLiveState, minutesUntilDeparture } from '@/lib/procession-live-status'
import styles from './BrotherhoodChapterOuting.module.css'

// Estado del día de la salida, calculado en el móvil con la hora de Madrid y el
// horario publicado: cuenta atrás, «En la calle» y «Recogida (según horario)».
// No indica dónde está el cortejo. Antes del día no muestra nada (el servidor
// ya pinta «Este domingo»); sin hora de entrada nunca afirma que siga en la calle.
function describe(outing, now) {
  const state = getProcessionLiveState({ date: outing.date, startTime: outing.departureTime, endTime: outing.returnTime }, now)
  const countdown = countdownLabel(minutesUntilDeparture({ date: outing.date, startTime: outing.departureTime }, now))
  if (countdown) return { tone: 'soon', text: countdown }
  if (state.state === 'live') return { tone: 'live', text: outing.returnTime ? `En la calle · entrada a las ${outing.returnTime}` : 'En la calle' }
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(now) === outing.date
  if (state.state === 'done') return today ? { tone: 'done', text: 'Recogida, según el horario previsto' } : null
  if (state.state === 'today' && state.label === 'Horario incompleto' && outing.departureTime) return { tone: 'live', text: `Salió a las ${outing.departureTime} · entrada por confirmar` }
  return null
}

export default function OutingDayStatus({ outing, className = '' }) {
  const [status, setStatus] = useState(null)
  useEffect(() => {
    const update = () => setStatus(describe(outing, new Date()))
    update()
    const timer = window.setInterval(update, 30_000)
    return () => window.clearInterval(timer)
  }, [outing])
  if (!status) return null
  return <p className={`${styles.dayStatus} ${styles[`day_${status.tone}`] || ''} ${className}`} role="status">
    {status.tone === 'live' ? <span className={styles.livePulse} aria-hidden="true" /> : null}
    {status.text}
  </p>
}

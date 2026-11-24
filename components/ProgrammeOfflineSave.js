'use client'

import { useEffect, useState } from 'react'
import { trackEvent } from '@/lib/analytics/client'
import styles from './ProgrammeOfflineSave.module.css'

// «Guardar sin cobertura» (24/11/2026): pide al service worker que descargue
// la portada y las 11 jornadas del programa de mano para usarlas sin red.

function ask(message, onMessage) {
  const controller = navigator.serviceWorker?.controller
  if (!controller) return false
  const channel = new MessageChannel()
  channel.port1.onmessage = (event) => onMessage(event.data || {})
  controller.postMessage(message, [channel.port2])
  return true
}

export default function ProgrammeOfflineSave() {
  const [state, setState] = useState({ phase: 'checking', done: 0, total: 0 })

  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setState({ phase: 'unsupported', done: 0, total: 0 })
      return
    }
    let alive = true
    navigator.serviceWorker.ready.then(() => {
      const sent = ask({ type: 'hc:programme-status' }, (data) => {
        if (!alive || data.type !== 'status') return
        setState({ phase: data.saved === data.total && data.total ? 'saved' : 'idle', done: data.saved, total: data.total })
      })
      if (!sent && alive) setState({ phase: 'idle', done: 0, total: 0 })
    })
    return () => { alive = false }
  }, [])

  const save = () => {
    setState((current) => ({ ...current, phase: 'saving', done: 0 }))
    trackEvent('programme_offline', { offline_step: 'start' })
    const sent = ask({ type: 'hc:save-programme' }, (data) => {
      if (data.type === 'progress') setState({ phase: 'saving', done: data.done, total: data.total })
      if (data.type === 'done') {
        const ok = data.failed === 0
        setState({ phase: ok ? 'saved' : 'partial', done: data.done, total: data.total })
        trackEvent('programme_offline', { offline_step: ok ? 'saved' : 'partial' })
      }
    })
    if (!sent) setState({ phase: 'reload', done: 0, total: 0 })
  }

  if (state.phase === 'unsupported' || state.phase === 'checking') return null

  return (
    <div className={styles.box} data-phase={state.phase}>
      <span className={styles.icon} aria-hidden="true">
        <svg viewBox="0 0 24 24"><path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19h14" /></svg>
      </span>
      <p className={styles.copy} role="status" aria-live="polite">
        {state.phase === 'saved' ? <><strong>Guardado en tu móvil.</strong> Las 11 jornadas funcionan sin cobertura.</> : null}
        {state.phase === 'saving' ? <><strong>Guardando…</strong> {state.done} de {state.total || 12} páginas.</> : null}
        {state.phase === 'partial' ? <><strong>Guardado a medias</strong> ({state.done} de {state.total}). Vuelve a intentarlo con buena cobertura.</> : null}
        {state.phase === 'reload' ? <><strong>Recarga la página</strong> una vez y vuelve a pulsar para guardarlo.</> : null}
        {state.phase === 'idle' ? <><strong>¿Sin cobertura en la calle?</strong> Guarda el programa completo en tu móvil.</> : null}
      </p>
      {state.phase === 'idle' || state.phase === 'partial' ? (
        <button type="button" className={styles.button} onClick={save}>Guardar sin cobertura</button>
      ) : null}
    </div>
  )
}

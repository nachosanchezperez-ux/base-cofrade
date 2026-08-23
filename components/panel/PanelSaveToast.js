'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import styles from './PanelSaveToast.module.css'

const FEEDBACK_KEYS = ['saved', 'created', 'updated', 'archived', 'deleted', 'removed', 'restored', 'uploaded']

function defaultMessage(searchParams) {
  if (searchParams.has('created')) return 'Contenido creado correctamente.'
  if (searchParams.has('archived')) return 'Contenido archivado correctamente.'
  if (searchParams.has('deleted') || searchParams.has('removed')) return 'Cambio aplicado correctamente.'
  if (searchParams.has('restored')) return 'Contenido restaurado correctamente.'
  if (searchParams.has('uploaded')) return 'Archivo guardado correctamente.'
  return 'Cambios guardados correctamente.'
}

export default function PanelSaveToast() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [message, setMessage] = useState('')
  const hideTimer = useRef(null)
  const feedbackSignal = FEEDBACK_KEYS
    .map((key) => `${key}:${searchParams.get(key) || ''}`)
    .filter((value) => !value.endsWith(':'))
    .join('|')
  const fallbackMessage = defaultMessage(searchParams)

  useEffect(() => {
    if (!feedbackSignal) return undefined

    const seen = new WeakSet()
    let fallbackTimer = null
    let animationFrame = null

    function showToast(nextMessage) {
      if (!nextMessage) return
      window.clearTimeout(hideTimer.current)
      setMessage(nextMessage)
      hideTimer.current = window.setTimeout(() => setMessage(''), 3000)
    }

    function scanForPageNotice() {
      const candidates = document.querySelectorAll('[role="status"], [class*="savedNotice"]')
      for (const candidate of candidates) {
        if (candidate.closest('[data-panel-toast-root]') || candidate.hidden || seen.has(candidate)) continue
        const text = candidate.textContent?.replace(/\s+/g, ' ').trim()
        if (!text) continue
        seen.add(candidate)
        candidate.hidden = true
        showToast(text)
        return true
      }
      return false
    }

    const observer = new MutationObserver(() => scanForPageNotice())
    observer.observe(document.body, { childList: true, subtree: true })

    animationFrame = requestAnimationFrame(() => {
      if (!scanForPageNotice()) {
        fallbackTimer = window.setTimeout(() => {
          if (!scanForPageNotice()) showToast(fallbackMessage)
        }, 80)
      }
    })

    return () => {
      observer.disconnect()
      cancelAnimationFrame(animationFrame)
      window.clearTimeout(fallbackTimer)
    }
  }, [pathname, feedbackSignal, fallbackMessage])

  useEffect(() => () => window.clearTimeout(hideTimer.current), [])

  if (!message) return null

  return (
    <div className={styles.layer} data-panel-toast-root>
      <div className={styles.toast} role="status" aria-live="polite">
        <span className={styles.icon} aria-hidden="true">✓</span>
        <div>
          <strong>Actualización completada</strong>
          <span>{message}</span>
        </div>
        <button type="button" onClick={() => setMessage('')} aria-label="Cerrar mensaje">×</button>
      </div>
    </div>
  )
}

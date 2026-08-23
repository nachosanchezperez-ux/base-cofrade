'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import styles from './PanelEditState.module.css'

const FEEDBACK_KEYS = ['saved', 'created', 'updated', 'archived', 'deleted', 'removed', 'restored', 'uploaded']
const DESTRUCTIVE_LABEL = /eliminar|retirar|borrar|archivar|desvincular/i

function isEditableControl(target) {
  if (!(target instanceof HTMLElement)) return false
  if (!target.matches('input, select, textarea')) return false
  if (target.matches('input[type="hidden"], input[type="submit"], input[type="button"], input[type="reset"]')) return false
  return !target.hasAttribute('disabled') && !target.hasAttribute('readonly')
}

function isMutationForm(form) {
  if (!(form instanceof HTMLFormElement)) return false
  if (!form.closest('[data-panel-main]')) return false
  if (form.dataset.panelEditState === 'ignore') return false
  return String(form.method || 'get').toLowerCase() !== 'get'
}

function canQuickSave(form) {
  if (!isMutationForm(form)) return false
  const submitters = [...form.querySelectorAll('button[type="submit"], input[type="submit"]')]
  if (submitters.length !== 1) return false
  const label = submitters[0].textContent || submitters[0].value || ''
  return !DESTRUCTIVE_LABEL.test(label)
}

export default function PanelEditState() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryKey = searchParams.toString()
  const activeFormRef = useRef(null)
  const previousPathRef = useRef(pathname)
  const fallbackTimerRef = useRef(null)
  const savedTimerRef = useRef(null)
  const [state, setState] = useState('idle')
  const [quickSaveAvailable, setQuickSaveAvailable] = useState(false)

  const feedbackSignal = useMemo(() => {
    const params = new URLSearchParams(queryKey)
    return FEEDBACK_KEYS
      .map((key) => `${key}:${params.get(key) || ''}`)
      .filter((value) => !value.endsWith(':'))
      .join('|')
  }, [queryKey])

  useEffect(() => {
    function markDirty(event) {
      const target = event.target
      if (!isEditableControl(target)) return
      const form = target.closest('form')
      if (!isMutationForm(form)) return

      activeFormRef.current = form
      setQuickSaveAvailable(canQuickSave(form))
      setState('dirty')
    }

    function markPending(event) {
      const form = event.target
      if (!isMutationForm(form)) return

      activeFormRef.current = form
      setQuickSaveAvailable(false)
      setState('pending')
      window.clearTimeout(fallbackTimerRef.current)
      fallbackTimerRef.current = window.setTimeout(() => setState('idle'), 15000)
    }

    document.addEventListener('input', markDirty, true)
    document.addEventListener('change', markDirty, true)
    document.addEventListener('submit', markPending, true)

    return () => {
      document.removeEventListener('input', markDirty, true)
      document.removeEventListener('change', markDirty, true)
      document.removeEventListener('submit', markPending, true)
      window.clearTimeout(fallbackTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!feedbackSignal) return undefined

    window.clearTimeout(fallbackTimerRef.current)
    window.clearTimeout(savedTimerRef.current)
    activeFormRef.current = null
    setQuickSaveAvailable(false)
    setState('saved')
    savedTimerRef.current = window.setTimeout(() => setState('idle'), 3000)

    return () => window.clearTimeout(savedTimerRef.current)
  }, [feedbackSignal])

  useEffect(() => {
    if (previousPathRef.current === pathname) return
    previousPathRef.current = pathname
    activeFormRef.current = null
    setQuickSaveAvailable(false)
    if (!feedbackSignal) setState('idle')
  }, [pathname, feedbackSignal])

  useEffect(() => () => {
    window.clearTimeout(fallbackTimerRef.current)
    window.clearTimeout(savedTimerRef.current)
  }, [])

  function quickSave() {
    const form = activeFormRef.current
    if (!form || !canQuickSave(form) || state !== 'dirty') return
    form.requestSubmit()
  }

  if (state === 'idle') return null

  return (
    <div className={`${styles.dock} ${styles[state]}`} role="status" aria-live="polite">
      <span className={styles.statusMark} aria-hidden="true" />
      <strong>
        {state === 'dirty' ? 'Cambios sin guardar' : state === 'pending' ? 'Guardando cambios…' : 'Guardado'}
      </strong>
      {state === 'dirty' && quickSaveAvailable ? (
        <button type="button" onClick={quickSave}>Guardar cambios</button>
      ) : null}
      {state === 'saved' ? <span className={styles.savedCheck} aria-hidden="true">✓</span> : null}
    </div>
  )
}

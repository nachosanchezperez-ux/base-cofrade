'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import styles from './PanelEditState.module.css'

const FEEDBACK_KEYS = ['saved', 'created', 'updated', 'archived', 'deleted', 'removed', 'restored', 'uploaded']
const DESTRUCTIVE_LABEL = /eliminar|retirar|borrar|archivar|desvincular/i
const UNSAVED_MESSAGE = 'Hay cambios sin guardar. ¿Quieres salir sin guardarlos?'

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

function isSameDocumentAnchor(anchor) {
  try {
    const destination = new URL(anchor.href, window.location.href)
    return destination.origin === window.location.origin
      && destination.pathname === window.location.pathname
      && destination.search === window.location.search
      && Boolean(destination.hash)
  } catch {
    return false
  }
}

export default function PanelEditState() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryKey = searchParams.toString()
  const activeFormRef = useRef(null)
  const previousPathRef = useRef(pathname)
  const fallbackTimerRef = useRef(null)
  const savedTimerRef = useRef(null)
  const stateRef = useRef('idle')
  const [state, setState] = useState('idle')
  const [quickSaveAvailable, setQuickSaveAvailable] = useState(false)

  function updateState(nextState) {
    stateRef.current = nextState
    setState(nextState)
  }

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
      updateState('dirty')
    }

    function markPending(event) {
      const form = event.target
      if (!isMutationForm(form)) return

      activeFormRef.current = form
      setQuickSaveAvailable(false)
      updateState('pending')
      window.clearTimeout(fallbackTimerRef.current)
      fallbackTimerRef.current = window.setTimeout(() => updateState('idle'), 15000)
    }

    function handleKeyboardSave(event) {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 's') return
      if (stateRef.current !== 'dirty') return
      const form = activeFormRef.current
      if (!form || !canQuickSave(form)) return

      event.preventDefault()
      form.requestSubmit()
    }

    function protectNavigation(event) {
      if (stateRef.current !== 'dirty') return
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = event.target instanceof Element ? event.target.closest('a[href]') : null
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download') || isSameDocumentAnchor(anchor)) return

      let destination
      try {
        destination = new URL(anchor.href, window.location.href)
      } catch {
        return
      }
      if (destination.origin !== window.location.origin) return
      if (destination.pathname === window.location.pathname && destination.search === window.location.search) return

      if (!window.confirm(UNSAVED_MESSAGE)) {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      activeFormRef.current = null
      setQuickSaveAvailable(false)
      updateState('idle')
    }

    function protectUnload(event) {
      if (stateRef.current !== 'dirty') return
      event.preventDefault()
      event.returnValue = ''
    }

    document.addEventListener('input', markDirty, true)
    document.addEventListener('change', markDirty, true)
    document.addEventListener('submit', markPending, true)
    document.addEventListener('keydown', handleKeyboardSave, true)
    document.addEventListener('click', protectNavigation, true)
    window.addEventListener('beforeunload', protectUnload)

    return () => {
      document.removeEventListener('input', markDirty, true)
      document.removeEventListener('change', markDirty, true)
      document.removeEventListener('submit', markPending, true)
      document.removeEventListener('keydown', handleKeyboardSave, true)
      document.removeEventListener('click', protectNavigation, true)
      window.removeEventListener('beforeunload', protectUnload)
      window.clearTimeout(fallbackTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!feedbackSignal) return undefined

    window.clearTimeout(fallbackTimerRef.current)
    window.clearTimeout(savedTimerRef.current)
    activeFormRef.current = null
    setQuickSaveAvailable(false)
    updateState('saved')
    savedTimerRef.current = window.setTimeout(() => updateState('idle'), 3000)

    return () => window.clearTimeout(savedTimerRef.current)
  }, [feedbackSignal])

  useEffect(() => {
    if (previousPathRef.current === pathname) return
    previousPathRef.current = pathname
    activeFormRef.current = null
    setQuickSaveAvailable(false)
    if (!feedbackSignal) updateState('idle')
  }, [pathname, feedbackSignal])

  useEffect(() => () => {
    window.clearTimeout(fallbackTimerRef.current)
    window.clearTimeout(savedTimerRef.current)
  }, [])

  function quickSave() {
    const form = activeFormRef.current
    if (!form || !canQuickSave(form) || stateRef.current !== 'dirty') return
    form.requestSubmit()
  }

  if (state === 'idle') return null

  return (
    <div className={`${styles.dock} ${styles[state]}`} role="status" aria-live="polite" data-panel-toast-root>
      <span className={styles.statusMark} aria-hidden="true" />
      <strong>
        {state === 'dirty' ? 'Cambios sin guardar' : state === 'pending' ? 'Guardando cambios…' : 'Guardado'}
      </strong>
      {state === 'dirty' && quickSaveAvailable ? (
        <button type="button" onClick={quickSave}>
          Guardar cambios <span className={styles.shortcut} aria-hidden="true">⌘/Ctrl S</span>
        </button>
      ) : null}
      {state === 'saved' ? <span className={styles.savedCheck} aria-hidden="true">✓</span> : null}
    </div>
  )
}

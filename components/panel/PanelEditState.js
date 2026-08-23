'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import styles from './PanelEditState.module.css'

const FEEDBACK_KEYS = ['saved', 'created', 'updated', 'archived', 'deleted', 'removed', 'restored', 'uploaded']
const DESTRUCTIVE_LABEL = /eliminar|retirar|borrar|archivar|desvincular/i
const UNSAVED_MESSAGE = 'Hay cambios sin guardar. ¿Quieres salir sin guardarlos?'
const DRAFT_PREFIX = 'hilo-panel-draft:'

function isEditableControl(target) {
  if (!(target instanceof HTMLElement)) return false
  if (!target.matches('input, select, textarea')) return false
  if (target.matches('input[type="hidden"], input[type="submit"], input[type="button"], input[type="reset"]')) return false
  return !target.hasAttribute('disabled') && !target.hasAttribute('readonly')
}

function isPersistableControl(target) {
  return isEditableControl(target) && !target.matches('input[type="file"]')
}

function persistableControls(form) {
  return [...form.elements].filter((element) => isPersistableControl(element))
}

function isMutationForm(form) {
  if (!(form instanceof HTMLFormElement)) return false
  if (!form.closest('[data-panel-main]')) return false
  if (form.dataset.panelEditState === 'ignore') return false
  return String(form.method || 'get').toLowerCase() !== 'get'
}

function mutationForms() {
  return [...document.querySelectorAll('[data-panel-main] form')].filter((form) => isMutationForm(form))
}

function canQuickSave(form) {
  if (!isMutationForm(form)) return false
  const submitters = [...form.querySelectorAll('button[type="submit"], input[type="submit"]')]
  if (submitters.length !== 1) return false
  const label = submitters[0].textContent || submitters[0].value || ''
  return !DESTRUCTIVE_LABEL.test(label)
}

function formDraftKey(pathname, form) {
  const hiddenIdentity = [...form.querySelectorAll('input[type="hidden"][name]')]
    .filter((input) => input.value && (input.name.endsWith('_id') || input.name === 'return_path' || input.name === 'role'))
    .slice(0, 5)
    .map((input) => `${input.name}=${input.value}`)
    .join('|')
  const submitter = form.querySelector('button[type="submit"], input[type="submit"]')
  const submitLabel = submitter?.textContent || submitter?.value || ''
  const fieldSignature = persistableControls(form).slice(0, 8).map((control) => control.name || control.type).join(',')
  const fallbackIndex = mutationForms().indexOf(form)
  const identity = `${hiddenIdentity}|${submitLabel}|${fieldSignature}|${fallbackIndex}`
  return `${DRAFT_PREFIX}${pathname}::${encodeURIComponent(identity)}`
}

function snapshotForm(form) {
  return persistableControls(form).map((control) => ({
    name: control.name,
    type: control.type,
    value: control.value,
    checked: 'checked' in control ? control.checked : undefined,
    selected: control instanceof HTMLSelectElement && control.multiple
      ? [...control.selectedOptions].map((option) => option.value)
      : undefined,
  }))
}

function persistDraft(pathname, form) {
  try {
    const key = formDraftKey(pathname, form)
    sessionStorage.setItem(key, JSON.stringify({ fields: snapshotForm(form), savedAt: Date.now() }))
    return key
  } catch {
    return ''
  }
}

function restoreForm(form, snapshot) {
  const controls = persistableControls(form)
  if (!Array.isArray(snapshot?.fields) || snapshot.fields.length !== controls.length) return false

  snapshot.fields.forEach((field, index) => {
    const control = controls[index]
    if (!control || field.name !== control.name || field.type !== control.type) return

    if (control instanceof HTMLSelectElement && control.multiple && Array.isArray(field.selected)) {
      const selected = new Set(field.selected)
      ;[...control.options].forEach((option) => { option.selected = selected.has(option.value) })
      return
    }

    if ('checked' in control && typeof field.checked === 'boolean') control.checked = field.checked
    if (field.value !== undefined && control.type !== 'checkbox' && control.type !== 'radio') control.value = field.value
  })
  return true
}

function clearDraftsForPath(pathname) {
  try {
    const prefix = `${DRAFT_PREFIX}${pathname}::`
    const keys = []
    for (let index = 0; index < sessionStorage.length; index += 1) {
      const key = sessionStorage.key(index)
      if (key?.startsWith(prefix)) keys.push(key)
    }
    keys.forEach((key) => sessionStorage.removeItem(key))
  } catch {}
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
  const activeDraftKeyRef = useRef('')
  const restoredKeysRef = useRef(new Set())
  const previousPathRef = useRef(pathname)
  const fallbackTimerRef = useRef(null)
  const savedTimerRef = useRef(null)
  const restoreFrameRef = useRef(null)
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
    function tryRestoreDrafts() {
      if (feedbackSignal) return
      let restoredForm = null
      let restoredKey = ''

      mutationForms().forEach((form) => {
        const key = formDraftKey(pathname, form)
        if (restoredKeysRef.current.has(key)) return
        let snapshot = null
        try {
          snapshot = JSON.parse(sessionStorage.getItem(key) || 'null')
        } catch {
          sessionStorage.removeItem(key)
        }
        if (!snapshot || !restoreForm(form, snapshot)) return
        restoredKeysRef.current.add(key)
        restoredForm = form
        restoredKey = key
      })

      if (restoredForm) {
        activeFormRef.current = restoredForm
        activeDraftKeyRef.current = restoredKey
        setQuickSaveAvailable(canQuickSave(restoredForm))
        updateState('dirty')
      }
    }

    function queueRestore() {
      window.cancelAnimationFrame(restoreFrameRef.current)
      restoreFrameRef.current = window.requestAnimationFrame(tryRestoreDrafts)
    }

    function markDirty(event) {
      const target = event.target
      if (!isEditableControl(target)) return
      const form = target.closest('form')
      if (!isMutationForm(form)) return

      activeFormRef.current = form
      activeDraftKeyRef.current = persistDraft(pathname, form)
      setQuickSaveAvailable(canQuickSave(form))
      updateState('dirty')
    }

    function markPending(event) {
      const form = event.target
      if (!isMutationForm(form)) return

      activeFormRef.current = form
      activeDraftKeyRef.current = persistDraft(pathname, form)
      setQuickSaveAvailable(false)
      updateState('pending')
      window.clearTimeout(fallbackTimerRef.current)
      fallbackTimerRef.current = window.setTimeout(() => updateState('dirty'), 15000)
    }

    function handleActionError() {
      if (activeDraftKeyRef.current) restoredKeysRef.current.delete(activeDraftKeyRef.current)
      setQuickSaveAvailable(false)
      updateState('error')
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

      clearDraftsForPath(pathname)
      restoredKeysRef.current.clear()
      activeFormRef.current = null
      activeDraftKeyRef.current = ''
      setQuickSaveAvailable(false)
      updateState('idle')
    }

    function protectUnload(event) {
      if (stateRef.current !== 'dirty') return
      event.preventDefault()
      event.returnValue = ''
    }

    const main = document.querySelector('[data-panel-main]')
    const observer = main ? new MutationObserver(queueRestore) : null
    observer?.observe(main, { childList: true, subtree: true })

    queueRestore()
    document.addEventListener('input', markDirty, true)
    document.addEventListener('change', markDirty, true)
    document.addEventListener('submit', markPending, true)
    document.addEventListener('keydown', handleKeyboardSave, true)
    document.addEventListener('click', protectNavigation, true)
    window.addEventListener('beforeunload', protectUnload)
    window.addEventListener('panel-action-error', handleActionError)

    return () => {
      observer?.disconnect()
      document.removeEventListener('input', markDirty, true)
      document.removeEventListener('change', markDirty, true)
      document.removeEventListener('submit', markPending, true)
      document.removeEventListener('keydown', handleKeyboardSave, true)
      document.removeEventListener('click', protectNavigation, true)
      window.removeEventListener('beforeunload', protectUnload)
      window.removeEventListener('panel-action-error', handleActionError)
      window.cancelAnimationFrame(restoreFrameRef.current)
      window.clearTimeout(fallbackTimerRef.current)
    }
  }, [pathname, feedbackSignal])

  useEffect(() => {
    if (!feedbackSignal) return undefined

    window.clearTimeout(fallbackTimerRef.current)
    window.clearTimeout(savedTimerRef.current)
    if (activeDraftKeyRef.current) sessionStorage.removeItem(activeDraftKeyRef.current)
    clearDraftsForPath(pathname)
    restoredKeysRef.current.clear()
    activeFormRef.current = null
    activeDraftKeyRef.current = ''
    setQuickSaveAvailable(false)
    updateState('saved')
    savedTimerRef.current = window.setTimeout(() => updateState('idle'), 3000)

    return () => window.clearTimeout(savedTimerRef.current)
  }, [feedbackSignal, pathname])

  useEffect(() => {
    if (previousPathRef.current === pathname) return
    previousPathRef.current = pathname
    restoredKeysRef.current.clear()
    activeFormRef.current = null
    activeDraftKeyRef.current = ''
    setQuickSaveAvailable(false)
    if (!feedbackSignal) updateState('idle')
  }, [pathname, feedbackSignal])

  useEffect(() => () => {
    window.clearTimeout(fallbackTimerRef.current)
    window.clearTimeout(savedTimerRef.current)
    window.cancelAnimationFrame(restoreFrameRef.current)
  }, [])

  function quickSave() {
    const form = activeFormRef.current
    if (!form || !canQuickSave(form) || stateRef.current !== 'dirty') return
    form.requestSubmit()
  }

  if (state === 'idle') return null

  const statusLabel = state === 'dirty'
    ? 'Cambios sin guardar'
    : state === 'pending'
      ? 'Guardando cambios…'
      : state === 'error'
        ? 'No se ha guardado'
        : 'Guardado'

  return (
    <div className={`${styles.dock} ${styles[state] || ''}`} role="status" aria-live="polite" data-panel-toast-root>
      <span className={styles.statusMark} aria-hidden="true" />
      <strong>{statusLabel}</strong>
      {state === 'dirty' && quickSaveAvailable ? (
        <button type="button" onClick={quickSave}>
          Guardar cambios <span className={styles.shortcut} aria-hidden="true">⌘/Ctrl S</span>
        </button>
      ) : null}
      {state === 'saved' ? <span className={styles.savedCheck} aria-hidden="true">✓</span> : null}
    </div>
  )
}

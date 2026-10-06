'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import styles from './HiloUpdates.module.css'

const STORAGE_KEY = 'hilo:novedades:seen:v1'
const MAX_SEEN_REVISIONS = 100
const OPEN_REFRESH_MS = 60_000
const FOCUS_REFRESH_MS = 300_000
const REQUEST_TIMEOUT_MS = 15_000

function parseSeenRevisions(value) {
  try {
    const parsed = JSON.parse(value || '[]')
    if (!Array.isArray(parsed)) return []
    return [...new Set(parsed.filter((key) => typeof key === 'string' && key.length > 0 && key.length <= 512))]
      .slice(-MAX_SEEN_REVISIONS)
  } catch {
    return []
  }
}

function readSeenRevisions() {
  try {
    return parseSeenRevisions(window.localStorage.getItem(STORAGE_KEY))
  } catch {
    return []
  }
}

function normalizeItems(items) {
  const ids = new Set()
  return items.filter((item) => {
    if (!item || typeof item.id !== 'string' || ids.has(item.id)) return false
    if (typeof item.title !== 'string' || !item.title.trim()) return false
    if (typeof item.revisionKey !== 'string' || !item.revisionKey || item.revisionKey.length > 512) return false
    if (typeof item.href !== 'string' || !item.href.startsWith('/') || item.href.startsWith('//') || /[\\\u0000-\u001f\u007f]/.test(item.href)) return false
    ids.add(item.id)
    return true
  }).slice(0, 10).map((item) => ({
    ...item,
    summary: typeof item.summary === 'string' ? item.summary : '',
    label: typeof item.label === 'string' ? item.label : '',
    categoryLabel: typeof item.categoryLabel === 'string' ? item.categoryLabel : '',
    cta: typeof item.cta === 'string' ? item.cta.replace(/\s*→\s*$/, '') : '',
    dateTime: typeof item.dateTime === 'string' ? item.dateTime : '',
    dateVerb: item.dateVerb === 'Actualizado' ? 'Actualizado' : 'Añadido',
  }))
}

function madridDay(date) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(date)
}

function updateDateLabel(item) {
  if (!item.dateTime) return ''
  const date = new Date(item.dateTime)
  if (!Number.isFinite(date.getTime())) return ''
  const today = madridDay(new Date())
  const day = madridDay(date)
  const dayDifference = (Date.parse(`${today}T12:00:00Z`) - Date.parse(`${day}T12:00:00Z`)) / 86_400_000
  const label = dayDifference === 0 ? 'hoy' : dayDifference === 1 ? 'ayer' : new Intl.DateTimeFormat('es-ES', {
    timeZone: 'Europe/Madrid', day: 'numeric', month: 'short',
    ...(day.slice(0, 4) !== today.slice(0, 4) ? { year: 'numeric' } : {}),
  }).format(date)
  return `${item.dateVerb || 'Añadido'} ${label}`
}

export default function HiloUpdates() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [seenRevisions, setSeenRevisions] = useState([])
  const dialogRef = useRef(null)
  const titleRef = useRef(null)
  const triggerRef = useRef(null)
  const previousFocusRef = useRef(null)
  const restoreFocusRef = useRef(true)
  const openRef = useRef(false)
  const mountedRef = useRef(false)
  const requestRef = useRef(null)
  const lastSuccessRef = useRef(0)
  const lastAttemptRef = useRef(0)
  const seenRef = useRef([])

  const loadUpdates = useCallback(({ force = false } = {}) => {
    if (requestRef.current) return requestRef.current.promise
    if (!force && Date.now() - lastSuccessRef.current < OPEN_REFRESH_MS) return Promise.resolve()

    const controller = new AbortController()
    const request = { controller, promise: null }
    requestRef.current = request
    lastAttemptRef.current = Date.now()
    setStatus('loading')

    request.promise = (async () => {
      const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
      try {
        const response = await fetch('/api/novedades', {
          signal: controller.signal,
          credentials: 'same-origin',
          headers: { Accept: 'application/json' },
        })
        if (!response.ok) throw new Error('Updates unavailable')
        const payload = await response.json()
        if (!Array.isArray(payload.items)) throw new Error('Invalid updates response')
        const nextItems = normalizeItems(payload.items)
        if (payload.items.length && !nextItems.length) throw new Error('Invalid update items')
        if (!mountedRef.current || requestRef.current !== request) return
        lastSuccessRef.current = Date.now()
        setItems(nextItems)
        setStatus('ready')
      } catch {
        if (mountedRef.current && requestRef.current === request) setStatus('error')
      } finally {
        window.clearTimeout(timeout)
        if (requestRef.current === request) requestRef.current = null
      }
    })()
    return request.promise
  }, [])

  const closeDialog = useCallback(({ restoreFocus = true } = {}) => {
    restoreFocusRef.current = restoreFocus
    openRef.current = false
    dialogRef.current?.close()
    setOpen(false)
  }, [])

  const openDialog = useCallback(() => {
    if (openRef.current) return
    previousFocusRef.current = document.activeElement
    restoreFocusRef.current = true
    openRef.current = true
    setOpen(true)
    void loadUpdates()
  }, [loadUpdates])

  useEffect(() => {
    mountedRef.current = true
    seenRef.current = readSeenRevisions()
    setSeenRevisions(seenRef.current)
    void loadUpdates({ force: true })

    const onStorage = (event) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return
      seenRef.current = parseSeenRevisions(event.newValue)
      setSeenRevisions(seenRef.current)
    }
    const onFocus = () => {
      if (document.visibilityState === 'hidden' || Date.now() - lastAttemptRef.current < FOCUS_REFRESH_MS) return
      void loadUpdates()
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onFocus)

    return () => {
      mountedRef.current = false
      requestRef.current?.controller.abort()
      requestRef.current = null
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onFocus)
    }
  }, [loadUpdates])

  useEffect(() => {
    const onSearchOpen = () => closeDialog({ restoreFocus: false })
    const onHashChange = () => closeDialog({ restoreFocus: false })
    window.addEventListener('hilo:open-updates', openDialog)
    window.addEventListener('hilo:open-search', onSearchOpen)
    window.addEventListener('hashchange', onHashChange)
    return () => {
      window.removeEventListener('hilo:open-updates', openDialog)
      window.removeEventListener('hilo:open-search', onSearchOpen)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [openDialog, closeDialog])

  useEffect(() => {
    closeDialog({ restoreFocus: false })
  }, [pathname, closeDialog])

  useEffect(() => {
    if (!open) return undefined
    const dialog = dialogRef.current
    dialog.showModal()
    const frame = window.requestAnimationFrame(() => titleRef.current?.focus())

    return () => {
      window.cancelAnimationFrame(frame)
      if (dialog.open) dialog.close()
      if (restoreFocusRef.current) {
        window.requestAnimationFrame(() => {
          const target = previousFocusRef.current?.isConnected ? previousFocusRef.current : triggerRef.current
          target?.focus({ preventScroll: true })
        })
      }
    }
  }, [open])

  useEffect(() => {
    if (!open || status !== 'ready' || !items.length) return
    const currentKeys = items.map((item) => item.revisionKey)
    const previous = [...new Set([...seenRef.current, ...readSeenRevisions()])]
      .filter((key) => !currentKeys.includes(key))
    const next = [...previous, ...new Set(currentKeys)].slice(-MAX_SEEN_REVISIONS)
    if (JSON.stringify(next) === JSON.stringify(seenRef.current)) return
    seenRef.current = next
    setSeenRevisions(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // The current visit still works when browser storage is unavailable.
    }
  }, [open, status, items])

  const hasUnread = items.some((item) => !seenRevisions.includes(item.revisionKey))
  const onDialogKeyDown = (event) => {
    if (event.key !== 'Tab') return
    const focusable = [...(dialogRef.current?.querySelectorAll('a[href], button:not([disabled]), [tabindex="0"]') || [])]
      .filter((element) => element.getClientRects().length)
    const first = focusable[0]
    const last = focusable.at(-1)
    if (!first) {
      event.preventDefault()
      titleRef.current?.focus()
    } else if (event.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const dialog = open && typeof document !== 'undefined' ? createPortal(
    <dialog
      id="hilo-updates-dialog"
      ref={dialogRef}
      className={styles.panel}
      aria-labelledby="hilo-updates-title"
      aria-describedby="hilo-updates-description"
      onCancel={(event) => { event.preventDefault(); closeDialog() }}
      onClose={() => { openRef.current = false; setOpen(false) }}
      onKeyDown={onDialogKeyDown}
      onPointerDown={(event) => {
        if (event.target !== event.currentTarget) return
        const bounds = event.currentTarget.getBoundingClientRect()
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeDialog()
      }}
      data-hilo-updates
    >
      <header className={styles.panelHeader}>
        <div>
          <h2 id="hilo-updates-title" ref={titleRef} tabIndex={-1}>Novedades</h2>
          <p id="hilo-updates-description">Lo último que hemos incorporado a Hilo Cofrade.</p>
        </div>
        <button type="button" className={styles.close} onClick={() => closeDialog()} aria-label="Cerrar novedades">×</button>
      </header>

      <div className={styles.content}>
        {status === 'loading' ? <p className={styles.feedback} role="status">{items.length ? 'Actualizando novedades…' : 'Cargando novedades…'}</p> : null}
        {status === 'error' ? (
          <div className={styles.feedback}>
            <p role="status">No hemos podido cargar las últimas novedades.</p>
            <button type="button" className={styles.retry} onClick={() => { void loadUpdates({ force: true }) }}>Reintentar</button>
          </div>
        ) : null}
        {status === 'ready' && !items.length ? <p className={styles.feedback} role="status">Las próximas incorporaciones aparecerán aquí.</p> : null}

        {items.length ? (
          <ol className={styles.list} aria-label="Últimas actualizaciones">
            {items.map((item) => {
              const dateLabel = updateDateLabel(item)
              return (
                <li key={item.id}>
                  <Link
                    className={styles.item}
                    href={item.href}
                    prefetch={false}
                    onClick={(event) => {
                      if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) closeDialog({ restoreFocus: false })
                    }}
                    data-hilo-update-id={item.id}
                  >
                    <span className={styles.category}>{item.categoryLabel || item.label || 'Actualización'}</span>
                    <h3>{item.title}</h3>
                    {item.summary ? <p className={styles.summary}>{item.summary}</p> : null}
                    <span className={styles.itemFooter}>
                      {dateLabel ? <time dateTime={item.dateTime}>{dateLabel}</time> : null}
                      <span className={styles.cta}>{item.cta || 'Ver actualización'} <b aria-hidden="true">→</b></span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ol>
        ) : null}
      </div>
    </dialog>,
    document.body,
  ) : null

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label={hasUnread ? 'Novedades, hay actualizaciones sin leer' : 'Novedades'}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="hilo-updates-dialog"
        title="Novedades"
        onClick={() => window.dispatchEvent(new Event('hilo:open-updates'))}
        data-hilo-updates-trigger
        data-unread={hasUnread ? 'true' : 'false'}
      >
        <span className={styles.triggerIcon}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4M12 2V1" />
          </svg>
          {hasUnread ? <i className={styles.unreadDot} aria-hidden="true" /> : null}
        </span>
        <span className={styles.triggerLabel}>Novedades</span>
      </button>
      {dialog}
    </>
  )
}

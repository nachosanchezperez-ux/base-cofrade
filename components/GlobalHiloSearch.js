'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import HiloSearch from './HiloSearch'
import styles from './GlobalHiloSearch.module.css'

export default function GlobalHiloSearch() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const triggerRef = useRef(null)
  const previousFocusRef = useRef(null)

  const openDialog = useCallback(() => {
    previousFocusRef.current = document.activeElement
    setOpen(true)
  }, [])

  const closeDialog = useCallback(() => setOpen(false), [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        openDialog()
      }
    }

    document.addEventListener('keydown', onShortcut)
    return () => document.removeEventListener('keydown', onShortcut)
  }, [openDialog])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeDialog()
        return
      }
      if (event.key !== 'Tab') return

      const focusable = [...(panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ) || [])].filter((element) => !element.hasAttribute('hidden'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    const frame = window.requestAnimationFrame(() => {
      panelRef.current?.querySelector('textarea')?.focus()
    })

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)

    return () => {
      window.cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
      window.requestAnimationFrame(() => {
        const target = previousFocusRef.current?.isConnected ? previousFocusRef.current : triggerRef.current
        target?.focus()
      })
    }
  }, [open, closeDialog])

  const alternateFullPageMode = pathname === '/'
  const dialog = open && typeof document !== 'undefined' ? createPortal(
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) closeDialog()
      }}
      data-global-hilo-search
    >
      <section
        id="global-hilo-search-dialog"
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="global-hilo-search-title"
      >
        <header className={styles.header}>
          <div>
            <span>Buscador universal</span>
            <h2 id="global-hilo-search-title">Busca o pregunta</h2>
            <p>Encuentra una ficha directamente o haz una consulta sobre los datos publicados en Hilo Cofrade.</p>
          </div>
          <button type="button" className={styles.close} onClick={closeDialog} aria-label="Cerrar buscador">×</button>
        </header>

        <div className={styles.searchSurface}>
          <HiloSearch
            fullPage={alternateFullPageMode}
            universal
            onNavigate={closeDialog}
          />
        </div>

        <footer className={styles.examples}>
          <span>Prueba con</span>
          <p>«Baratillo», «ficha del Baratillo», «Banda del Sol» o «¿qué pasos tiene San Benito?»</p>
          <kbd>⌘ / Ctrl + K</kbd>
        </footer>
      </section>
    </div>,
    document.body
  ) : null

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-label="Buscar o preguntar en Hilo Cofrade"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="global-hilo-search-dialog"
        title="Buscar o preguntar"
        onClick={openDialog}
        data-hilo-event="global_search_open"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      </button>
      {dialog}
    </>
  )
}

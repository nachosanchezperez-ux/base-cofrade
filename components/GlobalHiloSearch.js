'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import HiloSearch from './HiloSearch'
import styles from './GlobalHiloSearch.module.css'

export default function GlobalHiloSearch() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const onShortcut = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen(true)
      }
    }

    document.addEventListener('keydown', onShortcut)
    return () => document.removeEventListener('keydown', onShortcut)
  }, [])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
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
    }
  }, [open])

  const alternateFullPageMode = pathname === '/'
  const dialog = open && typeof document !== 'undefined' ? createPortal(
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) setOpen(false)
      }}
      data-global-hilo-search
    >
      <section
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
          <button type="button" className={styles.close} onClick={() => setOpen(false)} aria-label="Cerrar buscador">×</button>
        </header>

        <div className={styles.searchSurface}>
          <HiloSearch
            fullPage={alternateFullPageMode}
            universal
            onNavigate={() => setOpen(false)}
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
        type="button"
        className={styles.trigger}
        aria-label="Buscar o preguntar en Hilo Cofrade"
        aria-expanded={open}
        aria-haspopup="dialog"
        title="Buscar o preguntar"
        onClick={() => setOpen(true)}
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

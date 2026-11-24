'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import styles from './HiloBackToTop.module.css'

// Botón «Volver arriba» (24/11/2026): aparece tras bajar más de pantalla y
// media, flota sobre la barra inferior en móvil y respeta «menos movimiento».
export default function HiloBackToTop() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      setVisible(window.scrollY > window.innerHeight * 1.5)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [pathname])

  if (String(pathname || '').startsWith('/panel')) return null

  const goTop = () => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }

  return (
    <button
      type="button"
      className={styles.top}
      data-visible={visible ? 'true' : 'false'}
      onClick={goTop}
      aria-label="Volver arriba"
      tabIndex={visible ? 0 : -1}
      aria-hidden={visible ? undefined : 'true'}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 19V5M5.5 11.5 12 5l6.5 6.5" /></svg>
    </button>
  )
}

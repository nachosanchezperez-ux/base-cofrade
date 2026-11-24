'use client'

import { useEffect, useState } from 'react'
import styles from './HiloServiceWorker.module.css'

// Registra el service worker (solo en producción) y avisa cuando no hay red
// (24/11/2026): «Sin conexión · estás viendo lo guardado en tu móvil».
export default function HiloServiceWorker() {
  const [offline, setOffline] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {})
    }
    const update = () => setOffline(navigator.onLine === false)
    update()
    window.addEventListener('online', update)
    window.addEventListener('offline', update)
    return () => {
      window.removeEventListener('online', update)
      window.removeEventListener('offline', update)
    }
  }, [])

  if (!offline) return null
  return (
    <p className={styles.banner} role="status">
      <span aria-hidden="true">●</span> Sin conexión · estás viendo lo guardado en tu móvil
    </p>
  )
}

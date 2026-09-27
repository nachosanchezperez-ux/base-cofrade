'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  ANALYTICS_PREFERENCES_EVENT,
  applyAnalyticsConsent,
  getStoredAnalyticsConsent,
} from '@/lib/analytics/client'
import styles from './CookieConsentBanner.module.css'

export default function CookieConsentBanner() {
  const [storedChoice, setStoredChoice] = useState(undefined)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)

  useEffect(() => {
    const stored = getStoredAnalyticsConsent()
    setStoredChoice(stored)
    setAnalyticsEnabled(stored === 'granted')

    const openPreferences = () => {
      const current = getStoredAnalyticsConsent()
      setAnalyticsEnabled(current === 'granted')
      setPreferencesOpen(true)
    }

    window.addEventListener(ANALYTICS_PREFERENCES_EVENT, openPreferences)
    return () => window.removeEventListener(ANALYTICS_PREFERENCES_EVENT, openPreferences)
  }, [])

  const decide = (value) => {
    applyAnalyticsConsent(value)
    setStoredChoice(value)
    setAnalyticsEnabled(value === 'granted')
    setPreferencesOpen(false)
  }

  if (storedChoice === undefined) return null
  if (storedChoice && !preferencesOpen) return null

  return (
    <aside className={styles.banner} aria-label="Preferencias de privacidad" role="region">
      <div className={styles.copy}>
        <strong>{preferencesOpen ? 'Preferencias de privacidad' : 'Tu privacidad en Hilo Cofrade'}</strong>
        <p>
          Usamos almacenamiento necesario para el funcionamiento del sitio. La analítica es opcional y solo se activa si la aceptas.
          {' '}<Link href="/cookies">Más información</Link>.
        </p>
      </div>

      {preferencesOpen ? (
        <div className={styles.preferences}>
          <label className={styles.preference}>
            <span>
              <strong>Necesarias</strong>
              <small>Imprescindibles para funciones y preferencias básicas.</small>
            </span>
            <input type="checkbox" checked disabled aria-label="Cookies necesarias activadas" />
          </label>
          <label className={styles.preference}>
            <span>
              <strong>Analítica</strong>
              <small>GA4, analítica de navegación y métricas de rendimiento.</small>
            </span>
            <input
              type="checkbox"
              checked={analyticsEnabled}
              onChange={(event) => setAnalyticsEnabled(event.target.checked)}
              aria-label="Permitir analítica"
            />
          </label>
          <div className={styles.actions}>
            <button type="button" className={styles.decision} onClick={() => decide('denied')}>Rechazar analítica</button>
            <button type="button" className={styles.decision} onClick={() => decide(analyticsEnabled ? 'granted' : 'denied')}>Guardar preferencias</button>
          </div>
        </div>
      ) : (
        <div className={styles.actions}>
          <button type="button" className={styles.decision} onClick={() => decide('denied')}>Rechazar</button>
          <button type="button" className={styles.preferencesButton} onClick={() => setPreferencesOpen(true)}>Preferencias</button>
          <button type="button" className={styles.decision} onClick={() => decide('granted')}>Aceptar</button>
        </div>
      )}
    </aside>
  )
}

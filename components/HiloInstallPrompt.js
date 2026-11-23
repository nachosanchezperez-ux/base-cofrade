'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { trackEvent } from '@/lib/analytics/client'
import { INSTALL_STORAGE_KEY, installPromptVariant } from '@/lib/install-prompt'
import styles from './HiloInstallPrompt.module.css'

// Aviso discreto para instalar Hilo Cofrade como aplicación. Solo en móvil, a
// partir de la segunda visita, nunca dentro de la app instalada, y 30 días de
// silencio si se cierra. Android: botón «Instalar» (aviso nativo del navegador).
// iPhone (Safari): explica Compartir → «Añadir a pantalla de inicio».

function readState() {
  try {
    return JSON.parse(window.localStorage.getItem(INSTALL_STORAGE_KEY) || '{}') || {}
  } catch {
    return {}
  }
}

function writeState(state) {
  try {
    window.localStorage.setItem(INSTALL_STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Modo privado o sin almacenamiento: el aviso simplemente no se recuerda.
  }
}

function isStandalone() {
  return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true
}

export default function HiloInstallPrompt() {
  const pathname = usePathname()
  const [variant, setVariant] = useState(null)
  const nativePrompt = useRef(null)
  const shown = useRef(false)

  // Una visita por carga de la web (no por cada cambio de página).
  useEffect(() => {
    const state = readState()
    writeState({ ...state, visits: (Number(state.visits) || 0) + 1 })
  }, [])

  useEffect(() => {
    const decide = () => setVariant(installPromptVariant({
      state: readState(),
      standalone: isStandalone(),
      pathname,
      hasNativePrompt: Boolean(nativePrompt.current),
      userAgent: window.navigator.userAgent,
    }))
    const onBeforeInstall = (event) => {
      event.preventDefault()
      nativePrompt.current = event
      decide()
    }
    const onInstalled = () => {
      trackEvent('app_install', { install_step: 'installed' })
      setVariant(null)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    decide()
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [pathname])

  useEffect(() => {
    if (variant && !shown.current) {
      shown.current = true
      trackEvent('app_install', { install_step: 'shown', install_variant: variant })
    }
  }, [variant])

  if (!variant) return null

  const dismiss = () => {
    writeState({ ...readState(), dismissedAt: Date.now() })
    trackEvent('app_install', { install_step: 'dismissed', install_variant: variant })
    setVariant(null)
  }

  const install = async () => {
    const prompt = nativePrompt.current
    if (!prompt) return
    trackEvent('app_install', { install_step: 'prompt', install_variant: variant })
    prompt.prompt()
    const choice = await prompt.userChoice.catch(() => null)
    nativePrompt.current = null
    if (choice?.outcome !== 'accepted') writeState({ ...readState(), dismissedAt: Date.now() })
    setVariant(null)
  }

  return (
    <aside className={styles.prompt} aria-label="Instalar Hilo Cofrade">
      <img className={styles.icon} src="/brand/icon-192.png" alt="" width="40" height="40" />
      <div className={styles.copy}>
        <strong>Hilo Cofrade en tu móvil</strong>
        {variant === 'ios' ? (
          <span>
            Pulsa <ShareIcon /> <b>Compartir</b> y después <b>«Añadir a pantalla de inicio»</b>.
          </span>
        ) : (
          <span>Instálala como una app: agenda y programa 2027 a un toque.</span>
        )}
      </div>
      {variant === 'native' ? (
        <button type="button" className={styles.install} onClick={install}>Instalar</button>
      ) : null}
      <button type="button" className={styles.close} onClick={dismiss} aria-label="Cerrar aviso">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
      </button>
    </aside>
  )
}

function ShareIcon() {
  return (
    <svg className={styles.share} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v12M8 7l4-4 4 4M6 11H5v9h14v-9h-1" />
    </svg>
  )
}

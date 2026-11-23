// Aviso «Añadir a la pantalla de inicio» (24/11/2026). Módulo puro: decide si
// se muestra y qué variante, para poder probarlo sin navegador.

export const INSTALL_STORAGE_KEY = 'hc:install-prompt'
export const INSTALL_MIN_VISITS = 2
export const INSTALL_SNOOZE_DAYS = 30
const DAY_MS = 86400000

// iPhone/iPad en Safari (en iOS solo Safari permite añadir a inicio con su menú).
export function isIosSafari(userAgent = '') {
  const ua = String(userAgent)
  const ios = /iphone|ipad|ipod/i.test(ua)
  const otherBrowser = /crios|fxios|edgios|opios|gsa\/|instagram|fban|fbav|line\//i.test(ua)
  return ios && /safari/i.test(ua) && !otherBrowser
}

// state: { visits, dismissedAt } guardado en localStorage.
export function installPromptVariant({ state = {}, standalone = false, pathname = '', hasNativePrompt = false, userAgent = '', now = Date.now() } = {}) {
  if (standalone) return null
  if (String(pathname).startsWith('/panel')) return null
  if ((Number(state.visits) || 0) < INSTALL_MIN_VISITS) return null
  const dismissedAt = Number(state.dismissedAt) || 0
  if (dismissedAt && now - dismissedAt < INSTALL_SNOOZE_DAYS * DAY_MS) return null
  if (hasNativePrompt) return 'native'
  if (isIosSafari(userAgent)) return 'ios'
  return null
}

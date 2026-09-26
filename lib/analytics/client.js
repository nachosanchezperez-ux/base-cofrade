'use client'

export const ANALYTICS_CONSENT_KEY = 'hc_analytics_consent_v1'
export const ANALYTICS_CONSENT_EVENT = 'hilo:analytics-consent'
export const ANALYTICS_PREFERENCES_EVENT = 'hilo:open-analytics-preferences'

const MEASUREMENT_ID = String(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '').trim()
const VALID_MEASUREMENT_ID = /^G-[A-Z0-9]+$/i.test(MEASUREMENT_ID)
const MAX_DEBUG_EVENTS = 80

let consentInitialized = false
let consentState = 'unknown'
let gaConfigured = false
let lastPageLocation = ''

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined'
}

function ensureDebugState() {
  if (!isBrowser()) return null
  window.__hiloAnalyticsDebug = window.__hiloAnalyticsDebug || {
    consent: 'unknown',
    measurementConfigured: VALID_MEASUREMENT_ID,
    measurementId: VALID_MEASUREMENT_ID ? MEASUREMENT_ID : '',
    events: [],
  }
  window.__hiloAnalyticsDebug.measurementConfigured = VALID_MEASUREMENT_ID
  window.__hiloAnalyticsDebug.measurementId = VALID_MEASUREMENT_ID ? MEASUREMENT_ID : ''
  return window.__hiloAnalyticsDebug
}

function gtag(...args) {
  if (!isBrowser()) return
  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function hiloGtagQueue() {
    window.dataLayer.push(arguments)
  }
  window.gtag(...args)
}

export function initializeConsentMode() {
  if (!isBrowser() || consentInitialized) return

  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function hiloGtagQueue() {
    window.dataLayer.push(arguments)
  }

  window.gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    wait_for_update: 500,
  })
  window.gtag('set', 'ads_data_redaction', true)

  consentInitialized = true
  const debug = ensureDebugState()
  if (debug) debug.consent = 'denied'
}

export function getStoredAnalyticsConsent() {
  if (!isBrowser()) return null
  try {
    const value = window.localStorage.getItem(ANALYTICS_CONSENT_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

function persistAnalyticsConsent(value) {
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, value)
  } catch {
    // El consentimiento sigue aplicándose durante la sesión aunque storage no esté disponible.
  }
}

function expireAnalyticsCookies() {
  if (!isBrowser()) return
  const cookieNames = document.cookie
    .split(';')
    .map((part) => part.split('=')[0]?.trim())
    .filter((name) => name === '_ga' || name === '_gid' || name === '_gat' || name?.startsWith('_ga_'))

  for (const name of cookieNames) {
    document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax`
    document.cookie = `${name}=; Max-Age=0; Path=/; Domain=.${window.location.hostname}; SameSite=Lax`
  }
}

export function applyAnalyticsConsent(value, { persist = true } = {}) {
  if (!isBrowser()) return false
  initializeConsentMode()

  const next = value === 'granted' ? 'granted' : 'denied'
  consentState = next
  if (persist) persistAnalyticsConsent(next)

  gtag('consent', 'update', {
    analytics_storage: next,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  })

  if (next === 'denied') {
    expireAnalyticsCookies()
    lastPageLocation = ''
  }

  const debug = ensureDebugState()
  if (debug) debug.consent = next

  window.dispatchEvent(new CustomEvent(ANALYTICS_CONSENT_EVENT, {
    detail: { analytics: next },
  }))

  return next === 'granted'
}

export function analyticsConsentGranted() {
  if (!isBrowser()) return false
  if (consentState === 'granted') return true
  if (consentState === 'denied') return false
  const stored = getStoredAnalyticsConsent()
  consentState = stored || 'unknown'
  return stored === 'granted'
}

export function analyticsMeasurementConfigured() {
  return VALID_MEASUREMENT_ID
}

export function getAnalyticsMeasurementId() {
  return VALID_MEASUREMENT_ID ? MEASUREMENT_ID : ''
}

export function ensureGoogleAnalytics() {
  if (!isBrowser() || !analyticsConsentGranted() || !VALID_MEASUREMENT_ID) return false

  initializeConsentMode()

  if (!document.querySelector('script[data-hilo-ga4="true"]')) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`
    script.dataset.hiloGa4 = 'true'
    document.head.appendChild(script)
  }

  if (!gaConfigured) {
    gtag('js', new Date())
    gtag('config', MEASUREMENT_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    })
    gaConfigured = true
  }

  return true
}

export function sanitizeAnalyticsText(value, max = 100) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max)
}

function sanitizedUrl(value) {
  if (!value || !isBrowser()) return ''
  try {
    const url = new URL(value, window.location.origin)
    url.search = ''
    url.hash = ''
    return url.toString()
  } catch {
    return ''
  }
}

function sanitizeParameters(parameters = {}) {
  const clean = {}

  for (const [key, value] of Object.entries(parameters)) {
    if (value === undefined || value === null || value === '') continue

    if (typeof value === 'number') {
      if (Number.isFinite(value)) clean[key] = value
      continue
    }

    if (typeof value === 'boolean') {
      clean[key] = value
      continue
    }

    clean[key] = sanitizeAnalyticsText(value, key === 'page_location' || key === 'page_referrer' ? 300 : 100)
  }

  return clean
}

function recordDebugEvent(name, parameters) {
  const debug = ensureDebugState()
  if (!debug) return
  debug.events.push({
    name,
    parameters,
    at: new Date().toISOString(),
  })
  if (debug.events.length > MAX_DEBUG_EVENTS) {
    debug.events.splice(0, debug.events.length - MAX_DEBUG_EVENTS)
  }
}

export function trackEvent(name, parameters = {}) {
  if (!isBrowser() || !analyticsConsentGranted()) return false

  const eventName = sanitizeAnalyticsText(name, 40).replace(/[^a-zA-Z0-9_]/g, '_')
  if (!eventName) return false

  const clean = sanitizeParameters(parameters)
  recordDebugEvent(eventName, clean)

  const hasGa = ensureGoogleAnalytics()
  if (hasGa) gtag('event', eventName, clean)

  if (typeof window.va === 'function') {
    window.va('event', { name: eventName, data: clean })
  }

  return true
}

export function trackPageView(pathname = '', title = '') {
  if (!isBrowser() || !analyticsConsentGranted()) return false

  const safePath = String(pathname || window.location.pathname || '/').split('?')[0].split('#')[0] || '/'
  const pageLocation = `${window.location.origin}${safePath}`
  if (pageLocation === lastPageLocation) return false

  const pageReferrer = lastPageLocation || sanitizedUrl(document.referrer)
  const parameters = sanitizeParameters({
    page_title: title || document.title,
    page_location: pageLocation,
    page_path: safePath,
    page_referrer: pageReferrer,
  })

  lastPageLocation = pageLocation
  recordDebugEvent('page_view', parameters)

  if (ensureGoogleAnalytics()) {
    gtag('event', 'page_view', parameters)
  }

  return true
}

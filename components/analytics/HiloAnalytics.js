'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { SpeedInsights } from '@vercel/speed-insights/next'
import CookieConsentBanner from './CookieConsentBanner'
import {
  ANALYTICS_CONSENT_EVENT,
  applyAnalyticsConsent,
  ensureGoogleAnalytics,
  getStoredAnalyticsConsent,
  initializeConsentMode,
  sanitizeAnalyticsText,
  trackEvent,
  trackPageView,
} from '@/lib/analytics/client'

const LEGACY_EVENTS = new Set([
  'hilo_search',
  'search_result_open',
  'relation_click',
  'discography_open',
  'spotify_click',
  'source_open',
  'extraordinary_open',
  'global_search_open',
  'search_result_ask',
])

const DATASET_FIELDS = {
  hiloSection: 'section',
  hiloScope: 'scope',
  hiloSourceType: 'source_type',
  hiloTargetType: 'target_type',
  hiloOrigin: 'origin',
  hiloOutcome: 'outcome',
  hiloResultBucket: 'result_bucket',
}

const ENTITY_ROUTES = {
  hermandades: 'hermandad',
  imagenes: 'imagen',
  pasos: 'paso',
  bandas: 'banda',
  marchas: 'marcha',
  autores: 'autor',
  acontecimientos: 'acontecimiento',
  'igualas-y-ensayos': 'evento',
  lugares: 'municipio',
}

function isPanelPath(pathname = '') {
  return pathname === '/panel' || pathname.startsWith('/panel/')
}

function entityTypeFromPath(pathname = '') {
  const clean = String(pathname || '').split('?')[0].split('#')[0]

  if (/^\/agenda-cofrade\/localidad\/[^/]+\/?$/.test(clean)) return 'municipio'
  if (/^\/agenda-cofrade\/rosarios\/[^/]+\/?$/.test(clean)) return 'culto'
  if (/^\/extraordinarias\/[^/]+\/?$/.test(clean)) return 'acontecimiento'
  if (/^\/procesiones-de-gloria(?:\/|$)/.test(clean)) return 'evento'

  const match = clean.match(/^\/([^/]+)\/[^/]+\/?$/)
  if (!match) return null
  return ENTITY_ROUTES[match[1]] || null
}

function pageTypeFromPath(pathname = '') {
  if (pathname === '/') return 'home'
  if (pathname.startsWith('/agenda-cofrade')) return 'agenda_cofrade'
  if (pathname.startsWith('/extraordinarias')) return 'agenda_extraordinarias'
  if (pathname.startsWith('/procesiones-de-gloria')) return 'agenda_glorias'
  if (pathname.startsWith('/igualas-y-ensayos')) return 'agenda_igualas_ensayos'
  return entityTypeFromPath(pathname) || pathname.split('/').filter(Boolean)[0] || 'pagina'
}

function destinationType(anchor, targetUrl) {
  return anchor?.dataset?.analyticsDestinationType
    || entityTypeFromPath(targetUrl?.pathname)
    || pageTypeFromPath(targetUrl?.pathname || '')
}

function destinationName(anchor) {
  return sanitizeAnalyticsText(
    anchor?.dataset?.analyticsDestinationName
      || anchor?.getAttribute?.('aria-label')
      || anchor?.textContent
      || '',
    100
  )
}

function sourceName(anchor) {
  return sanitizeAnalyticsText(
    anchor?.dataset?.analyticsSourceName
      || document.querySelector('main h1')?.textContent
      || document.title,
    100
  )
}

function sectionForElement(element) {
  return sanitizeAnalyticsText(
    element?.dataset?.analyticsContext
      || element?.closest?.('[data-hilo-section]')?.dataset?.hiloSection
      || element?.closest?.('section[id]')?.id
      || element?.closest?.('aside[aria-label]')?.getAttribute('aria-label')
      || 'entity_page',
    80
  )
}

function nextDepthBucket() {
  try {
    const current = Number.parseInt(window.sessionStorage.getItem('hc_relation_depth') || '0', 10)
    const next = Number.isFinite(current) ? current + 1 : 1
    window.sessionStorage.setItem('hc_relation_depth', String(next))
    if (next === 1) return '1'
    if (next === 2) return '2'
    if (next === 3) return '3'
    if (next <= 5) return '4-5'
    return '6+'
  } catch {
    return 'unknown'
  }
}

function queueVercelAnalytics() {
  window.va = window.va || function hiloVercelAnalyticsQueue() {
    ;(window.vaq = window.vaq || []).push(arguments)
  }
}

function sanitizedVercelEvent(event) {
  if (!event?.url) return event
  try {
    const url = new URL(event.url, window.location.origin)
    if (isPanelPath(url.pathname)) return null
    url.search = ''
    url.hash = ''
    return { ...event, url: url.toString() }
  } catch {
    return event
  }
}

function ensureVercelAnalyticsScript() {
  if (document.querySelector('script[data-hilo-analytics="true"]')) return
  const script = document.createElement('script')
  script.src = '/_vercel/insights/script.js'
  script.defer = true
  script.dataset.hiloAnalytics = 'true'
  script.onerror = () => {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[Hilo Cofrade] Vercel Web Analytics todavía no está habilitado para este entorno.')
    }
  }
  document.head.appendChild(script)
}

function enableTelemetry() {
  if (isPanelPath(window.location.pathname)) return false
  ensureGoogleAnalytics()
  queueVercelAnalytics()
  window.va('beforeSend', sanitizedVercelEvent)
  ensureVercelAnalyticsScript()
  return true
}

function disableTelemetry() {
  if (typeof window.va === 'function') {
    window.va('beforeSend', () => null)
  }
}

function explicitEventData(element) {
  const data = {}
  for (const [datasetKey, outputKey] of Object.entries(DATASET_FIELDS)) {
    const value = element?.dataset?.[datasetKey]
    if (value) data[outputKey] = sanitizeAnalyticsText(value, 80)
  }
  if (element?.dataset?.hiloEvent === 'relation_click') {
    data.depth_bucket = nextDepthBucket()
  }
  return data
}

function trackLegacyElement(element) {
  const name = element?.dataset?.hiloEvent
  if (!LEGACY_EVENTS.has(name)) return false

  if (name === 'discography_open') {
    const details = element.closest('details')
    if (details?.open) return true
  }

  trackEvent(name, explicitEventData(element))
  return true
}

function linkTarget(anchor) {
  try {
    return new URL(anchor.getAttribute('href') || '', window.location.href)
  } catch {
    return null
  }
}

function trackExternalAnchor(anchor, targetUrl) {
  if (!targetUrl || !/^https?:$/.test(targetUrl.protocol) || targetUrl.origin === window.location.origin) return false

  trackEvent('external_link_click', {
    destination_domain: targetUrl.hostname,
    link_text: destinationName(anchor),
    source_page_type: pageTypeFromPath(window.location.pathname),
  })
  return true
}

function trackRelatedAnchor(anchor, targetUrl) {
  const related = anchor.closest('[data-analytics-related-section]')
  if (!related || !targetUrl) return

  trackEvent('related_content_click', {
    source_type: related.dataset.analyticsSourceType || entityTypeFromPath(window.location.pathname) || pageTypeFromPath(window.location.pathname),
    destination_type: destinationType(anchor, targetUrl),
    destination_name: destinationName(anchor),
    section_name: related.dataset.analyticsRelatedSection || 'contenido_relacionado',
  })
}

function trackRelationalAnchor(anchor, targetUrl, explicitWasRelation = false) {
  if (!anchor || !targetUrl || explicitWasRelation || anchor.dataset.analyticsSkipEntity === 'true') return
  if (targetUrl.origin !== window.location.origin || targetUrl.pathname === window.location.pathname) return

  const sourceType = anchor.dataset.analyticsSourceType || entityTypeFromPath(window.location.pathname)
  const targetType = destinationType(anchor, targetUrl)
  if (!sourceType || !targetType) return

  trackEvent('entity_click', {
    source_entity_type: sourceType,
    source_entity_name: sourceName(anchor),
    destination_entity_type: targetType,
    destination_entity_name: destinationName(anchor),
    link_context: sectionForElement(anchor),
    depth_bucket: nextDepthBucket(),
  })
}

export default function HiloAnalytics() {
  const pathname = usePathname()
  const [analyticsActive, setAnalyticsActive] = useState(false)

  useEffect(() => {
    initializeConsentMode()

    const onConsent = (event) => {
      const granted = event?.detail?.analytics === 'granted'
      if (granted) {
        setAnalyticsActive(enableTelemetry())
      } else {
        disableTelemetry()
        setAnalyticsActive(false)
      }
    }

    window.addEventListener(ANALYTICS_CONSENT_EVENT, onConsent)

    const stored = getStoredAnalyticsConsent()
    if (stored) {
      const granted = applyAnalyticsConsent(stored, { persist: false })
      if (granted) setAnalyticsActive(enableTelemetry())
      else disableTelemetry()
    }

    const onClick = (event) => {
      if (!(event.target instanceof Element)) return

      const explicitElement = event.target.closest('[data-hilo-event]')
      const explicitWasRelation = explicitElement?.dataset?.hiloEvent === 'relation_click'
      if (explicitElement) trackLegacyElement(explicitElement)

      const anchor = event.target.closest('a[href]')
      if (!anchor) return

      const targetUrl = linkTarget(anchor)
      trackExternalAnchor(anchor, targetUrl)
      trackRelatedAnchor(anchor, targetUrl)
      trackRelationalAnchor(anchor, targetUrl, explicitWasRelation)
    }

    const onSubmit = (event) => {
      if (!(event.target instanceof Element)) return
      const explicitElement = event.target.closest('[data-hilo-event]')
      if (explicitElement) trackLegacyElement(explicitElement)
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('submit', onSubmit, true)

    return () => {
      window.removeEventListener(ANALYTICS_CONSENT_EVENT, onConsent)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('submit', onSubmit, true)
    }
  }, [])

  useEffect(() => {
    if (!analyticsActive || isPanelPath(pathname)) return undefined
    const frame = window.requestAnimationFrame(() => {
      trackPageView(pathname, document.title)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [analyticsActive, pathname])

  return (
    <>
      <CookieConsentBanner />
      {analyticsActive ? <SpeedInsights /> : null}
    </>
  )
}

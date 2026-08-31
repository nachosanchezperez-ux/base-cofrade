'use client'

import { useEffect } from 'react'

const TRACKED_HOSTS = new Set(['hilocofrade.es', 'www.hilocofrade.es'])
const ALLOWED_EVENTS = new Set([
  'hilo_search',
  'search_result_open',
  'relation_click',
  'discography_open',
  'spotify_click',
  'source_open',
  'extraordinary_open',
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
  hermandades: 'brotherhood',
  imagenes: 'image',
  pasos: 'step',
  bandas: 'band',
  marchas: 'march',
  autores: 'agent',
  acontecimientos: 'event',
  'igualas-y-ensayos': 'crew_event',
  lugares: 'place',
}

function isTrackedHost() {
  return typeof window !== 'undefined' && TRACKED_HOSTS.has(window.location.hostname)
}

function isPanelPath(pathname = '') {
  return pathname === '/panel' || pathname.startsWith('/panel/')
}

function entityTypeFromPath(pathname = '') {
  const match = pathname.match(/^\/([^/]+)\/[^/]+\/?$/)
  if (!match) return null
  return ENTITY_ROUTES[match[1]] || null
}

function sectionForElement(element) {
  return element?.closest?.('[data-hilo-section]')?.dataset?.hiloSection || 'entity_page'
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

function queueAnalytics() {
  window.va = window.va || function hiloVercelAnalyticsQueue() {
    ;(window.vaq = window.vaq || []).push(arguments)
  }
}

function sanitizedEvent(event) {
  if (!event?.url) return event
  try {
    const url = new URL(event.url, window.location.origin)
    if (!TRACKED_HOSTS.has(url.hostname) || isPanelPath(url.pathname)) return null
    url.search = ''
    url.hash = ''
    return { ...event, url: url.toString() }
  } catch {
    return event
  }
}

function ensureAnalyticsScript() {
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

function explicitEventData(element) {
  const data = {}
  for (const [datasetKey, outputKey] of Object.entries(DATASET_FIELDS)) {
    const value = element?.dataset?.[datasetKey]
    if (value) data[outputKey] = String(value).slice(0, 80)
  }
  if (element?.dataset?.hiloEvent === 'relation_click') {
    data.depth_bucket = nextDepthBucket()
  }
  return data
}

function sendEvent(name, data = {}) {
  if (!ALLOWED_EVENTS.has(name) || !isTrackedHost() || isPanelPath(window.location.pathname)) return
  queueAnalytics()
  window.va('event', { name, data })
}

function trackExplicitElement(element) {
  const name = element?.dataset?.hiloEvent
  if (!ALLOWED_EVENTS.has(name)) return false

  if (name === 'discography_open') {
    const details = element.closest('details')
    if (details?.open) return true
  }

  sendEvent(name, explicitEventData(element))
  return true
}

function trackRelationalAnchor(anchor, explicitWasRelation = false) {
  if (!anchor || explicitWasRelation || !isTrackedHost()) return

  const sourceType = entityTypeFromPath(window.location.pathname)
  if (!sourceType) return

  let targetUrl
  try {
    targetUrl = new URL(anchor.getAttribute('href') || '', window.location.href)
  } catch {
    return
  }

  if (targetUrl.origin !== window.location.origin) return
  if (targetUrl.pathname === window.location.pathname) return

  const targetType = entityTypeFromPath(targetUrl.pathname)
  if (!targetType) return

  sendEvent('relation_click', {
    source_type: sourceType,
    target_type: targetType,
    section: sectionForElement(anchor),
    depth_bucket: nextDepthBucket(),
  })
}

export default function HiloAnalytics() {
  useEffect(() => {
    queueAnalytics()
    window.va('beforeSend', sanitizedEvent)
    ensureAnalyticsScript()

    const onClick = (event) => {
      if (!(event.target instanceof Element)) return

      const explicitElement = event.target.closest('[data-hilo-event]')
      const explicitWasRelation = explicitElement?.dataset?.hiloEvent === 'relation_click'
      if (explicitElement) trackExplicitElement(explicitElement)

      const anchor = event.target.closest('a[href]')
      if (anchor) trackRelationalAnchor(anchor, explicitWasRelation)
    }

    const onSubmit = (event) => {
      if (!(event.target instanceof Element)) return
      const explicitElement = event.target.closest('[data-hilo-event]')
      if (explicitElement) trackExplicitElement(explicitElement)
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('submit', onSubmit, true)

    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('submit', onSubmit, true)
    }
  }, [])

  return null
}

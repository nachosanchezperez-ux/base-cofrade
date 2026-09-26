import assert from 'node:assert/strict'
import test from 'node:test'

function createStorage() {
  const values = new Map()
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null },
    setItem(key, value) { values.set(key, String(value)) },
    removeItem(key) { values.delete(key) },
  }
}

function installBrowserMock() {
  const listeners = new Map()
  const appended = []
  let cookieValue = ''

  global.CustomEvent = class CustomEvent {
    constructor(type, options = {}) {
      this.type = type
      this.detail = options.detail
    }
  }

  global.window = {
    location: {
      origin: 'https://hilocofrade.es',
      hostname: 'hilocofrade.es',
      pathname: '/',
    },
    localStorage: createStorage(),
    sessionStorage: createStorage(),
    dataLayer: [],
    addEventListener(type, handler) {
      const handlers = listeners.get(type) || []
      handlers.push(handler)
      listeners.set(type, handlers)
    },
    removeEventListener() {},
    dispatchEvent(event) {
      for (const handler of listeners.get(event.type) || []) handler(event)
      return true
    },
  }

  global.document = {
    title: 'Hilo Cofrade',
    referrer: 'https://example.com/origen?token=secreto',
    get cookie() { return cookieValue },
    set cookie(value) { cookieValue = value },
    querySelector(selector) {
      if (selector === 'script[data-hilo-ga4="true"]') {
        return appended.find((item) => item.dataset?.hiloGa4 === 'true') || null
      }
      return null
    },
    createElement(tagName) {
      return {
        tagName,
        async: false,
        src: '',
        dataset: {},
      }
    },
    head: {
      appendChild(element) {
        appended.push(element)
        return element
      },
    },
  }

  return { appended }
}

test('el helper aplica consentimiento real, deduplica pageviews y detiene eventos tras revocación', async () => {
  const { appended } = installBrowserMock()
  delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  const analytics = await import('../lib/analytics/client.js?runtime-contract')

  analytics.initializeConsentMode()

  assert.equal(window.__hiloAnalyticsDebug.consent, 'denied')
  assert.equal(window.__hiloAnalyticsDebug.measurementConfigured, false)

  const consentDefault = window.dataLayer
    .map((entry) => Array.from(entry))
    .find((entry) => entry[0] === 'consent' && entry[1] === 'default')

  assert.ok(consentDefault)
  assert.deepEqual(
    {
      analytics_storage: consentDefault[2].analytics_storage,
      ad_storage: consentDefault[2].ad_storage,
      ad_user_data: consentDefault[2].ad_user_data,
      ad_personalization: consentDefault[2].ad_personalization,
    },
    {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    }
  )

  assert.equal(analytics.trackEvent('site_search', { search_term: 'Baratillo', results_count: 4 }), false)
  assert.equal(window.__hiloAnalyticsDebug.events.length, 0)
  assert.equal(appended.length, 0)

  assert.equal(analytics.applyAnalyticsConsent('granted'), true)
  assert.equal(window.localStorage.getItem(analytics.ANALYTICS_CONSENT_KEY), 'granted')

  assert.equal(analytics.trackEvent('site_search', { search_term: 'Baratillo', results_count: 4 }), true)
  assert.equal(window.__hiloAnalyticsDebug.events.at(-1).name, 'site_search')
  assert.equal(appended.length, 0, 'sin Measurement ID no debe cargar gtag.js')

  assert.equal(analytics.trackPageView('/agenda-cofrade', 'Agenda Cofrade'), true)
  assert.equal(analytics.trackPageView('/agenda-cofrade', 'Agenda Cofrade'), false)

  const pageviews = window.__hiloAnalyticsDebug.events.filter((event) => event.name === 'page_view')
  assert.equal(pageviews.length, 1)
  assert.equal(pageviews[0].parameters.page_location, 'https://hilocofrade.es/agenda-cofrade')
  assert.equal(pageviews[0].parameters.page_referrer, 'https://example.com/origen')

  const countBeforeRevoke = window.__hiloAnalyticsDebug.events.length
  assert.equal(analytics.applyAnalyticsConsent('denied'), false)
  assert.equal(analytics.trackEvent('entity_click', {
    source_entity_type: 'hermandad',
    destination_entity_type: 'banda',
  }), false)
  assert.equal(window.__hiloAnalyticsDebug.events.length, countBeforeRevoke)
  assert.equal(window.__hiloAnalyticsDebug.consent, 'denied')
})

test('el saneado elimina patrones evidentes de email, teléfono y documento personal', async () => {
  installBrowserMock()
  const analytics = await import('../lib/analytics/client.js?pii-contract')

  assert.doesNotMatch(analytics.sanitizeAnalyticsText('correo persona@example.com'), /persona@example\.com/)
  assert.doesNotMatch(analytics.sanitizeAnalyticsText('teléfono 600 123 456'), /600 123 456/)
  assert.doesNotMatch(analytics.sanitizeAnalyticsText('DNI 12345678Z'), /12345678Z/)
})

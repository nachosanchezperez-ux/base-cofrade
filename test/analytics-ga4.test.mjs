import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('Consent Mode v2 deniega analítica y publicidad por defecto', async () => {
  const analytics = await source('lib/analytics/client.js')

  assert.match(analytics, /analytics_storage:\s*'denied'/)
  assert.match(analytics, /ad_storage:\s*'denied'/)
  assert.match(analytics, /ad_user_data:\s*'denied'/)
  assert.match(analytics, /ad_personalization:\s*'denied'/)
  assert.match(analytics, /ads_data_redaction/)
  assert.match(analytics, /NEXT_PUBLIC_GA_MEASUREMENT_ID/)
})

test('GA4 no genera el pageview de config y la capa controla el App Router', async () => {
  const [analytics, globalAnalytics] = await Promise.all([
    source('lib/analytics/client.js'),
    source('components/analytics/HiloAnalytics.js'),
  ])

  assert.match(analytics, /send_page_view:\s*false/)
  assert.match(analytics, /gtag\('event', 'page_view'/)
  assert.match(globalAnalytics, /usePathname/)
  assert.match(globalAnalytics, /trackPageView\(pathname/)
})

test('la telemetría externa solo se activa después de consentimiento', async () => {
  const [analytics, globalAnalytics, layout] = await Promise.all([
    source('lib/analytics/client.js'),
    source('components/analytics/HiloAnalytics.js'),
    source('app/layout.js'),
  ])

  assert.match(analytics, /analyticsConsentGranted\(\)/)
  assert.match(globalAnalytics, /enableTelemetry/)
  assert.match(globalAnalytics, /analyticsActive \? <SpeedInsights/)
  assert.doesNotMatch(layout, /<SpeedInsights/)
  assert.match(globalAnalytics, /data-hilo-analytics/)
})

test('el banner ofrece aceptar rechazar y preferencias', async () => {
  const banner = await source('components/analytics/CookieConsentBanner.js')

  assert.match(banner, />Rechazar</)
  assert.match(banner, />Aceptar</)
  assert.match(banner, />Preferencias</)
  assert.match(banner, /Rechazar analítica/)
  assert.match(banner, /Guardar preferencias/)
})

test('buscador y agendas emiten el contrato de eventos de producto', async () => {
  const sources = (await Promise.all([
    source('components/HiloSearch.js'),
    source('components/AgendaCofradeDirectoryV4.js'),
    source('components/ExtraordinaryDirectory.js'),
    source('components/GloryDirectory.js'),
    source('components/CrewEventDirectory.js'),
    source('components/analytics/HiloAnalytics.js'),
  ])).join('\n')

  for (const event of [
    'site_search',
    'search_result_click',
    'agenda_filter',
    'agenda_period_select',
    'agenda_event_open',
    'entity_click',
    'related_content_click',
    'external_link_click',
  ]) {
    assert.match(sources, new RegExp(`['"]${event}['"]`))
  }

  for (const parameter of [
    'search_term',
    'results_count',
    'entity_type',
    'entity_name',
    'position',
    'filter_type',
    'filter_value',
    'agenda_type',
    'event_name',
    'event_type',
    'municipality',
    'source_entity_type',
    'destination_entity_type',
    'section_name',
    'destination_domain',
  ]) {
    assert.match(sources, new RegExp(parameter))
  }
})

test('la integración directa no introduce un contenedor de Google Tag Manager', async () => {
  const [analytics, globalAnalytics] = await Promise.all([
    source('lib/analytics/client.js'),
    source('components/analytics/HiloAnalytics.js'),
  ])
  const combined = `${analytics}\n${globalAnalytics}`

  assert.doesNotMatch(combined, /GTM-[A-Z0-9]+/)
  assert.doesNotMatch(combined, /gtm\.js/)
  assert.match(combined, /googletagmanager\.com\/gtag\/js/)
})

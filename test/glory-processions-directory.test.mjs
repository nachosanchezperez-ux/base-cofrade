import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('Glory directory reuses the generic outings model without schema-specific hardcodes', async () => {
  const loader = await read('lib/supabase/glory-directory.js')

  assert.match(loader, /\.from\('outings'\)/)
  assert.match(loader, /\.eq\('character', 'ordinary'\)/)
  assert.match(loader, /\.ilike\('outing_type', 'Procesión de Gloria'\)/)
  assert.match(loader, /\.eq\('status', 'published'\)/)
  assert.doesNotMatch(loader, /pastora-de-cantillana|asuncion-de-cantillana/i)
})

test('Glory public routes are discoverable from navigation and sitemap', async () => {
  const [header, sitemap] = await Promise.all([
    read('components/HiloHeader.js'),
    read('app/sitemap.js'),
  ])

  assert.match(header, /\/procesiones-de-gloria/)
  assert.match(header, /Procesiones de Gloria/)
  assert.match(sitemap, /getGloryDirectory/)
  assert.match(sitemap, /absoluteUrl\('\/procesiones-de-gloria'\)/)
  assert.match(sitemap, /gloryEntries\(gloryOutings\)/)
})

test('Glory pages keep directory and individual procession responsibilities separate', async () => {
  const [directoryPage, detailPage, directoryComponent] = await Promise.all([
    read('app/procesiones-de-gloria/page.js'),
    read('app/procesiones-de-gloria/[slug]/page.js'),
    read('components/GloryDirectory.js'),
  ])

  assert.match(directoryPage, /<GloryDirectory outings=\{outings\}/)
  assert.match(directoryPage, /canonical: '\/procesiones-de-gloria'/)
  assert.match(detailPage, /getGloryDetail/)
  assert.match(detailPage, /<ProcessionRoute route=\{processionRoute\}/)
  assert.match(detailPage, /breadcrumbJsonLd/)
  assert.match(directoryComponent, /Sevilla capital/)
  assert.match(directoryComponent, /Provincia/)
  assert.match(directoryComponent, /Archivo/)
})

test('Glory cards remain usable on mobile and do not fabricate missing times', async () => {
  const [component, css] = await Promise.all([
    read('components/GloryDirectory.js'),
    read('components/GloryDirectory.module.css'),
  ])

  assert.match(component, /featured\.departureTime \|\| 'Por confirmar'/)
  assert.match(component, /featured\.returnTime \|\| 'Por confirmar'/)
  assert.match(css, /@media \(max-width: 560px\)/)
  assert.match(css, /font-size:\s*16px/)
})

test('Glory distinguishes a past date from an explicitly held procession', async () => {
  const [loader, component, detail] = await Promise.all([
    read('lib/supabase/glory-directory.js'),
    read('components/GloryDirectory.js'),
    read('app/procesiones-de-gloria/[slug]/page.js'),
  ])

  assert.match(loader, /const isCelebrated = row\.event_status === 'held'/)
  assert.match(loader, /const isPast = Boolean\(date\) && date < today/)
  assert.match(component, /if \(item\.isPast\) return 'Fecha pasada'/)
  assert.match(component, /Archivo <small>/)
  assert.match(detail, /if \(item\.isPast\) return 'Fecha pasada'/)
})

test('Glory serializes Madrid event times with the real seasonal UTC offset', async () => {
  const detail = await read('app/procesiones-de-gloria/[slug]/page.js')

  assert.match(detail, /timeZoneName: 'longOffset'/)
  assert.match(detail, /startDate: madridDateTime\(item\.date, item\.departureTime\)/)
  assert.match(detail, /endDate: madridDateTime\(item\.returnDate \|\| item\.date, item\.returnTime\)/)
  assert.doesNotMatch(detail, /:00\+02:00/)
})

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const crewEvent = read('app/igualas-y-ensayos/[slug]/page.js')
const gloryEvent = read('app/procesiones-de-gloria/[slug]/page.js')
const extraordinaryEvent = read('app/extraordinarias/[slug]/page.js')
const smokeScript = read('scripts/public-seo-smoke.mjs')
const smokeWorkflow = read('.github/workflows/production-seo-smoke.yml')

test('Igualás publica fecha y hora con zona de Madrid y conecta WebPage con Event', () => {
  assert.match(crewEvent, /function madridUtcOffset/)
  assert.match(crewEvent, /function madridDateTime/)
  assert.match(crewEvent, /startDate: madridDateTime\(event\.date, event\.startTime\)/)
  assert.match(crewEvent, /'@type': 'WebPage'/)
  assert.match(crewEvent, /mainEntity: \{ '@id': `\$\{canonicalUrl\}#event` \}/)
  assert.match(crewEvent, /mainEntityOfPage: \{ '@id': `\$\{canonicalUrl\}#webpage` \}/)
  assert.match(crewEvent, /'@type': 'PostalAddress'/)
  assert.match(crewEvent, /event\.brotherhoodHref \? \{ url: absoluteUrl\(event\.brotherhoodHref\) \} : \{\}/)
})

test('Glorias declara la fotografía principal también en datos estructurados', () => {
  assert.match(gloryEvent, /primaryImageOfPage/)
  assert.match(gloryEvent, /image: \[absoluteUrl\(item\.heroImagePath\)\]/)
})

test('Extraordinarias calcula el offset de Europe\/Madrid y no lo fija a horario de verano', () => {
  assert.match(extraordinaryEvent, /function madridUtcOffset/)
  assert.match(extraordinaryEvent, /function madridDateTime/)
  assert.match(extraordinaryEvent, /startDate: madridDateTime\(item\.date, item\.departureTime\)/)
  assert.doesNotMatch(extraordinaryEvent, /T\$\{item\.departureTime\}:00\+02:00/)
})

test('el smoke de producción protege las superficies SEO principales y dinámicas', () => {
  for (const path of [
    '/directorio',
    '/extraordinarias',
    '/procesiones-de-gloria',
    '/igualas-y-ensayos',
    '/hermandades/el-baratillo',
    '/bandas/las-cigarreras',
  ]) {
    assert.match(smokeScript, new RegExp(path.replaceAll('/', '\\/')))
  }
  assert.match(smokeScript, /\/sitemap\.xml/)
  assert.match(smokeScript, /rel="canonical"/)
  assert.match(smokeScript, /application\/ld\+json/)
  assert.match(smokeWorkflow, /deployment_status:/)
  assert.match(smokeWorkflow, /workflow_dispatch:/)
  assert.match(smokeWorkflow, /node scripts\/public-seo-smoke\.mjs/)
})

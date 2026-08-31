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
  for (const contract of [
    'function madridUtcOffset',
    'function madridDateTime',
    'startDate: madridDateTime(event.date, event.startTime)',
    "'@type': 'WebPage'",
    "mainEntity: { '@id': `${canonicalUrl}#event` }",
    "mainEntityOfPage: { '@id': `${canonicalUrl}#webpage` }",
    "'@type': 'PostalAddress'",
    'url: absoluteUrl(event.brotherhoodHref)',
  ]) {
    assert.ok(crewEvent.includes(contract), `Falta contrato de Igualás: ${contract}`)
  }
})

test('Igualás limpia puntuación y no repite fecha/hora si ya están en el resumen', () => {
  assert.ok(crewEvent.includes('function cleanSeoSentence'))
  assert.ok(crewEvent.includes('function includesSeoDetail'))
  assert.ok(crewEvent.includes("!includesSeoDetail(lead, event.dateParts.label)"))
  assert.ok(crewEvent.includes("!includesSeoDetail(lead, event.startTime)"))
  assert.ok(crewEvent.includes('parts.map(cleanSeoSentence).filter(Boolean).join'))
})

test('Glorias declara la fotografía principal también en datos estructurados', () => {
  assert.ok(gloryEvent.includes('primaryImageOfPage'))
  assert.ok(gloryEvent.includes('image: [absoluteUrl(item.heroImagePath)]'))
})

test('Extraordinarias calcula el offset de Europe/Madrid y no lo fija a horario de verano', () => {
  assert.ok(extraordinaryEvent.includes('function madridUtcOffset'))
  assert.ok(extraordinaryEvent.includes('function madridDateTime'))
  assert.ok(extraordinaryEvent.includes('startDate: madridDateTime(item.date, item.departureTime)'))
  assert.equal(extraordinaryEvent.includes('T${item.departureTime}:00+02:00'), false)
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
    assert.ok(smokeScript.includes(`'${path}'`), `Falta ruta en smoke: ${path}`)
  }
  assert.ok(smokeScript.includes('/sitemap.xml'))
  assert.ok(smokeScript.includes('rel="canonical"'))
  assert.ok(smokeScript.includes('application/ld+json'))
  assert.ok(smokeWorkflow.includes('deployment_status:'))
  assert.ok(smokeWorkflow.includes('workflow_dispatch:'))
  assert.ok(smokeWorkflow.includes('node scripts/public-seo-smoke.mjs'))
})

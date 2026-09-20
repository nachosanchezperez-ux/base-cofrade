import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  compactSeoTitle,
  schemaDate,
  schemaEventStatus,
  socialMetadata,
} from '../lib/seo.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const sitemap = read('app/sitemap.js')
const publicIndexability = read('lib/supabase/public-indexability.js')
const publicMarches = read('lib/supabase/public-marches.js')

test('HC-SEO-01 incorpora todas las Marchas publicadas mediante una lectura paginada', () => {
  assert.match(sitemap, /getPublicMarchSitemapEntries/)
  assert.match(sitemap, /marchEntries\(marches\)/)
  assert.match(publicMarches, /loadPublicRowsInPages/)
  assert.match(publicMarches, /\.eq\('entity_type', 'march'\)/)
  assert.match(publicMarches, /\.eq\('status', 'published'\)/)
  assert.match(publicMarches, /\.range\(from, to\)/)
  assert.match(publicMarches, /if \(process\.env\.VERCEL\)/)
  assert.match(publicMarches, /throw new Error\('Falta la configuración pública de Supabase para generar el sitemap de Marchas'\)/)
})

test('HC-SEO-01 no convierte un fallo de indexabilidad en un sitemap 200 vacío', () => {
  assert.match(publicIndexability, /assertSitemapFamilyCoverage/)
  assert.match(publicIndexability, /Cobertura SEO vacía/)
  assert.match(publicIndexability, /throw error/)
  assert.doesNotMatch(
    publicIndexability,
    /No se pudo calcular la indexabilidad compartida del sitemap[\s\S]*?return \[\]/
  )
})

test('las consultas amplias de las cuatro familias usan lotes o páginas', () => {
  for (const table of [
    'brotherhoods',
    'images',
    'steps',
    'brotherhood_images',
    'brotherhood_steps',
    'cults',
    'outings',
    'band_agents',
    'band_premieres',
    'heritage_assets',
    'step_phases',
  ]) {
    assert.match(
      publicIndexability,
      new RegExp(`loadPublicRowsInBatches\\([\\s\\S]*?\\.from\\('${table}'\\)`),
      `${table} debe consultarse por lotes`
    )
  }
  assert.match(publicIndexability, /loadPublicRowsInPages\([\s\S]*?\.from\('music_accompaniment_periods'\)/)
})

test('los títulos SEO se acotan sin cortar palabras cuando existe espacio', () => {
  const title = compactSeoTitle('Cruceta musical extraordinariamente larga para una procesión de Sevilla')
  assert.ok(title.length <= 44)
  assert.equal(title.endsWith('…'), true)
  assert.doesNotMatch(title, /larg…$/)
})

test('los metadatos sociales siempre conservan imagen de respaldo y Twitter propio', () => {
  const metadata = socialMetadata({
    title: 'Marcha de prueba',
    description: 'Descripción de prueba',
    path: '/marchas/prueba',
  })

  assert.equal(metadata.openGraph.images[0].url, '/opengraph-image')
  assert.deepEqual(metadata.twitter.images, ['/opengraph-image'])
  assert.equal(metadata.twitter.title, 'Marcha de prueba · Hilo Cofrade')
})

test('schemaDate normaliza fechas fundacionales y descarta texto sin fecha', () => {
  assert.equal(schemaDate('13 de octubre de 1992'), '1992-10-13')
  assert.equal(schemaDate('Fundada en 1941'), '1941')
  assert.equal(schemaDate('Por documentar'), undefined)
})

test('los eventos vencidos no se declaran automáticamente como programados', () => {
  assert.equal(schemaEventStatus({ eventStatus: 'announced', isUpcoming: false }), undefined)
  assert.equal(
    schemaEventStatus({ eventStatus: 'announced', isUpcoming: true }),
    'https://schema.org/EventScheduled'
  )
  assert.equal(
    schemaEventStatus({ eventStatus: 'cancelled', isUpcoming: false }),
    'https://schema.org/EventCancelled'
  )
})

test('Bandas, Marchas, Crucetas y eventos usan el contrato social compartido', () => {
  for (const path of [
    'app/bandas/[slug]/page.js',
    'app/marchas/[slug]/page.js',
    'app/crucetas-musicales/[slug]/page.js',
    'app/agenda-cofrade/rosarios/[slug]/page.js',
    'app/igualas-y-ensayos/[slug]/page.js',
    'app/extraordinarias/[slug]/page.js',
    'app/procesiones-de-gloria/[slug]/page.js',
  ]) {
    assert.match(read(path), /socialMetadata/)
  }
})

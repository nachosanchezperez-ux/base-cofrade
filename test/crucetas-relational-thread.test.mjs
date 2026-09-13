import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const loader = readFileSync(new URL('../lib/supabase/musical-repertoires.js', import.meta.url), 'utf8')
const detail = readFileSync(new URL('../app/crucetas-musicales/[slug]/page.js', import.meta.url), 'utf8')
const marchLoader = readFileSync(new URL('../lib/supabase/public-marches.js', import.meta.url), 'utf8')
const marchDetail = readFileSync(new URL('../app/marchas/[slug]/page.js', import.meta.url), 'utf8')
const sitemap = readFileSync(new URL('../app/sitemap.js', import.meta.url), 'utf8')

test('la cruceta resuelve cada obra desde la Marcha canónica', () => {
  assert.match(loader, /from\('march_authors'\)/)
  assert.match(loader, /from\('march_dedications'\)/)
  assert.match(loader, /from\('march_recordings'\)/)
  assert.match(loader, /from\('band_release_tracks'\)/)
  assert.match(loader, /marchHref:.*`\/marchas\//s)
})

test('la cruceta muestra autoría, dedicatoria, veces interpretada y escucha', () => {
  assert.match(detail, />Autoría</)
  assert.match(detail, />Dedicatoria</)
  assert.match(detail, /performanceLabel\(entry\.count\)/)
  assert.match(detail, />Escuchar /)
  assert.match(detail, /No se deduce el orden, el lugar ni si las interpretaciones fueron consecutivas/)
})

test('la ficha pública de Marcha devuelve el hilo hacia las crucetas', () => {
  assert.match(marchLoader, /from\('musical_repertoire_entries'\)/)
  assert.match(marchLoader, /repertoireHistory/)
  assert.match(marchLoader, /documentedPerformances/)
  assert.match(marchDetail, /Marcha → procesión → banda/)
  assert.match(marchDetail, /Interpretada en/)
  assert.match(marchDetail, /Escuchar la marcha/)
  assert.match(marchDetail, /metricLabel\(march\.documentedPerformances, 'interpretación documentada', 'interpretaciones documentadas'\)/)
})

test('las Marchas descubiertas desde crucetas entran en el sitemap', () => {
  assert.match(sitemap, /repertoire\.entries/)
  assert.match(sitemap, /entry\.marchHref/)
})

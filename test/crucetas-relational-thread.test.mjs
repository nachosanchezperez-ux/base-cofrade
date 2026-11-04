import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const loader = readFileSync(new URL('../lib/supabase/musical-repertoires.js', import.meta.url), 'utf8')
const detail = readFileSync(new URL('../app/crucetas-musicales/[slug]/page.js', import.meta.url), 'utf8')
const explorer = readFileSync(new URL('../app/crucetas-musicales/[slug]/RepertoireExplorer.js', import.meta.url), 'utf8')
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

test('la cruceta solo enlaza perfiles públicos realmente publicados', () => {
  assert.match(loader, /href: publicEntityHref\(brotherhoodEntity\)/)
  assert.match(loader, /href: publicEntityHref\(band\)/)
})

test('la cruceta muestra autoría, dedicatoria, veces interpretada y escucha', () => {
  // Lista compacta (04/11/2026): el título enlaza a la ficha de la Marcha, sin
  // botón «Ver ficha» ni rótulos repetidos en cada obra.
  assert.match(explorer, /mainAuthors\(entry\)/)
  assert.match(explorer, /Dedicada a \{entry\.dedications\.map/)
  assert.match(explorer, /entry\.count > 1/)
  assert.doesNotMatch(explorer, /1 vez/)
  assert.match(explorer, /aria-label=\{`Escuchar \$\{entry\.title\}/)
  assert.doesNotMatch(explorer, />Ver ficha</)
  assert.doesNotMatch(explorer, />Autoría</)
  assert.match(detail, /no recoge el orden ni el lugar del recorrido/)
  assert.doesNotMatch(detail, /No se deduce el orden/)
})

test('la ficha pública de Marcha devuelve el hilo hacia las crucetas', () => {
  assert.match(marchLoader, /from\('musical_repertoire_entries'\)/)
  assert.match(marchLoader, /repertoireHistory/)
  assert.match(marchLoader, /documentedPerformances/)
  // Sin coletillas de sección (decisión 19/10/2026).
  assert.doesNotMatch(marchDetail, /Marcha → procesión → banda/)
  assert.match(marchDetail, /Interpretada en/)
  assert.match(marchDetail, /Escuchar la marcha/)
  assert.match(marchDetail, /metricLabel\(march\.documentedPerformances, 'interpretación documentada', 'interpretaciones documentadas'\)/)
})

test('las Marchas descubiertas desde crucetas entran en el sitemap', () => {
  assert.match(sitemap, /repertoire\.entries/)
  assert.match(sitemap, /entry\.marchHref/)
})

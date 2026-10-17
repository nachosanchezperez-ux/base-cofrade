import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { PUBLIC_DETAIL_DATA_REVALIDATE, publicDetailCacheDay } from '../lib/public-detail-cache.js'
import { BROTHERHOOD_DETAIL_DATA_REVALIDATE } from '../lib/brotherhood-detail-cache.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

// Decisión del propietario (14/10/2026), extendida el 15/10 a Imagen, Paso y Banda.
test('las fichas públicas comparten la caché de datos de 6 horas', () => {
  assert.equal(PUBLIC_DETAIL_DATA_REVALIDATE, 21600)
  assert.equal(BROTHERHOOD_DETAIL_DATA_REVALIDATE, PUBLIC_DETAIL_DATA_REVALIDATE)
  assert.equal(publicDetailCacheDay(new Date('2026-10-15T23:59:59Z')), '2026-10-15')

  const pages = read('lib/supabase/public-entity-pages.js')
  assert.match(pages, /\['hilo-cofrade-public-image-detail-v7-autores'\],\n  \{ revalidate: PUBLIC_DETAIL_DATA_REVALIDATE, tags: \['public-image-detail', 'public-brotherhood-detail'\] \}/)
  assert.match(pages, /\['hilo-cofrade-public-step-detail-v7-hc09'\],\n  \{ revalidate: PUBLIC_DETAIL_DATA_REVALIDATE, tags: \['public-step-detail', 'public-brotherhood-detail'\] \}/)
  // El histórico musical del Paso usa el año en curso.
  assert.match(pages, /return readPasoPage\(slug, publicDetailCacheDay\(\)\)/)
  assert.match(pages, /readCurrent: getCachedPasoPageBySlug,/)

  const bands = read('lib/supabase/bands.js')
  assert.match(bands, /\{ revalidate: PUBLIC_DETAIL_DATA_REVALIDATE, tags: \['public-band-detail'\] \}/)
  // Las próximas salidas se filtran por hoy.
  assert.match(bands, /return readBandPage\(slug, publicDetailCacheDay\(\)\)/)
  assert.match(bands, /readCurrent: getCachedBandBySlug,/)

  assert.match(read('components/StepCrewFacts.js'), /\{ revalidate: PUBLIC_DETAIL_DATA_REVALIDATE, tags: \['public-step-detail'\] \}/)
  assert.match(read('lib/supabase/relational-presence.js'), /\{ revalidate: PUBLIC_DETAIL_DATA_REVALIDATE, tags: \['public-relational-presence'\] \}/)

  // Las páginas siguen regenerándose cada 15 minutos.
  for (const page of ['app/imagenes/[slug]/page.js', 'app/pasos/[slug]/page.js']) {
    assert.match(read(page), /export const revalidate = 900;/, page)
  }
  assert.match(read('app/bandas/[slug]/page.js'), /export const revalidate = 900\b/)
})

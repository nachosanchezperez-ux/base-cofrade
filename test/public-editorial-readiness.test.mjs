import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import {
  meetsPublicEditorialMinimum,
  publicEditorialRobots,
  publicText,
} from '../lib/supabase/public-entity-page.js'

test('los placeholders editoriales no llegan a la presentación pública', () => {
  assert.equal(publicText('Sede canónica por documentar'), '')
  assert.equal(publicText('Autoría por documentar'), '')
  assert.equal(publicText('Pendiente de incorporar'), '')
  assert.equal(publicText('Capilla de la Piedad'), 'Capilla de la Piedad')
})

test('el mínimo editorial exige identidad, contexto, relación y fuente reales', () => {
  const complete = {
    identity: 'Hermandad de prueba',
    type: 'Gloria',
    context: 'Cantillana',
    summary: 'Resumen público útil y documentado.',
    relations: [[{ id: 'rel-1' }]],
    sources: [{ id: 'source-1' }],
    publicValues: ['Contenido público'],
  }

  assert.equal(meetsPublicEditorialMinimum(complete), true)
  assert.equal(meetsPublicEditorialMinimum({ ...complete, sources: [] }), false)
  assert.equal(meetsPublicEditorialMinimum({ ...complete, publicValues: ['Fecha por documentar'] }), false)
  assert.deepEqual(publicEditorialRobots(false), {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  })
})

test('Home cuenta el mismo conjunto navegable que el directorio público', async () => {
  const loader = await readFile(new URL('../lib/supabase/home-v2.js', import.meta.url), 'utf8')
  assert.match(loader, /getPublicEntityDirectory\(\)/)
  assert.match(loader, /for \(const item of directoryItems\)/)
  assert.doesNotMatch(loader, /const types = \['brotherhood', 'image', 'step', 'band'/)
})

test('las fichas mínimas reciben noindex sin perder navegación interna', async () => {
  const pages = await Promise.all([
    'app/hermandades/[slug]/page.js',
    'app/imagenes/[slug]/page.js',
    'app/pasos/[slug]/page.js',
    'app/bandas/[slug]/page.js',
  ].map((path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')))

  for (const page of pages) {
    assert.match(page, /meetsPublicEditorialMinimum/)
    assert.match(page, /publicEditorialRobots\(editoriallyReady\)/)
  }
})

test('el índice de ficha expone continuidad, estado activo y teclado', async () => {
  const nav = await readFile(new URL('../components/EntitySectionNav.js', import.meta.url), 'utf8')
  assert.match(nav, /aria-current=\{activeHref === item\.href \? 'location'/)
  assert.match(nav, /ArrowLeft/)
  assert.match(nav, /ArrowRight/)
  assert.match(nav, /Ver más secciones/)
  assert.match(nav, /scrollIntoView/)
})

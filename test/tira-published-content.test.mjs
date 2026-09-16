import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import {
  outingPublicHref,
  publishedContentIntent,
  publishedContentScore,
} from '../lib/tira-published-content.js'

test('reconoce las colecciones públicas que ya existen en la plataforma', () => {
  assert.deepEqual(publishedContentIntent('Cultos del Baratillo'), { kind: 'cults' })
  assert.deepEqual(publishedContentIntent('Procesiones de Gloria de Cantillana'), { kind: 'glory_processions' })
  assert.deepEqual(publishedContentIntent('Extraordinarias de Sevilla'), { kind: 'extraordinary_outings' })
  assert.deepEqual(publishedContentIntent('Cruceta de San Gonzalo Lunes Santo 2026'), { kind: 'musical_repertoires' })
  assert.deepEqual(publishedContentIntent('Conciertos de bandas este fin de semana'), { kind: 'agenda' })
  assert.deepEqual(publishedContentIntent('¿Qué hay hoy?'), { kind: 'agenda' })
  assert.equal(publishedContentIntent('¿Quién compuso Refúgiame?'), null)
  assert.equal(publishedContentIntent('¿Quién acompaña hoy a San Gonzalo?'), null)
})

test('puntúa el contenido por sus relaciones publicadas y no por nombres fijados', () => {
  const score = publishedContentScore(
    ['San Gonzalo · Lunes Santo 2026', 'Banda de Música Santa Ana de Dos Hermanas'],
    'Cruceta San Gonzalo Lunes Santo 2026 Santa Ana'
  )
  assert.ok(score >= 500)
  assert.equal(publishedContentScore(['Pastora de Cantillana'], 'San Gonzalo'), 0)
})

test('enruta cada salida hacia la superficie pública que ya tiene', () => {
  assert.equal(
    outingPublicHref({ character: 'extraordinary', slug: 'salida-prueba' }),
    '/extraordinarias/salida-prueba'
  )
  assert.equal(
    outingPublicHref({ character: 'ordinary', outing_type: 'Procesión de Gloria', slug: 'gloria-prueba' }),
    '/procesiones-de-gloria/gloria-prueba'
  )
  assert.equal(
    outingPublicHref({ character: 'ordinary', outing_type: 'Estación de penitencia' }, 'hermandad-prueba'),
    '/hermandades/hermandad-prueba#salidas'
  )
})

test('el buscador vivo incorpora aliases y superficies de contenido publicado', async () => {
  const search = await readFile(new URL('../lib/supabase/search-live.js', import.meta.url), 'utf8')
  const runtime = await readFile(new URL('../lib/supabase/tira-del-hilo-v12.js', import.meta.url), 'utf8')
  const content = await readFile(new URL('../lib/supabase/tira-del-hilo-published-content.js', import.meta.url), 'utf8')

  assert.match(search, /from\('entity_names'\)/)
  assert.match(search, /from\('image_names'\)/)
  assert.match(search, /from\('agent_names'\)/)
  assert.match(search, /from\('musical_repertoires'\)/)
  assert.match(search, /from\('outings'\)/)
  assert.match(search, /from\('cults'\)/)
  assert.match(search, /from\('heritage_updates'\)/)
  assert.match(search, /from\('band_premieres'\)/)
  assert.match(search, /\/marchas\/\$\{entity\.slug\}/)
  assert.match(runtime, /askHiloCofradePublishedContent/)
  assert.match(content, /getAgendaCofrade/)
  assert.match(content, /getGloryDirectory/)
  assert.match(content, /getExtraordinaryDirectory/)
  assert.match(content, /getMusicalRepertoires/)
})

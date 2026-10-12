import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

// Desde la PR B (Tarea 06) los periodos Hoy/Mañana/Fin de semana viven en la agenda
// inmediata (comportamiento cubierto en home-agenda-now.test.mjs); aquí solo quedan las
// categorías del bloque de áreas, que se retirará con la PR D.
test('la Home ofrece accesos directos a las categorías reales de Agenda', async () => {
  const overview = await read('components/HomeProjectOverview.js')
  const agenda = await read('components/AgendaCofradeDirectoryFromUrl.js')

  for (const category of ['processions', 'transfers', 'rosaries', 'romeries', 'devotions', 'concerts']) {
    assert.match(overview, new RegExp(`key: ['"]${category}['"]`))
    assert.match(agenda, new RegExp(`['"]${category}['"]`))
  }

  assert.ok(overview.includes('categoria=${category.key}#agenda'))
  assert.match(overview, /Por tipo de acto/)
  assert.match(overview, /Igualás y ensayos/)
})

test('la Home tiene una sola agenda, alimentada por la agenda temporal del snapshot', async () => {
  const home = await read('components/HomePageV2.js')
  const snapshot = await read('lib/supabase/home-snapshot.js')

  assert.match(home, /buildHomeAgendaNow\(homeTemporal\)/)
  assert.match(home, /<HomeAgendaNow agenda=\{agendaNow\} \/>/)
  assert.doesNotMatch(home, /HomeTemporalFocus|HomeProcessionGrid|followingSection/)
  assert.match(snapshot, /getAgendaCofrade/)
  assert.match(snapshot, /buildHomeTemporalAgenda/)
  // La agenda va antes que el contenido editorial de «Descubre hoy».
  assert.ok(home.indexOf('<HomeAgendaNow') < home.indexOf('<HomeTodayV2'))
})

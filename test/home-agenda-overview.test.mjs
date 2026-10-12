import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

// Desde la PR B (Tarea 06) los periodos Hoy/Mañana/Fin de semana viven en la agenda
// inmediata (comportamiento cubierto en home-agenda-now.test.mjs); aquí solo quedan las
// categorías del bloque de áreas, que se retirará con la PR D.
test('la Home lleva a la Agenda completa y a sus periodos con rutas existentes', async () => {
  const agendaView = await read('components/HomeAgendaNow.js')
  const model = await read('lib/home-agenda-now.js')

  assert.match(agendaView, /href="\/agenda-cofrade"/)
  for (const route of ['/agenda-cofrade/hoy', '/agenda-cofrade/manana', '/agenda-cofrade/fin-de-semana']) {
    assert.ok(model.includes(`'${route}'`), route)
  }
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

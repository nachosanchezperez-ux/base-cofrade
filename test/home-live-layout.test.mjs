import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

// Desde la PR B (Tarea 06) las procesiones en curso aparecen en la pestaña «Ahora» de la
// agenda inmediata y la primera se destaca con su horario completo. La selección se prueba
// por comportamiento en home-agenda-now.test.mjs.
test('con salidas en curso, la agenda va primero y el destacado en directo después', () => {
  const home = read('components/HomePageV2.js')
  assert.match(home, /selectHomeFeaturedOuting\(/)
  assert.match(home, /Procesión en curso/)
  const agenda = home.indexOf('<HomeAgendaNow')
  const featured = home.indexOf('id="extraordinarias"')
  const today = home.indexOf('<HomeTodayV2')
  assert.ok(agenda >= 0 && featured > agenda && today > featured)
})

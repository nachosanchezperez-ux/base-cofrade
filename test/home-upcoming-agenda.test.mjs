import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('la agenda de Home reúne extraordinarias y Glorias públicas por fecha', async () => {
  const loader = await read('lib/supabase/home-upcoming-agenda.js')

  assert.match(loader, /getNavigableHomeExtraordinaryOutings/)
  assert.match(loader, /getGloryDirectory/)
  assert.match(loader, /item\.isUpcoming && !item\.isCancelled/)
  assert.match(loader, /\.sort\(compareAgendaItems\)/)
  assert.match(loader, /typeLabel: 'Extraordinaria'/)
  assert.match(loader, /typeLabel: 'Gloria'/)
})

test('la Home presenta una agenda común sin sustituir las guías de detalle', async () => {
  const home = await read('components/HomePageV2.js')

  assert.match(home, /id="proximos-dias"/)
  assert.match(home, /En los próximos días/)
  assert.match(home, /Abrir guía completa/)
  assert.match(home, /href="\/extraordinarias"/)
  assert.match(home, /href="\/procesiones-de-gloria"/)
  assert.match(home, /Las siguientes citas/)
})

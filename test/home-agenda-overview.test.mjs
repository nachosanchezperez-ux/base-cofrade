import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('la Home ofrece accesos directos a los periodos y categorías reales de Agenda', async () => {
  const overview = await read('components/HomeProjectOverview.js')
  const agenda = await read('components/AgendaCofradeDirectoryFromUrl.js')

  assert.match(overview, /periodo=today#agenda/)
  assert.match(overview, /periodo=weekend#agenda/)

  for (const category of ['processions', 'transfers', 'rosaries', 'devotions', 'concerts']) {
    assert.match(overview, new RegExp(`key: ['"]${category}['"]`))
    assert.match(agenda, new RegExp(`['"]${category}['"]`))
  }

  assert.ok(overview.includes('categoria=${category.key}#agenda'))
  assert.match(overview, /Por tipo de acto/)
  assert.match(overview, /Igualás y ensayos/)
})

test('la Home diferencia la Agenda general del bloque de salidas procesionales', async () => {
  const home = await read('components/HomePageV2.js')

  assert.match(home, /Salidas procesionales/)
  assert.match(home, /En los próximos días/)
  assert.match(home, /Procesiones, traslados y salidas extraordinarias/)
  assert.match(home, /href="\/agenda-cofrade"/)
  assert.match(home, /href="\/extraordinarias"/)
  assert.match(home, /href="\/procesiones-de-gloria"/)
})

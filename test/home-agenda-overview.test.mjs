import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('la Home ofrece accesos directos a los periodos y categorías reales de Agenda', async () => {
  const overview = await read('components/HomeProjectOverview.js')
  const overviewCss = await read('components/HomeProjectOverview.module.css')
  const agenda = await read('components/AgendaCofradeDirectoryFromUrl.js')

  assert.match(overview, /\/agenda-cofrade\/hoy/)
  assert.match(overview, /\/agenda-cofrade\/manana/)
  assert.match(overview, /\/agenda-cofrade\/fin-de-semana/)

  for (const category of ['processions', 'transfers', 'rosaries', 'romeries', 'devotions', 'concerts']) {
    assert.match(overview, new RegExp(`key: ['"]${category}['"]`))
    assert.match(agenda, new RegExp(`['"]${category}['"]`))
  }

  assert.ok(overview.includes('categoria=${category.key}#agenda'))
  assert.match(overview, /Por tipo de acto/)
  assert.match(overview, /Igualás y ensayos/)

  assert.match(overviewCss, /\.agendaQuick\s*\{[\s\S]*grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\)/)
  assert.match(overviewCss, /\.agendaQuick a\s*\{[\s\S]*border-radius:\s*10px/)
  assert.doesNotMatch(overviewCss, /\.agendaQuick a::before/)
  assert.doesNotMatch(overviewCss, /\.agendaQuick a:first-child/)
  assert.doesNotMatch(overviewCss, /\.agendaQuick a\s*\{[\s\S]*border-radius:\s*999px/)
})

test('la Home diferencia la Agenda general del bloque de salidas procesionales', async () => {
  const home = await read('components/HomePageV2.js')

  assert.match(home, /Salidas procesionales/)
  assert.match(home, /En los próximos días/)
  assert.match(home, /Procesiones, romerías, traslados y salidas extraordinarias/)
  assert.match(home, /href="\/agenda-cofrade"/)
  assert.match(home, /href="\/extraordinarias"/)
  assert.match(home, /href="\/procesiones-de-gloria"/)
})


test('la Home prioriza la Agenda temporal antes del contenido editorial', async () => {
  const home = await read('components/HomePageV2.js')
  const snapshot = await read('lib/supabase/home-snapshot.js')
  const temporal = await read('components/HomeTemporalFocus.js')

  assert.match(home, /HomeTemporalFocus/)
  assert.match(home, /homeTemporal/)
  assert.match(snapshot, /getAgendaCofrade/)
  assert.match(snapshot, /buildHomeTemporalAgenda/)
  assert.match(temporal, /data-home-temporal-mode/)
  assert.match(temporal, /Guía de \{item\.municipality\}/)
  assert.match(temporal, /Ahora/)
  assert.match(temporal, /Mañana/)
  assert.match(temporal, /Fin de semana/)
})

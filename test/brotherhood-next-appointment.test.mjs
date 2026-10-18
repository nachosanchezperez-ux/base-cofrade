import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { nextBrotherhoodAppointment } from '../lib/brotherhood-reading.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('«Próximamente» elige el acto más cercano entre agenda, igualás, salidas y cultos', () => {
  const agenda = [
    { key: 'agenda:1', date: '2026-12-10', startTime: '20:00', title: 'Triduo' },
    { key: 'crew:2', date: '2026-11-05', startTime: '21:00', title: 'Igualá del paso de palio' },
  ]
  const outings = [{ id: 'o1', estado: 'announced', fecha: '2026-11-20', hora: '18:00', nombre: 'Traslado', tipo: 'Traslado' }]
  const cults = [{ id: 'c1', anunciada: true, fechaInicio: '2026-11-01', nombre: 'Besamanos', tipo: 'Besamanos' }]

  assert.equal(nextBrotherhoodAppointment(agenda, outings, '2026-10-18', cults).title, 'Besamanos')
  assert.equal(nextBrotherhoodAppointment(agenda, outings, '2026-11-02', cults).title, 'Igualá del paso de palio')
})

test('sin actos futuros no hay bloque', () => {
  assert.equal(nextBrotherhoodAppointment([], [], '2026-10-18', []), null)
  assert.equal(nextBrotherhoodAppointment([{ date: '2026-10-01', title: 'Pasado' }], [], '2026-10-18', []), null)
  assert.equal(nextBrotherhoodAppointment([{ date: '2026-11-01', title: 'Suspendido', isCancelled: true }], [], '2026-10-18', []), null)
})

test('el bloque va tras la cabecera, sustituye a «Próximas citas» y no se pinta vacío', () => {
  const page = read('app/hermandades/[slug]/page.js')
  const component = read('components/BrotherhoodNextAppointment.js')
  const css = read('components/BrotherhoodNextAppointment.module.css')

  const hero = page.indexOf('<BrotherhoodProgramHero')
  const next = page.indexOf('<BrotherhoodNextAppointment')
  const overview = page.indexOf('<BrotherhoodOverviewV2')
  assert.ok(hero < next && next < overview)
  assert.doesNotMatch(page, /BrotherhoodAgendaSection/)
  assert.match(component, /if \(!next\) return null/)
  assert.match(component, /id="agenda"/)
  // Colores de la propia Hermandad y enlaces sin subrayar.
  assert.match(css, /var\(--brotherhood-dark/)
  assert.match(css, /var\(--brotherhood-primary/)
  assert.doesNotMatch(css, /text-decoration:underline/)
})

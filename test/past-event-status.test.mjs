import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { crewEventDisplayStatus } from '../lib/crew-events.js'

test('una convocatoria pasada sin otro estado dice «Fecha pasada», no «Convocada»', () => {
  assert.deepEqual(crewEventDisplayStatus({ eventStatus: 'announced', isPast: true }), { status: 'past', label: 'Fecha pasada' })
  assert.deepEqual(crewEventDisplayStatus({ eventStatus: 'held', isPast: true }), { status: 'held', label: 'Celebrada' })
  assert.deepEqual(crewEventDisplayStatus({ eventStatus: 'cancelled', isPast: true }), { status: 'cancelled', label: 'Cancelada' })
  assert.deepEqual(crewEventDisplayStatus({ eventStatus: 'announced', isPast: false, urgencyLabel: 'Mañana' }), { status: 'announced', label: 'Mañana' })
  assert.deepEqual(crewEventDisplayStatus({ eventStatus: 'announced', isPast: false }), { status: 'announced', label: 'Convocada' })
})

test('las tres vistas de igualás usan el mismo estado', () => {
  for (const file of ['components/CrewEventDirectory.js', 'components/BrotherhoodCrewEventsSection.js', 'app/igualas-y-ensayos/[slug]/page.js']) {
    assert.match(readFileSync(file, 'utf8'), /crewEventDisplayStatus\(/, file)
  }
})

test('la ficha de extraordinaria pasada dice «Fecha pasada»', () => {
  const page = readFileSync('app/extraordinarias/[slug]/page.js', 'utf8')
  assert.match(page, /if \(item\.date && !item\.isUpcoming\) return 'Fecha pasada'/)
  assert.match(page, /data-status=\{statusKey\(item\)\}/)
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { buildAgendaTemporalLanding } from '../lib/agenda-temporal-landing.js'
import { crewEventSharePath } from '../lib/share.js'

// #1264 · Acción principal: el título y el botón principal de cada cita abren el
// acto concreto. Página propia si se conserva; si no, su tarjeta en la Agenda
// (/agenda-cofrade#acto-…), que abre el detalle. Nunca la ficha de una entidad.
const NOW = new Date('2026-10-24T06:00:00.000Z') // sábado 24/10/2026, 08:00 en Madrid

function item(key, overrides = {}) {
  const [category, id] = key.split(':')
  return {
    key, id, category, title: key, municipality: 'Sevilla', scope: 'capital',
    date: '2026-10-24', endDate: '', startTime: '19:00', isUpcoming: true, isCancelled: false,
    categoryHref: '/agenda-cofrade', ...overrides,
  }
}

function landingFor(items) {
  const landing = buildAgendaTemporalLanding({ period: 'today', today: '2026-10-24', now: NOW, items })
  return Object.fromEntries(landing.items.map((entry) => [entry.key, entry]))
}

test('cada tipo de cita lleva al propio acto', () => {
  const byKey = landingFor([
    // Concierto: sin href propio; organizerHref es la banda.
    item('concerts:c1', { href: '', organizerHref: '/bandas/las-cigarreras', relatedBrotherhoodHref: '/hermandades/trinidad', actionLabel: 'Ver banda' }),
    // Culto: su href era la sección de cultos de la Hermandad.
    item('devotions:d1', { href: '/hermandades/san-benito#cultos', organizerHref: '/hermandades/san-benito', actionLabel: 'Ver culto' }),
    // Salida ordinaria general: su href era la ficha de la Hermandad.
    item('processions:o1', { href: '/hermandades/valme', organizerHref: '/hermandades/valme', actionLabel: 'Ver procesión' }),
    // Extraordinaria con página conservada: se mantiene.
    item('processions:x1', { href: '/extraordinarias/estepa-san-francisco-asis-2026-10-11', categoryHref: '/extraordinarias', actionLabel: 'Ver salida' }),
    // Extraordinaria sin página conservada: ya apuntaba a su tarjeta.
    item('processions:x2', { href: '/agenda-cofrade#acto-processions-x2', categoryHref: '/extraordinarias', actionLabel: 'Ver salida' }),
  ])
  assert.equal(byKey['concerts:c1'].eventHref, '/agenda-cofrade#acto-concerts-c1')
  assert.equal(byKey['devotions:d1'].eventHref, '/agenda-cofrade#acto-devotions-d1')
  assert.equal(byKey['processions:o1'].eventHref, '/agenda-cofrade#acto-processions-o1')
  assert.equal(byKey['processions:x1'].eventHref, '/extraordinarias/estepa-san-francisco-asis-2026-10-11')
  assert.equal(byKey['processions:x2'].eventHref, '/agenda-cofrade#acto-processions-x2')
})

test('los enlaces a las entidades siguen aparte, con su etiqueta', () => {
  const byKey = landingFor([
    item('concerts:c1', { href: '', organizerHref: '/bandas/las-cigarreras', relatedBrotherhoodHref: '/hermandades/trinidad' }),
  ])
  assert.deepEqual(byKey['concerts:c1'].entityLinks.map((link) => [link.label, link.href]), [
    ['Ver banda', '/bandas/las-cigarreras'],
    ['Ver Hermandad', '/hermandades/trinidad'],
  ])
})

test('las igualás de las guías locales llevan a su convocatoria', () => {
  assert.equal(crewEventSharePath({ detailHref: '/igualas-y-ensayos/costaleros-x', anchor: 'iguala-x' }, true), '/igualas-y-ensayos/costaleros-x')
  assert.equal(crewEventSharePath({ detailHref: '', anchor: 'iguala-x' }, false), '/igualas-y-ensayos#iguala-x')
})

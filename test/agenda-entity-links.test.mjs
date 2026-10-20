import test from 'node:test'
import assert from 'node:assert/strict'
import { agendaBrotherhoodHref, agendaEntityLink, agendaEntityLinks } from '../lib/agenda-entity-links.js'
import { buildAgendaTemporalLanding } from '../lib/agenda-temporal-landing.js'

// #1264: el 18/10 un concierto de la Soledad de Cantillana se listaba en Hoy con
// un enlace «Hermandad» que llevaba a una banda. En los conciertos, la Agenda
// guarda la banda principal en `organizerHref` (lib/supabase/agenda-cofrade.js).
const concert = {
  key: 'concerts:c1', id: 'c1', title: 'Concierto de marchas', category: 'concerts',
  categoryHref: '/agenda-cofrade?categoria=concerts#agenda', municipality: 'Cantillana', scope: 'province',
  date: '2026-10-18', startTime: '20:00', isUpcoming: true, isCancelled: false,
  organizer: 'Banda de la Soledad', organizerHref: '/bandas/soledad-cantillana', href: '',
}

test('la etiqueta sale del destino real: ficha de Hermandad o de banda', () => {
  assert.deepEqual(agendaEntityLink('/hermandades/soledad-cantillana'), { kind: 'brotherhood', label: 'Ver Hermandad', href: '/hermandades/soledad-cantillana' })
  assert.deepEqual(agendaEntityLink('/bandas/soledad-cantillana'), { kind: 'band', label: 'Ver banda', href: '/bandas/soledad-cantillana' })
  // Ni un listado ni una ruta desconocida reciben una etiqueta de entidad.
  assert.equal(agendaEntityLink('/hermandades/'), null)
  assert.equal(agendaEntityLink('/agenda-cofrade'), null)
  assert.equal(agendaEntityLink(''), null)
})

test('un concierto enlaza su banda como banda y su Hermandad relacionada como Hermandad', () => {
  assert.deepEqual(agendaEntityLinks(concert).map((link) => [link.label, link.href]), [['Ver banda', '/bandas/soledad-cantillana']])
  assert.equal(agendaBrotherhoodHref(concert), '')

  const withBrotherhood = { ...concert, relatedBrotherhoodHref: '/hermandades/soledad-cantillana' }
  assert.deepEqual(agendaEntityLinks(withBrotherhood).map((link) => link.label), ['Ver banda', 'Ver Hermandad'])
  assert.equal(agendaBrotherhoodHref(withBrotherhood), '/hermandades/soledad-cantillana')
})

test('un culto o una salida conservan su enlace a la Hermandad, sin duplicarlo', () => {
  const culto = { organizerHref: '/hermandades/san-benito', relatedBrotherhoodHref: '/hermandades/san-benito' }
  assert.deepEqual(agendaEntityLinks(culto).map((link) => [link.label, link.href]), [['Ver Hermandad', '/hermandades/san-benito']])
})

test('Hoy muestra «Ver banda» para el concierto, nunca «Hermandad» hacia una banda', () => {
  const landing = buildAgendaTemporalLanding({
    period: 'today',
    today: '2026-10-18',
    now: new Date('2026-10-18T10:00:00.000Z'),
    items: [
      concert,
      { ...concert, key: 'devotions:d1', id: 'd1', title: 'Besamanos', category: 'devotions', categoryHref: '/agenda-cofrade', organizerHref: '/hermandades/san-benito' },
    ],
  })
  const byKey = Object.fromEntries(landing.items.map((entry) => [entry.key, entry]))
  assert.deepEqual(byKey['concerts:c1'].entityLinks.map((link) => link.label), ['Ver banda'])
  assert.equal(byKey['concerts:c1'].brotherhoodHref, '')
  assert.deepEqual(byKey['devotions:d1'].entityLinks.map((link) => link.label), ['Ver Hermandad'])
  assert.equal(byKey['devotions:d1'].brotherhoodHref, '/hermandades/san-benito')
})

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { followedCalendarPath, followedCalendarSlugs, calendarSubscribeLinks } from '../lib/agenda-ics-links.js'
import { brotherhoodsCalendarItems } from '../lib/agenda-ics.js'
import { agendaItemBrotherhoodSlugs } from '../lib/followed-brotherhoods.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('el calendario «Mis hermandades» lleva la selección en la ruta, ordenada y limpia', () => {
  assert.equal(followedCalendarPath(['la-trinidad', 'pino-montano', 'la-trinidad', 'MAL slug']), '/calendario/mis-hermandades/la-trinidad~pino-montano.ics')
  assert.equal(followedCalendarPath([]), '')
  assert.deepEqual(followedCalendarSlugs('la-trinidad~pino-montano~../x.ics'), ['la-trinidad', 'pino-montano'])
  const links = calendarSubscribeLinks('/calendario/mis-hermandades/la-trinidad~pino-montano.ics')
  assert.equal(links.webcal, 'webcal://hilocofrade.es/calendario/mis-hermandades/la-trinidad~pino-montano.ics')
  assert.match(links.google, /^https:\/\/calendar\.google\.com\/calendar\/r\?cid=webcal/)
  assert.equal(calendarSubscribeLinks('/calendario/mis-hermandades/../x.ics'), null)
})

test('reúne los actos de varias hermandades sin repetir y sin los pasados', () => {
  const items = [
    { key: 'a', organizerHref: '/hermandades/la-trinidad' },
    { key: 'b', organizerHref: '/bandas/cigarreras', relatedBrotherhoodHref: '/hermandades/la-trinidad' },
    { key: 'c', organizerHref: '/hermandades/pino-montano' },
    { key: 'd', organizerHref: '/hermandades/pino-montano', isPast: true },
  ]
  assert.deepEqual(brotherhoodsCalendarItems(items, ['la-trinidad', 'pino-montano', 'la-trinidad']).map((item) => item.key), ['a', 'b', 'c'])
})

test('un acto es «tuyo» por su organizadora o por la Hermandad relacionada', () => {
  assert.deepEqual(agendaItemBrotherhoodSlugs({ organizerHref: '/bandas/x', relatedBrotherhoodHref: '/hermandades/la-trinidad' }), ['la-trinidad'])
  assert.deepEqual(agendaItemBrotherhoodSlugs({ organizerHref: '/hermandades/a', relatedBrotherhoodHref: '/hermandades/a' }), ['a'])
  const directory = read('components/AgendaCofradeDirectoryV4.js')
  assert.match(directory, /const isMine = \(item\) => agendaItemBrotherhoodSlugs\(item\)/)
  assert.match(directory, /<EventFollow item=\{item\} \/>/)
  assert.match(directory, /followedCalendarPath\(followed\.map/)
})

test('el botón de seguir ya no promete ordenar primero y la ruta del calendario valida la selección', () => {
  const button = read('components/FollowBrotherhoodButton.js')
  assert.doesNotMatch(button, /aparecerán primero/)
  assert.match(button, /llevan una estrella/)
  const route = read('app/calendario/mis-hermandades/[slugs]/route.js')
  assert.match(route, /filter\(\(slug\) => known\.has\(slug\)\)/)
  assert.match(read('components/AgendaTemporalEventList.js'), /<AgendaFollowedInPeriod/)
})

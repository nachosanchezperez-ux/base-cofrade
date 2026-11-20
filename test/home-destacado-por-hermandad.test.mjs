import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { featuredGuideHref, followUpWhen, getHomeEditorialFocuses } from '../lib/home-editorial-focus.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const SAN_ESTEBAN = '36b4d5c1-f7bb-4025-a09a-948e0d5d188f'

test('dos salidas destacadas de la misma Hermandad van en una sola tarjeta', () => {
  const outings = [
    { id: 'regreso', brotherhoodId: SAN_ESTEBAN, organizerHref: '/hermandades/san-esteban', date: '2026-11-22', startTime: '16:00', title: 'Regreso' },
    { id: 'traslado', brotherhoodId: SAN_ESTEBAN, organizerHref: '/hermandades/san-esteban', date: '2026-11-21', startTime: '11:00', title: 'Traslado' },
    { id: 'otra', brotherhoodId: 'x', organizerHref: '/hermandades/otra', date: '2026-11-21', startTime: '19:00', title: 'Otra' },
  ]
  const focuses = [
    { outingId: 'traslado', startsOn: '2026-11-18', endsOn: '2026-11-21', priority: 20 },
    { outingId: 'regreso', startsOn: '2026-11-18', endsOn: '2026-11-22', priority: 10 },
    { outingId: 'otra', startsOn: '2026-11-18', endsOn: '2026-11-21', priority: 5 },
  ]
  const result = getHomeEditorialFocuses(outings, '2026-11-20', focuses)
  assert.deepEqual(result.map((entry) => entry.outing.id), ['traslado', 'otra'])
  assert.deepEqual(result[0].followUps.map((item) => item.id), ['regreso'])
  assert.deepEqual(result[1].followUps, [])
})

test('cuando el traslado termina, el regreso ocupa la tarjeta', () => {
  const outings = [
    { id: 'traslado', brotherhoodId: SAN_ESTEBAN, date: '2026-11-21', startTime: '11:00', liveState: { state: 'done' } },
    { id: 'regreso', brotherhoodId: SAN_ESTEBAN, date: '2026-11-22', startTime: '16:00' },
  ]
  const focuses = [
    { outingId: 'traslado', startsOn: '2026-11-18', endsOn: '2026-11-21', priority: 20 },
    { outingId: 'regreso', startsOn: '2026-11-18', endsOn: '2026-11-22', priority: 10 },
  ]
  const result = getHomeEditorialFocuses(outings, '2026-11-21', focuses)
  assert.deepEqual(result.map((entry) => entry.outing.id), ['regreso'])
})

test('la guía lleva a la ficha de la Hermandad en modo aplicación', () => {
  assert.equal(featuredGuideHref({ brotherhoodId: SAN_ESTEBAN, organizerHref: '/hermandades/san-esteban', href: '/extraordinarias/x' }), '/hermandades/san-esteban#salida')
  assert.equal(featuredGuideHref({ brotherhoodId: 'fuera-del-piloto', organizerHref: '/hermandades/otra', href: '/extraordinarias/x' }), '/extraordinarias/x')
  assert.equal(featuredGuideHref({ brotherhoodId: SAN_ESTEBAN, brotherhoodHref: '/hermandades/san-esteban', href: '/extraordinarias/x' }), '/hermandades/san-esteban#salida')
  assert.equal(followUpWhen({ date: '2026-11-22', startTime: '16:00' }), 'Dom 22 · 16:00')
  assert.equal(followUpWhen({ date: '2026-11-22', departureTime: '16:00' }), 'Dom 22 · 16:00')
})

test('la portada pinta «Y después» y no repite la salida en curso', () => {
  assert.match(read('components/HomeFeaturedOuting.js'), /Y después/)
  assert.match(read('components/HomePageV2.js'), /followUps=\{followUps\}/)
  assert.match(read('lib/home-agenda-now.js'), /followUps/)
  assert.match(read('lib/supabase/extraordinary-directory.js'), /brotherhoodId: item\.brotherhood_entity_id/)
  assert.match(read('lib/supabase/home.js'), /brotherhoodId: item\.brotherhood_entity_id/)
  assert.match(read('lib/supabase/home-snapshot.js'), /brotherhoodHrefById/)
})

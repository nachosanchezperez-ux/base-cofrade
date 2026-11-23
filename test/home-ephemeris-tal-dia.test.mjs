// «Tal día como hoy» / «Esta semana en la historia» (23/11/2026): efeméride
// exacta si existe; si no, la más cercana a ±3 días. Solo años anteriores.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import {
  ephemerisCardFromSelection,
  kindPriority,
  longDate,
  OPERATIONAL_EVENT_TYPES,
  selectEphemeris,
  yearsAgoLabel,
} from '../lib/home-ephemeris.js'

const fact = (id, date, kind = 'Hito histórico', extra = {}) => ({
  id, date, kind, title: `Hecho ${id}`, summary: 'Descripción', href: `/hermandades/${id}`, ...extra,
})

test('día exacto antes que la semana, y nunca del año en curso', () => {
  const candidates = [
    fact('cerca', '1990-11-21'),
    fact('exacto', '1964-11-23'),
    fact('este-ano', '2026-11-23', 'Coronación canónica'),
  ]
  const selection = selectEphemeris(candidates, '2026-11-23')
  assert.equal(selection.mode, 'day')
  assert.equal(selection.item.id, 'exacto')
})

test('sin día exacto: el hecho más cercano dentro de ±3 días', () => {
  const selection = selectEphemeris([
    fact('a-tres', '1990-11-26'),
    fact('a-uno', '2001-11-22'),
    fact('lejos', '1980-12-10'),
  ], '2026-11-23')
  assert.deepEqual([selection.mode, selection.item.id], ['week', 'a-uno'])
  assert.equal(selectEphemeris([fact('lejos', '1980-12-10')], '2026-11-23'), null)
})

test('la semana cruza el cambio de año', () => {
  const selection = selectEphemeris([fact('nochevieja', '1950-12-30')], '2027-01-02')
  assert.equal(selection.mode, 'week')
})

test('a igualdad de día, primero coronaciones y fundaciones; sin enlace no cuenta', () => {
  const selection = selectEphemeris([
    fact('pregon', '2007-11-23', 'Pregón de las Glorias'),
    fact('coronacion', '1997-11-23', 'Coronación canónica'),
    fact('sin-enlace', '1900-11-23', 'Fundación', { href: '' }),
  ], '2026-11-23')
  assert.equal(selection.item.id, 'coronacion')
  assert.ok(kindPriority('Fundación') > kindPriority('Pregón de las Glorias'))
})

test('la agenda operativa nunca es efeméride', () => {
  for (const type of ['iguala', 'ensayo', 'muda', 'concierto']) assert.ok(OPERATIONAL_EVENT_TYPES.has(type))
  assert.equal(OPERATIONAL_EVENT_TYPES.has('Coronación canónica'), false)
})

test('tarjeta: rótulo según el modo, fecha completa y años', () => {
  assert.equal(longDate('1964-11-23'), '23 de noviembre de 1964')
  assert.equal(yearsAgoLabel('2025-11-20', '2026-11-23'), 'hace un año')
  const card = ephemerisCardFromSelection({ mode: 'day', item: fact('x', '1964-11-23', 'Fundación', { rootEntityId: 'b1' }) }, '2026-11-23')
  assert.equal(card.label, 'Tal día como hoy')
  assert.equal(card.summary, '23 de noviembre de 1964 · hace 62 años. Descripción.')
  assert.equal(card.kind, 'ephemeris')
  assert.equal(card.rootEntityId, 'b1')
  assert.equal(ephemerisCardFromSelection({ mode: 'week', item: fact('y', '1964-11-21') }, '2026-11-23').label, 'Esta semana en la historia')
  assert.equal(ephemerisCardFromSelection(null, '2026-11-23'), null)
})

test('la portada ya no usa la vista que mezclaba igualás y ensayos', () => {
  const source = readFileSync(new URL('../lib/supabase/home-v2.js', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /from\('today_ephemeris_candidates'\)/)
  assert.match(source, /getEphemerisCandidates\(\)/)
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { pieceCredits, sharedPremiere } from '../lib/supabase/outing-occasion.js'

test('las marchas comparten el estreno solo si todas lo tienen igual', () => {
  const premiere = '23 de octubre de 2026, Real Parroquia de Santa María Magdalena (Sevilla)'
  assert.equal(sharedPremiere([{ premiere }, { premiere }]), premiere)
  assert.equal(sharedPremiere([{ premiere }, { premiere: '' }]), '')
  assert.equal(sharedPremiere([{ premiere }, { premiere: '1 de enero de 2026' }]), '')
  assert.equal(sharedPremiere([]), '')
})

test('los créditos de una pieza se agrupan por disciplina sin repetir nombres', () => {
  const names = new Map([['a', 'Orfebre'], ['b', 'Joyera'], ['c', 'Diseñador']])
  const credits = pieceCredits([
    { discipline: 'Orfebrería', agent_entity_id: 'a' },
    { discipline: 'Joyería', agent_entity_id: 'b' },
    { discipline: 'Orfebrería', agent_entity_id: 'a' },
    { discipline: 'Diseño', agent_entity_id: 'c' },
    { discipline: 'Diseño', agent_entity_id: 'sin-publicar' },
  ], names)
  assert.deepEqual(credits, [
    { discipline: 'Orfebrería', names: ['Orfebre'] },
    { discipline: 'Joyería', names: ['Joyera'] },
    { discipline: 'Diseño', names: ['Diseñador'] },
  ])
})

test('la salida destacada y la Agenda muestran la jornada; los datos llegan del detalle', () => {
  const card = readFileSync(new URL('../components/BrotherhoodChapterOuting.js', import.meta.url), 'utf8')
  const agenda = readFileSync(new URL('../app/procesiones-de-gloria/[slug]/page.js', import.meta.url), 'utf8')
  const detail = readFileSync(new URL('../lib/supabase/glory-directory.js', import.meta.url), 'utf8')
  const loader = readFileSync(new URL('../lib/supabase/outing-occasion.js', import.meta.url), 'utf8')
  assert.match(card, /<OutingOccasion occasion=\{outing\.occasion\}/)
  assert.match(agenda, /<OutingOccasion occasion=\{item\.occasion\}/)
  assert.match(detail, /loadOutingOccasion\(supabase/)
  assert.match(detail, /\.catch\(\(error\) =>/)
  assert.match(loader, /'commemorates'/)
  assert.match(loader, /\.eq\('event_category', 'historical'\)/)
})

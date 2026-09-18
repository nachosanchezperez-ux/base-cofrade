import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

import { subsetFiltersV10Intent } from '../lib/tira-subset-filters-v10.js'
import { relationalV2Intent } from '../lib/tira-relational-v2.js'

const brotherhoodSet = {
  resultSet: {
    entityType: 'brotherhood',
    entityIds: ['h1', 'h2', 'h3'],
  },
}

test('filtra el conjunto por naturaleza de la corporación', () => {
  assert.deepEqual(
    subsetFiltersV10Intent('Quédate solo con las sacramentales', brotherhoodSet),
    { kind: 'brotherhood_set_filter_type', brotherhoodType: 'Sacramental' }
  )
  assert.deepEqual(
    subsetFiltersV10Intent('Muéstrame solo las de penitencia', brotherhoodSet),
    { kind: 'brotherhood_set_filter_type', brotherhoodType: 'Penitencia' }
  )
  assert.deepEqual(
    subsetFiltersV10Intent('Solo las glorias', brotherhoodSet),
    { kind: 'brotherhood_set_filter_type', brotherhoodType: 'Gloria' }
  )
  assert.deepEqual(
    subsetFiltersV10Intent('Solo las agrupaciones parroquiales', brotherhoodSet),
    { kind: 'brotherhood_set_filter_type', brotherhoodType: 'Agrupación Parroquial' }
  )
})

test('filtra por municipio dentro del conjunto anterior', () => {
  assert.equal(
    subsetFiltersV10Intent('Solo las de Sevilla', brotherhoodSet)?.kind,
    'brotherhood_set_filter_municipality'
  )
  assert.equal(
    subsetFiltersV10Intent('De esas, las de Dos Hermanas', brotherhoodSet)?.kind,
    'brotherhood_set_filter_municipality'
  )
})

test('filtra por presencia o ausencia de cultos futuros', () => {
  assert.equal(
    subsetFiltersV10Intent('Solo las que tienen cultos próximos', brotherhoodSet)?.kind,
    'brotherhood_set_filter_with_future_cults'
  )
  assert.equal(
    subsetFiltersV10Intent('Quédate solo con las que no tienen cultos próximos', brotherhoodSet)?.kind,
    'brotherhood_set_filter_without_future_cults'
  )
})

test('filtra las que no llevan acompañamiento musical', () => {
  assert.equal(
    subsetFiltersV10Intent('Solo las que no llevan banda', brotherhoodSet)?.kind,
    'brotherhood_set_filter_without_music'
  )
  assert.equal(relationalV2Intent('¿Cuáles no llevan banda?', brotherhoodSet), null)
  assert.equal(relationalV2Intent('¿Cuáles llevan banda?', brotherhoodSet)?.kind, 'brotherhoods_with_music')
})

test('V10 solo actúa cuando existe un conjunto conversacional de Hermandades', () => {
  assert.equal(subsetFiltersV10Intent('Solo las sacramentales', null), null)
  assert.equal(subsetFiltersV10Intent('Solo las sacramentales', {
    resultSet: { entityType: 'band', entityIds: ['b1', 'b2'] },
  }), null)
})

test('V10 reduce el contexto y usa únicamente datos estructurados', async () => {
  const source = await readFile(new URL('../lib/supabase/tira-del-hilo-subset-filters-v10.js', import.meta.url), 'utf8')
  const orchestrator = await readFile(new URL('../lib/supabase/tira-del-hilo-v12.js', import.meta.url), 'utf8')

  assert.match(source, /from\('brotherhoods'\)/)
  assert.match(source, /from\('municipalities'\)/)
  assert.match(source, /from\('current_music_accompaniments'\)/)
  assert.match(source, /from\('calendar_cult_days'\)/)
  assert.match(source, /setContext\(context, filtered\.map/)
  assert.match(source, /'brotherhood_set_filter_type'/)
  assert.match(source, /'brotherhood_set_filter_municipality'/)
  assert.match(source, /'brotherhood_set_filter_without_music'/)
  assert.match(source, /'brotherhood_set_filter_with_future_cults'/)
  assert.match(orchestrator, /askHiloCofradeSubsetFiltersV10/)
  assert.ok(
    orchestrator.indexOf('askHiloCofradeSubsetFiltersV10(clean, context)')
      < orchestrator.indexOf('askHiloCofradeRelationalV2(clean, context)')
  )
})

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import { freeFactIntent } from '../lib/tira-free-facts.js'
import { setCrossesV9Intent } from '../lib/tira-set-crosses-v9.js'
import { subsetFiltersV10Intent } from '../lib/tira-subset-filters-v10.js'

test('Cantillana entra por los intents territoriales genéricos', () => {
  assert.deepEqual(
    freeFactIntent('Hermandades de Cantillana'),
    { kind: 'brotherhoods_by_municipality', entityTypes: ['brotherhood'] }
  )
  assert.deepEqual(
    freeFactIntent('Bandas de Cantillana'),
    { kind: 'bands_by_municipality', entityTypes: ['band'] }
  )
  assert.deepEqual(
    freeFactIntent('Qué hay en Cantillana'),
    { kind: 'municipality_overview', entityTypes: ['brotherhood', 'band'] }
  )
})

test('Cantillana puede seguir una cadena V10 sin perder el conjunto', () => {
  const initialContext = {
    resultSet: {
      entityType: 'brotherhood',
      entityIds: ['asuncion', 'pastora', 'soledad'],
    },
  }

  assert.deepEqual(
    subsetFiltersV10Intent('Solo las glorias', initialContext),
    { kind: 'brotherhood_set_filter_type', brotherhoodType: 'Gloria' }
  )

  const gloryContext = {
    resultSet: {
      entityType: 'brotherhood',
      entityIds: ['asuncion', 'pastora'],
    },
  }
  assert.equal(setCrossesV9Intent('Compáralas.', gloryContext)?.kind, 'brotherhood_set_compare')
})

test('el buscador no contiene excepciones nominales para Cantillana', async () => {
  const files = await Promise.all([
    '../lib/tira-free-facts.js',
    '../lib/tira-subset-filters-v10.js',
    '../lib/tira-set-crosses-v9.js',
    '../lib/supabase/tira-del-hilo-free-facts.js',
    '../lib/supabase/tira-del-hilo-subset-filters-v10.js',
    '../lib/supabase/tira-del-hilo-set-crosses-v9.js',
  ].map((path) => readFile(new URL(path, import.meta.url), 'utf8')))

  for (const source of files) assert.doesNotMatch(source, /cantillana/i)
})

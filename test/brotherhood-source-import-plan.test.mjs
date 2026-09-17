import assert from 'node:assert/strict'
import test from 'node:test'

import {
  canonicalSourceUrl,
  planBrotherhoodSourceImport,
} from '../lib/brotherhood-source-import-plan.js'

test('canonicaliza URL sin perder parámetros funcionales', () => {
  assert.equal(
    canonicalSourceUrl('HTTPS://Example.com//historia/?utm_source=ig&b=2&a=1#portada'),
    'https://example.com/historia?a=1&b=2'
  )
  assert.equal(canonicalSourceUrl('ftp://example.com/file'), null)
  assert.equal(canonicalSourceUrl(''), '')
})

test('reutiliza una fuente existente y detecta el vínculo aunque haya fuentes duplicadas', () => {
  const brotherhoods = [
    { id: 'h1', slug: 'san-benito', name: 'Hermandad de San Benito' },
  ]
  const sources = [
    {
      id: 's1',
      name: 'San Benito · web oficial',
      url: 'https://hermandaddesanbenito.net/',
      source_type: 'Web oficial',
      created_at: '2026-01-01T00:00:00Z',
    },
    {
      id: 's2',
      name: 'Hermandad de San Benito',
      url: 'https://hermandaddesanbenito.net/?utm_source=instagram',
      source_type: 'website',
      created_at: '2026-02-01T00:00:00Z',
    },
  ]
  const sourceLinks = [
    { source_id: 's2', entity_id: 'h1', scope: 'general' },
  ]

  const plan = planBrotherhoodSourceImport({
    brotherhoods,
    sources,
    sourceLinks,
    rows: [
      {
        hermandad_slug: 'san-benito',
        fuente: 'San Benito · web oficial',
        url: 'https://hermandaddesanbenito.net/#inicio',
        tipo_fuente: 'Web oficial',
      },
    ],
  })

  assert.deepEqual(plan.summary, {
    totalRows: 1,
    newSources: 0,
    reusedSources: 1,
    newLinks: 0,
    noops: 1,
    review: 0,
    invalid: 0,
  })
  assert.equal(plan.actions.reusedSources[0].sourceId, 's1')
  assert.deepEqual(plan.actions.reusedSources[0].duplicateExistingSourceIds, ['s1', 's2'])
  assert.equal(plan.actions.noops[0].reason, 'source_already_linked')
})

test('crea una sola fuente nueva y permite vincularla a varias hermandades', () => {
  const brotherhoods = [
    { id: 'h1', slug: 'uno', name: 'Hermandad Uno' },
    { id: 'h2', slug: 'dos', name: 'Hermandad Dos' },
  ]
  const rows = [
    {
      hermandad: 'Hermandad Uno',
      fuente: 'Consejo local',
      url: 'https://ejemplo.es/censo?year=2026&utm_medium=social',
      tipo_fuente: 'Fuente institucional',
      ambito: 'Identidad',
    },
    {
      hermandad: 'Hermandad Dos',
      fuente: 'Consejo local',
      url: 'https://ejemplo.es/censo?year=2026',
      tipo_fuente: 'Fuente institucional',
      ambito: 'Identidad',
    },
  ]

  const plan = planBrotherhoodSourceImport({ rows, brotherhoods })

  assert.equal(plan.summary.newSources, 1)
  assert.equal(plan.summary.newLinks, 2)
  assert.equal(plan.summary.review, 0)
  assert.equal(plan.actions.linksToCreate[0].sourceId, null)
  assert.equal(plan.actions.linksToCreate[0].sourceKey, plan.actions.linksToCreate[1].sourceKey)
})

test('no adivina hermandades ambiguas ni acepta URL inválidas', () => {
  const brotherhoods = [
    { id: 'h1', slug: 'rosario-a', name: 'Hermandad del Rosario' },
    { id: 'h2', slug: 'rosario-b', name: 'Hermandad del Rosario' },
  ]

  const plan = planBrotherhoodSourceImport({
    brotherhoods,
    rows: [
      {
        hermandad: 'Hermandad del Rosario',
        fuente: 'Fuente oficial',
        url: 'https://ejemplo.es',
      },
      {
        hermandad_slug: 'rosario-a',
        fuente: 'Fuente rota',
        url: 'no-es-una-url',
      },
    ],
  })

  assert.equal(plan.summary.review, 1)
  assert.equal(plan.actions.review[0].reason, 'ambiguous_brotherhood_name')
  assert.deepEqual(plan.actions.review[0].candidateIds, ['h1', 'h2'])
  assert.equal(plan.summary.invalid, 1)
  assert.equal(plan.actions.invalid[0].reason, 'invalid_source_url')
})

test('acepta cabeceras españolas y marca los valores inferidos por defecto', () => {
  const plan = planBrotherhoodSourceImport({
    brotherhoods: [{ id: 'h1', slug: 'humildad', name: 'Humildad y Caridad' }],
    rows: [
      {
        'Hermandad slug': 'humildad',
        Enlace: 'https://humildadycaridad.example/',
      },
    ],
  })

  assert.equal(plan.summary.newSources, 1)
  assert.equal(plan.summary.newLinks, 1)
  assert.equal(plan.actions.sourcesToCreate[0].source.name, 'humildad · fuente')
  assert.equal(plan.actions.sourcesToCreate[0].source.source_type, 'web')
  assert.deepEqual(
    plan.actions.sourcesToCreate[0].warnings,
    ['source_name_inferred', 'source_type_defaulted']
  )
})

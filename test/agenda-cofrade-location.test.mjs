import assert from 'node:assert/strict'
import test from 'node:test'

import {
  agendaLocationMatches,
  agendaMunicipalityOptions,
  agendaMunicipalitySlug,
} from '../lib/agenda-cofrade-location.js'

test('normaliza municipios para enlaces estables', () => {
  assert.equal(agendaMunicipalitySlug('La Rinconada'), 'la-rinconada')
  assert.equal(agendaMunicipalitySlug('Alcalá de Guadaíra'), 'alcala-de-guadaira')
})

test('construye un selector provincial sin duplicados', () => {
  const items = [
    { scope: 'province', municipality: 'Tomares' },
    { scope: 'province', municipality: 'La Rinconada' },
    { scope: 'province', municipality: 'Tomares' },
    { scope: 'capital', municipality: 'Sevilla' },
  ]

  assert.deepEqual(agendaMunicipalityOptions(items), [
    { slug: 'la-rinconada', label: 'La Rinconada' },
    { slug: 'tomares', label: 'Tomares' },
  ])
})

test('combina territorio provincial con municipio concreto', () => {
  const tomares = { scope: 'province', municipality: 'Tomares' }
  const utrera = { scope: 'province', municipality: 'Utrera' }
  const sevilla = { scope: 'capital', municipality: 'Sevilla' }

  assert.equal(agendaLocationMatches(tomares, 'province', ''), true)
  assert.equal(agendaLocationMatches(tomares, 'province', 'tomares'), true)
  assert.equal(agendaLocationMatches(utrera, 'province', 'tomares'), false)
  assert.equal(agendaLocationMatches(sevilla, 'province', 'tomares'), false)
  assert.equal(agendaLocationMatches(sevilla, 'capital', ''), true)
  assert.equal(agendaLocationMatches(tomares, 'all', 'tomares'), true)
})

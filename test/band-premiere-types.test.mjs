import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { presentBandPremiere } from '../lib/bands/premieres.js'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('presenta una recuperación histórica sin denominarla estreno', () => {
  assert.deepEqual(
    presentBandPremiere(
      'Tipo de novedad: recuperación histórica. Obra recuperada para la procesión de Santa Ana de 2026.',
    ),
    {
      type: 'Recuperación histórica',
      description: 'Obra recuperada para la procesión de Santa Ana de 2026.',
    },
  )
})

test('mantiene la taxonomía existente y el fallback documental', () => {
  assert.equal(
    presentBandPremiere('Tipo de novedad: estreno absoluto. Obra nueva.').type,
    'Estreno absoluto',
  )
  assert.equal(presentBandPremiere('Dato sin clasificar.').type, 'Novedad musical')
})

test('autoriza únicamente el origen oficial necesario para la multimedia de Presentación', () => {
  const config = source('next.config.mjs')
  assert.match(config, /hostname: 'presentaciondoshermanas\.com'/)
  assert.match(config, /pathname: '\/wp-content\/uploads\/\*\*'/)
})

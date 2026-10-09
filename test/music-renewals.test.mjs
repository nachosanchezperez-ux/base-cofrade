import test from 'node:test'
import assert from 'node:assert/strict'
import {
  buildMusicRenewals,
  isExplicitMusicRenewalForYear,
  musicRenewalLabel,
} from '../lib/music-renewals.js'

function period(overrides = {}) {
  return {
    id: 'period-1',
    bandName: 'Banda de prueba',
    bandType: 'Banda de Música',
    brotherhoodName: 'Hermandad de prueba',
    day: 'Miércoles Santo',
    outingType: 'Miércoles Santo',
    municipality: 'Sevilla',
    province: 'Sevilla',
    yearFrom: 2026,
    yearTo: null,
    isCurrent: true,
    notes: '',
    ...overrides,
  }
}

test('incluye una renovación explícita para 2027', () => {
  assert.equal(isExplicitMusicRenewalForYear(period({
    notes: 'La formación renueva para el Miércoles Santo de 2027.',
  })), true)
})

test('incluye un contrato renovado cuya vigencia alcanza 2027', () => {
  assert.equal(isExplicitMusicRenewalForYear(period({
    yearTo: 2030,
    notes: 'Renovación por cuatro años.',
  })), true)
  assert.equal(musicRenewalLabel(period({ yearTo: 2030, notes: 'Renovación por cuatro años.' })), 'Renovada hasta 2030')
})

test('interpreta una renovación plurianual abierta cuando el texto fija inicio y duración', () => {
  assert.equal(isExplicitMusicRenewalForYear(period({
    yearFrom: 2026,
    notes: 'Acompañamiento vigente y renovado por cuatro años en enero de 2026.',
  })), true)
})

test('excluye una renovación limitada a 2026', () => {
  assert.equal(isExplicitMusicRenewalForYear(period({
    yearTo: 2026,
    notes: 'Contrato renovado para 2026.',
  })), false)
})

test('excluye glorias aunque exista renovación', () => {
  assert.equal(isExplicitMusicRenewalForYear(period({
    day: '',
    outingType: 'Procesión de Gloria',
    notes: 'Renovación para 2027.',
  })), false)
})

test('excluye acuerdos fuera de Sevilla y provincia', () => {
  assert.equal(isExplicitMusicRenewalForYear(period({
    municipality: 'Jerez de la Frontera',
    province: 'Cádiz',
    notes: 'Renovación para 2027.',
  })), false)
})

test('construye la lectura sin convertirla en cambio', () => {
  const result = buildMusicRenewals([
    period({
      id: 'renewal',
      notes: 'Renovación confirmada para 2027.',
      bandHref: '/bandas/prueba',
    }),
    period({
      id: 'not-renewal',
      notes: 'Acompañamiento vigente en 2026.',
    }),
  ])

  assert.equal(result.length, 1)
  assert.equal(result[0].id, 'renewal')
  assert.equal(result[0].newBandName, 'Banda de prueba')
  assert.equal(result[0].renewalLabel, 'Continuidad confirmada para 2027')
  assert.equal(result[0].scope, 'capital')
  assert.equal(result[0].startYear, 2026)
})


test('excluye una continuidad que sigue pendiente de confirmación', () => {
  assert.equal(isExplicitMusicRenewalForYear(period({
    notes: 'La última renovación cubre 2025 y 2026; continuidad desde 2027 pendiente de confirmación.',
  })), false)
})

test('excluye un Rosario aunque la Hermandad tenga jornada penitencial', () => {
  assert.equal(isExplicitMusicRenewalForYear(period({
    day: 'Lunes Santo',
    outingType: 'Rosario de la Aurora',
    notes: 'Acuerdo renovado en diciembre de 2025 por varios años.',
  })), false)
})

test('incluye una renovación expresada como hasta 2028 aunque no cite 2027', () => {
  assert.equal(isExplicitMusicRenewalForYear(period({
    yearTo: null,
    notes: 'La formación fue renovada hasta 2028.',
  })), true)
})


test('reconoce la forma verbal renueva', () => {
  assert.equal(isExplicitMusicRenewalForYear(period({
    notes: 'La formación renueva su acompañamiento para el Miércoles Santo de 2027.',
  })), true)
})

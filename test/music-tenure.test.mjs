import test from 'node:test'
import assert from 'node:assert/strict'
import { documentedMusicStartYear, musicStartLabel } from '../lib/music-tenure.js'

test('usa el inicio histórico documentado', () => {
  assert.equal(documentedMusicStartYear({
    yearFrom: 2009,
    dateFromText: 'Desde 2009',
  }), 2009)
  assert.equal(musicStartLabel({ yearFrom: 2009 }), 'Desde 2009')
})

test('no convierte una instantánea técnica de 2026 en inicio histórico', () => {
  assert.equal(documentedMusicStartYear({
    year_from: 2026,
    notes: 'Instantánea 2026 incorporada en la auditoría de cambios musicales 2027.',
  }), null)

  assert.equal(documentedMusicStartYear({
    year_from: 2026,
    date_from_text: 'Vigente en 2026',
    notes: 'Vigencia cerrada a la edición 2026; no presupone continuidad posterior.',
  }), null)
})

test('respeta un inicio de 2026 cuando está documentado de forma explícita', () => {
  assert.equal(documentedMusicStartYear({
    yearFrom: 2026,
    notes: 'La formación se estrenó tras el paso en 2026 y renovó para 2027.',
  }), 2026)
})

test('recupera el año desde el texto cuando el campo estructurado está vacío', () => {
  assert.equal(documentedMusicStartYear({
    yearFrom: null,
    notes: 'Acompañamiento documentado desde 1998.',
  }), 1998)
})

test('no muestra antigüedad si el inicio figura como no documentado', () => {
  assert.equal(documentedMusicStartYear({
    yearFrom: null,
    dateFromText: 'Vigente en 2026; inicio no documentado',
  }), null)
})

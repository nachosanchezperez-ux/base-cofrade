import assert from 'node:assert/strict'
import test from 'node:test'
import { parseContributionForm } from '../lib/contributions/validation.js'
import { contributionContext } from '../lib/contributions/context.js'

function form(kind, overrides = {}) {
  const data = new FormData()
  const types = { correction: 'correction', agenda: 'new_record', music: 'new_record', media: 'media', suggestion: 'suggestion' }
  for (const [key, value] of Object.entries({ contribution_kind: kind, contribution_type: types[kind], title: 'Información documentada', description: 'Esta información está contrastada con la fuente oficial enlazada.', sources: 'https://example.com/fuente', page_url: 'https://hilocofrade.es/hermandades/ejemplo', privacy_consent: 'on', ...overrides })) data.set(key, value)
  return data
}

test('las cinco modalidades reutilizan los tipos existentes y conservan el contexto en el Panel', () => {
  for (const kind of ['correction', 'media', 'suggestion']) assert.equal(parseContributionForm(form(kind)).contributionType, kind)
  const agenda = parseContributionForm(form('agenda', { related_entity: 'Hermandad de prueba', event_date: '2026-10-03', event_time: '20:30', event_place: 'Parroquia', event_locality: 'Sevilla' }))
  assert.equal(agenda.contributionType, 'new_record')
  assert.match(agenda.description, /Modalidad: Agenda\nHermandad.*\nFecha: 2026-10-03 · 20:30/)
  const music = parseContributionForm(form('music', { related_entity: 'Banda de prueba', music_topic: 'contract', music_year: '2027' }))
  assert.equal(music.contributionType, 'new_record')
  assert.match(music.description, /Modalidad: Música[\s\S]*Contrato o acompañamiento[\s\S]*2027/)
})

test('rechaza modalidades manipuladas y campos repetidos', () => {
  assert.throws(() => parseContributionForm(form('agenda', { contribution_type: 'suggestion' })), /modalidad/i)
  assert.throws(() => parseContributionForm(form('suggestion', { contribution_kind: '__proto__' })), /modalidad/i)
  const repeated = form('suggestion')
  repeated.append('title', 'Otro título')
  assert.throws(() => parseContributionForm(repeated), /repetidos/i)
})

test('agenda exige datos propios, fechas reales y hora válida', () => {
  const fields = { related_entity: 'Hermandad', event_date: '2026-10-03', event_time: '20:30', event_place: 'Parroquia', event_locality: 'Sevilla' }
  for (const name of ['related_entity', 'event_date', 'event_place', 'event_locality']) assert.throws(() => parseContributionForm(form('agenda', { ...fields, [name]: '' })))
  for (const date of ['2026-02-30', '2026-13-01', 'mañana']) assert.throws(() => parseContributionForm(form('agenda', { ...fields, event_date: date })), /fecha/i)
  assert.throws(() => parseContributionForm(form('agenda', { ...fields, event_time: '25:99' })), /hora/i)
})

test('música exige asunto conocido, fuentes y límites de año y texto completo', () => {
  const fields = { related_entity: 'Banda', music_topic: 'march', music_year: '2027' }
  for (const year of ['1799', '2101', '2027.5']) assert.throws(() => parseContributionForm(form('music', { ...fields, music_year: year })), /año/i)
  assert.throws(() => parseContributionForm(form('music', { ...fields, music_topic: 'invented' })), /asunto/i)
  assert.throws(() => parseContributionForm(form('music', { ...fields, sources: '' })), /fuente/i)
  assert.throws(() => parseContributionForm(form('music', { ...fields, description: 'a'.repeat(6000) })), /6.000/i)
})

test('contexto solo precarga modalidades conocidas y URLs propias sin autoridad adicional', () => {
  assert.deepEqual(contributionContext({ kind: 'music', page: '/bandas/ejemplo?secret=ignored#foto' }), { kind: 'music', pageUrl: 'https://hilocofrade.es/bandas/ejemplo' })
  for (const page of ['https://evil.example/ficha', '//evil.example/ficha', 'javascript:alert(1)', 'https://user:pass@hilocofrade.es/ficha', 'https://hilocofrade.es:444/ficha']) assert.equal(contributionContext({ page }).pageUrl, '')
  assert.deepEqual(contributionContext({ kind: ['music', 'agenda'], page: ['x'] }), { kind: 'correction', pageUrl: '' })
})

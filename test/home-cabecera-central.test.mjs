import test from 'node:test'
import assert from 'node:assert/strict'
import { buildHomeArchiveFigures } from '../lib/home-archive.js'
import { buildSeasonTimeline, SEASON_MILESTONES } from '../lib/home-season.js'
import { buildHomeDiscover } from '../lib/home-discover.js'

const stats = {
  directories: [{ key: 'brotherhood', count: 304 }, { key: 'image', count: 1 }, { key: 'step', count: null }, { key: 'band', count: 0 }],
  graph: [{ key: 'march', count: 2100 }, { key: 'agent', count: 900 }],
}

test('«El archivo en cifras»: solo cifras con dato, en singular o plural', () => {
  const figures = buildHomeArchiveFigures(stats)
  assert.deepEqual(figures.map((item) => item.key), ['brotherhood', 'image', 'march', 'agent'])
  assert.equal(figures.find((item) => item.key === 'image').label, 'imagen')
  assert.equal(figures.find((item) => item.key === 'march').figure, new Intl.NumberFormat('es-ES').format(2100))
  assert.deepEqual(buildHomeArchiveFigures(null), [])
})

test('hitos litúrgicos de 2027 (Pascua el 28 de marzo)', () => {
  assert.deepEqual(SEASON_MILESTONES.map((item) => item.date), ['2027-02-10', '2027-03-19', '2027-03-21', '2027-03-28'])
})

test('la línea de hitos avanza con el tiempo', () => {
  const before = buildSeasonTimeline('2026-11-28')
  assert.equal(before[0].state, 'next')
  assert.equal(before[0].progress, 0)
  assert.deepEqual(before.slice(1).map((item) => item.state), ['later', 'later', 'later'])

  const lent = buildSeasonTimeline('2027-03-01')
  assert.equal(lent[0].state, 'done')
  assert.equal(lent[0].progress, 1)
  assert.equal(lent[1].state, 'next')
  assert.ok(lent[1].progress > 0.4 && lent[1].progress < 0.6)

  assert.ok(buildSeasonTimeline('2027-03-28').every((item) => item.state === 'done'))
  assert.deepEqual(buildSeasonTimeline(''), [])
})

test('«Descubre» ya no repite las cifras: explica qué hay en cada sección', () => {
  const items = buildHomeDiscover({ directories: [{ key: 'brotherhood', count: 304 }] })
  assert.equal(items.find((item) => item.key === 'brotherhood').hint, 'Historia, titulares y cultos')
  assert.ok(items.every((item) => item.hint))
})

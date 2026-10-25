import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { groupReleasesForDisplay } from '../lib/bands/discography.js'

const releases = (years) => years.map((year, id) => ({ id, year }))

test('la discografía larga deja visibles los últimos trabajos y pliega el resto por décadas', () => {
  const { recent, groups } = groupReleasesForDisplay(releases([2026, 2025, 2025, 2025, 2025, 2024, 2024, 2012, 2002, 1999, 1995, 1993, 1992, 1990, 1989, 1986]))
  assert.deepEqual(recent.map((item) => item.year), [2026, 2025, 2025])
  assert.deepEqual(groups.map((group) => [group.label, group.releases.length]), [
    ['2024–2025', 4],
    ['2002–2012', 2],
    ['1990–1999', 5],
    ['1986–1989', 2],
  ])
})

test('no hay grupos de un solo trabajo y las listas cortas no se pliegan', () => {
  const { groups } = groupReleasesForDisplay(releases([2025, 2024, 2023, 2022, 2015, 2014, 1998]))
  assert.ok(groups.every((group) => group.releases.length > 1))
  assert.equal(groupReleasesForDisplay(releases([2025, 2020, 2010])).groups.length, 0)
})

test('ningún trabajo se pierde al plegar', () => {
  const input = releases([2026, 2025, 2019, 2011, 2003, 1997, 1996, 1985, null])
  const { recent, groups } = groupReleasesForDisplay(input)
  assert.equal(recent.length + groups.reduce((sum, group) => sum + group.releases.length, 0), input.length)
})

test('el componente pinta los grupos plegables con contador en singular o plural', () => {
  const source = readFileSync(new URL('../components/bands/BandDiscographySection.js', import.meta.url), 'utf8')
  assert.match(source, /groupReleasesForDisplay\(releases\)/)
  assert.match(source, /group\.releases\.length === 1 \? 'trabajo' : 'trabajos'/)
})

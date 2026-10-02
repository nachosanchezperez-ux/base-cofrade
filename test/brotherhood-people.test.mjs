import test from 'node:test'
import assert from 'node:assert/strict'
import { groupBrotherhoodDressers, relationPeriod } from '../lib/brotherhood-people.js'

test('one dresser of two Titulars counts as one person, retaining both links and periods', () => {
  const rows = [
    { id:'r1',agentId:'a1',name:'José Antonio Grande de León',imageId:'i1',imageSlug:'caridad',period:'Vigente en 2026' },
    { id:'r2',agentId:'a1',name:'José Antonio Grande de León',imageId:'i2',imageSlug:'piedad',period:'Desde 2024' },
  ]
  const grouped = groupBrotherhoodDressers(rows)
  assert.equal(grouped.length,1)
  assert.deepEqual(grouped[0].images, rows)
  assert.equal(rows.length,2)
})
test('homonyms with distinct IDs remain separate and duplicate links do not inflate the display', () => {
  const row={id:'r1',agentId:'a1',name:'José',imageId:'i1',period:'2026'}
  const groups=groupBrotherhoodDressers([row,{...row,id:'r2'},{...row,id:'r3',agentId:'a2'}])
  assert.equal(groups.length,2)
  assert.equal(groups[0].images.length,1)
})
test('verified current-year wording is preserved without inventing a start date', () => {
  assert.equal(relationPeriod({date_from_text:'Vigente en 2026'}),'Vigente en 2026')
  assert.equal(relationPeriod({date_from_text:'Desde 2024'}),'Desde 2024')
  assert.equal(relationPeriod({date_from:'2024-03-01'}),'Desde 2024')
  assert.equal(relationPeriod({date_from:'2020-01-01',date_to:'2024-01-01'}),'2020–2024')
})

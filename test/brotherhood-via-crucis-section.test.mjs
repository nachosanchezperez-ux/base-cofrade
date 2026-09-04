import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const pageLoader = fs.readFileSync(new URL('../lib/supabase/brotherhood-page.js', import.meta.url), 'utf8')
const overview = fs.readFileSync(new URL('../components/BrotherhoodOverviewV2.js', import.meta.url), 'utf8')
const section = fs.readFileSync(new URL('../components/BrotherhoodViaCrucisSection.js', import.meta.url), 'utf8')

test('el Vía Crucis institucional se separa de las participaciones genéricas sin duplicar datos', () => {
  assert.match(pageLoader, /function isCouncilViaCrucis/)
  assert.match(pageLoader, /viaCrucisCofradias/)
  assert.match(pageLoader, /participacionesConsejo: participations\.filter\(\(item\) => !isCouncilViaCrucis\(item\)\)/)
  assert.match(pageLoader, /from\('entity_media'\)/)
  assert.match(pageLoader, /resolveHiloMediaReference/)
})

test('la ficha dispone de un módulo fijo y reutilizable para el Vía Crucis de las Cofradías', () => {
  assert.match(overview, /BrotherhoodViaCrucisSection/)
  assert.match(overview, /brotherhood\.viaCrucisCofradias/)
  assert.match(section, /id="via-crucis-cofradias"/)
  assert.match(section, /Vía Crucis de las Cofradías/)
  assert.match(section, /Participación institucional/)
})

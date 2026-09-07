import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

const pageLoader = fs.readFileSync(new URL('../lib/supabase/brotherhood-page.js', import.meta.url), 'utf8')
const page = fs.readFileSync(new URL('../app/hermandades/[slug]/page.js', import.meta.url), 'utf8')
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
  assert.doesNotMatch(overview, /BrotherhoodViaCrucisSection/)
  assert.match(page, /BrotherhoodViaCrucisSection/)
  assert.match(page, /h\.viaCrucisCofradias\?\.length > 0 && \{ href: '#via-crucis-cofradias', label: 'Vía Crucis' \}/)
  assert.match(section, /id="via-crucis-cofradias"/)
  assert.match(section, /Vía Crucis de las Cofradías/)
  assert.match(section, /Participación institucional/)
})

test('el Vía Crucis se renderiza después de Historia y antes de la Túnica y las Salidas', () => {
  const historyIndex = page.indexOf('id="historia"')
  const viaCrucisIndex = page.indexOf('<BrotherhoodViaCrucisSection items={h.viaCrucisCofradias} />')
  const habitIndex = page.indexOf('id="tunica"')
  const outingsIndex = page.indexOf('<BrotherhoodOutingsSection outings={h.salidas} />')

  assert.ok(historyIndex >= 0)
  assert.ok(viaCrucisIndex > historyIndex)
  assert.ok(habitIndex > viaCrucisIndex)
  assert.ok(outingsIndex > viaCrucisIndex)
})

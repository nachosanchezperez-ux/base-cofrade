import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la Agenda expone Hermandad, localidad y calendario desde cada tarjeta', () => {
  const source = read('components/AgendaCofradeDirectoryV4.js')
  const data = read('lib/supabase/agenda-cofrade.js')

  assert.match(data, /municipalityHref: agendaMunicipalityHref/)
  assert.match(source, /Ver Hermandad/)
  assert.match(source, /item\.municipalityHref/)
  assert.match(source, /Ver \{item\.municipality\}/)
  assert.match(source, /Ver calendario/)
})

test('la ficha de Hermandad agrega próximas citas sin hacer depender la ficha de la Agenda', () => {
  const source = read('app/hermandades/[slug]/page.js')
  const helper = read('lib/brotherhood-agenda.js')

  assert.match(source, /getAgendaCofrade\(\)\.catch/)
  assert.match(source, /brotherhoodUpcomingAgenda/)
  assert.match(source, /BrotherhoodAgendaSection items=\{upcomingAgendaItems\}/)
  assert.match(source, /href: '#agenda', label: 'Agenda'/)
  assert.match(helper, /item\.organizerHref === target \|\| item\.relatedBrotherhoodHref === target/)
  assert.match(helper, /crewEvents/)
  assert.match(helper, /\/igualas-y-ensayos/)
})

test('las fichas de actos reutilizan sus relaciones ya cargadas', () => {
  const glory = read('app/procesiones-de-gloria/[slug]/page.js')
  const extraordinary = read('app/extraordinarias/[slug]/page.js')
  const rosary = read('app/agenda-cofrade/rosarios/[slug]/page.js')
  const crew = read('app/igualas-y-ensayos/[slug]/page.js')

  assert.match(glory, /AgendaRelationLinks/)
  assert.match(glory, /bands=\{item\.music\}/)
  assert.match(extraordinary, /AgendaRelationLinks/)
  assert.match(extraordinary, /bands=\{item\.music\}/)
  assert.match(rosary, /AgendaRelationLinks/)
  assert.match(rosary, /bands=\{item\.music\}/)
  assert.match(crew, /AgendaRelationLinks/)
  assert.match(crew, /steps=\{event\.steps\}/)
})

test('el hilo de un acto enlaza a más citas de su Hermandad y a su localidad', () => {
  const source = read('components/AgendaRelationLinks.js')
  const relations = read('lib/agenda-relations.js')

  assert.match(source, /Más citas/)
  assert.match(source, /Agenda de la Hermandad/)
  assert.match(source, /Localidad/)
  assert.match(source, /Calendario/)
  assert.match(relations, /\/agenda-cofrade\/localidad\//)
  assert.match(relations, /#agenda/)
})

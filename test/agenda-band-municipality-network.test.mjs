import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('las Bandas conservan todas sus próximas salidas antes de separar extraordinarias', () => {
  const source = read('lib/supabase/bands.js')
  const page = read('app/bandas/[slug]/page.js')
  assert.match(source, /const upcomingOutings = \[\.\.\.\(band\.outings \|\| \[\]\)\]/)
  assert.match(source, /return \{ \.\.\.routed, upcomingOutings \}/)
  assert.match(page, /buildBandUpcomingAgenda/)
  assert.match(page, /title="Próximas actuaciones"/)
  assert.match(page, /getConcertEventDirectory\(\)\.catch/)
})

test('la localidad tiene una URL canónica de Agenda y conecta Hermandades y Bandas', () => {
  const relations = read('lib/agenda-relations.js')
  const route = read('app/agenda-cofrade/localidad/[localidad]/page.js')
  const hub = read('components/MunicipalityAgendaHub.js')
  assert.match(relations, /\/agenda-cofrade\/localidad\//)
  assert.match(route, /buildMunicipalityAgendaHub/)
  assert.match(route, /getAgendaCofrade/)
  assert.match(route, /getCrewEventDirectory/)
  assert.match(route, /getIndexableBrotherhoodDirectory/)
  assert.match(route, /getPublicBandsDirectory/)
  assert.match(route, /getImagesDirectory/)
  assert.match(route, /getStepsDirectory/)
  assert.match(hub, /Agenda cofrade de/)
  assert.match(hub, /Hermandades/)
  assert.match(hub, /Bandas/)
  assert.match(hub, /Qué ver hoy/)
  assert.match(hub, /Este fin de semana/)
  assert.match(hub, /Patrimonio cofrade/)
  assert.match(hub, /Imágenes y Pasos/)
})

test('los directorios territoriales enlazan de vuelta a la Agenda local', () => {
  const brotherhoods = read('app/hermandades/localidad/[localidad]/page.js')
  const bands = read('app/bandas/localidad/[localidad]/page.js')
  const images = read('app/imagenes/localidad/[localidad]/page.js')
  const steps = read('app/pasos/localidad/[localidad]/page.js')
  assert.match(brotherhoods, /relatedAgendaHref=/)
  assert.match(bands, /relatedAgendaHref=/)
  assert.match(images, /relatedAgendaHref=/)
  assert.match(steps, /relatedAgendaHref=/)
})

test('la guía municipal conserva slugs territoriales correctos para patrimonio y bandas', () => {
  const source = read('lib/municipality-agenda.js')
  assert.match(source, /routeSlug === 'sevilla-capital' \? 'sevilla' : routeSlug/)
  assert.match(source, /bandDirectorySlug/)
  assert.match(source, /imageDirectorySlug/)
  assert.match(source, /stepDirectorySlug/)
})

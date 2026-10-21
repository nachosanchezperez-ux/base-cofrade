import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('las salidas generales cargan Romerías y Procesiones ordinarias publicadas', () => {
  const source = read('lib/supabase/general-public-outings.js')

  assert.match(source, /\.in\('outing_type', \['Romería', 'Procesión', 'Traslado'\]\)/)
  // Una Procesión extraordinaria ya llega por el directorio de extraordinarias:
  // la lectura general solo admite salidas ordinarias para no duplicarlas.
  assert.match(source, /\.in\('outing_type', \['Romería', 'Procesión', 'Traslado'\]\)[\s\S]{0,300}\.eq\('character', 'ordinary'\)/)
  assert.match(source, /brotherhood\?\.municipality_id/)
  assert.match(source, /kind === 'romery' \? 'Romería' : kind === 'transfer' \? 'Traslado' : 'Procesión'/)
  assert.match(source, /returnDate: item\.return_date/)
})

test('Agenda clasifica Romerías separadas de Procesiones', () => {
  const agenda = read('lib/supabase/agenda-cofrade.js')
  const directory = read('components/AgendaCofradeDirectoryV4.js')
  const fromUrl = read('lib/agenda-cofrade-url-state.js')

  assert.match(agenda, /romery: \{ category: 'romeries'/)
  assert.match(agenda, /procession: \{ category: 'processions', label: 'Procesión', name: 'Procesiones'/)
  assert.match(directory, /\['romeries', 'Romerías'\]/)
  assert.match(fromUrl, /'romeries'/)
})

test('la Home incorpora las salidas generales al carril de próximas procesiones', () => {
  const source = read('lib/supabase/home-upcoming-agenda.js')

  assert.match(source, /getGeneralPublicOutings/)
  assert.match(source, /agendaType: isRomery \? 'romery' : isTransfer \? 'transfer' : 'procession'/)
  assert.match(source, /typeLabel: isRomery \? 'Romería' : isTransfer \? 'Traslado' : 'Procesión'/)
})

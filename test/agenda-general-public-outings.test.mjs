import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('las salidas generales cargan Romerías y Procesiones ordinarias publicadas', () => {
  const source = read('lib/supabase/general-public-outings.js')

  assert.match(source, /\.in\('outing_type', \['Romería', 'Procesión'\]\)/)
  assert.match(source, /brotherhood\?\.municipality_id/)
  assert.match(source, /kind === 'romery' \? 'Romería' : 'Procesión'/)
  assert.match(source, /returnDate: item\.return_date/)
})

test('Agenda clasifica Romerías separadas de Procesiones', () => {
  const agenda = read('lib/supabase/agenda-cofrade.js')
  const directory = read('components/AgendaCofradeDirectoryV4.js')
  const fromUrl = read('components/AgendaCofradeDirectoryFromUrl.js')

  assert.match(agenda, /const category = isRomery \? 'romeries' : 'processions'/)
  assert.match(agenda, /categoryName: isRomery \? 'Romerías' : 'Procesiones'/)
  assert.match(directory, /\['romeries', 'Romerías'\]/)
  assert.match(fromUrl, /'romeries'/)
})

test('la Home incorpora las salidas generales al carril de próximas procesiones', () => {
  const source = read('lib/supabase/home-upcoming-agenda.js')

  assert.match(source, /getGeneralPublicOutings/)
  assert.match(source, /agendaType: isRomery \? 'romery' : 'procession'/)
  assert.match(source, /typeLabel: isRomery \? 'Romería' : 'Procesión'/)
})

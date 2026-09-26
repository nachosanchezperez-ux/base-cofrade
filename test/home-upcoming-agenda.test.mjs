import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('la agenda de Home reúne extraordinarias, Glorias, procesiones generales y romerías por fecha', async () => {
  const loader = await read('lib/supabase/home-upcoming-agenda.js')

  assert.match(loader, /getNavigableHomeExtraordinaryOutings/)
  assert.match(loader, /getGloryDirectory/)
  assert.match(loader, /getGeneralPublicOutings/)
  assert.match(loader, /!item\.isCancelled && !item\.isPast/)
  assert.match(loader, /item\.liveState\.state !== 'done'/)
  assert.match(loader, /withProcessionLiveState/)
  assert.match(loader, /compareProcessionLiveItems/)
  assert.match(loader, /typeLabel: 'Extraordinaria'/)
  assert.match(loader, /typeLabel: 'Gloria'/)
  assert.match(loader, /typeLabel: isRomery \? 'Romería' : 'Procesión'/)
})

test('la Home conserva una salida nocturna hasta su entrada real', async () => {
  const homeLoader = await read('lib/supabase/home.js')
  const agendaLoader = await read('lib/supabase/home-upcoming-agenda.js')

  assert.match(homeLoader, /extraordinary_outings_directory/)
  assert.match(homeLoader, /previousDateKey\(today\)/)
  assert.match(homeLoader, /returnDate: item\.return_date/)
  assert.match(agendaLoader, /item\.liveState\.state !== 'done'/)
})

test('la Home solo usa gran protagonista cuando una salida está en curso', async () => {
  const home = await read('components/HomePageV2.js')
  const grid = await read('components/HomeProcessionGrid.js')
  const snapshot = await read('lib/supabase/home-snapshot.js')

  assert.match(home, /id="proximos-dias"/)
  assert.match(home, /En los próximos días/)
  assert.match(home, /const featuredOuting = liveOutings\[0\] \|\| null/)
  assert.match(home, /HomeProcessionGrid outings=\{balancedUpcoming\}/)
  assert.match(home, /Procesión en curso/)
  assert.match(home, /Varias procesiones están en la calle/)
  assert.match(home, /multipleLive/)
  assert.match(grid, /data-home-procession-layout="equal"/)
  assert.match(grid, /slice\(0, 4\)/)
  assert.match(grid, /Guía de \{outing\.municipality\}/)
  assert.match(snapshot, /find\(\(item\) => item\.liveState\?\.state === 'live'\)/)
  assert.match(snapshot, /hilo-cofrade-home-public-snapshot-v18/)
})

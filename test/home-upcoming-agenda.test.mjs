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

test('la Home permite un foco editorial previo sin quitar prioridad al directo', async () => {
  const home = await read('components/HomePageV2.js')
  const snapshot = await read('lib/supabase/home-snapshot.js')

  assert.match(home, /id="extraordinarias"/)
  assert.match(home, /selectHomeFeaturedOuting\(\{ upcomingAgenda, editorialFeaturedOutingId, editorialHighlights \}\)/)
  assert.match(home, /Destacados/)
  assert.match(home, /Procesión en curso/)
  assert.match(snapshot, /getHomeEditorialFocus/)
  assert.match(snapshot, /remainingCandidates.find/)
  assert.match(snapshot, /editorialFeaturedOutingId/)
  assert.match(snapshot, /hilo-cofrade-home-public-snapshot-v26-igualas/)
})

test('la agenda de portada no usa carriles horizontales: filas a todo el ancho', async () => {
  const styles = await read('components/HomeAgendaNow.module.css')

  assert.doesNotMatch(styles, /overflow-x|scroll-snap/)
  assert.match(styles, /grid-template-columns: 58px minmax\(0, 1fr\)/)
  assert.match(styles, /@media \(min-width: 768px\)[\s\S]*grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/)
})

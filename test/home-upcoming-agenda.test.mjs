import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('la agenda de Home reúne extraordinarias, Glorias, procesiones generales y romerías por fecha', async () => {
  const loader = await read('lib/supabase/home-upcoming-agenda.js') + await read('lib/home-upcoming-selection.js')

  assert.match(loader, /getNavigableHomeExtraordinaryOutings/)
  assert.match(loader, /getGloryDirectory/)
  assert.match(loader, /getGeneralPublicOutings/)
  assert.match(loader, /!item\.isCancelled && item\.eventStatus !== 'held'/)
  assert.match(loader, /item\.liveState\.state !== 'done'/)
  assert.match(loader, /withProcessionLiveState/)
  assert.match(loader, /compareProcessionLiveItems/)
  assert.match(loader, /typeLabel: 'Extraordinaria'/)
  assert.match(loader, /typeLabel: 'Gloria'/)
  assert.match(loader, /typeLabel: isRomery \? 'Romería' : 'Procesión'/)
})

test('la Home conserva una salida nocturna hasta su entrada real', async () => {
  const homeLoader = await read('lib/supabase/home.js')
  const agendaLoader = await read('lib/supabase/home-upcoming-agenda.js') + await read('lib/home-upcoming-selection.js')

  assert.match(homeLoader, /extraordinary_outings_directory/)
  assert.match(homeLoader, /previousDateKey\(today\)/)
  assert.match(homeLoader, /returnDate: item\.return_date/)
  assert.match(agendaLoader, /item\.liveState\.state !== 'done'/)
})

test('la Home permite un foco editorial previo sin quitar prioridad al directo', async () => {
  const home = await read('components/HomePageV2.js')
  const grid = await read('components/HomeProcessionGrid.js')
  const snapshot = await read('lib/supabase/home-snapshot.js')

  assert.match(home, /id="proximos-dias"/)
  assert.match(home, /const editorialFeaturedOuting = editorialFeaturedOutingId/)
  assert.match(home, /const featuredOuting = liveOutings\[0\] \|\| editorialFeaturedOuting/)
  assert.match(home, /isEditorialFeature/)
  assert.match(home, /Extraordinaria destacada/)
  assert.match(home, /Este fin de semana/)
  assert.match(home, /HomeProcessionGrid outings=\{balancedUpcoming\}/)
  assert.match(home, /Procesión en curso/)
  assert.match(home, /Varias procesiones están en la calle/)
  assert.match(grid, /data-home-procession-layout="editorial"/)
  assert.match(grid, /slice\(0, 4\)/)
  assert.match(snapshot, /getHomeEditorialFocus/)
  assert.match(snapshot, /liveFeaturedOuting/)
  assert.match(snapshot, /editorialFeaturedOutingId/)
  assert.match(snapshot, /hilo-cofrade-home-public-data-v22/)
})


test('las próximas salidas equilibran el peso visual en escritorio', async () => {
  const home = await read('components/HomePageV2.js')
  const styles = await read('components/HomeProcessionGrid.module.css')

  assert.doesNotMatch(home, /Procesiones, romerías, traslados y salidas extraordinarias se muestran con el mismo peso visual/)
  assert.doesNotMatch(home, /La cercanía de una cita no la convierte por sí sola en protagonista/)
  assert.match(styles, /@media\(min-width:900px\)/)
  assert.match(styles, /grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/)
  assert.match(styles, /grid-auto-rows:auto/)
  assert.match(styles, /\.leadCard/)
  assert.match(styles, /\.compactCard/)
  assert.match(styles, /min-height:198px/)
  assert.match(styles, /linear-gradient\(90deg,#123a67,#b71f37\)/)
  assert.doesNotMatch(styles, /linear-gradient\(145deg,#0b223b 0%,#123d68 58%,#0d3156 100%\)/)
})

test('en móvil las próximas salidas conservan el carril horizontal', async () => {
  const styles = await read('components/HomeProcessionGrid.module.css')

  assert.match(styles, /@media\(max-width:720px\)/)
  assert.match(styles, /scroll-snap-type:x mandatory/)
  assert.match(styles, /flex:0 0 min\(82vw,320px\)/)
})


test('las horas ganan jerarquía sin inflar las tarjetas en escritorio', async () => {
  const styles = await read('components/HomeProcessionGrid.module.css')

  assert.match(styles, /\.card \.timing span,[\s\S]*min-height:36px/)
  assert.match(styles, /\.card \.timing strong,[\s\S]*font-size:15px/)
  assert.match(styles, /\.card \.actions,[\s\S]*margin-top:0/)
  assert.match(styles, /padding-top:13px/)
})

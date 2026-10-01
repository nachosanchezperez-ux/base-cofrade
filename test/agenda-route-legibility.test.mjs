import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la Agenda conserva y entrega el recorrido al componente interactivo', () => {
  const source = read('lib/supabase/agenda-cofrade.js')
  const page = read('app/agenda-cofrade/page.js')
  const directory = read('components/AgendaCofradeDirectoryV4.js')

  assert.match(source, /routeText: item\.routeSummary \|\| ''/)
  assert.match(page, /routeText: item\.routeText/)
  assert.match(directory, /function EventRoute/)
  assert.match(directory, /routeSummarySections/)
  assert.match(directory, /Ver recorrido/)
  assert.match(directory, /pointCount/)
  assert.match(directory, /\['processions', 'transfers', 'rosaries', 'romeries'\]/)
})

test('el recorrido compacto de Agenda se presenta por tramos y puntos', () => {
  const directory = read('components/AgendaCofradeDirectoryV4.js')
  const styles = read('components/AgendaCofradeDirectoryV4Routes.module.css')

  assert.match(directory, /routeSections/)
  assert.match(directory, /routeSection/)
  assert.match(directory, /routePoints/)
  assert.match(styles, /\.routeSection\{[\s\S]*grid-template-columns:88px/)
  assert.match(styles, /\.routePoints li\{[\s\S]*font-size:12px/)
  assert.match(styles, /@media\(max-width:560px\)[\s\S]*\.routeSection\{[\s\S]*grid-template-columns:1fr/)
  assert.match(styles, /@media\(max-width:560px\)[\s\S]*\.routePoints li\{[\s\S]*font-size:11\.5px/)
})

test('la ficha completa adapta recorridos largos y muestra hitos', () => {
  const component = read('components/ProcessionRoute.js')
  const styles = read('components/ProcessionRoute.module.css')

  assert.match(component, /const isLong = totalPoints >= 20/)
  assert.match(component, /desktopTabbed/)
  assert.match(component, /JourneyPhases/)
  assert.match(component, /point\.annotations\?\.length/)
  assert.match(styles, /\.legCard\[data-dense="true"\]/)
  assert.match(styles, /\.desktopTabbedRoutes/)
  assert.match(styles, /\.phaseGrid/)
  assert.match(styles, /\.annotation\[data-type="schedule"\]/)
})

test('los rosarios usan el mismo itinerario visual que las procesiones', () => {
  const page = read('app/agenda-cofrade/rosarios/[slug]/page.js')

  assert.match(page, /import ProcessionRoute/)
  assert.match(page, /import \{ buildProcessionRoute \}/)
  assert.match(page, /const processionRoute = buildProcessionRoute/)
  assert.match(page, /<ProcessionRoute route=\{processionRoute\} \/>/)
  assert.doesNotMatch(page, /<p className=\{styles\.route\}>/)
})

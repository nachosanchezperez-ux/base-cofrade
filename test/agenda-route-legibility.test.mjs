import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la Agenda conserva el recorrido como dato propio y no como resumen genérico', () => {
  const source = read('lib/supabase/agenda-cofrade.js')
  const directory = read('components/AgendaCofradeDirectoryV4.js')

  assert.match(source, /routeText: item\.routeSummary \|\| ''/)
  assert.match(directory, /function EventRoute/)
  assert.match(directory, /Ver recorrido/)
  assert.match(directory, /\['processions', 'transfers', 'rosaries', 'romeries'\]/)
  assert.match(directory, /AgendaCofradeDirectoryV4Routes\.module\.css/)
})

test('el recorrido de Agenda mantiene una escala legible en escritorio y móvil', () => {
  const styles = read('components/AgendaCofradeDirectoryV4Routes.module.css')

  assert.match(styles, /\.routeBody p\{[\s\S]*font-size:15px/)
  assert.match(styles, /@media\(max-width:560px\)[\s\S]*\.routeBody p\{[\s\S]*font-size:13\.5px/)
  assert.match(styles, /\.route summary\{[\s\S]*min-height:52px/)
  assert.match(styles, /@media\(max-width:560px\)[\s\S]*\.route summary\{[\s\S]*min-height:46px/)
})

test('las fichas de procesión y rosario amplían también la lectura del itinerario', () => {
  const procession = read('components/ProcessionRoute.module.css')
  const rosary = read('app/agenda-cofrade/rosarios/[slug]/rosary-detail.module.css')

  assert.match(procession, /\.pointCopy strong\{[^}]*font-size:17px/)
  assert.match(procession, /@media\(max-width:620px\)[\s\S]*\.pointCopy strong\{font-size:18\.5px/)
  assert.match(rosary, /\.route\{[^}]*font-size:16px/)
  assert.match(rosary, /@media\(max-width:520px\)[\s\S]*\.route\{[^}]*font-size:15px/)
})

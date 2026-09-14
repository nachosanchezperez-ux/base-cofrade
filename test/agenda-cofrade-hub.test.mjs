import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('Agenda Cofrade agrega las cuatro fuentes públicas en paralelo', () => {
  const source = read('lib/supabase/agenda-cofrade.js')
  assert.match(source, /Promise\.all/)
  assert.match(source, /getExtraordinaryDirectory/)
  assert.match(source, /getGloryDirectory/)
  assert.match(source, /getRosaryOutings/)
  assert.match(source, /getCrewEventDirectory/)
})

test('un rosario extraordinario aparece una sola vez y conserva su carácter', () => {
  const source = read('lib/supabase/agenda-cofrade.js')
  assert.match(source, /const rosaryIds = new Set/)
  assert.match(source, /extraordinary\.filter\(\(item\) => !rosaryIds\.has\(item\.id\)\)/)
  assert.match(source, /isExtraordinary: item\.isExtraordinary/)
})

test('el centro responde a hoy, fin de semana, próximos y archivo', () => {
  const directory = read('components/AgendaCofradeDirectory.js')
  const page = read('app/agenda-cofrade/page.js')
  assert.match(directory, /Qué ver hoy/)
  assert.match(directory, /Este fin de semana/)
  assert.match(directory, /Próximos actos/)
  assert.match(directory, /Archivo/)
  assert.match(directory, /Sevilla capital/)
  assert.match(directory, /Municipios/)
  assert.match(page, /Agenda cofrade de Sevilla y provincia/)
  assert.match(page, /collectionPageJsonLd/)
})

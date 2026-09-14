import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('Agenda Cofrade agrega las cuatro familias de interés general en paralelo', () => {
  const source = read('lib/supabase/agenda-cofrade.js')
  assert.match(source, /Promise\.all/)
  assert.match(source, /getExtraordinaryDirectory/)
  assert.match(source, /getGloryDirectory/)
  assert.match(source, /getRosaryOutings/)
  assert.match(source, /getKissingDevotions/)
  assert.doesNotMatch(source, /getCrewEventDirectory/)
})

test('un rosario extraordinario aparece una sola vez y conserva su carácter', () => {
  const source = read('lib/supabase/agenda-cofrade.js')
  assert.match(source, /const rosaryIds = new Set/)
  assert.match(source, /extraordinary\.filter\(\(item\) => !rosaryIds\.has\(item\.id\)\)/)
  assert.match(source, /isExtraordinary: item\.isExtraordinary/)
})

test('el centro prioriza los actos de interés general y deja el archivo en segundo plano', () => {
  const directory = read('components/AgendaCofradeDirectory.js')
  const page = read('app/agenda-cofrade/page.js')
  assert.match(directory, /Qué ver hoy/)
  assert.match(directory, /Este fin de semana/)
  assert.match(directory, /Próximos actos/)
  assert.match(directory, /Consultar archivo/)
  assert.match(directory, /Procesiones/)
  assert.match(directory, /Traslados/)
  assert.match(directory, /Besamanos y besapiés/)
  assert.doesNotMatch(directory, /Anunciado/)
  assert.match(directory, /Sevilla capital/)
  assert.match(directory, /Municipios/)
  assert.match(directory, /Ver Hermandad/)
  assert.match(directory, /Ver calendario/)
  assert.match(page, /Agenda cofrade de Sevilla y provincia/)
  assert.match(page, /collectionPageJsonLd/)
  assert.doesNotMatch(page, /Próxima cita/)
})

test('igualás y ensayos conservan un calendario especializado relacionado', () => {
  const page = read('app/agenda-cofrade/page.js')
  assert.match(page, /getCrewEventDirectory/)
  assert.match(page, /Calendario especializado/)
  assert.match(page, /\/igualas-y-ensayos/)
})

test('besamanos y besapiés parten de cultos y ediciones publicadas', () => {
  const source = read('lib/supabase/kissing-devotions.js')
  assert.match(source, /\.from\('cults'\)/)
  assert.match(source, /cult_type\.ilike\.%besaman%/)
  assert.match(source, /cult_type\.ilike\.%besapi%/)
  assert.match(source, /\.from\('cult_occurrences'\)/)
  assert.match(source, /\.eq\('status', 'published'\)/)
  assert.match(source, /#cultos/)
})

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

test('la Agenda pública muestra solo actos próximos y elimina el acceso histórico', () => {
  const directory = read('components/AgendaCofradeDirectoryV4.js')
  const fromUrl = read('components/AgendaCofradeDirectoryFromUrl.js')
  const page = read('app/agenda-cofrade/page.js')
  const seoCalendar = read('lib/seo-calendar.js')

  assert.match(directory, /Hoy/)
  assert.match(directory, /Mañana/)
  assert.match(directory, /period === 'tomorrow'/)
  assert.match(directory, /Este fin de semana/)
  assert.match(directory, /Próximos actos/)
  assert.match(directory, /upcomingItems/)
  assert.doesNotMatch(directory, /Archivo \(/)
  assert.doesNotMatch(directory, /period === 'archive'/)
  assert.match(directory, /Procesiones/)
  assert.match(directory, /Traslados/)
  assert.match(directory, /Besamanos y besapiés/)
  assert.match(directory, /Sevilla capital/)
  assert.match(directory, /Municipios/)
  assert.match(directory, /Ver Hermandad/)
  assert.match(directory, /Ver calendario/)

  assert.doesNotMatch(fromUrl, /'archive'/)
  assert.match(fromUrl, /'tomorrow'/)
  assert.match(page, /items=\{upcoming\}/)
  assert.match(page, /Solo los próximos actos/)
  assert.match(page, /agendaSeoCopy/)
  assert.match(seoCalendar, /Agenda cofrade de Sevilla y provincia/)
  assert.match(page, /collectionPageJsonLd/)
  assert.doesNotMatch(page, /Próxima cita/)
})

test('Agenda conserva una procesión nocturna aunque su fecha de salida sea ayer', () => {
  const source = read('lib/supabase/agenda-cofrade.js')
  assert.match(source, /withProcessionLiveState/)
  assert.match(source, /liveItem\.liveState\.isLive/)
  assert.match(source, /isUpcoming: true/)
  assert.match(source, /isPast: false/)
})

test('Agenda Cofrade destaca todas las procesiones que están en curso', () => {
  const directory = read('components/AgendaCofradeDirectoryV4.js')
  const page = read('app/agenda-cofrade/page.js')

  assert.match(directory, /getProcessionLiveState/)
  assert.match(directory, /Ahora mismo/)
  assert.match(directory, /procesiones en curso/)
  assert.match(directory, /setInterval\(\(\) => setNowIso/)
  assert.match(directory, /cardLiveState\.isLive/)
  assert.match(page, /initialNowIso=\{nowIso\}/)
})

test('igualás y ensayos conservan un calendario especializado relacionado', () => {
  const page = read('app/agenda-cofrade/page.js')
  assert.doesNotMatch(page, /getCrewEventDirectory/)
  assert.match(page, /Ver próximas convocatorias/)
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

import test from 'node:test'
import assert from 'node:assert/strict'
import { outingTileSummary, outingWeekLabel } from '../lib/brotherhood-featured-outing.js'
import { occasionSummary } from '../lib/supabase/outing-occasion.js'
import { threadPeriod } from '../lib/brotherhood-thread.js'
import { brotherhoodChapters } from '../lib/brotherhood-chapters.js'

const outing = { date: '2026-11-08', departureTime: '17:00', isUpcoming: true, urgencyLabel: 'ESTE DOMINGO' }

test('la cabecera dice «Este domingo» solo en la semana de la salida', () => {
  assert.equal(outingWeekLabel(outing), 'Este domingo, 8 · 17:00')
  assert.equal(outingWeekLabel({ ...outing, urgencyLabel: 'MAÑANA' }), 'Mañana, 8 · 17:00')
  assert.equal(outingWeekLabel({ ...outing, urgencyLabel: 'EN 12 DÍAS' }), '')
  assert.equal(outingWeekLabel({ ...outing, isCancelled: true }), '')
  assert.equal(outingWeekLabel({ ...outing, isUpcoming: false }), '')
  assert.equal(outingWeekLabel(null), '')
})

test('el acceso a Procesión lleva fecha y hora de la próxima salida', () => {
  assert.equal(outingTileSummary(outing), 'Dom 8 nov · 17:00')
  assert.equal(outingTileSummary({ ...outing, departureTime: '' }), 'Dom 8 nov')
  assert.equal(outingTileSummary({ ...outing, isUpcoming: false }), '')
})

test('el acceso a Patrimonio resume la jornada', () => {
  const occasion = { pieces: [{ type: 'Coronas' }], marches: [{}, {}, {}, {}] }
  assert.equal(occasionSummary(occasion, 'Coronación Canónica'), 'Coronas y 4 marchas de la Coronación Canónica')
  assert.equal(occasionSummary({ pieces: [], marches: [{}] }, 'Coronación'), '1 marcha de la Coronación')
  assert.equal(occasionSummary(null), '')
})

test('los capítulos usan los datos vivos cuando existen y, si no, los recuentos', () => {
  const live = brotherhoodChapters({ types: ['Gloria'], availability: { titulars: 1, steps: 1, hasHeritage: true, heritagePieces: 2, nextOuting: 'Dom 8 nov · 17:00', occasion: 'Coronas y 4 marchas de la Coronación Canónica' } })
  assert.equal(live.find((c) => c.id === 'procesion').summary, 'Dom 8 nov · 17:00')
  assert.equal(live.find((c) => c.id === 'patrimonio').summary, 'Coronas y 4 marchas de la Coronación Canónica')
  const plain = brotherhoodChapters({ types: ['Gloria'], availability: { titulars: 1, steps: 1, hasHeritage: true, heritagePieces: 2 } })
  assert.equal(plain.find((c) => c.id === 'procesion').summary, '1 titular · 1 paso')
  assert.equal(plain.find((c) => c.id === 'patrimonio').summary, '2 piezas')
})

test('el hilo no arrastra «fecha inicial no documentada»', () => {
  assert.equal(threadPeriod('Vigente en 2026; fecha inicial no documentada'), 'Vigente en 2026')
  assert.equal(threadPeriod('Desde 2015'), 'Desde 2015')
})

test('«Ver la salida» aparece siempre que haya salida destacada, no solo esa semana', async () => {
  const { readFileSync } = await import('node:fs')
  const page = readFileSync(new URL('../app/hermandades/[slug]/page.js', import.meta.url), 'utf8')
  assert.match(page, /\{chapters && featuredOutingDetail \? <a className=\{outingCardStyles\.heroOuting\} href="#salida">/)
})

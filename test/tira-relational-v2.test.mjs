import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import {
  relationalEntityScore,
  relationalPeriodLabel,
  relationalRepertoireScore,
  relationalRequestedYear,
  relationalV2Intent,
} from '../lib/tira-relational-v2.js'

test('detecta una banda pedida para una imagen o paso concreto', () => {
  assert.equal(
    relationalV2Intent('¿Qué banda toca detrás de la Virgen de la Salud de San Gonzalo?')?.kind,
    'music_for_subject'
  )
  assert.equal(
    relationalV2Intent('¿Cuál banda acompaña al paso de palio de la Salud?')?.kind,
    'music_for_subject'
  )
})

test('mantiene las consultas actuales amplias y reconoce la relación inversa natural', () => {
  assert.equal(relationalV2Intent('¿Qué bandas acompañan a San Gonzalo?'), null)
  assert.equal(
    relationalV2Intent('¿A qué hermandades acompaña Santa Ana?')?.kind,
    'current_band_brotherhoods'
  )
  assert.equal(
    relationalV2Intent('¿Dónde toca Santa Ana?')?.kind,
    'current_band_brotherhoods'
  )
})

test('detecta acompañamientos históricos en ambos sentidos', () => {
  assert.equal(
    relationalV2Intent('¿Qué bandas han acompañado a San Bernardo?')?.kind,
    'music_history'
  )
  assert.equal(
    relationalV2Intent('¿A qué hermandades ha acompañado Santa Ana?')?.kind,
    'music_history'
  )
})

test('permite seguir una banda con una repregunta histórica breve', () => {
  const context = {
    entityId: '49b5a3e0-c7d6-4dac-980e-3eddc355a7d1',
    entityType: 'band',
    name: 'Banda de Música Santa Ana de Dos Hermanas',
  }
  assert.equal(relationalV2Intent('¿Y antes?', context)?.kind, 'music_history')
})

test('baja de la cruceta a las marchas solo cuando se piden obras', () => {
  assert.equal(
    relationalV2Intent('¿Qué marchas aparecen en la cruceta de San Gonzalo 2026?')?.kind,
    'repertoire_entries'
  )
  assert.equal(relationalV2Intent('Cruceta musical de San Gonzalo 2026'), null)
})

test('filtra un conjunto anterior de hermandades por acompañamiento musical', () => {
  const context = {
    resultSet: {
      entityType: 'brotherhood',
      entityIds: ['1', '2'],
    },
  }
  assert.equal(relationalV2Intent('¿Cuáles tienen banda?', context)?.kind, 'brotherhoods_with_music')
  assert.equal(relationalV2Intent('¿Cuáles tienen música?', context)?.kind, 'brotherhoods_with_music')
})

test('reconoce Virgen de la Salud aunque la entidad se llame Nuestra Señora de la Salud', () => {
  const score = relationalEntityScore(
    'Nuestra Señora de la Salud',
    '¿Qué banda toca detrás de la Virgen de la Salud de San Gonzalo?',
    'image'
  )
  assert.ok(score >= 1000)
})

test('prioriza la cruceta de San Gonzalo del año solicitado', () => {
  const question = '¿Qué marchas aparecen en la cruceta de San Gonzalo 2026?'
  const sanGonzalo = relationalRepertoireScore({
    year: 2026,
    brotherhood: { name: 'San Gonzalo' },
    band: { name: 'Banda de Música Santa Ana de Dos Hermanas' },
    step: { name: 'Paso de palio de Nuestra Señora de la Salud' },
    displayTitle: 'San Gonzalo · Lunes Santo 2026',
  }, question)
  const otra = relationalRepertoireScore({
    year: 2026,
    brotherhood: { name: 'Pastora de Cantillana' },
    displayTitle: 'Pastora de Cantillana · 2026',
  }, question)
  const otroAno = relationalRepertoireScore({
    year: 2025,
    brotherhood: { name: 'San Gonzalo' },
  }, question)

  assert.ok(sanGonzalo > otra)
  assert.equal(otroAno, -1000)
  assert.equal(relationalRequestedYear(question), 2026)
})

test('formatea los periodos históricos sin inventar fechas finales ni duplicar vigente', () => {
  assert.equal(relationalPeriodLabel({ date_from_text: 'Desde 1981', is_current: true }), 'Desde 1981 · vigente')
  assert.equal(relationalPeriodLabel({ date_from_text: 'Vigente · 2026', is_current: true }), 'Vigente · 2026')
  assert.equal(relationalPeriodLabel({ year_from: 1998, year_to: 2004, is_current: false }), '1998 → 2004')
  assert.equal(relationalPeriodLabel({ year_from: 1930, year_to: 1930, is_current: false }), '1930')
  assert.equal(relationalPeriodLabel({ is_current: false }), 'Periodo documentado')
})

test('el total de una cruceta se calcula antes de compactar los resultados visibles', async () => {
  const source = await readFile(new URL('../lib/supabase/tira-del-hilo-repertoire-entries.js', import.meta.url), 'utf8')
  assert.match(source, /const totalWorks = allEntries\.length/)
  assert.match(source, /const visibleEntries = allEntries\.slice\(0, 30\)/)
})

test('V12 prioriza detalle de crucetas y relaciones inversas antes del relacional genérico', async () => {
  const source = await readFile(new URL('../lib/supabase/tira-del-hilo-v12.js', import.meta.url), 'utf8')
  const repertoireIndex = source.indexOf('askHiloCofradeRepertoireEntries(clean)')
  const bandLinksIndex = source.indexOf('askHiloCofradeBandLinksV2(clean, context)')
  const relationalIndex = source.indexOf('askHiloCofradeRelationalV2(clean, context)')
  assert.ok(repertoireIndex >= 0)
  assert.ok(bandLinksIndex > repertoireIndex)
  assert.ok(relationalIndex > bandLinksIndex)
})

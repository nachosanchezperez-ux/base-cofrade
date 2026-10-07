import assert from 'node:assert/strict'
import test from 'node:test'

import { buildMusicAccompanimentSummary, musicAccompanimentBandMatchesQuery } from '../lib/music-accompaniment-summary.js'

test('la búsqueda encuentra el nombre habitual de Las Cigarreras en su ruta pública', () => {
  const band = {
    name: 'Banda de Música María Santísima de la Victoria',
    href: '/bandas/banda-musica-maria-santisima-victoria-las-cigarreras',
  }
  assert.equal(musicAccompanimentBandMatchesQuery(band, 'Las Cigarreras'), true)
  assert.equal(musicAccompanimentBandMatchesQuery(band, 'María Santísima'), true)
  assert.equal(musicAccompanimentBandMatchesQuery(band, 'las-cigarreras'), true)
  assert.equal(musicAccompanimentBandMatchesQuery(band, 'Santa Ana'), false)
  assert.equal(musicAccompanimentBandMatchesQuery(band, ''), true)
})

function period(overrides = {}) {
  return {
    id: 'period-1',
    bandEntityId: 'band-santa-ana',
    bandName: 'Banda de Música Santa Ana de Dos Hermanas',
    bandHref: '/bandas/banda-musica-santa-ana-dos-hermanas',
    bandType: 'Banda de Música',
    brotherhoodEntityId: 'san-esteban',
    brotherhoodName: 'Hermandad de San Esteban',
    brotherhoodHref: '/hermandades/san-esteban',
    stepEntityId: 'palio-desamparados',
    stepName: 'Paso de palio de Madre de los Desamparados',
    position: 'Tras el paso de palio',
    outingType: 'Martes Santo',
    day: 'Martes Santo',
    municipality: 'Sevilla',
    municipalitySlug: 'sevilla',
    province: 'Sevilla',
    yearFrom: 2027,
    yearTo: null,
    dateFrom: null,
    dateTo: null,
    isCurrent: false,
    ...overrides,
  }
}

function band(summary, id = 'band-santa-ana') {
  return summary.bands.find((item) => item.id === id)
}

test('San Esteban cambia de banda entre 2026 y 2027 sin sumar el histórico a la nueva temporada', () => {
  const periods = [
    period({
      id: 'san-esteban-cigarreras',
      bandEntityId: 'band-cigarreras-bm',
      bandName: 'Banda de Música Las Cigarreras',
      bandHref: '/bandas/banda-musica-las-cigarreras',
      yearFrom: 2009,
      yearTo: 2026,
    }),
    period({ id: 'san-esteban-santa-ana', isCurrent: true }),
  ]

  const season2026 = buildMusicAccompanimentSummary(periods, { year: 2026 })
  const season2027 = buildMusicAccompanimentSummary(periods, { year: 2027 })

  assert.deepEqual(season2026.totals, { capital: 1, province: 0, total: 1 })
  assert.deepEqual(season2027.totals, { capital: 1, province: 0, total: 1 })
  assert.equal(band(season2026, 'band-cigarreras-bm').total, 1)
  assert.equal(band(season2027).total, 1)
  assert.equal(band(season2027, 'band-cigarreras-bm'), undefined)
  assert.equal(season2026.isAdvance, false)
  assert.equal(season2027.isAdvance, true)
})

test('los contratos que comienzan en 2027 cuentan aunque isCurrent sea falso', () => {
  const periods = [
    period({ id: 'futuro-abierto' }),
    period({ id: 'futuro-finito', brotherhoodEntityId: 'h-futuro-finito', yearTo: 2028 }),
    period({ id: 'demasiado-futuro', brotherhoodEntityId: 'h-2028', yearFrom: 2028 }),
    period({ id: 'cerrado-2026', brotherhoodEntityId: 'h-2026', yearFrom: 2014, yearTo: 2026 }),
    period({ id: 'antiguo-abierto', brotherhoodEntityId: 'h-antiguo', yearFrom: 2001 }),
  ]

  const summary = buildMusicAccompanimentSummary(periods, { year: 2027 })

  assert.equal(summary.totals.total, 2)
  assert.deepEqual(band(summary).items.map((item) => item.id).sort(), ['futuro-abierto', 'futuro-finito'])
  assert.equal(summary.pendingTotal, 0)
})

test('los vínculos abiertos previos cuentan en 2026 y quedan pendientes para 2027 sin interpretar las notas', () => {
  const periods = [
    period({
      id: 'pasion-dos-hermanas',
      brotherhoodEntityId: 'h-pasion-dos-hermanas',
      municipality: 'Dos Hermanas',
      municipalitySlug: 'dos-hermanas',
      yearFrom: null,
      isCurrent: true,
      notes: 'La guía de 2026 acredita este acompañamiento; no se infiere continuidad posterior.',
    }),
    period({
      id: 'bellavista',
      brotherhoodEntityId: 'h-bellavista',
      yearFrom: 1999,
      isCurrent: true,
      notes: 'Renovado hasta 2027.',
    }),
  ]

  const season2026 = buildMusicAccompanimentSummary(periods, { year: 2026 })
  const season2027 = buildMusicAccompanimentSummary(periods, { year: 2027 })

  assert.deepEqual(season2026.totals, { capital: 1, province: 1, total: 2 })
  assert.deepEqual(season2027.totals, { capital: 0, province: 0, total: 0 })
  assert.equal(season2027.pendingTotal, 2)
  assert.equal(season2027.pendingBandsCount, 1)
  assert.equal(band(season2027).pendingCount, 2)
  assert.deepEqual(band(season2027).pendingItems.map((item) => item.id).sort(), ['bellavista', 'pasion-dos-hermanas'])
})

test('un intervalo que cubre 2027 vale aunque figure histórico y un contrato caducado no revive por isCurrent', () => {
  const summary = buildMusicAccompanimentSummary([
    period({ id: 'finito', yearFrom: 2012, yearTo: 2027 }),
    period({ id: 'caducado', brotherhoodEntityId: 'h-caducado', yearFrom: 2000, yearTo: 2025, isCurrent: true }),
  ], { year: 2027 })

  assert.equal(summary.totals.total, 1)
  assert.equal(band(summary).items[0].id, 'finito')
  assert.equal(summary.pendingTotal, 0)
})

test('las fechas exactas respetan el Martes Santo de 2027 y sus límites inclusivos', () => {
  const periods = [
    period({ id: 'inicio-el-dia', brotherhoodEntityId: 'h-inicio', yearFrom: null, dateFrom: '2027-03-23' }),
    period({ id: 'final-el-dia', brotherhoodEntityId: 'h-final', yearFrom: 2010, yearTo: 2027, dateTo: '2027-03-23' }),
    period({ id: 'inicio-tarde', brotherhoodEntityId: 'h-tarde', yearFrom: 2027, dateFrom: '2027-03-24' }),
    period({ id: 'final-antes', brotherhoodEntityId: 'h-antes', yearFrom: 2010, yearTo: 2027, dateTo: '2027-03-22' }),
  ]

  const summary = buildMusicAccompanimentSummary(periods, { year: 2027 })

  assert.equal(summary.totals.total, 2)
  assert.deepEqual(band(summary).items.map((item) => item.id).sort(), ['final-el-dia', 'inicio-el-dia'])
})

test('un rosario, traslado o concierto no se convierte en acompañamiento de Semana Santa por mencionar una jornada', () => {
  const summary = buildMusicAccompanimentSummary([
    period({ id: 'estacion' }),
    period({ id: 'rosario', brotherhoodEntityId: 'h-rosario', outingType: 'Rosario de la Aurora del Domingo de Ramos' }),
    period({ id: 'traslado', brotherhoodEntityId: 'h-traslado', outingType: 'Traslado del Viernes Santo' }),
    period({ id: 'concierto', brotherhoodEntityId: 'h-concierto', outingType: 'Concierto del Sábado Santo' }),
  ], { year: 2027 })

  assert.equal(summary.totals.total, 1)
  assert.equal(summary.pendingTotal, 0)
  assert.equal(band(summary).items[0].id, 'estacion')
})

test('el ámbito depende del acompañamiento y no convierte territorios incompletos o externos en provincia', () => {
  const summary = buildMusicAccompanimentSummary([
    period({ id: 'capital', bandMunicipality: 'Cádiz', bandProvince: 'Cádiz' }),
    period({ id: 'provincia', brotherhoodEntityId: 'h-camas', municipality: 'Camas', municipalitySlug: 'camas' }),
    period({ id: 'exterior', brotherhoodEntityId: 'h-cadiz', municipality: 'Cádiz', municipalitySlug: 'cadiz', province: 'Cádiz' }),
    period({ id: 'sin-provincia', brotherhoodEntityId: 'h-sin-provincia', municipality: 'Localidad sin verificar', municipalitySlug: 'localidad-sin-verificar', province: '' }),
    period({ id: 'desconocido', brotherhoodEntityId: 'h-desconocido', municipality: '', municipalitySlug: '', province: '' }),
  ], { year: 2027 })

  assert.deepEqual(summary.totals, { capital: 1, province: 1, total: 2 })
  assert.deepEqual(band(summary).items.map((item) => item.id).sort(), ['capital', 'provincia'])
})

test('deduplica etapas y alias genéricos de una misma posición, pero conserva los tramos diferentes', () => {
  const aliases = buildMusicAccompanimentSummary([
    period({ id: 'etapa-1', yearFrom: 2009, yearTo: 2027, position: 'Tras el paso' }),
    period({ id: 'etapa-2', yearFrom: 2020, yearTo: 2027, position: 'Tras el paso de palio' }),
  ], { year: 2027 })
  const segments = buildMusicAccompanimentSummary([
    period({ id: 'ida', position: 'Tras el paso de palio · tramo de ida' }),
    period({ id: 'vuelta', position: 'Tras el paso de palio · tramo de vuelta' }),
  ], { year: 2027 })

  assert.equal(aliases.totals.total, 1)
  assert.equal(band(aliases).items.length, 1)
  assert.equal(segments.totals.total, 2)
  assert.equal(band(segments).items.length, 2)
})

test('los contextos explícitos no se pierden cuando no usan una palabra de tramo prevista', () => {
  for (const positions of [
    ['Tras el paso de palio', 'Tras el paso de palio · vuelta'],
    ['Tras el paso de palio · primera parte', 'Tras el paso de palio · segunda parte'],
  ]) {
    const summary = buildMusicAccompanimentSummary(
      positions.map((position, index) => period({ id: `contexto-${index}`, position })),
      { year: 2027 },
    )

    assert.equal(summary.totals.total, 2, positions.join(' / '))
    assert.equal(summary.excluded.duplicatePeriods, 0)
  }
})

test('absorbe una instantánea sin paso solo cuando existe un único paso inequívoco', () => {
  const summary = buildMusicAccompanimentSummary([
    period({ id: 'generico', stepEntityId: null, stepName: '', position: 'Tras el paso' }),
    period({ id: 'paso-identificado' }),
  ], { year: 2027 })

  assert.equal(summary.totals.total, 1)
  assert.equal(summary.excluded.duplicatePeriods, 1)
  assert.equal(band(summary).items[0].id, 'paso-identificado')
  assert.equal(band(summary).items[0].stepName, 'Paso de palio de Madre de los Desamparados')
})

test('no asigna una instantánea genérica a uno de dos pasos posibles de la misma Hermandad', () => {
  const summary = buildMusicAccompanimentSummary([
    period({ id: 'generico', stepEntityId: null, stepName: '', position: 'Tras el paso' }),
    period({ id: 'paso-1', stepEntityId: 'paso-1', stepName: 'Paso del Señor' }),
    period({ id: 'paso-2', stepEntityId: 'paso-2', stepName: 'Paso de la Virgen' }),
  ], { year: 2027 })

  assert.equal(summary.totals.total, 3)
  assert.equal(summary.excluded.duplicatePeriods, 0)
  assert.deepEqual(band(summary).items.map((item) => item.id).sort(), ['generico', 'paso-1', 'paso-2'])
})

test('la instantánea con el nombre del paso se vincula al ID solo si la correspondencia es inequívoca', () => {
  const snapshot = period({ id: 'instantanea', stepEntityId: null })
  const identified = period({ id: 'identificado' })
  const uniqueMatch = buildMusicAccompanimentSummary([snapshot, identified], { year: 2027 })
  const ambiguousMatch = buildMusicAccompanimentSummary([
    snapshot,
    identified,
    period({ id: 'otro-identificado', stepEntityId: 'otro-paso-con-el-mismo-nombre' }),
  ], { year: 2027 })

  assert.equal(uniqueMatch.totals.total, 1)
  assert.equal(uniqueMatch.excluded.duplicatePeriods, 1)
  assert.equal(band(uniqueMatch).items[0].id, 'identificado')
  assert.equal(ambiguousMatch.totals.total, 3)
  assert.equal(ambiguousMatch.excluded.duplicatePeriods, 0)
})

test('dos pasos o posiciones de una Hermandad son acompañamientos distintos', () => {
  const distinctSteps = buildMusicAccompanimentSummary([
    period({ id: 'paso-1', stepEntityId: 'paso-1' }),
    period({ id: 'paso-2', stepEntityId: 'paso-2' }),
  ], { year: 2027 })
  const distinctPositions = buildMusicAccompanimentSummary([
    period({ id: 'cruz', stepEntityId: null, stepName: '', position: 'Cruz de Guía' }),
    period({ id: 'palio', stepEntityId: null, stepName: '', position: 'Tras el paso de palio' }),
  ], { year: 2027 })

  assert.equal(distinctSteps.totals.total, 2)
  assert.equal(distinctPositions.totals.total, 2)
})

test('los nombres coincidentes no fusionan la BM y la CCyTT de Las Cigarreras', () => {
  const summary = buildMusicAccompanimentSummary([
    period({ id: 'bm', bandEntityId: 'cigarreras-bm', bandName: 'Las Cigarreras', bandType: 'Banda de Música' }),
    period({ id: 'cctt', bandEntityId: 'cigarreras-cctt', bandName: 'Las Cigarreras', bandType: 'Banda de Cornetas y Tambores' }),
  ], { year: 2027 })

  assert.equal(summary.bandsCount, 2)
  assert.equal(summary.totals.total, 2)
  assert.equal(band(summary, 'cigarreras-bm').total, 1)
  assert.equal(band(summary, 'cigarreras-cctt').total, 1)
  assert.notEqual(band(summary, 'cigarreras-bm').typeKey, band(summary, 'cigarreras-cctt').typeKey)
})

test('el detalle conserva el orden por municipio y el resumen no modifica los periodos de entrada', () => {
  const periods = [
    period({ id: 'sevilla' }),
    period({ id: 'dos-hermanas', brotherhoodEntityId: 'h-dos-hermanas', municipality: 'Dos Hermanas', municipalitySlug: 'dos-hermanas' }),
    period({ id: 'alcala', brotherhoodEntityId: 'h-alcala', municipality: 'Alcalá de Guadaíra', municipalitySlug: 'alcala-de-guadaira' }),
  ]
  const original = structuredClone(periods)
  const summary = buildMusicAccompanimentSummary(periods, { year: 2027 })

  assert.deepEqual(band(summary).items.map((item) => item.municipality), ['Alcalá de Guadaíra', 'Dos Hermanas', 'Sevilla'])
  assert.deepEqual(summary.totals, { capital: 1, province: 2, total: 3 })
  assert.equal(band(summary).capital + band(summary).province, band(summary).total)
  assert.equal(band(summary).items.length, band(summary).total)
  assert.deepEqual(periods, original)
})

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

// Auditoría de encabezados 18/10/2026.
test('el menú móvil no usa encabezados y queda inerte cerrado', () => {
  const header = read('components/HiloHeader.js')
  const mobile = header.slice(header.indexOf('id="hilo-mobile-menu"'))
  assert.doesNotMatch(mobile, /<h[1-6][\s>]/)
  assert.match(header, /id="hilo-mobile-menu"[^>]*inert=\{!open\}/)
  assert.doesNotMatch(header, /id="hilo-mobile-menu"[^>]*aria-hidden/)
  const css = read('components/HiloHeader.module.css')
  assert.match(css, /\.mobileGroup \.mobileGroupHeading\{display:block;margin:0\}/)
  assert.doesNotMatch(css, /\.mobileGroup h2/)
})

test('los directorios de bandas, imágenes y pasos tienen un H2 de listado', () => {
  const source = read('components/RelationalEntityDirectory.js')
  assert.match(source, /<h2 className=\{styles\.resultTitle\}>\{filtered\.length\}/)
})

test('el contador de los grupos de hermandades no se pega al texto del H2', () => {
  const source = read('components/DirectoryRoutePage.js')
  assert.match(source, /<span className="sr-only"> · <\/span>\s*<span>\{group\.items\.length\}<\/span>\s*<\/h2>/)
})

test('cambios musicales 2027: municipios como H3 y Hermandades como H4', () => {
  const page = read('app/semana-santa/2027/cambios-musicales/page.js')
  assert.doesNotMatch(page, /<h2 id=\{`(?:renovaciones-)?municipio-/)
  assert.equal(page.match(/<h3 id=\{`(?:renovaciones-)?municipio-/g).length, 2)
  assert.equal(page.match(/<h4>/g).length, 2)
})

// Fase 2 (18/10/2026): H1 y H2 con texto que dice qué hay en la página.
test('los índices de hermandades llevan un H1 completo', async () => {
  const { DIRECTORY_TYPES, holyWeekDayPhrase } = await import('../lib/brotherhood-directory.js')
  const headings = Object.fromEntries(DIRECTORY_TYPES.map((type) => [type.key, type.heading]))
  assert.equal(headings['semana-santa'], 'Hermandades de Semana Santa de Sevilla y provincia')
  assert.equal(headings.gloria, 'Hermandades de Gloria de Sevilla y provincia')
  // Decisión del propietario (18/10): «Sacramentales» con mayúscula.
  assert.equal(headings.sacramentales, 'Hermandades Sacramentales de Sevilla y provincia')
  assert.match(read('components/HermandadesCategoryDirectory.js'), /\{config\.heading \|\| pageName\}/)
  assert.equal(holyWeekDayPhrase('Madrugada'), 'de la Madrugada')
  assert.equal(holyWeekDayPhrase('Domingo de Ramos'), 'del Domingo de Ramos')
  assert.match(read('app/hermandades/gloria/[localidad]/[mes]/page.js'), /monthName\.toLocaleLowerCase\('es'\)/)
})

test('la agenda no usa H2 de interfaz', async () => {
  const { TEMPORAL_AGENDA_PAGES } = await import('../lib/agenda-temporal-landing.js')
  for (const page of Object.values(TEMPORAL_AGENDA_PAGES)) {
    assert.match(page.heading, /Sevilla y su provincia$/)
    assert.match(page.listHeading, /^Todos los actos cofrades /)
    assert.match(page.filterHeading, / por zona y tipo$/)
  }
  for (const [file, text] of [
    ['components/AgendaTemporalLanding.js', 'Encuentra tu acto'],
    ['components/AgendaTemporalEventList.js', 'Todas las citas'],
    ['components/MunicipalityTemporalSpotlight.js', 'Primero, lo más cercano'],
    ['app/marchas/page.js', 'Encuentra una marcha'],
    ['app/semana-santa/2027/cambios-musicales/page.js', 'Encuentra un cambio musical'],
  ]) assert.ok(!read(file).includes(text), `${file}: ${text}`)
  assert.match(read('components/MunicipalityAgendaHub.js'), /<h2>Próximas citas en \{hub\.label\}<\/h2>/)
  assert.match(read('app/agenda-cofrade/page.js'), /<h1>Agenda Cofrade de Sevilla y provincia<\/h1>/)
})

// Fase 3 (18/10/2026): el H1 de las fichas lleva el contexto que las distingue.
test('el H1 de Imagen, Paso y Marcha lleva su contexto', async () => {
  const { entityHeadingContext, marchHeadingByline } = await import('../lib/seo.js')
  assert.equal(entityHeadingContext('Cristo de la Sangre', { context: 'San Benito', locality: 'Sevilla' }), 'San Benito (Sevilla)')
  assert.equal(entityHeadingContext('Paso de misterio de San Benito', { context: 'San Benito', locality: 'Sevilla' }), 'Sevilla')
  assert.equal(entityHeadingContext('Sin contexto'), '')
  assert.equal(entityHeadingContext('Andas de plata de María Santísima de Setefilla', { context: 'Nuestra Señora de Setefilla', locality: 'Lora del Río' }), 'Lora del Río')
  assert.equal(entityHeadingContext('Palio de Nuestra Señora de la Estrella', { context: 'Entrada Triunfal', locality: 'Lebrija' }), 'Entrada Triunfal (Lebrija)')
  assert.equal(marchHeadingByline(['Manuel Marvizón Carvallo']), 'de Manuel Marvizón Carvallo')
  assert.equal(marchHeadingByline(['A', 'B', 'C']), 'de A y otros')
  assert.equal(marchHeadingByline([]), '')
  for (const file of ['app/imagenes/[slug]/page.js', 'app/pasos/[slug]/page.js']) {
    assert.match(read(file), /titleContext=\{entityHeadingContext\(/, file)
  }
  for (const file of ['components/ImageHeroV2.js', 'components/RelationalEntityHero.js', 'app/marchas/[slug]/page.js']) {
    assert.match(read(file), /<h1[^>]*>\s*\{(?:title|march\.name)\}\s*\{(?:titleContext|headingByline) \? <span className=\{\w+\.titleQualifier\}>/, file)
  }
})

// Fase 4 (18/10/2026): H1 y H2 genéricos o casi duplicados fuera de las fichas.
test('directorio, pregunta, glorias y rosario usan encabezados descriptivos', () => {
  assert.match(read('app/directorio/page.js'), /<h1 className="page-title">Directorio cofrade de Sevilla y provincia<\/h1>/)
  assert.match(read('app/pregunta/page.js'), /<h1>Pregunta a Hilo Cofrade<\/h1>/)
  assert.match(read('app/procesiones-de-gloria/page.js'), />Cuándo salen las Glorias de Sevilla<\/h2>/)
  assert.match(read('app/agenda-cofrade/rosarios/[slug]/page.js'), /<h2>Sobre este rosario<\/h2>/)
})

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

for (const section of ['hermandades', 'bandas']) {
  test(`las fichas de ${section} usan ISR y no fuerzan renderizado dinámico`, () => {
    const layout = read(`app/${section}/[slug]/layout.js`)
    const page = read(`app/${section}/[slug]/page.js`)

    assert.match(layout, /export const dynamic = ['"]force-static['"]/)
    assert.doesNotMatch(layout, /force-dynamic/)
    assert.match(page, /export const revalidate = 900[;]?/)
  })
}

test('las fichas de Hermandades se generan bajo demanda sin precarga de datos', () => {
  const page = read('app/hermandades/[slug]/page.js')

  assert.match(page, /export function generateStaticParams\(\)/)
  assert.match(page, /return \[\];/)
})

for (const section of ['pasos', 'imagenes']) {
  test(`las fichas de ${section} usan ISR y se generan bajo demanda`, () => {
    const page = read(`app/${section}/[slug]/page.js`)

    assert.match(page, /export const dynamic = ['"]force-static['"]/)
    assert.doesNotMatch(page, /force-dynamic/)
    assert.match(page, /export const revalidate = 900[;]?/)
  })
}

for (const section of ['marchas', 'crucetas-musicales']) {
  test(`las fichas de ${section} usan ISR y se generan bajo demanda`, () => {
    const page = read(`app/${section}/[slug]/page.js`)

    assert.match(page, /export const dynamic = ['"]force-static['"]/)
    assert.doesNotMatch(page, /force-dynamic/)
    assert.match(page, /export const revalidate = 900[;]?/)
  })
}

for (const section of ['procesiones-de-gloria', 'extraordinarias']) {
  test(`las fichas temporales de ${section} usan ISR de cinco minutos`, () => {
    const page = read(`app/${section}/[slug]/page.js`)

    assert.match(page, /export const dynamic = ['"]force-static['"]/)
    assert.doesNotMatch(page, /force-dynamic/)
    assert.match(page, /export const revalidate = 300[;]?/)
  })
}

test('Igualás y Ensayos difiere el directorio y conserva ISR en las fichas', () => {
  const directory = read('app/igualas-y-ensayos/page.js')
  const detail = read('app/igualas-y-ensayos/[slug]/page.js')

  assert.match(directory, /await connection\(\)/)
  assert.match(directory, /public-directory-cache/)
  for (const page of [detail]) {
    assert.match(page, /export const dynamic = ['"]force-static['"]/)
    assert.doesNotMatch(page, /force-dynamic/)
    assert.match(page, /export const revalidate = 300[;]?/)
  }
  assert.match(detail, /const getCrewEvent = cache\(getCrewEventDetail\)/)
  assert.equal((detail.match(/getCrewEvent\(slug\)/g) || []).length, 2)
})

test('Pasos e Imágenes deduplican las consultas compartidas por metadata y página', () => {
  const stepPage = read('app/pasos/[slug]/page.js')
  const imagePage = read('app/imagenes/[slug]/page.js')
  const publicEntityPages = read('lib/supabase/public-entity-pages.js')

  assert.match(stepPage, /const getPaso = cache\(getPasoPageBySlug\)/)
  assert.match(publicEntityPages, /unstable_cache/)
  assert.match(publicEntityPages, /getPublishedEntityCoverMedia\(entity\.id\)/)
  assert.match(publicEntityPages, /getPublishedStepHeritage\(entity\.id\)/)
  assert.match(imagePage, /const getImagen = cache\(getImagenPageBySlug\)/)
  assert.match(imagePage, /const getEntityMedia = cache\(getPublishedEntityMedia\)/)
})


test('Procesiones de Gloria acota la consulta de detalle por slug y cachea la ficha', () => {
  const loader = read('lib/supabase/glory-directory.js')
  const directoryCache = read('lib/supabase/public-directory-cache.js')

  assert.match(loader, /if \(slug\) query = query\.eq\('slug', slug\)/)
  assert.match(loader, /const targetedDirectory = await getGloryDirectory\(\{ throwOnError: true, slug \}\)/)
  assert.match(loader, /hilo-cofrade-public-glory-detail-v2/)
  assert.match(loader, /tags: \['public-glory-detail'\]/)
  assert.match(directoryCache, /tags: \['public-glory-directory'\]/)
})

test('los LCP inequívocos usan preload en Next 16', () => {
  const bandPhoto = read('components/BandFeaturePhoto.js')
  const imageHero = read('components/ImageHeroV2.js')

  assert.match(bandPhoto, /fill[\s\S]*preload[\s\S]*sizes=/)
  assert.doesNotMatch(bandPhoto, /\bpriority\b/)
  assert.equal((imageHero.match(/\bpreload\b/g) || []).length, 2)
  assert.doesNotMatch(imageHero, /\bpriority\b/)
  assert.match(imageHero, /quality=\{35\}/)
  assert.match(imageHero, /sizes="50vw"/)
})


test('Hermandades reutiliza tipos de entidad y relaciones musicales ya cargadas', () => {
  const page = read('app/hermandades/[slug]/page.js')
  const media = read('lib/supabase/entity-media.js')
  const heritage = read('lib/supabase/brotherhood-musical-heritage.js')

  assert.match(page, /entityTypesById: coverEntityTypes/)
  assert.match(media, /needsEntityTypeLookup/)
  assert.match(page, /imageIds: h\.imagenes\.map/)
  assert.match(page, /currentAccompaniments: h\.acompanamientoActual/)
  assert.match(heritage, /suppliedImageIds/)
  assert.match(heritage, /suppliedCurrentMusicRows/)
})

test('Igualás de una Hermandad no escanea todos los lugares', () => {
  const loader = read('lib/supabase/crew-events.js')

  assert.match(loader, /const placeIds = \[\.\.\.new Set\(events\.map/)
  assert.match(loader, /\.from\('places'\)[\s\S]*\.in\('id', placeIds\)/)
  assert.match(loader, /const \[stepLinks, agentLinks\] = await Promise\.all/)
  assert.doesNotMatch(loader, /await supabase\.from\('places'\)\.select\('id, name, municipality_id'\),/)
})

test('Hermandades evita consultas duplicadas de censo, actividad anual y guantes', () => {
  const page = read('app/hermandades/[slug]/page.js')
  const quickFacts = read('components/BrotherhoodQuickFacts.js')
  const loader = read('lib/supabase/brotherhoods.js')

  assert.doesNotMatch(page, /BrotherhoodHabitGloves/)
  assert.match(page, /item\.guantes \? <div><dt>Guantes<\/dt>/)
  assert.match(loader, /gloves_color/)
  assert.match(loader, /members_count, members_count_kind/)
  assert.match(loader, /bandaId: period\.band_entity_id/)
  assert.doesNotMatch(quickFacts, /from\('brotherhood_procession_stats'\)/)
  assert.doesNotMatch(quickFacts, /from\('outing_series'\)/)
  assert.match(quickFacts, /brotherhood\.datosJornada\.membersCount/)
})

test('Discografía reutiliza nombre, logo y Spotify ya cargados en la ficha de Banda', () => {
  const page = read('app/bandas/[slug]/page.js')
  const loader = read('lib/supabase/bandDiscography.js')

  assert.match(page, /artistSpotifyUrl = band\.interestLinks\.find/)
  assert.match(page, /getBandDiscography\(band\.id, \{/)
  assert.match(loader, /bandName = '', bandLogoPath = '', artistSpotifyUrl = ''/)
  assert.match(loader, /artistSpotifyUrl\s*\? Promise\.resolve/)
  assert.match(loader, /bandName\s*\? Promise\.resolve/)
  assert.match(loader, /bandLogoPath\s*\? Promise\.resolve/)
})

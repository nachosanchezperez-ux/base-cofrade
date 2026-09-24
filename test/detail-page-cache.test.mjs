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

test('las fichas de Hermandades precalientan los slugs conocidos', () => {
  const page = read('app/hermandades/[slug]/page.js')

  assert.match(page, /export function generateStaticParams\(\)/)
  assert.match(page, /hermandades\.map\(\(item\) => \(\{ slug: item\.slug \}\)\)/)
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

test('la agenda y las fichas de Igualás y Ensayos usan ISR de cinco minutos', () => {
  const directory = read('app/igualas-y-ensayos/page.js')
  const detail = read('app/igualas-y-ensayos/[slug]/page.js')

  for (const page of [directory, detail]) {
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


test('Procesiones de Gloria cachea directorio y detalle y acota la consulta por slug', () => {
  const loader = read('lib/supabase/glory-directory.js')

  assert.match(loader, /unstable_cache/)
  assert.match(loader, /hilo-cofrade-public-glory-directory-v1/)
  assert.match(loader, /hilo-cofrade-public-glory-detail-v1/)
  assert.match(loader, /if \(slug\) query = query\.eq\('slug', slug\)/)
  assert.match(loader, /const targetedDirectory = await getGloryDirectory\(\{ throwOnError: true, slug \}\)/)
})

test('las fichas evitan trabajo continuo de layout al hacer scroll', () => {
  const nav = read('components/EntitySectionNav.js')

  assert.match(nav, /new IntersectionObserver/)
  assert.doesNotMatch(nav, /window\.addEventListener\('scroll'/)
  assert.doesNotMatch(nav, /getBoundingClientRect\(\)/)
})

test('los LCP principales usan carga prioritaria y las Glorias mantienen optimización de imagen', () => {
  const bandPhoto = read('components/BandFeaturePhoto.js')
  const gloryDirectory = read('components/GloryDirectory.js')
  const imageHero = read('components/ImageHeroV2.js')

  assert.match(bandPhoto, /fill[\s\S]*preload[\s\S]*sizes=/)
  assert.doesNotMatch(gloryDirectory, /unoptimized=\{(?:featured|outing)\.heroImagePath\.startsWith/)
  assert.match(imageHero, /quality=\{35\}/)
  assert.match(imageHero, /sizes="50vw"/)
})


test('Hermandades reutiliza escudo, tipos de entidad y relaciones ya cargadas', () => {
  const page = read('app/hermandades/[slug]/page.js')
  const media = read('lib/supabase/entity-media.js')
  const relations = read('components/BrotherhoodRelationalExtras.js')

  assert.doesNotMatch(page, /getPublishedBrotherhoodCrestPath/)
  assert.match(page, /const authoritativeCrestPath = h\.escudoPath \|\| ''/)
  assert.match(page, /entityTypesById: coverEntityTypes/)
  assert.match(media, /needsEntityTypeLookup/)
  assert.match(page, /currentAccompaniments=\{h\.acompanamientoActual\}/)
  assert.match(relations, /preparedCurrentAccompaniments/)
})

test('Igualás de una Hermandad no escanea todos los lugares', () => {
  const loader = read('lib/supabase/crew-events.js')

  assert.match(loader, /const placeIds = \[\.\.\.new Set\(events\.map/)
  assert.match(loader, /\.from\('places'\)[\s\S]*\.in\('id', placeIds\)/)
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
  assert.doesNotMatch(quickFacts, /from\('brotherhood_procession_stats'\)/)
  assert.doesNotMatch(quickFacts, /from\('outing_series'\)/)
  assert.match(quickFacts, /brotherhood\.datosJornada\.membersCount/)
})


test('Hermandades no bloquea la cabecera con módulos secundarios', () => {
  const page = read('app/hermandades/[slug]/page.js')
  const overview = read('components/BrotherhoodOverviewV2.js')

  assert.match(page, /import \{ cache, Suspense \} from 'react'/)
  assert.match(page, /async function BrotherhoodRepertoiresAsync/)
  assert.match(page, /async function BrotherhoodCrewEventsAsync/)
  assert.match(page, /<Suspense fallback=\{null\}>[\s\S]*<BrotherhoodOwnBands/)
  assert.match(page, /<Suspense fallback=\{null\}>[\s\S]*<BrotherhoodConceptualTitulars/)
  assert.match(overview, /<Suspense fallback=\{null\}>[\s\S]*<BrotherhoodQuickFacts/)
})

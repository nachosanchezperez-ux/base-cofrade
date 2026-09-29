import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { mapEditorialGuides } from '../lib/brotherhood-editorial-content.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la guía editorial exige artículo publicado y vínculo brotherhood_guide', () => {
  const brotherhoodId = 'brotherhood-1'
  const mapped = mapEditorialGuides([
    {
      id: 'guide-1',
      content_type: 'article',
      title: 'Conoce la Hermandad',
      subtitle: 'Cinco claves',
      summary: 'Resumen documentado.',
      body: '### Origen\n\nTexto del origen.',
      publish_date: '2026-09-29',
      author_name: 'Hilo Cofrade',
    },
    {
      id: 'article-2',
      content_type: 'article',
      title: 'Artículo no guía',
      body: 'No debe entrar.',
    },
    {
      id: 'curiosity-1',
      content_type: 'curiosity',
      title: 'Curiosidad',
      body: 'Tampoco debe entrar.',
    },
  ], [
    {
      editorial_content_id: 'guide-1',
      entity_id: brotherhoodId,
      relation_type: 'brotherhood_guide',
      is_primary: true,
    },
    {
      editorial_content_id: 'guide-1',
      entity_id: 'image-1',
      relation_type: 'featured_image',
      is_primary: false,
    },
    {
      editorial_content_id: 'article-2',
      entity_id: brotherhoodId,
      relation_type: 'about',
      is_primary: true,
    },
  ], [
    {
      id: 'image-1',
      name: 'Nuestra Señora de la Piedad',
      slug: 'nuestra-senora-de-la-piedad',
      entity_type: 'image',
      status: 'published',
    },
  ], brotherhoodId)

  assert.equal(mapped.length, 1)
  assert.equal(mapped[0].id, 'guide-1')
  assert.equal(mapped[0].principal, true)
  assert.equal(mapped[0].relatedEntities.length, 1)
  assert.equal(mapped[0].relatedEntities[0].slug, 'nuestra-senora-de-la-piedad')
})

test('la guía pública se carga desde Supabase y se renderiza sin tocar la página común', () => {
  const loader = read('lib/supabase/brotherhood-editorial-sections.js')
  const aggregator = read('lib/supabase/brotherhood-page.js')
  const overview = read('components/BrotherhoodOverviewV2.js')
  const component = read('components/BrotherhoodEditorialGuide.js')
  const detailPage = read('app/hermandades/[slug]/page.js')

  assert.match(loader, /\.in\('content_type', \['curiosity', 'article'\]\)/)
  assert.match(loader, /relation_type/)
  assert.match(loader, /editorialGuide: guides\[0\] \|\| null/)
  assert.match(aggregator, /editorialGuide: editorial\.editorialGuide/)
  assert.match(overview, /BrotherhoodEditorialGuide/)
  assert.match(overview, /guide=\{brotherhood\.editorialGuide\}/)
  assert.match(component, /id="conoce-hermandad"/)
  assert.match(component, /<h2>\{guide\.title\}<\/h2>/)
  assert.match(component, /guideChapters/)
  assert.match(component, /className=\{styles\.index\}/)
  assert.match(component, /className=\{styles\.chapters\}/)
  assert.match(component, /<h3>\{chapter\.title\}<\/h3>/)
  assert.match(component, /String\(index \+ 1\)\.padStart\(2, '0'\)/)
  assert.match(component, /<Link href=\{entity\.href\}/)
  assert.doesNotMatch(detailPage, /brotherhood_guide/)
})


test('la meta description puede aprovechar el resumen editorial sin romper el fallback', () => {
  const seo = read('lib/seo.js')
  assert.match(seo, /brotherhood\.editorialGuide\?\.summary/)
  assert.match(seo, /if \(editorialSummary\)/)
  assert.match(seo, /return seoDescription/)
  assert.match(seo, /const topics = \[\]/)
})


test('la cache de ficha usa el namespace editorial v6', () => {
  const aggregator = read('lib/supabase/brotherhood-page.js')
  assert.match(aggregator, /hilo-cofrade-public-brotherhood-detail-v6/)
  assert.doesNotMatch(aggregator, /hilo-cofrade-public-brotherhood-detail-v5/)
})


test('la guía editorial tiene una identidad visual propia y responsive', () => {
  const component = read('components/BrotherhoodEditorialGuide.js')
  const css = read('components/BrotherhoodEditorialGuide.module.css')

  assert.match(component, /En esta lectura/)
  assert.match(component, /claves/)
  assert.match(css, /\.headerMarker/)
  assert.match(css, /\.index/)
  assert.match(css, /\.chapterNumber/)
  assert.match(css, /position: sticky/)
  assert.match(css, /@media \(max-width: 760px\)/)
  assert.match(css, /grid-template-columns: 44px minmax\(0, 1fr\)/)
})

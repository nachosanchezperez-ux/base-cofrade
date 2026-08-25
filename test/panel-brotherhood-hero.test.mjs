import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('Hermandades incorpora Portada como módulo propio del Panel', () => {
  const layout = source('app/panel/(protected)/hermandades/[id]/layout.js')
  const page = source('app/panel/(protected)/hermandades/[id]/portada/page.js')

  assert.match(layout, /\$\{root\}\/portada/)
  assert.match(layout, /label: 'Portada'/)
  assert.match(page, /Portada de la Hermandad/)
  assert.match(page, /Ajusta su encuadre para ordenador y móvil|ajusta su encuadre para ordenador y móvil/i)
  assert.match(page, /Añadir o gestionar fotografías/)
})

test('la portada de Hermandad reutiliza media existente sin alterar su relación original', () => {
  const workspace = source('lib/panel/brotherhood-hero.js')
  const actions = source('app/panel/(protected)/hermandades/[id]/portada/actions.js')

  assert.match(workspace, /data\.images\.forEach/)
  assert.match(workspace, /data\.steps\.forEach/)
  assert.match(workspace, /data\.cults\.forEach/)
  assert.match(workspace, /data\.heritage\.forEach/)
  assert.match(actions, /const HERO_RELATION = 'hero'/)
  assert.match(actions, /is_cover: false/)
  assert.match(actions, /source_media_preserved: true/)
  assert.equal(actions.includes("from('media_assets').delete()"), false)
})

test('retirar la portada elimina solo el uso hero directo de la Hermandad', () => {
  const actions = source('app/panel/(protected)/hermandades/[id]/portada/actions.js')

  assert.match(actions, /\.eq\('relation_type', HERO_RELATION\)/)
  assert.match(actions, /from\('entity_media'\)\.delete\(\)\.eq\('id', hero\.id\)/)
  assert.equal(actions.includes('demoteHeroLink'), false)
})

test('el Front prioriza hero solo para Hermandades y conserva is_cover en el resto', () => {
  const media = source('lib/supabase/entity-media.js')
  const page = source('app/hermandades/[slug]/page.js')

  assert.match(media, /entityType === 'brotherhood'/)
  assert.match(media, /relation\.relation_type === 'hero'/)
  assert.match(media, /return relations\.find\(\(relation\) => relation\.is_cover\) \|\| null/)
  assert.match(page, /const heroMedia = entityCoverMedia\.get\(h\.id\)/)
})

test('los encuadres guardados gobiernan PC, móvil y modo de ajuste en el Front', () => {
  const page = source('app/hermandades/[slug]/page.js')
  const programHero = source('components/BrotherhoodProgramHero.js')
  const programStyles = source('components/BrotherhoodProgramHero.module.css')

  assert.match(page, /focusX: heroMedia\?\.focusX/)
  assert.match(page, /mobileFocusX: heroMedia\?\.mobileFocusX/)
  assert.match(page, /fitMode: heroMedia\?\.fitMode/)
  assert.match(programHero, /--hero-desktop-focus/)
  assert.match(programHero, /--hero-mobile-focus/)
  assert.match(programHero, /resolvedFit/)
  assert.match(programStyles, /var\(--hero-desktop-focus/)
  assert.match(programStyles, /var\(--hero-mobile-focus/)
})

test('la portada de Hermandad no contiene excepciones por slug', () => {
  const workspace = source('lib/panel/brotherhood-hero.js')
  const actions = source('app/panel/(protected)/hermandades/[id]/portada/actions.js')
  const page = source('app/panel/(protected)/hermandades/[id]/portada/page.js')

  for (const text of [workspace, actions, page]) {
    assert.equal(/el-baratillo|pastora|san-benito/i.test(text), false)
  }
})

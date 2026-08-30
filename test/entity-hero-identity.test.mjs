import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('Hermandades integra escudo y nombre en una única firma de identidad', () => {
  const hero = source('components/BrotherhoodProgramHero.js')
  const css = source('components/BrotherhoodProgramHero.module.css')

  assert.match(hero, /BrotherhoodDirectoryCrestImage/)
  assert.match(hero, /styles\.identityLockup/)
  assert.match(hero, /styles\.identityBody/)
  assert.match(hero, /width=\{178\}/)
  assert.match(hero, /sizes="\(max-width: 700px\) 102px/)
  assert.match(css, /grid-template-columns: 174px minmax\(0, 1fr\)/)
  assert.match(css, /var\(--crest-optical-scale, 1\)/)
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*\.identityLockup \{[\s\S]*grid-template-columns: 1fr/)
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*\.crest \{[\s\S]*width: 96px/)
})

test('el equilibrado óptico admite tamaños de portada sin romper el directorio', () => {
  const crest = source('components/BrotherhoodDirectoryCrestImage.js')

  assert.match(crest, /width = 82/)
  assert.match(crest, /height = 104/)
  assert.match(crest, /sizes = '\(max-width: 620px\) 60px, 82px'/)
  assert.match(crest, /priority = false/)
  assert.match(crest, /maxScale = MAX_SCALE/)
  assert.match(crest, /opticalBalance\(image, maxScale\)/)
  assert.match(crest, /detectUniformBackgroundBounds/)
  assert.match(crest, /BACKGROUND_DISTANCE/)
  assert.match(crest, /width=\{width\}/)
  assert.match(crest, /height=\{height\}/)
  assert.match(crest, /sizes=\{sizes\}/)
})

test('Bandas reserva la cabecera para logotipo y nombre', () => {
  const hero = source('components/RelationalEntityHero.js')
  const css = source('components/RelationalEntityHeroBand.module.css')
  const page = source('app/bandas/[slug]/page.js')

  assert.match(hero, /bandStyles\.identityLockup/)
  assert.match(hero, /!isBand \? \(/)
  assert.doesNotMatch(hero, /RelationalEntityHeroMedia variant="band"/)
  assert.match(hero, /bandStyles\.bandGridIdentityOnly/)
  assert.match(css, /\.identityLockup \{/)
  assert.match(css, /grid-template-columns: clamp\(190px, 17vw, 230px\) minmax\(0, 1fr\)/)
  assert.match(css, /font-size: clamp\(52px, 4\.8vw, 70px\)/)
  assert.match(css, /overflow-wrap: break-word/)
  assert.match(hero, /maxScale=\{2\.4\}/)
  assert.match(css, /translate\(var\(--crest-optical-x, 0px\), var\(--crest-optical-y, 0px\)\)/)
  assert.match(css, /\.heroBand \.bandGridIdentityOnly \{[\s\S]*grid-template-columns: 1fr/)
  assert.match(css, /@media \(max-width: 620px\)[\s\S]*\.identityLockup \{[\s\S]*grid-template-columns: 1fr/)
  assert.doesNotMatch(page, /<RelationalEntityHero[\s\S]*?media=\{\{[\s\S]*?photoSrc:/)
})

test('la identidad de Hermandades aparece antes en el primer viewport móvil', () => {
  const css = source('components/BrotherhoodProgramHero.module.css')

  assert.match(css, /@media \(max-width: 700px\)[\s\S]*?\.hero \{[\s\S]*?min-height: 740px/)
  assert.match(css, /@media \(max-width: 700px\)[\s\S]*?\.content \{[\s\S]*?padding: 205px 0 8px/)
  assert.match(css, /@media \(max-width: 420px\)[\s\S]*?min-height: 740px/)
  assert.doesNotMatch(css, /min-height: 8[24]0px/)
})

test('la fotografía de una banda se conserva en De un vistazo', () => {
  const page = source('app/bandas/[slug]/page.js')

  assert.match(page, /id="resumen"/)
  assert.match(page, /band\.heroImagePath \? \(/)
  assert.match(page, /src=\{band\.heroImagePath\}/)
  assert.match(page, /band\.heroImageCredit/)
})

test('el sistema de identidad no contiene excepciones por ficha', () => {
  const files = [
    source('components/BrotherhoodProgramHero.js'),
    source('components/RelationalEntityHero.js'),
    source('components/BrotherhoodProgramHero.module.css'),
    source('components/RelationalEntityHeroBand.module.css'),
  ]

  for (const text of files) {
    assert.equal(/el-baratillo|pastora|maestro-tejera|soledad-cantillana|cigarreras/i.test(text), false)
  }
})

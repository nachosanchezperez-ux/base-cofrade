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
  assert.match(crest, /width=\{width\}/)
  assert.match(crest, /height=\{height\}/)
  assert.match(crest, /sizes=\{sizes\}/)
})

test('Bandas une logotipo y nombre y usa la fotografía solo como apoyo', () => {
  const hero = source('components/RelationalEntityHero.js')
  const css = source('components/RelationalEntityHeroBand.module.css')

  assert.match(hero, /const bandHasPhoto = isBand && Boolean\(media\.photoSrc\)/)
  assert.match(hero, /bandStyles\.identityLockup/)
  assert.match(hero, /bandHasPhoto \? <RelationalEntityHeroMedia variant="band"/)
  assert.match(hero, /bandStyles\.bandGridNoPhoto/)
  assert.match(css, /\.identityLockup \{/)
  assert.match(css, /grid-template-columns: clamp\(210px, 22vw, 300px\) minmax\(0, 1fr\)/)
  assert.match(css, /\.heroBand \.bandGridNoPhoto \{[\s\S]*grid-template-columns: 1fr/)
  assert.match(css, /@media \(max-width: 620px\)[\s\S]*\.identityLockup \{[\s\S]*grid-template-columns: 1fr/)
})

test('el sistema de identidad no contiene excepciones por ficha', () => {
  const files = [
    source('components/BrotherhoodProgramHero.js'),
    source('components/RelationalEntityHero.js'),
    source('components/BrotherhoodProgramHero.module.css'),
    source('components/RelationalEntityHeroBand.module.css'),
  ]

  for (const text of files) {
    assert.equal(/el-baratillo|pastora|maestro-tejera|soledad-cantillana/i.test(text), false)
  }
})

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function source(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la Imagen dispone de un módulo editorial propio para su portada', () => {
  const layout = source('app/panel/(protected)/imagenes/[id]/layout.js')
  const page = source('app/panel/(protected)/imagenes/[id]/portada/page.js')

  assert.match(layout, /\$\{root\}\/portada/)
  assert.match(layout, /label: 'Portada'/)
  assert.match(page, /Portada de la ficha/)
  assert.match(page, /Retrato principal/)
  assert.match(page, /Galería/)
  assert.match(page, /Añadir o gestionar fotografías/)
})

test('la portada usa una relación hero separada del retrato principal', () => {
  const actions = source('app/panel/(protected)/imagenes/[id]/portada/actions.js')

  assert.match(actions, /const HERO_RELATION = 'hero'/)
  assert.match(actions, /relation_type: HERO_RELATION/)
  assert.match(actions, /is_cover: false/)
  assert.match(actions, /source_relation_type/)
  assert.match(actions, /demoteHeroLink/)
  assert.equal(actions.includes('clearPreviousCover'), false)
})

test('las portadas nuevas arrancan en adaptación automática', () => {
  const actions = source('app/panel/(protected)/imagenes/[id]/portada/actions.js')
  const editor = source('app/panel/(protected)/imagenes/[id]/portada/ImageHeroFramingForm.js')

  assert.match(actions, /fit_mode: 'auto'/)
  assert.match(actions, /value\(formData, 'fit_mode'\) \|\| 'auto'/)
  assert.match(editor, /Automático · recomendado/)
  assert.match(editor, /aspect < 1\.35/)
})

test('la ficha pública prioriza la portada explícita y conserva el retrato como respaldo', () => {
  const page = source('app/imagenes/[slug]/page.js')

  assert.match(page, /item\.relationType === 'hero'/)
  assert.match(page, /const coverMedia = explicitHeroMedia \|\| portraitMedia/)
  assert.match(page, /item\.relationType !== 'hero'/)
  assert.match(page, /label: 'Procesiona en'/)
  assert.match(page, /label: 'Titular de'/)
  assert.equal(page.includes("imagen.slug === 'maria-santisima-de-la-caridad-en-su-soledad'"), false)
})

test('la cabecera de Imagen usa la portada como ambiente y no como tarjeta lateral', () => {
  const page = source('app/imagenes/[slug]/page.js')
  const hero = source('components/ImageHeroV2.js')
  const styles = source('components/ImageHeroV2.module.css')

  assert.match(page, /import ImageHeroV2 from '@\/components\/ImageHeroV2'/)
  assert.match(page, /<ImageHeroV2/)
  assert.equal(page.includes('<RelationalEntityHero'), false)
  assert.match(hero, /styles\.photoLayer/)
  assert.match(hero, /useContainedPhoto/)
  assert.match(styles, /\.photoVeil/)
  assert.match(styles, /linear-gradient\(90deg/)
  assert.match(styles, /--image-mobile-focus-x/)
  assert.match(styles, /@media \(max-width: 780px\)/)
})

test('el encuadre de portada diferencia ordenador y móvil', () => {
  const editor = source('app/panel/(protected)/imagenes/[id]/portada/ImageHeroFramingForm.js')

  assert.match(editor, /mobile_focus_x/)
  assert.match(editor, /mobile_focus_y/)
  assert.match(editor, /Escritorio/)
  assert.match(editor, /Móvil/)
  assert.match(editor, /Solo ajusta los focos si el resultado lo necesita/)
})

test('la Hero V2 adapta fotografía vertical, cuadrada y horizontal sin hardcode', () => {
  const hero = source('components/ImageHeroV2.js')
  const room = source('components/ImageHeroV2Room.module.css')

  assert.match(hero, /useState\(null\)/)
  assert.match(hero, /naturalWidth \/ image\.naturalHeight/)
  assert.match(hero, /aspect < 1\.35/)
  assert.match(hero, /roomStyles\.photoBackdrop/)
  assert.match(hero, /roomStyles\.subjectStage/)
  assert.match(room, /width: min\(72vw, 1160px\)/)
  assert.match(room, /\.contained \.photoBackdrop/)
  assert.match(room, /height: 66%/)
  assert.match(room, /padding-top: 430px/)
  assert.equal(hero.includes("title === 'María Santísima de la Caridad en su Soledad'"), false)
})

test('la Hero móvil funde los bordes de fotos contenidas con el fondo ambiental', () => {
  const hero = source('components/ImageHeroV2.js')
  const room = source('components/ImageHeroV2Room.module.css')

  assert.match(hero, /--image-aspect/)
  assert.match(room, /\.contained \.subjectStage[\s\S]*aspect-ratio: var\(--image-aspect, \.82\)/)
  assert.match(room, /-webkit-mask-image: linear-gradient\(90deg/)
  assert.match(room, /mask-image: linear-gradient\(90deg/)
  assert.match(room, /\.contained \.photoBackdrop[\s\S]*blur\(18px\)[\s\S]*brightness\(\.9\)/)
  assert.equal(room.includes('background: #000'), false)
})

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
  assert.match(hero, /className=\{styles\.photoLayer\}/)
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
  assert.match(editor, /El retrato del directorio y la galería conservan sus propios ajustes/)
})

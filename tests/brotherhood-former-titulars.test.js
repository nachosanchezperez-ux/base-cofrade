import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import {
  FORMER_TITULAR_RELATION,
  IMAGE_SUCCESSION_RELATION,
  cleanOptionalText,
  formerTitularPeriod,
  isFormerTitularRelation,
  normalizeRelationType,
  relationTypeLabel,
  splitBrotherhoodImageLinks,
} from '../lib/brotherhood-image-relations.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('reconoce la relación de antigua imagen titular con variantes de escritura', () => {
  assert.equal(FORMER_TITULAR_RELATION, 'antiguo_titular')
  assert.equal(IMAGE_SUCCESSION_RELATION, 'succeeded_by')
  assert.ok(isFormerTitularRelation('antiguo_titular'))
  assert.ok(isFormerTitularRelation('Antigua titular'))
  assert.ok(isFormerTitularRelation(' ANTIGUO TITULAR '))
  assert.ok(!isFormerTitularRelation('titular'))
  assert.ok(!isFormerTitularRelation('Titular'))
  assert.ok(!isFormerTitularRelation('secondary_image'))
  assert.ok(!isFormerTitularRelation(null))
  assert.equal(normalizeRelationType('Imagen Venerada'), 'imagen_venerada')
  assert.equal(relationTypeLabel('antiguo_titular'), 'Antigua imagen titular')
  assert.equal(relationTypeLabel('cult_image'), 'cult image')
})

test('separa titulares vigentes de antiguas imágenes titulares', () => {
  const links = [
    { image_entity_id: 'a', relation_type: 'titular' },
    { image_entity_id: 'b', relation_type: 'Titular' },
    { image_entity_id: 'c', relation_type: 'antiguo_titular' },
    { image_entity_id: 'd', relation_type: 'secondary_image' },
  ]
  const { current, former } = splitBrotherhoodImageLinks(links)
  assert.deepEqual(current.map((item) => item.image_entity_id), ['a', 'b', 'd'])
  assert.deepEqual(former.map((item) => item.image_entity_id), ['c'])
})

test('el periodo solo usa fechas registradas y nunca las deduce', () => {
  assert.equal(formerTitularPeriod({ date_from_text: '1905', date_to_text: '1945' }), '1905 – 1945')
  assert.equal(formerTitularPeriod({ date_to_text: '1936' }), 'Hasta 1936')
  assert.equal(formerTitularPeriod({ date_from: '1926-04-01' }), 'Desde 1926')
  assert.equal(formerTitularPeriod({ date_from_text: 'h. 1926', date_from: '1926-04-01' }), 'Desde h. 1926')
  assert.equal(formerTitularPeriod({}), '')
})

test('los textos opcionales del panel se limpian y limitan', () => {
  assert.equal(cleanOptionalText('  1905  '), '1905')
  assert.equal(cleanOptionalText(''), null)
  assert.throws(() => cleanOptionalText('x'.repeat(121), { max: 120, label: 'La referencia' }), /120/)
})

test('la ficha pública no presenta antiguas titulares como titulares vigentes', () => {
  const loader = read('lib/supabase/brotherhoods.js')
  assert.match(loader, /splitBrotherhoodImageLinks\(imageLinks\)/)
  assert.match(loader, /\.filter\(\(imageEntity\) => !formerImageIdSet\.has\(imageEntity\.id\)\)/)
  assert.match(loader, /antiguasTitulares,/)
  assert.match(loader, /!formerImageSlugs\.has\(imagen\.slug\)/)
  // La ficha de la imagen antigua se identifica como antigua.
  const imageLoader = read('lib/supabase/public-entity-pages.js')
  assert.match(imageLoader, /antiguaTitular: isFormerTitularRelation\(relation\?\.relation_type\)/)

  const timeline = read('components/BrotherhoodHistoryTimeline.js')
  assert.match(timeline, /Antiguas imágenes titulares/)
  const page = read('app/hermandades/[slug]/page.js')
  assert.match(page, /formerTitulars=\{h\.antiguasTitulares \|\| \[\]\}/)
  const imagePage = read('app/imagenes/[slug]/page.js')
  assert.match(imagePage, /Antigua titular de/)
})

test('el panel permite registrar antiguas titulares con fechas textuales, nota y sucesora', () => {
  const editor = read('components/panel/BrotherhoodImagesEditor.js')
  assert.match(editor, /BROTHERHOOD_IMAGE_RELATION_OPTIONS/)
  assert.match(editor, /name="date_from_text"/)
  assert.match(editor, /name="date_to_text"/)
  assert.match(editor, /name="notes"/)
  assert.match(editor, /name="successor_image_id"/)

  const actions = read('app/panel/(protected)/hermandades/[id]/titulares/actions.js')
  assert.match(actions, /\.\.\.textualFields\(formData\)/)
  assert.match(actions, /IMAGE_SUCCESSION_RELATION/)
  // La sucesión anterior se archiva, nunca se borra.
  assert.doesNotMatch(actions, /\.delete\(/)
})

test('la situación actual de la imagen solo ofrece valores admitidos por la base de datos', () => {
  const page = read('app/panel/(protected)/imagenes/[id]/page.js')
  for (const value of ['extant', 'lost', 'destroyed', 'unknown']) {
    assert.match(page, new RegExp(`<option value="${value}">`))
  }
  assert.doesNotMatch(page, /name="current_condition" defaultValue=\{image\.current_condition \|\| ''\} placeholder/)
})

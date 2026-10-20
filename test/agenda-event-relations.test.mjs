import test from 'node:test'
import assert from 'node:assert/strict'
import { agendaThreadLinks, buildAgendaRelations, normalizeRelationRole, relationEntityHref } from '../lib/agenda-event-relations.js'

const entities = new Map([
  ['img-salud', { id: 'img-salud', name: 'Nuestra Señora de la Salud', slug: 'salud-san-isidoro', entity_type: 'image', status: 'published' }],
  ['img-cristo', { id: 'img-cristo', name: 'Cristo de la Misericordia', slug: 'misericordia-paradas', entity_type: 'image', status: 'published' }],
  ['img-borrador', { id: 'img-borrador', name: 'Imagen en revisión', slug: 'en-revision', entity_type: 'image', status: 'review' }],
  ['paso-1', { id: 'paso-1', name: 'Paso de misterio', slug: 'paso-misterio', entity_type: 'step', status: 'published' }],
  ['agente', { id: 'agente', name: 'Capataz', slug: 'capataz', entity_type: 'agent', status: 'published' }],
])

test('los roles se normalizan: mayúsculas, tildes y espacios no rompen el orden', () => {
  assert.equal(normalizeRelationRole('Titular procesional'), 'titular_procesional')
  assert.equal(normalizeRelationRole('Imagen titular'), 'imagen_titular')
  assert.equal(normalizeRelationRole(' processional_image '), 'processional_image')
})

test('solo se enlazan imágenes y pasos publicados con ficha', () => {
  assert.equal(relationEntityHref(entities.get('img-salud')), '/imagenes/salud-san-isidoro')
  assert.equal(relationEntityHref(entities.get('paso-1')), '/pasos/paso-misterio')
  assert.equal(relationEntityHref(entities.get('img-borrador')), '')
  assert.equal(relationEntityHref(entities.get('agente')), '')
  assert.equal(relationEntityHref({ entity_type: 'image', status: 'published', slug: '' }), '')
})

test('el hilo de una salida: imagen procesional antes que la secundaria y el paso al final', () => {
  const relations = buildAgendaRelations([
    { entityId: 'paso-1', role: 'paso_procesional' },
    { entityId: 'img-cristo', role: 'secondary_image' },
    { entityId: 'img-salud', role: 'Titular procesional' },
    { entityId: 'img-borrador', role: 'processional_image' },
    { entityId: 'agente', role: 'capataz' },
    { entityId: 'img-salud', role: 'titular' },
  ], entities)
  assert.deepEqual(relations.map((item) => [item.kind, item.name]), [
    ['image', 'Nuestra Señora de la Salud'],
    ['image', 'Cristo de la Misericordia'],
    ['step', 'Paso de misterio'],
  ])
})

test('se respetan los topes de imágenes y pasos', () => {
  const relations = buildAgendaRelations([
    { entityId: 'img-salud', role: 'processional_image' },
    { entityId: 'img-cristo', role: 'processional_image' },
    { entityId: 'paso-1', role: 'processional_step' },
  ], entities, { maxImages: 1, maxSteps: 0 })
  assert.deepEqual(relations.map((item) => item.name), ['Nuestra Señora de la Salud'])
})

test('hilo de un culto: Hermandad, imagen y guía local, sin duplicados', () => {
  const links = agendaThreadLinks({
    category: 'devotions', organizer: 'Hermandad de San Isidoro', organizerHref: '/hermandades/san-isidoro',
    relatedBrotherhoodHref: '/hermandades/san-isidoro', municipality: 'Sevilla', municipalityHref: '/agenda-cofrade/localidad/sevilla-capital',
    relations: [{ kind: 'image', name: 'Nuestra Señora de la Salud', href: '/imagenes/salud-san-isidoro' }],
  }, { includeMunicipality: true })
  assert.deepEqual(links.map((link) => [link.label, link.name, link.href]), [
    ['Hermandad', 'Hermandad de San Isidoro', '/hermandades/san-isidoro'],
    ['Imagen', 'Nuestra Señora de la Salud', '/imagenes/salud-san-isidoro'],
    ['Guía local', 'Sevilla', '/agenda-cofrade/localidad/sevilla-capital'],
  ])
})

test('hilo de un concierto: la Hermandad relacionada con su nombre y las bandas como bandas', () => {
  const links = agendaThreadLinks({
    category: 'concerts', organizer: 'Las Cigarreras', organizerHref: '/bandas/las-cigarreras',
    relatedBrotherhoodName: 'Hermandad de la Trinidad', relatedBrotherhoodHref: '/hermandades/trinidad',
    bands: [{ name: 'Las Cigarreras', href: '/bandas/las-cigarreras' }, { name: 'Sin ficha', href: '' }],
  })
  assert.deepEqual(links.map((link) => [link.label, link.name]), [
    ['Hermandad', 'Hermandad de la Trinidad'],
    ['Banda', 'Las Cigarreras'],
  ])
})

test('sin datos no se inventa nada', () => {
  assert.deepEqual(agendaThreadLinks({ category: 'devotions', organizer: 'Entidad organizadora', organizerHref: '' }), [])
  assert.deepEqual(agendaThreadLinks({}), [])
})

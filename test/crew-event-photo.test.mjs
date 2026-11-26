import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { crewPhotoCaption, pickCrewEventPhoto, titularCandidatesByStep } from '../lib/crew-event-photo.js'

const cover = (path, extra = {}) => ({ path, alt: '', credit: 'Fotografía · Autor', focusPosition: '50% 30%', ...extra })

const event = {
  id: 'ev', title: 'Igualá del palio',
  steps: [
    { id: 'misterio', name: 'Paso de misterio', isPrimary: false },
    { id: 'palio', name: 'Paso de palio', isPrimary: true },
  ],
}

test('las imágenes del Paso se ordenan: titular antes que procesional; nunca secundarias', () => {
  const byStep = titularCandidatesByStep([
    { step_entity_id: 'misterio', image_entity_id: 'sayon', relation_type: 'secondary' },
    { step_entity_id: 'misterio', image_entity_id: 'cristo', relation_type: 'processional' },
    { step_entity_id: 'misterio', image_entity_id: 'cristo-titular', relation_type: 'titular' },
  ])
  assert.deepEqual(byStep.get('misterio').map((item) => item.id), ['cristo-titular', 'cristo'])
})

test('orden de la foto: convocatoria, titular del Paso principal, Paso; si no, nada', () => {
  const titularsByStep = new Map([['palio', [{ id: 'virgen', rank: 0 }]], ['misterio', [{ id: 'cristo', rank: 0 }]]])
  const imageNames = new Map([['virgen', 'María Santísima de la Estrella'], ['cristo', 'Cristo']])
  const covers = new Map([['virgen', cover('/v.jpg')], ['cristo', cover('/c.jpg')], ['palio', cover('/p.jpg')]])

  assert.equal(pickCrewEventPhoto(event, { covers: new Map([...covers, ['ev', cover('/cartel.jpg')]]), titularsByStep, imageNames }).source, 'event')
  const titular = pickCrewEventPhoto(event, { covers, titularsByStep, imageNames })
  assert.equal(titular.path, '/v.jpg')
  assert.equal(titular.name, 'María Santísima de la Estrella')
  assert.equal(titular.position, '50% 30%')
  assert.equal(pickCrewEventPhoto(event, { covers: new Map([['palio', cover('/p.jpg')]]), titularsByStep, imageNames }).source, 'step')
  assert.equal(pickCrewEventPhoto(event, { covers: new Map(), titularsByStep, imageNames }), null)
})

test('pie de foto con el retratado y el autor; un cartel se presenta como cartel', () => {
  assert.equal(crewPhotoCaption({ source: 'titular', name: 'Cristo', credit: 'Fotografía · Autor' }), 'Fotografía de Cristo · Autor')
  assert.equal(crewPhotoCaption({ source: 'event', fit: 'contain', credit: 'Fotografía · Hermandad' }), 'Cartel · Hermandad')
  assert.equal(crewPhotoCaption({ source: 'event', credit: '' }), '')
})

test('la página carga las fotos por lotes y degrada a escudos', () => {
  const page = readFileSync('app/igualas-y-ensayos/page.js', 'utf8')
  assert.match(page, /getCrewEventDirectoryWithPhotos\(\)/)
  const loader = readFileSync('lib/supabase/crew-event-photos.js', 'utf8')
  assert.match(loader, /getPublishedEntityCoverMediaMap\(/)
  assert.match(loader, /return events\n  \}\n\}/)
  const directory = readFileSync('components/CrewEventDirectory.js', 'utf8')
  assert.match(directory, /<figure className=\{styles\.featuredVisual\}/)
  assert.match(directory, /event\.photo \? \(\n\s*<div className=\{styles\.cardPhoto\}/)
})

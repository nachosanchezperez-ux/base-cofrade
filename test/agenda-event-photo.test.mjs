import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { agendaPhotoFit, pickAgendaPhoto, titularEntityId } from '../lib/agenda-event-photo.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const cover = (overrides = {}) => ({ path: 'https://x.supabase.co/storage/v1/object/public/hilo-media/a.jpg', alt: 'Foto', authorName: 'Ana', credit: 'Fotografía · Ana', fitMode: 'auto', width: 1200, height: 800, ...overrides })

test('la foto propia del acto va primero, luego el titular y nunca una genérica', () => {
  assert.equal(pickAgendaPhoto({ heroImagePath: '/salida.jpg', heroImageCredit: 'Pepe', eventCover: cover(), titularCover: cover() }).source, 'event')
  assert.equal(pickAgendaPhoto({ heroImagePath: '/salida.jpg', heroImageCredit: 'Pepe' }).credit, 'Fotografía · Pepe')
  assert.equal(pickAgendaPhoto({ eventCover: cover(), titularCover: cover() }).source, 'event')
  const titular = pickAgendaPhoto({ titularCover: cover(), titularName: 'Esperanza de Triana' })
  assert.equal(titular.source, 'titular')
  assert.equal(titular.name, 'Esperanza de Triana')
  assert.equal(pickAgendaPhoto({ title: 'Acto', crestPath: '/escudo.png' }), null)
})

test('el crédito conserva la licencia cuando la hay', () => {
  assert.equal(pickAgendaPhoto({ eventCover: cover({ credit: 'Fotografía · Ana · CC BY-SA 4.0' }) }).credit, 'Fotografía · Ana · CC BY-SA 4.0')
  assert.equal(pickAgendaPhoto({ eventCover: cover({ credit: '', authorName: 'Fotografía: Luis' }) }).credit, 'Fotografía · Luis')
  assert.equal(pickAgendaPhoto({ eventCover: cover({ credit: '', authorName: '' }) }).credit, '')
})

test('un cartel no se recorta: encuadre «completa» o imagen claramente vertical', () => {
  assert.equal(agendaPhotoFit({ fitMode: 'contain' }), 'contain')
  assert.equal(agendaPhotoFit({ fitMode: 'cover', width: 800, height: 1200 }), 'cover')
  assert.equal(agendaPhotoFit({ fitMode: 'auto', width: 800, height: 1200 }), 'contain')
  assert.equal(agendaPhotoFit({ fitMode: 'auto', width: 1000, height: 1050 }), 'cover')
  assert.equal(agendaPhotoFit({}), 'cover')
})

test('la foto del titular sale de la primera imagen publicada del hilo', () => {
  assert.deepEqual(titularEntityId({ relations: [
    { kind: 'step', name: 'Paso', entityId: 's1' },
    { kind: 'image', name: 'Amor', entityId: 'i1' },
    { kind: 'image', name: 'San Juan', entityId: 'i2' },
  ] }), { id: 'i1', name: 'Amor' })
  assert.equal(titularEntityId({ relations: [{ kind: 'image', name: 'Sin id' }] }), null)
  assert.equal(titularEntityId({}), null)
})

test('las fotos se leen por lotes y solo para actos próximos sin foto propia', () => {
  const source = read('lib/supabase/agenda-photos.js')
  assert.match(source, /getPublishedCultCoverMediaMap\(cults\.map/)
  assert.match(source, /getPublishedEntityCoverMediaMap\(concerts\.map/)
  assert.match(source, /if \(!item\.isUpcoming \|\| item\.heroImagePath \|\| item\.eventCover\) continue/)
  assert.match(read('lib/supabase/agenda-cofrade.js'), /withAgendaPhotos\(await withAgendaRelations/)
})

test('la lista muestra la foto propia en grande y la del titular o el escudo en miniatura', () => {
  const list = read('components/AgendaTemporalEventList.js')
  assert.match(list, /variant: 'feature'/)
  assert.match(list, /photo\.source === 'titular'/)
  assert.match(list, /item\.crestPath\) return \{ variant: 'thumb'/)
  assert.match(list, /data-media=\{media\?\.variant\}/)
  assert.match(list, /<figcaption>\{media\.credit\}<\/figcaption>/)
  const css = read('components/AgendaTemporalEventList.module.css')
  assert.match(css, /\[data-fit="contain"\] \.mediaFrame\{aspect-ratio:4\/5/)
  assert.match(css, /\.photoCredit\{[^}]*font-size:12px/)
})

test('las salidas pueden marcar su imagen como cartel y la Agenda la lee', () => {
  assert.equal(pickAgendaPhoto({ heroImagePath: '/c.jpg', heroImageFit: 'contain' }).fit, 'contain')
  for (const path of ['lib/supabase/rosary-outings.js', 'lib/supabase/extraordinary-directory.js', 'lib/supabase/glory-directory.js', 'lib/supabase/general-public-outings.js']) {
    assert.match(read(path), /heroImageFit: \w+\.hero_image_fit === 'contain' \? 'contain' : 'cover'/, path)
  }
  assert.match(read('app/panel/(protected)/hermandades/[id]/salidas/hero-image-actions.js'), /hero_image_fit: value\(formData, 'presentation'\) === 'contain'/)
  assert.match(read('app/panel/(protected)/hermandades/[id]/salidas/actions.js'), /formData\.has\('hero_image_fit'\)/)
  assert.match(read('app/panel/(protected)/extraordinarias/[id]/actions.js'), /hero_image_fit: fit/)
  assert.match(read('components/panel/DirectImageUpload.js'), /presentationChoice \? \(/)
})

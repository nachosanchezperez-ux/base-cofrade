import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { stepGalleryMedia } from '../lib/entity-gallery.js'

test('la galería del paso solo muestra fotos de galería, en orden', () => {
  const items = [
    { id: 'a', path: '/a.jpg', isCover: true, relationType: 'cover' },
    { id: 'b', path: '/b.jpg', isCover: false, relationType: 'gallery' },
    { id: 'c', path: '/c.jpg', isCover: false, relationType: 'hero' },
    { id: 'd', path: '', isCover: false, relationType: 'gallery' },
    { id: 'e', path: '/e.jpg', isCover: false, relationType: 'portrait' },
    { id: 'f', path: '/f.jpg', isCover: false, relationType: 'cover' },
    { id: 'g', path: '/g.jpg', isCover: false, relationType: 'gallery' },
  ]
  assert.deepEqual(stepGalleryMedia(items).map((item) => item.id), ['b', 'g'])
  assert.deepEqual(stepGalleryMedia(null), [])
})

test('la ficha del paso muestra la galería con su ancla', () => {
  const page = readFileSync(new URL('../app/pasos/[slug]/page.js', import.meta.url), 'utf8')
  assert.match(page, /<EntityMediaGallery[\s\S]*id="fotografias"/)
  // La galería se desestructura dentro del componente de la página, no en generateMetadata.
  const component = page.slice(page.indexOf('export default async function PasoDetailPage'))
  assert.match(component, /galleryMedia = \[\],[\s\S]*\} = result;/)
  assert.ok(component.indexOf('galleryMedia = [],') < component.indexOf('} = result;'))
  assert.match(page, /href: '#fotografias', label: 'Fotografías'/)
  const loader = readFileSync(new URL('../lib/supabase/public-entity-pages.js', import.meta.url), 'utf8')
  assert.match(loader, /galleryMedia: stepGalleryMedia\(entityMedia\)/)
})

test('la ficha de la imagen mantiene sus textos de galería por defecto', () => {
  const component = readFileSync(new URL('../components/EntityMediaGallery.js', import.meta.url), 'utf8')
  assert.match(component, /title = 'Detalles fotográficos'/)
  assert.match(component, /Otras miradas de la imagen/)
})

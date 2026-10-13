import assert from 'node:assert/strict'
import test from 'node:test'

import {
  compactHeritageDirectoryItems,
  compactImageDirectoryItem,
  compactStepDirectoryItem,
} from '../lib/directory-client-items.js'

const image = {
  id: 'i1',
  slug: 'cristo-expiracion',
  name: 'Santísimo Cristo de la Expiración',
  href: '/imagenes/cristo-expiracion',
  summary: 'Un resumen largo que el directorio no muestra ni busca.',
  type: 'Cristo · Crucificado',
  date: '1682',
  material: 'Madera policromada',
  technique: 'Talla',
  condition: 'extant',
  brotherhoodName: 'El Cachorro',
  brotherhoodSlug: 'hermandad-del-cachorro',
  municipality: 'Sevilla',
  municipalitySlug: 'sevilla',
  place: 'Basílica del Cachorro',
  authors: [{ name: 'Francisco Antonio Ruiz Gijón', slug: 'francisco-antonio-ruiz-gijon', type: 'author' }],
  authorNames: ['Francisco Antonio Ruiz Gijón', 'Segundo', 'Tercero'],
  coverPath: '/media/cachorro.jpg',
  coverAlt: 'Cristo de la Expiración',
  coverCredit: 'Autor de la foto',
}

test('la tarjeta de Imagen conserva lo que muestra y busca el directorio', () => {
  const compact = compactImageDirectoryItem(image)
  for (const key of ['id', 'name', 'href', 'type', 'date', 'brotherhoodName', 'municipality', 'municipalitySlug', 'place', 'coverPath', 'coverAlt']) {
    assert.equal(compact[key], image[key], key)
  }
  // Se conservan todos los autores: la tarjeta muestra "+N" según la longitud.
  assert.deepEqual(compact.authorNames, image.authorNames)
})

test('la tarjeta de Imagen no envía al cliente datos de ficha', () => {
  const compact = compactImageDirectoryItem(image)
  for (const key of ['slug', 'summary', 'material', 'technique', 'condition', 'brotherhoodSlug', 'authors', 'coverCredit']) {
    assert.equal(key in compact, false, key)
  }
  assert.ok(JSON.stringify(compact).length < JSON.stringify(image).length * 0.75)
})

test('el contrato de Paso no cambia al moverse a un módulo compartido', () => {
  const compact = compactStepDirectoryItem({
    id: 's1', name: 'Paso', href: '/pasos/p', type: 'Palio', style: 'Neobarroco',
    imageNames: ['A', 'B', 'C'], authorNames: ['X', 'Y', 'Z'], disciplines: ['Bordado'],
  })
  assert.deepEqual(compact.imageNames, ['A', 'B'])
  assert.deepEqual(compact.authorNames, ['X', 'Y'])
  assert.match(compact.searchText, /Neobarroco.*C.*Z.*Bordado/)
})

test('las facetas compactan Imágenes y Pasos y dejan intactos otros tipos', () => {
  assert.equal('summary' in compactHeritageDirectoryItems([image], 'image')[0], false)
  const band = { id: 'b', name: 'Banda', extra: true }
  assert.deepEqual(compactHeritageDirectoryItems([band], 'band'), [band])
})

test('las facetas de Pasos conservan las listas completas para el «+N» de la tarjeta', () => {
  const [compact] = compactHeritageDirectoryItems([{
    id: 's1', name: 'Paso', href: '/pasos/p', imageNames: ['A', 'B', 'C'], authorNames: ['X', 'Y', 'Z'], summary: 'no',
  }], 'step')
  assert.deepEqual(compact.imageNames, ['A', 'B', 'C'])
  assert.deepEqual(compact.authorNames, ['X', 'Y', 'Z'])
  assert.equal('summary' in compact, false)
})

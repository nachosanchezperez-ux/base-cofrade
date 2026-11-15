import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { mergeMarchDedications } from '../lib/march-dedications.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('la Imagen y su propia Hermandad homónimas quedan en una sola dedicatoria', () => {
  const result = mergeMarchDedications([
    { id: 'img', kind: 'image', name: 'Nuestra Señora del Amparo', href: '/imagenes/amparo', ownerIds: ['hdad'] },
    { id: 'hdad', kind: 'brotherhood', name: 'Nuestra Señora del Amparo', href: '/hermandades/amparo-sevilla', popularName: 'El Amparo' },
  ])
  assert.equal(result.length, 1)
  assert.equal(result[0].name, 'Nuestra Señora del Amparo')
  assert.deepEqual(result[0].brotherhood, { name: 'El Amparo', href: '/hermandades/amparo-sevilla' })
  assert.equal(result[0].kind, undefined, 'no se filtran campos internos')
})

test('una Hermandad sin su Imagen dedicataria se muestra con su nombre popular', () => {
  const result = mergeMarchDedications([
    { id: 'img', kind: 'image', name: 'Esperanza de Triana', ownerIds: ['otra'] },
    { id: 'hdad', kind: 'brotherhood', name: 'Nuestra Señora del Amparo', popularName: 'El Amparo' },
  ])
  assert.deepEqual(result.map((item) => item.name), ['Esperanza de Triana', 'El Amparo'])
  assert.equal(result[0].brotherhood, undefined)
})

test('no se funden dedicatorias con fecha distinta ni con texto propio', () => {
  const dated = mergeMarchDedications([
    { id: 'img', kind: 'image', name: 'Virgen', ownerIds: ['hdad'], date: '1990' },
    { id: 'hdad', kind: 'brotherhood', name: 'Virgen', popularName: 'La Hdad' , date: '2010' },
  ])
  assert.equal(dated.length, 2)
  const texted = mergeMarchDedications([
    { id: 'img', kind: 'image', name: 'Virgen', ownerIds: ['hdad'] },
    { id: 'hdad', kind: 'brotherhood', name: 'Virgen', text: 'A la Junta de 1990' },
  ])
  assert.equal(texted.length, 2)
})

test('la ficha usa la fusión y pinta la Hermandad bajo la Imagen', () => {
  const loader = read('lib/supabase/public-marches.js')
  assert.match(loader, /mergeMarchDedications\(dedications\.map/)
  assert.match(loader, /public-march-detail-v6-dedicatorias/)
  assert.match(read('app/marchas/[slug]/page.js'), /Hermandad · \{dedication\.brotherhood\.href/)
})

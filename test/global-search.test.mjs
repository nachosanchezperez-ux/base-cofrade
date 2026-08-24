import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

import {
  getHiloLookupIntent,
  hiloEntityKey,
  selectHiloNavigationItems,
} from '../lib/tira-search-intent.js'

test('detecta búsquedas directas de fichas sin secuestrar preguntas relacionales', () => {
  assert.deepEqual(getHiloLookupIntent('ficha del Baratillo'), {
    term: 'Baratillo',
    explicitNavigation: true,
  })
  assert.deepEqual(getHiloLookupIntent('Busca la ficha del Baratillo'), {
    term: 'Baratillo',
    explicitNavigation: true,
  })
  assert.deepEqual(getHiloLookupIntent('Baratillo'), {
    term: 'Baratillo',
    explicitNavigation: false,
  })
  assert.equal(getHiloLookupIntent('Busca alguna conexión entre El Baratillo y La Cena'), null)
  assert.equal(getHiloLookupIntent('¿Qué pasos tiene el Baratillo?'), null)
})

test('prioriza la ficha navegable frente a una coincidencia no navegable', () => {
  assert.equal(hiloEntityKey('El Baratillo'), 'baratillo')
  assert.equal(hiloEntityKey('Hermandad del Baratillo'), 'baratillo')

  const selected = selectHiloNavigationItems([
    { title: 'Baratillo', entityType: 'march', href: '' },
    { title: 'El Baratillo', entityType: 'brotherhood', href: '/hermandades/el-baratillo' },
    { title: 'Nuestra Señora de la Piedad', entityType: 'image', href: '/imagenes/nuestra-senora-de-la-piedad' },
  ], 'Baratillo', { explicitNavigation: true })

  assert.equal(selected.length, 1)
  assert.equal(selected[0].href, '/hermandades/el-baratillo')
})

test('la cabecera usa el mismo motor de Tira del hilo como buscador global', async () => {
  const [header, globalSearch, apiRoute] = await Promise.all([
    readFile(new URL('../components/HiloHeader.js', import.meta.url), 'utf8'),
    readFile(new URL('../components/GlobalHiloSearch.js', import.meta.url), 'utf8'),
    readFile(new URL('../app/api/tira-del-hilo/route.js', import.meta.url), 'utf8'),
  ])

  assert.match(header, /<GlobalHiloSearch\s*\/>/)
  assert.match(globalSearch, /<HiloSearch/)
  assert.match(globalSearch, /Buscar o preguntar en Hilo Cofrade/)
  assert.match(apiRoute, /searchPublicHiloEntities/)
  assert.ok(apiRoute.indexOf('searchPublicHiloEntities') < apiRoute.lastIndexOf('askPublicHiloCofrade'))
})

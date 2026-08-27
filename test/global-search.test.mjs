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
  assert.match(globalSearch, /\buniversal\b/)
  assert.match(globalSearch, /onNavigate=/)
  assert.match(globalSearch, /Buscar o preguntar en Hilo Cofrade/)
  assert.match(apiRoute, /searchPublicHiloEntities/)
  assert.ok(apiRoute.indexOf('searchPublicHiloEntities') < apiRoute.lastIndexOf('askPublicHiloCofrade'))
})

test('el modal global se monta en body y no queda recortado por la cabecera sticky', async () => {
  const [globalSearch, headerStyles] = await Promise.all([
    readFile(new URL('../components/GlobalHiloSearch.js', import.meta.url), 'utf8'),
    readFile(new URL('../components/HiloHeader.module.css', import.meta.url), 'utf8'),
  ])

  assert.match(headerStyles, /backdrop-filter:/)
  assert.match(globalSearch, /createPortal/)
  assert.match(globalSearch, /document\.body/)
  assert.match(globalSearch, /typeof document !== ['"]undefined['"]/)
})

test('el autocompletado coloca las fichas navegables antes que otras coincidencias', async () => {
  const route = await readFile(new URL('../app/api/tira-del-hilo/search/route.js', import.meta.url), 'utf8')

  assert.match(route, /prioritizeHiloNavigationItems\(await searchPublicHiloEntities/)
  assert.doesNotMatch(route, /if \(intent\?\.explicitNavigation\)/)
})

test('el autocompletado no registra el texto escrito por el usuario cuando falla', async () => {
  const route = await readFile(new URL('../app/api/tira-del-hilo/search/route.js', import.meta.url), 'utf8')
  const errorHandler = route.slice(route.indexOf('} catch'))

  assert.match(errorHandler, /console\.error\('\[Hilo Cofrade\] Error en autocompletado de Tira del hilo'\)/)
  assert.doesNotMatch(errorHandler, /rawTerm/)
  assert.doesNotMatch(errorHandler, /\bterm\b/)
  assert.doesNotMatch(errorHandler, /\berror\b\s*:/)
})

test('las coincidencias directas se presentan como mini fichas visuales y escalables', async () => {
  const [loader, search, searchStyles] = await Promise.all([
    readFile(new URL('../lib/supabase/search-live.js', import.meta.url), 'utf8'),
    readFile(new URL('../components/HiloSearch.js', import.meta.url), 'utf8'),
    readFile(new URL('../components/HiloSearch.module.css', import.meta.url), 'utf8'),
  ])

  assert.match(loader, /crest_path/)
  assert.match(loader, /logo_path/)
  assert.match(loader, /from\('entity_media'\)/)
  assert.match(loader, /resolveHiloMediaReference/)
  assert.match(loader, /location,/)
  assert.match(loader, /descriptor,/)
  assert.match(loader, /visual,/)

  assert.match(search, /function SearchResultVisual/)
  assert.match(search, /prioritizeHiloNavigationItems\(results\)/)
  assert.match(search, /hiloEntityKey\(item\.title\)/)
  assert.match(search, /styles\.resultLocation/)
  assert.match(search, /Abrir ficha/)
  assert.match(search, /Fichas y coincidencias/)
  assert.match(searchStyles, /\.resultVisualIdentity/)
  assert.match(searchStyles, /\.resultVisualPhoto/)
  assert.match(searchStyles, /\.resultPrimary/)
  assert.match(searchStyles, /\.resultAction/)

  assert.doesNotMatch(search, /item\.title\s*===\s*['"]El Baratillo['"]/)
  assert.doesNotMatch(loader, /entity\.slug\s*===\s*['"]el-baratillo['"]/)
})

test('el buscador no enlaza entidades navegables sin su ficha especializada', async () => {
  const loader = await readFile(new URL('../lib/supabase/search-live.js', import.meta.url), 'utf8')

  assert.match(loader, /isPublicEntityPageReady/)
  assert.match(loader, /publicProfileByType\[entity\.entity_type\]\?\.get\(entity\.id\)/)
  assert.match(loader, /entityHref\(entity, publicProfileByType/)
})

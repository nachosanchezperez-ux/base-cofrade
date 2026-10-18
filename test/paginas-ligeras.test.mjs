import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { compactDirectoryItem, entityDirectoryInitialState } from '../lib/entity-directory-url-state.js'

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')

test('el directorio viaja una sola vez: sin Suspense con el listado como reserva', () => {
  const page = read('app/directorio/page.js')
  assert.doesNotMatch(page, /Suspense/)
  assert.match(page, /<EntityDirectoryExplorer key=\{stateKey\} items=\{items\.map\(compactDirectoryItem\)\} initialState=\{initialState\} \/>/)
})

test('el estado del directorio se lee de la URL en el servidor', () => {
  const items = [{ kind: 'band', municipality: 'Écija' }, { kind: 'brotherhood', municipality: 'Sevilla', subtypeValues: ['Gloria'] }]
  const { initialState } = entityDirectoryInitialState(items, { tipo: 'band', localidad: 'ecija', q: 'banda' })
  assert.equal(initialState.kind, 'band')
  assert.equal(initialState.municipality, 'Écija')
  assert.equal(initialState.query, 'banda')
  assert.equal(entityDirectoryInitialState(items, { tipo: 'nada' }).initialState.kind, 'all')
})

test('iconos y escudos sin batería de tamaños; agenda por tandas', () => {
  assert.match(read('components/CofradeTypeBadges.js'), /unoptimized/)
  assert.doesNotMatch(read('components/CofradeTypeBadges.js'), /sizes=\{`\$\{size\}px`\}/)
  const agenda = read('components/AgendaCofradeDirectoryV4.js')
  assert.match(agenda, /const AGENDA_PAGE_SIZE = 24/)
  assert.match(agenda, /filtered\.slice\(0, visibleCount\)/)
  assert.match(agenda, /setVisibleCount\(Number\.POSITIVE_INFINITY\)/)
})

test('el directorio envía solo los campos que pinta y filtra; el texto de búsqueda va aparte', async () => {
  const { directorySearchExtras, directoryItemDefaults } = await import('../lib/entity-directory-url-state.js')
  const source = { id: '1', kind: 'brotherhood', name: 'Las Penas', officialName: 'Agrupación de las Penas', label: 'Hermandad', mediaKind: 'crest', href: '/hermandades/las-penas', relation: 'Sede · Iglesia del Carmen', subtype: 'Penitencia', subtypeValues: ['Penitencia'], keywords: ['Agrupación de las Penas', 'Iglesia del Carmen', 'Penitencia', 'Écija histórica', 'Formación musical documentada en el preflight de Estepa 2026.'], primaryColor: '#000', mediaAlt: 'x', holyWeekDay: '' }
  const item = compactDirectoryItem(source)
  for (const key of ['id', 'label', 'mediaKind', 'subtypeValues', 'officialName', 'keywords', 'primaryColor', 'holyWeekDay']) {
    assert.equal(key in item, false, key)
  }
  // El navegador recupera lo deducible.
  const expanded = directoryItemDefaults(item)
  assert.equal(expanded.label, 'Hermandad')
  assert.equal(expanded.mediaKind, 'crest')
  assert.deepEqual(expanded.subtypeValues, ['Penitencia'])
  // Varios subtipos sí viajan.
  assert.deepEqual(compactDirectoryItem({ ...source, subtypeValues: ['Penitencia', 'Sacramental'] }).subtypeValues, ['Penitencia', 'Sacramental'])
  // Búsqueda: sin repetir lo que ya está en la tarjeta y sin notas internas.
  const extras = directorySearchExtras([source, { href: '/x', name: 'A', officialName: 'A' }])
  assert.deepEqual(extras['/hermandades/las-penas'], { o: 'Agrupación de las Penas', k: ['Écija histórica'] })
  assert.equal('/x' in extras, false)
  // Una nota interna dentro de una descripción pública: se quita la frase, no el texto entero.
  const mixed = directorySearchExtras([{ href: '/pasos/p', name: 'Paso', keywords: ['La Hermandad atribuye la talla a Manuel Guzmán. No incorpora a la Concepción sin evidencia suficiente. Madera de cedro'] }])
  assert.deepEqual(mixed['/pasos/p'].k, ['La Hermandad atribuye la talla a Manuel Guzmán. Madera de cedro'])
})

test('el buscador del directorio pide el texto extra solo al buscar', () => {
  const explorer = read('components/EntityDirectoryExplorer.js')
  assert.match(explorer, /fetch\('\/api\/directorio\/busqueda'\)/)
  assert.match(explorer, /if \(!searching \|\| searchExtras\) return undefined/)
  assert.match(explorer, /return searchableItems/)
  assert.match(read('app/api/directorio/busqueda/route.js'), /directorySearchExtras\(await getPublicEntityDirectory\(\)\)/)
})

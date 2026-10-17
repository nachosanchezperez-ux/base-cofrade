import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { entityDirectoryInitialState } from '../lib/entity-directory-url-state.js'

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')

test('el directorio viaja una sola vez: sin Suspense con el listado como reserva', () => {
  const page = read('app/directorio/page.js')
  assert.doesNotMatch(page, /Suspense/)
  assert.match(page, /<EntityDirectoryExplorer key=\{stateKey\} items=\{items\} initialState=\{initialState\} \/>/)
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

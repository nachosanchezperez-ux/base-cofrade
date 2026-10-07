import assert from 'node:assert/strict'
import test from 'node:test'
import {
  buildBrotherhoodDirectoryNavigation,
  filterDirectoryBrotherhoods,
} from '../lib/brotherhood-directory-navigation.js'

const indexable = [
  { id: 'monday-a', slug: 'lunes-a', nombrePopular: 'Lunes A', localidad: 'Sevilla', tipos: ['Penitencia', 'Sacramental'], diaSalida: 'Lunes Santo' },
  { id: 'monday-b', slug: 'lunes-b', nombrePopular: 'Lunes B', localidad: 'Sevilla', tipos: ['Penitencia'], diaSalida: 'Lunes Santo' },
  { id: 'monday-c', slug: 'lunes-c', nombrePopular: 'Lunes C', localidad: 'Sevilla', tipos: ['Penitencia'], diaSalida: 'Lunes Santo' },
  { id: 'tuesday-a', slug: 'san-jacinto', nombrePopular: 'San Jacinto', localidad: 'Sevilla', tipos: ['Penitencia'], diaSalida: 'Martes Santo' },
  { id: 'tuesday-b', slug: 'rosario', nombrePopular: 'Rosario', localidad: 'Sevilla', tipos: ['Penitencia'], diaSalida: 'Martes Santo' },
  { id: 'glory-may', slug: 'gloria-mayo', nombrePopular: 'Gloria de mayo', localidad: 'Sevilla', tipos: ['Gloria'], gloriaMes: 5 },
  { id: 'glory-undated', slug: 'gloria-sin-fecha', nombrePopular: 'Gloria sin fecha', localidad: 'Sevilla', tipos: ['Gloria'] },
  { id: 'province', slug: 'san-jacinto-carmona', nombrePopular: 'San Jacinto de Carmona', localidad: 'Carmona', tipos: ['Penitencia'], diaSalida: 'Martes Santo' },
]

// This profile remains publicly accessible while outside the editorial index.
const publicOnly = {
  id: 'public-only', slug: 'animas', nombrePopular: 'Ánimas',
  localidad: 'Sevilla', tipos: ['Penitencia'], diaSalida: 'Martes Santo',
  sede: 'Parroquia del Espíritu Santo',
}
const publicBrotherhoods = [...indexable, publicOnly]
const ids = (items) => items.map((item) => item.id).sort()

test('la navegación cuenta el corte indexable y solo enlaza facetas con tres fichas elegibles', () => {
  const navigation = buildBrotherhoodDirectoryNavigation(indexable)

  assert.deepEqual(navigation.counts, {
    'semana-santa': 6,
    gloria: 2,
    sacramentales: 1,
    'agrupaciones-parroquiales': 0,
  })
  assert.deepEqual(navigation.routes, {
    '/hermandades/semana-santa/sevilla-capital/lunes-santo': 3,
  })

  // Three public profiles on Tuesday do not make its two indexed profiles
  // eligible for a separate landing page.
  assert.equal(filterDirectoryBrotherhoods(publicBrotherhoods, {
    territory: 'capital', typeKey: 'semana-santa', period: 'Martes Santo',
  }).length, 3)
  assert.equal(navigation.routes['/hermandades/semana-santa/sevilla-capital/martes-santo'], undefined)
})

test('las fichas públicas fuera del índice siguen localizables por nombre y templo', () => {
  assert.deepEqual(ids(filterDirectoryBrotherhoods(publicBrotherhoods, { query: 'ANIMAS' })), ['public-only'])
  assert.deepEqual(ids(filterDirectoryBrotherhoods(publicBrotherhoods, { query: 'espiritu' })), ['public-only'])
})

test('el filtro de calendario distingue todas las fechas, un mes y las glorias sin fecha documentada', () => {
  const selection = { territory: 'capital', municipality: 'sevilla', typeKey: 'gloria' }

  assert.deepEqual(ids(filterDirectoryBrotherhoods(publicBrotherhoods, { ...selection, period: null })), ['glory-may', 'glory-undated'])
  assert.deepEqual(ids(filterDirectoryBrotherhoods(publicBrotherhoods, { ...selection, period: 'Mayo' })), ['glory-may'])
  assert.deepEqual(ids(filterDirectoryBrotherhoods(publicBrotherhoods, { ...selection, period: '' })), ['glory-undated'])
})

test('búsqueda, territorio, localidad y calendario se combinan sin reducir el universo al restablecerlos', () => {
  const snapshot = structuredClone(publicBrotherhoods)
  const selected = {
    query: 'san jacinto', territory: 'capital', municipality: 'sevilla',
    typeKey: 'semana-santa', period: 'Martes Santo',
  }

  assert.deepEqual(ids(filterDirectoryBrotherhoods(publicBrotherhoods, selected)), ['tuesday-a'])
  assert.deepEqual(ids(filterDirectoryBrotherhoods(publicBrotherhoods, {
    ...selected, territory: 'provincia', municipality: 'carmona',
  })), ['province'])
  assert.deepEqual(filterDirectoryBrotherhoods(publicBrotherhoods, {
    ...selected, territory: 'provincia',
  }), [])
  assert.deepEqual(ids(filterDirectoryBrotherhoods(publicBrotherhoods, {
    query: '', territory: 'todos', municipality: 'todos', typeKey: '', period: null,
  })), ids(publicBrotherhoods))
  assert.deepEqual(publicBrotherhoods, snapshot)
})

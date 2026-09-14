import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'

import {
  directoryContextLabel,
  directoryPath,
  hasDirectoryType,
} from '../lib/brotherhood-directory.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('Agrupación Parroquial es una clasificación múltiple disponible en el Panel', () => {
  const selector = read('components/panel/BrotherhoodTypeSelector.js')
  const createAction = read('app/panel/(protected)/hermandades/nueva/actions.js')
  const updateAction = read('app/panel/(protected)/hermandades/[id]/actions.js')

  assert.match(selector, /Agrupación Parroquial/)
  assert.match(createAction, /brotherhood_types: selectedTypes/)
  assert.match(updateAction, /\['agrupación parroquial', 'Agrupación Parroquial'\]/)
})

test('Agrupaciones Parroquiales dispone de categoría y rutas públicas por localidad', () => {
  const grouping = {
    localidad: 'Sevilla',
    tipos: ['Agrupación Parroquial', 'Penitencia'],
  }

  assert.equal(hasDirectoryType(grouping, 'agrupaciones-parroquiales'), true)
  assert.equal(
    directoryPath(grouping, 'agrupaciones-parroquiales'),
    '/hermandades/agrupaciones-parroquiales/sevilla-capital'
  )
  assert.equal(directoryContextLabel(grouping, 'agrupaciones-parroquiales'), 'Agrupación Parroquial')
  assert.equal(existsSync(new URL('../app/hermandades/agrupaciones-parroquiales/page.js', import.meta.url)), true)
  assert.equal(existsSync(new URL('../app/hermandades/agrupaciones-parroquiales/[localidad]/page.js', import.meta.url)), true)
})

test('la categoría aparece en distintivos, sitemap y tiene icono propio', () => {
  assert.match(read('components/CofradeTypeBadges.js'), /Agrupación Parroquial/)
  assert.match(read('app/sitemap.js'), /\/hermandades\/agrupaciones-parroquiales/)
  assert.equal(existsSync(new URL('../public/iconos/hermandades/agrupacion-parroquial.svg', import.meta.url)), true)
})

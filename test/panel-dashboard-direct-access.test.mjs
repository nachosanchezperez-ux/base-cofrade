import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const navigation = read('lib/panel/navigation.js')
const nav = read('components/panel/PanelNav.js')
const page = read('app/panel/(protected)/page.js')
const css = read('components/panel/PanelDashboardAccess.module.css')

const expectedRoutes = [
  '/panel/hoy',
  '/panel/hermandades',
  '/panel/imagenes',
  '/panel/pasos',
  '/panel/bandas',
  '/panel/marchas',
  '/panel/extraordinarias',
  '/panel/acontecimientos',
  '/panel/agentes',
  '/panel/fuentes',
  '/panel/multimedia',
  '/panel/relaciones',
  '/panel/datos',
]

test('inicio y menú comparten una única navegación canónica', () => {
  assert.match(nav, /getPanelNavigationGroups/)
  assert.doesNotMatch(nav, /const NAV_GROUPS/)
  assert.match(page, /getPanelDashboardGroups/)

  for (const route of expectedRoutes) {
    assert.ok(navigation.includes(route), `falta el acceso ${route}`)
  }
})

test('el inicio deja de privilegiar solo Hermandades y Pasos', () => {
  assert.doesNotMatch(page, /Gestionar hermandades/)
  assert.doesNotMatch(page, /Gestionar pasos/)
  assert.match(page, /Gestiona todo Hilo/)
  assert.match(page, /Los mismos módulos en móvil y escritorio/)
  assert.match(page, /accessGroups\.map/)
  assert.match(page, /item\.description/)
})

test('los accesos directos son compactos en PC y dos columnas en móvil', () => {
  assert.match(css, /grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/)
  assert.match(css, /@media \(max-width: 860px\)/)
  assert.match(css, /grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/)
  assert.match(css, /min-height:\s*88px/)
  assert.match(css, /touch-action:\s*manipulation/)
})

test('Equipo solo se incorpora para administradores y el resumen no se enlaza consigo mismo', () => {
  assert.match(navigation, /role !== 'admin'/)
  assert.match(navigation, /href: '\/panel\/equipo'/)
  assert.match(navigation, /item\.href !== '\/panel'/)
})

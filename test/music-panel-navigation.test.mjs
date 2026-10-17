import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { activeMenuHref, menuLinks } from '../lib/site-navigation.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const target = '/acompanamientos-musicales'
const header = read('components/HiloHeader.js')
const directory = read('app/directorio/page.js')

test('el panel tiene una entrada única en la configuración compartida de los menús', () => {
  const links = menuLinks()
  assert.equal(links.filter(([href]) => href === target).length, 1)
  assert.equal(links.find(([href]) => href === target)[1], 'Estadísticas musicales')
  assert.equal(new Set(links.map(([href]) => href)).size, links.length)
  // Escritorio y móvil leen la misma configuración.
  assert.equal((header.match(/MENU_GROUPS\.map/g) || []).length, 2)
  assert.equal(activeMenuHref(target), target)
})

test('el directorio enlaza el panel una sola vez y lo declara en hasPart', () => {
  assert.equal((directory.match(/href="\/acompanamientos-musicales"/g) || []).length, 1)
  assert.match(directory, /name: 'Estadísticas musicales', url: absoluteUrl\('\/acompanamientos-musicales'\)/)
})

test('se conservan los accesos desde bandas y desde el avance 2027', () => {
  assert.match(read('app/bandas/page.js'), /href="\/acompanamientos-musicales"/)
  assert.match(read('app/semana-santa/2027/cambios-musicales/page.js'), /href="\/acompanamientos-musicales\?temporada=2027"/)
})

test('el menú ampliado permite desplazamiento vertical en pantallas bajas', () => {
  assert.match(read('components/HiloHeader.module.css'), /\.groupPopover\{max-height:calc\(100dvh[^}]+overflow-y:auto/)
})

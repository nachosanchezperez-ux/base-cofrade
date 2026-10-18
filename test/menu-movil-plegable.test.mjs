// Menú móvil plegable: los cinco grupos como filas con resumen, uno abierto.
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { MENU_GROUPS, menuLinks } from '../lib/site-navigation.js'

const header = readFileSync(new URL('../components/HiloHeader.js', import.meta.url), 'utf8')

test('cada grupo tiene un resumen para el menú móvil y no se pierde ningún enlace', () => {
  assert.equal(MENU_GROUPS.length, 5)
  for (const group of MENU_GROUPS) assert.ok(group.hint && group.hint.length <= 40, group.id)
  assert.equal(menuLinks().length, 24)
})

test('el menú móvil es un acordeón accesible que abre el grupo de la página actual', () => {
  assert.match(header, /aria-expanded=\{expanded\}/)
  assert.match(header, /aria-controls=\{`menu-movil-\$\{group\.id\}-enlaces`\}/)
  assert.match(header, /hidden=\{!expanded\}/)
  assert.match(header, /if \(open\) setMobileGroup\(currentGroup \|\| 'agenda'\)/)
  // Escritorio y móvil siguen leyendo la misma configuración.
  assert.equal((header.match(/MENU_GROUPS\.map/g) || []).length, 2)
})

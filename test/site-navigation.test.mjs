import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import test from 'node:test'

import { activeMenuGroup, activeMenuHref, MENU_GROUPS, menuLinks } from '../lib/site-navigation.js'

test('el menú tiene cinco grupos en el orden acordado', () => {
  assert.deepEqual(MENU_GROUPS.map((group) => group.label), ['Agenda', 'Hermandades', 'Música', 'Patrimonio', 'Actualidad'])
})

test('cada ruta aparece una sola vez y todas existen en app/', () => {
  const hrefs = menuLinks().map(([href]) => href)
  assert.equal(new Set(hrefs).size, hrefs.length)
  for (const href of hrefs) {
    assert.ok(existsSync(new URL(`../app${href}/page.js`, import.meta.url)), `Falta la página de ${href}`)
  }
})

test('conserva los accesos que antes estaban en el menú y añade Extraordinarias', () => {
  const hrefs = new Set(menuLinks().map(([href]) => href))
  for (const href of [
    '/el-hilo-se-mueve', '/directorio', '/hermandades', '/procesiones-de-gloria', '/imagenes', '/pasos',
    '/bandas', '/acompanamientos-musicales', '/semana-santa/2027/cambios-musicales', '/marchas', '/autores',
    '/crucetas-musicales', '/via-crucis-sevilla', '/juegos/el-hilo-escondido', '/agenda-cofrade', '/igualas-y-ensayos',
    '/extraordinarias',
  ]) assert.ok(hrefs.has(href), href)
  assert.equal(menuLinks().find(([href]) => href === '/acompanamientos-musicales')[1], 'Estadísticas musicales')
})

test('el Vía Crucis del Consejo va aparte, como Historia dentro de Patrimonio', () => {
  const patrimonio = MENU_GROUPS.find((group) => group.id === 'patrimonio')
  const history = patrimonio.sections.find((section) => section.title === 'Historia')
  assert.deepEqual(history.links, [['/via-crucis-sevilla', 'Vía Crucis del Consejo']])
})

test('marca el grupo y el enlace de la página actual por la ruta más larga', () => {
  assert.equal(activeMenuGroup('/'), '')
  assert.equal(activeMenuGroup('/hermandades/el-baratillo'), 'hermandades')
  assert.equal(activeMenuGroup('/extraordinarias/sevilla-regla-coronada-2026'), 'agenda')
  assert.equal(activeMenuGroup('/semana-santa/2027/cambios-musicales'), 'musica')
  assert.equal(activeMenuGroup('/imagenes/nuestra-senora-del-subterraneo'), 'patrimonio')
  assert.equal(activeMenuGroup('/pregunta'), '')
  assert.equal(activeMenuHref('/agenda-cofrade/hoy'), '/agenda-cofrade/hoy')
  assert.equal(activeMenuHref('/agenda-cofrade/localidad/sevilla'), '/agenda-cofrade')
  assert.equal(activeMenuHref('/hermandades/gloria/sevilla-capital/octubre'), '/hermandades/gloria')
  assert.equal(activeMenuHref('/marchas?page=2'), '/marchas')
  // Un prefijo de texto no es una ruta hija.
  assert.equal(activeMenuHref('/pasos-de-ejemplo'), '')
})

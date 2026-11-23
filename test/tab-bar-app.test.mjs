// Barra inferior de la aplicación en móvil (23/11/2026).
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { activeTab, showTabBar, TAB_ITEMS } from '../lib/tab-bar.js'

test('cinco accesos: Inicio, Agenda, 2027, Hermandades y Buscar', () => {
  assert.deepEqual(TAB_ITEMS.map((item) => item.label), ['Inicio', 'Agenda', '2027', 'Hermandades', 'Buscar'])
})

test('marca la pestaña de la sección actual', () => {
  assert.equal(activeTab('/'), 'inicio')
  assert.equal(activeTab('/agenda-cofrade/hoy'), 'agenda')
  assert.equal(activeTab('/igualas-y-ensayos'), 'agenda')
  assert.equal(activeTab('/semana-santa-sevilla-2027/lunes-santo'), 'programa')
  assert.equal(activeTab('/semana-santa/2027/cambios-musicales'), 'programa')
  assert.equal(activeTab('/hermandades/baratillo-sevilla'), 'hermandades')
  assert.equal(activeTab('/bandas/banda-del-sol'), '')
  assert.equal(activeTab('/agenda-cofradeX'), '')
})

test('sin barra en el Panel; se aparta donde la ficha trae su propia barra', () => {
  assert.equal(showTabBar('/panel/hoy'), false)
  assert.equal(showTabBar('/marchas'), true)
  const css = readFileSync(new URL('../components/HiloTabBar.module.css', import.meta.url), 'utf8')
  assert.match(css, /Capítulos de la ficha/)
  assert.match(css, /max-width: 859px/)
  const chapterNav = readFileSync(new URL('../components/BrotherhoodChapterNav.js', import.meta.url), 'utf8')
  assert.match(chapterNav, /aria-label="Capítulos de la ficha"/)
})

test('«Buscar» abre el buscador global y la barra está en el layout', () => {
  const search = readFileSync(new URL('../components/GlobalHiloSearch.js', import.meta.url), 'utf8')
  assert.match(search, /addEventListener\('hilo:request-search', openDialog\)/)
  const layout = readFileSync(new URL('../app/layout.js', import.meta.url), 'utf8')
  assert.match(layout, /<HiloTabBar \/>/)
})

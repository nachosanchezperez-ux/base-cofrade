import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const panelNav = read('components/panel/PanelNav.js')
const panelNavStyles = read('components/panel/PanelNav.module.css')
const workspaceNav = read('components/panel/EntityWorkspaceNav.js')
const workspaceStyles = read('components/panel/EntityWorkspaceNav.module.css')
const brotherhoodLayout = read('app/panel/(protected)/hermandades/[id]/layout.js')

test('la navegación principal usa grupos editoriales comprensibles', () => {
  for (const label of ['Inicio', 'Contenido', 'Documentación', 'Sistema']) {
    assert.match(panelNav, new RegExp(`label: '${label}'`))
  }
  assert.doesNotMatch(panelNav, /label: 'Conocimiento'/)
})

test('el Panel evita el tramo intermedio de navegación solo con siglas', () => {
  assert.match(panelNavStyles, /@media \(max-width: 1180px\)/)
  assert.match(panelNavStyles, /@media \(max-width: 860px\)/)
  assert.doesNotMatch(panelNavStyles, /@media \(max-width: 980px\)[\s\S]*\.navLabel\s*\{[\s\S]*clip:/)
  assert.match(panelNavStyles, /grid-template-columns:\s*repeat\(5, minmax\(0, 1fr\)\)/)
  assert.match(panelNav, /placeholder="Buscar módulo…"/)
})

test('la barra móvil prioriza acciones de trabajo sobre tipos de entidad', () => {
  for (const label of ['Buscar', 'Recientes', 'Nuevo', 'Menú']) {
    assert.match(panelNav, new RegExp(`label="${label}"|label=${label}|>${label}<`))
  }
  assert.match(panelNav, /panel-command-open/)
  assert.match(panelNav, /openCommand\('search'\)/)
  assert.match(panelNav, /openCommand\('recent'\)/)
  assert.match(panelNav, /openCommand\('new'\)/)
})

test('las fichas cambian a selector de sección en móvil y conservan grupos en escritorio', () => {
  assert.match(workspaceNav, /function groupItems/)
  assert.match(workspaceNav, /<optgroup label=\{group\.label\}/)
  assert.match(workspaceNav, /Cambiar de sección de la ficha/)
  assert.match(workspaceStyles, /@media \(max-width: 860px\)/)
  assert.match(workspaceStyles, /\.mobilePicker\s*\{[\s\S]*display:\s*flex/)
})

test('la ficha de Hermandad separa ficha, cofradía y archivo', () => {
  for (const group of ['Ficha', 'Cofradía', 'Archivo']) {
    assert.match(brotherhoodLayout, new RegExp(`group: '${group}'`))
  }
})

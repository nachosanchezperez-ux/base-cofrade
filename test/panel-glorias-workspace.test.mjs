import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

const navigation = read('lib/panel/navigation.js')
const loader = read('lib/panel/glories.js')
const page = read('app/panel/(protected)/glorias/page.js')
const css = read('components/panel/PanelGlories.module.css')

test('Glorias tiene acceso propio sin crear otra entidad ni otro modelo de salidas', () => {
  assert.match(navigation, /href: '\/panel\/glorias'/)
  assert.match(navigation, /label: 'Glorias'/)
  assert.match(loader, /from\('brotherhoods'\)/)
  assert.match(loader, /contains\('brotherhood_types', \['Gloria'\]\)/)
  assert.match(loader, /from\('outings'\)/)
  assert.doesNotMatch(loader, /from\('glorias'\)|from\('glory_/)
})

test('la agenda editorial usa solo Procesiones de Gloria futuras documentadas', () => {
  assert.match(loader, /ilike\('outing_type', 'Procesión de Gloria'\)/)
  assert.match(loader, /gte\('outing_date', today\)/)
  assert.match(loader, /event_status !== 'cancelled'/)
  assert.match(page, /Próximas Procesiones de Gloria/)
  assert.match(page, /Próxima Procesión de Gloria por documentar/)
  assert.doesNotMatch(page, /current_procession_day/)
})

test('cada Gloria conduce a la ficha y a sus salidas canónicas', () => {
  assert.match(page, /href=\{`\/panel\/hermandades\/\$\{item\.id\}`\}/)
  assert.match(page, /href=\{`\/panel\/hermandades\/\$\{item\.id\}\/salidas`\}/)
  assert.match(page, /Ver Glorias públicas/)
})

test('el espacio de Glorias es usable en móvil sin perder métricas ni acciones', () => {
  assert.match(css, /@media \(max-width: 860px\)/)
  assert.match(css, /\.cardGrid[\s\S]*grid-template-columns:\s*1fr/)
  assert.match(css, /\.cardActions a[\s\S]*min-height:\s*44px/)
  assert.match(css, /\.summaryGrid[\s\S]*repeat\(3, minmax\(0, 1fr\)\)/)
})

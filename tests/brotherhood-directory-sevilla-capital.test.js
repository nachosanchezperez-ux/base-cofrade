import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const component = readFileSync(new URL('../components/HermandadesDirectory.js', import.meta.url), 'utf8')
const styles = readFileSync(new URL('../components/HermandadesDirectoryCapital.module.css', import.meta.url), 'utf8')

test('Sevilla capital se presenta como portada de calendario en lugar de listado largo', () => {
  assert.match(component, /function CapitalDirectoryHub/)
  assert.match(component, /Sevilla capital, por calendario/)
  assert.match(component, /Calendario de penitencia/)
  assert.match(component, /Calendario de glorias/)
  assert.match(component, /territoryGroup\.key === 'capital' && !query\.trim\(\)/)
})

test('Semana Santa enlaza por jornadas y Glorias por meses usando las rutas SEO existentes', () => {
  assert.match(component, /capitalPeriodHref/)
  assert.match(component, /\/hermandades\/\$\{typeKey\}\/sevilla-capital\/\$\{directorySlug\(periodLabel\)\}/)
  assert.match(component, /family\.periods\.map/)
  assert.match(component, /Sin fecha documentada/)
})

test('Sacramentales mantiene un acceso propio y el diseño es responsive', () => {
  assert.match(component, /\/hermandades\/sacramentales\/sevilla-capital/)
  assert.match(styles, /\.capitalFamilies\{/)
  assert.match(styles, /\.periodGrid\{/)
  assert.match(styles, /@media\(max-width:620px\)/)
})

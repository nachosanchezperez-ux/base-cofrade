import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const component = readFileSync(new URL('../components/HermandadesDirectory.js', import.meta.url), 'utf8')
const styles = readFileSync(new URL('../components/HermandadesDirectory.module.css', import.meta.url), 'utf8')

test('el directorio presenta los municipios como bloques plegables', () => {
  assert.match(component, /openLocalities/)
  assert.match(component, /aria-expanded=\{isOpen\}/)
  assert.match(component, /className=\{styles\.localityToggle\}/)
  assert.match(component, /hidden=\{!isOpen\}/)
  assert.match(component, /Plegar todos/)
  assert.match(component, /Abrir todos/)
})

test('el directorio ofrece acceso visual rápido por municipio', () => {
  assert.match(component, /municipalityStats/)
  assert.match(component, /Accesos rápidos por municipio/)
  assert.match(component, /selectMunicipality/)
  assert.match(styles, /\.municipalityChips\{/)
  assert.match(styles, /\.localityAccordion\{/)
  assert.match(styles, /\.localityTypeSummary\{/)
})

test('una búsqueda, un municipio filtrado o Sevilla capital abren automáticamente su bloque', () => {
  assert.match(component, /const forceOpenLocalities = Boolean\(query\.trim\(\)\) \|\| municipality !== 'todos' \|\| territory === 'sevilla-capital'/)
  assert.match(component, /const isOpen = forceOpenLocalities \|\| openLocalities\.includes\(localityKey\)/)
})

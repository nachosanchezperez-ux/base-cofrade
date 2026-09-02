import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const ROOT = new URL('../', import.meta.url)

async function source(path) {
  return readFile(new URL(path, ROOT), 'utf8')
}

test('el selector del Panel diferencia la selección actual del buscador de reemplazo', async () => {
  const component = await source('components/panel/SearchableSelect.js')
  const styles = await source('components/panel/SearchableSelect.module.css')

  assert.match(component, /Selección actual/)
  assert.match(component, /Este es el valor que se guardará si no lo cambias\./)
  assert.match(component, /Cambiar \{label\}/)
  assert.match(component, /Mantener actual/)
  assert.match(component, />Quitar</)
  assert.match(component, /showSearch = !selectedOption \|\| isChanging/)
  assert.doesNotMatch(component, /Seleccionado:/)
  assert.doesNotMatch(component, /Quitar selección/)
  assert.match(styles, /\.current\s*\{/)
  assert.match(styles, /\.currentActions\s*\{/)
})

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('el autocompletado combina coincidencia literal con municipio, jornada y directorios', async () => {
  const loader = await source('lib/supabase/search-live.js')

  assert.match(loader, /parseHiloSearchScope/)
  assert.match(loader, /buildHiloDirectoryItems/)
  assert.match(loader, /searchScopedProfiles/)
  assert.match(loader, /scopeScore/)
  assert.match(loader, /from\('municipalities'\)/)
  assert.match(loader, /current_procession_day/)
})

test('una consulta secundaria fallida no vacía todo el buscador', async () => {
  const [loader, route] = await Promise.all([
    source('lib/supabase/search-live.js'),
    source('app/api/tira-del-hilo/search/route.js'),
  ])

  assert.match(loader, /async function optionalRows/)
  assert.match(loader, /Autocompletado parcial/)
  assert.doesNotMatch(loader, /const failures = \[[^\]]+\]\.find\(\(result\) => result\.error\)/)
  assert.match(route, /unavailable: true/)
})

test('el selector de resultados se puede recorrer por teclado y explica el estado vacío', async () => {
  const [component, styles] = await Promise.all([
    source('components/HiloSearch.js'),
    source('components/HiloSearchUpgrade.module.css'),
  ])

  assert.match(component, /event\.key === 'ArrowDown'/)
  assert.match(component, /event\.key === 'ArrowUp'/)
  assert.match(component, /role="combobox"/)
  assert.match(component, /role="listbox"/)
  assert.match(component, /role="option"/)
  assert.match(component, /aria-activedescendant/)
  assert.match(component, /No encuentro una ficha con esas palabras/)
  assert.match(component, /item\.actionLabel/)
  assert.match(styles, /\.resultActive/)
  assert.match(styles, /\.resultsEmpty/)
})

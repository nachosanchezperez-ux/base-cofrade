import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('el buscador territorial reutiliza el directorio público y devuelve un conjunto navegable', async () => {
  const source = await readFile(new URL('../lib/supabase/tira-del-hilo-free-facts.js', import.meta.url), 'utf8')

  assert.match(source, /getHermandadesDirectory\(\)/)
  assert.match(source, /matchMunicipalityName/)
  assert.match(source, /sourceIntent: 'brotherhoods_by_municipality'/)
  assert.match(source, /href: `\/hermandades\/\$\{item\.slug\}`/)
  assert.match(source, /Directorio público de Hermandades/)
})

test('el buscador territorial de Bandas y el resumen municipal reutilizan directorios públicos', async () => {
  const source = await readFile(new URL('../lib/supabase/tira-del-hilo-free-facts.js', import.meta.url), 'utf8')

  assert.match(source, /getPublicBandsDirectory\(\)/)
  assert.match(source, /sourceIntent: 'bands_by_municipality'/)
  assert.match(source, /href: `\/bandas\/\$\{item\.slug\}`/)
  assert.match(source, /Directorio público de Bandas/)
  assert.match(source, /Directorios públicos por municipio/)
})

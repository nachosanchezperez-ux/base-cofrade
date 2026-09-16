import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

test('el buscador territorial reutiliza el directorio público y devuelve un conjunto navegable', async () => {
  const source = await readFile(new URL('../lib/supabase/tira-del-hilo-free-facts.js', import.meta.url), 'utf8')
  const search = await readFile(new URL('../components/HiloSearch.js', import.meta.url), 'utf8')
  const styles = await readFile(new URL('../components/HiloSearchResponse.module.css', import.meta.url), 'utf8')

  assert.match(source, /getHermandadesDirectory\(\)/)
  assert.match(source, /matchMunicipalityName/)
  assert.match(source, /'brotherhoods_by_municipality'/)
  assert.match(source, /href: `\/hermandades\/\$\{item\.slug\}`/)
  assert.match(source, /Directorio público de Hermandades/)
  assert.match(source, /brotherhoods_by_day_and_municipality/)
  assert.match(source, /directoryPath\(brotherhoods\[0\], 'semana-santa'\)/)
  assert.match(source, /Agrupaciones parroquiales/)
  assert.match(source, /\/hermandades\/agrupaciones-parroquiales\/\$\{localitySlug\(parishGrouping\)\}/)
  assert.match(source, /compactItemLimit: brotherhoods\.length <= 12 \? brotherhoods\.length : 5/)
  assert.match(search, /response\.compactItemLimit/)
  assert.match(search, /responseStyles\.answerListHeading/)
  assert.match(search, /Directorios relacionados/)
  assert.match(styles, /\.answerLinks/)
  assert.match(styles, /overflow-wrap:\s*anywhere/)
})

test('el buscador territorial de Bandas y el resumen municipal reutilizan directorios públicos', async () => {
  const source = await readFile(new URL('../lib/supabase/tira-del-hilo-free-facts.js', import.meta.url), 'utf8')

  assert.match(source, /getPublicBandsDirectory\(\)/)
  assert.match(source, /sourceIntent: 'bands_by_municipality'/)
  assert.match(source, /href: `\/bandas\/\$\{item\.slug\}`/)
  assert.match(source, /Directorio público de Bandas/)
  assert.match(source, /Directorios públicos por municipio/)
})

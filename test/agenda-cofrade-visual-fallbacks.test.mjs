import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la Agenda prioriza foto, usa escudo de respaldo y nunca deja el hueco visual vacío', () => {
  const source = read('lib/supabase/agenda-cofrade.js')
  assert.match(source, /const imagePath = heroImagePath \|\| crestPath/)
  assert.match(source, /imageFallbackPath/)
  assert.match(source, /imageKind/)

  const directory = read('components/AgendaCofradeDirectoryV4.js')
  assert.match(directory, /visualFallbacks/)
  assert.match(directory, /onError=\{handleError\}/)
  assert.match(directory, /setSrc\(fallback\)/)
  assert.match(directory, /fallbackFrame/)
})

test('las extraordinarias recuperan también el escudo de su Hermandad', () => {
  const source = read('lib/supabase/extraordinary-directory.js')
  assert.match(source, /from\('brotherhoods'\)/)
  assert.match(source, /select\('entity_id, crest_path'\)/)
  assert.match(source, /crestByEntityId/)
  assert.match(source, /crestPath: crestByEntityId/)
})

test('los visuales permanecen visibles en móvil', () => {
  const source = read('components/AgendaCofradeDirectoryV4Visuals.module.css')
  assert.match(source, /@media\(max-width:560px\)/)
  assert.match(source, /grid-template-columns:55px minmax\(0,1fr\) 72px!important/)
  assert.match(source, /display:flex!important/)
})

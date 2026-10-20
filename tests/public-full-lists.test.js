import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

// La «Tira del hilo» reconoce la ficha que nombra la pregunta comparándola con todas las
// fichas publicadas (3.955 en octubre de 2026). Supabase corta en 1.000 filas por petición,
// así que esas lecturas deben ir página a página.
test('la Tira del hilo lee todas las fichas publicadas, no solo las primeras 1.000', () => {
  for (const path of [
    'lib/supabase/tira-del-hilo.js',
    'lib/supabase/tira-del-hilo-v2.js',
    'lib/supabase/tira-del-hilo-v11.js',
    'lib/supabase/tira-del-hilo-reasoning.js',
    'lib/supabase/tira-del-hilo-relational-v2.js',
    'lib/supabase/tira-del-hilo-free-facts.js',
    'lib/supabase/tira-del-hilo-free-direct.js',
    'lib/supabase/tira-del-hilo-cross-filters-v6.js',
    'lib/supabase/tira-del-hilo-authors-patrimony-v4.js',
    'lib/supabase/tira-del-hilo-march-relations-v3.js',
  ]) {
    const source = read(path)
    assert.match(source, /import \{ selectAllRows \} from '@\/lib\/supabase\/query-all'/, path)
    assert.match(source, /selectAllRows\(\(\) => /, path)
  }
})

test('el directorio y los cultos públicos no se cortan en 1.000 filas', () => {
  // Hermandades y Agentes publicados suman ya más de 1.000.
  assert.match(read('lib/supabase/directories.js'), /selectAllRows\(\(\) => supabase\.from\('entities'\)/)
  assert.match(read('lib/supabase/kissing-devotions.js'), /selectAllRows\(\(\) => \{\s*let cultsQuery/)
  assert.match(read('lib/supabase/home-v2.js'), /tieBreaker: 'thread_key'/)
})

test('el Panel y la web comparten la misma utilidad', async () => {
  const shared = await import('../lib/supabase/query-all.js')
  const panel = await import('../lib/panel/query-all.js')
  assert.equal(panel.selectAllRows, shared.selectAllRows)
  assert.equal(panel.selectRowsByIds, shared.selectRowsByIds)
})

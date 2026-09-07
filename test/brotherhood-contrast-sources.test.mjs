import assert from 'node:assert/strict'
import fs from 'node:fs'
import test from 'node:test'

function source(path) {
  return fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('los datos musicales sobre fondos claros usan tinta oscura independiente del color corporativo', () => {
  const css = source('components/BrotherhoodCurrentMusic.module.css')

  assert.match(css, /\.meta span:nth-child\(2\)[\s\S]*color: #17324a;/)
  assert.match(css, /:global\(\.step-current-data strong\)[\s\S]*color: #162d43;/)
  assert.match(css, /:global\(\.step-facts strong\)[\s\S]*color: #162d43;/)
})

test('Fuentes se presenta como disclosure compacto con contador', () => {
  const block = source('components/SourcesBlock.js')
  const css = source('components/SourcesBlock.module.css')

  assert.match(block, /<details className=\{styles\.disclosure\}>/)
  assert.match(block, /<summary className=\{styles\.summary\}>/)
  assert.match(block, /sources\.length === 1 \? 'fuente' : 'fuentes'/)
  assert.match(css, /\.disclosure\[open\] \.toggle/)
  assert.equal(block.includes('<details className={styles.disclosure} open'), false)
})


test('Fuentes pagina los catálogos y filtra los vínculos por entidad antes de cruzarlos', () => {
  const data = source('lib/panel/sources.js')

  assert.match(data, /const PAGE_SIZE = 1000/)
  assert.match(data, /async function fetchAllPages\(buildQuery, label\)/)
  assert.match(data, /\.range\(from, from \+ PAGE_SIZE - 1\)/)
  assert.match(data, /if \(entityId\) query = query\.eq\('entity_id', entityId\)/)
  assert.match(data, /\.order\('created_at', \{ ascending: false \}\)[\s\S]*\.order\('id', \{ ascending: false \}\)/)
})


test('los editores relacionales recorren todas las páginas de Fuentes y vínculos', () => {
  const data = source('lib/panel/relation-sources.js')

  assert.match(data, /const PAGE_SIZE = 1000/)
  assert.match(data, /async function fetchAllPages\(buildQuery, label\)/)
  assert.match(data, /await buildQuery\(\)\.range\(from, from \+ PAGE_SIZE - 1\)/)
  assert.match(data, /fetchAllPages\([\s\S]*\.from\('sources'\)[\s\S]*\.order\('name'\)[\s\S]*\.order\('id'\)/)
  assert.match(data, /fetchAllPages\([\s\S]*\.from\('source_links'\)[\s\S]*\.order\('created_at'\)[\s\S]*\.order\('id'\)/)
})

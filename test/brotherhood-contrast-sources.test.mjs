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

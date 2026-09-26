import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const page = readFileSync(new URL('../app/marchas/page.js', import.meta.url), 'utf8')

test('el directorio de marchas fuerza un orden alfabetico espanol estable', () => {
  assert.match(page, /new Intl\.Collator\('es'/)
  assert.match(page, /ignorePunctuation:\s*true/)
  assert.match(page, /numeric:\s*true/)
  assert.match(page, /\[\.\.\.marches\]\.sort\(compareMarchTitles\)/)
  assert.match(page, /marchTitleCollator\.compare\(initialA, initialB\)/)
})

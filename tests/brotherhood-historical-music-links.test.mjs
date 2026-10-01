import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'

const page = fs.readFileSync('app/hermandades/[slug]/page.js', 'utf8')

test('historical brotherhood music links to the published band when bandaSlug exists', () => {
  assert.match(page, /a\.bandaSlug \? <Link href=\{\`\/bandas\/\$\{a\.bandaSlug\}\`\}>/)
  assert.match(page, /publicText\(a\.banda\)/)
})

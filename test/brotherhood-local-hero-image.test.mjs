import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('Brotherhood hero serves local photos without Next image optimization', async () => {
  const hero = await read('components/BrotherhoodProgramHero.js')

  assert.match(hero, /String\(media\.photoSrc \|\| ''\)\.startsWith\('\/'\)/)
  assert.match(hero, /unoptimized=\{bypassImageOptimizer\}/)
  assert.match(hero, /isWikimediaUpload\(media\.photoSrc\)/)
})

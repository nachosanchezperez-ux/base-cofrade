import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('las carátulas de la discografía reintentan la fuente directa antes de mostrar reserva', () => {
  const section = read('components/bands/BandDiscographySection.js')
  const cover = read('components/bands/BandReleaseCover.js')

  assert.match(section, /<BandReleaseCover/)
  assert.match(cover, /^'use client'/)
  assert.match(cover, /unoptimized=\{useDirect\}/)
  assert.match(cover, /setDirectSrc\(src\)/)
  assert.match(cover, /setFailedSrc\(src\)/)
  assert.match(cover, /className=\{styles\.coverPlaceholder\}/)
  assert.match(cover, /role="img" aria-label=\{alt\}/)
})

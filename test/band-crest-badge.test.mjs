import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('los escudos SVG de las bandas se sirven sin el optimizador (que los rechaza)', () => {
  const badge = readFileSync(new URL('../components/BandCrestBadge.js', import.meta.url), 'utf8')
  assert.match(badge, /unoptimized=\{\/\\\.svg\(\\\?\|\$\)\/i\.test\(logoPath\)\}/)
})

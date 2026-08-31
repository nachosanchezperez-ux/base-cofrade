import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('Mairena usa el PNG transparente oficial sobre gris claro', () => {
  const migration = read('supabase/migrations/20260831141610_normalize_mairena_logo_and_readability.sql')
  const config = read('next.config.mjs')

  assert.match(migration, /ColorSinFondo-e1602318863442\.png/)
  assert.match(migration, /logo_background_color = '#EEF1F3'/)
  assert.match(config, /hostname: 'municipaldemairena\.com'/)
  assert.match(config, /pathname: '\/wp-content\/uploads\/\*\*'/)
})

test('Mairena no usa el blanco corporativo como tinta pública sobre blanco', () => {
  const migration = read('supabase/migrations/20260831141610_normalize_mairena_logo_and_readability.sql')

  assert.match(migration, /secondary_color = '#183B5B'/)
  assert.doesNotMatch(migration, /update public\.band_colors/)
})

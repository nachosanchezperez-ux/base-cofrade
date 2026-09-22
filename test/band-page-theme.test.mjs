import assert from 'node:assert/strict'
import test from 'node:test'

import { resolveBandPageTheme } from '../lib/bands/theme.js'

test('la paleta de Gerena usa burdeos como tono profundo y reserva el beige para superficies', () => {
  const theme = resolveBandPageTheme({
    primaryColor: '#7A263A',
    secondaryColor: '#E8DFC8',
    accentColor: '#B08D3C',
  })

  assert.equal(theme.primary, '#7A263A')
  assert.equal(theme.deep, '#7A263A')
  assert.equal(theme.accent, '#B08D3C')
  assert.equal(theme.soft, '#E8DFC8')
  assert.equal(theme.secondaryIsLight, true)
})

test('una secundaria oscura puede seguir actuando como tono profundo', () => {
  const theme = resolveBandPageTheme({
    primaryColor: '#A71930',
    secondaryColor: '#0D2949',
    accentColor: '#D4AF37',
  })

  assert.equal(theme.deep, '#0D2949')
  assert.equal(theme.soft, '#F6F4F7')
  assert.equal(theme.secondaryIsLight, false)
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../components/BrotherhoodOutingsSection.js', import.meta.url), 'utf8')

test('separa las extraordinarias anunciadas del histórico', () => {
  assert.match(source, /const state = normalized\(outing\?\.estado\)/)
  assert.match(source, /state === 'announced' && extraordinary\) return 'upcoming'/)
  assert.match(source, /title: 'Próximas extraordinarias'/)
  assert.match(source, /\['penitence', 'glory', 'upcoming', 'external', 'historical', 'other'\]/)
})

test('mantiene las extraordinarias celebradas en el histórico', () => {
  assert.match(source, /if \(extraordinary\) return 'historical'/)
  assert.match(source, /title: 'Histórico'/)
})

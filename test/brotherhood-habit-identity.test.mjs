import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('Túnica usa la identidad de la Hermandad sin perder contraste', () => {
  const layout = read('app/layout.js')
  const css = read('app/habit-identity.css')

  assert.match(layout, /habit-layout\.css[\s\S]*habit-identity\.css/)
  assert.match(css, /#tunica\.brotherhood-dark/)
  assert.match(css, /var\(--brotherhood-primary/)
  assert.match(css, /var\(--brotherhood-secondary/)
  assert.match(css, /color-mix\(in srgb/)
  assert.doesNotMatch(css, /linear-gradient\(145deg, #10263d/)
})

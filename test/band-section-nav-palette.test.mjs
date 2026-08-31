import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../app/bandas/bandas.module.css', import.meta.url), 'utf8')

test('el menu de todas las bandas hereda su paleta y no el azul generico', () => {
  const navigationRule = css.match(
    /\.bandPage\s+:global\(\.entity-section-nav\)\s*\{(?<rule>[\s\S]*?)\n\}/
  )?.groups?.rule

  assert.ok(navigationRule, 'falta la regla transversal del menu de Bandas')
  assert.match(navigationRule, /var\(--band-secondary\)/)
  assert.match(navigationRule, /var\(--band-primary\)/)
  assert.doesNotMatch(navigationRule, /#0d2949|#123a67|21\s*,\s*59\s*,\s*105/i)
  assert.match(css, /\.bandPage\s+:global\(\.entity-section-nav \.brotherhood-nav-label\)/)
  assert.match(css, /var\(--bc-red\)/)
})

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

test('el carril de glorias de la ficha de banda no desborda la página en móvil', () => {
  const css = readFileSync(new URL('../app/bandas/[slug]/band-detail-polish.module.css', import.meta.url), 'utf8')
  const mobile = css.slice(css.indexOf('@media (max-width: 680px)'))
  const block = mobile.match(/\.detailScope :global\(#glorias\) \{[^}]*\}/)?.[0] || ''
  assert.match(block, /overflow-x: clip;/)
})

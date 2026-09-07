import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('los listados de hermandades y bandas usan sus imágenes de identidad', async () => {
  const [brotherhoods, bands, mark, css] = await Promise.all([
    read('app/panel/(protected)/hermandades/page.js'),
    read('app/panel/(protected)/bandas/page.js'),
    read('components/panel/PanelEntityMark.js'),
    read('components/panel/PanelEntityMark.module.css'),
  ])

  assert.match(brotherhoods, /PanelEntityMark src=\{item\.crestPath\}/)
  assert.match(bands, /PanelEntityMark src=\{item\.logoPath\}/)
  assert.match(mark, /<img/)
  assert.match(mark, /loading="lazy"/)
  assert.match(css, /\.mark\s+\.image\s*\{[^}]*width:\s*100%;[^}]*height:\s*100%;[^}]*max-width:\s*100%;[^}]*max-height:\s*100%;[^}]*object-fit:\s*contain;/s)
  assert.match(css, /object-fit:\s*contain/)
  assert.match(css, /grid-template-columns:\s*60px/)
})

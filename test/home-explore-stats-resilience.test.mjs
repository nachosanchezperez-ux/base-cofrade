import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('las magnitudes de Home aíslan fallos parciales y no convierten error en cero', async () => {
  const loader = await read('lib/supabase/home-v2.js')

  assert.match(loader, /Promise\.allSettled/)
  assert.match(loader, /count: null/)
  assert.match(loader, /counts\.has\(item\.key\) \? counts\.get\(item\.key\) : null/)
  assert.match(loader, /result\.value\.error/)
})

test('la vista representa un dato no disponible con guion y texto accesible', async () => {
  const view = await read('components/HomeExploreV2.js')

  assert.match(view, /Number\.isFinite\(item\?\.count\)/)
  assert.match(view, /return hasCount\(item\) \? item\.count : '—'/)
  assert.match(view, /dato temporalmente no disponible/)
})

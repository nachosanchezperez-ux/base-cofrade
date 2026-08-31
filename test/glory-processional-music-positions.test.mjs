import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('las Glorias muestran los acompañamientos documentados aunque conserven su posición real', () => {
  const directory = read('lib/supabase/glory-directory.js')
  const page = read('app/procesiones-de-gloria/[slug]/page.js')

  assert.match(directory, /\['processional_music', 'procession', 'opening', 'behind_step'\]\.includes\(row\.type\)/)
  assert.match(page, /item\.processionalMusic\.length/)
  assert.match(page, /item\.processionalMusic\.map/)
})

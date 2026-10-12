import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { isProcessionalOutingMusic } from '../lib/outing-music-sections.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

test('las Glorias muestran los acompañamientos documentados aunque conserven su posición real', () => {
  // Códigos que la lista cerrada anterior ya admitía y códigos posicionales que se perdían.
  const previouslyShown = ['processional_music', 'procession', 'opening', 'behind_step', 'behind_glory']
  const previouslyHidden = ['after_step', 'cross_guide', 'opening_band', 'after_saint', 'head', 'tras_paso', 'after_procession']
  for (const code of [...previouslyShown, ...previouslyHidden]) assert.equal(isProcessionalOutingMusic(code), true, code)
  for (const code of ['liturgical_music', 'announcement_music', 'other']) assert.equal(isProcessionalOutingMusic(code), false, code)

  // La ficha usa el clasificador compartido y pinta la lista resultante.
  const directory = read('lib/supabase/glory-directory.js')
  const page = read('app/procesiones-de-gloria/[slug]/page.js')
  assert.match(directory, /processionalMusic: music\.filter\(\(row\) => isProcessionalOutingMusic\(row\.type\)\)/)
  assert.match(page, /item\.processionalMusic\.length/)
  assert.match(page, /item\.processionalMusic\.map/)
})

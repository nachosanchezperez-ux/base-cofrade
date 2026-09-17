import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('la invalidación musical refresca Marchas y Crucetas relacionadas', () => {
  const helper = read('lib/panel/revalidate-music.js')

  assert.match(helper, /from\('entities'\)/)
  assert.match(helper, /from\('musical_repertoire_entries'\)/)
  assert.match(helper, /from\('musical_repertoires'\)/)
  assert.match(helper, /revalidatePath\(`\/marchas\/\$\{entity\.slug\}`\)/)
  assert.match(helper, /revalidatePath\(`\/crucetas-musicales\/\$\{repertoire\.slug\}`\)/)
})

test('el editor de Marchas invalida las fichas musicales', () => {
  const actions = read('app/panel/(protected)/marchas/actions.js')

  assert.match(actions, /import \{ revalidateMarchPages \} from '@\/lib\/panel\/revalidate-music'/)
  assert.match(actions, /await revalidateMarchPages\(supabase, \[marchId\]\)/)
})

test('los estrenos de Bandas invalidan la Marcha actual y la anterior', () => {
  const actions = read('app/panel/(protected)/bandas/[id]/actions.js')

  assert.match(actions, /previousPremiere\?\.march_entity_id, marchEntityId/)
  assert.match(actions, /await revalidateMarchPages\(supabase, \[premiere\?\.march_entity_id\]\)/)
})

test('la discografía invalida las Marchas enlazadas incluso al cambiar o borrar una pista', () => {
  const actions = read('app/panel/(protected)/bandas/[id]/discografia/actions.js')

  assert.match(actions, /from\('band_release_tracks'\)\.select\('march_entity_id'\)/)
  assert.match(actions, /previousTrack\?\.march_entity_id, marchEntityId/)
  assert.match(actions, /refreshDiscography\(supabase, bandId, \[track\.march_entity_id\]\)/)
})

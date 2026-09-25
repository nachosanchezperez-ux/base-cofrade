import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8')

test('Bandas separa las salidas ordinarias de las extraordinarias por character', async () => {
  const source = await read('lib/supabase/bands.js')

  assert.match(source, /item\.character === 'ordinary'/)
  assert.match(source, /item\.character === 'extraordinary'/)
  assert.match(source, /ordinaryAccompaniments/)
    assert.match(source, /accompaniments: currentAccompaniments/)
  assert.match(source, /outings: band\.outings\.filter\(\(item\) => item\.character === 'extraordinary'\)/)
})

test('una salida ordinaria conserva la relación pública con hermandad y localidad', async () => {
  const source = await read('lib/supabase/bands.js')

  assert.match(source, /brotherhoodEntityId/)
  assert.match(source, /brotherhoodSlug: brotherhood\?\.slug/)
  assert.match(source, /isPublicEntityPageReady\(brotherhood, brotherhoodProfile\)/)
  assert.match(source, /municipalitySlug: outing\.municipalitySlug/)
  assert.match(source, /province: outing\.province/)
})

test('Bandas evita duplicar una salida ordinaria cuando ya existe un acompañamiento vigente equivalente', async () => {
  const source = await read('lib/supabase/bands.js')

  assert.match(source, /function sameAccompaniment/)
  assert.match(source, /currentAccompaniments\.some\(\(existing\) => sameAccompaniment\(existing, candidate\)\)/)
})

test('el núcleo anterior se conserva separado del adaptador público', async () => {
  const [adapter, core] = await Promise.all([
    read('lib/supabase/bands.js'),
    read('lib/supabase/bands-core.js'),
  ])

  assert.match(adapter, /getBandBySlug as getCoreBandBySlug/)
  assert.match(adapter, /export \{ getBandsDirectory, youtubeEmbedUrl \}/)
  assert.match(core, /async function loadBandRelations/)
  assert.match(core, /export async function getBandsDirectory/)
})


test('Bandas no vuelve a consultar outings ni municipios al reclasificar una salida ya cargada', async () => {
  const [adapter, core] = await Promise.all([
    read('lib/supabase/bands.js'),
    read('lib/supabase/bands-core.js'),
  ])

  const routingBlock = adapter.slice(
    adapter.indexOf('async function routeBandOutingsByCharacter'),
    adapter.indexOf('async function loadBandBySlug')
  )

  assert.doesNotMatch(routingBlock, /\.from\('outings'\)/)
  assert.doesNotMatch(routingBlock, /\.from\('municipalities'\)/)
  assert.match(core, /character: outing\.character/)
  assert.match(core, /brotherhoodEntityId: outing\.brotherhood_entity_id/)
  assert.match(core, /municipalitySlug: municipality\.slug/)
  assert.match(core, /province: municipality\.province/)
})

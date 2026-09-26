import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

function read(path) {
  return readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
}

test('Últimos hilos prioriza recencia y usa prioridad solo como desempate', () => {
  const source = read('lib/supabase/home.js')

  const start = source.indexOf('export async function getHomeDiscoveryThreads')
  const end = source.indexOf('export async function getUpcomingExtraordinaryOutings')
  const block = source.slice(start, end)

  assert.match(block, /\.order\('latest_at', \{ ascending: false \}\)/)
  assert.match(block, /\.order\('priority', \{ ascending: false \}\)/)
  assert.ok(
    block.indexOf(".order('latest_at'") < block.indexOf(".order('priority'"),
    'latest_at debe ordenar antes que priority'
  )
  assert.doesNotMatch(block, /\.gte\('priority'/)
  assert.doesNotMatch(block, /DISCOVERY_FAST_PATH_PRIORITY/)
})

test('el snapshot público cambia de versión para descartar la selección antigua', () => {
  const snapshot = read('lib/supabase/home-snapshot.js')
  assert.match(snapshot, /hilo-cofrade-home-public-snapshot-v18/)
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { AsyncLocalStorage } from 'node:async_hooks'
import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { buildHomeTemporalAgenda } from '../lib/home-temporal-agenda.js'
import { selectHomeUpcomingAgenda } from '../lib/home-upcoming-selection.js'
import { madridDateKey } from '../lib/home-clock.js'
import { getHomeEditorialFocus } from '../lib/home-editorial-focus.js'

// Ejecutamos el ensamblador real con Next Cache real y fuentes aisladas.
// No necesita servidor HTTP, credenciales ni escrituras en Supabase.
globalThis.AsyncLocalStorage ??= AsyncLocalStorage
const require = createRequire(import.meta.url)
const { unstable_cache } = require('next/cache')
const { IncrementalCache } = require('next/dist/server/lib/incremental-cache/index.js')
const { workAsyncStorage } = require('next/dist/server/app-render/work-async-storage.external.js')
const { nodeFs } = require('next/dist/server/lib/node-fs-methods.js')

test('datos HIT y STALE no congelan inicio, final ni medianoche; home-public invalida la lectura', async () => {
  const cache = new IncrementalCache({
    fs: nodeFs, dev: false, flushToDisk: false, serverDistDir: '/tmp/hc-clock-test',
    requestHeaders: {}, maxMemoryCacheSize: 1024 * 1024,
    fetchCacheKeyPrefix: 'home-clock-fixture',
    getPrerenderManifest: () => ({ version: 4, routes: {}, dynamicRoutes: {}, notFoundRoutes: [], preview: { previewModeId: 'fixture' } }),
  })
  const originalGet = cache.cacheHandler.get.bind(cache.cacheHandler)
  let expired = false
  cache.cacheHandler.get = async (...args) => {
    const entry = await originalGet(...args)
    return entry && expired ? { ...entry, lastModified: entry.lastModified - 61000 } : entry
  }
  let reads = 0
  let revision = 'original'
  const outing = { id: 'night', date: '2026-10-05', departureTime: '23:30', returnTime: '01:30', eventStatus: 'announced', isPast: true }
  const source = readFileSync(new URL('../lib/supabase/home-snapshot.js', import.meta.url), 'utf8')
    .replace(/^import .*\n/gm, '').replace('export async function', 'async function')
  const deps = {
    unstable_cache, buildHomeTemporalAgenda, selectHomeUpcomingAgenda, madridDateKey, getHomeEditorialFocus,
    getTodayHomeContentVisual: async () => { reads++; return { revision } },
    getHomeUpcomingAgendaCandidates: async () => [outing],
    getDiverseHomeDiscoveryThreads: async () => [],
    getHomeExploreStats: async () => ({ count: 1 }),
    enrichHomeDiscoveryThreadsVisual: async (items) => items,
    getOutingBriefing: async () => ({ schedule: ['documentado'], bands: ['banda'], places: [], liturgicalMusic: [] }),
    getAgendaCofrade: async (now) => ({ today: madridDateKey(now), items: [
      { ...outing, key: 'night', category: 'processions', startTime: '23:30', endTime: '01:30', isUpcoming: true },
      { id: 'devotion', key: 'devotion', category: 'devotions', date: '2026-10-06', isUpcoming: true },
    ] }),
  }
  const getHomeSnapshot = new Function(...Object.keys(deps), `${source}\nreturn getHomeSnapshot`)(...Object.values(deps))
  async function request(iso) {
    const store = { route: '/', page: '/', isStaticGeneration: false, incrementalCache: cache }
    const result = await workAsyncStorage.run(store, () => getHomeSnapshot(new Date(iso)))
    await Promise.all(Object.values(store.pendingRevalidates || {}))
    return result
  }
  const before = await request('2026-10-05T21:29:00Z')
  assert.equal(before.upcomingAgenda[0].liveState.state, 'today')
  const started = await request('2026-10-05T21:30:00Z')
  assert.equal(started.upcomingAgenda[0].liveState.state, 'live')
  assert.equal(started.homeTemporal.mode, 'live')
  assert.deepEqual(started.featuredBriefing.bands, ['banda'])
  assert.equal(reads, 1, 'dos peticiones comparten la lectura de datos')

  // Expira de verdad para Next, manteniendo los datos almacenados disponibles.
  expired = true
  const stale = await request('2026-10-05T21:31:00Z')
  assert.equal(stale.homeTemporal.mode, 'live')
  assert.equal(reads, 2, 'Next ejecutó la revalidación de la entrada vencida')
  expired = false
  const midnight = await request('2026-10-05T22:00:00Z')
  assert.equal(midnight.homeTemporal.today, '2026-10-06')
  assert.equal(midnight.upcomingAgenda[0].liveState.state, 'live', 'isPast diario no elimina una salida nocturna')
  assert.ok(midnight.homeTemporal.todayItems.some((item) => item.key === 'devotion'))
  assert.equal(reads, 3, 'la nueva jornada usa una clave distinta')
  const atEnd = await request('2026-10-05T23:30:00Z')
  assert.equal(atEnd.homeTemporal.mode, 'live')
  const finished = await request('2026-10-05T23:31:00Z')
  assert.equal(finished.upcomingAgenda.length, 0)
  assert.equal(finished.homeTemporal.liveItems.length, 0)
  assert.equal(reads, 3, 'el final se calcula sin repetir consultas')

  revision = 'editado'
  await cache.revalidateTag(['home-public'], { expire: 0 })
  const edited = await request('2026-10-05T23:32:00Z')
  assert.equal(edited.todayContent.revision, 'editado')
  assert.equal(reads, 4, 'la invalidación obliga a releer')
})

test('las salidas canceladas o celebradas no se reactivan por el reloj', () => {
  const base = { date: '2026-10-06', departureTime: '19:00', returnTime: '21:00' }
  assert.deepEqual(selectHomeUpcomingAgenda([
    { ...base, isCancelled: true }, { ...base, eventStatus: 'held' },
  ], 5, new Date('2026-10-06T18:00:00Z')), [])
})

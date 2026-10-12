import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { compareProcessionLiveItems, withProcessionLiveState } from '../lib/procession-live-status.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

// Ejecuta el cargador real de la Home con dependencias controladas, sin red.
function loadHomeAgenda(dependencies) {
  const source = read('lib/supabase/home-upcoming-agenda.js')
    .replace(/^import .*\n/gm, '')
    .replace(/^export /gm, '')
  const names = Object.keys(dependencies)
  return new Function(...names, `${source}\nreturn { getHomeAgendaCandidates, getHomeUpcomingAgenda }`)(
    ...Object.values(dependencies)
  )
}

const FUTURE = '2099-05-01'

function outing(id, date = FUTURE, extra = {}) {
  return { id, title: id, date, isCancelled: false, isPast: false, ...extra }
}

function fixture({ sourcesFail = false, general = [], glories = [], extraordinary = [] } = {}) {
  const calls = { sources: 0, glory: 0, general: 0, extraordinaryLimit: null }
  const module = loadHomeAgenda({
    getAgendaCofradeSources: async () => {
      calls.sources += 1
      if (sourcesFail) throw new Error('cache timeout')
      return { glories, generalOutings: general }
    },
    getGloryDirectory: async () => { calls.glory += 1; return glories },
    getGeneralPublicOutings: async () => { calls.general += 1; return general },
    getNavigableHomeExtraordinaryOutings: async (limit) => { calls.extraordinaryLimit = limit; return extraordinary },
    withProcessionLiveState,
    compareProcessionLiveItems,
    console: { error() {} },
  })
  return { ...module, calls }
}

test('la Home toma Glorias y procesiones generales de la caché de la Agenda, sin releerlas', async () => {
  const { getHomeAgendaCandidates, calls } = fixture({
    general: [outing('general-1')],
    glories: [outing('gloria-1')],
  })

  const items = await getHomeAgendaCandidates()

  assert.equal(calls.sources, 1)
  assert.equal(calls.glory, 0)
  assert.equal(calls.general, 0)
  assert.deepEqual(items.map((item) => item.id).sort(), ['general-1', 'gloria-1'])
})

test('si la caché de la Agenda falla, la Home conserva la lectura directa', async () => {
  const { getHomeAgendaCandidates, calls } = fixture({
    sourcesFail: true,
    general: [outing('general-1')],
    glories: [outing('gloria-1')],
  })

  const items = await getHomeAgendaCandidates()

  assert.equal(calls.glory, 1)
  assert.equal(calls.general, 1)
  assert.equal(items.length, 2)
})

test('la lista completa no se recorta: un foco editorial puede estar más allá de las 12 primeras', async () => {
  const general = Array.from({ length: 20 }, (_, index) => outing(
    `general-${String(index).padStart(2, '0')}`,
    `2099-05-${String(index + 1).padStart(2, '0')}`
  ))
  const { getHomeAgendaCandidates, getHomeUpcomingAgenda } = fixture({ general })

  const all = await getHomeAgendaCandidates({ extraordinaryLimit: 24 })
  const top = await getHomeUpcomingAgenda(12)

  assert.equal(all.length, 20)
  assert.equal(all.at(-1).id, 'general-19')
  assert.equal(top.length, 12)
  assert.deepEqual(top.map((item) => item.id), all.slice(0, 12).map((item) => item.id))
})

test('se mantienen los filtros: sin canceladas, pasadas ni salidas sin fecha', async () => {
  const { getHomeAgendaCandidates } = fixture({
    general: [
      outing('valida'),
      outing('cancelada', FUTURE, { isCancelled: true }),
      outing('pasada', FUTURE, { isPast: true }),
      outing('sin-fecha', ''),
    ],
  })

  const items = await getHomeAgendaCandidates()

  assert.deepEqual(items.map((item) => item.id), ['valida'])
  assert.equal(items[0].typeLabel, 'Procesión')
})

test('getHomeUpcomingAgenda conserva el límite de extraordinarias anterior', async () => {
  const { getHomeUpcomingAgenda, calls } = fixture()
  await getHomeUpcomingAgenda(12)
  assert.equal(calls.extraordinaryLimit, 24)
})


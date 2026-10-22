import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { selectAllRows, selectRowsByIds } from '../lib/supabase/query-all.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')

// Ejecuta el lector real de cultos con un cliente de Supabase simulado.
function loadReader(tables) {
  const source = read('lib/supabase/kissing-devotions.js').replace(/^import .*\n/gm, '').replace(/^export /gm, '')
  const calls = []
  const client = {
    from(table) {
      const state = { table, filters: [] }
      const builder = {
        select() { return builder },
        eq(column, value) { state.filters.push(['eq', column, value]); return builder },
        or(expression) { state.filters.push(['or', expression]); return builder },
        in(column, values) { state.filters.push(['in', column, values]); return builder },
        order() { return builder },
        range() { return builder },
        then(resolve) {
          calls.push(state)
          let rows = tables[table] || []
          for (const [kind, column, value] of state.filters) {
            if (kind === 'eq') rows = rows.filter((row) => row[column] === value)
            if (kind === 'in') rows = rows.filter((row) => value.includes(row[column]))
            if (kind === 'or') rows = rows.filter((row) => /besaman|besapi/i.test(row.cult_type))
          }
          return Promise.resolve({ data: rows, error: null }).then(resolve)
        },
      }
      return builder
    },
  }
  const reader = new Function('createPublicClient', 'console', 'selectAllRows', 'selectRowsByIds', `${source}\nreturn { getKissingDevotions }`)(() => client, { error() {} }, selectAllRows, selectRowsByIds)
  return { ...reader, calls }
}

const tables = {
  cults: [
    { id: 'c1', brotherhood_entity_id: 'b1', cult_type: 'Besamanos', title: 'Besamanos a la Virgen', status: 'published' },
    { id: 'c2', brotherhood_entity_id: 'b1', cult_type: 'Triduo', title: 'Triduo a la Virgen', status: 'published' },
    { id: 'c3', brotherhood_entity_id: 'b1', cult_type: 'Rosario público', title: 'Rosario', status: 'published' },
    { id: 'c4', brotherhood_entity_id: 'b1', cult_type: 'función principal', title: '', status: 'published' },
  ],
  cult_occurrences: [
    { id: 'o1', cult_id: 'c1', start_date: '2099-10-17', end_date: null, status: 'published', event_status: 'announced' },
    { id: 'o2', cult_id: 'c2', start_date: '2099-10-20', end_date: '2099-10-22', status: 'published', event_status: 'announced' },
    { id: 'o3', cult_id: 'c3', start_date: '2099-10-24', end_date: null, status: 'published', event_status: 'announced' },
    { id: 'o4', cult_id: 'c4', start_date: '2099-10-25', end_date: null, status: 'published', event_status: 'announced' },
  ],
  entities: [{ id: 'b1', name: 'Hermandad de Prueba', slug: 'prueba', entity_type: 'brotherhood', status: 'published' }],
  brotherhoods: [{ entity_id: 'b1', municipality_id: 'm1', crest_path: '' }],
  places: [],
  cult_occurrence_days: [],
  municipalities: [{ id: 'm1', name: 'Sevilla', province: 'Sevilla' }],
}

test('por defecto solo se leen besamanos y besapiés', async () => {
  const { getKissingDevotions } = loadReader(tables)
  const items = await getKissingDevotions({ throwOnError: true })
  assert.deepEqual(items.map((item) => item.devotionType), ['Besamanos'])
})

test('la Agenda recibe todos los cultos con fecha, sin repetir rosarios ya presentes como salida', async () => {
  const { getKissingDevotions } = loadReader(tables)
  const items = await getKissingDevotions({ throwOnError: true, allCults: true })
  assert.deepEqual(items.map((item) => [item.devotionType, item.title]), [
    ['Besamanos', 'Besamanos a la Virgen'],
    ['Triduo', 'Triduo a la Virgen'],
    ['Función principal', 'Función principal'],
  ])
  const triduo = items.find((item) => item.devotionType === 'Triduo')
  assert.equal(triduo.endDate, '2099-10-22')
  assert.equal(triduo.isUpcoming, true)
  assert.equal(triduo.detailHref, '/hermandades/prueba#cultos')
  assert.equal(triduo.isKissingDevotion, false)
})

test('la Agenda pide todos los cultos y renueva su caché', () => {
  const agenda = read('lib/supabase/agenda-cofrade.js')
  assert.match(agenda, /getKissingDevotions\(\{ throwOnError: true, allCults: true \}\)/)
  assert.match(agenda, /categoryName: 'Cultos y besamanos'/)
  assert.doesNotMatch(agenda, /hilo-cofrade-agenda-sources-v7-hc09/)
})

test('las consultas de cultos y horarios se dividen en lotes para no desbordar la URL', async () => {
  const count = 321
  const largeTables = {
    ...tables,
    cults: Array.from({ length: count }, (_, index) => ({
      id: `c-${String(index).padStart(3, '0')}`,
      brotherhood_entity_id: 'b1',
      cult_type: 'Triduo',
      title: `Triduo ${index}`,
      status: 'published',
    })),
    cult_occurrences: Array.from({ length: count }, (_, index) => ({
      id: `o-${String(index).padStart(3, '0')}`,
      cult_id: `c-${String(index).padStart(3, '0')}`,
      start_date: `2099-11-${String((index % 28) + 1).padStart(2, '0')}`,
      end_date: null,
      status: 'published',
      event_status: 'announced',
    })),
  }

  const { getKissingDevotions, calls } = loadReader(largeTables)
  const items = await getKissingDevotions({ throwOnError: true, allCults: true })

  assert.equal(items.length, count)

  const occurrenceCalls = calls.filter((call) => call.table === 'cult_occurrences')
  assert.equal(occurrenceCalls.length, 3)
  assert.ok(occurrenceCalls.every((call) => {
    const filter = call.filters.find(([kind, column]) => kind === 'in' && column === 'cult_id')
    return filter && filter[2].length <= 150
  }))

  const dayCalls = calls.filter((call) => call.table === 'cult_occurrence_days')
  assert.equal(dayCalls.length, 3)
  assert.ok(dayCalls.every((call) => {
    const filter = call.filters.find(([kind, column]) => kind === 'in' && column === 'cult_occurrence_id')
    return filter && filter[2].length <= 150
  }))
})

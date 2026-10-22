import test from 'node:test'
import assert from 'node:assert/strict'
import { registerHooks } from 'node:module'

// Ejecuta el cargador y la paginación reales, sin sesión ni acceso a producción.
const hooks = registerHooks({ resolve(specifier, context, nextResolve) {
  if (specifier === 'server-only') return { url: 'data:text/javascript,export {};', shortCircuit: true }
  if (specifier === '@/lib/supabase/server') return {
    url: 'data:text/javascript,export const createClient = async () => globalThis.quickActFormTest.client;',
    shortCircuit: true,
  }
  if (specifier === '@/lib/supabase/query-all') return {
    url: new URL('../lib/supabase/query-all.js', import.meta.url).href,
    shortCircuit: true,
  }
  return nextResolve(specifier, context)
} })
const { getQuickActFormData } = await import('../lib/panel/quick-act.js')
hooks.deregister()

function setup({ empty = false, failedTable = '' } = {}) {
  const tables = {
    entities: empty ? [] : [{ id: 'b', name: 'Nombre oficial', status: 'published' }],
    brotherhoods: empty ? [] : [{ entity_id: 'b', popular_name: 'El Olivo', municipality_id: 'm' }],
    municipalities: empty ? [] : [{ id: 'm', name: 'La Rinconada', province: 'Sevilla' }],
    places: empty ? [] : Array.from({ length: 1001 }, (_, i) => ({ id: `p${i}`, name: `Lugar ${i}`, municipality_id: 'm' })),
  }
  const ranges = []
  const client = { from(table) {
    const result = () => ({ data: failedTable === table ? null : tables[table], error: failedTable === table ? { message: 'lectura denegada' } : null })
    const query = {
      select() { return query }, eq() { return query }, neq() { return query }, order() { return query },
      range(start, end) {
        ranges.push({ table, start, end })
        const response = result()
        return Promise.resolve({ ...response, data: response.data?.slice(start, end + 1) ?? null })
      },
      then(resolve, reject) { return Promise.resolve(result()).then(resolve, reject) },
    }
    return query
  } }
  globalThis.quickActFormTest = { client }
  return { ranges }
}

test('entrega listas serializables al formulario y conserva los lugares después de la fila 1000', async () => {
  const { ranges } = setup()
  const data = await getQuickActFormData()
  assert.deepEqual(data.brotherhoods, [{ id: 'b', name: 'El Olivo', fullName: 'Nombre oficial', municipalityId: 'm', status: 'published' }])
  assert.equal(data.municipalities[0].name, 'La Rinconada')
  assert.equal(data.places.length, 1001)
  assert.equal(data.places.at(-1).id, 'p1000')
  assert.ok(ranges.some(row => row.table === 'places' && row.start === 1000))
  assert.deepEqual(JSON.parse(JSON.stringify(data)), data)
})

test('las consultas vacías entregan listas vacías', async () => {
  setup({ empty: true })
  assert.deepEqual(await getQuickActFormData(), { brotherhoods: [], municipalities: [], places: [] })
})

for (const [table, label] of [['entities', 'hermandades'], ['brotherhoods', 'datos de las hermandades'], ['municipalities', 'localidades'], ['places', 'lugares']]) {
  test(`explica el error al fallar la consulta de ${table}`, async () => {
    setup({ failedTable: table })
    await assert.rejects(getQuickActFormData(), new RegExp(`No se pudieron cargar (las |los )?${label}: lectura denegada`))
  })
}

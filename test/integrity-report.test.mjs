import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { INTEGRITY_TABLES, loadIntegritySnapshot, loadTableRows } from '../lib/integrity/snapshot.js'
import { integrityExitCode, renderIntegrityMarkdown } from '../lib/integrity/report.js'
import { runIntegrityChecks } from '../lib/integrity/index.js'
import { slugify } from '../lib/integrity/model.js'

// Cliente falso de supabase-js: solo implementa la cadena de lectura que usa el
// cargador. Si el código intentara insertar, actualizar o borrar, fallaría.
// `maxRows` simula el límite de filas por respuesta del servidor.
function fakeClient(tables, calls = [], { maxRows = Infinity } = {}) {
  return {
    from(table) {
      const state = { table }
      const chain = {
        select(columns) { state.columns = columns; return chain },
        order(column) { state.order = column; return chain },
        range(from, to) {
          calls.push({ ...state, from, to })
          const rows = tables[table]
          if (rows instanceof Error) return Promise.resolve({ data: null, error: rows })
          return Promise.resolve({ data: (rows || []).slice(from, Math.min(to + 1, from + maxRows)), error: null })
        },
      }
      return chain
    },
  }
}

test('el cargador pagina de 1.000 en 1.000 hasta recibir una página vacía', async () => {
  const calls = []
  const rows = Array.from({ length: 2005 }, (_, index) => ({ id: String(index).padStart(5, '0') }))
  const result = await loadTableRows(fakeClient({ entities: rows }, calls), 'entities', 'id')
  assert.equal(result.length, 2005)
  assert.deepEqual(calls.map((call) => [call.from, call.to]), [[0, 999], [1000, 1999], [2000, 2999], [2005, 3004]])
  assert.ok(calls.every((call) => call.order === 'id'), 'orden estable para paginar')
})

test('si el servidor limita las filas por debajo de 1.000, no se pierden datos', async () => {
  const rows = Array.from({ length: 1234 }, (_, index) => ({ id: String(index).padStart(5, '0') }))
  const result = await loadTableRows(fakeClient({ entities: rows }, [], { maxRows: 500 }), 'entities', 'id')
  assert.equal(result.length, 1234)
  assert.equal(new Set(result.map((row) => row.id)).size, 1234)
})

test('el cargador lee solo las columnas declaradas de cada tabla y propaga errores', async () => {
  const calls = []
  const snapshot = await loadIntegritySnapshot(fakeClient({}, calls), { mode: 'public', preservedPaths: new Set(['/a']) })
  assert.equal(snapshot.mode, 'public')
  assert.deepEqual(snapshot.preservedPaths, ['/a'])
  for (const [table, columns] of Object.entries(INTEGRITY_TABLES)) {
    assert.deepEqual(snapshot[table], [])
    assert.equal(calls.find((call) => call.table === table).columns, columns)
  }
  // brotherhoods no tiene columna id: se pagina por su clave primaria.
  assert.equal(calls.find((call) => call.table === 'brotherhoods').order, 'entity_id')
  assert.equal(calls.find((call) => call.table === 'outings').order, 'id')
  await assert.rejects(
    loadTableRows(fakeClient({ outings: new Error('permission denied') }), 'outings', 'id'),
    /No se pudo leer outings: permission denied/,
  )
})

test('las columnas de la instantánea cubren todo lo que usan las comprobaciones', () => {
  // Si una comprobación empieza a leer una columna nueva, debe añadirse aquí y en INTEGRITY_TABLES.
  const required = {
    municipalities: ['province'],
    brotherhoods: ['entity_id', 'municipality_id'],
    outings: ['brotherhood_entity_id', 'outing_type', 'character', 'outing_date', 'return_date', 'departure_time', 'return_time', 'year', 'event_status', 'organizer_name', 'slug', 'origin_place_id', 'origin_text', 'municipality_id'],
    music_accompaniment_periods: ['brotherhood_entity_id', 'band_entity_id', 'step_entity_id', 'position', 'outing_type', 'year_from', 'year_to', 'date_from', 'date_to', 'date_to_text', 'is_current', 'public_band_name'],
    outing_music_assignments: ['music_position_id', 'band_entity_id', 'band_name_text', 'segment_start_label', 'segment_end_label', 'participation_mode'],
  }
  for (const [table, columns] of Object.entries(required)) {
    const declared = INTEGRITY_TABLES[table].split(',').map((column) => column.trim())
    for (const column of columns) assert.ok(declared.includes(column), `${table}.${column}`)
  }
})

test('slugify coincide con el de glory-directory (URLs derivadas de Hermandad + fecha)', () => {
  const source = readFileSync(new URL('../lib/supabase/glory-directory.js', import.meta.url), 'utf8')
  const body = /function slugify\(value\) \{([\s\S]*?)\n\}/.exec(source)?.[1]
  assert.ok(body, 'no se encontró slugify en glory-directory.js')
  const original = new Function('value', body)
  for (const sample of ['asuncion-de-cantillana 2026-08-15', 'Nuestra Señora del Rocío · Sevilla-Sur', '  Ñandú ÁÉÍÓÚ  ', 'Procesión de Gloria-2026-09-19']) {
    assert.equal(slugify(sample), original(sample), sample)
  }
})

test('el informe Markdown resume por nivel, agrupa por comprobación y recorta tablas largas', () => {
  const entities = [{ id: 'img', entity_type: 'image', name: 'Cristo | con barra', slug: 'cristo', status: 'published' }]
  const steps = Array.from({ length: 3 }, (_, index) => ({ id: `s${index}`, entity_type: 'step', name: `Paso ${index}`, slug: `p${index}`, status: 'published' }))
  const image_steps = steps.flatMap((step) => [
    { id: `${step.id}-a`, image_entity_id: 'img', step_entity_id: step.id, status: 'published', date_to: null },
    { id: `${step.id}-b`, image_entity_id: 'img', step_entity_id: step.id, status: 'published', date_to: null },
  ])
  const result = runIntegrityChecks({ mode: 'public', entities: [...entities, ...steps], image_steps }, { today: '2026-10-12', generatedAt: '2026-10-12T00:00:00Z' })
  const markdown = renderIntegrityMarkdown(result, { maxRows: 2 })
  assert.match(markdown, /\| Error confirmado \| 3 \|/)
  assert.match(markdown, /### Relación vigente duplicada · Hermandades, imágenes y pasos \(3\)/)
  assert.match(markdown, /… y 1 más en el JSON completo\./)
  assert.match(markdown, /Cristo \\\| con barra/, 'escapa las barras para no romper la tabla')
  assert.match(markdown, /Comprobaciones no evaluadas/)
  assert.match(markdown, /Solo lectura/)
})

test('recorrido completo: cliente → instantánea → comprobaciones → informe (modo público)', async () => {
  const tables = {
    entities: [
      { id: 'cig', entity_type: 'brotherhood', name: 'Las Cigarreras', slug: 'cigarreras', status: 'published' },
      { id: 'vic', entity_type: 'image', name: 'María Santísima de la Victoria', slug: 'victoria', status: 'published' },
    ],
    outings: [
      { id: 'o1', brotherhood_entity_id: 'cig', outing_type: 'Estación de Penitencia', title: 'Jueves Santo', slug: null, outing_date: '2026-04-02', status: 'published', event_status: 'held', year: 2026, departure_time: '17:00:00', municipality_id: 'm', origin_place_id: 'p' },
      { id: 'o2', brotherhood_entity_id: 'cig', outing_type: 'Estación de Penitencia', title: 'Las Cigarreras 2026', slug: 'cigarreras-estacion-penitencia-2026', outing_date: '2026-04-02', status: 'published', event_status: 'held', year: 2026, departure_time: '17:00:00', municipality_id: 'm', origin_place_id: 'p' },
    ],
    outing_entities: [
      { id: 'oe1', outing_id: 'o1', entity_id: 'vic', role: 'processional_image' },
      { id: 'oe2', outing_id: 'o2', entity_id: 'vic', role: 'processional_image' },
    ],
  }
  const snapshot = await loadIntegritySnapshot(fakeClient(tables), {
    mode: 'public',
    preservedPaths: ['/extraordinarias/no-existe-2026'],
  })
  const result = runIntegrityChecks(snapshot, { today: '2026-10-12', generatedAt: '2026-10-12T05:47:00Z' })
  assert.equal(result.mode, 'public')
  assert.equal(result.seasonYear, 2026)
  assert.equal(result.counts.outings, 2)
  assert.deepEqual(result.issues.filter((issue) => issue.severity === 'error').map((issue) => issue.check).sort(), ['agenda.duplicate-outing', 'agenda.preserved-url-unresolved'])
  const markdown = renderIntegrityMarkdown(result)
  assert.match(markdown, /Salida duplicada/)
  assert.match(markdown, /\/extraordinarias\/no-existe-2026/)
  assert.match(markdown, /lectura pública/)
})

test('el script valida sus argumentos antes de leer nada', () => {
  const script = fileURLToPath(new URL('../scripts/integrity-audit.mjs', import.meta.url))
  const cases = [
    [['--mode=Full'], /Valor no válido para --mode/],
    [['--fail-on=siempre'], /Valor no válido para --fail-on/],
    [['--out'], /Falta el valor de --out/],
    [['--today=12/10/2026'], /AAAA-MM-DD/],
    [['--bogus'], /Argumento desconocido/],
  ]
  for (const [args, message] of cases) {
    const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', env: { PATH: process.env.PATH } })
    assert.equal(result.status, 2, args.join(' '))
    assert.match(result.stderr, message)
  }
  const missing = spawnSync(process.execPath, [script], { encoding: 'utf8', env: { PATH: process.env.PATH } })
  assert.equal(missing.status, 2)
  assert.match(missing.stderr, /Faltan credenciales para el modo public/)
})

test('código de salida: nunca falla por defecto; puede fallar por errores o avisos', () => {
  const result = { summary: { error: 0, warning: 2, incomplete: 5 } }
  assert.equal(integrityExitCode(result), 0)
  assert.equal(integrityExitCode(result, 'error'), 0)
  assert.equal(integrityExitCode(result, 'warning'), 1)
  assert.equal(integrityExitCode({ summary: { error: 1, warning: 0 } }, 'error'), 1)
  assert.throws(() => integrityExitCode(result, 'siempre'), /no válido/)
})

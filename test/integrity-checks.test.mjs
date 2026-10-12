import assert from 'node:assert/strict'
import test from 'node:test'
import { runIntegrityChecks, INTEGRITY_CHECKS } from '../lib/integrity/index.js'
import { easterSunday, madridToday, musicSeasonYear, normalizeTitle } from '../lib/integrity/model.js'

// Pruebas de comportamiento: cada comprobación se ejecuta sobre datos de ejemplo
// que reproducen casos reales de producción (12/10/2026), tanto los que deben
// avisar como los que NO deben avisar (falsos positivos descartados).

const TODAY = '2026-10-12'

function entity(id, entity_type, name, extra = {}) {
  return { id, entity_type, name, slug: extra.slug || id, status: extra.status || 'published' }
}

function snapshot(parts = {}) {
  return {
    mode: 'full',
    preservedPaths: [],
    entities: [],
    brotherhood_images: [],
    brotherhood_steps: [],
    image_steps: [],
    march_authors: [],
    entity_media: [],
    media_assets: [],
    music_accompaniment_periods: [],
    outings: [],
    outing_entities: [],
    outing_music_positions: [],
    outing_music_assignments: [],
    cults: [],
    municipalities: [],
    ...parts,
  }
}

function run(parts, options = {}) {
  return runIntegrityChecks(snapshot(parts), { today: TODAY, generatedAt: 'fijo', ...options })
}

function issuesOf(result, checkId) {
  return result.issues.filter((issue) => issue.check === checkId)
}

const rel = (id, a, b, extra = {}) => ({ id, status: 'published', date_to: null, relation_type: 'titular', ...a, ...b, ...extra })

// ---------------------------------------------------------------------------
// Hermandades, imágenes y pasos
// ---------------------------------------------------------------------------

test('relación Imagen ↔ Paso vigente duplicada (caso El Cachorro) es un error', () => {
  const result = run({
    entities: [entity('img', 'image', 'Santísimo Cristo de la Expiración'), entity('step', 'step', 'Paso del Cristo de la Expiración')],
    image_steps: [
      rel('r1', { image_entity_id: 'img' }, { step_entity_id: 'step' }, { relation_type: 'processes_on' }),
      rel('r2', { image_entity_id: 'img' }, { step_entity_id: 'step' }, { relation_type: 'processional' }),
      // Una relación cerrada con fecha no cuenta como duplicado vigente.
      rel('r3', { image_entity_id: 'img' }, { step_entity_id: 'step' }, { date_to: '2001-01-01' }),
    ],
  })
  const found = issuesOf(result, 'core.relation-duplicate')
  assert.equal(found.length, 1)
  assert.equal(found[0].severity, 'error')
  assert.match(found[0].reason, /2 veces/)
  assert.deepEqual(found[0].related.sort(), ['r1', 'r2'])
})

test('Imagen en un paso de otra Hermandad se detecta; sin Hermandad no es contradicción', () => {
  const entities = [
    entity('b1', 'brotherhood', 'Hermandad A'), entity('b2', 'brotherhood', 'Hermandad B'),
    entity('img', 'image', 'Virgen'), entity('lonely', 'image', 'Imagen sin Hermandad'), entity('step', 'step', 'Paso de B'),
  ]
  const result = run({
    entities,
    brotherhood_images: [rel('bi', { brotherhood_entity_id: 'b1' }, { image_entity_id: 'img' })],
    brotherhood_steps: [rel('bs', { brotherhood_entity_id: 'b2' }, { step_entity_id: 'step' })],
    image_steps: [
      rel('is1', { image_entity_id: 'img' }, { step_entity_id: 'step' }),
      rel('is2', { image_entity_id: 'lonely' }, { step_entity_id: 'step' }),
    ],
  })
  const found = issuesOf(result, 'core.image-step-brotherhood-mismatch')
  assert.equal(found.length, 1)
  assert.equal(found[0].entityId, 'img')
})

test('relación en borrador entre dos fichas publicadas (caso Montserrat) se revisa; si ya hay una publicada, no', () => {
  const result = run({
    entities: [
      entity('mont', 'brotherhood', 'Montserrat'), entity('palio', 'step', 'Paso de palio de Montserrat'),
      entity('sangre', 'image', 'María Santísima de la Sangre'), entity('palio2', 'step', 'Paso de palio de la Sangre'),
      entity('borrador', 'step', 'Paso en borrador', { status: 'draft' }),
    ],
    brotherhood_steps: [
      rel('pendiente', { brotherhood_entity_id: 'mont' }, { step_entity_id: 'palio' }, { status: 'draft' }),
      rel('a-borrador', { brotherhood_entity_id: 'mont' }, { step_entity_id: 'borrador' }, { status: 'draft' }),
    ],
    image_steps: [
      rel('pub', { image_entity_id: 'sangre' }, { step_entity_id: 'palio2' }),
      rel('rev', { image_entity_id: 'sangre' }, { step_entity_id: 'palio2' }, { status: 'review' }),
    ],
  })
  const found = issuesOf(result, 'core.relation-pending-between-published')
  assert.equal(found.length, 1)
  assert.equal(found[0].entityId, 'mont')
  assert.match(found[0].reason, /está en draft/)
})

test('compartir advocación no es duplicado; el mismo nombre dentro de una Hermandad sí se revisa', () => {
  const result = run({
    entities: [
      entity('b1', 'brotherhood', 'Hermandad A'), entity('b2', 'brotherhood', 'Hermandad B'),
      entity('i1', 'image', 'María Santísima de los Dolores'), entity('i2', 'image', 'María Santísima de los Dolores'),
      entity('i3', 'image', 'Maria Santisima de los Dolores'),
    ],
    brotherhood_images: [
      rel('a', { brotherhood_entity_id: 'b1' }, { image_entity_id: 'i1' }),
      rel('b', { brotherhood_entity_id: 'b2' }, { image_entity_id: 'i2' }),
      rel('c', { brotherhood_entity_id: 'b2' }, { image_entity_id: 'i3' }),
    ],
  })
  const found = issuesOf(result, 'core.possible-duplicate-in-brotherhood')
  assert.equal(found.length, 1, 'solo la Hermandad B tiene dos fichas con el mismo nombre')
  assert.equal(found[0].severity, 'warning')
  assert.deepEqual(found[0].related.sort(), ['i2', 'i3'])
})

test('Marcha duplicada: mismo título comparable y mismos autores; homónima de otro autor no', () => {
  assert.equal(normalizeTitle('Tú eres el orgullo de nuestro pueblo'), normalizeTitle('Tú eres orgullo nuestro pueblo'))
  const result = run({
    entities: [
      entity('m1', 'march', 'Tú eres el orgullo de nuestro pueblo', { slug: 'tu-eres-el-orgullo-de-nuestro-pueblo-pablo-ojeda' }),
      entity('m2', 'march', 'Tú eres el orgullo de nuestro pueblo', { slug: 'tu-eres-orgullo-nuestro-pueblo-pablo-ojeda' }),
      entity('m3', 'march', 'Amargura'), entity('m4', 'march', 'Amargura'),
    ],
    march_authors: [
      { march_entity_id: 'm1', agent_entity_id: 'ojeda', status: 'published' },
      { march_entity_id: 'm2', agent_entity_id: 'ojeda', status: 'published' },
      { march_entity_id: 'm3', agent_entity_id: 'font', status: 'published' },
      { march_entity_id: 'm4', agent_entity_id: 'otro', status: 'published' },
    ],
  })
  const found = issuesOf(result, 'core.march-possible-duplicate')
  assert.equal(found.length, 1)
  assert.deepEqual(found[0].related.sort(), ['m1', 'm2'])
})

test('portada que la web descarta: derechos pendientes es dato incompleto; tipo erróneo es aviso', () => {
  const result = run({
    entities: [entity('h1', 'heritage_asset', 'Banderín'), entity('s1', 'step', 'Paso')],
    entity_media: [
      { entity_id: 'h1', media_asset_id: 'm1', is_cover: true },
      { entity_id: 's1', media_asset_id: 'm2', is_cover: true },
    ],
    media_assets: [
      { id: 'm1', media_type: 'image', rights_status: 'pending', storage_path: 'a.jpg' },
      { id: 'm2', media_type: 'video', rights_status: 'owned', storage_path: 'b.mp4' },
    ],
  })
  const found = issuesOf(result, 'core.cover-hidden')
  assert.equal(found.length, 2)
  assert.equal(found.find((issue) => issue.entityId === 'h1').severity, 'incomplete')
  assert.equal(found.find((issue) => issue.entityId === 's1').severity, 'warning')
})

test('la falta de portada se resume por tipo, no ficha a ficha', () => {
  const result = run({
    entities: [entity('s1', 'step', 'Paso 1'), entity('s2', 'step', 'Paso 2'), entity('s3', 'step', 'Paso 3')],
    entity_media: [{ entity_id: 's1', media_asset_id: 'm', is_cover: true }],
  })
  const found = issuesOf(result, 'core.cover-coverage')
  assert.equal(found.length, 1)
  assert.equal(found[0].severity, 'incomplete')
  assert.match(found[0].reason, /2 de 3/)
})

// ---------------------------------------------------------------------------
// Bandas y acompañamientos
// ---------------------------------------------------------------------------

const period = (id, extra) => ({
  id,
  brotherhood_entity_id: 'bro',
  band_entity_id: 'band',
  step_entity_id: 'palio',
  position: 'Tras el paso de palio',
  outing_type: 'Martes Santo',
  year_from: null,
  year_to: null,
  date_from: null,
  date_to: null,
  date_to_text: null,
  is_current: false,
  status: 'published',
  public_band_name: 'Banda',
  ...extra,
})

const musicEntities = [
  entity('bro', 'brotherhood', 'Hermandad de San Esteban', { slug: 'san-esteban' }),
  entity('palio', 'step', 'Paso de palio'),
  entity('band', 'band', 'Las Cigarreras'),
  entity('band2', 'band', 'Santa Ana'),
]
const palioOfBrotherhood = [rel('bs', { brotherhood_entity_id: 'bro' }, { step_entity_id: 'palio' })]

test('misma banda en el mismo paso con periodos solapados y fin contradictorio (caso San Esteban)', () => {
  const result = run({
    entities: musicEntities,
    brotherhood_steps: palioOfBrotherhood,
    music_accompaniment_periods: [
      period('p1', { year_from: 2009, year_to: 2026 }),
      period('p2', { year_from: 2009, year_to: 2020 }),
      // Otra banda en el mismo paso: no es solape de la misma banda.
      period('p3', { band_entity_id: 'band2', year_from: 2027, public_band_name: 'Santa Ana' }),
    ],
  })
  const found = issuesOf(result, 'music.period-overlap-same-band')
  assert.equal(found.length, 1)
  assert.equal(found[0].severity, 'error')
  assert.match(found[0].reason, /fin es contradictorio/)
})

test('misma banda en el mismo paso: ida y regreso no se solapan; posiciones redactadas distinto sí (caso Valvanera)', () => {
  const result = run({
    entities: musicEntities,
    brotherhood_steps: palioOfBrotherhood,
    music_accompaniment_periods: [
      period('ida', { is_current: true, year_from: 2020, position: 'Tras el paso de palio en el recorrido de ida' }),
      period('regreso', { is_current: true, year_from: 2020, position: 'Tras el paso de palio en el regreso desde la Catedral' }),
      period('valvanera-a', { step_entity_id: 'palio', outing_type: 'Procesión de Gloria', is_current: true, year_from: 2014, position: 'Tras el paso' }),
      period('valvanera-b', { step_entity_id: 'palio', outing_type: 'Procesión de Gloria', is_current: true, year_from: 2026, year_to: 2026, position: 'Tras Nuestra Señora de Valvanera' }),
    ],
  })
  const found = issuesOf(result, 'music.period-overlap-same-band')
  assert.equal(found.length, 1)
  assert.deepEqual([found[0].entityId, ...found[0].related].sort(), ['valvanera-a', 'valvanera-b'])
})

test('dos bandas distintas vigentes en el mismo paso (ida y regreso) no son incidencia', () => {
  const result = run({
    entities: musicEntities,
    brotherhood_steps: palioOfBrotherhood,
    music_accompaniment_periods: [
      period('ida', { is_current: true, year_from: 2025, position: 'Tras el paso de palio' }),
      period('vuelta', { is_current: true, year_from: 2025, band_entity_id: 'band2', position: 'Tras el paso de palio, en el regreso' }),
    ],
  })
  assert.equal(issuesOf(result, 'music.period-overlap-same-band').length, 0)
  assert.equal(issuesOf(result, 'music.next-season-contradiction').length, 0)
})

test('alta de la próxima temporada ya marcada vigente se revisa; deja de avisar al empezar la temporada', () => {
  const parts = {
    entities: musicEntities,
    brotherhood_steps: palioOfBrotherhood,
    music_accompaniment_periods: [period('nueva', { band_entity_id: 'band2', year_from: 2027, is_current: true, public_band_name: 'Santa Ana' })],
  }
  const before = issuesOf(run(parts), 'music.period-current-before-start')
  assert.equal(before.length, 1)
  assert.equal(before[0].severity, 'warning')
  // Domingo de Ramos de 2027: 21 de marzo.
  assert.equal(issuesOf(run(parts, { today: '2027-03-21' }), 'music.period-current-before-start').length, 0)
})

test('vigente con fin ya pasado solo es error cuando la temporada ha cambiado', () => {
  const parts = {
    entities: musicEntities,
    brotherhood_steps: palioOfBrotherhood,
    music_accompaniment_periods: [
      period('acotado', { year_from: 2026, year_to: 2026, is_current: true }),
      // Vigente y abierto (sin año de fin): nunca es «terminado», ni siquiera con año nulo.
      period('abierto', { band_entity_id: 'band2', year_from: null, year_to: null, is_current: true }),
    ],
  }
  assert.equal(issuesOf(run(parts), 'music.period-current-but-ended').length, 0, 'en octubre de 2026 el periodo 2026 sigue vigente')
  const after = issuesOf(run(parts, { today: '2027-04-01' }), 'music.period-current-but-ended')
  assert.equal(after.length, 1)
  assert.equal(after[0].severity, 'error')
})

test('Música de la próxima temporada: banda anterior aún abierta en la misma posición es contradicción', () => {
  const result = run({
    entities: musicEntities,
    brotherhood_steps: palioOfBrotherhood,
    music_accompaniment_periods: [
      period('vieja', { is_current: true, year_from: 2009 }),
      period('nueva', { band_entity_id: 'band2', year_from: 2027, public_band_name: 'Santa Ana' }),
    ],
  })
  const found = issuesOf(result, 'music.next-season-contradiction')
  assert.equal(found.length, 1)
  assert.equal(found[0].severity, 'error')

  const closed = run({
    entities: musicEntities,
    brotherhood_steps: palioOfBrotherhood,
    music_accompaniment_periods: [
      period('vieja', { year_from: 2009, year_to: 2026 }),
      period('nueva', { band_entity_id: 'band2', year_from: 2027, public_band_name: 'Santa Ana' }),
    ],
  })
  assert.equal(issuesOf(closed, 'music.next-season-contradiction').length, 0)
})

test('Música de la próxima temporada: la misma banda que cerró el año anterior es continuidad, no cambio', () => {
  const result = run({
    entities: musicEntities,
    brotherhood_steps: palioOfBrotherhood,
    music_accompaniment_periods: [
      period('vieja', { year_from: 2009, year_to: 2026 }),
      period('nueva', { year_from: 2027 }),
    ],
  })
  const found = issuesOf(result, 'music.next-season-contradiction')
  assert.equal(found.length, 1)
  assert.equal(found[0].severity, 'warning')
})

test('banda en borrador con nombre público es dato incompleto; archivada con nombre histórico es correcta', () => {
  const result = run({
    entities: [...musicEntities, entity('draft', 'band', 'Banda de Jaén', { status: 'draft' }), entity('old', 'band', 'Banda antigua', { status: 'archived' })],
    brotherhood_steps: palioOfBrotherhood,
    music_accompaniment_periods: [
      period('p-draft', { band_entity_id: 'draft', public_band_name: 'Banda de Jaén', year_from: 2027 }),
      period('p-old', { band_entity_id: 'old', public_band_name: 'Banda antigua', year_from: 1990, year_to: 2000 }),
      period('p-blank', { band_entity_id: 'draft', public_band_name: '', year_from: 2027 }),
    ],
  })
  const incomplete = issuesOf(result, 'music.period-band-not-public')
  assert.equal(incomplete.length, 1)
  assert.equal(incomplete[0].entityId, 'draft')
  assert.equal(incomplete[0].severity, 'incomplete')
  const blank = issuesOf(result, 'music.period-band-without-name')
  assert.deepEqual(blank.map((issue) => issue.entityId), ['p-blank'])

  // Modo público: la archivada no llega en la instantánea (igual que una en borrador).
  // Su periodo histórico no debe confundirse con una banda pendiente de publicar.
  const publicResult = run({
    entities: musicEntities,
    brotherhood_steps: palioOfBrotherhood,
    music_accompaniment_periods: [period('p-old', { band_entity_id: 'old', public_band_name: 'Banda antigua', year_from: 1990, year_to: 2000 })],
  }, { mode: 'public' })
  assert.equal(issuesOf(publicResult, 'music.period-band-not-public').length, 0)
})

test('música de salida en un paso sin relación publicada: error con lectura completa, revisar en modo público', () => {
  const parts = {
    entities: [...musicEntities, entity('otro', 'step', 'Paso de otra Hermandad')],
    brotherhood_steps: palioOfBrotherhood,
    outings: [{ id: 'o1', status: 'published', brotherhood_entity_id: 'bro', outing_type: 'Estación de Penitencia', outing_date: '2026-03-31', title: 'Martes Santo' }],
    outing_music_positions: [{ id: 'pos', outing_id: 'o1', status: 'published', step_entity_id: 'otro', position_label: 'Tras el paso' }],
  }
  assert.equal(issuesOf(run(parts), 'music.outing-step-not-of-brotherhood')[0].severity, 'error')
  assert.equal(issuesOf(run(parts, { mode: 'public' }), 'music.outing-step-not-of-brotherhood')[0].severity, 'warning')
  const pending = run({ ...parts, brotherhood_steps: [...palioOfBrotherhood, rel('bs-draft', { brotherhood_entity_id: 'bro' }, { step_entity_id: 'otro' }, { status: 'draft' })] })
  const [issue] = issuesOf(pending, 'music.outing-step-not-of-brotherhood')
  assert.equal(issue.severity, 'warning')
  assert.match(issue.reason, /está en draft/)
})

test('acompañamiento en un paso que la Hermandad no muestra se revisa, con la causa concreta', () => {
  const result = run({
    entities: [...musicEntities, entity('orphan', 'step', 'Paso de misterio', { status: 'draft' }), entity('pendiente', 'step', 'Paso publicado')],
    brotherhood_steps: [...palioOfBrotherhood, rel('bs-draft', { brotherhood_entity_id: 'bro' }, { step_entity_id: 'pendiente' }, { status: 'draft' })],
    music_accompaniment_periods: [
      period('p-orphan', { step_entity_id: 'orphan', is_current: true }),
      period('p-pendiente', { step_entity_id: 'pendiente', is_current: true, band_entity_id: 'band2' }),
      period('p-ok', { is_current: true }),
    ],
  })
  const found = issuesOf(result, 'music.period-step-not-of-brotherhood')
  assert.deepEqual(found.map((issue) => issue.entityId).sort(), ['p-orphan', 'p-pendiente'])
  assert.match(found.find((issue) => issue.entityId === 'p-orphan').reason, /el paso está en draft/)
  assert.match(found.find((issue) => issue.entityId === 'p-pendiente').reason, /relación Hermandad ↔ Paso está en draft/)
})

test('histórico sin fin acreditado es dato incompleto; con texto de fin no avisa', () => {
  const result = run({
    entities: musicEntities,
    brotherhood_steps: palioOfBrotherhood,
    music_accompaniment_periods: [
      period('sin-fin', { year_from: 1995 }),
      period('con-texto', { year_from: 1990, date_to_text: 'Hasta mediados de los noventa' }),
      // Alta de Música 2027: no es vigente todavía, pero tampoco histórica.
      period('alta-2027', { band_entity_id: 'band2', year_from: 2027 }),
    ],
  })
  const found = issuesOf(result, 'music.period-historic-without-end')
  assert.deepEqual(found.map((issue) => issue.entityId), ['sin-fin'])
})

test('música de salida: misma banda en dos tramos es correcta; repetida en el mismo tramo es error', () => {
  const result = run({
    entities: [...musicEntities],
    outings: [{ id: 'o1', status: 'published', brotherhood_entity_id: 'bro', outing_type: 'Procesión', outing_date: '2026-10-04', title: 'Regla' }],
    outing_music_positions: [
      { id: 'pos-ida', outing_id: 'o1', status: 'published', position_code: 'processional_music', position_label: 'Ida' },
      { id: 'pos-vuelta', outing_id: 'o1', status: 'published', position_code: 'processional_music', position_label: 'Regreso' },
      { id: 'pos-dup', outing_id: 'o1', status: 'published', position_code: 'palio', position_label: 'Tras el palio' },
    ],
    outing_music_assignments: [
      { id: 'a1', music_position_id: 'pos-ida', band_entity_id: 'band', status: 'published', segment_start_label: 'Capilla', segment_end_label: 'Convento', participation_mode: 'segment' },
      { id: 'a2', music_position_id: 'pos-vuelta', band_entity_id: 'band', status: 'published', segment_start_label: 'Convento', segment_end_label: 'Capilla', participation_mode: 'segment' },
      { id: 'a3', music_position_id: 'pos-dup', band_entity_id: 'band2', status: 'published', participation_mode: 'full_route' },
      { id: 'a4', music_position_id: 'pos-dup', band_entity_id: 'band2', status: 'published', participation_mode: 'full_route' },
    ],
  })
  const found = issuesOf(result, 'music.outing-assignment-duplicate')
  assert.equal(found.length, 1)
  assert.deepEqual(found[0].related.sort(), ['a3', 'a4'])
})

test('posición sin banda: con nota documentada está resuelta; sin nota se revisa', () => {
  const result = run({
    outings: [{ id: 'o1', status: 'published', outing_type: 'Estación de Penitencia', outing_date: '2026-04-03', title: 'Silencio' }],
    outing_music_positions: [
      { id: 'silencio', outing_id: 'o1', status: 'published', position_code: 'mystery', position_label: 'Sin acompañamiento', notes: 'Posición resuelta sin Banda; no representa deuda editorial.' },
      { id: 'otro', outing_id: 'o1', status: 'published', position_code: 'other', position_label: 'Sin acompañamiento musical' },
      { id: 'vacia', outing_id: 'o1', status: 'published', position_code: 'palio', position_label: 'Tras el palio' },
    ],
  })
  const found = issuesOf(result, 'music.outing-position-empty')
  assert.deepEqual(found.map((issue) => issue.related[0]), ['vacia'])
})

// ---------------------------------------------------------------------------
// Agenda
// ---------------------------------------------------------------------------

const outing = (id, extra) => ({
  id,
  status: 'published',
  brotherhood_entity_id: 'cig',
  outing_type: 'Estación de Penitencia',
  outing_date: '2026-04-02',
  return_date: null,
  departure_time: '17:00:00',
  return_time: null,
  year: 2026,
  event_status: 'held',
  title: 'Estación de Penitencia',
  slug: null,
  organizer_name: null,
  municipality_id: 'sevilla',
  origin_place_id: 'templo',
  origin_text: null,
  ...extra,
})

test('salida duplicada (caso Cigarreras) es error; dos cortejos distintos (El Amor y La Borriquita) no', () => {
  const result = run({
    entities: [
      entity('cig', 'brotherhood', 'Las Cigarreras', { slug: 'cigarreras' }),
      entity('amor', 'brotherhood', 'El Amor', { slug: 'amor' }),
      entity('victoria', 'image', 'María Santísima de la Victoria'), entity('columna', 'image', 'Jesús Atado a la Columna'),
      entity('cristo-amor', 'image', 'Cristo del Amor'), entity('borriquita', 'image', 'Sagrada Entrada'),
    ],
    outings: [
      outing('cig-a'), outing('cig-b', { slug: 'cigarreras-estacion-penitencia-2026' }),
      outing('amor-a', { brotherhood_entity_id: 'amor', outing_date: '2026-03-29', title: 'El Amor' }),
      outing('amor-b', { brotherhood_entity_id: 'amor', outing_date: '2026-03-29', title: 'La Borriquita', outing_type: 'estación de penitencia' }),
      // Sin Hermandad: organizadores distintos, nunca se agrupan.
      outing('libre-1', { brotherhood_entity_id: null, outing_date: '2026-09-19', outing_type: 'Procesión de Gloria' }),
      outing('libre-2', { brotherhood_entity_id: null, outing_date: '2026-09-19', outing_type: 'Procesión de Gloria' }),
    ],
    outing_entities: [
      { outing_id: 'cig-a', entity_id: 'victoria', role: 'processional_image' },
      { outing_id: 'cig-a', entity_id: 'columna', role: 'processional_image' },
      { outing_id: 'cig-b', entity_id: 'victoria', role: 'processional_image' },
      { outing_id: 'amor-a', entity_id: 'cristo-amor', role: 'processional_image' },
      { outing_id: 'amor-b', entity_id: 'borriquita', role: 'processional_image' },
    ],
  })
  const found = issuesOf(result, 'agenda.duplicate-outing')
  assert.equal(found.length, 1)
  assert.equal(found[0].severity, 'error')
  assert.match(found[0].reason, /Victoria/)
  assert.ok(found[0].related.includes('cig-b'))
})

test('salidas del mismo día sin imágenes para distinguirlas se revisan, sin afirmar duplicado', () => {
  const result = run({
    entities: [entity('cig', 'brotherhood', 'Las Cigarreras')],
    outings: [outing('a'), outing('b')],
  })
  const found = issuesOf(result, 'agenda.duplicate-outing')
  assert.equal(found.length, 1)
  assert.equal(found[0].severity, 'warning')
})

test('URLs conservadas: cada familia resuelve con su propia regla (caso Moriles)', () => {
  const result = run({
    entities: [entity('asuncion', 'brotherhood', 'La Asunción de Cantillana', { slug: 'asuncion-de-cantillana' })],
    municipalities: [{ id: 'sevilla', province: 'Sevilla' }, { id: 'moriles', province: 'Córdoba' }],
    outings: [
      outing('gloria-directa', { brotherhood_entity_id: null, slug: 'gloria-humeros-2026', outing_type: 'Procesión de Gloria' }),
      outing('gloria-derivada', { brotherhood_entity_id: 'asuncion', outing_date: '2026-08-15', slug: null, outing_type: 'Procesión de Gloria' }),
      outing('rosario', { brotherhood_entity_id: null, slug: 'san-pablo-rosario-vespertino-2026', outing_type: 'Rosario Vespertino' }),
      outing('extra-sevilla', { brotherhood_entity_id: null, slug: 'gerena-sangre-2026', outing_type: 'Procesión', character: 'extraordinary', municipality_id: 'sevilla' }),
      outing('extra-cordoba', { brotherhood_entity_id: null, slug: 'nuestro-padre-jesus-preso-moriles-2026', outing_type: 'Procesión', character: 'extraordinary', municipality_id: 'moriles' }),
      outing('penitencia', { brotherhood_entity_id: null, slug: 'cigarreras-estacion-penitencia-2026', character: 'ordinary' }),
    ],
    preservedPaths: [
      '/procesiones-de-gloria/gloria-humeros-2026',
      '/procesiones-de-gloria/asuncion-de-cantillana-2026-08-15',
      '/agenda-cofrade/rosarios/san-pablo-rosario-vespertino-2026',
      '/extraordinarias/gerena-sangre-2026',
      '/extraordinarias/nuestro-padre-jesus-preso-moriles-2026',
      '/agenda-cofrade/rosarios/cigarreras-estacion-penitencia-2026',
      '/extraordinarias/salida-que-ya-no-existe-2026',
      '/agenda-cofrade/otra-ruta-no-gestionada',
    ],
  })
  const found = issuesOf(result, 'agenda.preserved-url-unresolved')
  assert.deepEqual(found.map((issue) => issue.entityId).sort(), [
    '/agenda-cofrade/rosarios/cigarreras-estacion-penitencia-2026',
    '/extraordinarias/nuestro-padre-jesus-preso-moriles-2026',
    '/extraordinarias/salida-que-ya-no-existe-2026',
  ])
  assert.ok(found.every((issue) => issue.severity === 'error'))
  assert.match(found.find((issue) => issue.entityId.includes('moriles')).reason, /provincia de Sevilla \(Córdoba\)/)
  assert.match(found.find((issue) => issue.entityId.includes('rosarios')).reason, /tipo «Estación de Penitencia»/)
})

test('el slug derivado de Hermandad + fecha solo vale para glorias', () => {
  const result = run({
    entities: [entity('cig', 'brotherhood', 'Las Cigarreras', { slug: 'cigarreras' })],
    outings: [outing('rosario-sin-slug', { outing_type: 'Rosario Vespertino', outing_date: '2026-09-26', slug: null })],
    preservedPaths: ['/agenda-cofrade/rosarios/cigarreras-2026-09-26'],
  })
  assert.equal(issuesOf(result, 'agenda.preserved-url-unresolved').length, 1)
})

test('salida de Hermandad no publicada: con nombre de organizador avisa; sin él es error (modo público)', () => {
  // En modo público la Hermandad en borrador no llega en la instantánea.
  const result = run({
    entities: [],
    outings: [
      outing('con-nombre', { brotherhood_entity_id: 'roda', organizer_name: 'Hermandad de los Dolores de La Roda', outing_date: '2026-11-02' }),
      outing('sin-nombre', { brotherhood_entity_id: 'otra', organizer_name: null, outing_date: '2026-11-03' }),
    ],
  }, { mode: 'public' })
  const found = issuesOf(result, 'agenda.outing-brotherhood-not-public')
  assert.equal(found.find((issue) => issue.entityId === 'con-nombre').severity, 'warning')
  assert.equal(found.find((issue) => issue.entityId === 'sin-nombre').severity, 'error')
})

test('salida sin Hermandad, organizador ni entidades se revisa; con organizador o imágenes no', () => {
  const result = run({
    entities: [entity('img', 'image', 'Aurora')],
    outings: [
      outing('huerfana', { brotherhood_entity_id: null }),
      outing('organizador', { brotherhood_entity_id: null, organizer_name: 'Parroquia' }),
      outing('con-imagen', { brotherhood_entity_id: null }),
    ],
    outing_entities: [{ outing_id: 'con-imagen', entity_id: 'img', role: 'processional_image' }],
  })
  assert.deepEqual(issuesOf(result, 'agenda.outing-without-organizer').map((issue) => issue.entityId), ['huerfana'])
})

test('fechas incoherentes: celebrada en el futuro, año distinto y regreso anterior', () => {
  const result = run({
    entities: [entity('cig', 'brotherhood', 'Las Cigarreras')],
    outings: [
      outing('futura', { outing_date: '2026-12-08', event_status: 'held', year: 2026 }),
      outing('anio', { outing_date: '2026-04-02', year: 2025, event_status: 'held', brotherhood_entity_id: null }),
      outing('regreso', { outing_date: '2026-04-02', return_date: '2026-04-01', brotherhood_entity_id: null }),
      // La Madrugá: regreso a mediodía del día siguiente sin return_date no es incoherente.
      outing('madruga', { outing_date: '2026-04-03', departure_time: '01:00:00', return_time: '14:00:00', brotherhood_entity_id: null }),
    ],
  })
  const ids = issuesOf(result, 'agenda.outing-dates-incoherent').map((issue) => issue.entityId).sort()
  assert.deepEqual(ids, ['anio', 'futura', 'regreso'])
})

test('próxima cita sin hora ni lugar es dato incompleto; las pasadas y canceladas no', () => {
  const result = run({
    entities: [entity('cig', 'brotherhood', 'Las Cigarreras')],
    outings: [
      outing('proxima', { outing_date: '2026-10-25', departure_time: null, origin_place_id: null, event_status: 'announced' }),
      outing('pasada', { outing_date: '2026-09-01', departure_time: null, brotherhood_entity_id: null }),
      outing('cancelada', { outing_date: '2026-10-26', departure_time: null, event_status: 'cancelled', brotherhood_entity_id: null }),
    ],
  })
  const found = issuesOf(result, 'agenda.upcoming-incomplete')
  assert.deepEqual(found.map((issue) => issue.entityId), ['proxima'])
  assert.match(found[0].reason, /hora de salida, lugar de salida/)
})

test('culto a una imagen sin relación con su Hermandad se revisa; vía paso de la Hermandad cuenta', () => {
  const result = run({
    entities: [
      entity('tri', 'brotherhood', 'Trinidad'), entity('bosco', 'image', 'San Juan Bosco'),
      entity('decreto', 'image', 'Sagrado Decreto'), entity('paso', 'step', 'Paso de misterio'),
    ],
    brotherhood_steps: [rel('bs', { brotherhood_entity_id: 'tri' }, { step_entity_id: 'paso' })],
    image_steps: [rel('is', { image_entity_id: 'decreto' }, { step_entity_id: 'paso' })],
    cults: [
      { id: 'c1', title: 'Eucaristía a San Juan Bosco', brotherhood_entity_id: 'tri', image_entity_id: 'bosco', status: 'published' },
      { id: 'c2', title: 'Quinario', brotherhood_entity_id: 'tri', image_entity_id: 'decreto', status: 'published' },
    ],
  })
  assert.deepEqual(issuesOf(result, 'agenda.cult-image-not-of-brotherhood').map((issue) => issue.entityId), ['c1'])
})

// ---------------------------------------------------------------------------
// Ejecución, modos y fechas
// ---------------------------------------------------------------------------

test('en modo público se omiten las comprobaciones que necesitan lectura completa', () => {
  const result = run({}, { mode: 'public' })
  const skipped = result.checks.filter((check) => check.status === 'skipped').map((check) => check.id).sort()
  assert.deepEqual(skipped, ['core.cover-hidden', 'core.relation-pending-between-published', 'core.relation-to-unpublished'])
  assert.equal(result.checks.length, INTEGRITY_CHECKS.length)
})

test('una comprobación que falla no detiene el informe', () => {
  const broken = { id: 'test.broken', area: 'core', severity: 'error', title: 'Rota', run() { throw new Error('fallo simulado') } }
  const fine = { id: 'test.fine', area: 'core', severity: 'warning', title: 'Bien', fix: 'x', run: () => [] }
  const result = run({}, { checks: [broken, fine] })
  assert.equal(result.checks[0].status, 'failed')
  assert.match(result.checks[0].note, /fallo simulado/)
  assert.equal(result.checks[1].status, 'ok')
})

test('cada incidencia trae tipo, entidad, identificador, motivo, gravedad y solución', () => {
  const result = run({
    entities: [entity('img', 'image', 'Cristo'), entity('step', 'step', 'Paso')],
    image_steps: [rel('r1', { image_entity_id: 'img' }, { step_entity_id: 'step' }), rel('r2', { image_entity_id: 'img' }, { step_entity_id: 'step' })],
  })
  const [issue] = result.issues
  for (const field of ['check', 'title', 'entityLabel', 'entityId', 'entityName', 'reason', 'severity', 'fix']) {
    assert.ok(issue[field], `falta ${field}`)
  }
  assert.equal(result.summary.error, 1)
})

test('los identificadores de comprobación son únicos y todas declaran solución', () => {
  const ids = INTEGRITY_CHECKS.map((check) => check.id)
  assert.equal(new Set(ids).size, ids.length)
  for (const check of INTEGRITY_CHECKS) {
    assert.ok(check.fix && check.title && ['core', 'music', 'agenda'].includes(check.area), check.id)
    assert.ok(['error', 'warning', 'incomplete'].includes(check.severity), check.id)
  }
})

test('temporada musical: cambia en el Domingo de Ramos', () => {
  assert.equal(easterSunday(2026), '2026-04-05')
  assert.equal(easterSunday(2027), '2027-03-28')
  assert.equal(musicSeasonYear('2026-10-12'), 2026)
  assert.equal(musicSeasonYear('2027-03-20'), 2026)
  assert.equal(musicSeasonYear('2027-03-21'), 2027)
})

test('la fecha de referencia es la de Madrid, no la del servidor', () => {
  assert.equal(madridToday(new Date('2026-10-12T22:30:00Z')), '2026-10-13')
  assert.equal(madridToday(new Date('2026-10-12T21:30:00Z')), '2026-10-12')
})

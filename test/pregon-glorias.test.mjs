import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import { buildPregonGlorias, parsePregonNotes, pregonYear } from '../lib/pregon-glorias.js'

const root = new URL('../', import.meta.url)
const read = (path) => readFile(new URL(path, root), 'utf8')

test('lee pregonero y presidencia en cualquier orden y quita el punto final', () => {
  assert.deepEqual(
    parsePregonNotes('Pregonero: Mario Daza Olaya · Presidencia: San José Obrero.'),
    { pregonero: 'Mario Daza Olaya', presidencia: 'San José Obrero' }
  )
  assert.deepEqual(
    parsePregonNotes('Presidencia: Nuestra Señora de la Candelaria Madre de Dios · Pregonera: María Milagros Ciudad Suárez.'),
    { pregonero: 'María Milagros Ciudad Suárez', presidencia: 'Nuestra Señora de la Candelaria Madre de Dios' }
  )
  assert.deepEqual(
    parsePregonNotes('Pregonero: Juan Foronda Blasco · El archivo oficial no consigna imagen presidente.'),
    { pregonero: 'Juan Foronda Blasco', presidencia: '' }
  )
  // Los nombres con coma (S.J.) no se parten.
  assert.equal(parsePregonNotes('Pregonero: Carlos Muñiz Romero, S.J. · Presidencia: Virgen Esperanza, Divina Enfermera').presidencia, 'Virgen Esperanza, Divina Enfermera')
})

test('toma el año del texto aunque falte la fecha exacta', () => {
  assert.equal(pregonYear({ event_date_text: '1974', event_date: null }), 1974)
  assert.equal(pregonYear({ event_date_text: '', event_date: '2025-05-02' }), 2025)
  assert.equal(pregonYear({}), null)
})

const brotherhoods = new Map([
  ['aguas-falsa', { slug: 'las-aguas-sevilla', name: 'Las Aguas' }],
  ['torreblanca', { slug: 'inmaculado-corazon-maria-torreblanca', name: 'Inmaculado Corazón de María de Torreblanca' }],
  ['todos-santos', { slug: 'reina-todos-santos-sevilla', name: 'Reina de Todos los Santos' }],
])

const rows = [
  { entity_id: 'a', event_date_text: '2027', event_status: 'announced', public_notes: 'Pregonero: Manuel Lamprea Ramírez · Presidencia: Inmaculado Corazón de María de Torreblanca.', brotherhood_entity_id: 'torreblanca' },
  { entity_id: 'b', event_date_text: '1998', event_date: '1998-06-05', event_status: 'held', location_text: 'Santa Iglesia Catedral', public_notes: 'Pregonero: Tomás del Rey Tirado · Presidencia: Virgen de Todos los Santos', brotherhood_entity_id: 'todos-santos' },
  { entity_id: 'c', event_date_text: '1978', event_date: '1978-05-07', event_status: 'held', public_notes: 'Pregonero: Engelberto Salazar Martínez · Presidencia: Virgen de Todos los Santos', brotherhood_entity_id: 'todos-santos' },
  { entity_id: 'd', event_date_text: '1969', event_status: 'held', public_notes: 'Pregonero: F. Sánchez-Apellaniz · Presidencia: Virgen de las Aguas', brotherhood_entity_id: null },
  { entity_id: 'e', event_date_text: '1968', event_status: 'held', public_notes: 'Pregonero: J. L. de Rosa · Presidencia: Virgen de las Aguas', brotherhood_entity_id: null },
  { entity_id: 'f', event_date_text: '1990', event_status: 'held', public_notes: 'Pregonero: Juan Foronda Blasco · El archivo oficial no consigna imagen presidente.', brotherhood_entity_id: null },
  { entity_id: 'g', event_date_text: '1987', event_status: 'held', public_notes: 'Pregonero: Bará · Presidencia: Virgen de la Salud', brotherhood_entity_id: 'borrador-no-publicada' },
]

test('separa el próximo pregón y ordena la cronología de más reciente a más antiguo', () => {
  const data = buildPregonGlorias(rows, brotherhoods)
  assert.equal(data.next.year, 2027)
  assert.equal(data.next.brotherhood.href, '/hermandades/inmaculado-corazon-maria-torreblanca')
  assert.deepEqual(data.held.map((item) => item.year), [1998, 1990, 1987, 1978, 1969, 1968])
  assert.deepEqual(data.decades.map((bucket) => bucket.label), ['Década de 1990', 'Década de 1980', 'Década de 1970', 'Década de 1960'])
  assert.equal(data.stats.heldCount, 6)
  assert.equal(data.stats.firstYear, 1968)
  assert.equal(data.held[0].dateLabel, '5 de junio')
})

test('agrupa por hermandad enlazada y, sin ficha, por la denominación del archivo', () => {
  const { presidencies } = buildPregonGlorias(rows, brotherhoods)
  const byName = new Map(presidencies.map((group) => [group.name, group]))

  assert.equal(byName.get('Reina de Todos los Santos').count, 2)
  assert.deepEqual(byName.get('Reina de Todos los Santos').years.map((entry) => entry.year), [1978, 1998])

  // La Virgen de las Aguas del Salvador no se confunde con la ficha de Las Aguas.
  const aguas = byName.get('Virgen de las Aguas')
  assert.equal(aguas.count, 2)
  assert.equal(aguas.href, '')

  // Una hermandad enlazada pero no publicada se muestra por su denominación, sin enlace.
  assert.equal(byName.get('Virgen de la Salud').href, '')
  // Los años sin imagen consignada no generan grupo.
  assert.equal(presidencies.some((group) => group.name === ''), false)
  // Una designación futura no es una presidencia celebrada.
  assert.equal(byName.has('Inmaculado Corazón de María de Torreblanca'), false)
  assert.equal(buildPregonGlorias([rows[0]], brotherhoods).stats.corporationCount, 0)
  assert.equal(buildPregonGlorias([rows[0]], brotherhoods).next.year, 2027)
})

test('la página está enlazada desde Glorias y en el sitemap', async () => {
  const [gloria, sitemap, page] = await Promise.all([
    read('app/hermandades/gloria/page.js'),
    read('app/sitemap.js'),
    read('app/pregon-de-las-glorias/page.js'),
  ])
  assert.match(gloria, /PREGON_GLORIAS_PATH/)
  assert.match(sitemap, /\/pregon-de-las-glorias/)
  assert.match(page, /Hermandades que lo han presidido/)
  assert.match(page, /canonical: PREGON_GLORIAS_PATH/)
})

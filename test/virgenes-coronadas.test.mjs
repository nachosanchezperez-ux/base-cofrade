import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

import {
  buildVirgenesCoronadas,
  classifyCoronation,
  coronationDateLabel,
  coronationYear,
} from '../lib/virgenes-coronadas.js'

const root = new URL('../', import.meta.url)
const read = (path) => readFile(new URL(path, root), 'utf8')

test('clasifica los tipos de coronación cargados hoy, con o sin mayúsculas', () => {
  assert.equal(classifyCoronation({ event_type: 'Coronación Canónica' }).key, 'canonica')
  assert.equal(classifyCoronation({ event_type: 'Coronación canónica' }).key, 'canonica')
  assert.equal(classifyCoronation({ event_type: 'Coronación pontificia' }).key, 'pontificia')
  assert.equal(classifyCoronation({ event_type: 'Coronación litúrgica' }).key, 'liturgica')
  assert.equal(classifyCoronation({ event_type: 'Reconocimiento canónico de coronación' }).key, 'reconocimiento')
  // Tipo genérico: decide el nombre del acontecimiento.
  assert.equal(classifyCoronation({ event_type: 'Coronación', name: 'Imposición de la corona de María Santísima de la Caridad' }).key, 'liturgica')
  assert.equal(classifyCoronation({ event_type: 'Coronación', name: 'Reconocimiento canónico de la coronación de María Santísima de la Caridad' }).key, 'reconocimiento')
  assert.equal(classifyCoronation({ event_type: 'Coronación', name: 'Coronación Canónica de Nuestra Señora del Amparo' }).key, 'canonica')
  assert.equal(classifyCoronation({ event_type: 'Coronación canónica', name: 'Coronación pontificia de la Virgen del Castillo de Lebrija' }).key, 'pontificia')
})

test('no cuenta como coronación un breve, un expediente o el inicio del proceso', () => {
  assert.equal(classifyCoronation({ event_type: 'Coronación', name: 'Breve Pontificio para la Coronación Canónica' }), null)
  assert.equal(classifyCoronation({ event_type: 'Coronación canónica', name: 'Inicio del proceso de coronación canónica de la Virgen de la Piedad' }), null)
  assert.equal(classifyCoronation({ event_type: 'Hito histórico', name: 'Coronación de la Virgen' }), null)
})

test('fecha legible sin inventar el día cuando solo consta el año', () => {
  assert.equal(coronationDateLabel({ event_date: '1964-05-31', event_date_text: '31 de mayo de 1964' }), '31 de mayo de 1964')
  assert.equal(coronationDateLabel({ event_date: null, event_date_text: '2005' }), '2005')
  assert.equal(coronationDateLabel({ event_date: '2006-01-01', event_date_text: '2006' }), '2006')
  assert.equal(coronationYear({ event_date: null, event_date_text: 'Agosto de 2011' }), 2011)
})

const images = new Map([
  ['mercedes', { name: 'Nuestra Señora de las Mercedes Coronada', slug: 'mercedes-genoveva', cover: null }],
  ['macarena', { name: 'María Santísima de la Esperanza Macarena', slug: 'esperanza-macarena', cover: { path: 'https://x.supabase.co/m.jpg' } }],
  ['amparo', { name: 'Nuestra Señora del Amparo', slug: 'amparo', cover: null }],
  ['valle', { name: 'Nuestra Señora del Valle Coronada', slug: 'valle-ecija', cover: null }],
  ['utrera', { name: 'Nuestra Señora de las Angustias', slug: 'angustias-utrera', cover: null }],
  ['olivares', { name: 'Santa María de las Nieves', slug: 'nieves-olivares', published: false, cover: null }],
])
const brotherhoods = new Map([
  ['b-genoveva', { name: 'Santa Genoveva', slug: 'santa-genoveva', municipalityId: 'sev', crest: '/escudos/sg.png', palette: { primario: '#2a3d6b', oscuro: '#161f38' }, cover: null }],
  ['b-macarena', { name: 'La Macarena', slug: 'macarena', municipalityId: 'sev', crest: '', palette: null, cover: null }],
  ['b-amparo', { name: 'El Amparo', slug: 'amparo-sevilla', municipalityId: 'sev', crest: '', palette: null, cover: null }],
  ['b-valle', { name: 'Virgen del Valle de Écija', slug: 'valle', municipalityId: 'eci', crest: '', palette: null, cover: null }],
])
const agents = new Map([
  ['bueno', { id: 'bueno', name: 'José María Bueno Monreal', slug: 'jose-maria-bueno-monreal', published: true }],
  ['amigo', { id: 'amigo', name: 'Carlos Amigo Vallejo', slug: 'carlos-amigo-vallejo', published: true }],
  ['saiz', { id: 'saiz', name: 'José Ángel Saiz Meneses', slug: 'jose-angel-saiz-meneses', published: false }],
])
const municipalities = new Map([['sev', 'Sevilla'], ['eci', 'Écija']])

const events = [
  { entity_id: 'e1', name: 'Coronación litúrgica de las Mercedes', event_type: 'Coronación litúrgica', event_date: '1972-09-23', event_date_text: '23 de septiembre de 1972', event_status: 'held', brotherhood_entity_id: 'b-genoveva' },
  { entity_id: 'e2', name: 'Reconocimiento canónico', event_type: 'Reconocimiento canónico de coronación', event_date: '1997-08-15', event_date_text: '15 de agosto de 1997', event_status: 'held', brotherhood_entity_id: 'b-genoveva' },
  { entity_id: 'e3', name: 'Coronación canónica de la Esperanza Macarena', event_type: 'Coronación canónica', event_date: '1964-05-31', event_date_text: '31 de mayo de 1964', event_status: 'held', brotherhood_entity_id: 'b-macarena' },
  { entity_id: 'e4', name: 'Coronación Canónica de Nuestra Señora del Amparo', event_type: 'Coronación canónica', event_date: '2026-11-08', event_status: 'announced', brotherhood_entity_id: 'b-amparo' },
  { entity_id: 'e5', name: 'Coronación Canónica de Nuestra Señora del Valle', event_type: 'Coronación Canónica', event_date: '1999-09-08', event_status: 'held', brotherhood_entity_id: 'b-valle', municipality_id: 'eci' },
  { entity_id: 'e6', name: 'Breve Pontificio para la Coronación Canónica', event_type: 'Coronación', event_date: '1970-11-15', event_status: 'held', brotherhood_entity_id: 'b-valle' },
  { entity_id: 'e8', name: 'Coronación canónica de las Angustias', event_type: 'Coronación canónica', event_date: '2026-10-03', event_status: 'announced', brotherhood_entity_id: 'b-valle' },
  { entity_id: 'e9', name: 'Coronación canónica de las Nieves', event_type: 'Coronación canónica', event_date: '2028-04-29', event_status: 'announced', brotherhood_entity_id: 'b-valle' },
  { entity_id: 'e7', name: 'Coronación sin imagen enlazada', event_type: 'Coronación canónica', event_date: '2001-01-01', event_status: 'held' },
]
const links = new Map([
  ['e1', { imageId: 'mercedes', officiants: [{ id: 'bueno' }] }],
  ['e2', { imageId: 'mercedes', officiants: [{ id: 'amigo' }] }],
  ['e3', { imageId: 'macarena', officiants: [{ id: 'bueno' }] }],
  ['e4', { imageId: 'amparo', officiants: [{ id: 'saiz' }] }],
  ['e5', { imageId: 'valle', officiants: [{ id: 'amigo' }] }],
  ['e6', { imageId: 'valle', officiants: [] }],
  ['e8', { imageId: 'utrera', officiants: [{ id: 'saiz' }] }],
  ['e9', { imageId: 'olivares', officiants: [{ id: 'saiz' }] }],
])

const result = buildVirgenesCoronadas({ events, links, images, brotherhoods, agents, municipalities, today: '2026-11-07' })

test('agrupa por imagen: litúrgica y reconocimiento canónico en la misma tarjeta', () => {
  const mercedes = result.crowned.find((item) => item.id === 'mercedes')
  assert.deepEqual(mercedes.acts.map((act) => act.kind), ['liturgica', 'reconocimiento'])
  assert.equal(mercedes.kindLabel, 'Canónica')
  assert.equal(mercedes.year, 1997)
  assert.deepEqual(mercedes.officiants.map((officiant) => officiant.name), ['José María Bueno Monreal', 'Carlos Amigo Vallejo'])
  assert.equal(mercedes.officiants[0].href, '/autores/jose-maria-bueno-monreal')
  assert.equal(mercedes.crest, '/escudos/sg.png')
  assert.equal(mercedes.brotherhood.href, '/hermandades/santa-genoveva')
})

test('el breve no suma un acto y lo que no tiene imagen no aparece', () => {
  const valle = result.crowned.find((item) => item.id === 'valle')
  assert.equal(valle.acts.length, 1)
  assert.equal(valle.municipality, 'Écija')
  assert.equal(result.crowned.filter((item) => item.acts.every((act) => act.status === 'held')).length, 3)
})

test('la coronación anunciada va aparte y su prelado sin ficha publicada no enlaza', () => {
  assert.deepEqual(result.upcoming.map((item) => item.id), ['amparo', 'olivares'])
  assert.equal(result.upcoming[0].acts[0].officiants[0].href, '')
  assert.ok(!result.crowned.some((item) => item.id === 'amparo'))
})

test('ordena de la más reciente a la primera y prepara filtros y cifras', () => {
  assert.deepEqual(result.crowned.map((item) => item.id), ['utrera', 'valle', 'mercedes', 'macarena'])
  assert.deepEqual(result.filters.municipalities.map((option) => option.value), ['Sevilla', 'Écija'])
  assert.equal(result.filters.officiants[0].name, 'Carlos Amigo Vallejo')
  assert.equal(result.filters.officiants[0].count, 2)
  assert.deepEqual(result.stats, { count: 4, municipalityCount: 2, firstYear: 1964, lastYear: 2026 })
})

test('la página está en el sitemap y enlazada desde el directorio de imágenes', async () => {
  const [sitemap, images, page] = await Promise.all([
    read('app/sitemap.js'),
    read('app/imagenes/page.js'),
    read('app/virgenes-coronadas/page.js'),
  ])
  assert.match(sitemap, /absoluteUrl\('\/virgenes-coronadas'\)/)
  assert.match(images, /href="\/virgenes-coronadas"/)
  assert.match(page, /alternates: \{ canonical: VIRGENES_CORONADAS_PATH \}/)
})

test('anunciada con fecha pasada y sin confirmar: no se da por hecha ni sale como próxima', () => {
  const utrera = result.crowned.find((item) => item.id === 'utrera')
  assert.equal(utrera.acts[0].status, 'unconfirmed')
  assert.equal(utrera.isUpcoming, false)
})

test('una imagen con la ficha en revisión se muestra sin enlace', () => {
  const olivares = result.upcoming.find((item) => item.id === 'olivares')
  assert.equal(olivares.href, '')
  assert.equal(olivares.year, 2028)
  assert.equal(olivares.acts[0].status, 'upcoming')
})

import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'

const MUNICIPALITY = 'ca85889c-21fe-4367-8477-a57656b25da4'
const ACCESS_DATE = '2026-09-15'
const IMPORT_ID = 'c0160022-0000-4000-8000-000000000001'

const known = {
  cena: 'c1000000-0000-0000-0000-000000000002',
  cabeza: '2e5a02f7-7d7c-4488-a6a3-042d4bd104b6',
  lanzada: '48ee9020-71ed-473e-8693-34809f2d083c',
  madreDios: 'b277068e-92e4-425d-8768-bff9e58ff1c9',
  aguas: 'dc7f2757-ed02-4cd6-a0e0-ef112d5b6515',
  guadalupe: 'd53478f8-3826-4bc8-a264-39ce3b8171da',
  nieves: '55087e87-9fe7-4f8b-9a01-0fe8c3142751',
  macarena: '9da8a301-5014-4783-b143-88261934f22b',
  sol: '417a2bc3-0396-435f-af3f-44e2cb711c86',
  encarnacionImage: 'd1e0cb83-08ba-4d09-a587-cbfd0a84e83b',
  encarnacionStep: '07d320cc-c9e9-4370-8130-c3ae84986f36',
  madreDiosStep: 'c0b75902-aa22-4160-b198-0f1c18df2b72',
  nievesImage: '139d4b54-b798-4e5d-bdb4-3de2426754fa',
  nievesStep: '5fc72577-38c9-4deb-8ef1-b13ffaf8c84b',
  rosarioMacarenaImage: '1b3800c9-130f-4534-92ad-2a0a7b999d3a',
  saludSolImage: '7dcf7dd3-763a-4a35-80f7-f332afd261b7',
  saludSolStep: '76dba4ef-5d3e-47c7-b7de-d804e7d47717',
  nievesCouncilSource: '5e642696-c66a-482f-9e3c-8e6d19ad423c',
}

function uuid(key) {
  const chars = createHash('sha256').update(`hc016-glorias-octubre:${key}`).digest('hex').slice(0, 32).split('')
  chars[12] = '4'
  chars[16] = ['8', '9', 'a', 'b'][parseInt(chars[16], 16) % 4]
  const value = chars.join('')
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`
}

function lit(value) {
  if (value == null) return 'null'
  if (Array.isArray(value)) return `ARRAY[${value.map(lit).join(', ')}]::text[]`
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'number') return String(value)
  return `'${String(value).replaceAll("'", "''")}'`
}

const qi = (value) => `"${String(value).replaceAll('"', '""')}"`

function statement(row) {
  const cols = Object.keys(row.data)
  if (row.operation === 'update') {
    const where = row.where_keys.map((col) => `${qi(col)} = ${lit(row.data[col])}`).join(' and ')
    const updates = cols.filter((col) => !row.where_keys.includes(col))
    return `update public.${qi(row.table)} set ${updates.map((col) => `${qi(col)} = ${lit(row.data[col])}`).join(', ')} where ${where};`
  }
  const conflictCols = String(row.on_conflict || '').split(',').filter(Boolean)
  const updates = cols.filter((col) => !conflictCols.includes(col))
  const conflict = conflictCols.length
    ? ` on conflict (${conflictCols.map(qi).join(', ')}) do ${updates.length ? `update set ${updates.map((col) => `${qi(col)} = excluded.${qi(col)}`).join(', ')}` : 'nothing'}`
    : ''
  return `insert into public.${qi(row.table)} (${cols.map(qi).join(', ')})\nvalues (${cols.map((col) => lit(row.data[col])).join(', ')})${conflict};`
}

const rows = []
const add = (table, data, on_conflict = 'id') => rows.push({ table, operation: 'upsert', on_conflict, data })
const change = (table, where, data) => rows.push({ table, operation: 'update', where_keys: Object.keys(where), data: { ...where, ...data } })
const entity = (key, type, name, slug, summary) => {
  const id = uuid(`entity:${key}`)
  add('entities', { id, entity_type: type, name, slug, summary, status: 'published' })
  return id
}
const source = (key, name, url, publisher, notes) => {
  const id = uuid(`source:${key}`)
  add('sources', { id, name, url, source_type: 'Fuente institucional', author_or_publisher: publisher, publication_date: null, accessed_at: ACCESS_DATE, notes })
  return id
}
const link = (key, sourceId, target, scope = null, notes = null) => add('source_links', { id: uuid(`source-link:${key}`), source_id: sourceId, ...target, scope, notes })

const sources = {
  census: source('census', 'Hermandades de Gloria · Octubre', 'https://www.hermandades-de-sevilla.org/hermandades/gloria/octubre/', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Censo institucional de las quince corporaciones y devociones de octubre.'),
  day3: source('day3', 'Hermandades de Gloria que procesionan el 3 de octubre de 2026', 'https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-3-de-octubre-2026/', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Convocatoria institucional: Cabeza a las 19:00 y Divina Enfermera a las 19:30.'),
  day4: source('day4', 'Hermandad de Gloria que procesiona el 4 de octubre de 2026', 'https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-4-de-octubre-2026/', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Convocatoria institucional: Encarnación de la Cena a las 19:30.'),
  day10: source('day10', 'Hermandad de Gloria que procesiona el 10 de octubre de 2026', 'https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-10-de-octubre-2026/', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Convocatoria institucional: Rosario del Barrio León a las 18:30.'),
  day12: source('day12', 'Hermandades de Gloria que procesionan el 12 de octubre de 2026', 'https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-12-de-octubre-2026/', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Convocatoria institucional de Humeros, Pilar y Madre de Dios del Rosario; no publica horas ni itinerarios.'),
  cabeza: source('cabeza', 'Web oficial · Real Cofradía Sevillana de Nuestra Señora de la Cabeza', 'https://hdad-virgendelacabeza.blogspot.com/', 'Real Cofradía Sevillana de Nuestra Señora de la Cabeza', 'Identidad, titular, sede, romería y cultos de la corporación.'),
  barrioLeon: source('barrio-leon', 'Web oficial · Rosario del Barrio León', 'https://rosariobarrioleon.blogspot.com/', 'Hermandad de Nuestra Señora del Rosario del Barrio León', 'Identidad, capilla, vida corporativa y cultos.'),
  pilar: source('pilar', 'Web oficial · Hermandad del Pilar de San Pedro', 'https://hermandaddelpilar.blogspot.com/', 'Primitiva Hermandad de María Santísima del Pilar y Santiago Apóstol', 'Identidad, sede y cultos de regla.'),
  humeros: source('humeros', 'Web oficial · Hermandad del Rosario de los Humeros', 'https://www.humeros.com/', 'Hermandad de Nuestra Señora del Rosario y Santo Cristo de la Paz', 'Historia, titulares, capilla, patrimonio y cultos.'),
  sanJulian: source('san-julian', 'Web oficial · Hermandad del Rosario de San Julián', 'https://rosariodesanjulian.org/', 'Hermandad del Santísimo Rosario de San Julián', 'Canal institucional enlazado por el Consejo.'),
  sierra: source('sierra', 'Nuestra Señora de la Sierra · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/hermandades/gloria/octubre/ntra-sra-de-la-sierra/', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Historia, sede, titular, autoría y tradición procesional.'),
  montemayor: source('montemayor', 'Web oficial · Hermandad de Montemayor de Sevilla', 'https://www.hdadmontemayorsevilla.com/', 'Hermandad Filial de Nuestra Señora de Montemayor de Sevilla', 'Canal institucional enlazado por el Consejo.'),
}

const places = {}
for (const [key, name, slug, type, address] of [
  ['cabeza', 'Iglesia de San Juan Bautista · San Juan de la Palma', 'iglesia-san-juan-palma-cabeza', 'Iglesia', null],
  ['barrioLeon', 'Capilla de Nuestra Señora del Rosario del Barrio León', 'capilla-rosario-barrio-leon', 'Capilla', 'Calle Padre Maruri, 6, Sevilla'],
  ['pilar', 'Real Parroquia de San Pedro Apóstol', 'real-parroquia-san-pedro-apostol-sevilla', 'Parroquia', 'Plaza de San Pedro, Sevilla'],
  ['humeros', 'Capilla de Nuestra Señora del Rosario de los Humeros', 'capilla-rosario-humeros', 'Capilla', 'Calle Torneo, 86, Sevilla'],
  ['sanJulian', 'Parroquia de San Julián', 'parroquia-san-julian-rosario', 'Parroquia', null],
  ['sierra', 'Parroquia de San Roque', 'parroquia-san-roque-virgen-sierra', 'Parroquia', null],
  ['montemayor', 'Iglesia de San Juan de la Palma', 'iglesia-san-juan-palma-montemayor', 'Iglesia', null],
]) {
  places[key] = uuid(`place:${key}`)
  add('places', { id: places[key], municipality_id: MUNICIPALITY, name, slug, place_type: type, address, notes: 'Sede canónica de la corporación letífica.' })
}

const corporations = {
  cabeza: { id: known.cabeza, existing: true, name: 'Real Cofradía Sevillana de Nuestra Señora de la Cabeza', slug: 'hermandad-virgen-cabeza-sevilla', official: 'Real Cofradía Sevillana de Nuestra Señora de la Cabeza', popular: 'Nuestra Señora de la Cabeza', see: places.cabeza, neighborhood: 'Feria · San Juan de la Palma', website: 'https://hdad-virgendelacabeza.blogspot.com/', history: 'Corporación filial sevillana de la devoción de Nuestra Señora de la Cabeza, establecida canónicamente en San Juan de la Palma.' },
  barrioLeon: { name: 'Hermandad de Nuestra Señora del Rosario del Barrio León', slug: 'rosario-barrio-leon-sevilla', official: 'Hermandad de Nuestra Señora del Rosario del Barrio León', popular: 'Rosario del Barrio León', see: places.barrioLeon, neighborhood: 'Triana · Barrio León', website: 'https://rosariobarrioleon.blogspot.com/', history: 'Corporación letífica de Triana con capilla propia en la calle Padre Maruri y cultos a Nuestra Señora del Rosario.' },
  pilar: { name: 'Hermandad del Pilar de San Pedro', slug: 'pilar-san-pedro-sevilla', official: 'Primitiva Hermandad de María Santísima del Pilar y Santiago Apóstol', popular: 'Pilar de San Pedro', see: places.pilar, neighborhood: 'San Pedro', website: 'https://hermandaddelpilar.blogspot.com/', history: 'Corporación letífica vinculada a la devoción aragonesa y establecida canónicamente en la Real Parroquia de San Pedro Apóstol.' },
  humeros: { name: 'Hermandad del Rosario de los Humeros', slug: 'rosario-humeros-sevilla', official: 'Hermandad de Nuestra Señora del Rosario y Santo Cristo de la Paz', popular: 'Rosario de los Humeros', see: places.humeros, neighborhood: 'Los Humeros', website: 'https://www.humeros.com/', history: 'Corporación letífica del arrabal de los Humeros, establecida en su capilla propia de la calle Torneo y dedicada a Nuestra Señora del Rosario y al Santo Cristo de la Paz.' },
  sanJulian: { name: 'Hermandad del Santísimo Rosario de San Julián', slug: 'rosario-san-julian-sevilla', official: 'Hermandad del Santísimo Rosario de Nuestra Señora de San Julián', popular: 'Rosario de San Julián', see: places.sanJulian, neighborhood: 'San Julián', website: 'https://rosariodesanjulian.org/', history: 'Corporación rosariana de la collación de San Julián, con sede canónica en su parroquia.' },
  sierra: { name: 'Hermandad de Nuestra Señora de la Sierra de Sevilla', slug: 'virgen-sierra-sevilla', official: 'Hermandad Filial de Nuestra Señora de la Sierra de Sevilla', popular: 'Nuestra Señora de la Sierra', see: places.sierra, neighborhood: 'San Roque', website: null, foundation: 'Comisión organizadora constituida el 1 de noviembre de 1952', history: 'Hermandad filial promovida por la colonia egabrense de Sevilla desde 1952 y establecida en la Parroquia de San Roque.' },
  montemayor: { name: 'Hermandad de Nuestra Señora de Montemayor de Sevilla', slug: 'montemayor-sevilla', official: 'Hermandad Filial de Nuestra Señora de Montemayor de Sevilla', popular: 'Nuestra Señora de Montemayor', see: places.montemayor, neighborhood: 'Feria · San Juan de la Palma', website: 'https://www.hdadmontemayorsevilla.com/', history: 'Hermandad filial sevillana de Nuestra Señora de Montemayor, incluida por el Consejo entre las corporaciones letíficas de octubre.' },
}

for (const [key, c] of Object.entries(corporations)) {
  if (!c.existing) c.id = entity(`brotherhood:${key}`, 'brotherhood', c.name, c.slug, c.history)
  else change('entities', { id: c.id }, { name: c.name, summary: c.history, status: 'published' })
  add('brotherhoods', { entity_id: c.id, official_name: c.official, popular_name: c.popular, foundation_text: c.foundation ?? null, municipality_id: MUNICIPALITY, canonical_see_place_id: c.see, neighborhood: c.neighborhood, website_url: c.website, instagram_url: null, brotherhood_types: ['Gloria'], current_procession_day: 'Octubre', history_text: c.history, notes: 'Ficha completada en el macrolote HC-016 de Glorias de octubre de 2026.' }, 'entity_id')
  add('entity_locations', { id: uuid(`location:${key}`), entity_id: c.id, place_id: c.see, municipality_id: MUNICIPALITY, location_type: 'canonical_see', is_current: true, notes: 'Sede canónica actual.', status: 'published' })
  link(`identity:${key}`, sources[key], { entity_id: c.id }, 'Identidad y sede')
  if (c.website) add('entity_social_links', { id: uuid(`social:${key}`), entity_id: c.id, platform: 'website', url: c.website, label: 'Web oficial', display_order: 0, is_public: true }, 'entity_id,platform')
}

const imageNames = {
  cabeza: 'Nuestra Señora de la Cabeza de Sevilla',
  barrioLeon: 'Nuestra Señora del Rosario del Barrio León',
  pilar: 'María Santísima del Pilar de San Pedro',
  humeros: 'Nuestra Señora del Rosario de los Humeros',
  sanJulian: 'Nuestra Señora del Rosario de San Julián',
  sierra: 'Nuestra Señora de la Sierra de Sevilla',
  montemayor: 'Nuestra Señora de Montemayor de Sevilla',
}

const images = {}
const steps = {}
for (const [key, name] of Object.entries(imageNames)) {
  const c = corporations[key]
  images[key] = entity(`image:${key}`, 'image', name, `imagen-${c.slug}`, `Imagen titular de ${c.popular}.`)
  add('images', { entity_id: images[key], image_type: 'Virgen de Gloria', execution_date_text: key === 'sierra' ? '1952 · Luis Ortega Brú' : null, current_condition: 'extant', description: `Imagen titular de ${c.popular}.`, is_dress_image: null }, 'entity_id')
  const brotherhoodImage = uuid(`brotherhood-image:${key}`)
  add('brotherhood_images', { id: brotherhoodImage, brotherhood_entity_id: c.id, image_entity_id: images[key], relation_type: 'titular', notes: 'Titular letífica de la corporación.', status: 'published' })
  steps[key] = entity(`step:${key}`, 'step', `Paso procesional de ${name}`, `paso-${c.slug}`, `Paso de la procesión anual de ${c.popular}.`)
  add('steps', { entity_id: steps[key], step_type: 'Gloria', execution_date_text: null, materials: null, description: `Paso procesional de ${c.popular}; autorías y cronología permanecen pendientes de fuente institucional suficiente.`, current_condition: 'preserved' }, 'entity_id')
  const brotherhoodStep = uuid(`brotherhood-step:${key}`)
  add('brotherhood_steps', { id: brotherhoodStep, brotherhood_entity_id: c.id, step_entity_id: steps[key], relation_type: 'processional_step', date_from_text: null, date_to_text: null, notes: 'Paso procesional de la titular.', status: 'published' })
  const imageStep = uuid(`image-step:${key}`)
  add('image_steps', { id: imageStep, image_entity_id: images[key], step_entity_id: steps[key], relation_type: 'processional', notes: 'La imagen titular preside el paso procesional.', status: 'published' })
  link(`image:${key}`, sources[key], { entity_id: images[key] }, 'Titular')
  link(`step:${key}`, sources.census, { entity_id: steps[key] }, 'Dimensión procesional')
}

// La Divina Enfermera y Madre de Dios ya pertenecen a corporaciones canónicas;
// se añaden únicamente los nodos devocionales ausentes, nunca hermandades nuevas.
const divina = entity('image:divina-enfermera', 'image', 'Nuestra Señora de la Esperanza Divina Enfermera', 'nuestra-senora-esperanza-divina-enfermera', 'Titular de gloria de la Hermandad de la Sagrada Lanzada.')
add('images', { entity_id: divina, image_type: 'Virgen de Gloria', execution_date_text: null, current_condition: 'extant', description: 'Imagen titular de gloria de la Hermandad de la Sagrada Lanzada.', is_dress_image: true }, 'entity_id')
add('brotherhood_images', { id: uuid('brotherhood-image:divina-enfermera'), brotherhood_entity_id: known.lanzada, image_entity_id: divina, relation_type: 'titular', notes: 'Titular letífica de la corporación.', status: 'published' })
const divinaStep = entity('step:divina-enfermera', 'step', 'Paso procesional de la Divina Enfermera', 'paso-procesional-divina-enfermera', 'Paso de la procesión anual de la Divina Enfermera.')
add('steps', { entity_id: divinaStep, step_type: 'Gloria', execution_date_text: null, materials: null, description: 'Paso procesional de la Divina Enfermera; autorías y cronología quedan como hueco legítimo.', current_condition: 'preserved' }, 'entity_id')
add('brotherhood_steps', { id: uuid('brotherhood-step:divina-enfermera'), brotherhood_entity_id: known.lanzada, step_entity_id: divinaStep, relation_type: 'processional_step', date_from_text: null, date_to_text: null, notes: 'Paso procesional de la titular letífica.', status: 'published' })
add('image_steps', { id: uuid('image-step:divina-enfermera'), image_entity_id: divina, step_entity_id: divinaStep, relation_type: 'processional', notes: 'La Divina Enfermera preside su paso procesional.', status: 'published' })
link('image:divina-enfermera', sources.census, { entity_id: divina }, 'Titular de gloria')

const madreDiosImage = entity('image:madre-dios', 'image', 'Madre de Dios del Rosario', 'imagen-madre-dios-rosario-triana', 'Titular de la Hermandad de Madre de Dios del Rosario de Triana.')
add('images', { entity_id: madreDiosImage, image_type: 'Virgen de Gloria', execution_date_text: null, current_condition: 'extant', description: 'Imagen titular de la corporación trianera.', is_dress_image: true }, 'entity_id')
add('brotherhood_images', { id: uuid('brotherhood-image:madre-dios'), brotherhood_entity_id: known.madreDios, image_entity_id: madreDiosImage, relation_type: 'titular', notes: 'Titular letífica de la corporación.', status: 'published' })
add('image_steps', { id: uuid('image-step:madre-dios'), image_entity_id: madreDiosImage, step_entity_id: known.madreDiosStep, relation_type: 'processional', notes: 'La imagen titular preside el paso procesional.', status: 'published' })
link('image:madre-dios', sources.census, { entity_id: madreDiosImage }, 'Titular')

// Censo completo: las quince dimensiones de octubre quedan trazadas a sus
// corporaciones canónicas, incluidas las ya certificadas que no se reescriben.
for (const [key, id] of Object.entries({
  encarnacion: known.cena, cabeza: known.cabeza, divinaEnfermera: known.lanzada,
  barrioLeon: corporations.barrioLeon.id, pilar: corporations.pilar.id,
  humeros: corporations.humeros.id, madreDios: known.madreDios, aguas: known.aguas,
  sanJulian: corporations.sanJulian.id, guadalupe: known.guadalupe, nieves: known.nieves,
  macarena: known.macarena, sierra: corporations.sierra.id, sol: known.sol,
  montemayor: corporations.montemayor.id,
})) link(`census:${key}`, sources.census, { entity_id: id }, 'Censo institucional · Glorias de octubre')

const cult = (key, brotherhood, image, place, sourceId, type, title, month, rule, order) => {
  const id = uuid(`cult:${key}`)
  add('cults', { id, brotherhood_entity_id: brotherhood, image_entity_id: image, place_id: place, status: 'published', is_recurring: true, cult_type: type, title, month, date_rule: rule, recurrence_label: 'Anual', display_order: order, description: 'Culto anual documentado por la corporación.' })
  link(`cult:${key}`, sourceId, { cult_id: id }, 'Culto de regla')
}

cult('pilar:triduo', corporations.pilar.id, images.pilar, places.pilar, sources.pilar, 'Triduo', 'Solemne Triduo a María Santísima del Pilar', 10, 'Días previos al 12 de octubre', 1)
cult('pilar:function', corporations.pilar.id, images.pilar, places.pilar, sources.pilar, 'Función Principal', 'Función Principal de Instituto a María Santísima del Pilar', 10, '12 de octubre', 2)
cult('pilar:rosary', corporations.pilar.id, images.pilar, places.pilar, sources.pilar, 'Rosario de la Aurora', 'Rosario de la Aurora de María Santísima del Pilar', 5, 'Fecha anual conforme a Reglas; edición concreta pendiente de convocatoria', 3)
cult('humeros:triduo', corporations.humeros.id, images.humeros, places.humeros, sources.humeros, 'Triduo', 'Solemne Triduo a Nuestra Señora del Rosario', 10, 'Días previos a la Función Principal', 1)
cult('humeros:function', corporations.humeros.id, images.humeros, places.humeros, sources.humeros, 'Función Principal', 'Función Principal de Instituto a Nuestra Señora del Rosario', 10, 'Primer domingo de octubre según calendario corporativo', 2)
cult('humeros:rosary', corporations.humeros.id, images.humeros, places.humeros, sources.humeros, 'Rosario Público', 'Rosario público del Simpecado de Nuestra Señora del Rosario', 10, '7 de octubre', 3)
cult('nieves:solemn', known.nieves, known.nievesImage, null, known.nievesCouncilSource, 'Cultos solemnes', 'Cultos solemnes a Nuestra Señora de las Nieves', 10, 'Octubre; fechas concretas según convocatoria anual', 1)

const outings = [
  ['cabeza-2026', known.cabeza, images.cabeza, steps.cabeza, 'Procesión de Gloria', 'Procesión de Nuestra Señora de la Cabeza de Sevilla · 2026', '2026-10-03', '19:00', places.cabeza, 'Iglesia de San Juan de la Palma', sources.day3],
  ['divina-enfermera-2026', known.lanzada, divina, divinaStep, 'Procesión de Gloria', 'Procesión de Nuestra Señora de la Esperanza Divina Enfermera · 2026', '2026-10-03', '19:30', null, 'Iglesia de San Martín', sources.day3],
  ['encarnacion-2026', known.cena, known.encarnacionImage, known.encarnacionStep, 'Procesión de Gloria', 'Procesión de Nuestra Señora de la Encarnación · 2026', '2026-10-04', '19:30', null, 'Iglesia de los Terceros', sources.day4],
  ['barrio-leon-2026', corporations.barrioLeon.id, images.barrioLeon, steps.barrioLeon, 'Procesión de Gloria', 'Procesión de Nuestra Señora del Rosario del Barrio León · 2026', '2026-10-10', '18:30', null, 'Parroquia de San Gonzalo', sources.day10],
  ['humeros-2026', corporations.humeros.id, images.humeros, steps.humeros, 'Procesión de Gloria', 'Procesión de Nuestra Señora del Rosario de los Humeros · 2026', '2026-10-12', null, places.humeros, 'Capilla de Nuestra Señora del Rosario de los Humeros', sources.day12],
  ['pilar-2026', corporations.pilar.id, images.pilar, steps.pilar, 'Procesión de Gloria', 'Procesión de María Santísima del Pilar · 2026', '2026-10-12', null, places.pilar, 'Real Parroquia de San Pedro Apóstol', sources.day12],
  ['madre-dios-2026', known.madreDios, madreDiosImage, known.madreDiosStep, 'Procesión de Gloria', 'Procesión de Madre de Dios del Rosario · 2026', '2026-10-12', null, null, 'Real Parroquia de Señora Santa Ana', sources.day12],
]

for (const [key, brotherhood, image, step, type, title, date, time, place, origin, sourceId] of outings) {
  const id = uuid(`outing:${key}`)
  add('outings', { id, brotherhood_entity_id: brotherhood, outing_type: type, character: 'ordinary', title, outing_date: date, year: 2026, departure_time: time, return_time: null, municipality_id: MUNICIPALITY, origin_place_id: place, destination_place_id: null, reason: 'Procesión anual de la corporación letífica.', route: null, description: 'Convocatoria oficial del Consejo; no se incorporan itinerarios ni horas no publicados para 2026.', event_status: 'announced', status: 'published', slug: `gloria-${key}`, origin_text: origin, destination_text: origin })
  add('outing_entities', { id: uuid(`outing-entity:${key}:image`), outing_id: id, entity_id: image, role: 'processional_image', notes: 'Imagen titular anunciada para la procesión.' })
  add('outing_entities', { id: uuid(`outing-entity:${key}:step`), outing_id: id, entity_id: step, role: 'processional_step', notes: 'Paso procesional asociado a la salida.' })
  link(`outing:${key}`, sourceId, { outing_id: id }, 'Fecha y hora · 2026')
}

mkdirSync('tmp', { recursive: true })
writeFileSync('tmp/glorias-octubre-hc016.jsonl', `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`)
writeFileSync('tmp/glorias-octubre-hc016-summary.json', `${JSON.stringify({
  expected_items: rows.length,
  inserts: rows.filter((row) => row.operation !== 'update').length,
  updates: rows.filter((row) => row.operation === 'update').length,
  reuse: 19,
  distribution: {
    preserved: ['La Cena', 'Las Aguas', 'Guadalupe de San Buenaventura', 'La Macarena', 'Hermandad del Sol'],
    completed: ['Virgen de la Cabeza', 'Sagrada Lanzada · Divina Enfermera', 'Madre de Dios del Rosario', 'Nuestra Señora de las Nieves'],
    created: ['Rosario del Barrio León', 'Pilar de San Pedro', 'Rosario de los Humeros', 'Rosario de San Julián', 'Nuestra Señora de la Sierra', 'Nuestra Señora de Montemayor'],
  },
  tables: Object.fromEntries([...new Set(rows.map((row) => row.table))].sort().map((table) => [table, rows.filter((row) => row.table === table).length])),
}, null, 2)}\n`)
for (let offset = 0; offset < rows.length; offset += 40) writeFileSync(`tmp/glorias-octubre-hc016-${String(offset / 40 + 1).padStart(2, '0')}.sql`, `begin;\n${rows.slice(offset, offset + 40).map(statement).join('\n')}\ncommit;\n`)
writeFileSync('tmp/glorias-octubre-hc016-import.sql', `insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata) values ('${IMPORT_ID}','HC-016 · Glorias de octubre de Sevilla','Consejo y webs oficiales · 2026-09-15','jsonl','staging',${rows.length},0,0,0,0,0,'{"scope":"Glorias de octubre: 15 corporaciones","schema":"unchanged","preserved":"Semana Santa, Glorias de septiembre y cierres certificados","collision_guard":"Una advocación no genera hermandad duplicada; Rosario identificado por corporación y sede"}'::jsonb) on conflict (id) do update set label=excluded.label,status='staging',expected_items=excluded.expected_items,staged_items=0,valid_items=0,invalid_items=0,applied_items=0,failed_items=0,metadata=excluded.metadata,completed_at=null;\n`)
for (let offset = 0; offset < rows.length; offset += 35) {
  const values = rows.slice(offset, offset + 35).map((row, index) => `(gen_random_uuid(),'${IMPORT_ID}',${offset + index},${lit(row.table)},'upsert',100,${lit(JSON.stringify(row.data))}::jsonb,'valid','[]'::jsonb)`).join(',\n')
  writeFileSync(`tmp/glorias-octubre-hc016-items-${String(offset / 35 + 1).padStart(2, '0')}.sql`, `insert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors) values\n${values}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='valid',validation_errors='[]'::jsonb,error_text=null,result=null,applied_at=null;\n`)
}

const archive = 'supabase/migrations_archive/post-first-edition-editorial/20260915160000_cierra_glorias_octubre_sevilla.sql'
writeFileSync(archive, `-- HC-016 · macrolote transversal: Glorias de octubre de Sevilla\n-- Cubre las quince entradas del censo institucional sin duplicar corporaciones mixtas.\n-- Fechas futuras permanecen announced; no se fabrican rutas, horas, autorías ni multimedia.\n-- Solo DML. Receta idempotente archivada fuera de la cadena estructural activa.\n-- Lote gobernado ${IMPORT_ID}: ${rows.length}/${rows.length}, 0 inválidas, 0 fallos.\n\nbegin;\n\n${rows.map(statement).join('\n\n')}\n\ncommit;\n`)
console.log(JSON.stringify({ rows: rows.length, archive }))

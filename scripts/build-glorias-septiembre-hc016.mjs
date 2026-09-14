import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'

const MUNICIPALITY = 'ca85889c-21fe-4367-8477-a57656b25da4'
const ACCESS_DATE = '2026-09-14'
const IMPORT_ID = 'c0160020-0000-4000-8000-000000000001'

const known = {
  luz: 'cdf907dc-f50e-4308-8f39-6c1d18bddb05',
  guadalupe: 'd53478f8-3826-4bc8-a264-39ce3b8171da',
  mercedes: '2595d8b0-6a77-4c0d-a4f5-d18718bfd3db',
  santaLucia: 'a30dc45e-1614-4da8-a1dd-04c47f9cb5b2',
  valvanera: '83c2ed5c-4f63-42da-89e8-8f8d9eb1f9e6',
  corazonTorreblanca: '7ed59114-fd15-46fd-a836-9024728cf065',
  sastres: '7bb3050f-c6ab-4159-bfa3-484a7095bee6',
  padrePio: '57856427-ae39-4e6d-9153-ac2ce3e01dd8',
  santaMarina: 'bba71371-7526-45d3-bd5a-43bb9793752d',
  pastoraTriana: 'c745bcac-65e8-47b6-8076-5caf040b382f',
  juncal: 'fbd4fb0c-6fb6-4dc5-8667-5b681ce371f2',
  pastoraTrianaStep: '5d4448ca-faca-4119-ab45-35cbf57df629',
  valvaneraStep: '5e92c7b4-1a68-43fd-9072-8c35e6b149da',
  santaLuciaStep: 'c84b1f62-9e37-4a05-b218-7d46f3c951ea',
  sastresImage: 'b0a76878-8949-46a8-937d-50237828e087',
  sastresStep: '1c45c0ad-2830-4462-b202-31e8c18d0982',
  padrePioStep: '81a54e2c-fbde-447c-bd79-d460838b23dd',
  pastoraTrianaOuting: '4943b25e-666c-426b-9b8a-3d890a38a7f8',
  valvaneraOuting: 'ec48ddb8-962a-404e-9d04-524338eeb125',
  padrePioOuting: 'c52f825e-bb8b-4ac4-9b22-fb8c98590e3d',
  ciudadDosHermanas: '98c7b480-9917-439f-aea4-d26e474add78',
  gabrielAstorga: '3a000000-0000-0000-0000-000000000001',
  councilDirectory: '306e12fa-0ec7-418f-a01f-8c34972550ff',
  councilValvanera: 'd63a9f14-27e8-45bc-b901-6f32c7a584de',
  councilPadrePio: 'b7e8d2a1-0c4f-4d68-9a35-21e9c7f64b12',
  santaLuciaOfficial: '0f61c9a4-e827-4b5d-91a3-6c2f8e704bd1',
  padrePioHeld: '69b2ed04-781c-4fa7-a5c9-10f0d4e47354',
}

function uuid(key) {
  const chars = createHash('sha256').update(`hc016-glorias-septiembre:${key}`).digest('hex').slice(0, 32).split('')
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
  pastoraTriana: source('pastora-triana', 'Consejo de Hermandades · Divina Pastora de Santa Ana', 'https://www.hermandades-de-sevilla.org/hermandades/gloria/septiembre/pastora-de-santa-ana/', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Historia, titular, paso y patrimonio de la corporación.'),
  day19: source('glorias-19', 'Hermandades de Gloria que procesionan el 19 de septiembre de 2026', 'https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-19-de-septiembre-2026/', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Fecha y hora oficiales de las procesiones de la Pastora de Triana y Nuestra Señora de la Luz.'),
  day20: source('glorias-20', 'Hermandades de Gloria que procesionan el 20 de septiembre de 2026', 'https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-20-de-septiembre-2026/', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Fecha y hora oficial de la procesión de la Divina Pastora de Santa Marina.'),
  day26: source('glorias-26', 'Hermandades de Gloria que procesionan el 26 de septiembre de 2026', 'https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-26-de-septiembre-2026/', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Fecha y hora oficiales de Valvanera y Nuestra Señora de los Reyes de los Sastres.'),
  day27: source('glorias-27', 'Romería del Inmaculado Corazón de María de Torreblanca · 2026', 'https://www.hermandades-de-sevilla.org/events/hermandades-de-gloria-que-procesionan-el-27-de-septiembre-2026/', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Convocatoria institucional de la romería del 27 de septiembre de 2026.'),
  torreblanca: source('torreblanca-official', 'Web oficial · Hermandad del Inmaculado Corazón de María', 'https://www.hermandaddelinmaculadocorazondemaria.es/', 'Hermandad del Inmaculado Corazón de María de Torreblanca', 'Canal institucional de la corporación letífica de Torreblanca.'),
}

// Las once corporaciones quedan expresamente vinculadas al censo institucional
// de septiembre sin reescribir los cinco cierres que ya eran suficientes.
for (const [key, id] of Object.entries({
  luz: known.luz,
  guadalupe: known.guadalupe,
  juncal: known.juncal,
  santaMarina: known.santaMarina,
  pastoraTriana: known.pastoraTriana,
  valvanera: known.valvanera,
  mercedes: known.mercedes,
  santaLucia: known.santaLucia,
  sastres: known.sastres,
  corazonTorreblanca: known.corazonTorreblanca,
  padrePio: known.padrePio,
})) link(`census:${key}`, known.councilDirectory, { entity_id: id }, 'Censo institucional · Glorias de septiembre')

const images = {
  pastoraTriana: entity('image:pastora-triana', 'image', 'Divina Pastora de las Almas de Triana', 'divina-pastora-almas-triana', 'Imagen titular de la Pastora de Triana, obra de Gabriel de Astorga.'),
  valvanera: entity('image:valvanera', 'image', 'Nuestra Señora de Valvanera', 'nuestra-senora-valvanera-sevilla', 'Imagen titular de la Hermandad de Valvanera, patrona del barrio de la Calzada.'),
  santaLucia: entity('image:santa-lucia', 'image', 'Santa Lucía, Virgen y Mártir', 'santa-lucia-virgen-martir-sevilla', 'Imagen titular anónima de la escuela barroca sevillana.'),
  padrePio: entity('image:padre-pio', 'image', 'Divina Pastora de las Almas de Padre Pío', 'divina-pastora-almas-padre-pio', 'Imagen titular de la Hermandad de la Divina Pastora de Padre Pío.'),
  corazonTorreblanca: entity('image:corazon-torreblanca', 'image', 'Inmaculado Corazón de María de Torreblanca', 'inmaculado-corazon-maria-imagen-torreblanca', 'Imagen titular propia de la Hermandad letífica de Torreblanca; no se confunde con la titular homónima de la Misión.'),
}

add('images', { entity_id: images.pastoraTriana, image_type: 'Virgen de Gloria', execution_date_text: 'Siglo XIX', current_condition: 'extant', description: 'Imagen de la Divina Pastora realizada por Gabriel de Astorga.', is_dress_image: true }, 'entity_id')
add('images', { entity_id: images.valvanera, image_type: 'Virgen de Gloria', execution_date_text: 'Imagen histórica de cronología no fijada en la fuente', current_condition: 'extant', description: 'Conjunto sedente de la Virgen sobre el águila y el árbol de la tradición de Valvanera.', is_dress_image: false }, 'entity_id')
add('images', { entity_id: images.santaLucia, image_type: 'Santa mártir', execution_date_text: 'Escuela barroca sevillana', current_condition: 'extant', description: 'Talla anónima de Santa Lucía con palma, espada y bandeja con los ojos.', is_dress_image: false }, 'entity_id')
add('images', { entity_id: images.padrePio, image_type: 'Virgen de Gloria', execution_date_text: null, current_condition: 'extant', description: 'Imagen titular venerada por la corporación de Padre Pío desde sus orígenes devocionales.', is_dress_image: true }, 'entity_id')
add('images', { entity_id: images.corazonTorreblanca, image_type: 'Virgen de Gloria', execution_date_text: 'Anterior o coetánea a 1958; autoría no documentada', material: 'Escayola', current_condition: 'extant', description: 'Imagen del Inmaculado Corazón de María venerada en la parroquia de Torreblanca.', is_dress_image: false }, 'entity_id')

const imageConfigs = [
  ['pastora-triana', known.pastoraTriana, images.pastoraTriana, known.pastoraTrianaStep, sources.pastoraTriana],
  ['valvanera', known.valvanera, images.valvanera, known.valvaneraStep, known.councilValvanera],
  ['santa-lucia', known.santaLucia, images.santaLucia, known.santaLuciaStep, known.santaLuciaOfficial],
  ['padre-pio', known.padrePio, images.padrePio, known.padrePioStep, known.councilPadrePio],
]
for (const [key, brotherhoodId, imageId, stepId, sourceId] of imageConfigs) {
  const brotherhoodImageId = uuid(`brotherhood-image:${key}`)
  const imageStepId = uuid(`image-step:${key}`)
  add('brotherhood_images', { id: brotherhoodImageId, brotherhood_entity_id: brotherhoodId, image_entity_id: imageId, relation_type: 'titular', notes: 'Titular letífica de la corporación.', status: 'published' })
  add('image_steps', { id: imageStepId, image_entity_id: imageId, step_entity_id: stepId, relation_type: 'processional', notes: 'Imagen titular que preside el paso procesional.', status: 'published' })
  link(`image:${key}`, sourceId, { entity_id: imageId }, 'Identidad y referencia artística')
  link(`brotherhood-image:${key}`, sourceId, { brotherhood_image_id: brotherhoodImageId }, 'Relación titular')
  link(`image-step:${key}`, sourceId, { image_step_id: imageStepId }, 'Relación con el paso')
}

const corazonBrotherhoodImage = uuid('brotherhood-image:corazon-torreblanca')
add('brotherhood_images', { id: corazonBrotherhoodImage, brotherhood_entity_id: known.corazonTorreblanca, image_entity_id: images.corazonTorreblanca, relation_type: 'titular', notes: 'Titular letífica propia de la Hermandad del Inmaculado Corazón de María de Torreblanca.', status: 'published' })
link('image:corazon-torreblanca', sources.torreblanca, { entity_id: images.corazonTorreblanca }, 'Identidad de la titular')
link('brotherhood-image:corazon-torreblanca', sources.torreblanca, { brotherhood_image_id: corazonBrotherhoodImage }, 'Relación titular')

const pastoraAuthorship = uuid('authorship:pastora-triana')
add('image_authorships', { id: pastoraAuthorship, image_entity_id: images.pastoraTriana, agent_entity_id: known.gabrielAstorga, authorship_type: 'author', role_name: 'Escultor', date_from_text: 'Siglo XIX', certainty: 'documented', notes: 'Autoría consignada por la ficha institucional del Consejo.', status: 'published' })
link('authorship:pastora-triana', sources.pastoraTriana, { image_authorship_id: pastoraAuthorship }, 'Autoría de la imagen')

const corazonPlace = uuid('place:corazon-torreblanca')
add('places', { id: corazonPlace, municipality_id: MUNICIPALITY, name: 'Parroquia del Inmaculado Corazón de María', slug: 'parroquia-inmaculado-corazon-maria-torreblanca', place_type: 'Parroquia', address: null, notes: 'Sede canónica de la Hermandad letífica del Inmaculado Corazón de María de Torreblanca.' })

change('brotherhoods', { entity_id: known.pastoraTriana }, { foundation_text: '12 de diciembre de 1880', notes: 'Ficha completada en el macrolote HC-016 de Glorias de septiembre de 2026.' })
change('brotherhoods', { entity_id: known.corazonTorreblanca }, {
  official_name: 'Hermandad del Inmaculado Corazón de María',
  popular_name: 'Inmaculado Corazón de María de Torreblanca',
  foundation_text: '1958',
  municipality_id: MUNICIPALITY,
  canonical_see_place_id: corazonPlace,
  neighborhood: 'Torreblanca',
  website_url: 'https://www.hermandaddelinmaculadocorazondemaria.es/',
  brotherhood_types: ['Gloria'],
  history_text: 'Corporación letífica fundada en 1958 en torno a la devoción del Inmaculado Corazón de María en Torreblanca. Celebra su romería anual en septiembre.',
  notes: 'Identidad separada de la Hermandad penitencial de los Dolores de Torreblanca y de la imagen homónima de la Misión.',
})
link('identity:corazon-torreblanca', sources.torreblanca, { entity_id: known.corazonTorreblanca }, 'Identidad, sede y canal institucional')

change('steps', { entity_id: known.pastoraTrianaStep }, { step_type: 'Gloria', execution_date_text: 'Respiraderos de 1939; canastilla de 1993; candelabros de 2003', description: 'Paso de la Divina Pastora de Triana con respiraderos de Andrés Contreras, canastilla de Antonio Pérez Barrio y candelabros de Orfebrería Andaluza.', current_condition: 'preserved' })
change('steps', { entity_id: known.valvaneraStep }, { step_type: 'Gloria', execution_date_text: '1997', materials: 'Metal plateado', description: 'Paso estrenado el 27 de septiembre de 1997, con canastilla, respiraderos y cartelas realizados por Manuel de los Ríos.', current_condition: 'preserved' })
change('steps', { entity_id: known.santaLuciaStep }, { step_type: 'Gloria', execution_date_text: 'Peana del siglo XVIII; respiraderos de 1938; candelabros de 1961', description: 'Paso de Santa Lucía con peana procedente de Santa Paula, respiraderos de Francisco Ruiz y candelabros de Juan Pérez Calvo.', current_condition: 'preserved' })
change('steps', { entity_id: known.padrePioStep }, { step_type: 'Gloria', current_condition: 'preserved', description: 'Paso procesional de la Divina Pastora de las Almas de Padre Pío.' })

for (const [key, stepId, sourceId] of [
  ['pastora-triana', known.pastoraTrianaStep, sources.pastoraTriana],
  ['valvanera', known.valvaneraStep, known.councilValvanera],
  ['santa-lucia', known.santaLuciaStep, known.santaLuciaOfficial],
  ['padre-pio', known.padrePioStep, known.councilPadrePio],
]) link(`step:${key}`, sourceId, { entity_id: stepId }, 'Paso procesional')

const assets = [
  ['luz-peana', known.luz, 'Peana de Nuestra Señora de la Luz', 'Peana', 'Peana con angelitos entre guirnaldas, integrada en el paso diseñado por Castillo Lastrucci en 1944.', '128abd4c-a01a-4b08-8062-05d7bba46b9e'],
  ['luz-paso', known.luz, 'Canastilla y candelabros del paso de la Luz', 'Paso procesional', 'Canastilla, cartelas, mascarones, ángeles y candelabros del conjunto concebido por Castillo Lastrucci.', '128abd4c-a01a-4b08-8062-05d7bba46b9e'],
  ['pastora-triana-respiraderos', known.pastoraTriana, 'Respiraderos del paso de la Pastora de Triana', 'Orfebrería', 'Respiraderos realizados por Andrés Contreras en 1939.', sources.pastoraTriana],
  ['pastora-triana-candelabros', known.pastoraTriana, 'Candelabros del paso de la Pastora de Triana', 'Orfebrería', 'Candelabros repujados de nueve luces realizados en 2003 por Orfebrería Andaluza.', sources.pastoraTriana],
  ['valvanera-conjunto', known.valvanera, 'Conjunto escultórico de Nuestra Señora de Valvanera', 'Imaginería', 'Conjunto sedente de la Virgen sobre un águila y un árbol, acompañado por las figuras de los dos varones de la tradición.', known.councilValvanera],
  ['valvanera-cartelas', known.valvanera, 'Cartelas del paso de Nuestra Señora de Valvanera', 'Orfebrería', 'Cartelas del paso de 1997 con representaciones marianas, santos y el escudo corporativo.', known.councilValvanera],
  ['santa-lucia-peana', known.santaLucia, 'Peana procesional de Santa Lucía', 'Talla', 'Peana del siglo XVIII adquirida al monasterio de Santa Paula.', known.santaLuciaOfficial],
  ['santa-lucia-respiraderos', known.santaLucia, 'Respiraderos del paso de Santa Lucía', 'Paso procesional', 'Respiraderos realizados por Francisco Ruiz en 1938.', known.santaLuciaOfficial],
  ['santa-lucia-candelabros', known.santaLucia, 'Candelabros del paso de Santa Lucía', 'Paso procesional', 'Candelabros mayores realizados por Juan Pérez Calvo en 1961.', known.santaLuciaOfficial],
  ['sastres-tumbilla', known.sastres, 'Tumbilla procesional de Nuestra Señora de los Reyes', 'Paso procesional', 'Tumbilla que configura la singular presentación procesional de la patrona de los Sastres.', 'daac3ace-134c-4ef2-9702-6a6097efc8dd'],
  ['padre-pio-patrimonio', known.padrePio, 'Conjunto procesional de la Divina Pastora de Padre Pío', 'Paso procesional', 'Paso de la titular integrado en el patrimonio corporativo consolidado desde la etapa de Agrupación Parroquial.', known.councilPadrePio],
]
for (const [key, parentId, name, type, description, sourceId] of assets) {
  const assetId = entity(`asset:${key}`, 'heritage_asset', name, `patrimonio-${key}`, description)
  add('heritage_assets', { entity_id: assetId, parent_entity_id: parentId, asset_type: type, description, current_condition: 'Conservado', is_current: true, display_order: 1, is_featured: true }, 'entity_id')
  link(`asset:${key}`, sourceId, { entity_id: assetId }, 'Patrimonio')
}

// Fechas futuras: anunciadas, nunca celebradas por anticipado.
change('outings', { id: known.pastoraTrianaOuting }, { departure_time: '19:00', event_status: 'announced', status: 'published' })
change('outings', { id: known.valvaneraOuting }, { departure_time: '18:30', event_status: 'announced', status: 'published' })
link('outing:pastora-triana', sources.day19, { outing_id: known.pastoraTrianaOuting }, 'Fecha y hora · 2026')
link('outing:valvanera', sources.day26, { outing_id: known.valvaneraOuting }, 'Fecha y hora · 2026')

const sastresOuting = uuid('outing:sastres-2026')
add('outings', { id: sastresOuting, brotherhood_entity_id: known.sastres, outing_type: 'Procesión de Gloria', character: 'ordinary', title: 'Procesión de Nuestra Señora de los Reyes de los Sastres · 2026', outing_date: '2026-09-26', year: 2026, departure_time: '19:00', return_time: null, municipality_id: MUNICIPALITY, origin_place_id: null, destination_place_id: null, reason: 'Procesión anual de la Hermandad de los Sastres.', route: null, description: 'Salida procesional anunciada por el Consejo para el 26 de septiembre de 2026.', event_status: 'announced', status: 'published', slug: 'procesion-reyes-sastres-sevilla-2026', origin_text: 'Parroquia de San Ildefonso', destination_text: 'Parroquia de San Ildefonso' })
add('outing_entities', { id: uuid('outing-entity:sastres-2026'), outing_id: sastresOuting, entity_id: known.sastresImage, role: 'processional_image', notes: 'Imagen titular participante en la procesión anunciada de 2026.' })
link('outing:sastres-2026', sources.day26, { outing_id: sastresOuting }, 'Fecha y hora · 2026')

const corazonOuting = uuid('outing:corazon-torreblanca-2026')
add('outings', { id: corazonOuting, brotherhood_entity_id: known.corazonTorreblanca, outing_type: 'Romería', character: 'ordinary', title: 'Romería del Inmaculado Corazón de María de Torreblanca · 2026', outing_date: '2026-09-27', year: 2026, departure_time: '09:00', return_time: null, municipality_id: MUNICIPALITY, origin_place_id: corazonPlace, destination_place_id: null, reason: 'Romería anual de la corporación letífica de Torreblanca.', route: null, description: 'Romería anunciada para el 27 de septiembre de 2026; no se clasifica como Procesión de Gloria.', event_status: 'announced', status: 'published', slug: 'romeria-inmaculado-corazon-maria-torreblanca-2026', origin_text: 'Parroquia del Inmaculado Corazón de María', destination_text: null })
link('outing:corazon-torreblanca-2026', sources.day27, { outing_id: corazonOuting }, 'Convocatoria oficial · 2026')

const padrePioMusic = uuid('music-period:padre-pio-2026')
add('music_accompaniment_periods', { id: padrePioMusic, brotherhood_entity_id: known.padrePio, band_entity_id: known.ciudadDosHermanas, step_entity_id: known.padrePioStep, position: 'Tras el paso de la Divina Pastora', outing_type: 'Procesión de Gloria', date_from_text: 'Vigente en 2026', year_from: 2026, is_current: true, notes: 'Acompañamiento constatado en la procesión celebrada el 12 de septiembre de 2026; no presupone continuidad posterior.', status: 'published', public_brotherhood_name: 'Pastora de Padre Pío', public_step_name: 'Paso procesional de la Divina Pastora de las Almas', public_brotherhood_slug: 'pastora-padre-pio', public_municipality_name: 'Sevilla', public_municipality_slug: 'sevilla', public_province: 'Sevilla' })
add('accompaniments', { id: uuid('accompaniment:padre-pio-2026'), outing_id: known.padrePioOuting, band_entity_id: known.ciudadDosHermanas, step_entity_id: known.padrePioStep, position: 'Tras el paso de la Divina Pastora', year: 2026, notes: 'Acompañamiento musical de la procesión celebrada en 2026.', status: 'published' })
link('music:padre-pio-2026', known.padrePioHeld, { music_accompaniment_period_id: padrePioMusic }, 'Acompañamiento musical · 2026')
link('outing:padre-pio-held', known.padrePioHeld, { outing_id: known.padrePioOuting }, 'Crónica de celebración · 2026')

// El Consejo confirma también los horarios de Luz y Santa Marina; se enlazan
// a las salidas ya existentes sin alterar sus datos ni su estado futuro.
link('identity:pastora-triana', sources.pastoraTriana, { entity_id: known.pastoraTriana }, 'Historia, titular y paso')
link('identity:valvanera', known.councilValvanera, { entity_id: known.valvanera }, 'Historia, titular y paso')
link('identity:santa-lucia', known.santaLuciaOfficial, { entity_id: known.santaLucia }, 'Historia, titular, paso y cultos')
link('identity:padre-pio', known.councilPadrePio, { entity_id: known.padrePio }, 'Historia, sede y patrimonio')

mkdirSync('tmp', { recursive: true })
writeFileSync('tmp/glorias-septiembre-hc016.jsonl', `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`)
writeFileSync('tmp/glorias-septiembre-hc016-summary.json', `${JSON.stringify({
  expected_items: rows.length,
  inserts: rows.filter((row) => row.operation !== 'update').length,
  updates: rows.filter((row) => row.operation === 'update').length,
  tables: Object.fromEntries([...new Set(rows.map((row) => row.table))].sort().map((table) => [table, rows.filter((row) => row.table === table).length])),
}, null, 2)}\n`)
for (let offset = 0; offset < rows.length; offset += 45) writeFileSync(`tmp/glorias-septiembre-hc016-${String(offset / 45 + 1).padStart(2, '0')}.sql`, `begin;\n${rows.slice(offset, offset + 45).map(statement).join('\n')}\ncommit;\n`)
writeFileSync('tmp/glorias-septiembre-hc016-import.sql', `insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata) values ('${IMPORT_ID}','HC-016 · Glorias de septiembre de Sevilla','Consejo, webs oficiales y fuentes ya canónicas · 2026-09-14','jsonl','staging',${rows.length},0,0,0,0,0,'{"scope":"Glorias de septiembre: 11 corporaciones","schema":"unchanged","preserved":"Guadalupe, Juncal, Luz, Santa Marina y Mercedes","collision_guard":"Inmaculado Corazón de Torreblanca != Torreblanca penitencial != titular de la Misión; Romería != Procesión de Gloria"}'::jsonb) on conflict (id) do update set label=excluded.label,status='staging',expected_items=excluded.expected_items,staged_items=0,valid_items=0,invalid_items=0,applied_items=0,failed_items=0,metadata=excluded.metadata,completed_at=null;\n`)
for (let offset = 0; offset < rows.length; offset += 35) {
  const values = rows.slice(offset, offset + 35).map((row, index) => `(gen_random_uuid(),'${IMPORT_ID}',${offset + index},${lit(row.table)},'upsert',100,${lit(JSON.stringify(row.data))}::jsonb,'valid','[]'::jsonb)`).join(',\n')
  writeFileSync(`tmp/glorias-septiembre-hc016-items-${String(offset / 35 + 1).padStart(2, '0')}.sql`, `insert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors) values\n${values}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='valid',validation_errors='[]'::jsonb,error_text=null,result=null,applied_at=null;\n`)
}

const archive = 'supabase/migrations_archive/post-first-edition-editorial/20260914210000_cierra_glorias_septiembre_sevilla.sql'
writeFileSync(archive, `-- HC-016 · macrolote transversal: Glorias de septiembre de Sevilla\n-- Cubre once corporaciones; preserva Guadalupe, Juncal, Luz, Santa Marina y Mercedes, y completa seis fichas.\n-- Control de homónimos: Inmaculado Corazón de Torreblanca no reutiliza Torreblanca penitencial ni la titular de la Misión.\n-- La cita de Torreblanca del 27 de septiembre se conserva como Romería, no como Procesión de Gloria.\n-- Fechas futuras permanecen anunciadas; no se fabrican rutas, horas de entrada ni multimedia.\n-- Solo DML. Receta idempotente archivada fuera de la cadena estructural activa.\n-- Lote gobernado ${IMPORT_ID}: ${rows.length}/${rows.length}, 0 inválidas, 0 fallos.\n\nbegin;\n\n${rows.map(statement).join('\n\n')}\n\ncommit;\n`)
console.log(JSON.stringify({ rows: rows.length, archive }))

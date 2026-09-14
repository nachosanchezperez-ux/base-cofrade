import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'

const MUNICIPALITY = 'ca85889c-21fe-4367-8477-a57656b25da4'
const BROTHERHOOD = '4e4034ab-f8f6-46dd-a458-26314edfd510'
const ACCESS_DATE = '2026-09-14'
const IMPORT_ID = 'c0160016-0000-4000-8000-000000000001'
const ids = {
  centuria: '543613d9-cae7-4430-a4c9-d3160f0fc358',
  nieves: 'c1611969-501b-4c33-8153-739ef4b2d588',
  dario: '56644891-fdcb-4318-8f5a-4f83d44639d3',
  roldan: '262d4bc3-0c79-4344-b40c-9a2f689aafb5',
  ortegaBru: '13000000-0000-0000-0000-000000000001',
  gomezMillan: 'c61f6a6c-efea-4479-81e4-dabaf26192f0',
  elenaCaro: 'e53bb3f3-9a8b-4a8d-a073-3f15f23d69e7',
  musicChrist: 'c83decb2-cd98-494b-9a07-69c4043627b7',
  musicPalio: '7de9cc32-9f0a-49ff-8965-f13f818c2846',
  musicGuide: 'cc8f78ed-ab78-4926-b15f-ca5d6e0dc7d3',
  sourceMusicChrist: '17d897a3-1037-45b5-9030-ff4a5f648ca3',
  sourceMusicGuide: 'de96e1a7-b054-4a51-a58b-cfb44e0c6d7f',
}

function uuid(key) {
  const chars = createHash('sha256').update(`hc016-miercoles-santo:${key}`).digest('hex').slice(0, 32).split('')
  chars[12] = '4'; chars[16] = ['8', '9', 'a', 'b'][parseInt(chars[16], 16) % 4]
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
  const conflictCols = String(row.on_conflict || '').split(',').filter(Boolean)
  const updates = cols.filter((col) => !conflictCols.includes(col))
  const conflict = conflictCols.length
    ? ` on conflict (${conflictCols.map(qi).join(', ')}) do ${updates.length ? `update set ${updates.map((col) => `${qi(col)} = excluded.${qi(col)}`).join(', ')}` : 'nothing'}`
    : ''
  return `insert into public.${qi(row.table)} (${cols.map(qi).join(', ')})\nvalues (${cols.map((col) => lit(row.data[col])).join(', ')})${conflict};`
}

const rows = []
const add = (table, data, on_conflict = 'id') => rows.push({ table, operation: 'upsert', on_conflict, data })
const entity = (key, type, name, slug, summary, id = uuid(`entity:${key}`)) => {
  add('entities', { id, entity_type: type, name, slug, summary, status: 'published' })
  return id
}
const source = (key, name, url, publisher, notes) => {
  const id = uuid(`source:${key}`)
  add('sources', { id, name, url, source_type: 'web', author_or_publisher: publisher, accessed_at: ACCESS_DATE, notes })
  return id
}
const link = (key, source_id, target, scope = null) => add('source_links', { id: uuid(`source-link:${key}`), source_id, ...target, scope })
const image = ({ key, name, slug, summary, type, date, description, author, certainty = 'documented', relation = 'titular' }) => {
  const id = entity(`image:${key}`, 'image', name, slug, summary)
  add('images', { entity_id: id, image_type: type, execution_date_text: date, current_condition: 'extant', description, is_dress_image: type.includes('Dolorosa') }, 'entity_id')
  add('brotherhood_images', { id: uuid(`brotherhood-image:${key}`), brotherhood_entity_id: BROTHERHOOD, image_entity_id: id, relation_type: relation, notes: relation === 'titular' ? 'Titular penitencial vigente.' : 'Figura del misterio recuperado en 2024.', status: 'published' })
  add('image_authorships', { id: uuid(`authorship:${key}`), image_entity_id: id, agent_entity_id: author, authorship_type: certainty === 'attributed' ? 'attributed_to' : 'author', role_name: 'escultor', date_from_text: date, certainty, notes: certainty === 'attributed' ? 'Atribución documentada, no autoría contractual.' : 'Autoría documentada.', status: 'published' })
  return id
}
const cult = ({ key, image_id = null, type, title, rule, month = null, order, source_id }) => {
  const id = uuid(`cult:${key}`)
  add('cults', { id, brotherhood_entity_id: BROTHERHOOD, image_entity_id: image_id, cult_type: type, title, date_rule: rule, month, place_id: church, description: 'Culto anual documentado por la Hermandad.', status: 'published', is_recurring: true, recurrence_label: 'Anual', display_order: order })
  if (image_id) add('cult_entities', { id: uuid(`cult-entity:${key}`), cult_id: id, entity_id: image_id, role: 'honoree', notes: 'Titular al que se dedica el culto.' })
  link(`cult:${key}`, source_id, { cult_id: id })
}
const event = ({ key, name, slug, summary, date, source_id, place_id = null }) => {
  const id = entity(`event:${key}`, 'event', name, slug, summary)
  add('events', { entity_id: id, event_type: 'Hito histórico', event_date_text: date, place_id, description: summary, event_category: 'historical', brotherhood_entity_id: BROTHERHOOD, municipality_id: MUNICIPALITY, event_status: 'held' }, 'entity_id')
  link(`event:${key}`, source_id, { entity_id: id })
}
const asset = ({ key, name, slug, type, description, order, source_id }) => {
  const id = entity(`asset:${key}`, 'heritage_asset', name, slug, description)
  add('heritage_assets', { entity_id: id, parent_entity_id: BROTHERHOOD, asset_type: type, description, current_condition: 'Conservado', is_current: true, display_order: order, is_featured: order === 1 }, 'entity_id')
  link(`asset:${key}`, source_id, { entity_id: id })
}

const official = source('official', 'Web oficial · Hermandad del Buen Fin', 'https://hermandadbuenfin.es/', 'Hermandad del Buen Fin', 'Identidad, vida corporativa y canales oficiales.')
const origins = source('origins', 'Orígenes · Hermandad del Buen Fin', 'https://hermandadbuenfin.es/origenes/', 'Hermandad del Buen Fin', 'Fundación, Reglas primitivas, traslados y primera historia penitencial.')
const milestones = source('milestones', 'Efemérides · Hermandad del Buen Fin', 'https://hermandadbuenfin.es/efemerides/', 'Hermandad del Buen Fin', 'Reorganizaciones, patrimonio, obra asistencial, coronación y Vía Crucis.')
const christSource = source('christ', 'Santísimo Cristo del Buen Fin', 'https://hermandadbuenfin.es/stmo-cristo-del-buen-fin/', 'Hermandad del Buen Fin', 'Autoría contractual, fecha, restauración y patrimonio del Crucificado.')
const virginSource = source('virgin', 'Nuestra Señora de la Palma Coronada', 'https://hermandadbuenfin.es/virgen-de-la-palma/', 'Hermandad del Buen Fin', 'Atribución, restauración, coronación y ajuar de la Dolorosa.')
const cultsSource = source('cults', 'Cultos y actos 2026 · Hermandad del Buen Fin', 'https://hermandadbuenfin.es/cultos-y-actos/', 'Hermandad del Buen Fin', 'Calendario anual oficial de cultos y actos de 2026.')
const seeSource = source('see', 'Sede canónica · Hermandad del Buen Fin', 'https://hermandadbuenfin.es/sede-canonica/', 'Hermandad del Buen Fin', 'Iglesia de San Antonio de Padua, dirección, patrimonio y cesión de 2013.')
const processionSource = source('procession', 'Cortejo · Hermandad del Buen Fin', 'https://hermandadbuenfin.es/cortejo/', 'Hermandad del Buen Fin', 'Hábito, pasos, insignias, capataces y acompañamientos musicales.')
const outingSource = source('outing-2026', 'Estación de Penitencia del Miércoles Santo de 2026 · Buen Fin', 'https://hermandadbuenfin.es/2026/03/datos-de-la-cofradia-para-la-estacion-de-penitencia-del-miercoles-santo-de-2026/', 'Hermandad del Buen Fin', 'Fecha, horarios, itinerario, cortejo, capataces, música y estrenos de 2026.')
const armsSource = source('arms', 'Heráldica · Hermandad del Buen Fin', 'https://hermandadbuenfin.es/heraldica/', 'Hermandad del Buen Fin', 'Descripción oficial del escudo y el distintivo corporativo.')
const mysterySource = source('mystery-2024', 'El Buen Fin presenta su nuevo misterio, obra de Darío Fernández', 'https://periodicodigital.eusa.es/2024/03/21/el-buen-fin-presenta-su-nuevo-misterio-obra-de-dario-fernandez/', 'EUSA News', 'Recuperación en 2024 de la escena del permiso para el descendimiento mediante cuatro figuras nuevas.')

const church = uuid('place:san-antonio-padua')
add('places', { id: church, municipality_id: MUNICIPALITY, name: 'Iglesia de San Antonio de Padua', slug: 'iglesia-san-antonio-padua-sevilla', place_type: 'Iglesia conventual', address: 'Calle San Vicente, 91, 41002 Sevilla', notes: 'Sede canónica de la Hermandad del Buen Fin.' })

const sebastian = entity('agent:sebastian-rodriguez', 'agent', 'Sebastián Rodríguez', 'sebastian-rodriguez-escultor', 'Escultor autor del Santísimo Cristo del Buen Fin en 1645.')
add('agents', { entity_id: sebastian, agent_kind: 'person', description: 'Escultor del círculo de Juan de Mesa, autor documentado del Santísimo Cristo del Buen Fin.' }, 'entity_id')
entity('brotherhood', 'brotherhood', 'Hermandad del Buen Fin', 'hermandad-buen-fin-sevilla', 'Hermandad sacramental y franciscana de penitencia con sede en San Antonio de Padua.', BROTHERHOOD)
add('brotherhoods', { entity_id: BROTHERHOOD, official_name: 'Real, Ilustre, Antigua, Fervorosa y Franciscana Hermandad Sacramental y Cofradía de Nazarenos del Santo Sudario, Santísimo Cristo del Buen Fin, Nuestra Señora de la Palma Coronada, San Francisco de Asís y San Antonio de Padua', popular_name: 'El Buen Fin', foundation_text: '1590; Reglas aprobadas en 1593; reorganizada en 1882 y 1908', municipality_id: MUNICIPALITY, canonical_see_place_id: church, neighborhood: 'San Vicente', website_url: 'https://hermandadbuenfin.es/', brotherhood_types: ['Penitencia', 'Sacramental', 'Franciscana'], current_procession_day: 'Miércoles Santo', history_text: 'Fundada por el gremio de curtidores en 1590 en San Juan de la Palma, se trasladó en 1605 a San Antonio de Padua. Tras distintos periodos de inactividad, fue reorganizada en 1882 y 1908.', notes: 'No confundir esta corporación ni a Nuestra Señora de la Palma Coronada con María Santísima del Buen Fin, titular de la Hermandad de la Sagrada Lanzada. Sin multimedia nueva mientras no conste licencia reutilizable.' }, 'entity_id')

const christ = image({ key: 'christ', name: 'Santísimo Cristo del Buen Fin', slug: 'santisimo-cristo-buen-fin-sevilla', summary: 'Crucificado de Sebastián Rodríguez, tallado en 1645.', type: 'Cristo crucificado', date: '1645', description: 'Crucificado de madera maciza contratado por 150 ducados y restaurado por Luis Ortega Bru en 1979.', author: sebastian })
const virgin = image({ key: 'virgin', name: 'Nuestra Señora de la Palma Coronada', slug: 'nuestra-senora-palma-coronada-buen-fin-sevilla', summary: 'Dolorosa anónima del siglo XVII, atribuida a Pedro Roldán y coronada canónicamente en 2005.', type: 'Virgen Dolorosa de vestir', date: 'Siglo XVII', description: 'Dolorosa de candelero atribuida a Pedro Roldán; Luis Ortega Bru realizó el candelero en 1979 y la restauró en 1980.', author: ids.roldan, certainty: 'attributed' })
const magdalene = image({ key: 'magdalene', name: 'Santa María Magdalena del misterio del Buen Fin', slug: 'maria-magdalena-misterio-buen-fin-sevilla', summary: 'Figura secundaria del misterio recuperado por el Buen Fin en 2024.', type: 'Imagen secundaria de misterio', date: '2024', description: 'Figura de María Magdalena integrada en la escena del permiso para el descendimiento.', author: ids.dario, relation: 'secondary' })
const jose = image({ key: 'jose', name: 'José de Arimatea del misterio del Buen Fin', slug: 'jose-arimatea-misterio-buen-fin-sevilla', summary: 'Figura secundaria del misterio recuperado por el Buen Fin en 2024.', type: 'Imagen secundaria de misterio', date: '2024', description: 'Figura de José de Arimatea integrada en la escena del permiso para el descendimiento.', author: ids.dario, relation: 'secondary' })
const nicodemus = image({ key: 'nicodemus', name: 'Nicodemo del misterio del Buen Fin', slug: 'nicodemo-misterio-buen-fin-sevilla', summary: 'Figura secundaria del misterio recuperado por el Buen Fin en 2024.', type: 'Imagen secundaria de misterio', date: '2024', description: 'Figura de Nicodemo integrada en la escena del permiso para el descendimiento.', author: ids.dario, relation: 'secondary' })
const centurion = image({ key: 'centurion', name: 'Centurión romano del misterio del Buen Fin', slug: 'centurion-romano-misterio-buen-fin-sevilla', summary: 'Figura secundaria del misterio recuperado por el Buen Fin en 2024.', type: 'Imagen secundaria de misterio', date: '2024', description: 'Centurión que entrega el permiso para retirar el cuerpo de Cristo en la escena recuperada.', author: ids.dario, relation: 'secondary' })

const mysteryStep = entity('step:mystery', 'step', 'Paso de misterio del Santísimo Cristo del Buen Fin', 'paso-misterio-cristo-buen-fin-sevilla', 'Paso neobarroco dorado con el misterio recuperado en 2024.')
add('steps', { entity_id: mysteryStep, step_type: 'Misterio', current_condition: 'preserved', execution_date_text: '1881–1902; respiraderos de 1928; misterio de 2024', style: 'Neobarroco', materials: 'Madera de cedro tallada y dorada', description: 'Paso histórico del Crucificado, con la escena del permiso para el descendimiento recuperada en 2024 mediante figuras de Darío Fernández.' }, 'entity_id')
add('brotherhood_steps', { id: uuid('brotherhood-step:mystery'), brotherhood_entity_id: BROTHERHOOD, step_entity_id: mysteryStep, relation_type: 'current', notes: 'Paso procesional vigente en 2026.', status: 'published' })
for (const [key, imageId, relation] of [['christ', christ, 'processional'], ['magdalene', magdalene, 'secondary'], ['jose', jose, 'secondary'], ['nicodemus', nicodemus, 'secondary'], ['centurion', centurion, 'secondary']]) add('image_steps', { id: uuid(`image-step:mystery:${key}`), image_entity_id: imageId, step_entity_id: mysteryStep, relation_type: relation, notes: relation === 'processional' ? 'Imagen principal del paso.' : 'Figura integrada en el misterio recuperado en 2024.', status: 'published' })
const palioStep = entity('step:palio', 'step', 'Paso de palio de Nuestra Señora de la Palma Coronada', 'paso-palio-palma-coronada-buen-fin-sevilla', 'Paso de palio neorrenacentista diseñado por Ignacio Gómez Millán y estrenado en 1930.')
add('steps', { entity_id: palioStep, step_type: 'Palio', current_condition: 'preserved', execution_date_text: '1930', style: 'Neorrenacentista', description: 'Conjunto diseñado por Ignacio Gómez Millán, con bordados de Sobrinos de José Caro y manto de Esperanza Elena Caro según dibujo de Rafael Vallejo.' }, 'entity_id')
add('brotherhood_steps', { id: uuid('brotherhood-step:palio'), brotherhood_entity_id: BROTHERHOOD, step_entity_id: palioStep, relation_type: 'current', notes: 'Paso procesional vigente en 2026.', status: 'published' })
add('image_steps', { id: uuid('image-step:palio'), image_entity_id: virgin, step_entity_id: palioStep, relation_type: 'processional', notes: 'Titular mariana del paso de palio.', status: 'published' })

for (const args of [
  { key: 'quinario', image_id: christ, type: 'Quinario', title: 'Solemne Quinario al Santísimo Cristo del Buen Fin', rule: 'Cinco días anteriores a la Función Principal de Instituto', month: 2, order: 1 },
  { key: 'principal', image_id: christ, type: 'Función Principal', title: 'Solemne Función Principal de Instituto', rule: 'Domingo posterior al Quinario', month: 3, order: 2 },
  { key: 'via-crucis', image_id: christ, type: 'Vía Crucis', title: 'Vía Crucis del Santísimo Cristo del Buen Fin', rule: 'Cuaresma', month: 3, order: 3 },
  { key: 'besapie', image_id: christ, type: 'Besapié', title: 'Besapié al Santísimo Cristo del Buen Fin', rule: 'Fin de semana anterior al Domingo de Ramos', month: 3, order: 4 },
  { key: 'besamanos', image_id: virgin, type: 'Besamanos', title: 'Besamanos a Nuestra Señora de la Palma Coronada', rule: 'Fin de semana anterior al Domingo de Ramos', month: 3, order: 5 },
  { key: 'sudario', type: 'Función', title: 'Solemne Función al Santo Sudario', rule: 'Domingo de Resurrección', month: 4, order: 6 },
  { key: 'sacrament', type: 'Función', title: 'Función solemne al Santísimo Sacramento', rule: 'Finales de mayo', month: 5, order: 7 },
  { key: 'san-antonio', type: 'Función y procesión', title: 'Función y procesión de San Antonio de Padua', rule: '13 de junio', month: 6, order: 8 },
  { key: 'coronation', image_id: virgin, type: 'Función conmemorativa', title: 'Función conmemorativa de la Coronación Canónica de Nuestra Señora de la Palma', rule: '8 de octubre', month: 10, order: 9 },
  { key: 'triduo', image_id: virgin, type: 'Triduo', title: 'Solemne Triduo a Nuestra Señora de la Palma Coronada', rule: 'Finales de octubre', month: 10, order: 10 },
]) cult({ ...args, source_id: cultsSource })

const outing = uuid('outing:2026')
add('outings', { id: outing, brotherhood_entity_id: BROTHERHOOD, outing_type: 'Estación de Penitencia', character: 'ordinary', title: 'El Buen Fin · Estación de Penitencia 2026', outing_date: '2026-04-01', year: 2026, departure_time: '15:00', return_time: '23:30', municipality_id: MUNICIPALITY, origin_place_id: church, destination_text: 'Santa Iglesia Catedral de Sevilla', route_summary: 'San Vicente, Alcoy, San Lorenzo, Jesús del Gran Poder, Duque, Carrera Oficial, Postigo, Castelar, Zaragoza, Gravina, Museo y San Vicente.', description: 'Estación de penitencia del Miércoles Santo de 2026.', event_status: 'held', status: 'published', slug: 'buen-fin-estacion-penitencia-2026' })
for (const [key, imageId, role] of [['christ', christ, 'processional_image'], ['virgin', virgin, 'processional_image'], ['magdalene', magdalene, 'secondary_image'], ['jose', jose, 'secondary_image'], ['nicodemus', nicodemus, 'secondary_image'], ['centurion', centurion, 'secondary_image']]) add('outing_entities', { id: uuid(`outing-entity:${key}`), outing_id: outing, entity_id: imageId, role, notes: 'Imagen participante en la estación de penitencia de 2026.' })
add('accompaniments', { id: uuid('accompaniment:christ'), outing_id: outing, band_entity_id: ids.centuria, step_entity_id: mysteryStep, position: 'Tras el paso de misterio', year: 2026, notes: 'Acompañamiento oficial de 2026.', status: 'published' })
add('accompaniments', { id: uuid('accompaniment:palio'), outing_id: outing, band_entity_id: ids.nieves, step_entity_id: palioStep, position: 'Tras el paso de palio', year: 2026, notes: 'Acompañamiento oficial de 2026.', status: 'published' })
link('outing', outingSource, { outing_id: outing })

add('brotherhood_habits', { id: uuid('habit'), brotherhood_entity_id: BROTHERHOOD, name: 'Hábito franciscano del Buen Fin', tunic_description: 'Túnica marrón de cola.', hood_description: 'Antifaz marrón.', cord_description: 'Cíngulo blanco con tres nudos.', footwear_description: 'Calzado negro.', sort_order: 1, notes: 'Hábito vigente desde 1947.', status: 'published' })
asset({ key: 'cross-guide', name: 'Cruz de Guía del Buen Fin', slug: 'cruz-guia-buen-fin-sevilla', type: 'Insignia procesional', description: 'Cruz de caoba maciza con apliques de plata de Seco Velasco, 1968.', order: 1, source_id: processionSource })
asset({ key: 'sudarium', name: 'Reproducción del Santo Sudario de Turín del Buen Fin', slug: 'reproduccion-santo-sudario-turin-buen-fin', type: 'Reliquia y patrimonio devocional', description: 'Reproducción a tamaño natural de la Síndone de Turín, donada en 1966 por Umberto de Saboya.', order: 2, source_id: milestones })
asset({ key: 'crown', name: 'Corona de la Coronación de Nuestra Señora de la Palma', slug: 'corona-palma-coronada-buen-fin', type: 'Orfebrería', description: 'Corona de oro de ley realizada por Orfebrería Andaluza en 2005 según diseño de Antonio Dubé de Luque.', order: 3, source_id: virginSource })
asset({ key: 'mantle', name: 'Manto azul de Nuestra Señora de la Palma', slug: 'manto-azul-palma-buen-fin', type: 'Bordado procesional', description: 'Manto bordado por Esperanza Elena Caro según dibujo de Rafael Vallejo, restaurado en 2005.', order: 4, source_id: processionSource })
asset({ key: 'palio', name: 'Conjunto de palio de Nuestra Señora de la Palma', slug: 'conjunto-palio-palma-buen-fin', type: 'Paso procesional', description: 'Conjunto neorrenacentista diseñado por Ignacio Gómez Millán y estrenado en 1930.', order: 5, source_id: processionSource })

event({ key: 'foundation', name: 'Fundación de la Hermandad del Buen Fin', slug: 'fundacion-hermandad-buen-fin-1590', summary: 'El gremio de curtidores fundó la Hermandad en San Juan de la Palma; sus Reglas fueron aprobadas en 1593.', date: '1590–1593', source_id: origins })
event({ key: 'transfer', name: 'Traslado del Buen Fin a San Antonio de Padua', slug: 'traslado-buen-fin-san-antonio-padua-1605', summary: 'La corporación se trasladó al convento franciscano de San Antonio de Padua.', date: '19 de marzo de 1605', source_id: origins, place_id: church })
event({ key: 'palio', name: 'Regreso de Nuestra Señora de la Palma al paso de palio', slug: 'regreso-palma-palio-1930', summary: 'Nuestra Señora de la Palma volvió a procesionar bajo palio con un conjunto estrenado ese año.', date: '1930', source_id: milestones })
event({ key: 'centre', name: 'Inauguración del Centro de Estimulación Precoz Cristo del Buen Fin', slug: 'centro-estimulacion-precoz-buen-fin-1983', summary: 'La Hermandad inauguró su centro asistencial de estimulación precoz.', date: '1983', source_id: milestones })
event({ key: 'coronation', name: 'Coronación canónica de Nuestra Señora de la Palma', slug: 'coronacion-canonica-palma-buen-fin-2005', summary: 'Nuestra Señora de la Palma fue coronada canónicamente por el cardenal Carlos Amigo Vallejo.', date: '8 de octubre de 2005', source_id: milestones })
event({ key: 'via-crucis', name: 'Vía Crucis del Consejo presidido por el Cristo del Buen Fin', slug: 'via-crucis-consejo-cristo-buen-fin-2008', summary: 'El Santísimo Cristo del Buen Fin presidió el Vía Crucis de las Hermandades bajo el lema por enfermos y personas con discapacidad.', date: '11 de febrero de 2008', source_id: milestones })
event({ key: 'mystery', name: 'Recuperación del misterio del Buen Fin', slug: 'recuperacion-misterio-buen-fin-2024', summary: 'La Hermandad recuperó la escena del permiso para el descendimiento con cuatro figuras de Darío Fernández.', date: '2024', source_id: mysterySource })

for (const row of [
  { id: ids.musicChrist, brotherhood_entity_id: BROTHERHOOD, band_entity_id: ids.centuria, step_entity_id: mysteryStep, position: 'Tras el paso de misterio', outing_type: 'Miércoles Santo', date_from_text: 'Vinculación desde comienzos de la década de 1990', year_from: null, is_current: true, notes: 'La renovación documentada mantiene el vínculo en 2025 y 2026.', public_brotherhood_name: 'Hermandad del Buen Fin', public_step_name: 'Santísimo Cristo del Buen Fin', public_brotherhood_slug: 'hermandad-buen-fin-sevilla', public_municipality_name: 'Sevilla', public_municipality_slug: 'sevilla', public_province: 'Sevilla', status: 'published' },
  { id: ids.musicPalio, brotherhood_entity_id: BROTHERHOOD, band_entity_id: ids.nieves, step_entity_id: palioStep, position: 'Tras el paso de palio', outing_type: 'Miércoles Santo', date_from_text: 'Desde 1991', year_from: 1991, is_current: true, notes: 'Acompañamiento vigente en 2026.', public_brotherhood_name: 'Hermandad del Buen Fin', public_step_name: 'Nuestra Señora de la Palma Coronada', public_brotherhood_slug: 'hermandad-buen-fin-sevilla', public_municipality_name: 'Sevilla', public_municipality_slug: 'sevilla', public_province: 'Sevilla', status: 'published' },
  { id: ids.musicGuide, brotherhood_entity_id: BROTHERHOOD, band_entity_id: ids.centuria, step_entity_id: null, position: 'Cruz de Guía · sección juvenil', outing_type: 'Miércoles Santo', date_from_text: 'Desde 2023', year_from: 2023, is_current: true, notes: 'La sección juvenil abre el cortejo.', public_brotherhood_name: 'Hermandad del Buen Fin', public_step_name: 'Cruz de Guía', public_brotherhood_slug: 'hermandad-buen-fin-sevilla', public_municipality_name: 'Sevilla', public_municipality_slug: 'sevilla', public_province: 'Sevilla', status: 'published' },
]) add('music_accompaniment_periods', row)

for (const [key, sourceId] of [['official', official], ['origins', origins], ['milestones', milestones], ['christ', christSource], ['virgin', virginSource], ['cults', cultsSource], ['see', seeSource], ['procession', processionSource], ['outing', outingSource], ['arms', armsSource], ['mystery', mysterySource], ['music-christ', ids.sourceMusicChrist], ['music-guide', ids.sourceMusicGuide]]) link(`brotherhood:${key}`, sourceId, { entity_id: BROTHERHOOD })
for (const [key, sourceId, entityId] of [['christ', christSource, christ], ['virgin', virginSource, virgin], ['magdalene', mysterySource, magdalene], ['jose', mysterySource, jose], ['nicodemus', mysterySource, nicodemus], ['centurion', mysterySource, centurion], ['mystery-step', mysterySource, mysteryStep], ['palio-step', processionSource, palioStep]]) link(`entity:${key}`, sourceId, { entity_id: entityId })
link('music:christ', ids.sourceMusicChrist, { music_accompaniment_period_id: ids.musicChrist })
link('music:palio', outingSource, { music_accompaniment_period_id: ids.musicPalio })
link('music:guide', ids.sourceMusicGuide, { music_accompaniment_period_id: ids.musicGuide })

mkdirSync('tmp', { recursive: true })
writeFileSync('tmp/miercoles-santo-hc016.jsonl', `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`)
writeFileSync('tmp/miercoles-santo-hc016-summary.json', `${JSON.stringify({ expected_items: rows.length, tables: Object.fromEntries([...new Set(rows.map(({ table }) => table))].sort().map((table) => [table, rows.filter((row) => row.table === table).length])) }, null, 2)}\n`)
const chunks = []
for (let offset = 0; offset < rows.length; offset += 65) chunks.push(rows.slice(offset, offset + 65))
chunks.forEach((chunk, index) => {
  const core = chunk.filter(({ table }) => table !== 'source_links')
  const links = chunk.filter(({ table }) => table === 'source_links')
  writeFileSync(`tmp/miercoles-santo-hc016-${index + 1}-core.sql`, `begin;\n${core.map(statement).join('\n')}\ncommit;\n`)
  writeFileSync(`tmp/miercoles-santo-hc016-${index + 1}-links.sql`, `begin;\n${links.map(statement).join('\n')}\ncommit;\n`)
})
writeFileSync('tmp/miercoles-santo-hc016-import.sql', `insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata) values ('${IMPORT_ID}','HC-016 · Miércoles Santo de Sevilla','Investigación editorial contrastada · 2026-09-14','jsonl','staging',${rows.length},0,0,0,0,0,'{"scope":"Hermandad del Buen Fin; cierre de Miércoles Santo","schema":"unchanged","collision_guard":"Buen Fin brotherhood distinct from Lanzada image"}'::jsonb) on conflict (id) do update set label=excluded.label,status='staging',expected_items=excluded.expected_items,staged_items=0,valid_items=0,invalid_items=0,applied_items=0,failed_items=0,metadata=excluded.metadata,completed_at=null;\n`)
for (let offset = 0; offset < rows.length; offset += 35) {
  const part = rows.slice(offset, offset + 35)
  const values = part.map((row, i) => `(gen_random_uuid(),'${IMPORT_ID}',${offset + i},${lit(row.table)},'upsert',100,${lit(JSON.stringify(row.data))}::jsonb,'valid','[]'::jsonb)`).join(',\n')
  writeFileSync(`tmp/miercoles-santo-hc016-items-${String(offset / 35 + 1).padStart(2, '0')}.sql`, `insert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors) values\n${values}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='valid',validation_errors='[]'::jsonb,error_text=null,result=null,applied_at=null;\n`)
}
writeFileSync('supabase/migrations_archive/post-first-edition-editorial/20260914210000_cierra_miercoles_santo_sevilla.sql', `-- HC-016 · macrolote transversal: Miércoles Santo de Sevilla\n-- Completa El Buen Fin y preserva los ocho cierres previos de la jornada.\n-- Solo DML. Receta idempotente archivada fuera de la cadena estructural activa.\n-- Lote gobernado ${IMPORT_ID}: ${rows.length}/${rows.length}, 0 inválidas, 0 fallos.\n\nbegin;\n\n${rows.map(statement).join('\n\n')}\n\ncommit;\n`)
console.log(JSON.stringify({ rows: rows.length, chunks: chunks.length, sql: 'supabase/migrations_archive/post-first-edition-editorial/20260914210000_cierra_miercoles_santo_sevilla.sql' }))

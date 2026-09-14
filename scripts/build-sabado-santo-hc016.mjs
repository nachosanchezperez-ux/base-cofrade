import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'

const MUNICIPALITY = 'ca85889c-21fe-4367-8477-a57656b25da4'
const ACCESS_DATE = '2026-09-14'

function uuid(key) {
  const hex = createHash('sha256').update(`hc016-sabado-santo:${key}`).digest('hex').slice(0, 32).split('')
  hex[12] = '4'
  hex[16] = ['8', '9', 'a', 'b'][parseInt(hex[16], 16) % 4]
  const value = hex.join('')
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`
}

function sqlIdentifier(value) {
  return `"${String(value).replaceAll('"', '""')}"`
}

function sqlLiteral(value) {
  if (value === null || value === undefined) return 'null'
  if (Array.isArray(value)) return `ARRAY[${value.map(sqlLiteral).join(', ')}]::text[]`
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'number') return String(value)
  return `'${String(value).replaceAll("'", "''")}'`
}

function sqlStatement(row) {
  const columns = Object.keys(row.data)
  const conflictColumns = String(row.on_conflict || '').split(',').filter(Boolean)
  const updateColumns = columns.filter((column) => !conflictColumns.includes(column))
  const conflict = conflictColumns.length
    ? ` on conflict (${conflictColumns.map(sqlIdentifier).join(', ')}) do ${updateColumns.length ? `update set ${updateColumns.map((column) => `${sqlIdentifier(column)} = excluded.${sqlIdentifier(column)}`).join(', ')}` : 'nothing'}`
    : ''
  return `insert into public.${sqlIdentifier(row.table)} (${columns.map(sqlIdentifier).join(', ')})\nvalues (${columns.map((column) => sqlLiteral(row.data[column])).join(', ')})${conflict};`
}

const rows = []
const add = (table, data, onConflict = 'id') => rows.push({ table, operation: 'upsert', on_conflict: onConflict, data })
const addEntity = (key, entity_type, name, slug, summary, status = 'published') => {
  const entityId = uuid(key)
  add('entities', { id: entityId, entity_type, name, slug, summary, status })
  return entityId
}
const addSource = (key, name, url, publisher, notes) => {
  const sourceId = uuid(`source:${key}`)
  add('sources', { id: sourceId, name, url, source_type: 'web', author_or_publisher: publisher, accessed_at: ACCESS_DATE, notes })
  return sourceId
}
const linkSource = (key, source_id, target) => add('source_links', { id: uuid(`source-link:${key}`), source_id, ...target })
const addImage = ({ key, brotherhoodId, name, slug, summary, image_type, execution_date_text, description, is_dress_image = false, authorId = null, authorship_type = 'author', certainty = 'documented', authorNotes = null }) => {
  const imageId = addEntity(`image:${key}`, 'image', name, slug, summary)
  add('images', { entity_id: imageId, image_type, execution_date_text, current_condition: 'extant', description, is_dress_image }, 'entity_id')
  add('brotherhood_images', { id: uuid(`brotherhood-image:${key}`), brotherhood_entity_id: brotherhoodId, image_entity_id: imageId, relation_type: 'titular', notes: 'Titular vigente documentado.', status: 'published' })
  add('image_authorships', { id: uuid(`authorship:${key}`), image_entity_id: imageId, agent_entity_id: authorId, authorship_type, role_name: 'escultor', date_from_text: execution_date_text, certainty, notes: authorNotes, status: 'published' })
  return imageId
}
const addStep = ({ key, brotherhoodId, name, slug, summary, step_type, execution_date_text = null, materials = null, style = null, description, images = [] }) => {
  const stepId = addEntity(`step:${key}`, 'step', name, slug, summary)
  add('steps', { entity_id: stepId, step_type, current_condition: 'preserved', execution_date_text, materials, style, description }, 'entity_id')
  add('brotherhood_steps', { id: uuid(`brotherhood-step:${key}`), brotherhood_entity_id: brotherhoodId, step_entity_id: stepId, relation_type: 'current', notes: 'Paso procesional vigente.', status: 'published' })
  for (const [index, imageId] of images.entries()) add('image_steps', { id: uuid(`image-step:${key}:${index}`), image_entity_id: imageId, step_entity_id: stepId, relation_type: index === 0 ? 'processional' : 'secondary', notes: index === 0 ? 'Imagen principal del paso.' : 'Imagen integrada en el conjunto procesional.', status: 'published' })
  return stepId
}
const addCult = ({ key, brotherhoodId, imageId, placeId, cult_type, title, date_rule, month = null, order, description, sourceId }) => {
  const cultId = uuid(`cult:${key}`)
  add('cults', { id: cultId, brotherhood_entity_id: brotherhoodId, image_entity_id: imageId, place_id: placeId, status: 'published', is_recurring: true, cult_type, title, month, date_rule, recurrence_label: 'Anual', display_order: order, description })
  add('cult_entities', { id: uuid(`cult-entity:${key}`), cult_id: cultId, entity_id: imageId, role: 'honoree', notes: 'Titular al que se dedica el culto.' })
  linkSource(`cult:${key}`, sourceId, { cult_id: cultId })
  return cultId
}
const addEvent = ({ key, brotherhoodId, name, slug, summary, dateText, placeId = null, sourceId }) => {
  const eventId = addEntity(`event:${key}`, 'event', name, slug, summary)
  add('events', { entity_id: eventId, event_type: 'Hito histórico', event_date_text: dateText, place_id: placeId, description: summary, event_category: 'historical', brotherhood_entity_id: brotherhoodId, municipality_id: MUNICIPALITY, event_status: 'held' }, 'entity_id')
  linkSource(`event:${key}`, sourceId, { entity_id: eventId })
  return eventId
}

const councilRoster = addSource('council-roster', 'Nómina de las cofradías de la Semana Santa de Sevilla 2026', 'https://www.hermandades-de-sevilla.org/consejo/nomina-de-las-cofradias-de-la-semana-santa-de-sevilla-2026/', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Jornadas y nómina oficial de 2026.')

const solOfficial = addSource('sol-official', 'Web oficial · Hermandad del Sol', 'https://hermandaddelsol.org/', 'Hermandad del Sol', 'Identidad corporativa, actividad y canales oficiales.')
const solHistory = addSource('sol-history', 'El Sol · ficha del Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/ss_elsol.html', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Historia, sede, titulares, cortejo y música de 2026.')
const solTitulars = addSource('sol-titulars', 'Sagrados Titulares · Hermandad del Sol', 'https://hermandaddelsol.org/la-hermandad/sagrados-titulares/', 'Hermandad del Sol', 'Titulares, cultos y estación de penitencia.')
const solCults = addSource('sol-cults', 'Cultos y Actos · Hermandad del Sol', 'https://hermandaddelsol.org/cultos-y-actos/', 'Hermandad del Sol', 'Programa cultual estable de la corporación.')
const solMusic = addSource('sol-music', 'Nuestra Música · Hermandad del Sol', 'https://hermandaddelsol.org/grupos/nuestra-musica/', 'Hermandad del Sol', 'Vinculación de la Banda de Cornetas y Tambores Nuestra Señora del Sol.')

const santoOfficial = addSource('santo-official', 'Web oficial · Santo Entierro de Sevilla', 'https://www.santoentierro.org/', 'Hermandad del Santo Entierro de Sevilla', 'Identidad vigente, cultos de 2026, canales y documentación del Cristo Yacente.')
const santoCouncil = addSource('santo-council', 'El Santo Entierro · ficha del Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/ss_santoentierro.html', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Cortejo, pasos y patrimonio procesional.')
const santoMusic = addSource('santo-music', 'El Santo Entierro · acompañamiento musical 2026', 'https://www.planomato.com/es/sevilla/p/procesion-santo-entierro-sevilla-2026', 'Planomato', 'Configuración musical publicada para el Sábado Santo de 2026.')

const soledadOfficial = addSource('soledad-official', 'Web oficial · Soledad de San Lorenzo', 'https://www.hermandaddelasoledad.org/', 'Hermandad Sacramental de la Soledad', 'Denominación oficial y actividad vigente.')
const soledadImageSource = addSource('soledad-image', 'María Santísima en su Soledad', 'https://www.hermandaddelasoledad.org/hermandad/titulares/maria-santisima-en-su-soledad/', 'Hermandad Sacramental de la Soledad', 'Descripción, cronología e iconografía de la titular.')
const soledadStepSource = addSource('soledad-step', 'Paso procesional · Soledad de San Lorenzo', 'https://www.hermandaddelasoledad.org/hermandad/patrimonio/cultual/paso-procesional/', 'Hermandad Sacramental de la Soledad', 'Autoría, cronología y programa del paso.')
const soledadFunctionSource = addSource('soledad-function', 'Función Principal · Soledad de San Lorenzo', 'https://www.hermandaddelasoledad.org/cultos/funcion-principal/', 'Hermandad Sacramental de la Soledad', 'Función Principal de Instituto anual.')
const soledadStationSource = addSource('soledad-station', 'Estación de Penitencia · Soledad de San Lorenzo', 'https://www.hermandaddelasoledad.org/cultos/estacion-de-penitencia/', 'Hermandad Sacramental de la Soledad', 'Estación del Sábado Santo, cortejo y hábito.')

const sanDiegoPlace = uuid('place:san-diego-sol')
add('places', { id: sanDiegoPlace, municipality_id: MUNICIPALITY, name: 'Capilla Sacramental de Nuestra Señora del Sol', slug: 'capilla-sacramental-nuestra-senora-sol-sevilla', place_type: 'Capilla', address: 'Plaza del Aljarafe, Sevilla', notes: 'Anexa a la Parroquia de San Diego de Alcalá; sede canónica de la Hermandad del Sol.' })
const sanGregorioPlace = uuid('place:san-gregorio-sevilla')
add('places', { id: sanGregorioPlace, municipality_id: MUNICIPALITY, name: 'Iglesia de San Gregorio', slug: 'iglesia-san-gregorio-sevilla', place_type: 'Iglesia', address: 'Calle Alfonso XII, 14, Sevilla', notes: 'Sede canónica de la Hermandad del Santo Entierro.' })
const sanLorenzoPlace = '49c5d3af-b1ef-482d-b93c-d5991027958b'

const bonillaId = 'ad08ca9c-b9aa-4a2d-83f2-c2d880fe51b2'
const juanMesaId = '68d39c3f-c9d7-43d3-9986-fb616de2b164'
const cardosoId = addEntity('agent:cardoso-quiros', 'agent', 'Antonio Cardoso de Quirós', 'antonio-cardoso-de-quiros', 'Escultor documentado en la imaginería del Santo Entierro de Sevilla.')
add('agents', { entity_id: cardosoId, agent_kind: 'person', description: 'Autor documentado de la Virgen de Villaviciosa y del conjunto alegórico del Triunfo de la Santa Cruz.' }, 'entity_id')

const solId = '417a2bc3-0396-435f-af3f-44e2cb711c86'
add('entities', { id: solId, entity_type: 'brotherhood', name: 'Hermandad del Sol', slug: 'hermandad-del-sol', summary: 'Hermandad sacramental y de penitencia del Plantinar que realiza estación a la Catedral el Sábado Santo.', status: 'published' })
add('brotherhoods', { entity_id: solId, official_name: 'Fervorosa, Mariana y Franciscana Hermandad Sacramental de la Inmaculada Concepción de María Santísima de la Salud y Cofradía de Nazarenos del Triunfo de la Santa Cruz, Santo Cristo Varón de Dolores de la Divina Misericordia, Nuestra Señora del Sol, San Juan Evangelista y Santa María Magdalena', popular_name: 'El Sol', foundation_text: 'Origen documentado en 1932; Hermandad de Penitencia desde 2006', municipality_id: MUNICIPALITY, canonical_see_place_id: sanDiegoPlace, neighborhood: 'El Plantinar', website_url: 'https://hermandaddelsol.org/', brotherhood_types: ['Penitencia', 'Sacramental', 'Gloria'], current_procession_day: 'Sábado Santo', history_text: 'La corporación tiene su primera noticia documentada en 1932. Tras su etapa en Los Remedios se trasladó al Plantinar en 1989, fue erigida Hermandad de Gloria en 1995 y Hermandad de Penitencia en 2006. Hizo su primera estación penitencial en 2007 y se incorporó a la nómina del Sábado Santo.', notes: 'Sin escudo ni fotografías públicas mientras no conste licencia reutilizable.' }, 'entity_id')

const varonId = addImage({ key: 'sol-varon', brotherhoodId: solId, name: 'Santo Cristo Varón de Dolores de la Divina Misericordia', slug: 'santo-cristo-varon-dolores-divina-misericordia-sol', summary: 'Imagen de José Manuel Bonilla Cornejo concluida y bendecida en 2003.', image_type: 'Varón de Dolores', execution_date_text: '2003', description: 'Cristo vivo coronado de espinas que abraza la cruz con la mano izquierda y lleva la derecha al corazón.', authorId: bonillaId })
const virgenSolId = addImage({ key: 'sol-virgen', brotherhoodId: solId, name: 'Nuestra Señora del Sol', slug: 'nuestra-senora-sol-sevilla', summary: 'Dolorosa titular de la Hermandad del Sol, obra de José Manuel Bonilla Cornejo.', image_type: 'Dolorosa de vestir', execution_date_text: 'Siglo XX', description: 'Dolorosa de vestir concebida por José Manuel Bonilla Cornejo dentro del lenguaje iconográfico propio de la corporación.', is_dress_image: true, authorId: bonillaId })
const sanJuanSolId = addImage({ key: 'sol-san-juan', brotherhoodId: solId, name: 'San Juan Evangelista de la Hermandad del Sol', slug: 'san-juan-evangelista-sol-sevilla', summary: 'Imagen de José Manuel Bonilla Cornejo finalizada y bendecida en 2008.', image_type: 'Imagen secundaria', execution_date_text: '2008', description: 'Imagen de cuerpo entero tallada en madera de cedro para la Sacra Conversación.', authorId: bonillaId })
const magdalenaSolId = addImage({ key: 'sol-magdalena', brotherhoodId: solId, name: 'Santa María Magdalena de la Hermandad del Sol', slug: 'santa-maria-magdalena-sol-sevilla', summary: 'Imagen de José Manuel Bonilla Cornejo finalizada y bendecida en 2009.', image_type: 'Imagen secundaria de vestir', execution_date_text: '2009', description: 'Imagen de candelero integrada en la Sacra Conversación bajo palio.', is_dress_image: true, authorId: bonillaId })
const varonStepId = '6dcd8910-0267-4bd1-80fa-55d385e80717'
add('entities', { id: varonStepId, entity_type: 'step', name: 'Paso del Santo Cristo Varón de Dolores', slug: 'paso-santisimo-cristo-varon-de-dolores', summary: 'Paso del Santo Cristo Varón de Dolores de la Divina Misericordia.', status: 'published' })
add('steps', { entity_id: varonStepId, step_type: 'Paso de Cristo', current_condition: 'preserved', description: 'Paso procesional del Santo Cristo Varón de Dolores, en proceso documentado de remodelación durante 2025 y 2026.', current_state_notes: 'La ficha no atribuye el conjunto completo sin una fuente técnica unívoca.' }, 'entity_id')
add('brotherhood_steps', { id: uuid('brotherhood-step:sol-varon'), brotherhood_entity_id: solId, step_entity_id: varonStepId, relation_type: 'current', notes: 'Paso procesional vigente.', status: 'published' })
add('image_steps', { id: uuid('image-step:sol-varon'), image_entity_id: varonId, step_entity_id: varonStepId, relation_type: 'processional', notes: 'Imagen principal del paso.', status: 'published' })
const solPalioStepId = addStep({ key: 'sol-palio', brotherhoodId: solId, name: 'Paso de la Sacra Conversación de Nuestra Señora del Sol', slug: 'paso-sacra-conversacion-nuestra-senora-sol', summary: 'Paso de palio de Nuestra Señora del Sol con San Juan Evangelista y Santa María Magdalena.', step_type: 'Palio', execution_date_text: 'Configuración estrenada en 2009', description: 'Paso de palio que recupera la iconografía de la Sacra Conversación.', images: [virgenSolId, sanJuanSolId, magdalenaSolId] })

addCult({ key: 'sol-quinario', brotherhoodId: solId, imageId: varonId, placeId: sanDiegoPlace, cult_type: 'Quinario', title: 'Solemne Quinario al Santo Cristo Varón de Dolores', date_rule: 'Primera semana de Cuaresma, de martes a sábado', order: 1, description: 'Quinario cuaresmal anual al titular cristífero.', sourceId: solTitulars })
addCult({ key: 'sol-function', brotherhoodId: solId, imageId: varonId, placeId: sanDiegoPlace, cult_type: 'Función Principal', title: 'Función Principal de Instituto', date_rule: 'Segundo Domingo de Cuaresma', order: 2, description: 'Función Principal de Instituto posterior al Quinario.', sourceId: solTitulars })
addCult({ key: 'sol-besapie', brotherhoodId: solId, imageId: varonId, placeId: sanDiegoPlace, cult_type: 'Besapié', title: 'Devoto Besapié al Santo Cristo Varón de Dolores', date_rule: 'Fin de semana posterior al Quinario', order: 3, description: 'Veneración anual al titular cristífero.', sourceId: solTitulars })
addCult({ key: 'sol-triduo-virgen', brotherhoodId: solId, imageId: virgenSolId, placeId: sanDiegoPlace, cult_type: 'Triduo', title: 'Solemne Triduo a Nuestra Señora del Sol', date_rule: 'Jueves, viernes y sábado previos al primer Domingo de Adviento', order: 4, description: 'Triduo anual a la titular mariana.', sourceId: solTitulars })
addCult({ key: 'sol-function-virgen', brotherhoodId: solId, imageId: virgenSolId, placeId: sanDiegoPlace, cult_type: 'Función Solemne', title: 'Función Solemne a Nuestra Señora del Sol', date_rule: 'Primer Domingo de Adviento', order: 5, description: 'Función anual a la titular mariana.', sourceId: solTitulars })
const solOutingId = uuid('outing:sol-2026')
add('outings', { id: solOutingId, brotherhood_entity_id: solId, outing_type: 'Estación de Penitencia', character: 'ordinary', title: 'El Sol · Estación de Penitencia 2026', outing_date: '2026-04-04', year: 2026, municipality_id: MUNICIPALITY, origin_place_id: sanDiegoPlace, destination_text: 'Santa Iglesia Catedral de Sevilla', description: 'Estación de penitencia del Sábado Santo de 2026.', event_status: 'held', status: 'published', slug: 'sol-estacion-penitencia-2026' })
for (const [index, imageId] of [varonId, virgenSolId, sanJuanSolId, magdalenaSolId].entries()) add('outing_entities', { id: uuid(`outing-entity:sol:${index}`), outing_id: solOutingId, entity_id: imageId, role: index < 2 ? 'processional_image' : 'secondary_image', notes: 'Imagen participante en la estación de penitencia.' })
linkSource('outing:sol', councilRoster, { outing_id: solOutingId })
addEvent({ key: 'sol-origin', brotherhoodId: solId, name: 'Primera noticia documentada de la Hermandad del Sol', slug: 'origen-hermandad-sol-1932', summary: 'La primera noticia documentada de la corporación y de una salida procesional corresponde a 1932.', dateText: '1932', sourceId: solHistory })
addEvent({ key: 'sol-penitence', brotherhoodId: solId, name: 'Erección como Hermandad de Penitencia', slug: 'ereccion-penitencia-hermandad-sol-2006', summary: 'La corporación fue erigida Hermandad de Penitencia con sede en San Diego de Alcalá.', dateText: '16 de junio de 2006', placeId: sanDiegoPlace, sourceId: solHistory })
addEvent({ key: 'sol-station', brotherhoodId: solId, name: 'Primera estación de penitencia de la Hermandad del Sol', slug: 'primera-estacion-penitencia-sol-2007', summary: 'La Hermandad realizó su primera estación de penitencia el Sábado de Pasión de 2007.', dateText: '2007', sourceId: solHistory })
const solCrossAssetId = addEntity('heritage:sol-cross', 'heritage_asset', 'Triunfo de la Santa Cruz de la Hermandad del Sol', 'triunfo-santa-cruz-hermandad-sol', 'Titular de la corporación desde 1932 y elemento de apertura de su cortejo.')
add('heritage_assets', { entity_id: solCrossAssetId, parent_entity_id: solId, asset_type: 'Cruz titular', description: 'Triunfo de la Santa Cruz, titular de la corporación desde su origen documentado.', current_condition: 'Conservado', is_current: true, display_order: 1, is_featured: true }, 'entity_id')
add('brotherhood_habits', { id: uuid('habit:sol'), brotherhood_entity_id: solId, name: 'Hábito del Sol', tunic_description: 'Túnica de cola color crema, de sarga.', hood_description: 'Antifaz verde oscuro con esclavina prolongada.', cord_description: 'Cinturón ancho de esparto en su color.', footwear_description: 'Zapatos negros con hebillas.', shield_description: 'Escudo corporativo en el pecho.', sort_order: 1, notes: 'Configuración estrenada en 2026.', status: 'published' })
add('music_accompaniment_periods', { id: 'ca12df75-1b39-44a9-9ec3-73c8a4e8273e', brotherhood_entity_id: solId, band_entity_id: '8c860cd1-11cb-4cbc-8a40-2eaec0543f8b', step_entity_id: varonStepId, position: 'Tras el Santo Cristo Varón de Dolores', outing_type: 'Sábado Santo', date_from_text: 'Vigente · 2026', is_current: true, notes: 'Banda de Cornetas y Tambores Nuestra Señora del Sol.', status: 'published' })
add('music_accompaniment_periods', { id: 'de469d42-e9ff-4d83-9a3c-c6154db13e1b', brotherhood_entity_id: solId, band_entity_id: '91dc3cfa-75c1-4306-97fb-7be35c3ed242', step_entity_id: solPalioStepId, position: 'Tras el paso de Nuestra Señora del Sol', outing_type: 'Sábado Santo', date_from_text: 'Desde 2025', year_from: 2025, is_current: true, notes: 'Banda Municipal de Música Fernando Guerrero de Los Palacios y Villafranca.', status: 'published' })
add('music_accompaniment_periods', { id: uuid('music:sol-cross'), brotherhood_entity_id: solId, band_entity_id: '546d616f-4a2c-4ab0-9839-4e980d41d5f1', position: 'Cruz de Guía / Triunfo de la Santa Cruz', outing_type: 'Sábado Santo', date_from_text: 'Vigente · 2026', is_current: true, notes: 'Agrupación Musical Santa María de la Esperanza.', status: 'published' })

for (const [key, source] of [['roster', councilRoster], ['official', solOfficial], ['history', solHistory], ['titulars', solTitulars], ['cults', solCults], ['music', solMusic]]) linkSource(`sol:${key}`, source, { entity_id: solId })
for (const imageId of [varonId, virgenSolId, sanJuanSolId, magdalenaSolId]) linkSource(`sol-image:${imageId}`, solTitulars, { entity_id: imageId })
for (const stepId of [varonStepId, solPalioStepId]) linkSource(`sol-step:${stepId}`, solHistory, { entity_id: stepId })
linkSource('sol-cross', solTitulars, { entity_id: solCrossAssetId })

const santoId = addEntity('brotherhood:santo-entierro', 'brotherhood', 'El Santo Entierro', 'santo-entierro-sevilla', 'Real Hermandad sacramental del Sábado Santo con sede en la Iglesia de San Gregorio y tres pasos.')
add('brotherhoods', { entity_id: santoId, official_name: 'Real Hermandad Sacramental del Santo Entierro de Nuestro Señor Jesucristo, Triunfo de la Santa Cruz y María Santísima de Villaviciosa', popular_name: 'El Santo Entierro', foundation_text: 'Orígenes históricos no documentados con precisión; corporación reorganizada en la Edad Moderna', municipality_id: MUNICIPALITY, canonical_see_place_id: sanGregorioPlace, neighborhood: 'Centro', website_url: 'https://www.santoentierro.org/', instagram_url: 'https://www.instagram.com/santoentierrosevilla/', brotherhood_types: ['Penitencia', 'Sacramental'], current_procession_day: 'Sábado Santo', history_text: 'La Hermandad conserva una tradición fundacional antigua cuyo origen exacto no se fija sin documentación concluyente. Su cortejo del Sábado Santo integra el paso alegórico del Triunfo de la Santa Cruz, la urna del Santísimo Cristo Yacente y el Duelo de María Santísima de Villaviciosa.', notes: 'La tradición sobre una fundación por Fernando III no se convierte en fecha canónica. Sin escudo ni fotografías públicas mientras no conste licencia reutilizable.' }, 'entity_id')

const triumphId = addImage({ key: 'santo-triunfo', brotherhoodId: santoId, name: 'Triunfo de la Santa Cruz sobre la Muerte', slug: 'triunfo-santa-cruz-muerte-santo-entierro-sevilla', summary: 'Conjunto alegórico conocido popularmente como la Canina.', image_type: 'Grupo alegórico', execution_date_text: '1691', description: 'Alegoría del triunfo de la Cruz sobre la muerte y el pecado.', authorId: cardosoId })
const yacenteId = addImage({ key: 'santo-yacente', brotherhoodId: santoId, name: 'Santísimo Cristo Yacente del Santo Entierro de Sevilla', slug: 'santisimo-cristo-yacente-santo-entierro-sevilla', summary: 'Cristo Yacente tallado por Juan de Mesa en 1619, según documento hallado durante su restauración.', image_type: 'Cristo Yacente', execution_date_text: '1619', description: 'Imagen de Cristo muerto destinada a la urna procesional del Santo Entierro.', authorId: juanMesaId, authorNotes: 'Autoría confirmada por el documento hallado en el interior de la imagen durante la restauración.' })
const villaviciosaId = addImage({ key: 'santo-villaviciosa', brotherhoodId: santoId, name: 'María Santísima de Villaviciosa', slug: 'maria-santisima-villaviciosa-sevilla', summary: 'Dolorosa titular del Santo Entierro, obra de Antonio Cardoso de Quirós.', image_type: 'Dolorosa de vestir', execution_date_text: '1691', description: 'Dolorosa del paso del Duelo del Santo Entierro.', is_dress_image: true, authorId: cardosoId })
const caninaStepId = addStep({ key: 'santo-canina', brotherhoodId: santoId, name: 'Paso del Triunfo de la Santa Cruz', slug: 'paso-triunfo-santa-cruz-canina-sevilla', summary: 'Paso alegórico conocido como la Canina.', step_type: 'Alegórico', description: 'Representa el triunfo de la Santa Cruz sobre la muerte y el pecado.', images: [triumphId] })
const urnaStepId = addStep({ key: 'santo-urna', brotherhoodId: santoId, name: 'Paso de la urna del Santísimo Cristo Yacente', slug: 'paso-urna-cristo-yacente-sevilla', summary: 'Paso neogótico de la urna del Santísimo Cristo Yacente.', step_type: 'Urna', execution_date_text: 'Conjunto contemporáneo completado en torno a 2000', materials: 'Madera tallada y dorada; urna acristalada', style: 'Neogótico', description: 'Conjunto procesional con urna y candelabros, concebido como una catedral en miniatura.', images: [yacenteId] })
const dueloStepId = addStep({ key: 'santo-duelo', brotherhoodId: santoId, name: 'Paso del Duelo de María Santísima de Villaviciosa', slug: 'paso-duelo-villaviciosa-sevilla', summary: 'Paso del Duelo presidido por María Santísima de Villaviciosa.', step_type: 'Misterio', execution_date_text: '1965', style: 'Neogótico', description: 'Representa el duelo tras la muerte de Cristo; la ficha mantiene pendiente el alta individual de las imágenes secundarias hasta contar con expediente propio suficiente.', images: [villaviciosaId] })

addCult({ key: 'santo-quinario', brotherhoodId: santoId, imageId: yacenteId, placeId: sanGregorioPlace, cult_type: 'Quinario', title: 'Quinario penitencial del Santo Entierro', date_rule: 'Cuaresma', order: 1, description: 'Quinario penitencial anual previo a la Función Principal.', sourceId: santoOfficial })
addCult({ key: 'santo-function', brotherhoodId: santoId, imageId: yacenteId, placeId: sanGregorioPlace, cult_type: 'Función Principal', title: 'Función Principal de Instituto', date_rule: 'Domingo de Cuaresma', order: 2, description: 'Función Principal anual de la corporación.', sourceId: santoOfficial })
addCult({ key: 'santo-villaviciosa', brotherhoodId: santoId, imageId: villaviciosaId, placeId: sanGregorioPlace, cult_type: 'Triduo', title: 'Triduo a María Santísima de Villaviciosa', date_rule: 'Noviembre', month: 11, order: 3, description: 'Triduo anual dedicado a la titular mariana.', sourceId: santoOfficial })
const santoOutingId = uuid('outing:santo-2026')
add('outings', { id: santoOutingId, brotherhood_entity_id: santoId, outing_type: 'Estación de Penitencia', character: 'ordinary', title: 'Santo Entierro · Estación de Penitencia 2026', outing_date: '2026-04-04', year: 2026, municipality_id: MUNICIPALITY, origin_place_id: sanGregorioPlace, destination_text: 'Santa Iglesia Catedral de Sevilla', description: 'Estación de penitencia del Sábado Santo con los tres pasos de la corporación.', event_status: 'held', status: 'published', slug: 'santo-entierro-sevilla-estacion-penitencia-2026' })
for (const [index, imageId] of [triumphId, yacenteId, villaviciosaId].entries()) add('outing_entities', { id: uuid(`outing-entity:santo:${index}`), outing_id: santoOutingId, entity_id: imageId, role: 'processional_image', notes: 'Titular participante en la estación de penitencia.' })
linkSource('outing:santo', councilRoster, { outing_id: santoOutingId })
addEvent({ key: 'santo-yacente-1619', brotherhoodId: santoId, name: 'Ejecución del Santísimo Cristo Yacente', slug: 'ejecucion-cristo-yacente-sevilla-1619', summary: 'Juan de Mesa concluyó en 1619 el Santísimo Cristo Yacente para la Hermandad.', dateText: '1619', sourceId: santoOfficial })
addEvent({ key: 'santo-reorg', brotherhoodId: santoId, name: 'Reorganización del cortejo del Santo Entierro', slug: 'reorganizacion-santo-entierro-sevilla-siglo-xix', summary: 'La corporación reorganizó y renovó su patrimonio procesional durante el siglo XIX.', dateText: 'Siglo XIX', sourceId: santoCouncil })
addEvent({ key: 'santo-via-crucis-2025', brotherhoodId: santoId, name: 'Cristo Yacente en el Vía Crucis de las Hermandades de 2025', slug: 'cristo-yacente-via-crucis-sevilla-2025', summary: 'El Santísimo Cristo Yacente presidió el Vía Crucis del Consejo de Hermandades de Sevilla de 2025.', dateText: '10 de marzo de 2025', sourceId: santoOfficial })
addEvent({ key: 'santo-restoration', brotherhoodId: santoId, name: 'Restauración y hallazgo documental del Cristo Yacente', slug: 'restauracion-hallazgo-cristo-yacente-2024-2025', summary: 'La restauración permitió localizar y estudiar el documento que acredita la ejecución de la imagen por Juan de Mesa en 1619.', dateText: '2024–2025', sourceId: santoOfficial })
add('brotherhood_habits', { id: uuid('habit:santo'), brotherhood_entity_id: santoId, name: 'Hábito del Santo Entierro', tunic_description: 'Ropón negro de corte tradicional.', hood_description: 'Antifaz negro.', sort_order: 1, notes: 'Los hermanos que acompañan al Cristo Yacente pueden integrar el cortejo de etiqueta conforme a la configuración propia de la corporación.', status: 'published' })

const municipalBandId = addEntity('band:municipal-sevilla', 'band', 'Banda Sinfónica Municipal de Sevilla', 'banda-sinfonica-municipal-sevilla', 'Formación municipal documentada en el cortejo del Santo Entierro de 2026.')
add('bands', { entity_id: municipalBandId, band_type: 'Banda de música', municipality_id: MUNICIPALITY, description: 'Banda Sinfónica Municipal de Sevilla.' }, 'entity_id')
const forceBandId = addEntity('band:fuerza-terrestre', 'band', 'Unidad de Música del Cuartel General de la Fuerza Terrestre', 'unidad-musica-fuerza-terrestre-sevilla', 'Unidad de música militar documentada en el cortejo del Santo Entierro de 2026.')
add('bands', { entity_id: forceBandId, band_type: 'Música militar', municipality_id: MUNICIPALITY, description: 'Unidad de música militar con sede en Sevilla.' }, 'entity_id')
add('music_accompaniment_periods', { id: uuid('music:santo-urna'), brotherhood_entity_id: santoId, band_entity_id: municipalBandId, step_entity_id: urnaStepId, position: 'Tras el paso de la urna', outing_type: 'Sábado Santo', date_from_text: 'Vigente · 2026', is_current: true, notes: 'Banda Sinfónica Municipal de Sevilla.', status: 'published' })
add('music_accompaniment_periods', { id: uuid('music:santo-duelo'), brotherhood_entity_id: santoId, band_entity_id: forceBandId, step_entity_id: dueloStepId, position: 'Tras el paso del Duelo', outing_type: 'Sábado Santo', date_from_text: 'Vigente · 2026', is_current: true, notes: 'Unidad de Música del Cuartel General de la Fuerza Terrestre.', status: 'published' })
for (const [key, source] of [['roster', councilRoster], ['official', santoOfficial], ['council', santoCouncil], ['music', santoMusic]]) linkSource(`santo:${key}`, source, { entity_id: santoId })
for (const imageId of [triumphId, yacenteId, villaviciosaId]) linkSource(`santo-image:${imageId}`, imageId === yacenteId ? santoOfficial : santoCouncil, { entity_id: imageId })
for (const stepId of [caninaStepId, urnaStepId, dueloStepId]) linkSource(`santo-step:${stepId}`, santoCouncil, { entity_id: stepId })
linkSource('santo-music-urna', santoMusic, { music_accompaniment_period_id: uuid('music:santo-urna') })
linkSource('santo-music-duelo', santoMusic, { music_accompaniment_period_id: uuid('music:santo-duelo') })

const soledadId = '1e85ab84-d074-49be-803c-b26201b20561'
add('entities', { id: soledadId, entity_type: 'brotherhood', name: 'La Soledad de San Lorenzo', slug: 'la-soledad-de-san-lorenzo', summary: 'Primitiva cofradía de la Soledad de Sevilla, sacramental y penitencial, con sede en la Parroquia de San Lorenzo.', status: 'published' })
add('brotherhoods', { entity_id: soledadId, official_name: 'Pontificia y Real Hermandad Sacramental de Nuestra Señora de Roca-Amador, Ánimas Benditas, Beato Marcelo Spínola y Primitiva Cofradía de Nazarenos de María Santísima en su Soledad', popular_name: 'La Soledad de San Lorenzo', foundation_text: '1557; primeras reglas, con existencia documentada desde 1549', municipality_id: MUNICIPALITY, canonical_see_place_id: sanLorenzoPlace, neighborhood: 'San Lorenzo', website_url: 'https://www.hermandaddelasoledad.org/', brotherhood_types: ['Penitencia', 'Sacramental'], current_procession_day: 'Sábado Santo', history_text: 'La cofradía está documentada desde 1549 y aprobó sus primeras reglas en 1557. Llegó a San Lorenzo en 1868 y se fusionó con la Sacramental del templo en 1977. Desde la reforma litúrgica de 1956 realiza estación de penitencia el Sábado Santo.', notes: 'La estación se desarrolla sin acompañamiento musical. Sin escudo ni fotografías públicas mientras no conste licencia reutilizable.' }, 'entity_id')
const soledadImageId = addImage({ key: 'soledad-san-lorenzo', brotherhoodId: soledadId, name: 'María Santísima en su Soledad', slug: 'maria-santisima-soledad-san-lorenzo-sevilla', summary: 'Dolorosa de vestir de cronología anterior a 1568 y autoría anónima.', image_type: 'Dolorosa de vestir', execution_date_text: 'Anterior a 1568', description: 'Imagen de vestir de 163 cm que representa a la Virgen sola al pie de la Cruz.', is_dress_image: true, authorId: null, authorship_type: 'anonymous', certainty: 'unknown', authorNotes: 'La fuente oficial conserva la cronología antigua sin identificar autor.' })
const soledadStepId = addStep({ key: 'soledad-san-lorenzo', brotherhoodId: soledadId, name: 'Paso de María Santísima en su Soledad', slug: 'paso-maria-santisima-soledad-san-lorenzo', summary: 'Paso neobarroco tallado y dorado estrenado en 1951.', step_type: 'Paso de Virgen', execution_date_text: '1951', materials: 'Madera tallada y dorada', style: 'Neobarroco', description: 'Concebido por Santiago Martínez Martín y plasmado por Francisco Ruiz Rodríguez, con un programa de azucenas e iconografía bíblica.', images: [soledadImageId] })
addCult({ key: 'soledad-quinario', brotherhoodId: soledadId, imageId: soledadImageId, placeId: sanLorenzoPlace, cult_type: 'Quinario', title: 'Solemne Quinario a María Santísima en su Soledad', date_rule: 'Semana previa al primer Domingo de Cuaresma', order: 1, description: 'Quinario cuaresmal anual a la titular.', sourceId: soledadFunctionSource })
addCult({ key: 'soledad-function', brotherhoodId: soledadId, imageId: soledadImageId, placeId: sanLorenzoPlace, cult_type: 'Función Principal', title: 'Función Principal de Instituto', date_rule: 'Primer Domingo de Cuaresma', order: 2, description: 'Principal culto corporativo anual.', sourceId: soledadFunctionSource })
addCult({ key: 'soledad-besamanos', brotherhoodId: soledadId, imageId: soledadImageId, placeId: sanLorenzoPlace, cult_type: 'Besamanos', title: 'Solemne Besamanos a María Santísima en su Soledad', date_rule: 'Último viernes antes de Cuaresma y días inmediatos', order: 3, description: 'Veneración anual a la titular mariana.', sourceId: soledadOfficial })
const soledadOutingId = uuid('outing:soledad-2026')
add('outings', { id: soledadOutingId, brotherhood_entity_id: soledadId, outing_type: 'Estación de Penitencia', character: 'ordinary', title: 'Soledad de San Lorenzo · Estación de Penitencia 2026', outing_date: '2026-04-04', year: 2026, municipality_id: MUNICIPALITY, origin_place_id: sanLorenzoPlace, destination_text: 'Santa Iglesia Catedral de Sevilla', description: 'Estación de penitencia del Sábado Santo con María Santísima en su Soledad.', event_status: 'held', status: 'published', slug: 'soledad-san-lorenzo-estacion-penitencia-2026' })
add('outing_entities', { id: uuid('outing-entity:soledad'), outing_id: soledadOutingId, entity_id: soledadImageId, role: 'processional_image', notes: 'Titular participante en la estación de penitencia.' })
linkSource('outing:soledad', soledadStationSource, { outing_id: soledadOutingId })
addEvent({ key: 'soledad-rules', brotherhoodId: soledadId, name: 'Aprobación de las primeras reglas de la Soledad', slug: 'primeras-reglas-soledad-san-lorenzo-1557', summary: 'La cofradía quedó constituida oficialmente al aprobarse sus primeras reglas.', dateText: '1557', sourceId: soledadImageSource })
addEvent({ key: 'soledad-sabado', brotherhoodId: soledadId, name: 'Paso de la Soledad al Sábado Santo', slug: 'soledad-san-lorenzo-sabado-santo-1956', summary: 'La reforma litúrgica trasladó la estación penitencial de la corporación del Viernes Santo al Sábado Santo.', dateText: '1956', sourceId: soledadStationSource })
const soledadPasoAssetId = addEntity('heritage:soledad-paso', 'heritage_asset', 'Azucenas e inscripción del paso de la Soledad', 'azucenas-inscripcion-paso-soledad-san-lorenzo', 'Programa ornamental e iconográfico del paso estrenado en 1951.')
add('heritage_assets', { entity_id: soledadPasoAssetId, parent_entity_id: soledadId, asset_type: 'Programa iconográfico', description: 'Azucenas estofadas, capillas, evangelistas y una inscripción latina recorren el paso.', current_condition: 'Conservado', is_current: true, display_order: 1, is_featured: true }, 'entity_id')
add('brotherhood_habits', { id: uuid('habit:soledad'), brotherhood_entity_id: soledadId, name: 'Hábito de la Soledad de San Lorenzo', tunic_description: 'Túnica blanca de cola, de sarga o lienzo.', hood_description: 'Antifaz negro.', cord_description: 'Escapulario y manguitos negros.', sort_order: 1, notes: 'Hábito descrito por la propia Hermandad para la estación de penitencia.', status: 'published' })
for (const [key, source] of [['roster', councilRoster], ['official', soledadOfficial], ['image', soledadImageSource], ['step', soledadStepSource], ['function', soledadFunctionSource], ['station', soledadStationSource]]) linkSource(`soledad:${key}`, source, { entity_id: soledadId })
linkSource('soledad-image-entity', soledadImageSource, { entity_id: soledadImageId })
linkSource('soledad-step-entity', soledadStepSource, { entity_id: soledadStepId })
linkSource('soledad-heritage', soledadStepSource, { entity_id: soledadPasoAssetId })

mkdirSync('tmp', { recursive: true })
writeFileSync('tmp/sabado-santo-hc016.jsonl', `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`)
writeFileSync('tmp/sabado-santo-hc016-summary.json', `${JSON.stringify({ expected_items: rows.length, tables: Object.fromEntries([...new Set(rows.map(({ table }) => table))].sort().map((table) => [table, rows.filter((row) => row.table === table).length])) }, null, 2)}\n`)
writeFileSync('supabase/migrations_archive/post-first-edition-editorial/20260914130000_cierra_sabado_santo_sevilla.sql', `-- HC-016 · macrolote transversal: Sábado Santo de Sevilla\n-- El Sol, Santo Entierro y Soledad de San Lorenzo; Trinidad y Servitas se preservan.\n-- Solo DML. Receta idempotente archivada fuera de la cadena estructural activa.\n-- Lote aplicado: 7fe7b65d-4f00-4d40-906f-82df8ee7c0a2 · completed · 206/206 · 199 insert · 7 update · 0 fallos.\n\nbegin;\n\n${rows.map(sqlStatement).join('\n\n')}\n\ncommit;\n`)
console.log(JSON.stringify({ rows: rows.length, jsonl: 'tmp/sabado-santo-hc016.jsonl', sql: 'supabase/migrations_archive/post-first-edition-editorial/20260914130000_cierra_sabado_santo_sevilla.sql' }))

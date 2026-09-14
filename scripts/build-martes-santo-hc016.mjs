import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'

const MUNICIPALITY = 'ca85889c-21fe-4367-8477-a57656b25da4'
const ACCESS_DATE = '2026-09-14'
const ids = {
  candelaria: 'c6100000-0000-4000-8000-000000000003',
  estudiantes: '52c9fcc7-46fd-49e0-9395-f76653ac783e',
  tresCaidas: '0a86bfb1-afe6-448a-88b9-127867f5b1a9',
  cruzRoja: 'c6000000-0000-4000-8000-000000000001',
  centuria: '543613d9-cae7-4430-a4c9-d3160f0fc358',
  bandaAlcala: '8e754023-a46a-4587-8952-4696c70d0bd0',
  julianCerdan: 'a02d98fc-7c05-4b40-bf82-9fc3eca8bdb4',
  ocampo: '111d783e-16c0-4571-9c1c-93eaee474e87',
  galiano: '5dfcff9b-0b66-4892-830d-da6f4a4890dc',
  fernandezAndes: '13000000-0000-0000-0000-000000000002',
  juanMesa: '68d39c3f-c9d7-43d3-9986-fb616de2b164',
  juanAstorga: 'a5264497-9e32-49ab-9773-130fe8ae7a76',
}

function uuid(key) {
  const chars = createHash('sha256').update(`hc016-martes-santo:${key}`).digest('hex').slice(0, 32).split('')
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
  const cols = Object.keys(row.data); const conflictCols = String(row.on_conflict || '').split(',').filter(Boolean)
  const updates = cols.filter((col) => !conflictCols.includes(col))
  const conflict = conflictCols.length ? ` on conflict (${conflictCols.map(qi).join(', ')}) do ${updates.length ? `update set ${updates.map((col) => `${qi(col)} = excluded.${qi(col)}`).join(', ')}` : 'nothing'}` : ''
  return `insert into public.${qi(row.table)} (${cols.map(qi).join(', ')})\nvalues (${cols.map((col) => lit(row.data[col])).join(', ')})${conflict};`
}

const rows = []
const add = (table, data, on_conflict = 'id') => rows.push({ table, operation: 'upsert', on_conflict, data })
const entity = (key, type, name, slug, summary, id = uuid(`entity:${key}`)) => {
  add('entities', { id, entity_type: type, name, slug, summary, status: 'published' }); return id
}
const source = (key, name, url, publisher, notes) => {
  const id = uuid(`source:${key}`); add('sources', { id, name, url, source_type: 'web', author_or_publisher: publisher, accessed_at: ACCESS_DATE, notes }); return id
}
const link = (key, source_id, target, scope = null) => add('source_links', { id: uuid(`source-link:${key}`), source_id, ...target, scope })
const place = (key, name, slug, type, address, notes) => {
  const id = uuid(`place:${key}`); add('places', { id, municipality_id: MUNICIPALITY, name, slug, place_type: type, address, notes }); return id
}
const agent = (key, name, slug, summary, id = uuid(`entity:agent:${key}`)) => entity(`agent:${key}`, 'agent', name, slug, summary, id)
const image = ({ key, brotherhood, name, slug, summary, type, date, description, author = null, certainty = 'documented', dress = false }) => {
  const id = entity(`image:${key}`, 'image', name, slug, summary)
  add('images', { entity_id: id, image_type: type, execution_date_text: date, current_condition: 'extant', description, is_dress_image: dress }, 'entity_id')
  add('brotherhood_images', { id: uuid(`brotherhood-image:${key}`), brotherhood_entity_id: brotherhood, image_entity_id: id, relation_type: 'titular', notes: 'Titular vigente documentado.', status: 'published' })
  add('image_authorships', { id: uuid(`authorship:${key}`), image_entity_id: id, agent_entity_id: author, authorship_type: author ? (certainty === 'attributed' ? 'attributed_to' : 'author') : 'anonymous', role_name: 'escultor', date_from_text: date, certainty, notes: certainty === 'attributed' ? 'Atribución documentada, no autoría contractual.' : 'Autoría documentada.', status: 'published' })
  return id
}
const step = ({ key, brotherhood, name, slug, summary, type, description, date = null, images = [] }) => {
  const id = entity(`step:${key}`, 'step', name, slug, summary)
  add('steps', { entity_id: id, step_type: type, current_condition: 'preserved', execution_date_text: date, description }, 'entity_id')
  add('brotherhood_steps', { id: uuid(`brotherhood-step:${key}`), brotherhood_entity_id: brotherhood, step_entity_id: id, relation_type: 'current', notes: 'Paso procesional vigente.', status: 'published' })
  images.forEach((image_id, i) => add('image_steps', { id: uuid(`image-step:${key}:${i}`), image_entity_id: image_id, step_entity_id: id, relation_type: i ? 'secondary' : 'processional', notes: i ? 'Imagen integrada en el conjunto procesional.' : 'Imagen principal del paso.', status: 'published' }))
  return id
}
const cult = ({ key, brotherhood, image_id, place_id, type, title, rule, month = null, order, source_id }) => {
  const id = uuid(`cult:${key}`)
  add('cults', { id, brotherhood_entity_id: brotherhood, image_entity_id: image_id, cult_type: type, title, date_rule: rule, month, place_id, description: 'Culto anual documentado por la corporación.', status: 'published', is_recurring: true, recurrence_label: 'Anual', display_order: order })
  if (image_id) add('cult_entities', { id: uuid(`cult-entity:${key}`), cult_id: id, entity_id: image_id, role: 'honoree', notes: 'Titular al que se dedica el culto.' })
  link(`cult:${key}`, source_id, { cult_id: id }); return id
}
const event = ({ key, brotherhood, name, slug, summary, date, source_id, place_id = null }) => {
  const id = entity(`event:${key}`, 'event', name, slug, summary)
  add('events', { entity_id: id, event_type: 'Hito histórico', event_date_text: date, place_id, description: summary, event_category: 'historical', brotherhood_entity_id: brotherhood, municipality_id: MUNICIPALITY, event_status: 'held' }, 'entity_id')
  link(`event:${key}`, source_id, { entity_id: id }); return id
}
const outing = ({ key, brotherhood, title, origin, images, source_id }) => {
  const id = uuid(`outing:${key}`)
  add('outings', { id, brotherhood_entity_id: brotherhood, outing_type: 'Estación de Penitencia', character: 'ordinary', title, outing_date: '2026-03-31', year: 2026, municipality_id: MUNICIPALITY, origin_place_id: origin, destination_text: 'Santa Iglesia Catedral de Sevilla', description: 'Estación de penitencia del Martes Santo de 2026.', event_status: 'held', status: 'published', slug: `${key}-estacion-penitencia-2026` })
  images.forEach((image_id, i) => add('outing_entities', { id: uuid(`outing-entity:${key}:${i}`), outing_id: id, entity_id: image_id, role: i ? 'secondary_image' : 'processional_image', notes: 'Imagen participante en la estación de penitencia.' }))
  link(`outing:${key}`, source_id, { outing_id: id }); return id
}
const habit = (key, brotherhood, description) => add('brotherhood_habits', { id: uuid(`habit:${key}`), brotherhood_entity_id: brotherhood, name: `Hábito de ${key}`, tunic_description: description, hood_description: description, cord_description: description.includes('esparto') ? 'Cinturón de esparto.' : 'Cíngulo reglamentario.', footwear_description: 'Calzado negro.', sort_order: 1, notes: 'Hábito penitencial vigente.', status: 'published' })
const asset = ({ key, brotherhood, name, slug, type, description, order }) => {
  const id = entity(`asset:${key}`, 'heritage_asset', name, slug, description)
  add('heritage_assets', { entity_id: id, parent_entity_id: brotherhood, asset_type: type, description, current_condition: 'Conservado', is_current: true, display_order: order, is_featured: order === 1 }, 'entity_id'); return id
}
const music = ({ id, brotherhood, band, step_id, position, slug, name, year_from = null, notes, source_id }) => {
  add('music_accompaniment_periods', { id, brotherhood_entity_id: brotherhood, band_entity_id: band, step_entity_id: step_id, position, outing_type: 'Martes Santo', date_from_text: year_from ? `Desde ${year_from}` : 'Vigente · 2026', year_from, is_current: true, notes, public_brotherhood_name: name, public_step_name: position.includes('palio') ? 'Paso de palio' : 'Paso de Cristo', public_brotherhood_slug: slug, public_municipality_name: 'Sevilla', public_municipality_slug: 'sevilla', public_province: 'Sevilla', status: 'published' })
  link(`music:${id}`, source_id, { music_accompaniment_period_id: id })
}

const council = source('council', 'Nómina de las cofradías de la Semana Santa de Sevilla 2026', 'https://www.hermandades-de-sevilla.org/consejo/nomina-de-las-cofradias-de-la-semana-santa-de-sevilla-2026/', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Nómina oficial, orden y jornada del Martes Santo de 2026.')

// CANDELARIA
const canOfficial = source('can-official', 'Web oficial · Hermandad de la Candelaria', 'https://www.hermandaddelacandelaria.com/', 'Hermandad de la Candelaria', 'Identidad, sede, titulares y patrimonio oficial.')
const canHistory = source('can-history', 'Resumen histórico · Hermandad de la Candelaria', 'https://www.hermandaddelacandelaria.com/seccion.php?Id=1', 'Hermandad de la Candelaria', 'Fundación, primera estación, fusión sacramental e hitos.')
const canLord = source('can-lord', 'Nuestro Padre Jesús de la Salud · Candelaria', 'https://www.hermandaddelacandelaria.com/seccion.php?Id=6', 'Hermandad de la Candelaria', 'Datación y debate de autoría del Nazareno.')
const canVirgin = source('can-virgin', 'María Santísima de la Candelaria', 'https://www.hermandaddelacandelaria.com/seccion.php?Id=7', 'Hermandad de la Candelaria', 'Autoría, remodelación y descripción de la Dolorosa.')
const canSteps = source('can-steps', 'Patrimonio procesional · Candelaria', 'https://www.hermandaddelacandelaria.com/seccion.php?Id=27', 'Hermandad de la Candelaria', 'Paso del Señor y patrimonio procesional.')
const canPalio = source('can-palio', 'Paso de palio · Candelaria', 'https://www.hermandaddelacandelaria.com/seccion.php?Id=28', 'Hermandad de la Candelaria', 'Diseño, bordados y orfebrería del palio.')
const canCults = source('can-cults', 'Calendario de cultos de Regla · Candelaria', 'https://www.hermandaddelacandelaria.com/seccion.php?Id=10', 'Hermandad de la Candelaria', 'Ciclo anual de cultos de Regla publicado por la corporación.')
const sanNicolas = place('san-nicolas', 'Parroquia de San Nicolás de Bari', 'parroquia-san-nicolas-bari-sevilla', 'Parroquia', 'Plaza de Nuestro Padre Jesús de la Salud, 41004 Sevilla', 'Sede canónica de la Hermandad de la Candelaria.')
const ocampo = agent('ocampo', 'Francisco de Ocampo', 'francisco-de-ocampo', 'Escultor al que se atribuye tradicionalmente el Nazareno de la Salud, con cautelas críticas expresas.', ids.ocampo)
const galiano = agent('galiano', 'Manuel Galiano Delgado', 'manuel-galiano-delgado', 'Escultor autor de la Virgen de la Candelaria en 1924.', ids.galiano)
entity('candelaria', 'brotherhood', 'Hermandad de la Candelaria de Sevilla', 'hermandad-candelaria-sevilla', 'Hermandad sacramental y de penitencia de San Nicolás.', ids.candelaria)
add('brotherhoods', { entity_id: ids.candelaria, official_name: 'Real, Imperial, Ilustre y Fervorosa Hermandad del Santísimo Sacramento, Ánimas Benditas, Nuestra Señora del Subterráneo y Cofradía de Nazarenos de Nuestro Padre Jesús de la Salud, María Santísima de la Candelaria y Señor San Nicolás de Bari', popular_name: 'La Candelaria', foundation_text: '1921; fusionada con la Sacramental de San Nicolás en 1977', municipality_id: MUNICIPALITY, canonical_see_place_id: sanNicolas, neighborhood: 'San Nicolás', website_url: 'https://www.hermandaddelacandelaria.com/', brotherhood_types: ['Penitencia','Sacramental'], current_procession_day: 'Martes Santo', history_text: 'Constituida en San Nicolás en 1921, realizó su primera estación en 1922 y se fusionó con la Sacramental parroquial en 1977.', notes: 'Sin fotografías nuevas mientras no conste licencia reutilizable.' }, 'entity_id')
const canJesus = image({ key:'can-jesus', brotherhood:ids.candelaria, name:'Nuestro Padre Jesús de la Salud', slug:'nuestro-padre-jesus-salud-candelaria-sevilla', summary:'Nazareno barroco de autoría discutida, documentado en 1622.', type:'Nazareno de talla completa', date:'Anterior a 1622', description:'Nazareno de talla completa, atribuido tradicionalmente a Francisco de Ocampo aunque la propia fuente oficial recoge dudas críticas.', author:ocampo, certainty:'attributed' })
const canMaria = image({ key:'can-maria', brotherhood:ids.candelaria, name:'María Santísima de la Candelaria', slug:'maria-santisima-candelaria-sevilla', summary:'Dolorosa de Manuel Galiano, 1924, profundamente remodelada por Antonio Dubé de Luque en 1967.', type:'Dolorosa de vestir', date:'1924; remodelada en 1967', description:'Dolorosa de candelero cuya fisonomía actual responde a la remodelación de Antonio Dubé de Luque.', author:galiano, dress:true })
const canStep = step({ key:'can-step', brotherhood:ids.candelaria, name:'Paso de Nuestro Padre Jesús de la Salud', slug:'paso-jesus-salud-candelaria-sevilla', summary:'Paso neobarroco rocalla de Antonio Vega Sánchez.', type:'Nazareno', date:'1964–1965', description:'Canastilla y respiraderos de Antonio Vega Sánchez, inspirados en los retablos de San Nicolás.', images:[canJesus] })
const canPalioStep = step({ key:'can-palio-step', brotherhood:ids.candelaria, name:'Paso de palio de María Santísima de la Candelaria', slug:'paso-palio-candelaria-sevilla', summary:'Conjunto de orfebrería y bordados sobre terciopelo azul verdoso.', type:'Palio', date:'Desde 1924', description:'Palio diseñado por Juan Manuel Rodríguez Ojeda y estrenado en 1924, con posteriores fases de orfebrería.', images:[canMaria] })
for (const x of [['can-triduo',canMaria,'Triduo','Triduo a María Santísima de la Candelaria','Finales de enero y víspera del 2 de febrero',2,1],['can-function',canMaria,'Función','Función solemne a María Santísima de la Candelaria','2 de febrero',2,2],['can-besamanos',canMaria,'Besamanos','Besamanos a María Santísima de la Candelaria','En torno al 2 de febrero',2,3],['can-besapie',canJesus,'Besapié','Besapié a Nuestro Padre Jesús de la Salud','Cuaresma',null,4],['can-quinario',canJesus,'Quinario','Quinario a Nuestro Padre Jesús de la Salud','Cuaresma',null,5],['can-sacramental',null,'Triduo','Triduo sacramental','En torno al Corpus Christi',6,6]]) cult({key:x[0],brotherhood:ids.candelaria,image_id:x[1],place_id:sanNicolas,type:x[2],title:x[3],rule:x[4],month:x[5],order:x[6],source_id:canCults})
outing({key:'candelaria',brotherhood:ids.candelaria,title:'La Candelaria · Estación de Penitencia 2026',origin:sanNicolas,images:[canJesus,canMaria],source_id:council})
event({key:'can-foundation',brotherhood:ids.candelaria,name:'Fundación de la Hermandad de la Candelaria',slug:'fundacion-candelaria-sevilla-1921',summary:'Las primeras Reglas fueron aprobadas el 4 de junio y la corporación se constituyó el 26 de junio de 1921.',date:'junio de 1921',source_id:canHistory,place_id:sanNicolas})
event({key:'can-first-station',brotherhood:ids.candelaria,name:'Primera estación de penitencia de la Candelaria',slug:'primera-estacion-candelaria-sevilla-1922',summary:'La Hermandad realizó su primera estación a la Catedral el Martes Santo de 1922.',date:'Martes Santo de 1922',source_id:canHistory})
const canAsset1=asset({key:'can-palio-ojeda',brotherhood:ids.candelaria,name:'Palio de Juan Manuel Rodríguez Ojeda de la Candelaria',slug:'palio-rodriguez-ojeda-candelaria-sevilla',type:'Bordado procesional',description:'Techo y bambalinas bordados en plata sobre terciopelo azul verdoso, estrenados en 1924.',order:1})
const canAsset2=asset({key:'can-paso-rocalla',brotherhood:ids.candelaria,name:'Canastilla rocalla del paso del Señor de la Salud',slug:'canastilla-rocalla-salud-candelaria',type:'Paso procesional',description:'Talla de Antonio Vega Sánchez, estrenada en la década de 1960.',order:2})
habit('la Candelaria',ids.candelaria,'Túnica blanca de cola, antifaz azul y cinturón de esparto.')
music({id:'592aa804-0a8f-42f1-b7f0-1e01d46397b9',brotherhood:ids.candelaria,band:ids.tresCaidas,step_id:canStep,position:'Tras el paso de Cristo',slug:'hermandad-candelaria-sevilla',name:'Hermandad de la Candelaria',year_from:2001,notes:'Acompañamiento vigente en 2026.',source_id:canOfficial})
music({id:'84931978-6773-45d3-acef-7d7865d2cd55',brotherhood:ids.candelaria,band:ids.cruzRoja,step_id:canPalioStep,position:'Tras el paso de palio',slug:'hermandad-candelaria-sevilla',name:'Hermandad de la Candelaria',year_from:1984,notes:'Acompañamiento vigente desde 1984.',source_id:canOfficial})
music({id:'78afda1b-c942-4725-b93f-2bf2c9fc9e4b',brotherhood:ids.candelaria,band:ids.centuria,step_id:null,position:'Cruz de Guía · sección juvenil',slug:'hermandad-candelaria-sevilla',name:'Hermandad de la Candelaria',notes:'La sección juvenil abre el cortejo en 2026.',source_id:canOfficial})
for(const [k,s] of [['official',canOfficial],['history',canHistory],['lord',canLord],['virgin',canVirgin],['steps',canSteps],['palio',canPalio],['cults',canCults],['council',council]]) link(`can:${k}`,s,{entity_id:ids.candelaria})
link('can:jesus',canLord,{entity_id:canJesus}); link('can:maria',canVirgin,{entity_id:canMaria}); link('can:asset1',canPalio,{entity_id:canAsset1}); link('can:asset2',canSteps,{entity_id:canAsset2})

// LOS JAVIERES
const javCouncil = source('jav-council', 'Los Javieres · ficha corporativa', 'https://www.hermandades-de-sevilla.org/hermandades/penitencia/martes-santo/los-javieres/', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Historia, titulares y primera estación de penitencia.')
const javSeeSource = source('jav-see', 'Los Javieres promueve la devoción al Sagrado Corazón', 'https://www.archisevilla.org/los-javieres-promueve-la-devocion-al-sagrado-corazon-en-el-mes-de-su-fiesta/', 'Archidiócesis de Sevilla', 'Nueva etapa tras el traslado de la sede canónica al Sagrado Corazón en 2026.')
const javTransfer = source('jav-transfer', 'Traslado de Los Javieres al Sagrado Corazón', 'https://cadenaser.com/andalucia/2025/11/18/el-traslado-de-los-javieres-al-sagrado-corazon-ya-tiene-fecha-radio-sevilla/', 'Radio Sevilla · Cadena SER', 'Fecha, destino y comodato de la nueva sede canónica.')
const javChristSource = source('jav-christ', 'Restauración del Cristo de las Almas', 'https://cadenaser.com/andalucia/2025/02/25/el-cristo-de-las-almas-repuesto-al-culto-tras-la-restauracion-acometida-por-laura-perez-melendez-radio-sevilla/', 'Radio Sevilla · Cadena SER', 'Autor, fecha y restauración terminada en 2025.')
const javMusicSource = source('jav-music', 'Martes Santo · Hermandad de los Javieres', 'https://bandajuliancerdan.com/martes-santo-hermandad-de-los-javieres/', 'Banda de Música Julián Cerdán', 'Más de veinticinco años tras Gracia y Amparo y vigencia en 2026.')
const sagradoCorazon = place('sagrado-corazon', 'Iglesia del Sagrado Corazón de Jesús y Capilla de los Luises', 'iglesia-sagrado-corazon-capilla-luises-sevilla', 'Iglesia', 'Calle Jesús del Gran Poder, Sevilla', 'Sede canónica de Los Javieres desde enero de 2026.')
const pires = agent('pires', 'José Luis Pires Azcárraga', 'jose-luis-pires-azcarraga', 'Escultor del Santísimo Cristo de las Almas en 1945.')
const fernandezAndes = agent('fernandez-andes', 'José Rodríguez Fernández-Andes', 'jose-rodriguez-fernandez-andes', 'Escultor de María Santísima de Gracia y Amparo.', ids.fernandezAndes)
const javieres = entity('javieres','brotherhood','Hermandad de los Javieres','hermandad-los-javieres-sevilla','Hermandad de penitencia nacida en el entorno de la Compañía de Jesús.')
add('brotherhoods',{entity_id:javieres,official_name:'Hermandad y Cofradía de Nazarenos del Santísimo Cristo de las Almas, María Santísima de Gracia y Amparo, San Francisco Javier y San Juan Evangelista',popular_name:'Los Javieres',foundation_text:'1945',municipality_id:MUNICIPALITY,canonical_see_place_id:sagradoCorazon,neighborhood:'Centro',website_url:'https://hermandaddelosjavieres.com/',brotherhood_types:['Penitencia'],current_procession_day:'Martes Santo',history_text:'Fundada en 1945 en el ámbito jesuita, realizó su primera estación en 1957. En enero de 2026 trasladó su sede canónica al Sagrado Corazón, lugar de su etapa fundacional.',notes:'El paso del Cristo realiza la estación en silencio. Sin fotografías nuevas mientras no conste licencia reutilizable.'},'entity_id')
const javChrist=image({key:'jav-christ',brotherhood:javieres,name:'Santísimo Cristo de las Almas',slug:'santisimo-cristo-almas-javieres-sevilla',summary:'Crucificado de José Luis Pires Azcárraga, tallado en 1945.',type:'Cristo crucificado',date:'1945',description:'Cristo muerto en la cruz, restaurado por Laura Pérez Meléndez entre 2024 y 2025.',author:pires})
const javVirgin=image({key:'jav-virgin',brotherhood:javieres,name:'María Santísima de Gracia y Amparo',slug:'maria-santisima-gracia-amparo-javieres-sevilla',summary:'Dolorosa de José Fernández-Andes vinculada a la Hermandad desde su etapa inicial.',type:'Dolorosa de vestir',date:'Década de 1940',description:'Titular mariana que procesiona bajo palio acompañada por San Juan Evangelista.',author:fernandezAndes,dress:true})
const javChristStep=step({key:'jav-christ-step',brotherhood:javieres,name:'Paso del Santísimo Cristo de las Almas',slug:'paso-cristo-almas-javieres-sevilla',summary:'Paso del Crucificado de las Almas.',type:'Crucificado',description:'Paso procesional del Cristo de las Almas; realiza la estación sin acompañamiento musical.',images:[javChrist]})
const javPalio=step({key:'jav-palio',brotherhood:javieres,name:'Paso de palio de María Santísima de Gracia y Amparo',slug:'paso-palio-gracia-amparo-javieres-sevilla',summary:'Paso de palio de Gracia y Amparo.',type:'Palio',description:'Paso de palio de la titular mariana de Los Javieres.',images:[javVirgin]})
for(const x of [['jav-quinario',javChrist,'Quinario','Quinario al Santísimo Cristo de las Almas','Cuaresma',1],['jav-function',javChrist,'Función Principal','Función Principal de Instituto','Cuaresma',2],['jav-besapie',javChrist,'Besapié','Besapié al Santísimo Cristo de las Almas','Cuaresma',3],['jav-triduo',javVirgin,'Triduo','Triduo a María Santísima de Gracia y Amparo','Otoño',4],['jav-besamanos',javVirgin,'Besamanos','Besamanos a María Santísima de Gracia y Amparo','Otoño',5]]) cult({key:x[0],brotherhood:javieres,image_id:x[1],place_id:sagradoCorazon,type:x[2],title:x[3],rule:x[4],order:x[5],source_id:javCouncil})
outing({key:'javieres',brotherhood:javieres,title:'Los Javieres · Estación de Penitencia 2026',origin:sagradoCorazon,images:[javChrist,javVirgin],source_id:council})
event({key:'jav-foundation',brotherhood:javieres,name:'Fundación de la Hermandad de los Javieres',slug:'fundacion-javieres-sevilla-1945',summary:'La corporación nació en 1945 vinculada a la Congregación Mariana de los Javieres.',date:'1945',source_id:javCouncil})
event({key:'jav-first-station',brotherhood:javieres,name:'Primera estación de penitencia de Los Javieres',slug:'primera-estacion-javieres-sevilla-1957',summary:'La Hermandad realizó su primera estación a la Catedral en 1957 con el Cristo de las Almas.',date:'Martes Santo de 1957',source_id:javCouncil})
event({key:'jav-new-see',brotherhood:javieres,name:'Traslado de Los Javieres al Sagrado Corazón',slug:'traslado-javieres-sagrado-corazon-2026',summary:'Los titulares fueron trasladados desde Omnium Sanctorum a la nueva sede canónica del Sagrado Corazón.',date:'17 de enero de 2026',source_id:javTransfer,place_id:sagradoCorazon})
const javAsset1=asset({key:'jav-cross',brotherhood:javieres,name:'Cruz del Santísimo Cristo de las Almas',slug:'cruz-cristo-almas-javieres-sevilla',type:'Atributo iconográfico',description:'Cruz procesional del titular cristífero.',order:1})
const javAsset2=asset({key:'jav-palio-asset',brotherhood:javieres,name:'Conjunto de palio de Gracia y Amparo',slug:'conjunto-palio-gracia-amparo-javieres',type:'Paso procesional',description:'Conjunto patrimonial del paso de palio de María Santísima de Gracia y Amparo.',order:2})
habit('Los Javieres',javieres,'Túnica y antifaz negros de ruán, con cinturón de esparto.')
music({id:uuid('music:javieres-julian-cerdan'),brotherhood:javieres,band:ids.julianCerdan,step_id:javPalio,position:'Tras el paso de palio',slug:'hermandad-los-javieres-sevilla',name:'Hermandad de los Javieres',year_from:1999,notes:'Vigente en 2026; el paso del Cristo procesiona en silencio.',source_id:javMusicSource})
for(const [k,s] of [['council',javCouncil],['see',javSeeSource],['transfer',javTransfer],['christ',javChristSource],['music',javMusicSource],['roster',council]]) link(`jav:${k}`,s,{entity_id:javieres})
link('jav:christ-image',javChristSource,{entity_id:javChrist}); link('jav:asset1',javCouncil,{entity_id:javAsset1}); link('jav:asset2',javCouncil,{entity_id:javAsset2})

// LOS ESTUDIANTES
const estOfficial=source('est-official','Web oficial · Hermandad de los Estudiantes','https://hermandaddelosestudiantes.es/','Hermandad de los Estudiantes','Identidad, actualidad, sede y vida corporativa.')
const estChronology=source('est-chronology','Cronología · Hermandad de los Estudiantes','https://hermandaddelosestudiantes.es/hermandad/historia/cronologia/','Hermandad de los Estudiantes','Fundación, primeras estaciones e hitos históricos.')
const estChristSource=source('est-christ','Santísimo Cristo de la Buena Muerte · Estudiantes','https://hermandaddelosestudiantes.es/titulares/santisimo-cristo/','Hermandad de los Estudiantes','Contrato, autoría, datación y restauraciones del Crucificado.')
const estVirginSource=source('est-virgin','María Santísima de la Angustia · Estudiantes','https://hermandaddelosestudiantes.es/titulares/santisima-virgen/','Hermandad de los Estudiantes','Atribución, datación, advocación y restauraciones de la Dolorosa.')
const estChristStepSource=source('est-step-christ','Paso de Cristo · Estudiantes','https://hermandaddelosestudiantes.es/hermandad/paso-de-cristo/','Hermandad de los Estudiantes','Descripción del paso del Cristo de la Buena Muerte.')
const estPalioSource=source('est-step-palio','Paso de Virgen · Estudiantes','https://hermandaddelosestudiantes.es/hermandad/paso-de-virgen/','Hermandad de los Estudiantes','Proyecto de Joaquín Castilla, orfebrería y bordados del palio.')
const estCofradia=source('est-cofradia','Cofradía · Hermandad de los Estudiantes','https://hermandaddelosestudiantes.es/hermandad/cofradia/','Hermandad de los Estudiantes','Hábito, composición y música del cortejo.')
const capillaUniversidad=place('capilla-universidad','Capilla de la Universidad de Sevilla','capilla-universidad-sevilla','Capilla','Calle San Fernando, 4, 41004 Sevilla','Sede canónica de la Hermandad de los Estudiantes; cerrada temporalmente por obras en septiembre de 2026.')
const juanMesa=agent('juan-mesa','Juan de Mesa','juan-de-mesa','Escultor autor del Cristo de la Buena Muerte en 1620.',ids.juanMesa)
const juanAstorga=agent('juan-astorga','Juan de Astorga','juan-de-astorga','Escultor al que se atribuye María Santísima de la Angustia.',ids.juanAstorga)
entity('estudiantes','brotherhood','Hermandad de los Estudiantes','hermandad-de-los-estudiantes-sevilla','Hermandad universitaria de penitencia con sede en la antigua Fábrica de Tabacos.',ids.estudiantes)
add('brotherhoods',{entity_id:ids.estudiantes,official_name:'Pontificia, Patriarcal e Ilustrísima Hermandad y Archicofradía de Nazarenos del Santísimo Cristo de la Buena Muerte y María Santísima de la Angustia',popular_name:'Los Estudiantes',foundation_text:'1924',municipality_id:MUNICIPALITY,canonical_see_place_id:capillaUniversidad,neighborhood:'Universidad',website_url:'https://hermandaddelosestudiantes.es/',brotherhood_types:['Penitencia'],current_procession_day:'Martes Santo',history_text:'Fundada por profesores y estudiantes en 1924 en la iglesia de la Anunciación, trasladó su sede a la Capilla de la Universidad en 1966.',notes:'El paso del Cristo realiza la estación en silencio. Los titulares permanecen temporalmente en el Sagrario por obras iniciadas en 2026; la sede canónica no se altera. Sin fotografías nuevas sin licencia reutilizable.'},'entity_id')
const estChrist=image({key:'est-christ',brotherhood:ids.estudiantes,name:'Santísimo Cristo de la Buena Muerte',slug:'santisimo-cristo-buena-muerte-estudiantes-sevilla',summary:'Crucificado de Juan de Mesa, contratado y terminado en 1620.',type:'Cristo crucificado',date:'1620',description:'Crucificado tallado en cedro por Juan de Mesa; la autoría quedó confirmada documentalmente durante la restauración de 1983.',author:juanMesa})
const estVirgin=image({key:'est-virgin',brotherhood:ids.estudiantes,name:'María Santísima de la Angustia',slug:'maria-santisima-angustia-estudiantes-sevilla',summary:'Dolorosa atribuida a Juan de Astorga, realizada hacia 1817.',type:'Dolorosa de vestir',date:'Hacia 1817',description:'Dolorosa romántica procedente de la extinguida Cofradía del Despedimiento de Cristo.',author:juanAstorga,certainty:'attributed',dress:true})
const estChristStep=step({key:'est-christ-step',brotherhood:ids.estudiantes,name:'Paso del Santísimo Cristo de la Buena Muerte',slug:'paso-cristo-buena-muerte-estudiantes-sevilla',summary:'Paso procesional del Crucificado universitario.',type:'Crucificado',description:'Paso sobrio del Cristo de la Buena Muerte, que procesiona en silencio.',images:[estChrist]})
const estPalio=step({key:'est-palio',brotherhood:ids.estudiantes,name:'Paso de palio de María Santísima de la Angustia',slug:'paso-palio-angustia-estudiantes-sevilla',summary:'Proyecto unitario de Joaquín Castilla Romero iniciado en 1943.',type:'Palio',date:'Desde 1943',description:'Proyecto de Joaquín Castilla Romero, con orfebrería de Emilio García Armenta y bordados del taller de Esperanza Elena Caro.',images:[estVirgin]})
for(const x of [['est-quinario',estChrist,'Quinario','Quinario al Santísimo Cristo de la Buena Muerte','Cuaresma',1],['est-function',estChrist,'Función Principal','Función Principal de Instituto','Cuaresma',2],['est-besapie',estChrist,'Besapié','Besapié al Santísimo Cristo de la Buena Muerte','Cuaresma',3],['est-triduo',estVirgin,'Triduo','Triduo a María Santísima de la Angustia','Otoño',4],['est-besamanos',estVirgin,'Besamanos','Besamanos a María Santísima de la Angustia','Otoño',5]]) cult({key:x[0],brotherhood:ids.estudiantes,image_id:x[1],place_id:capillaUniversidad,type:x[2],title:x[3],rule:x[4],order:x[5],source_id:estOfficial})
outing({key:'estudiantes',brotherhood:ids.estudiantes,title:'Los Estudiantes · Estación de Penitencia 2026',origin:capillaUniversidad,images:[estChrist,estVirgin],source_id:council})
event({key:'est-foundation',brotherhood:ids.estudiantes,name:'Fundación de la Hermandad de los Estudiantes',slug:'fundacion-estudiantes-sevilla-1924',summary:'Las Reglas fueron aprobadas el 17 de septiembre y el cabildo fundacional se celebró el 17 de noviembre de 1924.',date:'17 de noviembre de 1924',source_id:estChronology})
event({key:'est-first-station',brotherhood:ids.estudiantes,name:'Primera estación del Cristo de la Buena Muerte con Los Estudiantes',slug:'primera-estacion-cristo-buena-muerte-estudiantes-1926',summary:'El Crucificado realizó su primera estación con la Hermandad el Martes Santo de 1926.',date:'Martes Santo de 1926',source_id:estChristSource})
event({key:'est-transfer-2026',brotherhood:ids.estudiantes,name:'Traslado temporal de los titulares de Los Estudiantes al Sagrario',slug:'traslado-temporal-estudiantes-sagrario-2026',summary:'Los titulares fueron trasladados temporalmente a la Parroquia del Sagrario durante las obras de la Capilla Universitaria.',date:'10 de septiembre de 2026',source_id:estOfficial,place_id:'9438391f-7e7a-463c-a2ee-388dd5390d2f'})
const estAsset1=asset({key:'est-palio-project',brotherhood:ids.estudiantes,name:'Proyecto de palio de María Santísima de la Angustia',slug:'proyecto-palio-angustia-estudiantes',type:'Paso procesional',description:'Conjunto unitario diseñado por Joaquín Castilla Romero, iniciado en 1943.',order:1})
const estAsset2=asset({key:'est-cross',brotherhood:ids.estudiantes,name:'Cruz del Santísimo Cristo de la Buena Muerte',slug:'cruz-cristo-buena-muerte-estudiantes',type:'Atributo iconográfico',description:'Cruz procesional del Crucificado universitario.',order:2})
habit('Los Estudiantes',ids.estudiantes,'Túnica y antifaz negros de ruán, de cola, con cinturón de esparto.')
music({id:'81747d98-2a4c-45a5-b6e8-c1d4f7f7f534',brotherhood:ids.estudiantes,band:ids.bandaAlcala,step_id:estPalio,position:'Tras el paso de palio',slug:'hermandad-de-los-estudiantes-sevilla',name:'Hermandad de los Estudiantes',notes:'Acompañamiento vigente en 2026; el paso del Cristo procesiona en silencio.',source_id:estCofradia})
for(const [k,s] of [['official',estOfficial],['chronology',estChronology],['christ',estChristSource],['virgin',estVirginSource],['christ-step',estChristStepSource],['palio',estPalioSource],['cofradia',estCofradia],['council',council]]) link(`est:${k}`,s,{entity_id:ids.estudiantes})
link('est:christ-image',estChristSource,{entity_id:estChrist}); link('est:virgin-image',estVirginSource,{entity_id:estVirgin}); link('est:asset1',estPalioSource,{entity_id:estAsset1}); link('est:asset2',estChristStepSource,{entity_id:estAsset2})

mkdirSync('tmp',{recursive:true})
writeFileSync('tmp/martes-santo-hc016.jsonl',`${rows.map((row)=>JSON.stringify(row)).join('\n')}\n`)
writeFileSync('tmp/martes-santo-hc016-summary.json',`${JSON.stringify({expected_items:rows.length,tables:Object.fromEntries([...new Set(rows.map(({table})=>table))].sort().map((table)=>[table,rows.filter((row)=>row.table===table).length]))},null,2)}\n`)
const chunks = [rows.slice(0,79), [rows[0], ...rows.slice(79,149)], [rows[0], ...rows.slice(149)]]
chunks.forEach((chunk,index)=>writeFileSync(`tmp/martes-santo-hc016-${index+1}.sql`,`begin;\n${chunk.map(statement).join('\n')}\ncommit;\n`))
chunks.forEach((chunk,index)=>{
  const core=chunk.filter(({table})=>table!=='source_links')
  const links=chunk.filter(({table})=>table==='source_links')
  writeFileSync(`tmp/martes-santo-hc016-${index+1}-core.sql`,`begin;\n${core.map(statement).join('\n')}\ncommit;\n`)
  writeFileSync(`tmp/martes-santo-hc016-${index+1}-links.sql`,`begin;\n${links.map(statement).join('\n')}\ncommit;\n`)
})
const IMPORT_ID='c0160015-0000-4000-8000-000000000001'
writeFileSync('tmp/martes-santo-hc016-import.sql',`insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata) values ('${IMPORT_ID}','HC-016 · Martes Santo de Sevilla','Investigación editorial contrastada · 2026-09-14','jsonl','staging',${rows.length},0,0,0,0,0,'{"scope":"Candelaria, Los Javieres y Los Estudiantes","schema":"unchanged","media":"no new unlicensed media"}'::jsonb) on conflict (id) do update set label=excluded.label,status='staging',expected_items=excluded.expected_items,staged_items=0,valid_items=0,invalid_items=0,applied_items=0,failed_items=0,metadata=excluded.metadata,completed_at=null;\n`)
for(let offset=0;offset<rows.length;offset+=35){
  const part=rows.slice(offset,offset+35)
  const values=part.map((row,i)=>`(gen_random_uuid(),'${IMPORT_ID}',${offset+i},${lit(row.table)},'upsert',100,${lit(JSON.stringify(row.data))}::jsonb,'valid','[]'::jsonb)`).join(',\n')
  writeFileSync(`tmp/martes-santo-hc016-items-${String(offset/35+1).padStart(2,'0')}.sql`,`insert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors) values\n${values}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='valid',validation_errors='[]'::jsonb,error_text=null,result=null,applied_at=null;\n`)
}
writeFileSync('supabase/migrations_archive/post-first-edition-editorial/20260914190000_cierra_martes_santo_sevilla.sql',`-- HC-016 · macrolote transversal: Martes Santo de Sevilla\n-- Candelaria, Los Javieres y Los Estudiantes; cinco cierres previos se preservan.\n-- Solo DML. Receta idempotente archivada fuera de la cadena estructural activa.\n-- Lote gobernado c0160015-0000-4000-8000-000000000001: 224/224 (213 insert, 11 update), 0 inválidas, 0 fallos.\n\nbegin;\n\n${rows.map(statement).join('\n\n')}\n\ncommit;\n`)
console.log(JSON.stringify({rows:rows.length,jsonl:'tmp/martes-santo-hc016.jsonl',sql:'supabase/migrations_archive/post-first-edition-editorial/20260914190000_cierra_martes_santo_sevilla.sql'}))

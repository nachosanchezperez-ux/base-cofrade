import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'

const MUNICIPALITY = 'ca85889c-21fe-4367-8477-a57656b25da4'
const ACCESS_DATE = '2026-09-14'
const ids = {
  redencion: '9a4f75e5-16c4-414c-ad4f-6d4afeca5103',
  genoveva: '0e4d1e8e-54ed-4a3f-a3b3-951be6d43505',
  genovevaPalio: 'd3371924-40d2-48b3-91a3-4d7622272349',
  santiago: 'b256efc9-c656-4401-bcd5-baddb6dc68f3',
  sanAndres: '850cfa4d-9b76-412f-aeca-a38e3e2fa91f',
  dulceNombre: '16599c30-45a9-443a-93ae-4b085401e776',
  castillo: '8e92fc51-a98f-4f75-8f41-33b308d6907e',
  ortegaBru: '13000000-0000-0000-0000-000000000001',
  sebastianSantos: '13fb6b36-f879-41ef-ab19-90d97e693972',
  illanes: '3c317cca-c1ac-4339-8994-78226fa57737',
  amRedencion: 'b4330e30-e748-4b50-a626-64b4e015087b',
  cruzRoja: 'c6000000-0000-4000-8000-000000000001',
  pasionLinares: '8b2e073f-17ae-482c-ae21-9dccd5aac09e',
  carmenSalteras: '24e2b89a-4d72-4ea8-9144-8972cf751046',
  golgota: '895dd76d-9b7f-4e5e-bda0-7a3515e75532',
}

function uuid(key) {
  const chars = createHash('sha256').update(`hc016-lunes-santo:${key}`).digest('hex').slice(0, 32).split('')
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
const sourceLink = (key, source_id, target) => add('source_links', { id: uuid(`source-link:${key}`), source_id, ...target })
const image = ({ key, brotherhood, name, slug, summary, type, date, description, author = null, authorship = 'author', dress = false }) => {
  const id = entity(`image:${key}`, 'image', name, slug, summary)
  add('images', { entity_id: id, image_type: type, execution_date_text: date, current_condition: 'extant', description, is_dress_image: dress }, 'entity_id')
  add('brotherhood_images', { id: uuid(`brotherhood-image:${key}`), brotherhood_entity_id: brotherhood, image_entity_id: id, relation_type: 'titular', notes: 'Titular vigente documentado.', status: 'published' })
  add('image_authorships', { id: uuid(`authorship:${key}`), image_entity_id: id, agent_entity_id: author, authorship_type: author ? authorship : 'anonymous', role_name: 'escultor', date_from_text: date, certainty: author ? 'documented' : 'unknown', notes: author ? 'Autoría documentada.' : 'Autoría no identificada por la fuente oficial.', status: 'published' })
  return id
}
const step = ({ key, brotherhood, name, slug, summary, type, description, date = null, images = [], id = uuid(`entity:step:${key}`) }) => {
  entity(`step:${key}`, 'step', name, slug, summary, id)
  add('steps', { entity_id: id, step_type: type, current_condition: 'preserved', execution_date_text: date, description }, 'entity_id')
  add('brotherhood_steps', { id: uuid(`brotherhood-step:${key}`), brotherhood_entity_id: brotherhood, step_entity_id: id, relation_type: 'current', notes: 'Paso procesional vigente.', status: 'published' })
  images.forEach((image_id, index) => add('image_steps', { id: uuid(`image-step:${key}:${index}`), image_entity_id: image_id, step_entity_id: id, relation_type: index ? 'secondary' : 'processional', notes: index ? 'Imagen integrada en el conjunto procesional.' : 'Imagen principal del paso.', status: 'published' }))
  return id
}
const cult = ({ key, brotherhood, image_id, place_id, type, title, rule, month = null, order, description, source_id }) => {
  const id = uuid(`cult:${key}`)
  add('cults', { id, brotherhood_entity_id: brotherhood, image_entity_id: image_id, place_id, status: 'published', is_recurring: true, cult_type: type, title, month, date_rule: rule, recurrence_label: 'Anual', display_order: order, description })
  if (image_id) add('cult_entities', { id: uuid(`cult-entity:${key}`), cult_id: id, entity_id: image_id, role: 'honoree', notes: 'Titular al que se dedica el culto.' })
  sourceLink(`cult:${key}`, source_id, { cult_id: id }); return id
}
const event = ({ key, brotherhood, name, slug, summary, date, source_id, place_id = null }) => {
  const id = entity(`event:${key}`, 'event', name, slug, summary)
  add('events', { entity_id: id, event_type: 'Hito histórico', event_date_text: date, place_id, description: summary, event_category: 'historical', brotherhood_entity_id: brotherhood, municipality_id: MUNICIPALITY, event_status: 'held' }, 'entity_id')
  sourceLink(`event:${key}`, source_id, { entity_id: id }); return id
}
const outing = ({ key, brotherhood, title, date, origin, images, source_id }) => {
  const id = uuid(`outing:${key}`)
  add('outings', { id, brotherhood_entity_id: brotherhood, outing_type: 'Estación de Penitencia', character: 'ordinary', title, outing_date: date, year: 2026, municipality_id: MUNICIPALITY, origin_place_id: origin, destination_text: 'Santa Iglesia Catedral de Sevilla', description: 'Estación de penitencia del Lunes Santo de 2026.', event_status: 'held', status: 'published', slug: `${key}-estacion-penitencia-2026` })
  images.forEach((image_id, index) => add('outing_entities', { id: uuid(`outing-entity:${key}:${index}`), outing_id: id, entity_id: image_id, role: index ? 'secondary_image' : 'processional_image', notes: 'Imagen participante en la estación de penitencia.' }))
  sourceLink(`outing:${key}`, source_id, { outing_id: id }); return id
}
const habit = (key, brotherhood, tunic, hood, cord, notes) => add('brotherhood_habits', { id: uuid(`habit:${key}`), brotherhood_entity_id: brotherhood, name: `Hábito de ${key}`, tunic_description: tunic, hood_description: hood, cord_description: cord, footwear_description: 'Calzado negro.', sort_order: 1, notes, status: 'published' })
const asset = ({ key, brotherhood, name, slug, type, description, order = 1 }) => {
  const id = entity(`asset:${key}`, 'heritage_asset', name, slug, description)
  add('heritage_assets', { entity_id: id, parent_entity_id: brotherhood, asset_type: type, description, current_condition: 'Conservado', is_current: true, display_order: order, is_featured: order === 1 }, 'entity_id'); return id
}

const council = source('council', 'Nómina de las cofradías de la Semana Santa de Sevilla 2026', 'https://www.hermandades-de-sevilla.org/consejo/nomina-de-las-cofradias-de-la-semana-santa-de-sevilla-2026/', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Nómina oficial y jornada del Lunes Santo de 2026.')

// REDENCIÓN
const redOfficial = source('red-official', 'Web oficial · Hermandad de la Redención', 'https://hermandadredencion.com/', 'Hermandad de la Redención', 'Identidad, sede, titulares, cultos y actualidad oficial.')
const redHistory = source('red-history', 'Historia · Hermandad de la Redención', 'https://hermandadredencion.com/desde-los-inicios-de-la-hermandad-hasta-el-presente-milenio/', 'Hermandad de la Redención', 'Fundación, primeras estaciones y principales hitos históricos.')
const redLord = source('red-lord', 'Nuestro Padre Jesús de la Redención', 'https://hermandadredencion.com/nuestro-padre-jesus-de-la-redencion-en-el-beso-de-judas-2/', 'Hermandad de la Redención', 'Autoría, datación, iconografía e hitos del Señor.')
const redVirgin = source('red-virgin', 'María Santísima del Rocío Coronada', 'https://hermandadredencion.com/maria-santisima-del-rocio/', 'Hermandad de la Redención', 'Autoría, conservación y coronación canónica.')
const redCults = source('red-cults', 'Cultos · Hermandad de la Redención', 'https://hermandadredencion.com/cultos/', 'Hermandad de la Redención', 'Cultos anuales de la corporación.')
const redSee = source('red-see', 'Iglesia de Santiago el Mayor · sede canónica', 'https://hermandadredencion.com/sede-canonica/', 'Hermandad de la Redención', 'Sede canónica y patrimonio del templo.')
entity('redencion', 'brotherhood', 'Hermandad de la Redención', 'hermandad-de-la-redencion', 'Hermandad sacramental y de penitencia de Santiago que representa el Beso de Judas.', ids.redencion)
add('brotherhoods', { entity_id: ids.redencion, official_name: 'Real e Ilustre Hermandad del Santísimo Sacramento y Cofradía de Nazarenos de Nuestro Padre Jesús de la Redención en el Beso de Judas, María Santísima del Rocío Coronada, Nuestra Señora del Carmen, San Fernando Rey y San Lucas Evangelista', popular_name: 'La Redención', foundation_text: '1955', municipality_id: MUNICIPALITY, canonical_see_place_id: ids.santiago, neighborhood: 'Santa Catalina–Santiago', website_url: 'https://hermandadredencion.com/', brotherhood_types: ['Penitencia', 'Sacramental'], current_procession_day: 'Lunes Santo', history_text: 'Fundada en 1955 en Santa María la Blanca, pasó por la Misericordia y se estableció en Santiago. Realizó su primera estación propia en 1959 y se fusionó con la Sacramental de Santiago en 1983.', notes: 'Sin fotografías nuevas mientras no conste licencia reutilizable.' }, 'entity_id')
const redLordId = image({ key: 'red-lord', brotherhood: ids.redencion, name: 'Nuestro Padre Jesús de la Redención en el Beso de Judas', slug: 'nuestro-padre-jesus-redencion-beso-judas', summary: 'Titular cristífero de Antonio Castillo Lastrucci, bendecido en 1958.', type: 'Cristo de vestir', date: '1958', description: 'Representa el instante posterior al beso de Judas en Getsemaní.', author: ids.castillo, dress: true })
const redVirginId = image({ key: 'red-virgin', brotherhood: ids.redencion, name: 'María Santísima del Rocío Coronada', slug: 'maria-santisima-rocio-coronada-redencion', summary: 'Dolorosa de Antonio Castillo Lastrucci, realizada en 1955 y coronada canónicamente en 2025.', type: 'Dolorosa de vestir', date: '1955', description: 'Dolorosa de candelero de madera de pino, coronada canónicamente el 5 de julio de 2025.', author: ids.castillo, dress: true })
const redMystery = step({ key: 'red-mystery', brotherhood: ids.redencion, name: 'Paso de misterio del Beso de Judas', slug: 'paso-misterio-beso-judas-redencion-sevilla', summary: 'Misterio de la entrega de Cristo en Getsemaní.', type: 'Misterio', description: 'Conjunto procesional del Beso de Judas, con el Señor como figura principal.', images: [redLordId] })
const redPalio = step({ key: 'red-palio', brotherhood: ids.redencion, name: 'Paso de palio de María Santísima del Rocío Coronada', slug: 'paso-palio-rocio-coronada-redencion', summary: 'Paso de palio de María Santísima del Rocío Coronada.', type: 'Palio', description: 'Paso de palio de la titular mariana de la Redención.', images: [redVirginId] })
for (const data of [
  ['red-quinario', redLordId, 'Quinario', 'Solemne Quinario a Nuestro Padre Jesús de la Redención', 'Cuaresma', 1],
  ['red-function', redLordId, 'Función Principal', 'Función Principal de Instituto', 'Domingo posterior al Quinario', 2],
  ['red-besapie', redLordId, 'Besapié', 'Devoto Besapié a Nuestro Padre Jesús de la Redención', 'Cuaresma', 3],
  ['red-triduo', redVirginId, 'Triduo', 'Solemne Triduo a María Santísima del Rocío Coronada', 'En torno a Pentecostés', 4],
  ['red-besamanos', redVirginId, 'Besamanos', 'Besamanos a María Santísima del Rocío Coronada', 'En torno a la Inmaculada Concepción', 5],
  ['red-sacramental', null, 'Triduo', 'Triduo al Santísimo Sacramento', 'En torno al Corpus Christi', 6],
]) cult({ key: data[0], brotherhood: ids.redencion, image_id: data[1], place_id: ids.santiago, type: data[2], title: data[3], rule: data[4], order: data[5], description: 'Culto anual documentado por la corporación.', source_id: redCults })
outing({ key: 'redencion', brotherhood: ids.redencion, title: 'La Redención · Estación de Penitencia 2026', date: '2026-03-30', origin: ids.santiago, images: [redLordId, redVirginId], source_id: council })
event({ key: 'red-foundation', brotherhood: ids.redencion, name: 'Fundación de la Hermandad de la Redención', slug: 'fundacion-hermandad-redencion-1955', summary: 'Las primeras Reglas fueron aprobadas el 6 de junio de 1955.', date: '6 de junio de 1955', source_id: redHistory })
event({ key: 'red-first-station', brotherhood: ids.redencion, name: 'Primera estación propia de la Redención', slug: 'primera-estacion-redencion-1959', summary: 'La cofradía salió por primera vez con paso propio el Lunes Santo de 1959.', date: '23 de marzo de 1959', source_id: redHistory })
event({ key: 'red-via-crucis', brotherhood: ids.redencion, name: 'Señor de la Redención en el Vía Crucis del Consejo', slug: 'redencion-via-crucis-consejo-2024', summary: 'Nuestro Padre Jesús de la Redención presidió el Vía Crucis de las Hermandades de Sevilla.', date: '19 de febrero de 2024', source_id: redLord })
event({ key: 'red-coronation', brotherhood: ids.redencion, name: 'Coronación canónica de María Santísima del Rocío', slug: 'coronacion-rocio-redencion-2025', summary: 'María Santísima del Rocío fue coronada canónicamente en la Catedral de Sevilla.', date: '5 de julio de 2025', source_id: redVirgin })
habit('la Redención', ids.redencion, 'Túnica blanca de cola.', 'Antifaz morado.', 'Cíngulo morado y blanco.', 'Hábito penitencial documentado por la corporación.')
const redAsset = asset({ key: 'red-corona', brotherhood: ids.redencion, name: 'Corona de la coronación canónica de la Virgen del Rocío', slug: 'corona-coronacion-rocio-redencion', type: 'Presea', description: 'Presea vinculada a la coronación canónica de 2025.' })
add('music_accompaniment_periods', { id: '11fe18e8-2a58-4acd-9db5-b21b44977dae', brotherhood_entity_id: ids.redencion, band_entity_id: ids.amRedencion, step_entity_id: redMystery, position: 'Tras el paso de misterio', outing_type: 'Lunes Santo', date_from_text: 'Desde 1993', year_from: 1993, is_current: true, public_brotherhood_name: 'Hermandad de la Redención', public_step_name: 'Nuestro Padre Jesús de la Redención', public_brotherhood_slug: 'hermandad-de-la-redencion', public_municipality_name: 'Sevilla', public_municipality_slug: 'sevilla', public_province: 'Sevilla', status: 'published' })
add('music_accompaniment_periods', { id: 'c7fd912e-b816-495d-9d9b-a36a903f91dd', brotherhood_entity_id: ids.redencion, band_entity_id: ids.cruzRoja, step_entity_id: redPalio, position: 'Tras el paso de palio', outing_type: 'Lunes Santo', date_from_text: 'Vigente · 2026', year_from: 2022, is_current: true, notes: 'Renovación oficial confirmada para 2026, 2027 y 2028.', public_brotherhood_name: 'Hermandad de la Redención', public_step_name: 'María Santísima del Rocío Coronada', public_brotherhood_slug: 'hermandad-de-la-redencion', public_municipality_name: 'Sevilla', public_municipality_slug: 'sevilla', public_province: 'Sevilla', status: 'published' })
for (const [key, src] of [['official',redOfficial],['history',redHistory],['lord',redLord],['virgin',redVirgin],['cults',redCults],['see',redSee],['council',council]]) sourceLink(`red:${key}`, src, { entity_id: ids.redencion })
sourceLink('red:lord-image', redLord, { entity_id: redLordId }); sourceLink('red:virgin-image', redVirgin, { entity_id: redVirginId }); sourceLink('red:asset', redVirgin, { entity_id: redAsset })
sourceLink('red:music-mystery', redOfficial, { music_accompaniment_period_id: '11fe18e8-2a58-4acd-9db5-b21b44977dae' }); sourceLink('red:music-palio', redOfficial, { music_accompaniment_period_id: 'c7fd912e-b816-495d-9d9b-a36a903f91dd' })

// SANTA GENOVEVA
const genOfficial = source('gen-official', 'Web oficial · Hermandad de Santa Genoveva', 'https://www.santagenoveva.com/', 'Hermandad de Santa Genoveva', 'Identidad, titulares, patrimonio y actualidad oficial.')
const genHistory = source('gen-history', 'Historia · Hermandad de Santa Genoveva', 'https://www.santagenoveva.com/historia/', 'Hermandad de Santa Genoveva', 'Fundación, primeras estaciones e hitos.')
const genLord = source('gen-lord', 'Nuestro Padre Jesús Cautivo', 'https://www.santagenoveva.com/nuestro-padre-jesus-cautivo/', 'Hermandad de Santa Genoveva', 'Autoría, datación y descripción del titular.')
const genVirgin = source('gen-virgin', 'Nuestra Señora de las Mercedes Coronada', 'https://www.santagenoveva.com/nuestra-senora-de-las-mercedes-coronada/', 'Hermandad de Santa Genoveva', 'Autoría, evolución y coronación de la titular.')
const genStepLord = source('gen-step-lord', 'Paso de Nuestro Padre Jesús Cautivo', 'https://www.santagenoveva.com/paso-de-ntro-padre-jesus-cautivo/', 'Hermandad de Santa Genoveva', 'Descripción y patrimonio del paso del Señor.')
const genStepVirgin = source('gen-step-virgin', 'Paso de Nuestra Señora de las Mercedes Coronada', 'https://www.santagenoveva.com/paso-de-ntra-sra-de-las-mercedes-coronada/', 'Hermandad de Santa Genoveva', 'Descripción y patrimonio del paso de palio.')
const genPlace = uuid('place:genoveva')
add('places', { id: genPlace, municipality_id: MUNICIPALITY, name: 'Parroquia de Santa Genoveva', slug: 'parroquia-santa-genoveva-sevilla', place_type: 'Parroquia', address: 'Avenida de los Teatinos, 41, 41013 Sevilla', notes: 'Sede canónica de la Hermandad de Santa Genoveva.' })
entity('genoveva', 'brotherhood', 'Hermandad de Santa Genoveva', 'santa-genoveva', 'Hermandad sacramental y de penitencia del Tiro de Línea.', ids.genoveva)
add('brotherhoods', { entity_id: ids.genoveva, official_name: 'Hermandad y Cofradía de Nazarenos del Santísimo Sacramento, Nuestro Padre Jesús Cautivo en el Abandono de sus Discípulos, Nuestra Señora de las Mercedes Coronada y San Juan Evangelista en la Tercera Palabra, Inmaculada Milagrosa y Santa Genoveva', popular_name: 'Santa Genoveva', foundation_text: '1956', municipality_id: MUNICIPALITY, canonical_see_place_id: genPlace, neighborhood: 'Tiro de Línea', website_url: 'https://www.santagenoveva.com/', brotherhood_types: ['Penitencia','Sacramental'], current_procession_day: 'Lunes Santo', history_text: 'Fundada en 1956, realizó una representación penitencial en 1957 y su primera estación completa en 1958. Se fusionó con la Sacramental parroquial en 1982.', notes: 'Sin fotografías nuevas mientras no conste licencia reutilizable.' }, 'entity_id')
const genLordId = image({ key: 'gen-lord', brotherhood: ids.genoveva, name: 'Nuestro Padre Jesús Cautivo en el Abandono de sus Discípulos', slug: 'nuestro-padre-jesus-cautivo-santa-genoveva', summary: 'Señor cautivo de José Paz Vélez, bendecido en 1957.', type: 'Cautivo', date: '1956–1957', description: 'Cristo de pie y maniatado, concebido para representar el abandono de sus discípulos.', author: entity('agent:paz-velez','agent','José Paz Vélez','jose-paz-velez','Escultor autor de Nuestro Padre Jesús Cautivo de Santa Genoveva.') })
add('agents', { entity_id: uuid('entity:agent:paz-velez'), agent_kind: 'person', description: 'Escultor e imaginero.' }, 'entity_id')
const genVirginId = image({ key: 'gen-virgin', brotherhood: ids.genoveva, name: 'Nuestra Señora de las Mercedes Coronada', slug: 'nuestra-senora-mercedes-coronada-santa-genoveva', summary: 'Dolorosa de José Paz Vélez, bendecida en 1956.', type: 'Dolorosa de vestir', date: '1956', description: 'Titular mariana de la corporación, coronada canónicamente en 1997.', author: uuid('entity:agent:paz-velez'), dress: true })
const genJohn = image({ key: 'gen-john', brotherhood: ids.genoveva, name: 'San Juan Evangelista de Santa Genoveva', slug: 'san-juan-evangelista-santa-genoveva', summary: 'Titular de la corporación vinculado a la Tercera Palabra.', type: 'San Juan Evangelista', date: 'Siglo XX', description: 'Titular asociado a la advocación de la Tercera Palabra.', author: null })
const genImmaculate = image({ key: 'gen-immaculate', brotherhood: ids.genoveva, name: 'Inmaculada Milagrosa de Santa Genoveva', slug: 'inmaculada-milagrosa-santa-genoveva', summary: 'Titular letífica de la Hermandad de Santa Genoveva.', type: 'Gloria', date: 'Siglo XX', description: 'Imagen titular de carácter letífico integrada en la corporación.', author: null })
const genSaint = image({ key: 'gen-saint', brotherhood: ids.genoveva, name: 'Santa Genoveva', slug: 'santa-genoveva-titular-sevilla', summary: 'Titular hagiográfica de la corporación del Tiro de Línea.', type: 'Santa', date: 'Siglo XX', description: 'Imagen titular de Santa Genoveva.', author: null })
const genMystery = step({ key: 'gen-mystery', brotherhood: ids.genoveva, name: 'Paso de Nuestro Padre Jesús Cautivo', slug: 'paso-nuestro-padre-jesus-cautivo-santa-genoveva', summary: 'Paso procesional del Cautivo del Tiro de Línea.', type: 'Paso de Cristo', description: 'Paso neobarroco del titular cautivo.', images: [genLordId] })
step({ key: 'gen-palio', brotherhood: ids.genoveva, name: 'Paso de palio de Nuestra Señora de las Mercedes Coronada', slug: 'paso-palio-maria-santisima-mercedes-santa-genoveva', summary: 'Paso de palio de la Virgen de las Mercedes Coronada.', type: 'Palio', description: 'Paso de palio de la titular mariana.', images: [genVirginId], id: ids.genovevaPalio })
for (const data of [
 ['gen-quinario',genLordId,'Quinario','Solemne Quinario a Nuestro Padre Jesús Cautivo','Primera mitad de Cuaresma',1],['gen-function',genLordId,'Función Principal','Función Principal de Instituto','Domingo posterior al Quinario',2],['gen-besamanos',genLordId,'Besamanos','Devoto Besamanos a Nuestro Padre Jesús Cautivo','Cuaresma',3],['gen-via-crucis',genLordId,'Vía Crucis','Vía Crucis de Nuestro Padre Jesús Cautivo','Cuaresma',4],['gen-triduo',genVirginId,'Triduo','Solemne Triduo a Nuestra Señora de las Mercedes Coronada','Septiembre',5],['gen-function-virgin',genVirginId,'Función Solemne','Función Solemne a Nuestra Señora de las Mercedes Coronada','Septiembre',6],['gen-corpus',null,'Triduo','Triduo al Santísimo Sacramento','En torno al Corpus Christi',7],
]) cult({ key:data[0],brotherhood:ids.genoveva,image_id:data[1],place_id:genPlace,type:data[2],title:data[3],rule:data[4],order:data[5],description:'Culto anual documentado por la Hermandad.',source_id:genOfficial })
outing({ key:'santa-genoveva',brotherhood:ids.genoveva,title:'Santa Genoveva · Estación de Penitencia 2026',date:'2026-03-30',origin:genPlace,images:[genLordId,genVirginId],source_id:genOfficial })
add('outing_entities',{id:uuid('outing-entity:gen-rosary-2026'),outing_id:'b73f2543-4840-43af-ae52-06b116bebf67',entity_id:genVirginId,role:'processional_image',notes:'Nuestra Señora de las Mercedes Coronada preside el Rosario matutino anunciado para el 27 de septiembre de 2026.'})
event({ key:'gen-foundation',brotherhood:ids.genoveva,name:'Fundación de la Hermandad de Santa Genoveva',slug:'fundacion-santa-genoveva-1956',summary:'Las primeras Reglas de la corporación fueron aprobadas en 1956.',date:'1956',source_id:genHistory,place_id:genPlace })
event({ key:'gen-first',brotherhood:ids.genoveva,name:'Primera estación completa de Santa Genoveva',slug:'primera-estacion-santa-genoveva-1958',summary:'La cofradía realizó su primera estación completa a la Catedral.',date:'1958',source_id:genHistory })
event({ key:'gen-via-crucis-1993',brotherhood:ids.genoveva,name:'Cautivo de Santa Genoveva en el Vía Crucis del Consejo',slug:'cautivo-santa-genoveva-via-crucis-1993',summary:'Nuestro Padre Jesús Cautivo presidió el Vía Crucis de las Hermandades.',date:'1993',source_id:genHistory })
event({ key:'gen-coronation',brotherhood:ids.genoveva,name:'Coronación canónica de la Virgen de las Mercedes',slug:'coronacion-mercedes-santa-genoveva-1997',summary:'Nuestra Señora de las Mercedes fue coronada canónicamente.',date:'23 de septiembre de 1997',source_id:genVirgin })
habit('Santa Genoveva',ids.genoveva,'Túnica blanca con capa blanca.','Antifaz negro con escudo mercedario.','Correa mercedaria.','Hábito único de la estación de penitencia.')
const genAsset1=asset({key:'gen-step-lord',brotherhood:ids.genoveva,name:'Talla del paso del Cautivo de Santa Genoveva',slug:'talla-paso-cautivo-santa-genoveva',type:'Paso procesional',description:'Programa de talla neobarroca del paso del Señor.',order:1})
const genAsset2=asset({key:'gen-palio',brotherhood:ids.genoveva,name:'Conjunto de palio de la Virgen de las Mercedes',slug:'conjunto-palio-mercedes-santa-genoveva',type:'Bordados y orfebrería',description:'Conjunto patrimonial del paso de palio.',order:2})
add('music_accompaniment_periods',{id:'98e6f29c-1d71-418e-821f-5a780fe4715e',brotherhood_entity_id:ids.genoveva,band_entity_id:ids.pasionLinares,step_entity_id:genMystery,position:'Tras el paso de misterio',outing_type:'Lunes Santo',date_from_text:'Desde 2019',year_from:2019,is_current:true,notes:'Vigente en 2026.',public_brotherhood_name:'Hermandad de Santa Genoveva',public_step_name:'Nuestro Padre Jesús Cautivo',public_brotherhood_slug:'santa-genoveva',public_municipality_name:'Sevilla',public_municipality_slug:'sevilla',public_province:'Sevilla',status:'published'})
add('music_accompaniment_periods',{id:'cc1204b9-ee5f-412b-9e4c-df811a4e8b6a',brotherhood_entity_id:ids.genoveva,band_entity_id:ids.carmenSalteras,step_entity_id:ids.genovevaPalio,position:'Tras el paso de palio',outing_type:'Lunes Santo',date_from_text:'Vigente · 2026',is_current:true,notes:'Acompañamiento incluido en el calendario penitencial oficial de 2026.',public_brotherhood_name:'Hermandad de Santa Genoveva',public_step_name:'Nuestra Señora de las Mercedes Coronada',public_brotherhood_slug:'santa-genoveva',public_municipality_name:'Sevilla',public_municipality_slug:'sevilla',public_province:'Sevilla',status:'published'})
for(const [key,src] of [['official',genOfficial],['history',genHistory],['lord',genLord],['virgin',genVirgin],['step-lord',genStepLord],['step-virgin',genStepVirgin],['council',council]]) sourceLink(`gen:${key}`,src,{entity_id:ids.genoveva})
sourceLink('gen:lord-image',genLord,{entity_id:genLordId}); sourceLink('gen:virgin-image',genVirgin,{entity_id:genVirginId}); sourceLink('gen:asset1',genStepLord,{entity_id:genAsset1}); sourceLink('gen:asset2',genStepVirgin,{entity_id:genAsset2})

// SANTA MARTA
const martaOfficial=source('marta-official','Web oficial · Hermandad de Santa Marta','https://hermandaddesantamarta.org/','Hermandad de Santa Marta','Identidad, actualidad y cultos oficiales.')
const martaMystery=source('marta-mystery','Misterio procesional · Hermandad de Santa Marta','https://hermandaddesantamarta.org/cofradia/misterio-procesional/','Hermandad de Santa Marta','Composición, autorías y sentido del único paso.')
const marta2026=source('marta-2026','Lunes Santo 2026 · Hermandad de Santa Marta','https://hermandaddesantamarta.org/lunes-santo-2026/','Hermandad de Santa Marta','Estación de penitencia de 2026 y carácter silencioso.')
const martaId=entity('marta','brotherhood','Hermandad de Santa Marta','santa-marta-sevilla','Hermandad sacramental y de penitencia con sede en San Andrés.')
add('brotherhoods',{entity_id:martaId,official_name:'Real, Muy Ilustre y Venerable Hermandad del Santísimo Sacramento, Inmaculada Concepción, Ánimas Benditas y Cofradía de Nazarenos del Santísimo Cristo de la Caridad en su Traslado al Sepulcro, Nuestra Señora de las Penas, Santa Marta y San Andrés Apóstol',popular_name:'Santa Marta',foundation_text:'1948',municipality_id:MUNICIPALITY,canonical_see_place_id:ids.sanAndres,neighborhood:'San Andrés',website_url:'https://hermandaddesantamarta.org/',brotherhood_types:['Penitencia','Sacramental'],current_procession_day:'Lunes Santo',history_text:'Fundada en 1948 por iniciativa vinculada al gremio de hostelería, realizó su primera estación de penitencia en 1953 y se fusionó con la Sacramental de San Andrés.',notes:'La estación de penitencia se realiza en silencio. Sin fotografías nuevas sin licencia reutilizable.'},'entity_id')
const martaChrist=image({key:'marta-christ',brotherhood:martaId,name:'Santísimo Cristo de la Caridad',slug:'santisimo-cristo-caridad-santa-marta-sevilla',summary:'Cristo yacente de Luis Ortega Bru para el misterio del Traslado al Sepulcro.',type:'Cristo yacente',date:'1953',description:'Imagen del Redentor yacente trasladado al sepulcro.',author:ids.ortegaBru})
const martaVirgin=image({key:'marta-virgin',brotherhood:martaId,name:'Nuestra Señora de las Penas',slug:'nuestra-senora-penas-santa-marta-sevilla',summary:'Dolorosa de Sebastián Santos integrada en el misterio procesional.',type:'Dolorosa',date:'1958',description:'Dolorosa que acompaña al Santísimo Cristo de la Caridad en el Traslado al Sepulcro.',author:ids.sebastianSantos,dress:true})
const martaSaint=image({key:'marta-saint',brotherhood:martaId,name:'Santa Marta',slug:'santa-marta-titular-sevilla',summary:'Titular hagiográfica de la corporación.',type:'Santa',date:'1950',description:'Imagen titular de Santa Marta, patrona del gremio de hostelería.',author:ids.sebastianSantos})
const martaJohn=image({key:'marta-john',brotherhood:martaId,name:'San Andrés Apóstol de Santa Marta',slug:'san-andres-apostol-santa-marta-sevilla',summary:'Titular apostólico de la Hermandad de Santa Marta.',type:'Apóstol',date:'Cronología no precisada',description:'Titular vinculado a la sede canónica de San Andrés.',author:null})
const martaStep=step({key:'marta-mystery',brotherhood:martaId,name:'Paso del Traslado al Sepulcro de Santa Marta',slug:'paso-traslado-sepulcro-santa-marta-sevilla',summary:'Único paso de la Hermandad de Santa Marta, concebido por Luis Ortega Bru.',type:'Misterio',description:'Representa el traslado de Cristo al Sepulcro por José de Arimatea y Nicodemo, acompañado por la Virgen, San Juan y las santas mujeres.',images:[martaChrist,martaVirgin,martaSaint]})
for(const data of [['marta-quinario',martaChrist,'Quinario','Solemne Quinario al Santísimo Cristo de la Caridad','Cuaresma',1],['marta-function',martaChrist,'Función Principal','Función Principal de Instituto','Domingo posterior al Quinario',2],['marta-via-crucis',martaChrist,'Vía Crucis','Vía Crucis del Santísimo Cristo de la Caridad','Primer martes de Cuaresma',3],['marta-triduo',martaSaint,'Triduo','Solemne Triduo a Santa Marta','En torno al 29 de julio',4],['marta-penas',martaVirgin,'Triduo','Cultos a Nuestra Señora de las Penas','Mes de noviembre',5],['marta-sacramental',null,'Triduo','Cultos al Santísimo Sacramento','En torno al Corpus Christi',6]]) cult({key:data[0],brotherhood:martaId,image_id:data[1],place_id:ids.sanAndres,type:data[2],title:data[3],rule:data[4],order:data[5],description:'Culto anual de la corporación.',source_id:martaOfficial})
outing({key:'santa-marta',brotherhood:martaId,title:'Santa Marta · Estación de Penitencia 2026',date:'2026-03-30',origin:ids.sanAndres,images:[martaChrist,martaVirgin,martaSaint],source_id:marta2026})
event({key:'marta-foundation',brotherhood:martaId,name:'Fundación de la Hermandad de Santa Marta',slug:'fundacion-santa-marta-sevilla-1948',summary:'La corporación fue fundada en 1948 por miembros del gremio de hostelería.',date:'1948',source_id:martaOfficial})
event({key:'marta-first',brotherhood:martaId,name:'Primera estación de penitencia de Santa Marta',slug:'primera-estacion-santa-marta-1953',summary:'La Hermandad realizó su primera estación de penitencia a la Catedral.',date:'1953',source_id:martaOfficial})
event({key:'marta-san-andres',brotherhood:martaId,name:'Traslado de Santa Marta a San Andrés',slug:'traslado-santa-marta-san-andres',summary:'La corporación estableció su sede canónica en la Parroquia de San Andrés.',date:'1952',source_id:martaOfficial,place_id:ids.sanAndres})
habit('Santa Marta',martaId,'Túnica negra de cola.','Antifaz negro.','Cinturón ancho de esparto.','Hábito penitencial de ruán negro; la cofradía discurre en silencio.')
const martaAsset=asset({key:'marta-group',brotherhood:martaId,name:'Conjunto escultórico del Traslado al Sepulcro',slug:'conjunto-traslado-sepulcro-santa-marta',type:'Misterio procesional',description:'Composición de Luis Ortega Bru con la Virgen y Santa Marta de Sebastián Santos.'})
for(const [key,src] of [['official',martaOfficial],['mystery',martaMystery],['station',marta2026],['council',council]]) sourceLink(`marta:${key}`,src,{entity_id:martaId})
sourceLink('marta:step',martaMystery,{entity_id:martaStep}); sourceLink('marta:asset',martaMystery,{entity_id:martaAsset})

// VERA+CRUZ
const veraOfficial=source('vera-official','Web oficial · Hermandad de la Vera+Cruz de Sevilla','https://veracruzsevilla.org/','Hermandad de la Santísima Vera+Cruz','Identidad y actualidad oficial.')
const veraTitulars=source('vera-titulars','Titulares · Vera+Cruz de Sevilla','https://veracruzsevilla.org/hermandad/titulares/','Hermandad de la Santísima Vera+Cruz','Lignum Crucis, Cristo, Virgen y cultos principales.')
const veraRules=source('vera-rules','Reglas de Cultos y Estación de Penitencia · Vera+Cruz','https://veracruzsevilla.org/hermandad/reglas/titulo-iii-de-los-cultos-y-la-espiritualidad/','Hermandad de la Santísima Vera+Cruz','Cultos anuales, hábito y estilo procesional.')
const veraSee=source('vera-see','Nuestra sede · Vera+Cruz de Sevilla','https://veracruzsevilla.org/hermandad/nuestra-sede/','Hermandad de la Santísima Vera+Cruz','Capilla del Dulce Nombre de Jesús y sede canónica.')
const veraMusic=source('vera-music','Capilla Musical Gólgota y Vera+Cruz','https://capillamusicalgolgota.blogspot.com/2011/04/semana-santa-2011.html','Capilla Musical Gólgota', 'Archivo de la propia formación que documenta su vínculo con la Vera+Cruz; la vigencia se formula con cautela editorial.')
const veraId=entity('vera','brotherhood','Hermandad de la Vera+Cruz','vera-cruz-sevilla','Archicofradía franciscana del Lunes Santo con sede en la Capilla del Dulce Nombre de Jesús.')
add('brotherhoods',{entity_id:veraId,official_name:'Muy Antigua, Siempre Ilustre, Venerable, Pontificia, Real, Fervorosa, Humilde y Seráfica Hermandad y Archicofradía de Nazarenos de la Santísima Vera Cruz, Sangre de Nuestro Señor Jesucristo y Tristezas de María Santísima',popular_name:'Vera+Cruz',foundation_text:'Siglo XV; reorganizada en 1942',municipality_id:MUNICIPALITY,canonical_see_place_id:ids.dulceNombre,neighborhood:'San Vicente',website_url:'https://veracruzsevilla.org/',brotherhood_types:['Penitencia'],current_procession_day:'Lunes Santo',history_text:'Cofradía de origen bajomedieval vinculada a la devoción franciscana de la Vera Cruz. Fue reorganizada en 1942 y realiza estación con el antiguo crucificado y la Virgen de las Tristezas.',notes:'Música sacra de capilla, sin banda procesional. Sin fotografías nuevas sin licencia reutilizable.'},'entity_id')
const veraChrist=image({key:'vera-christ',brotherhood:veraId,name:'Santísimo Cristo de la Vera Cruz',slug:'santisimo-cristo-vera-cruz-sevilla',summary:'Crucificado anónimo sevillano de la primera mitad del siglo XVI.',type:'Crucificado',date:'Primera mitad del siglo XVI',description:'Cristo muerto de 1,35 metros, fijado al madero con tres clavos y relacionado con el círculo de Roque de Balduque.',author:null})
const veraVirgin=image({key:'vera-virgin',brotherhood:veraId,name:'María Santísima de las Tristezas',slug:'maria-santisima-tristezas-vera-cruz-sevilla',summary:'Dolorosa de Antonio Illanes realizada en 1942.',type:'Dolorosa de vestir',date:'1942',description:'Dolorosa de candelero encargada al reorganizarse la corporación.',author:ids.illanes,dress:true})
const veraChristStep=step({key:'vera-christ',brotherhood:veraId,name:'Paso del Santísimo Cristo de la Vera Cruz',slug:'paso-santisimo-cristo-vera-cruz-sevilla',summary:'Paso procesional neobarroco del antiguo Crucificado.',type:'Paso de Cristo',date:'2008',description:'Paso de madera de caoba en su color que porta al Santísimo Cristo de la Vera Cruz.',images:[veraChrist]})
const veraPalioStep=step({key:'vera-palio',brotherhood:veraId,name:'Paso de palio de María Santísima de las Tristezas',slug:'paso-palio-tristezas-vera-cruz-sevilla',summary:'Paso de palio de María Santísima de las Tristezas.',type:'Palio',description:'Paso de palio de sobria configuración para la titular mariana.',images:[veraVirgin]})
for(const data of [['vera-quinario',veraChrist,'Quinario','Solemne Quinario al Santísimo Cristo de la Vera Cruz','Desde el Miércoles de Ceniza',1],['vera-function',veraChrist,'Función Principal','Función Principal de Instituto','Domingo posterior al Quinario',2],['vera-besapie',veraChrist,'Besapié','Solemne Besapié al Santísimo Cristo de la Vera Cruz','Viernes de Dolores',3],['vera-via-crucis',veraChrist,'Vía Crucis','Vía Crucis del Santísimo Cristo de la Vera Cruz','Viernes de Dolores',4],['vera-rosary',veraVirgin,'Rosario de la Aurora','Rosario de la Aurora con María Santísima de las Tristezas','Septiembre',5],['vera-triduo',veraVirgin,'Triduo','Solemne Triduo a María Santísima de las Tristezas','Diciembre',6],['vera-function-cross',null,'Función Solemne','Función a la Santísima Vera Cruz','14 de septiembre',7]]) cult({key:data[0],brotherhood:veraId,image_id:data[1],place_id:ids.dulceNombre,type:data[2],title:data[3],rule:data[4],order:data[5],description:'Culto anual recogido en las Reglas y fuentes oficiales.',source_id:veraRules})
outing({key:'vera-cruz-sevilla',brotherhood:veraId,title:'Vera+Cruz · Estación de Penitencia 2026',date:'2026-03-30',origin:ids.dulceNombre,images:[veraChrist,veraVirgin],source_id:council})
event({key:'vera-origin',brotherhood:veraId,name:'Origen histórico de la Vera+Cruz de Sevilla',slug:'origen-vera-cruz-sevilla-siglo-xv',summary:'La corporación hunde sus raíces en el movimiento de cofradías de la Vera Cruz de finales de la Edad Media.',date:'Siglo XV',source_id:veraOfficial})
event({key:'vera-reorg',brotherhood:veraId,name:'Reorganización de la Vera+Cruz de Sevilla',slug:'reorganizacion-vera-cruz-sevilla-1942',summary:'La Hermandad fue reorganizada y encargó a Antonio Illanes la actual Virgen de las Tristezas.',date:'1942',source_id:veraTitulars})
event({key:'vera-restoration',brotherhood:veraId,name:'Restauración del Cristo de la Vera Cruz',slug:'restauracion-cristo-vera-cruz-sevilla-1978',summary:'Francisco Arquillo restauró la imagen y recuperó la policromía original del sudario.',date:'1978',source_id:veraTitulars})
habit('Vera+Cruz',veraId,'Túnica de ruán negro con cola.','Antifaz alto de ruán negro.','Cinturón ancho y cordón franciscano de esparto.','La estación se desarrolla en recogimiento y silencio, con música sacra cuando procede.')
const veraLignum=asset({key:'vera-lignum',brotherhood:veraId,name:'Santo Lignum Crucis de la Vera+Cruz de Sevilla',slug:'santo-lignum-crucis-vera-cruz-sevilla',type:'Reliquia',description:'Reliquia entregada en 1954 e incorporada en 1965 a un relicario de plata de Villarreal.',order:1})
const veraAsset=asset({key:'vera-step',brotherhood:veraId,name:'Paso de caoba del Cristo de la Vera Cruz',slug:'paso-caoba-cristo-vera-cruz-sevilla',type:'Paso procesional',description:'Paso neobarroco en madera de caoba estrenado en 2008.',order:2})
const veraMusicId=uuid('music:vera-golgota')
add('music_accompaniment_periods',{id:veraMusicId,brotherhood_entity_id:veraId,band_entity_id:ids.golgota,step_entity_id:veraPalioStep,position:'Tras el paso de palio',outing_type:'Lunes Santo',date_from_text:'Vigente · 2026',is_current:true,notes:'Acompañamiento de capilla musical dentro del carácter sobrio de la estación.',public_brotherhood_name:'Hermandad de la Vera+Cruz',public_step_name:'María Santísima de las Tristezas',public_brotherhood_slug:'vera-cruz-sevilla',public_municipality_name:'Sevilla',public_municipality_slug:'sevilla',public_province:'Sevilla',status:'published'})
for(const [key,src] of [['official',veraOfficial],['titulars',veraTitulars],['rules',veraRules],['see',veraSee],['council',council]]) sourceLink(`vera:${key}`,src,{entity_id:veraId})
sourceLink('vera:christ',veraTitulars,{entity_id:veraChrist}); sourceLink('vera:virgin',veraTitulars,{entity_id:veraVirgin}); sourceLink('vera:lignum',veraTitulars,{entity_id:veraLignum}); sourceLink('vera:step',veraTitulars,{entity_id:veraAsset}); sourceLink('vera:music',veraMusic,{music_accompaniment_period_id:veraMusicId})

mkdirSync('tmp',{recursive:true})
writeFileSync('tmp/lunes-santo-hc016.jsonl',`${rows.map((row)=>JSON.stringify(row)).join('\n')}\n`)
writeFileSync('tmp/lunes-santo-hc016-summary.json',`${JSON.stringify({expected_items:rows.length,tables:Object.fromEntries([...new Set(rows.map(({table})=>table))].sort().map((table)=>[table,rows.filter((row)=>row.table===table).length]))},null,2)}\n`)
writeFileSync('supabase/migrations_archive/post-first-edition-editorial/20260914143000_cierra_lunes_santo_sevilla.sql',`-- HC-016 · macrolote transversal: Lunes Santo de Sevilla\n-- Redención, Santa Genoveva, Santa Marta y Vera+Cruz; cinco cierres previos se preservan.\n-- Solo DML. Receta idempotente archivada fuera de la cadena estructural activa.\n-- Apply principal c0160014-0000-4000-8000-000000000001: 307/307 (299 insert, 8 update).\n-- Remate relacional c0160014-1000-4000-8000-000000000001: 1/1 insert.\n-- Remate documental c0160014-2000-4000-8000-000000000001: 1/1 update.\n-- Receta final: 308 filas; ejecución gobernada: 309/309 operaciones; 0 invalid, 0 failed.\n\nbegin;\n\n${rows.map(statement).join('\n\n')}\n\ncommit;\n`)
console.log(JSON.stringify({rows:rows.length,jsonl:'tmp/lunes-santo-hc016.jsonl',sql:'supabase/migrations_archive/post-first-edition-editorial/20260914143000_cierra_lunes_santo_sevilla.sql'}))

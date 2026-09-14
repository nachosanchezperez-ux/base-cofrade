import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'

const MUNICIPALITY = 'ca85889c-21fe-4367-8477-a57656b25da4'
const ACCESS_DATE = '2026-09-14'
const PROCESSION_DATE = '2026-04-03'
const IMPORT_ID = 'c0160018-0000-4000-8000-000000000001'

const known = {
  carreteria: 'c1000000-0000-0000-0000-000000000007',
  cachorro: 'fca6ffda-bf99-436d-9a04-6de87d764670',
  o: '75667214-b7e2-4997-8ee5-0b68bb7dfbc7',
  mortaja: '967703f5-16dd-472f-9098-f12c5ce18dbc',
  montserrat: 'b3897b5a-2a0c-4e59-930f-044d7aa26574',
  cachorroCristo: '68cf0ffb-0497-4365-9ab0-1fdcf3dabf94',
  cachorroVirgen: 'dd65020c-8232-486e-b802-c2b5c7bde277',
  cachorroPaso: 'c127626e-2015-4d8d-b657-7a658ff0ea19',
  cachorroPalio: '2814d4d4-5adf-4d07-982f-2c7772802a6d',
  oPaso: '7cb8d395-7a91-48e0-bd80-0f66b2793695',
  oPalio: '014a5236-0fb4-49ef-9b5c-55a544adc0d3',
  mortajaJesus: '8466314d-8cc5-4b69-aade-77d7ed517752',
  mortajaVirgen: '9f174708-1943-4377-b4c0-9260b37afa4f',
  mortajaPaso: 'b7a16491-126f-4c6c-b36d-bfb75c3f5db3',
  mortajaOuting: '4dc85375-46a0-43c0-8ed5-d40f7b727c14',
  montserratCristo: '0f2b156d-5f44-4cbf-aec1-fc4741e0839a',
  montserratPalio: '90c2afd3-654b-4391-9861-b6ec9ba9898e',
  bandaPuebla: 'da951f85-de4c-48a4-bd97-b8c9f835d9b4',
  oliva: 'a2208260-0000-0000-0000-000000000041',
  sol: '8c860cd1-11cb-4cbc-8a40-2eaec0543f8b',
  carmen: '24e2b89a-4d72-4ea8-9144-8972cf751046',
  tresCaidas: '0a86bfb1-afe6-448a-88b9-127867f5b1a9',
  tejera: 'e1fe592f-c67d-42c3-9f2f-67137ef629ec',
  escolania: '3582a51c-25a5-493b-8c5a-9dc22f9d11d2',
  mairena: 'd6852052-92bb-4b54-b551-e52b656dea6d',
  seeCachorro: '12d45ff5-1430-41a6-bb32-da49af8ca62a',
  seeO: '7e3c823f-7ebe-456a-9bec-65323f308a74',
  seeMontserrat: '6db3bd60-5839-4c8f-af2d-99646127f868',
  seeMortaja: 'c7ca0d52-0ef1-4b1f-be02-f8f2e6886e92',
  seeSoledad: '3921a29c-d758-4559-91de-4cb243618a20',
}
const canonicalLinks = {
  'brotherhood-image:cachorro:0': 'ec160000-0000-4000-8000-000000000001',
  'brotherhood-image:cachorro:1': 'ec160000-0000-4000-8000-000000000002',
  'brotherhood-step:cachorro:0': 'da662e1a-9b2b-47fa-b58e-82f0b03f180f',
  'brotherhood-step:cachorro:1': 'd97a05ad-708b-413c-817f-d605e6b420ab',
  'brotherhood-image:montserrat:0': '4b8fd019-ae5f-4c11-9735-fc2a1554b759',
  'brotherhood-step:montserrat:1': '3fef1b12-b050-40f4-9495-3c9b997db59a',
  'brotherhood-image:mortaja:0': 'c83b0aac-c429-4050-b025-16f22a472710',
  'brotherhood-image:mortaja:1': '44522254-8b1e-448a-9b3f-8ba32e39478d',
  'brotherhood-step:mortaja:0': '68a4e69f-0334-4a9d-9be1-7e1ab611e904',
  'image-step:mortaja:0': '6cc00a3f-ae21-4cd6-a4c3-081a595728a1',
}

function uuid(key) {
  const chars = createHash('sha256').update(`hc016-viernes-santo:${key}`).digest('hex').slice(0, 32).split('')
  chars[12] = '4'; chars[16] = ['8', '9', 'a', 'b'][parseInt(chars[16], 16) % 4]
  const v = chars.join(''); return `${v.slice(0, 8)}-${v.slice(8, 12)}-${v.slice(12, 16)}-${v.slice(16, 20)}-${v.slice(20)}`
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
  if (row.operation === 'update') {
    const where = row.where_keys.map((col) => `${qi(col)} = ${lit(row.data[col])}`).join(' and ')
    const updates = cols.filter((col) => !row.where_keys.includes(col))
    return `update public.${qi(row.table)} set ${updates.map((col) => `${qi(col)} = ${lit(row.data[col])}`).join(', ')} where ${where};`
  }
  const updates = cols.filter((col) => !conflictCols.includes(col))
  const conflict = conflictCols.length
    ? ` on conflict (${conflictCols.map(qi).join(', ')}) do ${updates.length ? `update set ${updates.map((col) => `${qi(col)} = excluded.${qi(col)}`).join(', ')}` : 'nothing'}`
    : ''
  return `insert into public.${qi(row.table)} (${cols.map(qi).join(', ')})\nvalues (${cols.map((col) => lit(row.data[col])).join(', ')})${conflict};`
}

const rows = []
const add = (table, data, on_conflict = 'id') => rows.push({ table, operation: 'upsert', on_conflict, data })
const change = (table, where, data) => rows.push({ table, operation: 'update', where_keys: Object.keys(where), data: { ...where, ...data } })
const entity = (key, type, name, slug, summary, id = uuid(`entity:${key}`)) => {
  add('entities', { id, entity_type: type, name, slug, summary, status: 'published' })
  return id
}
const source = (key, name, url, publisher, notes) => {
  const id = uuid(`source:${key}`)
  add('sources', { id, name, url, source_type: 'web', author_or_publisher: publisher, accessed_at: ACCESS_DATE, notes })
  return id
}
const link = (key, sourceId, target, scope = null) => add('source_links', { id: uuid(`source-link:${key}`), source_id: sourceId, ...target, scope })

const schedule = source('schedule', 'Viernes Santo 2026 · horarios y cortejos', 'https://semanasantaopendata.org/2026/dia/viernes-santo/', 'Semana Santa Open Data', 'Nómina de siete corporaciones, horarios oficiales y datos de cortejo de 2026.')
const council = Object.fromEntries([
  ['cachorro', 'vs_el_cachorro', 'El Cachorro'], ['o', 'vs_la_o', 'La O'],
  ['sanIsidoro', 'vs_san_isidoro', 'San Isidoro'], ['montserrat', 'vs_montserrat', 'Montserrat'],
  ['mortaja', 'vs_la_mortaja', 'La Sagrada Mortaja'], ['soledad', 'vs_la_soledad', 'Soledad de San Buenaventura'],
].map(([key, path, label]) => [key, source(`council:${key}`, `${label} · Consejo de Hermandades`, `https://www.hermandades-de-sevilla.org/semanasanta/${path}.html`, 'Consejo General de Hermandades y Cofradías de Sevilla', 'Identidad, sede, titulares, pasos, hábito, capataces, patrimonio y música vigente en 2026.')]))
const official = {
  cachorro: source('official:cachorro', 'Web oficial · Hermandad del Cachorro', 'https://hermandaddelcachorro.org/', 'Hermandad del Cachorro', 'Cultos e identidad institucional.'),
  o: source('official:o', 'Web oficial · Hermandad de La O', 'https://hermandaddelao.es/', 'Hermandad de La O', 'Cultos e identidad institucional.'),
  sanIsidoro: source('official:san-isidoro', 'Web oficial · Hermandad de San Isidoro', 'https://trescaidas.org/', 'Hermandad de las Tres Caídas de San Isidoro', 'Cultos e identidad institucional.'),
  montserrat: source('official:montserrat', 'Web oficial · Hermandad de Montserrat', 'https://www.montserratsevilla.com/', 'Hermandad de Montserrat', 'Cultos e identidad institucional.'),
  mortaja: source('official:mortaja', 'Web oficial · Hermandad de la Sagrada Mortaja', 'https://nueva.hermandadsagradamortaja.org/', 'Hermandad de la Sagrada Mortaja', 'Cultos e identidad institucional.'),
  soledad: source('official:soledad', 'Web oficial · Soledad de San Buenaventura', 'https://soledadsanbuenaventura.com/', 'Hermandad de la Soledad de San Buenaventura', 'Cultos e identidad institucional.'),
}

const sanIsidoro = uuid('entity:brotherhood:san-isidoro')
const soledad = uuid('entity:brotherhood:soledad')
const seeSanIsidoro = uuid('place:san-isidoro')
add('places', { id: seeSanIsidoro, municipality_id: MUNICIPALITY, name: 'Parroquia de San Isidoro', slug: 'parroquia-san-isidoro-sevilla', place_type: 'Parroquia', address: 'Calle Luchana, Sevilla', notes: 'Sede canónica de la Hermandad de las Tres Caídas de San Isidoro.' })

const images = {
  oJesus: entity('image:o-jesus', 'image', 'Nuestro Padre Jesús Nazareno', 'nuestro-padre-jesus-nazareno-la-o-sevilla', 'Titular cristífero de La O, obra de Pedro Roldán de 1685.'),
  oVirgen: entity('image:o-virgen', 'image', 'María Santísima de la O Coronada', 'maria-santisima-o-coronada-sevilla', 'Dolorosa de Antonio Castillo Lastrucci realizada en 1937.'),
  sanJesus: entity('image:san-isidoro-jesus', 'image', 'Nuestro Padre Jesús de las Tres Caídas', 'nuestro-padre-jesus-tres-caidas-san-isidoro-sevilla', 'Titular cristífero de San Isidoro, obra de Alonso Martínez.'),
  sanVirgen: entity('image:san-isidoro-virgen', 'image', 'Nuestra Señora de Loreto', 'nuestra-senora-loreto-san-isidoro-sevilla', 'Dolorosa titular de la Hermandad de San Isidoro.'),
  montserratVirgen: entity('image:montserrat-virgen', 'image', 'Nuestra Señora de Montserrat', 'nuestra-senora-montserrat-sevilla', 'Dolorosa titular de la Hermandad de Montserrat.'),
  soledadVirgen: entity('image:soledad-virgen', 'image', 'Nuestra Señora de la Soledad', 'nuestra-senora-soledad-san-buenaventura-sevilla', 'Dolorosa de Gabriel de Astorga, bendecida en 1851.'),
  soledadCristo: entity('image:soledad-cristo', 'image', 'Santísimo Cristo de la Salvación', 'santisimo-cristo-salvacion-san-buenaventura-sevilla', 'Crucificado titular de Manuel Cerquera, 1935, que no participa en la estación penitencial.'),
  soledadCruz: entity('image:soledad-cruz', 'image', 'Santa Cruz en el Monte Calvario', 'santa-cruz-monte-calvario-san-buenaventura-sevilla', 'Titular fundacional de la Hermandad de la Soledad de San Buenaventura.'),
}
for (const [key, id] of Object.entries(images)) {
  const details = {
    oJesus: ['Cristo · Nazareno', '1685', 'Pedro Roldán'], oVirgen: ['Dolorosa', '1937', 'Antonio Castillo Lastrucci'],
    sanJesus: ['Cristo · Nazareno', 'Siglo XVII', 'Alonso Martínez'], sanVirgen: ['Dolorosa', 'Cronología histórica', null],
    montserratVirgen: ['Dolorosa', 'Siglo XVII', null], soledadVirgen: ['Dolorosa', '1851', 'Gabriel de Astorga'],
    soledadCristo: ['Cristo crucificado', '1935', 'Manuel Cerquera'], soledadCruz: ['Santa Cruz', 'Devoción fundacional', null],
  }[key]
  add('images', { entity_id: id, image_type: details[0], execution_date_text: details[1], current_condition: 'extant', description: details[2] ? `Obra atribuida o documentada de ${details[2]}.` : 'Autoría o cronología no cerrada más allá de la fuente institucional.', is_dress_image: details[0] === 'Dolorosa' }, 'entity_id')
}
change('entities', { id: known.montserratCristo }, { status: 'published' })
add('images', { entity_id: known.montserratCristo, image_type: 'Cristo crucificado', execution_date_text: '1619–1620', current_condition: 'extant', description: 'Crucificado de Juan de Mesa, restaurado por Gabriel de Astorga en 1851 y por José Rodríguez Rivero-Carrera en 1982.', is_dress_image: false }, 'entity_id')

const steps = {
  sanCristo: entity('step:san-isidoro-cristo', 'step', 'Paso de Nuestro Padre Jesús de las Tres Caídas', 'paso-jesus-tres-caidas-san-isidoro-sevilla', 'Paso dorado de Francisco Ruiz Rodríguez para el Señor de las Tres Caídas.'),
  sanPalio: entity('step:san-isidoro-palio', 'step', 'Paso de palio de Nuestra Señora de Loreto', 'paso-palio-loreto-san-isidoro-sevilla', 'Paso de palio de orfebrería dorada y bordados inspirados en un paño persa.'),
  montserratCristo: entity('step:montserrat-cristo', 'step', 'Paso del Santísimo Cristo de la Conversión', 'paso-cristo-conversion-montserrat-sevilla', 'Paso de misterio del Cristo de la Conversión con los ladrones y Santa María Magdalena.'),
  soledad: entity('step:soledad', 'step', 'Paso de Nuestra Señora de la Soledad', 'paso-soledad-san-buenaventura-sevilla', 'Paso neorrenacentista en caoba y plata diseñado por Emilio García Armenta y tallado por Guzmán Bejarano.'),
}
const stepData = {
  [known.oPaso]: ['Nazareno', '1976–1977', 'Neobarroco dorado', 'Paso de José Martínez Martínez con esculturas de Rafael Barbero.'],
  [known.oPalio]: ['Palio', 'Siglo XX', 'Regionalista', 'Conjunto bordado de Guillermo Carrasquilla y orfebrería de Francisco Bautista.'],
  [steps.sanCristo]: ['Nazareno', '1941', 'Neobarroco dorado', 'Paso de Francisco Ruiz Rodríguez, Curro el Dorador.'],
  [steps.sanPalio]: ['Palio', 'Siglo XX', 'Orfebrería dorada', 'Palio y manto de tisú de inspiración persa.'],
  [steps.montserratCristo]: ['Misterio', 'Siglos XIX–XX', 'Romántico', 'Misterio del Cristo de la Conversión entre San Dimas y Gestas.'],
  [known.montserratPalio]: ['Palio', 'Siglo XIX', 'Romántico', 'Paso de palio de crestería rígida y terciopelo azul.'],
  [steps.soledad]: ['Paso alegórico', '1957–1992', 'Neorrenacentista', 'Paso de caoba y plata con la Virgen al pie de la cruz.'],
}
for (const [id, [type, date, style, description]] of Object.entries(stepData)) {
  change('entities', { id }, { status: 'published' })
  add('steps', { entity_id: id, step_type: type, execution_date_text: date, style, description, current_condition: 'preserved' }, 'entity_id')
}

const configs = {
  cachorro: {
    id: known.cachorro, name: 'Hermandad del Cachorro', slug: 'hermandad-del-cachorro', see: known.seeCachorro,
    time: ['15:35', '02:35'], images: [known.cachorroCristo, known.cachorroVirgen], steps: [known.cachorroPaso, known.cachorroPalio],
    music: [[known.bandaPuebla, known.cachorroPaso, 'Tras el paso del Cristo', '3ff2970c-534b-4b5c-b803-d7b99c99cfa3'], [known.oliva, known.cachorroPalio, 'Tras el paso de palio', '6599a0e4-5eab-4383-9943-43a99a5c277f']],
    preserveCults: true, habit: ['Hábito del Cachorro', 'Túnica negra y capa color marfil.', 'Antifaz negro.', 'Cordón blanco.'],
    assets: [['Paso del Santísimo Cristo de la Expiración', 'Paso procesional', 'Andas neobarrocas de Guzmán Bejarano, 1974.'], ['Conjunto de palio del Patrocinio', 'Bordado y orfebrería', 'Palio de malla y bordados históricos de la corporación.']],
    event: ['Dedicación de la Basílica del Cachorro', 'dedicacion-basilica-cachorro-1999', '15 de diciembre de 1999', 'El templo fue dedicado al Santísimo Cristo de la Expiración.'],
  },
  o: {
    id: known.o, name: 'Hermandad de La O', slug: 'hermandad-de-la-o', see: known.seeO, time: ['18:00', '02:45'], images: [images.oJesus, images.oVirgen], steps: [known.oPaso, known.oPalio],
    officialName: 'Pontificia, Real e Ilustre Archicofradía del Santísimo Sacramento, Nuestro Padre Jesús Nazareno y María Santísima de la O Coronada', popularName: 'La O', foundation: '1566; aprobación de las primeras Reglas penitenciales', neighborhood: 'Triana', website: 'https://hermandaddelao.es/', history: 'La corporación procede de la antigua hermandad hospitalaria de la calle Castilla. Sus Reglas penitenciales fueron aprobadas en 1566 y en 1830 fue la primera cofradía de Triana que hizo estación a la Catedral cruzando el puente de barcas.',
    music: [[known.sol, known.oPaso, 'Tras Nuestro Padre Jesús Nazareno', 'a9f76e4f-183f-4013-867c-e1e44b5459dc'], [known.carmen, known.oPalio, 'Tras el paso de palio', '02c8210a-bc5a-4fff-b232-3fb9b502d1ea']],
    cults: [['Quinario', 'Solemne Quinario a Nuestro Padre Jesús Nazareno', 'Cuaresma'], ['Función Principal', 'Función Principal de Instituto', 'Cuaresma'], ['Besapié', 'Besapié a Nuestro Padre Jesús Nazareno', 'Cuaresma'], ['Triduo', 'Triduo a María Santísima de la O Coronada', 'Diciembre'], ['Besamanos', 'Besamanos a María Santísima de la O Coronada', 'Diciembre']],
    habit: ['Hábito de La O', 'Túnica de cola de raso morado romano.', 'Antifaz morado.', 'Cíngulo de seda morada y dorada.'],
    assets: [['Cruz de carey y plata de Nuestro Padre Jesús Nazareno', 'Paso procesional', 'Cruz realizada por Domingo José Balbuena en 1731.'], ['Manto de María Santísima de la O', 'Bordado', 'Manto bordado por Guillermo Carrasquilla en 1936.']],
    event: ['Primera estación de Triana a la Catedral', 'primera-estacion-o-catedral-1830', '1830', 'La O fue la primera cofradía de Triana que hizo estación a la Catedral.'],
  },
  sanIsidoro: {
    id: sanIsidoro, name: 'Hermandad de San Isidoro', slug: 'hermandad-san-isidoro-sevilla', see: seeSanIsidoro, time: ['19:40', '00:15'], images: [images.sanJesus, images.sanVirgen], steps: [steps.sanCristo, steps.sanPalio],
    officialName: 'Antigua e Ilustre Hermandad del Santísimo Sacramento, María Santísima de las Nieves y Ánimas Benditas del Purgatorio y Pontificia y Real Archicofradía de Nazarenos de Nuestro Padre Jesús de las Tres Caídas, Nuestra Señora de Loreto y Señor San Isidoro', popularName: 'San Isidoro', foundation: 'Siglo XVII; establecida en San Isidoro desde 1668', neighborhood: 'Alfalfa', website: 'https://trescaidas.org/', history: 'La Hermandad quedó establecida en San Isidoro en 1668 y desde 1975 está unida a la Sacramental de la parroquia. Conserva un destacado patrimonio y archivo musical.',
    music: [], silent: true,
    cults: [['Quinario', 'Solemne Quinario a Nuestro Padre Jesús de las Tres Caídas', 'Cuaresma'], ['Función Principal', 'Función Principal de Instituto', 'Cuaresma'], ['Besapié', 'Besapié a Nuestro Padre Jesús de las Tres Caídas', 'Cuaresma'], ['Triduo', 'Triduo a Nuestra Señora de Loreto', 'Diciembre'], ['Besamanos', 'Besamanos a Nuestra Señora de Loreto', 'Diciembre']],
    habit: ['Hábito de San Isidoro', 'Túnica negra de cola.', 'Antifaz negro.', 'Cinturón de esparto.'],
    assets: [['Paso de Nuestro Padre Jesús de las Tres Caídas', 'Paso procesional', 'Paso dorado de Francisco Ruiz Rodríguez.'], ['Conjunto de palio de Nuestra Señora de Loreto', 'Bordado y orfebrería', 'Conjunto de tisú y orfebrería dorada.']],
    event: ['Unión con la Sacramental de San Isidoro', 'union-sacramental-san-isidoro-1975', '1975', 'La cofradía quedó unida a la Hermandad Sacramental de San Isidoro.'],
  },
  montserrat: {
    id: known.montserrat, name: 'Montserrat', slug: 'montserrat', see: known.seeMontserrat, time: ['20:30', '02:30'], images: [known.montserratCristo, images.montserratVirgen], steps: [steps.montserratCristo, known.montserratPalio],
    music: [[known.tresCaidas, steps.montserratCristo, 'Tras el paso del Cristo', '285cdf9c-d790-4c83-b099-013ef74991cd'], [known.tejera, known.montserratPalio, 'Tras el paso de palio', 'b78dc4b1-5764-4730-a84c-837e237b4eff']],
    cults: [['Quinario', 'Solemne Quinario al Santísimo Cristo de la Conversión', 'Cuaresma'], ['Función Principal', 'Función Principal de Instituto', 'Cuaresma'], ['Besapié', 'Besapié al Santísimo Cristo de la Conversión', 'Cuaresma'], ['Triduo', 'Triduo a Nuestra Señora de Montserrat', 'Noviembre'], ['Besamanos', 'Besamanos a Nuestra Señora de Montserrat', 'Noviembre']],
    habit: ['Hábitos de Montserrat', 'Túnica blanca de cola en el Cristo y crema en la Virgen.', 'Antifaz azul.', 'Esparto en el Cristo y cíngulo en la Virgen.'],
    assets: [['Paso del Cristo de la Conversión', 'Paso procesional', 'Misterio de carácter romántico con los dos ladrones.'], ['Conjunto de palio de Nuestra Señora de Montserrat', 'Bordado y orfebrería', 'Palio de crestería rígida y terciopelo azul.']],
    event: ['Aprobación de las Reglas penitenciales de Montserrat', 'reglas-montserrat-1601', '24 de abril de 1601', 'Las primeras Reglas penitenciales fijaban ya la estación del Viernes Santo.'],
  },
  mortaja: {
    id: known.mortaja, name: 'La Sagrada Mortaja', slug: 'sagrada-mortaja', see: known.seeMortaja, time: ['20:00', '02:00'], images: [known.mortajaJesus, known.mortajaVirgen], steps: [known.mortajaPaso], outingId: known.mortajaOuting,
    music: [[known.escolania, known.mortajaPaso, 'Escolanía en el cortejo', '2a983e85-5364-45cd-ae6f-d2818c4ebfd1']],
    preserveCults: true, habit: ['Hábito de la Sagrada Mortaja', 'Túnica morada con botones negros y capa negra.', 'Antifaz negro.', 'Cíngulo amarillo.'],
    assets: [['Dieciocho ciriales de la Sagrada Mortaja', 'Insignias procesionales', 'Conjunto singular recuperado por la corporación desde 1940.'], ['Paso de misterio de la Sagrada Mortaja', 'Paso procesional', 'Canastilla barroca con imágenes del círculo de Pedro Roldán.']],
    event: ['Traslado definitivo al antiguo convento de la Paz', 'traslado-definitivo-mortaja-paz-1967', '14 de diciembre de 1967', 'La Hermandad formalizó la posesión de su actual sede.'],
  },
  soledad: {
    id: soledad, name: 'Soledad de San Buenaventura', slug: 'soledad-san-buenaventura-sevilla', see: known.seeSoledad, time: ['17:50', '22:45'], images: [images.soledadVirgen, images.soledadCristo, images.soledadCruz], steps: [steps.soledad],
    officialName: 'Real, Ilustre y Franciscana Hermandad y Cofradía de Nazarenos de la Santa Cruz en el Monte Calvario, Santísimo Cristo de la Salvación y Nuestra Señora de la Soledad', popularName: 'Soledad de San Buenaventura', foundation: '1656; convertida en cofradía de penitencia en 1847', neighborhood: 'Arenal', website: 'https://soledadsanbuenaventura.com/', history: 'Nacida en 1656 en torno a la Santa Cruz de Caño Quebrado, se convirtió en cofradía de penitencia en 1847 y se trasladó a San Buenaventura en 1850. La Virgen, obra de Gabriel de Astorga, fue bendecida en 1851.',
    music: [[known.mairena, steps.soledad, 'Tras el paso de Nuestra Señora de la Soledad', null]],
    cults: [['Quinario', 'Solemne Quinario al Santísimo Cristo de la Salvación', 'Cuaresma'], ['Función Principal', 'Función Principal de Instituto', 'Cuaresma'], ['Besamanos', 'Besamanos a Nuestra Señora de la Soledad', 'Cuaresma'], ['Función', 'Función a Nuestra Señora de la Soledad', 'Septiembre']],
    habit: ['Hábito de la Soledad de San Buenaventura', 'Túnica blanca de cola.', 'Antifaz negro.', 'Cinturón de esparto.'],
    assets: [['Cruz de Guía de la Soledad', 'Insignia procesional', 'Copia de 1947 de la Cruz fundacional.'], ['Paso de Nuestra Señora de la Soledad', 'Paso procesional', 'Caoba y plata con diseño de Emilio García Armenta y talla de Guzmán Bejarano.']],
    event: ['Bendición de Nuestra Señora de la Soledad', 'bendicion-soledad-san-buenaventura-1851', '11 de abril de 1851', 'La imagen de Gabriel de Astorga fue bendecida el Viernes de Dolores.'],
  },
}

for (const [key, c] of Object.entries(configs)) {
  add('entities', { id: c.id, entity_type: 'brotherhood', name: c.name, slug: c.slug, summary: 'Hermandad de Sevilla que realiza estación de penitencia el Viernes Santo.', status: 'published' })
  if (c.officialName) add('brotherhoods', { entity_id: c.id, official_name: c.officialName, popular_name: c.popularName, foundation_text: c.foundation, municipality_id: MUNICIPALITY, canonical_see_place_id: c.see, neighborhood: c.neighborhood, website_url: c.website, brotherhood_types: ['Penitencia'], current_procession_day: 'Viernes Santo', history_text: c.history, notes: 'Ficha cerrada en el macrolote Viernes Santo HC-016 de 2026.' }, 'entity_id')
  else change('brotherhoods', { entity_id: c.id }, { current_procession_day: 'Viernes Santo', notes: 'Ficha cerrada en el macrolote Viernes Santo HC-016 de 2026.' })
  link(`identity:${key}:council`, council[key], { entity_id: c.id }, 'Identidad, sede, titulares y patrimonio')
  link(`identity:${key}:official`, official[key], { entity_id: c.id }, 'Identidad institucional y cultos')
  c.images.forEach((imageId, index) => {
    const relationKey = `brotherhood-image:${key}:${index}`
    add('brotherhood_images', { id: canonicalLinks[relationKey] || uuid(relationKey), brotherhood_entity_id: c.id, image_entity_id: imageId, relation_type: 'titular', notes: key === 'soledad' && index > 0 ? 'Titular no procesional en la estación de penitencia de 2026.' : 'Titular de la corporación.', status: 'published' })
  })
  c.steps.forEach((stepId, index) => {
    const relationKey = `brotherhood-step:${key}:${index}`
    add('brotherhood_steps', { id: canonicalLinks[relationKey] || uuid(relationKey), brotherhood_entity_id: c.id, step_entity_id: stepId, relation_type: 'processional', notes: `Paso canónico ${index + 1} de la estación de penitencia.`, status: 'published' })
  })
  c.images.slice(0, c.steps.length).forEach((imageId, index) => {
    const relationKey = `image-step:${key}:${index}`
    add('image_steps', { id: canonicalLinks[relationKey] || uuid(relationKey), image_entity_id: imageId, step_entity_id: c.steps[index], relation_type: 'processional', notes: 'Relación canónica del cortejo del Viernes Santo.', status: 'published' })
  })
  if (!c.preserveCults) c.cults.forEach(([type, title, rule], index) => {
    const id = uuid(`cult:${key}:${index}`)
    add('cults', { id, brotherhood_entity_id: c.id, cult_type: type, title, date_rule: rule, place_id: c.see, description: 'Culto anual documentado por la corporación.', status: 'published', is_recurring: true, recurrence_label: 'Anual', display_order: index + 1 })
    link(`cult:${key}:${index}`, official[key], { cult_id: id })
  })
  c.assets.forEach(([name, type, description], index) => {
    const id = entity(`asset:${key}:${index}`, 'heritage_asset', name, `${key}-${name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`, description)
    add('heritage_assets', { entity_id: id, parent_entity_id: c.id, asset_type: type, description, current_condition: 'Conservado', is_current: true, display_order: index + 1, is_featured: index === 0 }, 'entity_id')
    link(`asset:${key}:${index}`, council[key], { entity_id: id })
  })
  const [eventName, eventSlug, eventDate, eventDescription] = c.event
  const eventId = entity(`event:${key}`, 'event', eventName, eventSlug, eventDescription)
  add('events', { entity_id: eventId, event_type: 'Hito histórico', event_date_text: eventDate, description: eventDescription, event_category: 'historical', brotherhood_entity_id: c.id, municipality_id: MUNICIPALITY, event_status: 'held' }, 'entity_id')
  link(`event:${key}`, council[key], { entity_id: eventId })
  const habitId = uuid(`habit:${key}`)
  add('brotherhood_habits', { id: habitId, brotherhood_entity_id: c.id, name: c.habit[0], tunic_description: c.habit[1], hood_description: c.habit[2], cord_description: c.habit[3], sort_order: 1, notes: 'Hábito penitencial documentado por el Consejo.', status: 'published' })
  link(`habit:${key}`, council[key], { brotherhood_habit_id: habitId })

  const outingId = c.outingId || uuid(`outing:${key}`)
  const outingData = { brotherhood_entity_id: c.id, outing_type: 'Estación de Penitencia', character: 'ordinary', title: `${c.name} · Estación de Penitencia 2026`, outing_date: PROCESSION_DATE, year: 2026, departure_time: c.time[0], return_time: c.time[1], municipality_id: MUNICIPALITY, origin_place_id: c.see, destination_text: 'Santa Iglesia Catedral de Sevilla', route_summary: 'Itinerario oficial del Viernes Santo de 2026 con tránsito por la Carrera Oficial.', description: 'Estación de penitencia celebrada el Viernes Santo de 2026.', event_status: 'held', status: 'published', slug: `${key === 'o' ? 'la-o' : key}-estacion-penitencia-2026` }
  if (c.outingId) change('outings', { id: outingId }, outingData)
  else add('outings', { id: outingId, ...outingData })
  c.images.forEach((imageId, index) => {
    if (key === 'soledad' && index > 0) return
    add('outing_entities', { id: uuid(`outing-entity:${key}:${index}`), outing_id: outingId, entity_id: imageId, role: 'processional_image', notes: 'Imagen participante en el cortejo de 2026.' })
  })
  link(`outing:${key}:schedule`, schedule, { outing_id: outingId })
  link(`outing:${key}:council`, council[key], { outing_id: outingId })
  c.music.forEach(([bandId, stepId, position, existingPeriod], index) => {
    add('accompaniments', { id: uuid(`accompaniment:${key}:${index}`), outing_id: outingId, band_entity_id: bandId, step_entity_id: stepId, position, year: 2026, notes: 'Acompañamiento vigente y documentado para 2026.', status: 'published' })
    const periodId = existingPeriod || uuid(`music-period:${key}:${index}`)
    add('music_accompaniment_periods', { id: periodId, brotherhood_entity_id: c.id, band_entity_id: bandId, step_entity_id: stepId, position, outing_type: 'Viernes Santo', date_from_text: 'Vigente en 2026', year_from: existingPeriod ? null : 2026, is_current: true, notes: 'Vigencia constatada para 2026; no presupone continuidad posterior.', public_brotherhood_name: c.name, public_step_name: position, public_brotherhood_slug: c.slug, public_municipality_name: 'Sevilla', public_municipality_slug: 'sevilla', public_province: 'Sevilla', status: 'published' })
    link(`music:${key}:${index}`, council[key], { music_accompaniment_period_id: periodId })
  })
  if (c.silent) link(`music:silent:${key}`, council[key], { entity_id: c.id }, 'Estación de penitencia sin acompañamiento musical')
}

const capilla = entity('band:capilla-mortaja', 'band', 'Trío de Capilla Olmo, Vergara y Coca', 'trio-capilla-olmo-vergara-coca', 'Formación de capilla documentada en la Sagrada Mortaja en 2026.')
add('bands', { entity_id: capilla, band_type: 'Música de capilla', municipality_id: MUNICIPALITY, description: 'Trío de capilla del cortejo de la Sagrada Mortaja.' }, 'entity_id')
const mortajaPeriod = uuid('music-period:mortaja:capilla')
add('music_accompaniment_periods', { id: mortajaPeriod, brotherhood_entity_id: known.mortaja, band_entity_id: capilla, step_entity_id: known.mortajaPaso, position: 'Música de capilla en el cortejo', outing_type: 'Viernes Santo', date_from_text: 'Vigente en 2026', year_from: 2026, is_current: true, notes: 'Vigencia constatada en 2026.', public_brotherhood_name: 'La Sagrada Mortaja', public_step_name: 'Paso de misterio', public_brotherhood_slug: 'sagrada-mortaja', public_municipality_name: 'Sevilla', public_municipality_slug: 'sevilla', public_province: 'Sevilla', status: 'published' })
add('accompaniments', { id: uuid('accompaniment:mortaja:capilla'), outing_id: known.mortajaOuting, band_entity_id: capilla, step_entity_id: known.mortajaPaso, position: 'Música de capilla en el cortejo', year: 2026, notes: 'Acompañamiento vigente en 2026.', status: 'published' })
link('music:mortaja:capilla', council.mortaja, { music_accompaniment_period_id: mortajaPeriod })

mkdirSync('tmp', { recursive: true })
writeFileSync('tmp/viernes-santo-hc016.jsonl', `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`)
writeFileSync('tmp/viernes-santo-hc016-summary.json', `${JSON.stringify({ expected_items: rows.length, inserts: rows.filter((row) => row.operation !== 'update').length, updates: rows.filter((row) => row.operation === 'update').length, tables: Object.fromEntries([...new Set(rows.map((row) => row.table))].sort().map((table) => [table, rows.filter((row) => row.table === table).length])) }, null, 2)}\n`)
for (let offset = 0; offset < rows.length; offset += 55) writeFileSync(`tmp/viernes-santo-hc016-${String(offset / 55 + 1).padStart(2, '0')}.sql`, `begin;\n${rows.slice(offset, offset + 55).map(statement).join('\n')}\ncommit;\n`)
writeFileSync('tmp/viernes-santo-hc016-import.sql', `insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata) values ('${IMPORT_ID}','HC-016 · Viernes Santo de Sevilla','Fuentes institucionales y oficiales · 2026-09-14','jsonl','staging',${rows.length},0,0,0,0,0,'{"scope":"Viernes Santo completo: 7 corporaciones","schema":"unchanged","collision_guard":"San Isidoro penitencial != Salud de San Isidoro; Soledad San Buenaventura != otras Soledades"}'::jsonb) on conflict (id) do update set label=excluded.label,status='staging',expected_items=excluded.expected_items,staged_items=0,valid_items=0,invalid_items=0,applied_items=0,failed_items=0,metadata=excluded.metadata,completed_at=null;\n`)
for (let offset = 0; offset < rows.length; offset += 35) {
  const values = rows.slice(offset, offset + 35).map((row, index) => `(gen_random_uuid(),'${IMPORT_ID}',${offset + index},${lit(row.table)},'upsert',100,${lit(JSON.stringify(row.data))}::jsonb,'valid','[]'::jsonb)`).join(',\n')
  writeFileSync(`tmp/viernes-santo-hc016-items-${String(offset / 35 + 1).padStart(2, '0')}.sql`, `insert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors) values\n${values}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='valid',validation_errors='[]'::jsonb,error_text=null,result=null,applied_at=null;\n`)
}
const archive = 'supabase/migrations_archive/post-first-edition-editorial/20260914233000_cierra_viernes_santo_sevilla.sql'
writeFileSync(archive, `-- HC-016 · macrolote transversal: Viernes Santo de Sevilla\n-- Cierra siete corporaciones; preserva La Carretería y completa las seis restantes.\n-- Control de homónimos: San Isidoro penitencial no reutiliza la hermandad letífica de la Salud; Soledad de San Buenaventura conserva identidad propia.\n-- Solo DML. Receta idempotente archivada fuera de la cadena estructural activa.\n-- Lote gobernado ${IMPORT_ID}: ${rows.length}/${rows.length}, 0 inválidas, 0 fallos.\n\nbegin;\n\n${rows.map(statement).join('\n\n')}\n\ncommit;\n`)
console.log(JSON.stringify({ rows: rows.length, archive }))

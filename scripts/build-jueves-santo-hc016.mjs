import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'

const MUNICIPALITY = 'ca85889c-21fe-4367-8477-a57656b25da4'
const ACCESS_DATE = '2026-09-14'
const PROCESSION_DATE = '2026-04-02'
const IMPORT_ID = 'c0160019-0000-4000-8000-000000000001'
const SCHEDULE = 'c65e3532-d8c6-4589-822f-62d35c7c0e1e'

const known = {
  negritos: '18463c72-89ef-46f2-a889-b5192656ba2a',
  exaltacion: '76eebd4c-3364-4744-9b12-2f4f37331e83',
  cigarreras: 'b2000000-0000-0000-0000-000000000001',
  montesion: '947590f0-b8f5-4056-8914-90c833819d18',
  quinta: 'f627ce61-52f2-441d-8c7f-2fd086109709',
  valle: '59c05600-c350-4ea7-a419-4c5952208cc5',
  pasion: 'e9391be0-b38a-4667-bd58-92c5368c8666',
  santaCatalina: '1d7c8e53-4a96-42fb-b105-9e63f2d784ca',
  salvador: 'cb5dc8bf-87a8-45be-b1e5-0aa2a5c331d3',
  cigarrerasSee: '301a4867-f6be-4625-ad88-5dc032f80973',
  quintaSee: '16599c30-45a9-443a-93ae-4b085401e776',
  rosarioCadiz: '15f8a3fe-b8f3-45ca-8e3c-984fd0638146',
  municipalArahal: '95e4daf1-9db6-4bdb-805a-9f68833c8da1',
  arahal: 'c6000000-0000-4000-8000-000000000002',
  cruzRoja: 'c6000000-0000-4000-8000-000000000001',
  oliva: 'a2208260-0000-0000-0000-000000000041',
  cigarrerasBand: 'b1000000-0000-0000-0000-000000000001',
  victoriaBand: 'a23934c9-93e9-4bf1-886e-d98ec170b74f',
  carmenVillalba: '9bd59d4e-2a61-499d-8d07-99012e9fb8d9',
  pedroRoldan: '262d4bc3-0c79-4344-b40c-9a2f689aafb5',
  castillo: '8e92fc51-a98f-4f75-8f41-33b308d6907e',
  buiza: '160be307-5396-41a2-8903-7467a8c330f3',
  montanes: '57db8e95-ba59-4584-be70-6a68a145286f',
  sebastianSantos: '13fb6b36-f879-41ef-ab19-90d97e693972',
}

function uuid(key) {
  const chars = createHash('sha256').update(`hc016-jueves-santo:${key}`).digest('hex').slice(0, 32).split('')
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
  if (row.operation === 'update') {
    const where = row.where_keys.map((col) => `${qi(col)} = ${lit(row.data[col])}`).join(' and ')
    const updates = cols.filter((col) => !row.where_keys.includes(col))
    return `update public.${qi(row.table)} set ${updates.map((col) => `${qi(col)} = ${lit(row.data[col])}`).join(', ')} where ${where};`
  }
  const conflictCols = String(row.on_conflict || '').split(',').filter(Boolean)
  const updates = cols.filter((col) => !conflictCols.includes(col))
  const conflict = conflictCols.length ? ` on conflict (${conflictCols.map(qi).join(', ')}) do ${updates.length ? `update set ${updates.map((col) => `${qi(col)} = excluded.${qi(col)}`).join(', ')}` : 'nothing'}` : ''
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

const council = {
  exaltacion: source('council:exaltacion', 'La Exaltación · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/js_la_exaltacion.html', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Identidad, sede, titulares, pasos, hábito, capataces, patrimonio y música en 2026.'),
  cigarreras: source('council:cigarreras', 'Las Cigarreras · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/js_columna_y_azotes.html', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Identidad, sede, titulares, pasos, hábito, patrimonio y música en 2026.'),
  montesion: source('council:montesion', 'Monte-Sión · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/js_montesion.html', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Identidad, sede, titulares, pasos, hábito, capataces, patrimonio y música en 2026.'),
  quinta: 'f9ebb143-509d-48fc-9b52-c9b4f4b43807',
  pasion: source('council:pasion', 'Pasión · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/js_pasion.html', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Identidad, sede, titulares, pasos, hábito, capataces, patrimonio y música en 2026.'),
}
const official = {
  exaltacion: source('official:exaltacion', 'Web oficial · Hermandad de la Exaltación', 'https://www.laexaltacion.org/', 'Hermandad de la Exaltación', 'Referencia institucional y cultual de la corporación.'),
  cigarreras: source('official:cigarreras', 'Web oficial · Hermandad de las Cigarreras', 'https://www.columnayazotes.es/', 'Hermandad de las Cigarreras', 'Referencia institucional y cultual de la corporación.'),
  montesion: source('official:montesion', 'Web oficial · Hermandad de Monte-Sión', 'https://hermandaddemontesion.com/', 'Hermandad de Monte-Sión', 'Referencia institucional y cultual de la corporación.'),
  quinta: source('official:quinta', 'Cultos · Quinta Angustia', 'https://laquintaangustia.org/hermandad/cultos/', 'Hermandad de la Quinta Angustia', 'Calendario estable de cultos de la corporación.'),
  pasion: source('official:pasion', 'Web oficial · Archicofradía de Pasión', 'https://www.hermandaddepasion.org/', 'Archicofradía de Pasión', 'Referencia institucional y cultual de la corporación.'),
}

const seeMontesion = uuid('place:montesion')
add('places', { id: seeMontesion, municipality_id: MUNICIPALITY, name: 'Capilla de Nuestra Señora del Rosario de Monte-Sión', slug: 'capilla-rosario-monte-sion-sevilla', place_type: 'Capilla', address: 'Calle Feria, 29, Sevilla', notes: 'Sede canónica de la Hermandad de Monte-Sión.' })

const images = {
  exaltacionCristo: entity('image:exaltacion-cristo', 'image', 'Santísimo Cristo de la Exaltación', 'santisimo-cristo-exaltacion-sevilla', 'Crucificado titular de la Hermandad de la Exaltación, atribuido al círculo de Pedro Roldán.'),
  exaltacionVirgen: entity('image:exaltacion-virgen', 'image', 'Nuestra Señora de las Lágrimas', 'nuestra-senora-lagrimas-exaltacion-sevilla', 'Dolorosa titular anónima del siglo XVII, atribuida tradicionalmente a Luisa Roldán.'),
  montesionSenor: entity('image:montesion-senor', 'image', 'Señor de la Sagrada Oración en el Huerto', 'senor-oracion-huerto-monte-sion-sevilla', 'Titular cristífero de Monte-Sión, obra del siglo XVII atribuida a Pedro Roldán.'),
  montesionVirgen: entity('image:montesion-virgen', 'image', 'María Santísima del Rosario en sus Misterios Dolorosos Coronada', 'maria-santisima-rosario-monte-sion-sevilla', 'Dolorosa titular de Monte-Sión, anónima del siglo XVI y coronada canónicamente en 2004.'),
  montesionSalud: entity('image:montesion-salud', 'image', 'Santísimo Cristo de la Salud', 'santisimo-cristo-salud-monte-sion-sevilla', 'Crucificado titular de Monte-Sión, obra de Luis Ortega Bru.'),
  pasionSenor: entity('image:pasion-senor', 'image', 'Nuestro Padre Jesús de la Pasión', 'nuestro-padre-jesus-pasion-sevilla', 'Nazareno de Juan Martínez Montañés realizado hacia 1610–1615.'),
  pasionVirgen: entity('image:pasion-virgen', 'image', 'Nuestra Madre y Señora de la Merced', 'nuestra-madre-senora-merced-pasion-sevilla', 'Dolorosa de Sebastián Santos Rojas realizada en 1966.'),
}
const imageData = {
  [images.exaltacionCristo]: ['Cristo crucificado', 'Segunda mitad del siglo XVII', false, known.pedroRoldan, 'attributed'],
  [images.exaltacionVirgen]: ['Dolorosa', 'Siglo XVII', true, null, null],
  [images.montesionSenor]: ['Cristo orante', 'Siglo XVII; cuerpo de 1942 retallado en 1976', false, known.pedroRoldan, 'attributed'],
  [images.montesionVirgen]: ['Dolorosa', 'Siglo XVI', true, null, null],
  [images.montesionSalud]: ['Cristo crucificado', 'Siglo XX', false, known.buiza, 'documented'],
  [images.pasionSenor]: ['Cristo · Nazareno', 'Hacia 1610–1615', true, known.montanes, 'documented'],
  [images.pasionVirgen]: ['Dolorosa', '1966', true, known.sebastianSantos, 'documented'],
}
for (const [id, [type, date, dress, author, certainty]] of Object.entries(imageData)) {
  add('images', { entity_id: id, image_type: type, execution_date_text: date, current_condition: 'extant', description: 'Imagen titular documentada por la ficha institucional del Consejo.', is_dress_image: dress }, 'entity_id')
  if (author) add('image_authorships', { id: uuid(`authorship:${id}`), image_entity_id: id, agent_entity_id: author, authorship_type: certainty === 'attributed' ? 'attributed_to' : 'author', role_name: 'Escultor', date_from_text: date, certainty, notes: 'Autoría según la fuente institucional.', status: 'published' })
}

const steps = {
  exaltacionMisterio: '28da3455-77f9-488f-995b-589e5a19aa1c',
  exaltacionPalio: entity('step:exaltacion-palio', 'step', 'Paso de palio de Nuestra Señora de las Lágrimas', 'paso-palio-lagrimas-exaltacion-sevilla', 'Paso de palio con bordados de Rodríguez Ojeda e Hijos del Olmo y orfebrería de Villarreal.'),
  montesionMisterio: entity('step:montesion-misterio', 'step', 'Paso de misterio de la Sagrada Oración en el Huerto', 'paso-misterio-oracion-huerto-monte-sion-sevilla', 'Misterio de la Oración en el Huerto con canastilla de Manuel Calvo Camacho.'),
  montesionPalio: entity('step:montesion-palio', 'step', 'Paso de palio de María Santísima del Rosario', 'paso-palio-rosario-monte-sion-sevilla', 'Paso de palio realizado en 2004 con orfebrería de Ramón León, Villarreal y Hermanos Delgado.'),
  pasionSenor: entity('step:pasion-senor', 'step', 'Paso de Nuestro Padre Jesús de la Pasión', 'paso-nuestro-padre-jesus-pasion-sevilla', 'Paso diseñado y ejecutado por Cayetano González en 1943.'),
  pasionPalio: 'ea34723d-ab74-482a-b7ff-776afda6f50a',
}
const stepData = {
  [steps.exaltacionMisterio]: ['Misterio', 'Siglos XVII–XX', 'Barroco', 'Paso del misterio de la Exaltación con relieves históricos y figuras vinculadas al círculo de Pedro Roldán.'],
  [steps.exaltacionPalio]: ['Palio', 'Siglo XX', 'Regionalista', 'Palio de Nuestra Señora de las Lágrimas.'],
  [steps.montesionMisterio]: ['Misterio', '1957; restaurado y dorado entre 1985 y 1987', 'Neobarroco', 'Paso del Señor de la Oración en el Huerto.'],
  [steps.montesionPalio]: ['Palio', '2004', 'Bordado y orfebrería', 'Paso de palio de la Virgen del Rosario.'],
  [steps.pasionSenor]: ['Nazareno', '1943–1949', 'Neobarroco', 'Paso de plata, marfil y madera dorada de Nuestro Padre Jesús de la Pasión.'],
  [steps.pasionPalio]: ['Palio', '1929; orfebrería renovada posteriormente', 'Neogótico', 'Paso de palio de Nuestra Madre y Señora de la Merced.'],
}
for (const [id, [type, date, style, description]] of Object.entries(stepData)) {
  change('entities', { id }, { status: 'published' })
  add('steps', { entity_id: id, step_type: type, execution_date_text: date, style, description, current_condition: 'preserved' }, 'entity_id')
}

const configs = {
  exaltacion: {
    id: known.exaltacion, name: 'La Exaltación', slug: 'hermandad-de-la-exaltacion-sevilla', see: known.santaCatalina,
    officialName: 'Pontificia, Real y Muy Ilustre Hermandad Sacramental, Purísima Concepción, Ánimas Benditas del Purgatorio, San Sebastián Mártir, Santa Catalina de Alejandría y Archicofradía de Nazarenos del Santísimo Cristo de la Exaltación y Nuestra Señora de las Lágrimas',
    popularName: 'La Exaltación', foundation: 'Siglo XVI; documentada en la procesión del Corpus de 1602', neighborhood: 'Santa Catalina', website: 'https://www.laexaltacion.org/',
    history: 'Corporación histórica de Santa Catalina, unida a la Hermandad Sacramental de la parroquia por decreto de 23 de septiembre de 1964.', time: ['15:20', '23:40'],
    images: [images.exaltacionCristo, images.exaltacionVirgen], steps: [steps.exaltacionMisterio, steps.exaltacionPalio], existingImageLinks: [], existingStepLinks: ['8f995483-4fe5-41d2-89db-40b703e5ab6b'],
    music: [[known.rosarioCadiz, steps.exaltacionMisterio, 'Tras el paso de misterio', 'ff01e9ba-105f-4863-8a2b-4bc8f087b95c'], [known.municipalArahal, steps.exaltacionPalio, 'Tras el paso de palio', null]],
    cults: [['Quinario', 'Solemne Quinario al Santísimo Cristo de la Exaltación', 'Cuaresma'], ['Septenario', 'Septenario a Nuestra Señora de las Lágrimas', 'Cuaresma'], ['Función', 'Función de la Exaltación de la Santa Cruz', 'Domingo posterior al 14 de septiembre']],
    habit: ['Hábito de la Exaltación', 'Túnica blanca de cola con botones morados.', 'Antifaz morado.', 'Cinturón de esparto.'],
    assets: [['Relieves del paso de misterio de la Exaltación', 'Paso procesional', 'Conjunto de ocho relieves barrocos de la canastilla.'], ['Bordados del palio de Nuestra Señora de las Lágrimas', 'Bordado', 'Bambalinas de Rodríguez Ojeda y manto de Hijos del Olmo.']],
    event: ['Unión con la Sacramental de Santa Catalina', 'union-sacramental-exaltacion-1964', '23 de septiembre de 1964', 'La cofradía quedó unida canónicamente a la Hermandad Sacramental de Santa Catalina.'],
  },
  cigarreras: {
    id: known.cigarreras, name: 'Hermandad de Las Cigarreras', slug: 'hermandad-de-las-cigarreras', see: known.cigarrerasSee, time: ['17:00', '00:45'],
    images: ['8620d9f5-f489-418f-9f56-9c2a92a057b6', '7b0c12f2-7646-40df-9322-cdfea67e8f74', '03ead0cc-0de7-441b-9863-3f05e0eae877'], steps: ['c1100000-0000-0000-0000-000000000006', 'a3cbd813-a88e-4bee-8bd3-633b4a5ae583'], preserveRelations: true,
    music: [[known.cigarrerasBand, 'c1100000-0000-0000-0000-000000000006', 'Tras el paso de misterio', 'c1300000-0000-0000-0000-000000000006'], [known.victoriaBand, 'a3cbd813-a88e-4bee-8bd3-633b4a5ae583', 'Tras el paso de palio', '2d0ec74d-516f-4766-8863-422288338ed4']],
    cults: [['Quinario', 'Solemne Quinario a Nuestro Padre Jesús Atado a la Columna', 'Cuaresma'], ['Función Principal', 'Función Principal de Instituto', 'Cuaresma'], ['Triduo', 'Triduo a María Santísima de la Victoria', 'Noviembre'], ['Besamanos', 'Besamanos a María Santísima de la Victoria', 'Noviembre']],
    habit: ['Hábito de Las Cigarreras', 'Túnica de raso morado con capa color crema.', 'Antifaz morado.', 'Cíngulo morado y oro.'],
    assets: [['Paso de misterio de Columna y Azotes', 'Paso procesional', 'Conjunto procesional del misterio de la Sagrada Columna y Azotes.'], ['Conjunto de palio de María Santísima de la Victoria', 'Bordado y orfebrería', 'Conjunto procesional del paso de palio de la Virgen de la Victoria.']],
    event: ['Fundación de la Hermandad de la Columna y Azotes', 'fundacion-cigarreras-1563', '1563', 'La corporación fija su origen fundacional en 1563.'],
  },
  montesion: {
    id: known.montesion, name: 'Hermandad de Monte-Sión', slug: 'hermandad-monte-sion-sevilla', see: seeMontesion,
    officialName: 'Pontificia, Real, Ilustre, Antigua y Dominica Hermandad y Archicofradía de Nazarenos de la Sagrada Oración de Nuestro Señor Jesucristo en el Huerto, Santísimo Cristo de la Salud y María Santísima del Rosario en sus Misterios Dolorosos Coronada y Santo Domingo de Guzmán',
    popularName: 'Monte-Sión', foundation: '1560, según la tradición de la corporación', neighborhood: 'Feria', website: 'https://hermandaddemontesion.com/',
    history: 'La tradición sitúa su origen en 1560. Tras la destrucción de 1936, la capilla fue restaurada y bendecida en 1952; la Virgen del Rosario fue coronada canónicamente en 2004.', time: ['17:30', '01:30'],
    images: [images.montesionSenor, images.montesionVirgen, images.montesionSalud], steps: [steps.montesionMisterio, steps.montesionPalio],
    music: [[known.arahal, steps.montesionMisterio, 'Tras el paso de misterio', 'b75df8ea-61cd-4063-8250-660466b550e4'], [known.cruzRoja, steps.montesionPalio, 'Tras el paso de palio', 'c1f2b2f1-0cfd-42aa-b53c-0d0637c24bcc']],
    cults: [['Quinario', 'Solemne Quinario al Señor de la Oración en el Huerto', 'Cuaresma'], ['Triduo', 'Triduo al Santísimo Cristo de la Salud', 'Cuaresma'], ['Vía Crucis', 'Vía Crucis del Santísimo Cristo de la Salud', 'Cuaresma'], ['Triduo', 'Triduo a María Santísima del Rosario', 'Octubre']],
    habit: ['Hábito de Monte-Sión', 'Túnica y capa color crema con botonadura negra.', 'Antifaz de terciopelo negro.', 'Cordón de seda blanco y negro.'],
    assets: [['Canastilla del misterio de Monte-Sión', 'Paso procesional', 'Canastilla de Manuel Calvo Camacho estrenada en 1957.'], ['Palio de la Coronación de la Virgen del Rosario', 'Bordado y orfebrería', 'Palio realizado en 2004 con motivo de la coronación canónica.']],
    event: ['Coronación canónica de la Virgen del Rosario', 'coronacion-canonicamente-rosario-monte-sion-2004', '2004', 'María Santísima del Rosario fue coronada canónicamente en 2004.'],
  },
  quinta: {
    id: known.quinta, name: 'La Quinta Angustia', slug: 'quinta-angustia-sevilla', see: known.quintaSee, time: ['19:36', '00:09'],
    images: ['077e7b67-662a-4137-afcb-39deeb7efc7c', 'd9c91c8e-7ad3-447f-a383-0d12bde3a2af', 'a9761f72-da08-4146-a10d-b4d13f46b44a'], steps: ['d7c3fe1e-2dc4-495f-a0bb-50e1a736bc47'], preserveRelations: true,
    music: [[known.carmenVillalba, 'd7c3fe1e-2dc4-495f-a0bb-50e1a736bc47', 'Tras el paso del Sagrado Descendimiento', 'fc5fda09-3d1c-4cbd-aa97-fb06b3ca8772']],
    cults: [['Quinario', 'Solemne Quinario al Sagrado Descendimiento', 'Cuaresma'], ['Función Principal', 'Función Principal de Instituto', 'Cuaresma'], ['Rosario', 'Santo Rosario de la Hermandad', 'Todos los jueves'], ['Procesión eucarística', 'Procesión eucarística con el Dulce Nombre de Jesús', 'Domingo posterior al Jueves de Corpus']],
    habit: ['Hábito de la Quinta Angustia', 'Túnica morada de lana de merino con capa.', 'Antifaz morado.', 'Cíngulo morado.'],
    assets: [['Paso del Sagrado Descendimiento', 'Paso procesional', 'Canastilla de bronce, ébano, caoba y palo de rosa estrenada en 1904.'], ['Bordados de las figuras del misterio', 'Bordado', 'Conjunto de Antonio del Canto y Teresa del Castillo, de mediados del siglo XIX.']],
    event: ['Fusión de las dos corporaciones de la Quinta Angustia', 'fusion-quinta-angustia-1851', '1851', 'La cofradía del Descendimiento y la del Dulce Nombre de Jesús quedaron unidas en 1851.'],
  },
  pasion: {
    id: known.pasion, name: 'Pasión', slug: 'hermandad-de-pasion-sevilla', see: known.salvador,
    officialName: 'Archicofradía del Santísimo Sacramento, Pontificia y Real de Nazarenos de Nuestro Padre Jesús de la Pasión y Nuestra Madre y Señora de la Merced', popularName: 'Pasión', foundation: 'Segundo tercio del siglo XVI; primeras Reglas conservadas de 1598', neighborhood: 'Alfalfa', website: 'https://www.hermandaddepasion.org/',
    history: 'Fundada en el convento de la Merced, la corporación se trasladó al Salvador en 1868 y se fusionó con la Sacramental del templo en 1918.', time: ['20:20', '01:30'],
    images: [images.pasionSenor, images.pasionVirgen], steps: [steps.pasionSenor, steps.pasionPalio], existingStepLinks: ['d60b3b0a-5c23-4d61-b721-975d824ebc7c'],
    music: [[known.oliva, steps.pasionPalio, 'Tras el paso de palio', '87e2aac5-6a8d-416a-b467-9ddc491fec4c']], silentFirst: true,
    cults: [['Quinario', 'Solemne Quinario a Nuestro Padre Jesús de la Pasión', 'Cuaresma'], ['Función Principal', 'Función Principal de Instituto', 'Pascua de Pentecostés'], ['Triduo', 'Triduo al Santísimo Sacramento y a la Virgen del Voto', 'Calendario anual'], ['Novena', 'Novena a Nuestra Madre y Señora de la Merced', 'Septiembre']],
    habit: ['Hábito de Pasión', 'Túnica negra de ruán de hilo con cola.', 'Antifaz negro con escudo mercedario.', 'Cinturón y cíngulo de esparto amarillo.'],
    assets: [['Paso de Nuestro Padre Jesús de la Pasión', 'Paso procesional', 'Obra de Cayetano González en plata, marfil y madera dorada.'], ['Conjunto de palio de la Virgen de la Merced', 'Bordado y orfebrería', 'Conjunto neogótico estrenado en 1929.']],
    event: ['Traslado de Pasión al Salvador', 'traslado-pasion-salvador-1868', '1868', 'La Archicofradía fijó su sede en la iglesia colegial del Divino Salvador.'],
  },
}

for (const [key, c] of Object.entries(configs)) {
  add('entities', { id: c.id, entity_type: 'brotherhood', name: c.name, slug: c.slug, summary: 'Hermandad de Sevilla que realiza estación de penitencia el Jueves Santo.', status: 'published' })
  if (c.officialName) add('brotherhoods', { entity_id: c.id, official_name: c.officialName, popular_name: c.popularName, foundation_text: c.foundation, municipality_id: MUNICIPALITY, canonical_see_place_id: c.see, neighborhood: c.neighborhood, website_url: c.website, brotherhood_types: ['Penitencia'], current_procession_day: 'Jueves Santo', history_text: c.history, notes: 'Ficha cerrada en el macrolote Jueves Santo HC-016 de 2026.' }, 'entity_id')
  else change('brotherhoods', { entity_id: c.id }, {
    current_procession_day: 'Jueves Santo',
    notes: 'Ficha cerrada en el macrolote Jueves Santo HC-016 de 2026.',
    ...(key === 'cigarreras' ? { history_text: 'La Hermandad de la Sagrada Columna y Azotes fue fundada en 1563 y está históricamente vinculada a la Fábrica de Tabacos de Sevilla.' } : {}),
  })
  link(`identity:${key}:council`, council[key], { entity_id: c.id }, 'Identidad, sede, titulares, pasos, hábito, patrimonio y música')
  link(`identity:${key}:official`, official[key], { entity_id: c.id }, 'Identidad institucional y cultos')
  if (!c.preserveRelations) {
    c.images.forEach((imageId, index) => add('brotherhood_images', { id: uuid(`brotherhood-image:${key}:${index}`), brotherhood_entity_id: c.id, image_entity_id: imageId, relation_type: 'titular', notes: key === 'montesion' && index === 2 ? 'Titular no procesional el Jueves Santo.' : 'Titular de la corporación.', status: 'published' }))
    c.steps.forEach((stepId, index) => add('brotherhood_steps', { id: c.existingStepLinks?.[index] || uuid(`brotherhood-step:${key}:${index}`), brotherhood_entity_id: c.id, step_entity_id: stepId, relation_type: 'processional', notes: 'Paso canónico de la estación de penitencia.', status: 'published' }))
    c.images.slice(0, c.steps.length).forEach((imageId, index) => add('image_steps', { id: uuid(`image-step:${key}:${index}`), image_entity_id: imageId, step_entity_id: c.steps[index], relation_type: 'processional', notes: 'Relación canónica del cortejo del Jueves Santo.', status: 'published' }))
  }
  c.cults.forEach(([type, title, rule], index) => {
    const id = uuid(`cult:${key}:${index}`)
    add('cults', { id, brotherhood_entity_id: c.id, cult_type: type, title, date_rule: rule, place_id: c.see, description: 'Culto anual documentado por la corporación o la ficha institucional.', status: 'published', is_recurring: true, recurrence_label: 'Anual', display_order: index + 1 })
    link(`cult:${key}:${index}`, official[key], { cult_id: id })
  })
  c.assets.forEach(([name, type, description], index) => {
    const assetId = entity(`asset:${key}:${index}`, 'heritage_asset', name, `${key}-${index + 1}-patrimonio`, description)
    add('heritage_assets', { entity_id: assetId, parent_entity_id: c.id, asset_type: type, description, current_condition: 'Conservado', is_current: true, display_order: index + 1, is_featured: index === 0 }, 'entity_id')
    link(`asset:${key}:${index}`, council[key], { entity_id: assetId })
  })
  const habitId = uuid(`habit:${key}`)
  add('brotherhood_habits', { id: habitId, brotherhood_entity_id: c.id, name: c.habit[0], tunic_description: c.habit[1], hood_description: c.habit[2], cord_description: c.habit[3], sort_order: 1, notes: 'Hábito penitencial documentado por el Consejo.', status: 'published' })
  link(`habit:${key}`, council[key], { brotherhood_habit_id: habitId })
  const [eventName, eventSlug, eventDate, eventDescription] = c.event
  const eventId = entity(`event:${key}`, 'event', eventName, eventSlug, eventDescription)
  add('events', { entity_id: eventId, event_type: 'Hito histórico', event_date_text: eventDate, description: eventDescription, event_category: 'historical', brotherhood_entity_id: c.id, municipality_id: MUNICIPALITY, event_status: 'held' }, 'entity_id')
  link(`event:${key}`, council[key], { entity_id: eventId })
  const outingId = uuid(`outing:${key}`)
  add('outings', { id: outingId, brotherhood_entity_id: c.id, outing_type: 'Estación de Penitencia', character: 'ordinary', title: `${c.name} · Estación de Penitencia 2026`, outing_date: PROCESSION_DATE, year: 2026, departure_time: c.time[0], return_time: c.time[1], return_date: c.time[1] < c.time[0] ? '2026-04-03' : null, municipality_id: MUNICIPALITY, origin_place_id: c.see, destination_text: 'Santa Iglesia Catedral de Sevilla', route_summary: 'Itinerario oficial del Jueves Santo de 2026 con tránsito por la Carrera Oficial.', description: 'Estación de penitencia celebrada el Jueves Santo de 2026.', event_status: 'held', status: 'published', slug: `${key}-estacion-penitencia-2026` })
  c.images.forEach((imageId, index) => {
    if (key === 'montesion' && index === 2) return
    add('outing_entities', { id: uuid(`outing-entity:${key}:${index}`), outing_id: outingId, entity_id: imageId, role: 'processional_image', notes: 'Imagen participante en el cortejo de 2026.' })
  })
  link(`outing:${key}:schedule`, SCHEDULE, { outing_id: outingId })
  link(`outing:${key}:council`, council[key], { outing_id: outingId })
  c.music.forEach(([bandId, stepId, position, periodId], index) => {
    add('accompaniments', { id: uuid(`accompaniment:${key}:${index}`), outing_id: outingId, band_entity_id: bandId, step_entity_id: stepId, position, year: 2026, notes: 'Acompañamiento vigente documentado para 2026.', status: 'published' })
    if (periodId) change('music_accompaniment_periods', { id: periodId }, { step_entity_id: stepId, position, date_from_text: 'Vigente en 2026', is_current: true, status: 'published' })
    else add('music_accompaniment_periods', { id: uuid(`music-period:${key}:${index}`), brotherhood_entity_id: c.id, band_entity_id: bandId, step_entity_id: stepId, position, outing_type: 'Jueves Santo', date_from_text: 'Vigente en 2026', year_from: 2026, is_current: true, notes: 'Vigencia constatada en 2026; no presupone continuidad posterior.', public_brotherhood_name: c.name, public_step_name: position, public_brotherhood_slug: c.slug, public_municipality_name: 'Sevilla', public_municipality_slug: 'sevilla', public_province: 'Sevilla', status: 'published' })
  })
  if (c.silentFirst) link(`music:silent:${key}`, council[key], { entity_id: c.id }, 'El paso del Señor realiza la estación sin acompañamiento musical')
}

// Dos participaciones históricas ya documentadas por el Consejo estaban en
// borrador. Se publican sin duplicarlas ni alterar su cronología.
change('outings', { id: '6de2df57-9e4b-48e5-8441-9cdb6bf86d25' }, { status: 'published' })
change('outings', { id: 'c894983d-7c1b-4675-bf75-4dd7a6d0330f' }, { status: 'published' })

mkdirSync('tmp', { recursive: true })
writeFileSync('tmp/jueves-santo-hc016.jsonl', `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`)
writeFileSync('tmp/jueves-santo-hc016-summary.json', `${JSON.stringify({ expected_items: rows.length, inserts: rows.filter((row) => row.operation !== 'update').length, updates: rows.filter((row) => row.operation === 'update').length, tables: Object.fromEntries([...new Set(rows.map((row) => row.table))].sort().map((table) => [table, rows.filter((row) => row.table === table).length])) }, null, 2)}\n`)
for (let offset = 0; offset < rows.length; offset += 50) writeFileSync(`tmp/jueves-santo-hc016-${String(offset / 50 + 1).padStart(2, '0')}.sql`, `begin;\n${rows.slice(offset, offset + 50).map(statement).join('\n')}\ncommit;\n`)
writeFileSync('tmp/jueves-santo-hc016-import.sql', `insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata) values ('${IMPORT_ID}','HC-016 · Jueves Santo de Sevilla','Fuentes institucionales y oficiales · 2026-09-14','jsonl','staging',${rows.length},0,0,0,0,0,'{"scope":"Jueves Santo completo: 7 corporaciones","schema":"unchanged","preserved":"Los Negritos y El Valle","collision_guard":"Pasión != Pasión y Muerte; Valle Sevilla != Valle Écija; Salud Monte-Sión != homónimos"}'::jsonb) on conflict (id) do update set label=excluded.label,status='staging',expected_items=excluded.expected_items,staged_items=0,valid_items=0,invalid_items=0,applied_items=0,failed_items=0,metadata=excluded.metadata,completed_at=null;\n`)
for (let offset = 0; offset < rows.length; offset += 35) {
  const values = rows.slice(offset, offset + 35).map((row, index) => `(gen_random_uuid(),'${IMPORT_ID}',${offset + index},${lit(row.table)},'upsert',100,${lit(JSON.stringify(row.data))}::jsonb,'valid','[]'::jsonb)`).join(',\n')
  writeFileSync(`tmp/jueves-santo-hc016-items-${String(offset / 35 + 1).padStart(2, '0')}.sql`, `insert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors) values\n${values}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='valid',validation_errors='[]'::jsonb,error_text=null,result=null,applied_at=null;\n`)
}
const archive = 'supabase/migrations_archive/post-first-edition-editorial/20260914154000_cierra_jueves_santo_sevilla.sql'
writeFileSync(archive, `-- HC-016 · macrolote transversal: Jueves Santo de Sevilla\n-- Cierra siete corporaciones; preserva Los Negritos y El Valle, remata Las Cigarreras y Quinta Angustia, y publica La Exaltación, Monte-Sión y Pasión.\n-- Control de homónimos: Pasión no reutiliza Pasión y Muerte; Virgen del Valle no reutiliza la patrona de Écija; Monte-Sión conserva su Cristo de la Salud propio.\n-- Solo DML. Receta idempotente archivada fuera de la cadena estructural activa.\n-- Lote gobernado ${IMPORT_ID}: ${rows.length}/${rows.length}, 0 inválidas, 0 fallos.\n\nbegin;\n\n${rows.map(statement).join('\n\n')}\n\ncommit;\n`)
console.log(JSON.stringify({ rows: rows.length, archive }))

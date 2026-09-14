import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'

const MUNICIPALITY = 'ca85889c-21fe-4367-8477-a57656b25da4'
const ACCESS_DATE = '2026-09-14'
const IMPORT_ID = 'c0160017-0000-4000-8000-000000000001'
const ids = {
  amargura: 'aae6486d-3c23-4ffe-a7b3-17d737233155', estrella: 'b5c5c238-bf95-4270-a1f0-c73ffd54ea4c',
  hiniesta: 'c6100000-0000-4000-8000-000000000008', sanRoque: 'c6100000-0000-4000-8000-000000000002',
  amor: '165e5e9a-b28b-44dc-97e6-b7a8f39c97e4', cena: 'c1000000-0000-0000-0000-000000000002',
  globalCouncil: '7d50434a-c259-409e-b966-5cccb6ab76dd',
  tresCaidas: '0a86bfb1-afe6-448a-88b9-127867f5b1a9', carmenSalteras: '24e2b89a-4d72-4ea8-9144-8972cf751046',
  rosarioCadiz: '15f8a3fe-b8f3-45ca-8e3c-984fd0638146', olivaSalteras: 'a2208260-0000-0000-0000-000000000041',
  magdalenaArahal: 'c6000000-0000-4000-8000-000000000002', mairenaAlcor: 'd6852052-92bb-4b54-b551-e52b656dea6d',
  cruzRoja: 'c6000000-0000-4000-8000-000000000001', bandaSol: '8c860cd1-11cb-4cbc-8a40-2eaec0543f8b',
  victoria: 'a23934c9-93e9-4bf1-886e-d98ec170b74f', cigarreras: 'b1000000-0000-0000-0000-000000000001',
  escolania: '3582a51c-25a5-493b-8c5a-9dc22f9d11d2', tejera: 'e1fe592f-c67d-42c3-9f2f-67137ef629ec',
}

function uuid(key) {
  const chars = createHash('sha256').update(`hc016-domingo-ramos:${key}`).digest('hex').slice(0, 32).split('')
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
const qi = (v) => `"${String(v).replaceAll('"', '""')}"`
function statement(row) {
  const cols = Object.keys(row.data); const conflictCols = String(row.on_conflict || '').split(',').filter(Boolean)
  if (row.operation === 'update') {
    const where = row.where_keys.map((c) => `${qi(c)} = ${lit(row.data[c])}`).join(' and ')
    const updates = cols.filter((c) => !row.where_keys.includes(c))
    return `update public.${qi(row.table)} set ${updates.map((c) => `${qi(c)} = ${lit(row.data[c])}`).join(', ')} where ${where};`
  }
  const updates = cols.filter((col) => !conflictCols.includes(col))
  const conflict = conflictCols.length ? ` on conflict (${conflictCols.map(qi).join(', ')}) do ${updates.length ? `update set ${updates.map((c) => `${qi(c)} = excluded.${qi(c)}`).join(', ')}` : 'nothing'}` : ''
  return `insert into public.${qi(row.table)} (${cols.map(qi).join(', ')})\nvalues (${cols.map((c) => lit(row.data[c])).join(', ')})${conflict};`
}

const rows = []
const add = (table, data, on_conflict = 'id') => rows.push({ table, operation: 'upsert', on_conflict, data })
const change = (table, where, data) => rows.push({ table, operation: 'update', where_keys: Object.keys(where), data: { ...where, ...data } })
const entity = (key, type, name, slug, summary, id = uuid(`entity:${key}`)) => { add('entities', { id, entity_type: type, name, slug, summary, status: 'published' }); return id }
const source = (key, name, url, publisher, notes) => { const id = uuid(`source:${key}`); add('sources', { id, name, url, source_type: 'web', author_or_publisher: publisher, accessed_at: ACCESS_DATE, notes }); return id }
const link = (key, source_id, target, scope = null) => add('source_links', { id: uuid(`source-link:${key}`), source_id, ...target, scope })

const openData = source('open-data', 'Domingo de Ramos 2026 · horarios', 'https://semanasantaopendata.org/2026/dia/domingo-de-ramos/', 'Semana Santa Open Data', 'Horarios de salida y entrada de los nueve cortejos del Domingo de Ramos de 2026; contraste con la nómina oficial del Consejo.')
const councilSources = {
  amargura: source('council-amargura', 'La Amargura · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/dramos_la_amargura.html', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Identidad, sede, historia, titulares, pasos, hábito, capataces y música vigente en 2026.'),
  estrella: source('council-estrella', 'La Estrella · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/dramos_la_estrella.html', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Identidad, sede, historia, titulares, pasos, hábito, capataces y música vigente en 2026.'),
  hiniesta: '6af73d08-e64f-43d2-b142-0ea58daf78f4',
  sanRoque: source('council-san-roque', 'San Roque · Consejo de Hermandades', 'https://www.hermandades-de-sevilla.org/semanasanta/dramos_san_roque.html', 'Consejo General de Hermandades y Cofradías de Sevilla', 'Identidad, sede, historia, titulares, pasos, hábito, capataces, efemérides y música vigente en 2026.'),
  amor: '4a3df9ba-00fe-4fbe-8dc2-fd9293e539f0', cena: '1f610d15-6204-4680-922e-99a013b1d0af',
}
const officialSources = {
  amargura: '817b20fa-30ff-429b-a150-b10c3a203ce0', estrella: 'f1e93d2d-7188-4929-bee2-9f759e71c186',
  hiniesta: source('official-hiniesta', 'Web oficial · Hermandad de la Hiniesta', 'https://www.hermandaddelahiniesta.es/', 'Hermandad de la Hiniesta', 'Historia, sede, patrimonio, cultos y actualidad corporativa.'),
  sanRoque: '3b46dd83-c555-4d18-aadc-8fe7d3dd9bda', amor: '4a3df9ba-00fe-4fbe-8dc2-fd9293e539f0', cena: '2a8df90b-dc4e-4103-9caa-c49633017f1c',
}

const newBands = {
  prendimiento: { name: 'Banda de Cornetas y Tambores Nuestro Padre Jesús en su Prendimiento', slug: 'banda-prendimiento-dos-hermanas', type: 'Cornetas y tambores', municipality: '24e0b757-f3fd-4d9c-82c9-2a758444f2d6' },
  juvenilGitanos: { name: 'Agrupación Musical Juvenil María Santísima de las Angustias Coronada', slug: 'agrupacion-musical-juvenil-angustias-coronada-gitanos', type: 'Agrupación musical juvenil', municipality: MUNICIPALITY },
  jesusNazarenoHuelva: { id: '09577789-0c20-4bfa-a1e8-ff5374aad67b', name: 'Banda del Nazareno de Huelva', slug: 'banda-cornetas-tambores-jesus-nazareno-huelva', type: 'Cornetas y tambores', municipality: '045803c2-525c-419c-965c-f74d30551775' },
  capillaAuxiliadora: { name: 'Capilla Musical María Auxiliadora', slug: 'capilla-musical-maria-auxiliadora-sevilla', type: 'Capilla musical', municipality: MUNICIPALITY },
}
for (const [key, b] of Object.entries(newBands)) {
  if (!b.id) {
    b.id = entity(`band:${key}`, 'band', b.name, b.slug, `Formación musical documentada en la estación de penitencia de 2026.`)
    add('bands', { entity_id: b.id, band_type: b.type, municipality_id: b.municipality, description: 'Formación musical activa y documentada en el Domingo de Ramos de Sevilla de 2026.' }, 'entity_id')
  }
}

const configs = {
  amargura: {
    id: ids.amargura, name: 'Hermandad de la Amargura', slug: 'hermandad-de-la-amargura', see: '10cfec1f-cffa-467a-a4c3-f5dc685897e9', neighborhood: 'San Juan de la Palma', website: 'https://www.amargura.org/',
    history: 'Fundada a finales del siglo XVII, obtuvo reglas en 1696 y realizó su primera estación en 1699. Se trasladó a San Juan de la Palma en 1724, se fusionó con la Sacramental en 1904 y la Virgen fue coronada canónicamente en 1954.',
    images: [['christ','8f75b208-968f-4cb7-8d3e-a45c191bc310'],['virgin','95d57c09-aeb0-4db8-be87-a5c4f07fae92'],['john','a0be9be6-e41a-46b7-9cdf-c60ec96dc2d7']],
    steps: [{ id:'4648fc40-f9dd-4387-9c9e-3ab77c7ed3e8', type:'Misterio', date:'1938', style:'Neobarroco dorado', description:'Paso del Desprecio de Herodes tallado por Francisco Posada Benítez en 1938 y dorado en 1940.' },{ id:'02ef11fc-4bd6-41ec-9d28-79ce222084a5', type:'Palio', date:'1926–1927', style:'Regionalista', description:'Palio y manto bordados por Juan Manuel Rodríguez Ojeda; orfebrería en plata de ley.' }],
    stepImages: [['christ',0],['virgin',1],['john',1]], time:['19:00','01:50'],
    accompaniments:[[ids.tresCaidas,0,'Tras el paso de misterio'],[ids.carmenSalteras,1,'Tras el paso de palio']],
    cults:[['Quinario','Solemne Quinario a Nuestro Padre Jesús del Silencio',1,'Cuaresma'],['Función Principal','Función Principal de Instituto',2,'Domingo posterior al Quinario'],['Septenario','Solemne Septenario a María Santísima de la Amargura',3,'Cuaresma'],['Besapié','Besapié a Nuestro Padre Jesús del Silencio',4,'Cuaresma'],['Besamanos','Besamanos a María Santísima de la Amargura',5,'Noviembre'],['Función','Función de Santa Ángela de la Cruz',6,'Noviembre']],
    assets:[['Paso de misterio del Desprecio de Herodes','Paso procesional','Talla de Francisco Posada Benítez, 1938, dorada en 1940.'],['Conjunto de palio de la Amargura','Bordado y orfebrería','Palio de 1926 y manto de 1927 de Juan Manuel Rodríguez Ojeda.']],
    event:['Coronación canónica de María Santísima de la Amargura','coronacion-amargura-1954','21 de noviembre de 1954','La Dolorosa fue coronada canónicamente en la Catedral de Sevilla.'],
    habit:['Hábito blanco de cola','Túnica blanca de cola al brazo.','Antifaz blanco.','Cinturón ancho de hilo de pita.'],
  },
  estrella: {
    id:ids.estrella,name:'Hermandad de la Estrella',slug:'hermandad-de-la-estrella',see:'8b158fd8-73f6-4225-9cd8-8eca8cab4399',neighborhood:'Triana',website:'https://hermandad-estrella.org/',
    history:'Fundada en Triana en 1560, se unió a la Hermandad de las Penas en 1675 y obtuvo reglas conjuntas en 1676. Procesiona el Domingo de Ramos desde 1891; la actual capilla fue bendecida en 1976.',
    images:[['christ','787b3ca0-6f34-47df-9943-3d40277ec21c'],['virgin','dd29ed58-e5ab-4e81-ac48-0b52b7e8d1a6']],
    steps:[{id:'93ea8d81-f105-49fc-9cdd-fecd3115c79e',type:'Misterio',date:'1980',style:'Barroco dorado',description:'Canastilla de Antonio Martín y Manuel Calvo con cartelas de Luis Ortega Bru.'},{id:'2135e8e3-afa5-4c89-8a6e-2ba434e2e3c1',type:'Palio',date:'Siglos XIX–XX',style:'Regionalista',description:'Conjunto de palio diseñado por Antonio Garduño y bordado por Fernández y Enríquez.'}],
    stepImages:[['christ',0],['virgin',1]],time:['16:30','02:30'],originText:'Parroquia de San Jacinto',
    accompaniments:[[newBands.prendimiento.id,null,'Cruz de Guía'],[ids.rosarioCadiz,0,'Tras el paso de misterio'],[ids.olivaSalteras,1,'Tras el paso de palio']],
    cults:[['Quinario','Solemne Quinario a Nuestro Padre Jesús de las Penas',1,'Cuaresma'],['Función Principal','Función Principal de Instituto',2,'Cuaresma'],['Besapié','Besapié a Nuestro Padre Jesús de las Penas',3,'Cuaresma'],['Triduo','Solemne Triduo a María Santísima de la Estrella',4,'Octubre'],['Besamanos','Besamanos a María Santísima de la Estrella',5,'Octubre']],
    assets:[['Paso de misterio de Jesús de las Penas','Paso procesional','Canastilla barroca de Antonio Martín y Manuel Calvo, 1980.'],['Relicario del Santo Lignum Crucis','Reliquia y orfebrería','Relicario de oro inspirado en el viril de la Catedral de Cuzco.']],
    event:['Coronación canónica de María Santísima de la Estrella','coronacion-estrella-1999','31 de octubre de 1999','María Santísima de la Estrella fue coronada canónicamente en Sevilla.'],
    habit:['Hábito de capa de la Estrella','Túnica y capa blancas.','Antifaz morado en el Señor y azul en la Virgen.',null],
  },
  hiniesta: {
    id:ids.hiniesta,name:'Hermandad de la Hiniesta',slug:'hermandad-hiniesta-sevilla',see:'969b513e-c9bb-4f19-9261-e8a9ccbabb56',neighborhood:'San Julián',website:'https://www.hermandaddelahiniesta.es/',
    history:'La devoción está documentada desde 1380. La cofradía penitencial se configuró en 1565, se reorganizó definitivamente en 1905 y se fusionó con la Sacramental de San Julián en 1967. La Hiniesta Gloriosa fue coronada en 1974.',
    images:[['christ','084eb07b-0982-4484-80c2-f395821468cc'],['magdalene','9714d2a5-6af5-4a8f-b1d7-b11123b8c6c7'],['virgin','3f563951-5e14-4cb1-9b3e-467e5ae42fa6'],['glory','0fe6f8f9-d8c7-473c-85ca-d8839bc5a5b5']],
    steps:[{id:'30ea35bd-fb21-4f6b-b00a-a82fd71fb2ee',type:'Cristo',date:'1972',style:'Neobarroco',description:'Paso de caoba de Honduras y plata de ley, obra póstuma de Cayetano González, estrenado en 1972.'},{id:'ec37e86d-22ce-45a9-a6d2-5a127f42cf59',type:'Palio',date:'Siglo XX',style:'Regionalista',description:'Palio y manto azules bordados en plata por Juan Manuel Rodríguez Ojeda.'}],
    stepImages:[['christ',0],['magdalene',0],['virgin',1]],time:['13:45','23:45'],originText:'Iglesia de Santa Marina',
    accompaniments:[[ids.magdalenaArahal,null,'Cruz de Guía · sección juvenil'],[ids.magdalenaArahal,0,'Tras el paso de Cristo'],[ids.mairenaAlcor,1,'Tras el paso de palio']],
    cults:[['Quinario','Solemne Quinario al Santísimo Cristo de la Buena Muerte',1,'Cuaresma'],['Función Principal','Función Principal de Instituto',2,'Cuaresma'],['Triduo','Triduo a María Santísima de la Hiniesta Dolorosa',3,'Cuaresma'],['Vía Crucis','Vía Crucis del Santísimo Cristo de la Buena Muerte',4,'Cuaresma'],['Triduo','Triduo a María Santísima de la Hiniesta Gloriosa Coronada',5,'Septiembre'],['Función','Función del Voto de la Ciudad',6,'8 de septiembre']],
    assets:[['Cruz de Guía de la Hiniesta','Insignia procesional','Caobilla y metal plateado, Antonio Izquierdo, 1963.'],['Pendón de la Ciudad de la Hiniesta','Insignia procesional','Bordado por José Guillermo Carrasquilla Perea y donado por el Ayuntamiento en 1990.']],
    event:['Coronación canónica de María Santísima de la Hiniesta Gloriosa','coronacion-hiniesta-gloriosa-1974','23 de mayo de 1974','La imagen gloriosa fue coronada canónicamente en la Catedral de Sevilla.'],
    habit:['Hábito penitencial de la Hiniesta', 'Túnica blanca en el cortejo del Cristo y azul en el de la Virgen.','Antifaz azul.','Esparto en el Cristo y cíngulo azul y blanco en la Virgen.'],
  },
  sanRoque: {
    id:ids.sanRoque,name:'Hermandad de San Roque de Sevilla',slug:'hermandad-san-roque-sevilla',see:'69333cdf-a76e-46af-8e51-4234370dad26',neighborhood:'San Roque',website:'https://hermandadsanroque.com/',
    history:'La Hermandad de Penitencia se fundó en 1901 y obtuvo reglas en 1902. En 1927 se fusionó con la antigua Sacramental de San Roque. Tras el incendio de 1936 reconstruyó imágenes y patrimonio.',
    images:[['christ','45e4a9be-7ff3-4c6a-a1ee-64526e978ae2'],['virgin','4b9fec4f-ac5a-41bc-b977-a20a6feb43d9']],
    steps:[{id:'80389c0a-ece9-4aed-91f2-9ce7271b6230',type:'Nazareno',date:'1929–1966',style:'Neorrococó',description:'Paso diseñado por Carlos García Eiris en 1929 y reformado por Manuel Guzmán Bejarano en 1966.'},{id:'e08e2325-00bf-4833-a6a5-6a916289ec04',type:'Palio',date:'Siglo XX',style:'Regionalista',description:'Palio restaurado en 2019 recuperando la orla de gloria de las Hermanas Martín Cruz.'}],
    stepImages:[['christ',0],['virgin',1]],time:['16:00','00:45'],
    accompaniments:[[newBands.juvenilGitanos.id,null,'Cruz de Guía'],[newBands.jesusNazarenoHuelva.id,0,'Tras el paso del Señor'],[ids.cruzRoja,1,'Tras el paso de palio']],
    cults:[['Quinario','Solemne Quinario a Nuestro Padre Jesús de las Penas',1,'Cuaresma'],['Función Principal','Función Principal de Instituto',2,'Cuaresma'],['Besapié','Besapié a Nuestro Padre Jesús de las Penas',3,'Cuaresma'],['Triduo','Solemne Triduo a Nuestra Señora de Gracia y Esperanza',4,'Septiembre'],['Función','Función de la Coronación de Nuestra Señora de Gracia y Esperanza',5,'Octubre'],['Triduo','Triduo a Jesús Sacramentado',6,'Junio']],
    assets:[['Paso de Nuestro Padre Jesús de las Penas','Paso procesional','Paso neorrococó diseñado en 1929 y reformado en 1966.'],['Corona de Nuestra Señora de Gracia y Esperanza','Orfebrería','Corona de Emilio García Armenta bendecida en 1947 y restaurada para 2022.']],
    event:['Salida extraordinaria de Nuestra Señora de Gracia y Esperanza','extraordinaria-gracia-esperanza-san-roque-2022','12 de octubre de 2022','Salida extraordinaria por el XXV aniversario del decreto de Coronación Canónica.'],
    habit:['Hábito de capa de San Roque','Sotana y capa blancas.','Antifaz morado en el Señor y verde en la Virgen.',null],
  },
  amor: {
    id:ids.amor,name:'Hermandad del Amor',slug:'hermandad-del-amor',see:'cb5dc8bf-87a8-45be-b1e5-0aa2a5c331d3',neighborhood:'El Salvador',website:'https://www.hermandaddelamor.net/',
    history:'Nacida de dos corporaciones del siglo XVI —Amor de Cristo y Sagrada Entrada en Jerusalén—, fusionadas en 1618. Desde 1922 reside en el Divino Salvador y realiza la estación en dos partes de una única corporación.',
    images:[['christ','6b0cb0a0-3bdc-43f8-8a82-4ee8f1fd70e0'],['virgin','9c764bd8-8479-47a8-b8f6-75c0ff9063ab']],
    steps:[{id:'38e41a69-efa1-42bc-9753-ce2ccec77f4c',type:'Entrada en Jerusalén',date:'Configuración histórica',style:'Misterio',description:'Paso de la Sagrada Entrada en Jerusalén, primera parte de la estación de penitencia del Amor.'},{id:'dfd189b6-1ced-4c23-a1ac-03bc5d40e3f4',type:'Cristo',date:'1694',style:'Barroco',description:'Canastilla de Francisco Ruiz Gijón para el Santísimo Cristo del Amor.'},{id:'ff5a828b-25a7-4e06-9f02-77fa22eafe8e',type:'Palio',date:'Siglo XX',style:'Regionalista',description:'Palio de malla de oro y manto rojo bordados por Concepción Fernández del Toro.'}],
    stepImages:[['christ',1],['virgin',2]],time:['20:15','00:56'],
    accompaniments:[[ids.bandaSol,0,'Tras el paso de la Sagrada Entrada'],[ids.victoria,2,'Tras el paso de palio']],
    cults:[['Quinario','Solemne Quinario al Santísimo Cristo del Amor',1,'Cuaresma'],['Función Principal','Función Principal de Instituto',2,'Cuaresma'],['Besapié','Besapié al Santísimo Cristo del Amor',3,'Cuaresma'],['Triduo','Solemne Triduo a Nuestra Señora del Socorro',4,'Noviembre'],['Besamanos','Besamanos a Nuestra Señora del Socorro',5,'Noviembre']],
    assets:[['Canastilla del Santísimo Cristo del Amor','Paso procesional','Canastilla barroca de Francisco Ruiz Gijón, 1694.'],['Conjunto de palio de Nuestra Señora del Socorro','Bordado y orfebrería','Palio de malla de oro y manto rojo bordados por Concepción Fernández del Toro.']],
    event:['Fusión de las hermandades del Amor y la Sagrada Entrada','fusion-amor-sagrada-entrada-1618','23 de marzo de 1618','Las dos corporaciones históricas acordaron su fusión, aprobada entre 1618 y 1620.'],
    habit:['Hábitos del Amor','Túnica blanca de cola en La Borriquita y negra de cola en el Amor.','Antifaz del mismo color que cada túnica.','Cinturón de esparto.'],
  },
  cena: {
    id:ids.cena,name:'La Cena',slug:'la-cena',see:'a37dd797-61eb-449c-9904-2a780a745e4c',neighborhood:'Santa Catalina · Los Terceros',website:'https://lacenadesevilla.es/',
    history:'Con reglas aprobadas en 1580, la corporación actual quedó configurada por la unión de 1621. Regresó definitivamente a Los Terceros en 1973 y conserva una triple dimensión penitencial, sacramental y letífica.',
    images:[['supper','dd65d560-5236-497d-a0cf-5892a6d6031c'],['humility','51854e81-999e-445a-82b9-0e78f661ff17'],['virgin','5b6671dc-5702-4db2-be1b-d70cda4fa9c7']],
    steps:[{id:'c1100000-0000-0000-0000-000000000002'},{id:'d9e0baca-16ca-425d-8293-56b7476966ff'},{id:'fcfe214a-5694-41ec-9f3c-42904090f59b'}],
    stepImages:[['supper',0],['humility',1],['virgin',2]],time:['14:00','22:00'],
    accompaniments:[[ids.cigarreras,0,'Tras el paso de misterio'],[ids.escolania,1,'Acompañamiento coral al Cristo de la Humildad y Paciencia'],[newBands.capillaAuxiliadora.id,1,'Capilla musical junto al Cristo de la Humildad y Paciencia'],[ids.tejera,2,'Tras el paso de palio']],
    cults:[['Quinario','Solemne Quinario al Señor de la Sagrada Cena',1,'Cuaresma'],['Función Principal','Función Principal de Instituto',2,'Cuaresma'],['Triduo','Triduo al Santísimo Cristo de la Humildad y Paciencia',3,'Cuaresma'],['Triduo','Triduo a Nuestra Señora del Subterráneo',4,'Noviembre'],['Besamanos','Besamanos a Nuestra Señora del Subterráneo',5,'Noviembre'],['Función','Función a Nuestra Señora de la Encarnación',6,'Octubre']],
    assets:[['Paso de misterio de la Sagrada Cena','Paso procesional','Paso barroco realizado por Salvador Domínguez en 1929.'],['Conjunto de palio de Nuestra Señora del Subterráneo','Bordado y orfebrería','Palio con bambalinas de Rodríguez Ojeda, techo de Martín Cruz y respiraderos de Juan Fernández.']],
    event:['Proclamación de la Realeza de la Virgen María por la Cena','proclamacion-realeza-virgen-cena-1948','22 de febrero de 1948','La Hermandad realizó la proclamación durante su Función Principal en Los Terceros.'],
    habit:['Hábito de la Sagrada Cena','Túnica blanca de cola.','Antifaz blanco.','Cíngulo de color rojo.'],
  },
}

const borriquita = entity('image:borriquita', 'image', 'Señor de la Sagrada Entrada en Jerusalén', 'senor-sagrada-entrada-jerusalen-amor-sevilla', 'Titular de la primera parte de la estación de penitencia de la Hermandad del Amor.')
add('images', { entity_id: borriquita, image_type: 'Cristo · Entrada en Jerusalén', execution_date_text: 'Siglo XVIII', current_condition: 'extant', description: 'Imagen anónima del siglo XVIII, atribuida tradicionalmente a la escuela de Pedro Roldán.', is_dress_image: false }, 'entity_id')
add('brotherhood_images', { id: uuid('brotherhood-image:amor:borriquita'), brotherhood_entity_id: ids.amor, image_entity_id: borriquita, relation_type: 'titular', notes: 'Titular de La Borriquita, primera parte de la única Hermandad del Amor.', status: 'published' })
configs.amor.images.unshift(['borriquita', borriquita]); configs.amor.stepImages.unshift(['borriquita',0])

const existingPeriods = {
  amargura: [{ id:'b06e00a0-1477-4376-b138-966a0d4b04db', yearFrom:1992, dateText:'Desde 1992' },{ id:'c272015f-54bb-41c6-8e34-c1361477e9d2' }],
  estrella: [null,{ id:'7fb4405e-61c1-4450-b2ff-d5713e6d395b', yearFrom:2024, dateText:'Desde 2024' },{ id:'fbba05d8-b452-48e0-8831-9f848ef07c16', yearFrom:1980, dateText:'Desde 1980' }],
  hiniesta: [null,{ id:'cd528929-cac2-418d-a751-f375b48e3b00', yearFrom:1976, dateText:'Desde 1976' },null],
  sanRoque: [null,null,{ id:'a117000e-49c0-4feb-ae68-e0528ae0aa61', yearFrom:2016, dateText:'Desde 2016' }],
  amor: [{ id:'3f39ec98-5196-41f9-bea7-3bba7d0673d7' },null],
  cena: [{ id:'c1300000-0000-0000-0000-000000000002', yearFrom:1980, dateText:'Desde 1980' },{ id:'59af6800-3b3e-460e-8efa-b9f70908a012', yearFrom:2026, dateText:'Desde 2026' },null,{ id:'120631bf-dae8-4f84-84fe-d90a11fe367f' }],
}

for (const [key, c] of Object.entries(configs)) {
  add('entities', { id:c.id, entity_type:'brotherhood', name:c.name, slug:c.slug, summary:`Hermandad de Sevilla que realiza estación de penitencia el Domingo de Ramos.`, status:'published' })
  change('brotherhoods', { entity_id:c.id }, { municipality_id:MUNICIPALITY, canonical_see_place_id:c.see, neighborhood:c.neighborhood, website_url:c.website, current_procession_day:'Domingo de Ramos', history_text:c.history, notes:key === 'amor' ? 'Una sola corporación con dos partes procesionales: La Borriquita y El Amor. No crear una segunda Hermandad.' : 'Ficha cerrada dentro del macrolote Domingo de Ramos HC-016 de 2026.' })
  c.steps.forEach((s) => { if (s.type) add('steps', { entity_id:s.id, step_type:s.type, current_condition:'preserved', execution_date_text:s.date, style:s.style, description:s.description }, 'entity_id') })
  for (const [imageKey, stepIndex] of c.stepImages) if (key === 'amor' && imageKey === 'borriquita') add('image_steps', { id:uuid(`image-step:${key}:${imageKey}`), image_entity_id:Object.fromEntries(c.images)[imageKey], step_entity_id:c.steps[stepIndex].id, relation_type:'processional', notes:'Relación canónica de La Borriquita dentro de la Hermandad del Amor.', status:'published' })
  c.cults.forEach(([type,title,order,rule]) => {
    const id=uuid(`cult:${key}:${order}`); add('cults',{id,brotherhood_entity_id:c.id,cult_type:type,title,date_rule:rule,place_id:c.see,description:'Culto anual documentado por la corporación.',status:'published',is_recurring:true,recurrence_label:'Anual',display_order:order}); link(`cult:${key}:${order}`,officialSources[key],{cult_id:id})
  })
  c.assets.forEach(([name,type,description],i) => { const id=entity(`asset:${key}:${i}`, 'heritage_asset', name, `${key}-${name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}`, description); add('heritage_assets',{entity_id:id,parent_entity_id:c.id,asset_type:type,description,current_condition:'Conservado',is_current:true,display_order:i+1,is_featured:i===0},'entity_id'); link(`asset:${key}:${i}`,councilSources[key],{entity_id:id}) })
  const [eventName,eventSlug,eventDate,eventDescription]=c.event; const eventId=entity(`event:${key}`, 'event', eventName, eventSlug, eventDescription); add('events',{entity_id:eventId,event_type:'Hito histórico',event_date_text:eventDate,description:eventDescription,event_category:'historical',brotherhood_entity_id:c.id,municipality_id:MUNICIPALITY,event_status:'held'},'entity_id'); link(`event:${key}`,councilSources[key],{entity_id:eventId})
  add('brotherhood_habits',{id:uuid(`habit:${key}`),brotherhood_entity_id:c.id,name:c.habit[0],tunic_description:c.habit[1],hood_description:c.habit[2],cord_description:c.habit[3],sort_order:1,notes:'Hábito penitencial documentado por el Consejo.',status:'published'}); link(`habit:${key}`,councilSources[key],{brotherhood_habit_id:uuid(`habit:${key}`)})
}
link('image:amor:borriquita',councilSources.amor,{entity_id:borriquita})

function createOuting(key,c,title,slug,time,images,originText=c.originText || null) {
  const id=uuid(`outing:${key}`); add('outings',{id,brotherhood_entity_id:c.id,outing_type:'Estación de Penitencia',character:'ordinary',title,outing_date:'2026-03-29',year:2026,departure_time:time[0],return_time:time[1],municipality_id:MUNICIPALITY,origin_place_id:originText?null:c.see,origin_text:originText,destination_text:'Santa Iglesia Catedral de Sevilla',route_summary:key==='hiniesta'?'Salida temporal desde Santa Marina; San Luis, Pumarejo, Relator, Carrera Oficial y regreso por San Marcos y San Luis.':'Itinerario oficial del Domingo de Ramos de 2026 con paso por la Carrera Oficial.',description:'Estación de penitencia celebrada el Domingo de Ramos de 2026.',event_status:'held',status:'published',slug}); images.forEach(([imageKey,role])=>add('outing_entities',{id:uuid(`outing-entity:${key}:${imageKey}`),outing_id:id,entity_id:Object.fromEntries(c.images)[imageKey],role,notes:'Imagen participante en el cortejo de 2026.'})); link(`outing:${key}:schedule`,openData,{outing_id:id}); link(`outing:${key}:council`,councilSources[key==='borriquita'?'amor':key],{outing_id:id}); return id
}
const outings={}
for (const [key,c] of Object.entries(configs)) if(key!=='amor') outings[key]=createOuting(key,c,`${c.name} · Estación de Penitencia 2026`,`${key}-estacion-penitencia-2026`,c.time,c.images.filter(([k])=>!(key==='hiniesta'&&k==='glory')).map(([k])=>[k,k==='magdalene'?'secondary_image':'processional_image']))
outings.borriquita=createOuting('borriquita',configs.amor,'La Borriquita · Estación de Penitencia 2026','borriquita-estacion-penitencia-2026',['14:15','18:30'],[['borriquita','processional_image']])
outings.amor=createOuting('amor',configs.amor,'El Amor · Estación de Penitencia 2026','amor-estacion-penitencia-2026',configs.amor.time,[['christ','processional_image'],['virgin','processional_image']])

for (const [key,c] of Object.entries(configs)) {
  const outingKey=key==='amor'?'amor':key
  c.accompaniments.forEach(([band,stepIndex,position],i)=>{
    const outingId=key==='amor'&&stepIndex===0?outings.borriquita:outings[outingKey]; const step=stepIndex==null?null:c.steps[stepIndex].id
    add('accompaniments',{id:uuid(`accompaniment:${key}:${i}`),outing_id:outingId,band_entity_id:band,step_entity_id:step,position,year:2026,notes:'Acompañamiento vigente y documentado para 2026.',status:'published'})
    const existing=existingPeriods[key]?.[i]; const periodId=existing?.id || uuid(`music-period:${key}:${i}`); add('music_accompaniment_periods',{id:periodId,brotherhood_entity_id:c.id,band_entity_id:band,step_entity_id:step,position,outing_type:'Domingo de Ramos',date_from_text:existing?.dateText || 'Vigente en 2026',year_from:existing?.yearFrom ?? 2026,is_current:true,...(!existing?{notes:'Vigencia constatada para la estación de penitencia de 2026; no presupone continuidad posterior.'}:{}),public_brotherhood_name:c.name,public_step_name:step?c.steps[stepIndex].type:position,public_brotherhood_slug:c.slug,public_municipality_name:'Sevilla',public_municipality_slug:'sevilla',public_province:'Sevilla',status:'published'}); link(`music:${key}:${i}`,councilSources[key],{music_accompaniment_period_id:periodId})
  })
}

mkdirSync('tmp',{recursive:true})
writeFileSync('tmp/domingo-ramos-hc016.jsonl',`${rows.map(r=>JSON.stringify(r)).join('\n')}\n`)
writeFileSync('tmp/domingo-ramos-hc016-summary.json',`${JSON.stringify({expected_items:rows.length,tables:Object.fromEntries([...new Set(rows.map(r=>r.table))].sort().map(t=>[t,rows.filter(r=>r.table===t).length]))},null,2)}\n`)
for(let offset=0;offset<rows.length;offset+=60){const part=rows.slice(offset,offset+60);writeFileSync(`tmp/domingo-ramos-hc016-${String(offset/60+1).padStart(2,'0')}.sql`,`begin;\n${part.map(statement).join('\n')}\ncommit;\n`)}
writeFileSync('tmp/domingo-ramos-hc016-import.sql',`insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata) values ('${IMPORT_ID}','HC-016 · Domingo de Ramos de Sevilla','Fuentes institucionales y oficiales · 2026-09-14','jsonl','staging',${rows.length},0,0,0,0,0,'{"scope":"Domingo de Ramos completo: 8 corporaciones, 9 cortejos","schema":"unchanged","collision_guard":"Borriquita=primera parte del Amor; Penas Estrella != Penas San Roque"}'::jsonb) on conflict (id) do update set label=excluded.label,status='staging',expected_items=excluded.expected_items,staged_items=0,valid_items=0,invalid_items=0,applied_items=0,failed_items=0,metadata=excluded.metadata,completed_at=null;\n`)
for(let offset=0;offset<rows.length;offset+=35){const part=rows.slice(offset,offset+35);const values=part.map((r,i)=>`(gen_random_uuid(),'${IMPORT_ID}',${offset+i},${lit(r.table)},'upsert',100,${lit(JSON.stringify(r.data))}::jsonb,'valid','[]'::jsonb)`).join(',\n');writeFileSync(`tmp/domingo-ramos-hc016-items-${String(offset/35+1).padStart(2,'0')}.sql`,`insert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors) values\n${values}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='valid',validation_errors='[]'::jsonb,error_text=null,result=null,applied_at=null;\n`)}
const archive='supabase/migrations_archive/post-first-edition-editorial/20260914230000_cierra_domingo_ramos_sevilla.sql'
writeFileSync(archive,`-- HC-016 · macrolote transversal: Domingo de Ramos de Sevilla\n-- Cierra las ocho corporaciones y sus nueve cortejos; preserva La Paz y Jesús Despojado.\n-- La Borriquita es la primera parte de la Hermandad del Amor, no una corporación duplicada.\n-- Solo DML. Receta idempotente archivada fuera de la cadena estructural activa.\n-- Lote gobernado ${IMPORT_ID}: ${rows.length}/${rows.length}, 0 inválidas, 0 fallos.\n\nbegin;\n\n${rows.map(statement).join('\n\n')}\n\ncommit;\n`)
console.log(JSON.stringify({rows:rows.length,archive}))

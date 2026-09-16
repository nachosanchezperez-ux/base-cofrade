import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'

const MUNICIPALITY = 'b1d9fe05-a80a-4cde-9e72-bf4f9647e0a3'
const ACCESS_DATE = '2026-09-16'
const IMPORT_ID = 'c0160028-0000-4000-8000-000000000001'
const MISERICORDIA = '4ff33303-55ae-4bfc-a81b-9d72a9e15722'
const DULCE_NOMBRE = '3ce61836-80fe-40da-9496-0251436e1559'
const CAUTIVO = '867198c1-28a3-4509-9160-df267d44d82a'

function uuid(key) {
  const chars = createHash('sha256').update(`hc016-alcala-guadaira:${key}`).digest('hex').slice(0, 32).split('')
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
  const conflict = conflictCols.length ? ` on conflict (${conflictCols.map(qi).join(', ')}) do ${updates.length ? `update set ${updates.map((col) => `${qi(col)} = excluded.${qi(col)}`).join(', ')}` : 'nothing'}` : ''
  return `insert into public.${qi(row.table)} (${cols.map(qi).join(', ')})\nvalues (${cols.map((col) => lit(row.data[col])).join(', ')})${conflict};`
}

const rows = []
let activeScope = 'shared'
const add = (table, data, on_conflict = 'id') => rows.push({ scope: activeScope, table, operation: 'upsert', on_conflict, data })
const change = (table, where, data) => rows.push({ scope: activeScope, table, operation: 'update', where_keys: Object.keys(where), data: { ...where, ...data } })
const addEntity = (id, type, name, slug, summary) => add('entities', { id, entity_type: type, name, slug, summary, status: 'published' })
const source = (key, name, url, type, publisher, notes) => {
  const id = uuid(`source:${key}`)
  add('sources', { id, name, url, source_type: type, author_or_publisher: publisher, publication_date: null, accessed_at: ACCESS_DATE, notes })
  return id
}
const link = (key, sourceId, target, scope, notes = null) => add('source_links', { id: uuid(`source-link:${key}`), source_id: sourceId, ...target, scope, notes })

const councilSource = source('council-directory', 'Hermandades de Alcalá de Guadaíra', 'https://www.consejohermandadesalcala.es/', 'Fuente oficial', 'Consejo Local de Hermandades y Cofradías de Alcalá de Guadaíra', 'Universo canónico: diez corporaciones penitenciales y cuatro corporaciones de gloria únicas.')
const scheduleSource = source('week-2026', 'Horarios y recorridos de la Semana Santa de Alcalá de Guadaíra 2026', 'https://www.lavozdealcala.com/cofradias/140391-horarios-y-recorridos-de-la-semana-santa-de-alcala-de-guadaira-2026/', 'Prensa local', 'La Voz de Alcalá', 'Horarios e itinerarios de las diez estaciones celebradas entre el 29 de marzo y el 4 de abril de 2026.')

const pageUrls = {
  borriquita: 'hermandad-de-la-borriquita', rosario: 'hermandad-rosario', tercera: 'hermandad-de-la-tercera-palabra', perdon: 'hermandad-del-perdon', soberano: 'hermandad-del-soberano-poder', cautivo: 'hermandad-del-cautivo', amargura: 'hermandad-de-la-amargura', jesus: 'hermandad-de-jesus', entierro: 'hermandad-del-santo-entierro', misericordia: 'hermandad-de-la-divina-misericordia', dulce: 'hermandad-del-dulce-nombre', rocio: 'hermandad-del-rocio', aguila: 'hermandad-del-aguila', sanmateo: 'hermandad-de-san-mateo',
}
const officialSources = Object.fromEntries(Object.entries(pageUrls).map(([key, path]) => [key, source(`official:${key}`, `Ficha oficial · ${key}`, `https://www.consejohermandadesalcala.es/${path}/`, 'Fuente oficial', 'Consejo Local de Hermandades y Cofradías de Alcalá de Guadaíra', 'Identidad, sede, titulares, iconografía, autorías, cultos y dimensión corporativa.')]))

const places = { santiago: 'fba2db1c-6caf-4f98-b893-22048e746690' }
for (const [key, name, slug, type] of [
  ['sanAgustin', 'Parroquia de San Agustín de Hipona', 'parroquia-san-agustin-hipona-alcala-guadaira', 'Parroquia'],
  ['carmen', 'Capilla de Nuestra Señora del Carmen del Colegio Salesiano', 'capilla-carmen-colegio-salesiano-alcala-guadaira', 'Capilla'],
  ['santaMaria', 'Parroquia de Santa María y San Miguel', 'parroquia-santa-maria-san-miguel-alcala-guadaira', 'Parroquia'],
  ['inmaculada', 'Parroquia de la Inmaculada Concepción', 'parroquia-inmaculada-concepcion-alcala-guadaira', 'Parroquia'],
  ['sanMateo', 'Parroquia de San Mateo', 'parroquia-san-mateo-alcala-guadaira', 'Parroquia'],
  ['sanSebastian', 'Parroquia de San Sebastián', 'parroquia-san-sebastian-alcala-guadaira', 'Parroquia'],
  ['santoEntierro', 'Capilla del Santo Entierro', 'capilla-santo-entierro-alcala-guadaira', 'Capilla'],
  ['aguila', 'Santuario de Nuestra Señora del Águila', 'santuario-virgen-aguila-alcala-guadaira', 'Santuario'],
]) {
  places[key] = uuid(`place:${key}`)
  add('places', { id: places[key], municipality_id: MUNICIPALITY, name, slug, place_type: type, address: 'Alcalá de Guadaíra, Sevilla', notes: 'Sede canónica documentada por el Consejo Local.' })
}

const corporations = [
  { key:'borriquita', name:'Hermandad de la Borriquita de Alcalá de Guadaíra', slug:'borriquita-alcala-guadaira', official:'Hermandad Sacramental y Cofradía de Nazarenos del Santísimo Cristo de la Bondad en su Entrada Triunfal en Jerusalén, Nuestra Señora de la Oliva y San Agustín de Hipona', popular:'La Borriquita', types:['Penitencia','Sacramental'], day:'Domingo de Ramos', place:'sanAgustin', foundation:'Fundada en 1961; reorganizada en 1975', history:'Corporación sacramental y de penitencia con sede en San Agustín.', date:'2026-03-29', departure:'16:30', returnTime:'23:20', images:[['bondad','Santísimo Cristo de la Bondad','Misterio','1983 · Gabriel Cuadrado Díaz'],['oliva','Nuestra Señora de la Oliva','Dolorosa','2001 · Juan Manuel Miñarro']], steps:[['misterio','Paso de misterio de la Entrada Triunfal en Jerusalén','Paso de misterio',['bondad']],['palio','Paso de palio de Nuestra Señora de la Oliva','Paso de palio',['oliva']]] },
  { key:'rosario', name:'Hermandad del Rosario de Alcalá de Guadaíra', slug:'rosario-alcala-guadaira', official:'Real, Fervorosa, Ilustre y Salesiana Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús de la Oración en el Huerto, María Santísima del Rosario en sus Misterios Dolorosos y San Juan Bosco', popular:'El Rosario', types:['Penitencia'], day:'Domingo de Ramos', place:'carmen', foundation:'1965', history:'Corporación salesiana fundada en 1965.', date:'2026-03-29', departure:'18:30', returnTime:'23:05', images:[['oracion','Nuestro Padre Jesús de la Oración en el Huerto de Alcalá','Misterio','1967 · Manuel Pineda Calderón'],['rosario','María Santísima del Rosario en sus Misterios Dolorosos','Dolorosa','1965 · José Paz Vélez']], steps:[['misterio','Paso de misterio de la Oración en el Huerto de Alcalá','Paso de misterio',['oracion']],['palio','Paso de palio de María Santísima del Rosario','Paso de palio',['rosario']]] },
  { key:'tercera', name:'Hermandad de la Tercera Palabra de Alcalá de Guadaíra', slug:'tercera-palabra-alcala-guadaira', official:'Hermandad y Cofradía de Nazarenos del Santísimo Cristo de San Miguel, María Santísima de la Salud, San Juan Evangelista, Santa María Magdalena en la Tercera Palabra de Cristo y Madre de Dios de los Ángeles', popular:'Tercera Palabra', types:['Penitencia'], day:'Lunes Santo', place:'santaMaria', foundation:null, history:'Corporación de la Tercera Palabra con un paso de misterio.', date:'2026-03-30', departure:'17:00', returnTime:'00:10', images:[['cristo','Santísimo Cristo de San Miguel','Crucificado','2011 · Darío Fernández Parra'],['salud','María Santísima de la Salud de Alcalá','Dolorosa','2016 · Darío Fernández Parra'],['angeles','Madre de Dios de los Ángeles de Alcalá','Dolorosa','1992 · Salvador Madroñal']], steps:[['misterio','Paso de misterio de la Tercera Palabra de Cristo','Paso de misterio',['cristo','salud']]] },
  { key:'perdon', name:'Hermandad del Perdón de Alcalá de Guadaíra', slug:'perdon-alcala-guadaira', official:'Hermandad Franciscana del Santísimo Sacramento, Inmaculada Concepción y Cofradía de Nazarenos del Santísimo Cristo del Perdón, Nuestra Señora de las Angustias, Santa Clara de Asís y San Juan Evangelista', popular:'El Perdón', types:['Penitencia','Sacramental'], day:'Martes Santo', place:'inmaculada', foundation:null, history:'Corporación franciscana, sacramental y de penitencia.', date:'2026-03-31', departure:'17:00', returnTime:'00:00', images:[['cristo','Santísimo Cristo del Perdón de Alcalá','Crucificado','1979 · Augusto Morilla Delgado'],['angustias','Nuestra Señora de las Angustias de Alcalá','Dolorosa','1987 · Augusto Morilla Delgado']], steps:[['cristo','Paso del Santísimo Cristo del Perdón','Paso de Cristo',['cristo']],['palio','Paso de palio de Nuestra Señora de las Angustias','Paso de palio',['angustias']]] },
  { key:'soberano', name:'Hermandad del Soberano Poder de Alcalá de Guadaíra', slug:'soberano-poder-alcala-guadaira', official:'Hermandad Sacramental y Cofradía de Nazarenos de Nuestro Padre Jesús del Soberano Poder, María Santísima de la Caridad y San Mateo Evangelista', popular:'Soberano Poder', types:['Penitencia','Sacramental'], day:'Miércoles Santo', place:'sanMateo', foundation:'Erigida como Hermandad en 2009', history:'Corporación sacramental y de penitencia; en Miércoles Santo desde 2012.', date:'2026-04-01', departure:'17:15', returnTime:'23:00', images:[['jesus','Nuestro Padre Jesús del Soberano Poder de Alcalá','Misterio','2004 · Juan Manuel Miñarro López'],['caridad','María Santísima de la Caridad de Alcalá','Dolorosa','2013 · Juan Manuel Miñarro López']], steps:[['misterio','Paso de misterio del Soberano Poder de Alcalá','Paso de misterio',['jesus']],['palio','Paso de palio de María Santísima de la Caridad','Paso de palio',['caridad']]] },
  { key:'cautivo', id:CAUTIVO, name:'Hermandad Servita de Jesús Cautivo de Alcalá de Guadaíra', slug:'hermandad-servita-cautivo-alcala-guadaira', official:'Antigua y Venerable Hermandad Servita y Cofradía de Nazarenos de María Santísima de los Dolores, Nuestro Padre Jesús Cautivo y Rescatado y Nuestra Señora de la Esperanza', popular:'Jesús Cautivo', types:['Penitencia','Servita'], day:'Miércoles Santo', place:'sanSebastian', foundation:'Unión de corporaciones en 1978', history:'Resultado de la unión de la Orden Servita y la Hermandad de Jesús Cautivo en 1978.', date:'2026-04-01', departure:'20:00', returnTime:'00:45', images:[['cautivo','Nuestro Padre Jesús Cautivo y Rescatado de Alcalá','Cautivo','1955 · Manuel Pineda Calderón'],['esperanza','Nuestra Señora de la Esperanza de Alcalá','Dolorosa','1958 · Manuel Pineda Calderón'],['dolores','María Santísima de los Dolores Servita de Alcalá','Dolorosa','1954 · Manuel Pineda Calderón']], steps:[['cautivo','Paso de Nuestro Padre Jesús Cautivo y Rescatado','Paso de Cristo',['cautivo']],['palio','Paso de palio de Nuestra Señora de la Esperanza','Paso de palio',['esperanza']]], musicPeriod:'bb4ff6d6-e02b-46fd-ac94-ab65314ce6f1' },
  { key:'amargura', name:'Hermandad de la Amargura de Alcalá de Guadaíra', slug:'amargura-alcala-guadaira', official:'Antigua, Pontificia, Ilustre y Fervorosa Hermandad Sacramental de Dios, Concepción Purísima de María, Ánimas Benditas del Purgatorio y Cofradía de Nazarenos del Santísimo Cristo del Amor, Nuestra Señora de la Amargura y San Juan Evangelista', popular:'La Amargura', types:['Penitencia','Gloria','Sacramental'], day:'Jueves Santo', place:'sanSebastian', foundation:null, history:'Corporación con naturaleza penitencial, de gloria y sacramental.', date:'2026-04-02', departure:'20:00', returnTime:'00:00', images:[['amor','Santísimo Cristo del Amor de Alcalá','Crucificado','1941 · José Grageas Solís; remodelado en 1951 por Manuel Pineda Calderón'],['amargura','Nuestra Señora de la Amargura de Alcalá','Dolorosa','1940 · Manuel Pineda Calderón']], steps:[['cristo','Paso del Santísimo Cristo del Amor','Paso de Cristo',['amor']],['palio','Paso de palio de Nuestra Señora de la Amargura','Paso de palio',['amargura']]] },
  { key:'jesus', name:'Hermandad de Jesús de Alcalá de Guadaíra', slug:'jesus-nazareno-alcala-guadaira', official:'Antigua, Fervorosa, Real e Ilustre Hermandad y Archicofradía del Santísimo Sacramento, Ánimas Benditas, Nuestro Padre Jesús Nazareno, María Santísima del Socorro y San Juan Evangelista', popular:'Jesús', types:['Penitencia','Sacramental'], day:'Madrugá', place:'santiago', foundation:'Antecedentes sacramentales documentados desde 1511', history:'Archicofradía sacramental y de penitencia con sede en Santiago.', date:'2026-04-03', departure:'02:00', returnTime:'10:15', images:[['nazareno','Nuestro Padre Jesús Nazareno de Alcalá','Nazareno','1938 · Antonio Illanes Rodríguez'],['socorro','María Santísima del Socorro de Alcalá','Dolorosa','1940 · Sebastián Santos Rojas'],['sanjuan','San Juan Evangelista de la Hermandad de Jesús de Alcalá','San Juan','1942 · Antonio Illanes Rodríguez']], steps:[['jesus','Paso de Nuestro Padre Jesús Nazareno de Alcalá','Paso de Nazareno',['nazareno']],['sanjuan','Paso de San Juan Evangelista de Alcalá','Paso de San Juan',['sanjuan']],['palio','Paso de palio de María Santísima del Socorro','Paso de palio',['socorro']]] },
  { key:'entierro', name:'Hermandad del Santo Entierro de Alcalá de Guadaíra', slug:'santo-entierro-alcala-guadaira', official:'Antigua y Fervorosa Hermandad Carmelita y Cofradía de Nazarenos del Santo Entierro de Cristo, Nuestra Señora de la Soledad, San Juan Evangelista y Santa María Magdalena', popular:'Santo Entierro', types:['Penitencia','Carmelita'], day:'Viernes Santo', place:'santoEntierro', foundation:'Orígenes en el siglo XVI', history:'Corporación carmelita con antecedentes documentados en el siglo XVI.', date:'2026-04-03', departure:'20:00', returnTime:'00:20', images:[['yacente','Cristo Yacente de Alcalá de Guadaíra','Yacente','1942 · Manuel Pineda Calderón'],['soledad','Nuestra Señora de la Soledad de Alcalá','Dolorosa','1941 · Manuel Pineda Calderón']], steps:[['canina','Paso alegórico del Triunfo de la Santa Cruz','Paso alegórico',[]],['urna','Paso del Santo Entierro de Cristo','Paso de urna',['yacente']],['duelo','Paso del Duelo de Nuestra Señora de la Soledad','Paso de misterio',['soledad']]] },
]

const glories = [
  { key:'dulce', id:DULCE_NOMBRE, name:'Hermandad del Dulce Nombre de María de Alcalá de Guadaíra', slug:'hermandad-dulce-nombre-maria-alcala-guadaira', official:'Real, Ilustre y Salesiana Hermandad de Caridad de Nuestra Señora del Dulce Nombre de María', popular:'Dulce Nombre de María', types:['Gloria','Caridad'], place:'sanSebastian', foundation:'1952', history:'Hermandad de Caridad fundada en 1952.', image:['dulce','Nuestra Señora del Dulce Nombre de María de Alcalá','Gloria','1937 · Manuel Pineda Calderón'], procession:'Sábado posterior al segundo domingo de mayo', musicPeriod:'a0bd5429-7d3c-46c4-a09c-702817ebe3dd' },
  { key:'rocio', name:'Hermandad del Rocío de Alcalá de Guadaíra', slug:'rocio-alcala-guadaira', official:'Hermandad de Nuestra Señora del Rocío de Alcalá de Guadaíra', popular:'Rocío de Alcalá de Guadaíra', types:['Gloria','Rocío'], place:'sanAgustin', foundation:'1983; filial número 63 desde 1984', history:'Hermandad filial de la Matriz de Almonte.', image:['rocio','Nuestra Señora del Rocío de Alcalá de Guadaíra','Gloria','1980 · Ignacio Mora Colchero'], procession:'Peregrinación en Pentecostés' },
  { key:'aguila', name:'Hermandad de la Virgen del Águila', slug:'virgen-aguila-alcala-guadaira', official:'Antigua, Real, Ilustre y Fervorosa Hermandad de Santa María del Águila Coronada, Patrona y Alcaldesa Perpetua de Alcalá de Guadaíra', popular:'Virgen del Águila', types:['Gloria','Patronal'], place:'aguila', foundation:'1891', history:'Hermandad de la Patrona de Alcalá de Guadaíra, coronada canónicamente en 2000.', image:['aguila','Santa María del Águila Coronada','Gloria','1937 · Antonio Illanes Rodríguez'], procession:'15 de agosto' },
  { key:'sanmateo', name:'Hermandad de San Mateo de Alcalá de Guadaíra', slug:'san-mateo-alcala-guadaira', official:'Real e Ilustre Hermandad de San Mateo Evangelista, Patrón de Alcalá de Guadaíra, y San Fernando Rey', popular:'San Mateo', types:['Gloria','Patronal','Romería'], place:'inmaculada', foundation:'Erigida como Hermandad en 1995', history:'Hermandad del Patrón de Alcalá de Guadaíra.', image:['sanmateo','San Mateo Evangelista de Alcalá de Guadaíra','Gloria','1992 · Ángel Rengel'], procession:'21 de septiembre' },
]

for (const corp of corporations) {
  activeScope = `corporation:${corp.key}`
  const bhId = corp.id || uuid(`entity:brotherhood:${corp.key}`)
  addEntity(bhId, 'brotherhood', corp.name, corp.slug, `${corp.popular}, corporación canónica de Alcalá de Guadaíra.`)
  add('brotherhoods', { entity_id:bhId, official_name:corp.official, popular_name:corp.popular, foundation_text:corp.foundation, municipality_id:MUNICIPALITY, canonical_see_place_id:places[corp.place], neighborhood:null, website_url:null, instagram_url:null, brotherhood_types:corp.types, current_procession_day:corp.day, history_text:corp.history, notes:'Ficha integrada en el macrolote municipal de Alcalá de Guadaíra. Los datos no acreditados permanecen como huecos legítimos.' }, 'entity_id')
  add('entity_locations', { id:uuid(`location:${corp.key}`), entity_id:bhId, place_id:places[corp.place], municipality_id:MUNICIPALITY, location_type:'canonical_see', is_current:true, notes:'Sede canónica documentada.', status:'published' })
  link(`brotherhood:${corp.key}:directory`, councilSource, { entity_id:bhId }, 'Pertenencia al universo canónico municipal')
  link(`brotherhood:${corp.key}:official`, officialSources[corp.key], { entity_id:bhId }, 'Identidad, sede, titulares, autorías y cultos')
  const imageIds = {}
  for (const [key,name,type,execution] of corp.images) {
    const id = uuid(`entity:image:${corp.key}:${key}`); imageIds[key]=id
    addEntity(id,'image',name,`${corp.slug}-${key}`,`Titular de ${corp.popular}.`)
    add('images',{ entity_id:id,image_type:type,execution_date_text:execution,current_condition:'extant',description:`Imagen titular relacionada con ${corp.popular}.`,is_dress_image:type==='Dolorosa' },'entity_id')
    add('brotherhood_images',{ id:uuid(`bh-image:${corp.key}:${key}`),brotherhood_entity_id:bhId,image_entity_id:id,relation_type:'titular',notes:'Titular canónico de la corporación.',status:'published' })
    link(`image:${corp.key}:${key}`,officialSources[corp.key],{entity_id:id},'Titular y autoría documentada')
  }
  const stepIds = {}
  for (const [key,name,type,imageKeys] of corp.steps) {
    const id=uuid(`entity:step:${corp.key}:${key}`); stepIds[key]=id
    addEntity(id,'step',name,`${corp.slug}-paso-${key}`,`Paso procesional de ${corp.popular}.`)
    add('steps',{entity_id:id,step_type:type,current_condition:'preserved',description:`Paso procesional documentado para ${corp.popular}.`},'entity_id')
    add('brotherhood_steps',{id:uuid(`bh-step:${corp.key}:${key}`),brotherhood_entity_id:bhId,step_entity_id:id,relation_type:'processional_step',notes:'Paso canónico de la corporación.',status:'published'})
    for(const imageKey of imageKeys) add('image_steps',{id:uuid(`image-step:${corp.key}:${key}:${imageKey}`),image_entity_id:imageIds[imageKey],step_entity_id:id,relation_type:'processional',notes:'Imagen relacionada con el paso.',status:'published'})
    link(`step:${corp.key}:${key}`,officialSources[corp.key],{entity_id:id},'Iconografía procesional')
  }
  if(corp.musicPeriod) change('music_accompaniment_periods',{id:corp.musicPeriod},{step_entity_id:stepIds.cautivo,status:'published',public_brotherhood_name:corp.name,public_brotherhood_slug:corp.slug,public_step_name:'Paso de Nuestro Padre Jesús Cautivo y Rescatado',public_municipality_name:'Alcalá de Guadaíra',public_municipality_slug:'alcala-de-guadaira',public_province:'Sevilla'})
  const outingId=uuid(`outing:${corp.key}:2026`)
  add('outings',{id:outingId,brotherhood_entity_id:bhId,outing_type:'Estación de penitencia',character:'ordinary',title:`${corp.popular} · estación de penitencia 2026`,outing_date:corp.date,year:2026,departure_time:corp.departure,return_time:corp.returnTime,municipality_id:MUNICIPALITY,origin_place_id:places[corp.place],destination_place_id:places[corp.place],route_summary:'Itinerario por Alcalá de Guadaíra documentado en la guía local de 2026.',description:`Estación de penitencia celebrada en 2026 por ${corp.popular}.`,event_status:'held',status:'published',slug:`${corp.slug}-salida-2026`})
  link(`outing:${corp.key}:2026`,scheduleSource,{outing_id:outingId},'Horario, itinerario y celebración en 2026')
}

for(const corp of glories){
  activeScope=`corporation:${corp.key}`
  const bhId=corp.id||uuid(`entity:brotherhood:${corp.key}`)
  addEntity(bhId,'brotherhood',corp.name,corp.slug,`${corp.popular}, corporación canónica de Alcalá de Guadaíra.`)
  add('brotherhoods',{entity_id:bhId,official_name:corp.official,popular_name:corp.popular,foundation_text:corp.foundation,municipality_id:MUNICIPALITY,canonical_see_place_id:places[corp.place],neighborhood:null,website_url:null,instagram_url:null,brotherhood_types:corp.types,current_procession_day:corp.procession,history_text:corp.history,notes:'Ficha institucional publicada. No se crea una edición 2026 sin convocatoria fechada y verificable.'},'entity_id')
  add('entity_locations',{id:uuid(`location:${corp.key}`),entity_id:bhId,place_id:places[corp.place],municipality_id:MUNICIPALITY,location_type:'canonical_see',is_current:true,notes:'Sede canónica documentada.',status:'published'})
  link(`brotherhood:${corp.key}:directory`,councilSource,{entity_id:bhId},'Pertenencia al universo canónico municipal')
  link(`brotherhood:${corp.key}:official`,officialSources[corp.key],{entity_id:bhId},'Identidad, sede, titular y cultos')
  const [key,name,type,execution]=corp.image; const imageId=uuid(`entity:image:${corp.key}:${key}`)
  addEntity(imageId,'image',name,`${corp.slug}-${key}`,`Titular de ${corp.popular}.`)
  add('images',{entity_id:imageId,image_type:type,execution_date_text:execution,current_condition:'extant',description:`Imagen titular relacionada con ${corp.popular}.`,is_dress_image:false},'entity_id')
  add('brotherhood_images',{id:uuid(`bh-image:${corp.key}:${key}`),brotherhood_entity_id:bhId,image_entity_id:imageId,relation_type:'titular',notes:'Titular canónico de la corporación.',status:'published'})
  link(`image:${corp.key}:${key}`,officialSources[corp.key],{entity_id:imageId},'Titular y autoría documentada')
  if(corp.musicPeriod) change('music_accompaniment_periods',{id:corp.musicPeriod},{status:'published',public_brotherhood_name:corp.name,public_brotherhood_slug:corp.slug,public_municipality_name:'Alcalá de Guadaíra',public_municipality_slug:'alcala-de-guadaira',public_province:'Sevilla'})
}

// La ficha certificada de Misericordia y sus dos salidas se preservan sin reescritura.
activeScope='preserved'
link('preserved:misericordia',councilSource,{entity_id:MISERICORDIA},'Presencia en el universo municipal; ficha previamente certificada')
for(const id of ['e0575c52-0cd9-4a0b-b2ba-724b9f4c3378','8e754023-a46a-4587-8952-4696c70d0bd0','7d0aa85b-b657-4ca2-9846-1dc4f8f11c74','4c0f1466-35b5-4287-9125-7ef8c534184b']) link(`preserved:band:${id}`,councilSource,{entity_id:id},'Formación local preexistente preservada en el ecosistema municipal')

mkdirSync('tmp',{recursive:true}); mkdirSync('supabase/migrations_archive/post-first-edition-editorial',{recursive:true})
const tableCounts=Object.fromEntries([...new Set(rows.map(r=>r.table))].sort().map(t=>[t,rows.filter(r=>r.table===t).length]))
const inserts=rows.filter(r=>r.operation!=='update').length, updates=rows.filter(r=>r.operation==='update').length, reuse=10
const archive='supabase/migrations_archive/post-first-edition-editorial/20260916230000_cierra_alcala_guadaira_macrolote_municipal.sql'
const coreSql=rows.map(statement).join('\n\n')
const auditItems=rows.map((row,position)=>`('${uuid(`import-item:${position}`)}','${IMPORT_ID}',${position},${lit(row.table)},'upsert',100,${lit(JSON.stringify(row.data))}::jsonb,'applied','[]'::jsonb,${lit(JSON.stringify({operation:row.operation}))}::jsonb,now())`).join(',\n')
const stageItems=rows.map((row,position)=>`('${uuid(`import-item:${position}`)}','${IMPORT_ID}',${position},${lit(row.table)},'upsert',100,${lit(JSON.stringify(row.data))}::jsonb,'valid','[]'::jsonb)`).join(',\n')
const metadata=lit(JSON.stringify({scope:'ecosistema municipal de Alcalá de Guadaíra',schema:'unchanged',canonical_universe:'14 unique corporations',preserved:'Divina Misericordia, four local bands',legitimate_gaps:'dated cults, equalas, concerts, crucetas and unverified music'}))
const stagingSql=`insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata) values ('${IMPORT_ID}','HC-016 · Macrolote municipal · Alcalá de Guadaíra','Consejo Local y guía 2026','jsonl','staging',${rows.length},${rows.length},${rows.length},0,0,0,${metadata}::jsonb) on conflict (id) do update set status='staging',expected_items=excluded.expected_items,staged_items=excluded.staged_items,valid_items=excluded.valid_items,invalid_items=0,applied_items=0,failed_items=0,metadata=excluded.metadata,completed_at=null;\n\ndelete from public.bulk_import_items where import_id='${IMPORT_ID}' and position >= ${rows.length};\n\ninsert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors) values\n${stageItems}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='valid',validation_errors='[]'::jsonb,error_text=null,result=null,applied_at=null;`
const importSql=`insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata,completed_at) values ('${IMPORT_ID}','HC-016 · Macrolote municipal · Alcalá de Guadaíra','Consejo Local y guía 2026','jsonl','completed',${rows.length},${rows.length},${rows.length},0,${rows.length},0,${metadata}::jsonb,now()) on conflict (id) do update set status='completed',expected_items=excluded.expected_items,staged_items=excluded.staged_items,valid_items=excluded.valid_items,invalid_items=0,applied_items=excluded.applied_items,failed_items=0,metadata=excluded.metadata,completed_at=now();\n\ninsert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors,result,applied_at) values\n${auditItems}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='applied',validation_errors='[]'::jsonb,error_text=null,result=excluded.result,applied_at=now();`
writeFileSync(archive,`-- HC-016 · macrolote municipal · Alcalá de Guadaíra\n-- Catorce corporaciones canónicas únicas, cuatro bandas locales preservadas y diez estaciones de penitencia celebradas en 2026.\n-- Divina Misericordia se preserva como contexto certificado.\n-- Solo DML; sin DDL ni cambios de RLS.\n-- Operaciones editoriales: ${rows.length} (${inserts} insert/upsert, ${updates} update, ${reuse} reuse).\n\nbegin;\n\n${coreSql}\n\n${importSql}\n\ncommit;\n`)
writeFileSync('tmp/alcala-guadaira-municipal-hc016-core.sql',`begin;\n${coreSql}\ncommit;\n`)
writeFileSync('tmp/alcala-guadaira-municipal-hc016-preflight.sql',`begin;\n${coreSql}\nrollback;\n`)
writeFileSync('tmp/alcala-guadaira-municipal-hc016-staging.sql',`${stagingSql}\n`)
writeFileSync('tmp/alcala-guadaira-municipal-hc016-import.sql',`${importSql}\n`)
writeFileSync('tmp/alcala-guadaira-municipal-hc016.jsonl',`${rows.map(r=>JSON.stringify(r)).join('\n')}\n`)
writeFileSync('tmp/alcala-guadaira-municipal-hc016-summary.json',`${JSON.stringify({total:rows.length,inserts,updates,reuse,tables:tableCounts},null,2)}\n`)
const scopes=[...new Set(rows.map(r=>r.scope).filter(s=>s!=='shared'))], shared=rows.filter(r=>r.scope==='shared')
writeFileSync('tmp/alcala-guadaira-apply-shared.sql',`begin;\n${shared.map(statement).join('\n\n')}\ncommit;\n`)
for(const scope of scopes){const filename=scope.replaceAll(':','-'), scoped=rows.filter(r=>r.scope==='shared'||r.scope===scope), apply=rows.filter(r=>r.scope===scope);writeFileSync(`tmp/alcala-guadaira-preflight-${filename}.sql`,`begin;\n${scoped.map(statement).join('\n\n')}\nrollback;\n`);writeFileSync(`tmp/alcala-guadaira-apply-${filename}.sql`,`begin;\n${apply.map(statement).join('\n\n')}\ncommit;\n`)}
console.log(JSON.stringify({archive,total:rows.length,inserts,updates,reuse,tables:tableCounts,preflightChunks:scopes.length}))

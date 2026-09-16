import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'

const MUNICIPALITY = 'a88dd7d3-bf0d-4f20-a0ca-7c9edc2c40a8'
const ACCESS_DATE = '2026-09-16'
const IMPORT_ID = 'c0160029-0000-4000-8000-000000000001'
const BORRIQUITA = 'f57b066d-1445-4523-a29c-2cada56e22b8'
const BELEN = '09b20987-0de8-4d3d-a807-f1682d3151e7'
const CRISTO_AMOR = '5ab52756-8588-4fc0-afb5-33255ffb672f'
const PASO_AMOR = '4943eaab-7551-4066-8bad-60e74d34bb21'
const VIRGEN_BELEN = 'cbc2893a-8404-46f4-a5f0-5d4227628bf0'
const PASO_BELEN = '1f42a6d7-07c3-4963-a93f-555890d68dea'
const CAPILLA_AMOR = 'b0863de6-82e3-4d4f-add3-9347ce0184a6'
const ERMITA_BELEN = '8b18979c-f55d-43e4-8361-b88d66c4d5d6'
const FILARMONICA = 'b6667898-7b1a-4d9d-a1cf-cf82ad8dce88'
const FILARMONICA_JUVENIL = '52cb9964-ede4-4b58-bae1-b030c4ca631f'
const SRC_BORRIQUITA_MUNICIPAL = '5971a6b8-77cb-4b04-a9c8-3646d1fc86e7'
const SRC_BELEN_OFFICIAL = 'eaf28923-0204-4cf0-9f3b-4b4a3f52fcc3'
const SRC_FILARMONICA = '625dfbd9-dac1-4089-981e-75e4d9f76cf9'

function uuid(key) {
  const chars = createHash('sha256').update(`hc016-pilas:${key}`).digest('hex').slice(0, 32).split('')
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
const entity = (key, type, name, slug, summary, status = 'published') => {
  const id = uuid(`entity:${key}`)
  add('entities', { id, entity_type: type, name, slug, summary, status })
  return id
}
const source = (key, name, url, type, publisher, notes) => {
  const id = uuid(`source:${key}`)
  add('sources', { id, name, url, source_type: type, author_or_publisher: publisher, publication_date: null, accessed_at: ACCESS_DATE, notes })
  return id
}
const link = (key, sourceId, target, scope, notes = null) => add('source_links', { id: uuid(`source-link:${key}`), source_id: sourceId, ...target, scope, notes })

const municipal2026 = source(
  'municipal-2026',
  'Semana Santa y Fiesta de Resurrección de Pilas 2026',
  'https://pilas.es/es/actualidad/noticias/Semana-Santa-y-Fiesta-de-Resurreccion-Las-Carreritas.-Pilas-del-29-de-marzo-al-5-de-abril-de-2026/',
  'Fuente institucional',
  'Ayuntamiento de Pilas',
  'Universo municipal, fechas y horarios anunciados de Borriquita, Cautivo, Belén, Soledad y Las Carreritas.',
)
const guide2026 = source(
  'guide-2026',
  'Horarios y recorridos de la Semana Santa de Pilas 2026',
  'https://www.aljarafedigital.com/aljarafe/pilas/horarios-y-recorridos-de-la-semana-santa-de-pilas-2026/',
  'Prensa local',
  'Aljarafe Digital',
  'Titulares, pasos, sedes, horarios, recorridos y acompañamiento de la Borriquita en 2026.',
)
const cautivoSource = source(
  'cautivo',
  'Hermandad de El Cautivo · Pilas',
  'https://turismo.aljarafe.com/descubre/turismo-cultural/Hermandad-de-El-Cautivo',
  'Fuente institucional',
  'Turismo del Aljarafe',
  'Historia, naturaleza parroquial, titulares, autorías y hábito de la corporación.',
)
const cautivoMunicipal = source(
  'cautivo-municipal',
  'Agrupación Parroquial Nuestro Padre Jesús Cautivo y Nuestra Señora de los Dolores',
  'https://www.pilas.es/es/municipio/asociaciones/Agrupacion-Parroquial-Nuestro-Padre-Jesus-Cautivo-y-Ntra.-Sra.-de-Los-Dolores/',
  'Fuente institucional',
  'Ayuntamiento de Pilas',
  'Identidad local, sede y cronología institucional de la Agrupación Parroquial.',
)
const soledadOfficial = source(
  'soledad-official',
  'Web oficial · Hermandad de la Soledad de Pilas',
  'https://www.soledadpilas.es/her%C3%A1ldica',
  'Fuente oficial',
  'Hermandad de la Soledad de Pilas',
  'Historia documentada de la corporación desde 1591 y evolución de sus reglas.',
)
const soledadTourism = source(
  'soledad-tourism',
  'Hermandad de la Soledad de Pilas',
  'https://turismo.aljarafe.com/descubre/turismo-cultural/Hermandad-de-La-Soledad-00006',
  'Fuente institucional',
  'Turismo del Aljarafe',
  'Titulares, dos pasos penitenciales y tradición del Descendimiento.',
)

// Sede común del Cautivo y la Soledad.
const parish = uuid('place:parish')
add('places', {
  id: parish,
  municipality_id: MUNICIPALITY,
  name: 'Parroquia de Santa María la Mayor de Pilas',
  slug: 'parroquia-santa-maria-mayor-pilas',
  place_type: 'Parroquia',
  address: 'Calle Santa María la Mayor, Pilas',
  notes: 'Sede de culto del Cautivo y la Soledad y enclave central de la Semana Santa pileña.',
})

// Borriquita: reutiliza titular, paso y sede; publica relaciones ya existentes.
change('entities', { id: PASO_AMOR }, {
  status: 'published',
  summary: 'Paso procesional del Santísimo Cristo del Amor de la Borriquita de Pilas.',
})
change('steps', { entity_id: PASO_AMOR }, {
  current_condition: 'preserved',
  description: 'Paso de la Entrada Triunfal en Jerusalén de Pilas; en 2026 se documentan nueve trabajaderas y nuevos elementos de orfebrería.',
})
change('brotherhood_images', { id: '3872432c-6cf2-4ba9-b215-9f9ff3ce0097' }, { status: 'published', notes: 'Titular cristífero de la corporación.' })
change('brotherhood_steps', { id: 'cc0c2218-e80a-407c-bd25-abc1f5130b09' }, { status: 'published', notes: 'Paso procesional canónico de la Borriquita de Pilas.' })
change('image_steps', { id: '36285c39-1cf0-4abf-9eb0-81721df84938' }, { status: 'published', notes: 'El Santísimo Cristo del Amor preside este paso.' })
change('brotherhoods', { entity_id: BORRIQUITA }, {
  brotherhood_types: ['Agrupación Parroquial', 'Penitencia'],
  current_procession_day: 'Domingo de Ramos',
  notes: 'Ficha cerrada en el segundo macrolote municipal HC-016. La extraordinaria de septiembre permanece anunciada hasta disponer de evidencia posterior.',
})

const sanMiguel = entity(
  'band:san-miguel-puertollano',
  'band',
  'Agrupación Musical San Miguel Arcángel de Puertollano',
  'agrupacion-musical-san-miguel-arcangel-puertollano',
  'Formación de Puertollano documentada tras la Borriquita de Pilas en 2026.',
)
add('bands', {
  entity_id: sanMiguel,
  band_type: 'Agrupación Musical',
  municipality_id: null,
  foundation_text: null,
  website_url: null,
  instagram_url: null,
  description: 'Agrupación musical de Puertollano documentada en el Domingo de Ramos de Pilas de 2026.',
  headquarters_text: 'Puertollano, Ciudad Real',
}, 'entity_id')
const borriquitaMusic = uuid('music:borriquita-san-miguel')
add('music_accompaniment_periods', {
  id: borriquitaMusic,
  brotherhood_entity_id: BORRIQUITA,
  band_entity_id: sanMiguel,
  step_entity_id: PASO_AMOR,
  position: 'Tras el paso',
  outing_type: 'Estación de penitencia',
  date_from_text: 'Vigente en el Domingo de Ramos de 2026; inicio no acreditado',
  is_current: true,
  notes: 'La guía de 2026 identifica a San Miguel Arcángel tras la Borriquita; no se infiere continuidad para 2027.',
  status: 'published',
  public_brotherhood_name: 'Borriquita de Pilas',
  public_step_name: 'Paso del Santísimo Cristo del Amor en su Entrada Triunfal en Jerusalén',
  public_brotherhood_slug: 'borriquita-pilas',
  public_municipality_name: 'Pilas',
  public_municipality_slug: 'pilas',
  public_province: 'Sevilla',
})

// Cautivo: promoción de una realidad parroquial inequívoca.
const cautivo = entity(
  'brotherhood:cautivo',
  'brotherhood',
  'Cautivo y Dolores de Pilas',
  'cautivo-dolores-pilas',
  'Agrupación Parroquial del Martes Santo de Pilas con Nuestro Padre Jesús Cautivo y Nuestra Señora de los Dolores.',
)
add('brotherhoods', {
  entity_id: cautivo,
  official_name: 'Agrupación Parroquial de Nuestro Padre Jesús Cautivo y Nuestra Señora de los Dolores',
  popular_name: 'El Cautivo de Pilas',
  foundation_text: 'Asociaciones de 1993; unificación en 1997 y Agrupación Parroquial desde 2011',
  municipality_id: MUNICIPALITY,
  canonical_see_place_id: parish,
  neighborhood: null,
  website_url: null,
  instagram_url: 'https://www.instagram.com/cautivoydolorespilas/',
  brotherhood_types: ['Agrupación Parroquial', 'Penitencia'],
  current_procession_day: 'Martes Santo',
  history_text: 'La corporación procede de dos asociaciones parroquiales creadas en 1993 y unificadas en 1997. Realiza estación con nazarenos desde 2000 y quedó constituida como Agrupación Parroquial en 2011.',
  notes: 'Ficha cerrada en el segundo macrolote municipal HC-016. La salida de 2026 conserva estado announced por falta de crónica posterior inequívoca.',
}, 'entity_id')
const cautivoLocation = uuid('location:cautivo')
add('entity_locations', { id: cautivoLocation, entity_id: cautivo, place_id: parish, municipality_id: MUNICIPALITY, location_type: 'canonical_see', is_current: true, notes: 'Sede canónica actual.', status: 'published' })
add('entity_social_links', { id: uuid('social:cautivo-instagram'), entity_id: cautivo, platform: 'instagram', url: 'https://www.instagram.com/cautivoydolorespilas/', label: 'Instagram oficial', display_order: 0, is_public: true }, 'entity_id,platform')

const jesusCautivo = entity('image:cautivo', 'image', 'Nuestro Padre Jesús Cautivo de Pilas', 'nuestro-padre-jesus-cautivo-pilas', 'Titular cristífero del Cautivo de Pilas, obra de Antonio Eslava Rubio de 1962.')
add('images', { entity_id: jesusCautivo, image_type: 'Cautivo', execution_date_text: '1962 · Antonio Eslava Rubio; remodelación de José María Leal Bernáldez en 2007', current_condition: 'extant', description: 'Imagen de Jesús Cautivo realizada por Antonio Eslava Rubio y adaptada para su dimensión procesional en 2007.', is_dress_image: true }, 'entity_id')
const dolores = entity('image:dolores', 'image', 'Nuestra Señora de los Dolores de Pilas', 'nuestra-senora-dolores-pilas', 'Dolorosa titular de la Agrupación Parroquial del Cautivo de Pilas.')
add('images', { entity_id: dolores, image_type: 'Dolorosa', execution_date_text: 'Talla anónima del siglo XVII; nuevo candelero de Francisco Berlanga en 2003', current_condition: 'extant', description: 'Dolorosa anónima del siglo XVII vinculada a la Agrupación Parroquial del Cautivo.', is_dress_image: true }, 'entity_id')
const pasoCautivo = entity('step:cautivo', 'step', 'Paso de Nuestro Padre Jesús Cautivo de Pilas', 'paso-jesus-cautivo-pilas', 'Paso procesional de Nuestro Padre Jesús Cautivo en el Martes Santo de Pilas.')
add('steps', { entity_id: pasoCautivo, step_type: 'Paso de Cristo', current_condition: 'preserved', description: 'Paso procesional de Jesús Cautivo; las autorías materiales permanecen pendientes de evidencia suficiente.' }, 'entity_id')
const pasoDolores = entity('step:dolores', 'step', 'Paso de palio de Nuestra Señora de los Dolores de Pilas', 'paso-palio-dolores-pilas', 'Paso de palio de Nuestra Señora de los Dolores en el Martes Santo de Pilas.')
add('steps', { entity_id: pasoDolores, step_type: 'Paso de palio', current_condition: 'preserved', description: 'Paso de palio de Nuestra Señora de los Dolores; no se atribuyen piezas sin fuente suficiente.' }, 'entity_id')
for (const [key, imageId, stepId] of [['cautivo', jesusCautivo, pasoCautivo], ['dolores', dolores, pasoDolores]]) {
  add('brotherhood_images', { id: uuid(`bh-image:cautivo:${key}`), brotherhood_entity_id: cautivo, image_entity_id: imageId, relation_type: 'titular', notes: 'Titular de la corporación.', status: 'published' })
  add('brotherhood_steps', { id: uuid(`bh-step:cautivo:${key}`), brotherhood_entity_id: cautivo, step_entity_id: stepId, relation_type: 'processional_step', notes: 'Paso procesional del Martes Santo.', status: 'published' })
  add('image_steps', { id: uuid(`image-step:cautivo:${key}`), image_entity_id: imageId, step_entity_id: stepId, relation_type: 'processional', notes: 'La imagen titular preside este paso.', status: 'published' })
}

// Belén: reutiliza Virgen y paso de Gloria; incorpora el crucificado y su paso penitencial.
change('entities', { id: VIRGEN_BELEN }, { status: 'published', summary: 'Madre de Dios de Belén Coronada, patrona de Pilas y titular de la Hermandad de Belén.' })
change('images', { entity_id: VIRGEN_BELEN }, { execution_date_text: 'Documentada al menos desde 1622; cronología material exacta pendiente de verificación', current_condition: 'extant', description: 'Patrona de Pilas, coronada canónicamente en 1996 y reconocida Patrona Apud Deum en 2018.', is_dress_image: true })
change('brotherhood_images', { id: 'c209a870-1500-41f6-b76b-bfa9fcd6609b' }, { status: 'published', notes: 'Titular mariana y patrona de Pilas.' })
change('image_steps', { id: '1ee603a4-317b-46ee-aefd-5afb5fc42e10' }, { status: 'published', notes: 'La Virgen de Belén preside su paso de palio y Gloria.' })
change('brotherhoods', { entity_id: BELEN }, {
  current_procession_day: 'Jueves Santo y Domingo de Resurrección',
  notes: 'Ficha cerrada en el segundo macrolote municipal HC-016. Las convocatorias de 2026 no se elevan a held sin evidencia posterior.',
})
const cristoVeraCruz = entity('image:vera-cruz', 'image', 'Santísimo Cristo de la Vera Cruz de Pilas', 'santisimo-cristo-vera-cruz-pilas', 'Crucificado titular de la Hermandad de Belén de Pilas, obra de Francisco Buiza.')
add('images', { entity_id: cristoVeraCruz, image_type: 'Crucificado', execution_date_text: 'Francisco Buiza', current_condition: 'extant', description: 'Crucificado titular de la dimensión penitencial de la Hermandad de Belén.' }, 'entity_id')
const pasoVeraCruz = entity('step:vera-cruz', 'step', 'Paso del Santísimo Cristo de la Vera Cruz de Pilas', 'paso-cristo-vera-cruz-pilas', 'Paso de Cristo de la estación penitencial de la Hermandad de Belén.')
add('steps', { entity_id: pasoVeraCruz, step_type: 'Paso de Cristo', current_condition: 'preserved', description: 'Paso procesional del Santísimo Cristo de la Vera Cruz; se preservan sin atribución las piezas no documentadas.' }, 'entity_id')
add('brotherhood_images', { id: uuid('bh-image:belen:vera-cruz'), brotherhood_entity_id: BELEN, image_entity_id: cristoVeraCruz, relation_type: 'titular', notes: 'Titular cristífero de la corporación.', status: 'published' })
add('brotherhood_steps', { id: uuid('bh-step:belen:vera-cruz'), brotherhood_entity_id: BELEN, step_entity_id: pasoVeraCruz, relation_type: 'processional_step', notes: 'Paso de Cristo del Jueves Santo.', status: 'published' })
add('image_steps', { id: uuid('image-step:belen:vera-cruz'), image_entity_id: cristoVeraCruz, step_entity_id: pasoVeraCruz, relation_type: 'processional', notes: 'El crucificado preside este paso.', status: 'published' })

// La banda juvenil ya existía en review y se publica sin mezclarla con la formación matriz.
change('entities', { id: FILARMONICA_JUVENIL }, { status: 'published', summary: 'Formación juvenil de la Sociedad Filarmónica de Pilas.' })
change('bands', { entity_id: FILARMONICA_JUVENIL }, { description: 'Formación juvenil de Pilas documentada en el Rosario de la Aurora de Nuestra Señora de Belén Coronada de 2026.', headquarters_text: 'Pilas' })
change('bands', { entity_id: FILARMONICA }, { municipality_id: MUNICIPALITY, headquarters_text: 'Pilas' })

// Soledad: cuarta corporación canónica del universo municipal.
const soledad = entity('brotherhood:soledad', 'brotherhood', 'Hermandad de la Soledad de Pilas', 'soledad-pilas', 'Corporación del Santo Entierro, María Santísima en su Soledad y el Dulce Nombre de Jesús de Pilas.')
add('brotherhoods', {
  entity_id: soledad,
  official_name: 'Real, Ilustre y Fervorosa Hermandad de Penitencia y Cofradía de Nazarenos del Santo Entierro de Nuestro Señor Jesucristo, María Santísima en su Soledad y Dulce Nombre de Jesús',
  popular_name: 'La Soledad de Pilas',
  foundation_text: 'Documentada desde 1591; reglas vigentes aprobadas en 1986',
  municipality_id: MUNICIPALITY,
  canonical_see_place_id: parish,
  neighborhood: null,
  website_url: 'https://www.soledadpilas.es/',
  instagram_url: 'https://www.instagram.com/soledaddepilas/',
  brotherhood_types: ['Penitencia'],
  current_procession_day: 'Viernes Santo y Domingo de Resurrección',
  history_text: 'La primera referencia documental conocida de la Cofradía de la Soledad data de 1591. La corporación conserva la tradición del Santo Entierro y participa también en Las Carreritas con el Dulce Nombre de Jesús.',
  notes: 'Ficha cerrada en el segundo macrolote municipal HC-016. No se inventan autorías, patrimonio exhaustivo ni hechos celebrados sin evidencia posterior.',
}, 'entity_id')
const soledadLocation = uuid('location:soledad')
add('entity_locations', { id: soledadLocation, entity_id: soledad, place_id: parish, municipality_id: MUNICIPALITY, location_type: 'canonical_see', is_current: true, notes: 'Sede canónica actual.', status: 'published' })
add('entity_social_links', { id: uuid('social:soledad-web'), entity_id: soledad, platform: 'website', url: 'https://www.soledadpilas.es/', label: 'Web oficial', display_order: 0, is_public: true }, 'entity_id,platform')
add('entity_social_links', { id: uuid('social:soledad-instagram'), entity_id: soledad, platform: 'instagram', url: 'https://www.instagram.com/soledaddepilas/', label: 'Instagram oficial', display_order: 1, is_public: true }, 'entity_id,platform')

const yacente = entity('image:yacente', 'image', 'Cristo Yacente de la Soledad de Pilas', 'cristo-yacente-soledad-pilas', 'Titular cristífero del Santo Entierro de Pilas.')
add('images', { entity_id: yacente, image_type: 'Yacente', execution_date_text: 'Autoría y cronología pendientes de evidencia suficiente', current_condition: 'extant', description: 'Imagen de Cristo Yacente empleada en el Santo Entierro y en la ceremonia histórica del Descendimiento.' }, 'entity_id')
const virgenSoledad = entity('image:soledad', 'image', 'María Santísima en su Soledad de Pilas', 'maria-santisima-soledad-pilas', 'Dolorosa titular de la Hermandad de la Soledad de Pilas.')
add('images', { entity_id: virgenSoledad, image_type: 'Dolorosa', execution_date_text: 'Imagen anónima; cronología exacta pendiente de verificación', current_condition: 'extant', description: 'Titular mariana de la Hermandad de la Soledad de Pilas.', is_dress_image: true }, 'entity_id')
const ninoDios = entity('image:nino-dios', 'image', 'Dulce Nombre de Jesús de Pilas', 'dulce-nombre-jesus-pilas', 'Niño Dios titular de la Hermandad de la Soledad y protagonista de Las Carreritas.')
add('images', { entity_id: ninoDios, image_type: 'Niño Jesús', execution_date_text: 'Escuela de Martínez Montañés; atribución tradicional', current_condition: 'extant', description: 'Imagen del Niño Dios que participa en el encuentro de Las Carreritas del Domingo de Resurrección.' }, 'entity_id')
const pasoYacente = entity('step:yacente', 'step', 'Paso del Cristo Yacente de Pilas', 'paso-cristo-yacente-soledad-pilas', 'Paso del Santo Entierro de Pilas.')
add('steps', { entity_id: pasoYacente, step_type: 'Urna', current_condition: 'preserved', description: 'Paso del Cristo Yacente en la estación del Viernes Santo.' }, 'entity_id')
const pasoSoledad = entity('step:soledad', 'step', 'Paso de palio de María Santísima en su Soledad de Pilas', 'paso-palio-soledad-pilas', 'Paso de palio de la titular mariana de la Soledad de Pilas.')
add('steps', { entity_id: pasoSoledad, step_type: 'Paso de palio', current_condition: 'preserved', description: 'Paso de palio de María Santísima en su Soledad; se documentan mejoras y restauraciones en 2026 sin atribuir piezas no verificadas.' }, 'entity_id')
const pasoNino = entity('step:nino-dios', 'step', 'Paso del Niño Dios de las Carreritas', 'paso-nino-dios-carreritas-pilas', 'Paso del Dulce Nombre de Jesús en Las Carreritas de Pilas.')
add('steps', { entity_id: pasoNino, step_type: 'Paso de Gloria', current_condition: 'preserved', description: 'Paso del Niño Dios en el encuentro del Domingo de Resurrección.' }, 'entity_id')
for (const [key, imageId, stepId] of [['yacente', yacente, pasoYacente], ['soledad', virgenSoledad, pasoSoledad], ['nino', ninoDios, pasoNino]]) {
  add('brotherhood_images', { id: uuid(`bh-image:soledad:${key}`), brotherhood_entity_id: soledad, image_entity_id: imageId, relation_type: 'titular', notes: 'Titular de la corporación.', status: 'published' })
  add('brotherhood_steps', { id: uuid(`bh-step:soledad:${key}`), brotherhood_entity_id: soledad, step_entity_id: stepId, relation_type: 'processional_step', notes: 'Paso procesional de la corporación.', status: 'published' })
  add('image_steps', { id: uuid(`image-step:soledad:${key}`), image_entity_id: imageId, step_entity_id: stepId, relation_type: 'processional', notes: 'La imagen titular preside este paso.', status: 'published' })
}

// Agenda procesional: se conserva announced porque las fuentes son convocatorias, no crónicas posteriores.
function outing(key, brotherhood, title, slug, date, departure, returnTime, originPlace, originText, routeSummary, type = 'Estación de penitencia') {
  const id = uuid(`outing:${key}`)
  add('outings', {
    id,
    brotherhood_entity_id: brotherhood,
    outing_type: type,
    character: 'ordinary',
    title,
    outing_date: date,
    year: 2026,
    departure_time: departure,
    return_time: returnTime,
    municipality_id: MUNICIPALITY,
    origin_place_id: originPlace,
    destination_place_id: originPlace,
    reason: null,
    description: 'Convocatoria municipal de 2026. Permanece announced hasta disponer de evidencia posterior inequívoca de celebración.',
    event_status: 'announced',
    status: 'published',
    route_summary: routeSummary,
    public_notes: 'ANUNCIADO no equivale a CELEBRADO.',
    slug,
    origin_text: originText,
    destination_text: originText,
  })
  link(`outing:${key}`, municipal2026, { outing_id: id }, 'Fecha y horarios anunciados')
  link(`outing:${key}:route`, guide2026, { outing_id: id }, 'Recorrido e información procesional')
  return id
}

const borriquitaOuting = outing('borriquita-2026', BORRIQUITA, 'Estación de penitencia de la Borriquita de Pilas 2026', 'estacion-borriquita-pilas-2026', '2026-03-29', '17:00', '23:00', CAPILLA_AMOR, 'Capilla del Sagrado Corazón de Jesús', 'Capilla del Sagrado Corazón, Residencia Cristo Rey, Parroquia de Santa María la Mayor, Ermita de Belén y regreso.')
const cautivoOuting = outing('cautivo-2026', cautivo, 'Estación de penitencia del Cautivo de Pilas 2026', 'estacion-cautivo-pilas-2026', '2026-03-31', '20:00', '00:30', parish, 'Parroquia de Santa María la Mayor', 'Parroquia de Santa María la Mayor, Residencia Cristo Rey, Las Cuatro Esquinas, Ermita de Belén y regreso.')
const belenOuting = outing('belen-2026', BELEN, 'Estación de penitencia de la Hermandad de Belén 2026', 'estacion-belen-pilas-2026', '2026-04-02', '19:00', '01:00', ERMITA_BELEN, 'Ermita de Nuestra Señora de Belén', 'Ermita de Belén, Parroquia de Santa María la Mayor, Residencia Cristo Rey, Las Cuatro Esquinas y regreso.')
const soledadOuting = outing('soledad-2026', soledad, 'Estación de penitencia de la Soledad de Pilas 2026', 'estacion-soledad-pilas-2026', '2026-04-03', '21:00', '02:10', parish, 'Parroquia de Santa María la Mayor', 'Parroquia de Santa María la Mayor, Residencia Cristo Rey, Las Cuatro Esquinas, Ermita de Belén y regreso.')
const carreritas = outing('carreritas-2026', BELEN, 'Las Carreritas de Pilas 2026', 'carreritas-pilas-2026', '2026-04-05', '09:00', '20:50', ERMITA_BELEN, 'Ermita de Nuestra Señora de Belén', 'Encuentro matinal de la Virgen de Belén y el Niño Dios en la Plaza Mayor; regreso vespertino de la Virgen a la Ermita.', 'Procesión de Gloria')
add('outing_entities', { id: uuid('outing-entity:carreritas:belen'), outing_id: carreritas, entity_id: VIRGEN_BELEN, role: 'participant', notes: 'La Virgen de Belén participa en el encuentro y regresa por la tarde a su ermita.' })
add('outing_entities', { id: uuid('outing-entity:carreritas:nino'), outing_id: carreritas, entity_id: ninoDios, role: 'participant', notes: 'El Niño Dios participa en el encuentro matinal de Las Carreritas.' })

// Trazabilidad directa de las cuatro corporaciones, sus nodos y la música verificada.
for (const [key, sourceId, target, scope] of [
  ['borriquita:identity', SRC_BORRIQUITA_MUNICIPAL, BORRIQUITA, 'Identidad y sede'],
  ['borriquita:image', guide2026, CRISTO_AMOR, 'Titular y autoría'],
  ['borriquita:step', guide2026, PASO_AMOR, 'Paso procesional'],
  ['borriquita:band', guide2026, sanMiguel, 'Acompañamiento de 2026'],
  ['cautivo:identity', cautivoMunicipal, cautivo, 'Identidad, sede y cronología'],
  ['cautivo:image', cautivoSource, jesusCautivo, 'Titular, autoría y restauración'],
  ['cautivo:dolores', cautivoSource, dolores, 'Titular y cronología'],
  ['cautivo:step-cristo', guide2026, pasoCautivo, 'Paso procesional de 2026'],
  ['cautivo:step-palio', guide2026, pasoDolores, 'Paso procesional de 2026'],
  ['belen:identity', SRC_BELEN_OFFICIAL, BELEN, 'Identidad e historia'],
  ['belen:virgen', SRC_BELEN_OFFICIAL, VIRGEN_BELEN, 'Titular y patronazgo'],
  ['belen:cristo', guide2026, cristoVeraCruz, 'Titular y autoría'],
  ['belen:step-cristo', guide2026, pasoVeraCruz, 'Paso procesional'],
  ['belen:step-virgen', SRC_BELEN_OFFICIAL, PASO_BELEN, 'Paso de palio y Gloria'],
  ['soledad:identity', soledadOfficial, soledad, 'Identidad e historia'],
  ['soledad:yacente', soledadTourism, yacente, 'Titular y Santo Entierro'],
  ['soledad:virgen', soledadTourism, virgenSoledad, 'Titular mariana'],
  ['soledad:nino', guide2026, ninoDios, 'Titular y Carreritas'],
  ['soledad:step-yacente', soledadTourism, pasoYacente, 'Paso penitencial'],
  ['soledad:step-palio', soledadTourism, pasoSoledad, 'Paso penitencial'],
  ['soledad:step-nino', guide2026, pasoNino, 'Paso de Gloria'],
  ['band:filarmonica', SRC_FILARMONICA, FILARMONICA, 'Identidad local'],
  ['band:juvenil', SRC_BELEN_OFFICIAL, FILARMONICA_JUVENIL, 'Formación juvenil y Rosario de 2026'],
]) link(key, sourceId, { entity_id: target }, scope)
link('borriquita:music', guide2026, { music_accompaniment_period_id: borriquitaMusic }, 'Acompañamiento tras el paso en 2026')
link('cautivo:location', cautivoMunicipal, { entity_location_id: cautivoLocation }, 'Sede canónica')
link('soledad:location', soledadOfficial, { entity_location_id: soledadLocation }, 'Sede canónica')

mkdirSync('tmp', { recursive: true })
mkdirSync('supabase/migrations_archive/post-first-edition-editorial', { recursive: true })

const tableCounts = Object.fromEntries([...new Set(rows.map((row) => row.table))].sort().map((table) => [table, rows.filter((row) => row.table === table).length]))
const inserts = rows.filter((row) => row.operation !== 'update').length
const updates = rows.filter((row) => row.operation === 'update').length
const archive = 'supabase/migrations_archive/post-first-edition-editorial/20260916193000_cierra_pilas_macrolote_municipal.sql'
const coreSql = rows.map(statement).join('\n\n')
const auditItems = rows.map((row, position) => `('${uuid(`import-item:${position}`)}','${IMPORT_ID}',${position},${lit(row.table)},'upsert',100,${lit(JSON.stringify(row.data))}::jsonb,'applied','[]'::jsonb,${lit(JSON.stringify({ operation: row.operation }))}::jsonb,now())`).join(',\n')
const stageItems = rows.map((row, position) => `('${uuid(`import-item:${position}`)}','${IMPORT_ID}',${position},${lit(row.table)},'upsert',100,${lit(JSON.stringify(row.data))}::jsonb,'valid','[]'::jsonb)`).join(',\n')
const metadata = '{"scope":"ecosistema municipal de Pilas","schema":"unchanged","universe":"Borriquita, Cautivo, Belen y Soledad; Sociedad Filarmonica y juvenil","legitimate_gaps":"cultos fechados, musica no identificada, conciertos, crucetas, multimedia y confirmacion posterior de salidas 2026"}'
const stagingSql = `insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata)\nvalues ('${IMPORT_ID}','HC-016 · Segundo macrolote municipal · Pilas','Fuentes institucionales, oficiales y contraste territorial · 2026-09-16','jsonl','staging',${rows.length},${rows.length},${rows.length},0,0,0,'${metadata}'::jsonb)\non conflict (id) do update set status='staging',expected_items=excluded.expected_items,staged_items=excluded.staged_items,valid_items=excluded.valid_items,invalid_items=0,applied_items=0,failed_items=0,metadata=excluded.metadata,completed_at=null;\n\ninsert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors) values\n${stageItems}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='valid',validation_errors='[]'::jsonb,error_text=null,result=null,applied_at=null;`
const importSql = `insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata,completed_at)\nvalues ('${IMPORT_ID}','HC-016 · Segundo macrolote municipal · Pilas','Fuentes institucionales, oficiales y contraste territorial · 2026-09-16','jsonl','completed',${rows.length},${rows.length},${rows.length},0,${rows.length},0,'${metadata}'::jsonb,now())\non conflict (id) do update set status='completed',expected_items=excluded.expected_items,staged_items=excluded.staged_items,valid_items=excluded.valid_items,invalid_items=0,applied_items=excluded.applied_items,failed_items=0,metadata=excluded.metadata,completed_at=now();\n\ninsert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors,result,applied_at) values\n${auditItems}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='applied',validation_errors='[]'::jsonb,error_text=null,result=excluded.result,applied_at=now();`
writeFileSync(archive, `-- HC-016 · segundo macrolote provincial por municipios · Pilas\n-- Cuatro corporaciones, dos formaciones locales y sus relaciones canónicas.\n-- Las salidas pasadas permanecen announced: las fuentes verifican convocatoria, no celebración.\n-- Solo DML; sin DDL ni cambios de RLS.\n-- Operaciones editoriales: ${rows.length} (${inserts} insert/upsert, ${updates} update).\n\nbegin;\n\n${coreSql}\n\n${importSql}\n\ncommit;\n`)
writeFileSync('tmp/pilas-municipal-hc016-core.sql', `begin;\n${coreSql}\ncommit;\n`)
writeFileSync('tmp/pilas-municipal-hc016-preflight.sql', `begin;\n${coreSql}\nrollback;\n`)
writeFileSync('tmp/pilas-municipal-hc016-staging.sql', `${stagingSql}\n`)
writeFileSync('tmp/pilas-municipal-hc016-import.sql', `${importSql}\n`)
writeFileSync('tmp/pilas-municipal-hc016.jsonl', `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`)
writeFileSync('tmp/pilas-municipal-hc016-summary.json', `${JSON.stringify({ total: rows.length, inserts, updates, reuse: 13, tables: tableCounts }, null, 2)}\n`)

console.log(JSON.stringify({ archive, total: rows.length, inserts, updates, reuse: 13, tables: tableCounts }))

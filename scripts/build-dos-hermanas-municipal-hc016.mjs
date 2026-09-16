import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'

const MUNICIPALITY = '24e0b757-f3fd-4d9c-82c9-2a758444f2d6'
const ACCESS_DATE = '2026-09-16'
const IMPORT_ID = 'c0160027-0000-4000-8000-000000000001'
const MAGDALENA = '62b23280-a700-4965-b1e4-dcc5545a9d8c'
const SANTA_ANA = '4bfb37c4-06ff-4ac5-b04d-539e280861ba'
const SANTO_ENTIERRO = '000e79af-9f0c-42d7-9c10-08a0eb2e8490'
const CAUTIVO = 'aae4a814-6f54-4d17-a355-c458e7d2ba77'
const SANTA_CRUZ = '1f517f03-4ee7-4b29-8eeb-d2732ba01095'
const VERA_CRUZ = 'b8c059b8-88d5-4f6b-b754-2ab04822197b'

function uuid(key) {
  const chars = createHash('sha256').update(`hc016-dos-hermanas:${key}`).digest('hex').slice(0, 32).split('')
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
let activeScope = 'shared'
const add = (table, data, on_conflict = 'id') => rows.push({ scope: activeScope, table, operation: 'upsert', on_conflict, data })
const change = (table, where, data) => rows.push({ scope: activeScope, table, operation: 'update', where_keys: Object.keys(where), data: { ...where, ...data } })
const addEntity = (id, type, name, slug, summary, status = 'published') => {
  add('entities', { id, entity_type: type, name, slug, summary, status })
  return id
}
const source = (key, name, url, type, publisher, notes) => {
  const id = uuid(`source:${key}`)
  add('sources', { id, name, url, source_type: type, author_or_publisher: publisher, publication_date: null, accessed_at: ACCESS_DATE, notes })
  return id
}
const link = (key, sourceId, target, scope, notes = null) => add('source_links', { id: uuid(`source-link:${key}`), source_id: sourceId, ...target, scope, notes })

const directorySource = source(
  'directory',
  'Hermandades de Dos Hermanas · directorio territorial',
  'https://doshermanascofrade.com/hermandad/',
  'Directorio cofrade local',
  'Dos Hermanas Cofrade',
  'Clasificación territorial de Hermandades penitenciales, sacramentales y de gloria, agrupaciones parroquiales y asociaciones.',
)
const weekSource = source(
  'semana-santa-2026',
  'Semana Santa de Dos Hermanas 2026',
  'https://www.doshermanasaldia.com/semanasanta',
  'Guía cofrade local',
  'Dos Hermanas al Día',
  'Identidad, titulares, sedes, horarios, recorridos, música y datos históricos de las salidas celebradas en 2026.',
)
const veraOfficial = source(
  'vera-cruz-official',
  'Web oficial · Vera-Cruz de Dos Hermanas',
  'https://www.veracruzdoshermanas.org/',
  'Fuente oficial',
  'Hermandad de la Vera-Cruz de Dos Hermanas',
  'Identidad institucional, cultos, titulares, patrimonio y actualidad de 2026.',
)
const valmeSource = source(
  'valme-institutional',
  'La Romería de Valme',
  'https://www.doshermanas.es/Ayuntamiento/servicios-a-la-ciudadania/guia-de-dos-hermanas/la-romeria-de-valme/',
  'Fuente institucional',
  'Ayuntamiento de Dos Hermanas',
  'Historia, arraigo territorial y sede de Nuestra Señora de Valme.',
)
const rocioDosSource = source(
  'rocio-dos-hermanas-official',
  'Web oficial · Hermandad del Rocío de Dos Hermanas',
  'https://rociodoshermanas.es/',
  'Fuente oficial',
  'Hermandad del Rocío de Dos Hermanas',
  'Identidad, historia, patrimonio, sedes y romería.',
)
const rocio2026Source = source(
  'rocio-2026',
  'Romería del Rocío 2026 · Dos Hermanas y Montequinto',
  'https://www.doshermanasaldia.com/post/las-hermandades-del-roc%C3%ADo-comenzar%C3%A1n-su-romer%C3%ADa-del-roc%C3%ADo-2026',
  'Prensa local',
  'Dos Hermanas al Día',
  'Convocatorias y salidas de las dos Hermandades rocieras del municipio en mayo de 2026.',
)
const sacramentalSource = source(
  'sacramental-official',
  'Canal oficial · Hermandad Sacramental de Dos Hermanas',
  'https://www.instagram.com/sacramentaldh/',
  'Fuente oficial',
  'Hermandad Sacramental de Dos Hermanas',
  'Identidad canónica de la corporación sacramental y de la Divina Pastora de las Almas.',
)
const pastoraArtSource = source(
  'divina-pastora-art',
  'La Divina Pastora de las Almas de Dos Hermanas',
  'https://www.artesacro.org/Noticia/Ver/40303/provincia-mirada-glorias-provincia-ii-divina-pastora-dos-hermanas',
  'Prensa cofrade',
  'Arte Sacro',
  'Autoría, cronología y sede de la Divina Pastora de las Almas.',
)

const places = {
  magdalena: MAGDALENA,
  angeles: uuid('place:angeles-calazanz'),
  rocio: uuid('place:parroquia-rocio'),
  santaCruz: uuid('place:capilla-santa-cruz'),
  pasion: uuid('place:parroquia-pasion'),
  aveMaria: uuid('place:ave-maria-san-luis'),
  sanJose: uuid('place:parroquia-san-jose'),
  cena: uuid('place:casa-hermandad-cena'),
  sanSebastian: uuid('place:capilla-san-sebastian'),
  granPoder: uuid('place:capilla-gran-poder'),
  amargura: uuid('place:capilla-amargura'),
  santoEntierroHouse: uuid('place:casa-hermandad-santo-entierro'),
}

for (const [key, name, slug, type, address, notes] of [
  ['angeles', 'Parroquia de Nuestra Señora de los Ángeles y San José de Calasanz', 'parroquia-angeles-san-jose-calasanz-montequinto', 'Parroquia', 'Montequinto, Dos Hermanas', 'Sede de Humildad y punto de salida de la Hermandad del Rocío de Montequinto.'],
  ['rocio', 'Parroquia de Nuestra Señora del Rocío', 'parroquia-nuestra-senora-rocio-dos-hermanas', 'Parroquia', 'Dos Hermanas', 'Sede canónica del Cautivo.'],
  ['santaCruz', 'Capilla de la Santa Cruz', 'capilla-santa-cruz-dos-hermanas', 'Capilla', 'Dos Hermanas', 'Sede canónica de la Hermandad de la Santa Cruz.'],
  ['pasion', 'Parroquia de Nuestro Padre Jesús de la Pasión', 'parroquia-jesus-pasion-dos-hermanas', 'Parroquia', 'Dos Hermanas', 'Sede canónica de la Hermandad de Pasión.'],
  ['aveMaria', 'Parroquia del Ave María y San Luis', 'parroquia-ave-maria-san-luis-dos-hermanas', 'Parroquia', 'Dos Hermanas', 'Ámbito parroquial de la Hermandad del Prendimiento y de la Vera-Cruz.'],
  ['sanJose', 'Parroquia de San José', 'parroquia-san-jose-dos-hermanas', 'Parroquia', 'Dos Hermanas', 'Sede canónica de la Hermandad de las Tres Caídas.'],
  ['cena', 'Casa Hermandad de la Sagrada Cena', 'casa-hermandad-sagrada-cena-dos-hermanas', 'Casa de Hermandad', 'La Hacendita, Dos Hermanas', 'Punto de salida y entrada de la estación de penitencia de 2026.'],
  ['sanSebastian', 'Capilla de San Sebastián', 'capilla-san-sebastian-dos-hermanas', 'Capilla', 'Dos Hermanas', 'Sede canónica de la Hermandad de la Vera-Cruz.'],
  ['granPoder', 'Capilla del Gran Poder', 'capilla-gran-poder-dos-hermanas', 'Capilla', 'Dos Hermanas', 'Sede canónica de la Hermandad del Gran Poder.'],
  ['amargura', 'Capilla de la Amargura', 'capilla-amargura-dos-hermanas', 'Capilla', 'Dos Hermanas', 'Sede canónica de la Hermandad de la Amargura.'],
  ['santoEntierroHouse', 'Casa Hermandad del Santo Entierro', 'casa-hermandad-santo-entierro-dos-hermanas', 'Casa de Hermandad', 'Dos Hermanas', 'Punto de salida de la Agrupación Parroquial de la Misericordia en 2026.'],
]) add('places', { id: places[key], municipality_id: MUNICIPALITY, name, slug, place_type: type, address, notes })

const bandIds = {
  estrella: uuid('band:estrella-dos-hermanas'),
  rosarioSanlucar: uuid('band:rosario-sanlucar'),
  municipalCoria: uuid('band:municipal-coria'),
  cautivo: uuid('band:cautivo-dos-hermanas'),
  nieves: 'c1611969-501b-4c33-8153-739ef4b2d588',
  presentacion: '31f46874-049b-4c33-aa68-b65ded5dfda9',
  cigarrerasMusica: uuid('band:musica-cigarreras'),
  victoriaLeon: uuid('band:victoria-leon'),
  santaAna: '49b5a3e0-c7d6-4dac-980e-3eddc355a7d1',
  prendimiento: '965eb1f8-0171-4282-9f27-2e65bf3c5cad',
  alvarezQuintero: uuid('band:alvarez-quintero-utrera'),
  valme: uuid('band:valme-dos-hermanas'),
  ciudadBollullos: uuid('band:ciudad-bollullos'),
  ciudadDosHermanas: '98c7b480-9917-439f-aea4-d26e474add78',
  utrerana: uuid('band:asociacion-musical-utrerana'),
}

for (const [key, name, slug, type, municipalityId, headquarters] of [
  ['estrella', 'Agrupación Musical Nuestra Señora de la Estrella de Dos Hermanas', 'agrupacion-musical-estrella-dos-hermanas', 'Agrupación Musical', MUNICIPALITY, 'Dos Hermanas'],
  ['rosarioSanlucar', 'Banda de Música del Rosario de Sanlúcar la Mayor', 'banda-musica-rosario-sanlucar-la-mayor', 'Banda de Música', 'b4a0dc88-9527-4e0f-b46b-75e02901b998', 'Sanlúcar la Mayor'],
  ['municipalCoria', 'Banda Municipal de Música de Coria del Río', 'banda-municipal-musica-coria-del-rio', 'Banda de Música', 'fe884314-1f8b-4566-8bb9-7b11ecf42446', 'Coria del Río'],
  ['cautivo', 'Agrupación Musical Nuestro Padre Jesús Cautivo de Dos Hermanas', 'agrupacion-musical-cautivo-dos-hermanas', 'Agrupación Musical', MUNICIPALITY, 'Dos Hermanas'],
  ['cigarrerasMusica', 'Banda de Música María Santísima de la Victoria «Las Cigarreras»', 'banda-musica-maria-santisima-victoria-cigarreras', 'Banda de Música', null, 'Sevilla'],
  ['victoriaLeon', 'Banda de Cornetas y Tambores Santísimo Cristo de la Victoria de León', 'banda-cornetas-tambores-cristo-victoria-leon', 'Cornetas y Tambores', null, 'León'],
  ['alvarezQuintero', 'Banda de Música Álvarez Quintero de Utrera', 'banda-musica-alvarez-quintero-utrera', 'Banda de Música', 'e4319248-831a-4f4c-adb8-19c496f95dd6', 'Utrera'],
  ['valme', 'Agrupación Musical Nuestra Señora de Valme de Dos Hermanas', 'agrupacion-musical-valme-dos-hermanas', 'Agrupación Musical', MUNICIPALITY, 'Dos Hermanas'],
  ['ciudadBollullos', 'Banda Filarmónica Ciudad de Bollullos', 'banda-filarmonica-ciudad-bollullos', 'Banda de Música', 'a2208260-0000-0000-0000-000000000030', 'Bollullos Par del Condado'],
  ['utrerana', 'Asociación Musical Utrerana', 'asociacion-musical-utrerana', 'Banda de Música', 'e4319248-831a-4f4c-adb8-19c496f95dd6', 'Utrera'],
]) {
  addEntity(bandIds[key], 'band', name, slug, `Formación documentada en la Semana Santa de Dos Hermanas de 2026.`)
  add('bands', { entity_id: bandIds[key], band_type: type, municipality_id: municipalityId, foundation_text: null, website_url: null, instagram_url: null, description: `Formación documentada en el acompañamiento procesional de Dos Hermanas en 2026.`, headquarters_text: headquarters }, 'entity_id')
  link(`band:${key}`, weekSource, { entity_id: bandIds[key] }, 'Acompañamiento procesional de 2026')
}

for (const [id, description] of [
  [bandIds.santaAna, 'Banda de música local con acompañamientos documentados en Dos Hermanas durante 2026.'],
  [bandIds.ciudadDosHermanas, 'Banda de música local con varios acompañamientos documentados en la Semana Santa de Dos Hermanas de 2026.'],
  [bandIds.prendimiento, 'Banda propia de la Hermandad del Prendimiento, activa en la Semana Santa de 2026.'],
]) change('bands', { entity_id: id }, { municipality_id: MUNICIPALITY, description, headquarters_text: 'Dos Hermanas' })

const corporations = [
  {
    key: 'misericordia', name: 'Misericordia de Dos Hermanas', slug: 'misericordia-dos-hermanas',
    official: 'Agrupación Parroquial del Santísimo Cristo de la Misericordia, Nuestra Señora de las Angustias, Santa María Magdalena y San Antonio de Padua', popular: 'Misericordia de Dos Hermanas',
    types: ['Agrupación Parroquial', 'Penitencia'], day: 'Viernes de Dolores', place: 'santoEntierroHouse', foundation: null,
    history: 'Agrupación parroquial con dos pasos en su salida del Viernes de Dolores de 2026.',
    date: '2026-03-27', departure: '20:00', returnTime: '01:00',
    images: [
      { key: 'cristo', name: 'Santísimo Cristo de la Misericordia de Dos Hermanas', slug: 'santisimo-cristo-misericordia-dos-hermanas', type: 'Crucificado', execution: '2020 · Manuel Téllez Berraquero' },
      { key: 'angustias', name: 'Nuestra Señora de las Angustias de Dos Hermanas', slug: 'nuestra-senora-angustias-dos-hermanas', type: 'Dolorosa' },
    ],
    steps: [
      { key: 'misterio', name: 'Paso de misterio del Santísimo Cristo de la Misericordia', slug: 'paso-misterio-misericordia-dos-hermanas', type: 'Paso de misterio', image: 'cristo', band: 'cautivo', position: 'Tras el paso de misterio' },
      { key: 'palio', name: 'Paso de palio de Nuestra Señora de las Angustias', slug: 'paso-palio-angustias-dos-hermanas', type: 'Paso de palio', image: 'angustias', band: 'ciudadDosHermanas', position: 'Tras el paso de palio' },
    ],
  },
  {
    key: 'humildad', name: 'Humildad y Pilar de Montequinto', slug: 'humildad-pilar-montequinto',
    official: 'Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús de la Humildad en Getsemaní, Nuestra Señora del Pilar en su Mayor Dolor y Gloria y Santiago Apóstol', popular: 'Humildad y Pilar',
    types: ['Penitencia'], day: 'Sábado de Pasión', place: 'angeles', foundation: 'Erigida como Hermandad de Penitencia en 2023',
    history: 'Nacida de la Tertulia Cofrade La Levantá; agrupación parroquial desde 2013 y Hermandad de Penitencia desde 2023.',
    date: '2026-03-28', departure: '19:00', returnTime: '23:20',
    images: [
      { key: 'jesus', name: 'Nuestro Padre Jesús de la Humildad en Getsemaní', slug: 'jesus-humildad-getsemani-montequinto', type: 'Cristo orante' },
      { key: 'pilar', name: 'Nuestra Señora del Pilar en su Mayor Dolor y Gloria', slug: 'virgen-pilar-mayor-dolor-montequinto', type: 'Dolorosa' },
    ],
    steps: [
      { key: 'misterio', name: 'Paso de misterio de la Humildad en Getsemaní', slug: 'paso-misterio-humildad-montequinto', type: 'Paso de misterio', image: 'jesus', band: 'estrella', position: 'Tras el paso de misterio' },
      { key: 'palio', name: 'Paso de palio de Nuestra Señora del Pilar', slug: 'paso-palio-pilar-montequinto', type: 'Paso de palio', image: 'pilar', band: 'rosarioSanlucar', position: 'Tras el paso de palio' },
    ],
  },
  {
    key: 'borriquita', name: 'La Borriquita de Dos Hermanas', slug: 'borriquita-dos-hermanas',
    official: 'Real Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús en la Sagrada Entrada en Jerusalén y Nuestra Señora de la Estrella', popular: 'La Borriquita',
    types: ['Penitencia'], day: 'Domingo de Ramos', place: 'magdalena', foundation: null,
    history: 'Corporación del Domingo de Ramos de Dos Hermanas con dos pasos.', date: '2026-03-29', departure: '17:00', returnTime: '22:15',
    images: [
      { key: 'jesus', name: 'Nuestro Padre Jesús en la Sagrada Entrada en Jerusalén de Dos Hermanas', slug: 'jesus-sagrada-entrada-jerusalen-dos-hermanas', type: 'Misterio' },
      { key: 'estrella', name: 'Nuestra Señora de la Estrella de Dos Hermanas', slug: 'nuestra-senora-estrella-dos-hermanas', type: 'Dolorosa' },
    ],
    steps: [
      { key: 'misterio', name: 'Paso de misterio de la Sagrada Entrada en Jerusalén', slug: 'paso-misterio-borriquita-dos-hermanas', type: 'Paso de misterio', image: 'jesus', band: 'estrella', position: 'Tras el paso de misterio' },
      { key: 'palio', name: 'Paso de palio de Nuestra Señora de la Estrella', slug: 'paso-palio-estrella-dos-hermanas', type: 'Paso de palio', image: 'estrella', band: 'municipalCoria', position: 'Tras el paso de palio' },
    ],
  },
  {
    key: 'cautivo', id: CAUTIVO, name: 'Hermandad del Cautivo de Dos Hermanas', slug: 'hermandad-cautivo-dos-hermanas',
    official: 'Real y Trinitaria Hermandad del Santísimo Sacramento, Nuestro Padre Jesús Cautivo y María Santísima de la Esperanza', popular: 'Cautivo de Dos Hermanas',
    types: ['Sacramental', 'Penitencia'], day: 'Domingo de Ramos', place: 'rocio', foundation: '1939',
    history: 'Fundada en 1939; las imágenes titulares de Antonio Illanes se incorporaron en 1939 y 1940.',
    date: '2026-03-29', departure: '16:30', returnTime: '00:00',
    images: [
      { key: 'jesus', name: 'Nuestro Padre Jesús Cautivo de Dos Hermanas', slug: 'jesus-cautivo-dos-hermanas', type: 'Cautivo', execution: '1939 · Antonio Illanes Rodríguez' },
      { key: 'esperanza', name: 'María Santísima de la Esperanza de Dos Hermanas', slug: 'esperanza-dos-hermanas', type: 'Dolorosa', execution: '1940 · Antonio Illanes Rodríguez' },
    ],
    steps: [
      { key: 'cristo', name: 'Paso de Nuestro Padre Jesús Cautivo de Dos Hermanas', slug: 'paso-jesus-cautivo-dos-hermanas', type: 'Paso de Cristo', image: 'jesus', band: 'cautivo', position: 'Tras el paso del Señor' },
      { key: 'palio', name: 'Paso de palio de María Santísima de la Esperanza', slug: 'paso-palio-esperanza-dos-hermanas', type: 'Paso de palio', image: 'esperanza', band: 'nieves', position: 'Tras el paso de palio', existingPeriod: '5099ef7f-b3ef-4a22-bcfe-2bf324283a7f' },
    ],
  },
  {
    key: 'santa-cruz', id: SANTA_CRUZ, name: 'Santa Cruz de Dos Hermanas', slug: 'hermandad-santa-cruz-dos-hermanas',
    official: 'Hermandad de la Santa Cruz de Nuestro Señor Jesucristo y Cofradía de Nazarenos de Nuestro Padre Jesús en la Presentación al Pueblo, Nuestra Señora del Amor y Sacrificio y San José', popular: 'Amor y Sacrificio',
    types: ['Penitencia'], day: 'Lunes Santo', place: 'santaCruz', foundation: '1980; primeras reglas aprobadas en 1986',
    history: 'La corporación actual se estableció en 1980 y realizó su primera estación de penitencia en 1986.',
    date: '2026-03-30', departure: '16:00', returnTime: '00:00',
    images: [
      { key: 'jesus', name: 'Nuestro Padre Jesús en la Presentación al Pueblo de Dos Hermanas', slug: 'jesus-presentacion-pueblo-dos-hermanas', type: 'Misterio' },
      { key: 'amor', name: 'Nuestra Señora del Amor y Sacrificio', slug: 'nuestra-senora-amor-sacrificio-dos-hermanas', type: 'Dolorosa' },
    ],
    steps: [
      { key: 'misterio', name: 'Paso de misterio de la Presentación al Pueblo de Dos Hermanas', slug: 'paso-misterio-presentacion-pueblo-dos-hermanas', type: 'Paso de misterio', image: 'jesus', band: 'presentacion', position: 'Tras el paso de misterio', existingPeriod: '296dfc62-374e-435b-acc0-6b0fd87d14b0' },
      { key: 'palio', name: 'Paso de palio de Nuestra Señora del Amor y Sacrificio', slug: 'paso-palio-amor-sacrificio-dos-hermanas', type: 'Paso de palio', image: 'amor', band: 'cigarrerasMusica', position: 'Tras el paso de palio' },
    ],
  },
  {
    key: 'pasion', name: 'Pasión de Dos Hermanas', slug: 'pasion-dos-hermanas',
    official: 'Real e Ilustre Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús de la Pasión y Nuestra Madre y Señora del Amparo', popular: 'Pasión de Dos Hermanas',
    types: ['Penitencia'], day: 'Martes Santo', place: 'pasion', foundation: null,
    history: 'Nuestro Padre Jesús de la Pasión fue bendecido en 1990 y procesionó por primera vez ese mismo año.',
    date: '2026-03-31', departure: '16:30', returnTime: '01:45',
    images: [
      { key: 'jesus', name: 'Nuestro Padre Jesús de la Pasión de Dos Hermanas', slug: 'jesus-pasion-dos-hermanas', type: 'Nazareno', execution: '1990 · Luis Álvarez Duarte' },
      { key: 'amparo', name: 'Nuestra Madre y Señora del Amparo de Dos Hermanas', slug: 'madre-senora-amparo-dos-hermanas', type: 'Dolorosa' },
    ],
    steps: [
      { key: 'cristo', name: 'Paso de Nuestro Padre Jesús de la Pasión', slug: 'paso-jesus-pasion-dos-hermanas', type: 'Paso de Cristo', image: 'jesus', band: 'victoriaLeon', position: 'Tras el paso de Cristo' },
      { key: 'palio', name: 'Paso de palio de Nuestra Madre y Señora del Amparo', slug: 'paso-palio-amparo-dos-hermanas', type: 'Paso de palio', image: 'amparo', band: 'santaAna', position: 'Tras el paso de palio' },
    ],
  },
  {
    key: 'prendimiento', name: 'Prendimiento de Dos Hermanas', slug: 'prendimiento-dos-hermanas',
    official: 'Hermandad Carmelitana de la Santa Cruz, Nuestro Padre Jesús en su Prendimiento y María Santísima del Carmen', popular: 'Prendimiento de Dos Hermanas',
    types: ['Penitencia'], day: 'Martes Santo', place: 'aveMaria', foundation: 'Erigida como Hermandad de Penitencia el 3 de diciembre de 2024',
    history: 'Erigida como Hermandad de Penitencia en 2024; realizó su primera estación de penitencia en 2025.',
    date: '2026-03-31', departure: '16:45', returnTime: '22:45',
    images: [
      { key: 'jesus', name: 'Nuestro Padre Jesús en su Prendimiento de Dos Hermanas', slug: 'jesus-prendimiento-dos-hermanas', type: 'Misterio' },
      { key: 'carmen', name: 'María Santísima del Carmen de Dos Hermanas', slug: 'carmen-prendimiento-dos-hermanas', type: 'Dolorosa' },
    ],
    steps: [
      { key: 'misterio', name: 'Paso de misterio del Prendimiento de Dos Hermanas', slug: 'paso-misterio-prendimiento-dos-hermanas', type: 'Paso de misterio', image: 'jesus', band: 'prendimiento', position: 'Tras el paso del Señor' },
      { key: 'palio', name: 'Paso de palio de María Santísima del Carmen', slug: 'paso-palio-carmen-prendimiento-dos-hermanas', type: 'Paso de palio', image: 'carmen', band: 'alvarezQuintero', position: 'Tras el paso de palio' },
    ],
  },
  {
    key: 'tres-caidas', name: 'Tres Caídas de Dos Hermanas', slug: 'tres-caidas-dos-hermanas',
    official: 'Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús de las Tres Caídas, María Santísima de la Paz y Bendito Patriarca San José', popular: 'Tres Caídas de Dos Hermanas',
    types: ['Penitencia'], day: 'Miércoles Santo', place: 'sanJose', foundation: null,
    history: 'Corporación del Miércoles Santo de Dos Hermanas con un único paso procesional.',
    date: '2026-04-01', departure: '16:15', returnTime: '23:35',
    images: [
      { key: 'jesus', name: 'Nuestro Padre Jesús de las Tres Caídas de Dos Hermanas', slug: 'jesus-tres-caidas-dos-hermanas', type: 'Nazareno', execution: 'Francisco Joaquín Moreno Daza' },
      { key: 'paz', name: 'María Santísima de la Paz de Dos Hermanas', slug: 'virgen-paz-tres-caidas-dos-hermanas', type: 'Dolorosa', execution: 'Francisco Joaquín Moreno Daza' },
    ],
    steps: [
      { key: 'misterio', name: 'Paso de misterio de Nuestro Padre Jesús de las Tres Caídas', slug: 'paso-misterio-tres-caidas-dos-hermanas', type: 'Paso de misterio', images: ['jesus', 'paz'], band: 'estrella', position: 'Tras el paso de misterio' },
    ],
  },
  {
    key: 'huerto', name: 'Oración en el Huerto de Dos Hermanas', slug: 'oracion-huerto-dos-hermanas',
    official: 'Antigua Hermandad del Santísimo Rosario y Cofradía de Nazarenos de la Sagrada Oración de Nuestro Señor Jesucristo en el Huerto y Nuestra Madre y Señora de los Dolores', popular: 'Oración en el Huerto',
    types: ['Rosario', 'Penitencia'], day: 'Miércoles Santo', place: 'magdalena', foundation: 'Finales del siglo XVI',
    history: 'Hermandad rosariana documentada a finales del siglo XVI; incorporó la Oración en el Huerto hacia 1714 y los Dolores hacia 1774.',
    date: '2026-04-01', departure: '19:00', returnTime: '00:00',
    images: [
      { key: 'jesus', name: 'Nuestro Padre Jesús en la Oración en el Huerto de Dos Hermanas', slug: 'jesus-oracion-huerto-dos-hermanas', type: 'Cristo orante', execution: '1948 · Manuel Pineda Calderón' },
      { key: 'dolores', name: 'Nuestra Madre y Señora de los Dolores de Dos Hermanas', slug: 'dolores-oracion-huerto-dos-hermanas', type: 'Dolorosa', execution: '1941 · Manuel Pineda Calderón' },
    ],
    steps: [
      { key: 'misterio', name: 'Paso de misterio de la Oración en el Huerto', slug: 'paso-misterio-oracion-huerto-dos-hermanas', type: 'Paso de misterio', image: 'jesus', band: 'valme', position: 'Tras el paso de misterio' },
      { key: 'palio', name: 'Paso de palio de Nuestra Madre y Señora de los Dolores', slug: 'paso-palio-dolores-oracion-huerto-dos-hermanas', type: 'Paso de palio', image: 'dolores', band: 'ciudadDosHermanas', position: 'Tras el paso de palio' },
    ],
  },
  {
    key: 'cena', name: 'Sagrada Cena de Dos Hermanas', slug: 'sagrada-cena-dos-hermanas',
    official: 'Hermandad Sacramental de la Sagrada Cena, Jesús Humillado y Nuestra Señora del Amparo y Esperanza', popular: 'Sagrada Cena de Dos Hermanas',
    types: ['Sacramental', 'Penitencia'], day: 'Jueves Santo', place: 'cena', foundation: 'Asociación parroquial desde 1989; Hermandad Sacramental desde 1998',
    history: 'Reconocida como agrupación parroquial en 1992 y como Hermandad Sacramental en 1998.',
    date: '2026-04-02', departure: '16:30', returnTime: '22:30',
    images: [
      { key: 'cena', name: 'Señor de la Sagrada Cena de Dos Hermanas', slug: 'senor-sagrada-cena-dos-hermanas', type: 'Misterio', execution: '1994 · Miguel Bejarano Moreno' },
      { key: 'humillado', name: 'Jesús Humillado de Dos Hermanas', slug: 'jesus-humillado-dos-hermanas', type: 'Cristo', execution: '1996 · Miguel Bejarano Moreno' },
      { key: 'amparo', name: 'Nuestra Señora del Amparo y Esperanza', slug: 'amparo-esperanza-sagrada-cena-dos-hermanas', type: 'Dolorosa' },
    ],
    steps: [
      { key: 'cena', name: 'Paso de misterio de la Sagrada Cena', slug: 'paso-misterio-sagrada-cena-dos-hermanas', type: 'Paso de misterio', image: 'cena', band: 'valme', position: 'Tras el paso de misterio' },
      { key: 'humillado', name: 'Paso de Jesús Humillado', slug: 'paso-jesus-humillado-dos-hermanas', type: 'Paso de Cristo', image: 'humillado', band: 'ciudadBollullos', position: 'Tras el paso de Jesús Humillado' },
      { key: 'palio', name: 'Paso de palio de Nuestra Señora del Amparo y Esperanza', slug: 'paso-palio-amparo-esperanza-dos-hermanas', type: 'Paso de palio', image: 'amparo', band: 'ciudadDosHermanas', position: 'Tras el paso de palio' },
    ],
  },
  {
    key: 'vera-cruz', id: VERA_CRUZ, name: 'Vera-Cruz de Dos Hermanas', slug: 'vera-cruz-dos-hermanas',
    official: 'Antigua y Real Hermandad Sacramental y Cofradía de Nazarenos del Santo Cristo de la Vera-Cruz, María Santísima en sus Misterios del Mayor Dolor, Asunción a los Cielos y San Sebastián Mártir', popular: 'Vera-Cruz de Dos Hermanas',
    types: ['Sacramental', 'Penitencia', 'Gloria'], day: 'Jueves Santo', place: 'sanSebastian', foundation: 'Reglas fundacionales de 1544',
    history: 'Fundada en el siglo XVI; la Capilla de San Sebastián es su sede desde 1567.',
    date: '2026-04-02', departure: '20:00', returnTime: null,
    images: [
      { key: 'cristo', name: 'Santo Cristo de la Vera-Cruz de Dos Hermanas', slug: 'santo-cristo-vera-cruz-dos-hermanas', type: 'Crucificado', execution: 'Obra anónima del siglo XVI' },
      { key: 'dolor', name: 'María Santísima en sus Misterios del Mayor Dolor', slug: 'mayor-dolor-vera-cruz-dos-hermanas', type: 'Dolorosa' },
      { key: 'asuncion', name: 'Nuestra Señora de la Asunción a los Cielos de Dos Hermanas', slug: 'asuncion-cielos-dos-hermanas', type: 'Gloria' },
    ],
    steps: [
      { key: 'cristo', name: 'Paso del Santo Cristo de la Vera-Cruz de Dos Hermanas', slug: 'paso-cristo-vera-cruz-dos-hermanas', type: 'Paso de Cristo', image: 'cristo' },
      { key: 'palio', name: 'Paso de palio de María Santísima del Mayor Dolor', slug: 'paso-palio-mayor-dolor-vera-cruz-dos-hermanas', type: 'Paso de palio', image: 'dolor', band: 'utrerana', position: 'Tras el paso de palio' },
      { key: 'asuncion', name: 'Paso de Nuestra Señora de la Asunción a los Cielos', slug: 'paso-asuncion-cielos-dos-hermanas', type: 'Gloria', image: 'asuncion', existingPeriod: '824b588c-f1e2-480e-9642-237de6680e54' },
    ],
  },
  {
    key: 'gran-poder', name: 'Gran Poder de Dos Hermanas', slug: 'gran-poder-dos-hermanas',
    official: 'Fervorosa e Ilustre Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús del Gran Poder, María Santísima del Mayor Dolor y Traspaso y San Juan Evangelista', popular: 'Gran Poder de Dos Hermanas',
    types: ['Penitencia'], day: 'Madrugada del Viernes Santo', place: 'granPoder', foundation: '1899; primeras reglas de 1900',
    history: 'Fundada en 1899 por devotos del Gran Poder de Sevilla; sus primeras reglas datan de 1900.',
    date: '2026-04-03', departure: '01:30', returnTime: '06:15',
    images: [
      { key: 'jesus', name: 'Nuestro Padre Jesús del Gran Poder de Dos Hermanas', slug: 'jesus-gran-poder-dos-hermanas', type: 'Nazareno', execution: '1901 · Manuel Gutiérrez Reyes Cano' },
      { key: 'dolor', name: 'María Santísima del Mayor Dolor y Traspaso de Dos Hermanas', slug: 'mayor-dolor-traspaso-dos-hermanas', type: 'Dolorosa', execution: '1902 · Manuel Gutiérrez Reyes Cano' },
    ],
    steps: [
      { key: 'cristo', name: 'Paso de Nuestro Padre Jesús del Gran Poder de Dos Hermanas', slug: 'paso-gran-poder-dos-hermanas', type: 'Paso de Cristo', image: 'jesus' },
      { key: 'palio', name: 'Paso de palio de María Santísima del Mayor Dolor y Traspaso', slug: 'paso-palio-mayor-dolor-traspaso-dos-hermanas', type: 'Paso de palio', image: 'dolor' },
    ],
  },
  {
    key: 'amargura', name: 'Amargura de Dos Hermanas', slug: 'amargura-dos-hermanas',
    official: 'Fervorosa e Ilustre Hermandad y Cofradía de Nazarenos de Nuestro Padre Jesús Descendido de la Cruz, Nuestra Madre y Señora de la Amargura y Santa Ángela de la Cruz', popular: 'Amargura de Dos Hermanas',
    types: ['Penitencia'], day: 'Viernes Santo', place: 'amargura', foundation: '1952',
    history: 'Fundada en 1952; desde 1980 realiza su estación de penitencia desde la actual capilla.',
    date: '2026-04-03', departure: '18:00', returnTime: '00:00',
    images: [
      { key: 'jesus', name: 'Nuestro Padre Jesús Descendido de la Cruz de Dos Hermanas', slug: 'jesus-descendido-cruz-dos-hermanas', type: 'Descendimiento', execution: 'Bendecido en 1992' },
      { key: 'amargura', name: 'Nuestra Madre y Señora de la Amargura de Dos Hermanas', slug: 'nuestra-madre-amargura-dos-hermanas', type: 'Dolorosa' },
    ],
    steps: [
      { key: 'misterio', name: 'Paso de misterio de la Amargura de Dos Hermanas', slug: 'paso-misterio-amargura-dos-hermanas', type: 'Paso de misterio', images: ['jesus', 'amargura'], band: 'estrella', position: 'Tras el paso de misterio' },
    ],
  },
]

const corporationIds = new Map([[SANTA_ANA, SANTA_ANA], [SANTO_ENTIERRO, SANTO_ENTIERRO]])
for (const corp of corporations) {
  activeScope = `corporation:${corp.key}`
  const bhId = corp.id || uuid(`entity:brotherhood:${corp.key}`)
  corporationIds.set(corp.key, bhId)
  addEntity(bhId, 'brotherhood', corp.name, corp.slug, `${corp.popular}, corporación canónica de Dos Hermanas.`)
  add('brotherhoods', {
    entity_id: bhId, official_name: corp.official, popular_name: corp.popular,
    foundation_text: corp.foundation, municipality_id: MUNICIPALITY,
    canonical_see_place_id: places[corp.place], neighborhood: null,
    website_url: corp.key === 'vera-cruz' ? 'https://www.veracruzdoshermanas.org/' : null,
    instagram_url: null, brotherhood_types: corp.types,
    current_procession_day: corp.day, history_text: corp.history,
    notes: 'Ficha integrada en el macrolote municipal de Dos Hermanas. Los cultos, autorías o convocatorias no documentados permanecen como huecos legítimos.',
  }, 'entity_id')
  add('entity_locations', { id: uuid(`location:${corp.key}`), entity_id: bhId, place_id: places[corp.place], municipality_id: MUNICIPALITY, location_type: 'canonical_see', is_current: true, notes: 'Sede o punto canónico documentado para el contexto municipal.', status: 'published' })
  link(`brotherhood:${corp.key}:directory`, directorySource, { entity_id: bhId }, 'Identidad y clasificación territorial')
  link(`brotherhood:${corp.key}:week`, weekSource, { entity_id: bhId }, 'Identidad, titulares y salida de 2026')
  if (corp.key === 'vera-cruz') link('brotherhood:vera-cruz:official', veraOfficial, { entity_id: bhId }, 'Canal oficial, identidad y actualidad')

  const imageIds = {}
  for (const image of corp.images) {
    const imageId = uuid(`entity:image:${corp.key}:${image.key}`)
    imageIds[image.key] = imageId
    addEntity(imageId, 'image', image.name, image.slug, `Titular de ${corp.popular}.`)
    add('images', { entity_id: imageId, image_type: image.type, execution_date_text: image.execution || null, current_condition: 'extant', description: `Imagen titular relacionada con ${corp.popular}.`, is_dress_image: image.type === 'Dolorosa' }, 'entity_id')
    add('brotherhood_images', { id: uuid(`bh-image:${corp.key}:${image.key}`), brotherhood_entity_id: bhId, image_entity_id: imageId, relation_type: 'titular', notes: 'Titular canónico de la corporación.', status: 'published' })
    link(`image:${corp.key}:${image.key}`, weekSource, { entity_id: imageId }, 'Titular y cronología disponible')
  }

  const stepIds = {}
  for (const step of corp.steps) {
    const stepId = step.id || uuid(`entity:step:${corp.key}:${step.key}`)
    stepIds[step.key] = stepId
    if (!step.id) {
      addEntity(stepId, 'step', step.name, step.slug, `Paso procesional de ${corp.popular}.`)
      add('steps', { entity_id: stepId, step_type: step.type, current_condition: 'preserved', description: `Paso procesional documentado en la salida de 2026 de ${corp.popular}.` }, 'entity_id')
    }
    add('brotherhood_steps', { id: uuid(`bh-step:${corp.key}:${step.key}`), brotherhood_entity_id: bhId, step_entity_id: stepId, relation_type: 'processional_step', notes: 'Paso canónico de la corporación.', status: 'published' })
    const relatedImages = step.images || [step.image]
    for (const imageKey of relatedImages.filter(Boolean)) add('image_steps', { id: uuid(`image-step:${corp.key}:${step.key}:${imageKey}`), image_entity_id: imageIds[imageKey], step_entity_id: stepId, relation_type: 'processional', notes: 'Imagen relacionada con el paso.', status: 'published' })
    link(`step:${corp.key}:${step.key}`, weekSource, { entity_id: stepId }, 'Paso procesional de 2026')

    if (step.existingPeriod) {
      change('music_accompaniment_periods', { id: step.existingPeriod }, {
        brotherhood_entity_id: bhId, step_entity_id: stepId, status: 'published',
        public_brotherhood_name: corp.popular, public_brotherhood_slug: corp.slug,
        public_step_name: step.name, public_municipality_name: 'Dos Hermanas', public_municipality_slug: 'dos-hermanas', public_province: 'Sevilla',
      })
      link(`music:${corp.key}:${step.key}:existing`, weekSource, { music_accompaniment_period_id: step.existingPeriod }, 'Acompañamiento documentado en 2026')
    } else if (step.band) {
      const periodId = uuid(`music:${corp.key}:${step.key}`)
      add('music_accompaniment_periods', {
        id: periodId, brotherhood_entity_id: bhId, band_entity_id: bandIds[step.band], step_entity_id: stepId,
        position: step.position, outing_type: corp.day, date_from_text: 'Vigente en 2026; inicio no documentado',
        year_from: null, is_current: true, notes: 'La guía de 2026 acredita este acompañamiento; no se infiere continuidad posterior.',
        public_brotherhood_name: corp.popular, public_step_name: step.name,
        public_brotherhood_slug: corp.slug, public_municipality_name: 'Dos Hermanas',
        public_municipality_slug: 'dos-hermanas', public_province: 'Sevilla', status: 'published',
      })
      link(`music:${corp.key}:${step.key}`, weekSource, { music_accompaniment_period_id: periodId }, 'Acompañamiento documentado en 2026')
    }
  }

  const outingId = uuid(`outing:${corp.key}:2026`)
  add('outings', {
    id: outingId, brotherhood_entity_id: bhId, outing_type: 'Estación de penitencia', character: 'ordinary',
    title: `${corp.popular} · salida procesional 2026`, outing_date: corp.date, year: 2026,
    departure_time: corp.departure, return_time: corp.returnTime, municipality_id: MUNICIPALITY,
    origin_place_id: places[corp.place], destination_place_id: places[corp.place],
    route_summary: 'Itinerario por Dos Hermanas documentado en la guía local de Semana Santa de 2026.',
    description: `Salida procesional celebrada en 2026 por ${corp.popular}.`,
    event_status: 'held', status: 'published', slug: `${corp.slug}-salida-2026`,
  })
  link(`outing:${corp.key}:2026`, weekSource, { outing_id: outingId }, 'Horario, itinerario y celebración en 2026')
}

// Entidades no penitenciales: una sacramental, dos rocieras, Valme y Dulce Nombre.
const complementary = [
  {
    key: 'sacramental-pastora', name: 'Hermandad Sacramental de Dos Hermanas', slug: 'hermandad-sacramental-divina-pastora-dos-hermanas',
    official: 'Antigua y Fervorosa Hermandad y Cofradía del Santísimo Sacramento, Divina Pastora de las Almas y Ánimas Benditas del Purgatorio', popular: 'Hermandad Sacramental de Dos Hermanas',
    types: ['Sacramental', 'Gloria'], place: 'magdalena', sourceId: sacramentalSource,
    image: { key: 'pastora', name: 'Divina Pastora de las Almas de Dos Hermanas', slug: 'divina-pastora-almas-dos-hermanas', type: 'Gloria', execution: '1743 · José Montes de Oca' },
  },
  {
    key: 'rocio-dos-hermanas', name: 'Hermandad del Rocío de Dos Hermanas', slug: 'rocio-dos-hermanas',
    official: 'Real y Fervorosa Hermandad de Nuestra Señora del Rocío de Dos Hermanas', popular: 'Rocío de Dos Hermanas',
    types: ['Gloria', 'Rocío'], place: null, sourceId: rocioDosSource,
  },
  {
    key: 'rocio-montequinto', name: 'Hermandad del Rocío de Montequinto', slug: 'rocio-montequinto',
    official: 'Hermandad de Nuestra Señora del Rocío de Montequinto', popular: 'Rocío de Montequinto',
    types: ['Gloria', 'Rocío'], place: 'angeles', sourceId: rocio2026Source,
  },
  {
    key: 'valme', name: 'Hermandad de Valme', slug: 'hermandad-valme-dos-hermanas',
    official: 'Pontificia, Real e Ilustre Hermandad de Nuestra Señora de Valme Coronada y San Fernando', popular: 'Hermandad de Valme',
    types: ['Gloria', 'Romería'], place: 'magdalena', sourceId: valmeSource,
    image: { key: 'valme', name: 'Nuestra Señora de Valme Coronada', slug: 'nuestra-senora-valme-coronada-dos-hermanas', type: 'Gloria', execution: null },
  },
  {
    key: 'dulce-nombre', name: 'Agrupación Parroquial del Dulce Nombre de Jesús', slug: 'agrupacion-dulce-nombre-jesus-dos-hermanas',
    official: 'Agrupación Parroquial del Santísimo Sacramento y Dulce Nombre de Jesús', popular: 'Dulce Nombre de Jesús',
    types: ['Agrupación Parroquial', 'Sacramental'], place: null, sourceId: directorySource,
  },
]

for (const corp of complementary) {
  activeScope = `corporation:${corp.key}`
  const bhId = uuid(`entity:brotherhood:${corp.key}`)
  corporationIds.set(corp.key, bhId)
  addEntity(bhId, 'brotherhood', corp.name, corp.slug, `${corp.popular}, corporación canónica de Dos Hermanas.`)
  add('brotherhoods', {
    entity_id: bhId, official_name: corp.official, popular_name: corp.popular, foundation_text: null,
    municipality_id: MUNICIPALITY, canonical_see_place_id: corp.place ? places[corp.place] : null,
    neighborhood: null, website_url: corp.key === 'rocio-dos-hermanas' ? 'https://rociodoshermanas.es/' : null,
    instagram_url: corp.key === 'sacramental-pastora' ? 'https://www.instagram.com/sacramentaldh/' : null,
    brotherhood_types: corp.types, current_procession_day: null, history_text: null,
    notes: 'Ficha municipal publicada con alcance institucional. Procesiones, cultos o patrimonio no documentados permanecen pendientes y no se infieren.',
  }, 'entity_id')
  if (corp.place) add('entity_locations', { id: uuid(`location:${corp.key}`), entity_id: bhId, place_id: places[corp.place], municipality_id: MUNICIPALITY, location_type: 'canonical_see', is_current: true, notes: 'Sede canónica documentada.', status: 'published' })
  link(`brotherhood:${corp.key}:directory`, directorySource, { entity_id: bhId }, 'Identidad y clasificación territorial')
  link(`brotherhood:${corp.key}:specific`, corp.sourceId, { entity_id: bhId }, 'Identidad y actividad documentada')
  if (corp.image) {
    const imageId = uuid(`entity:image:${corp.key}:${corp.image.key}`)
    addEntity(imageId, 'image', corp.image.name, corp.image.slug, `Titular de ${corp.popular}.`)
    add('images', { entity_id: imageId, image_type: corp.image.type, execution_date_text: corp.image.execution, current_condition: 'extant', description: `Imagen titular relacionada con ${corp.popular}.`, is_dress_image: false }, 'entity_id')
    add('brotherhood_images', { id: uuid(`bh-image:${corp.key}:${corp.image.key}`), brotherhood_entity_id: bhId, image_entity_id: imageId, relation_type: 'titular', notes: 'Titular canónica de la corporación.', status: 'published' })
    link(`image:${corp.key}:${corp.image.key}`, corp.key === 'sacramental-pastora' ? pastoraArtSource : corp.sourceId, { entity_id: imageId }, 'Titular, sede y cronología disponible')
  }
}

// Las dos fichas ya certificadas se preservan y se incorporan únicamente al alcance municipal.
activeScope = 'preserved'
for (const [key, id] of [['santa-ana', SANTA_ANA], ['santo-entierro', SANTO_ENTIERRO]]) {
  link(`preserved:${key}`, directorySource, { entity_id: id }, 'Presencia en el universo municipal; ficha previamente certificada')
}

mkdirSync('tmp', { recursive: true })
mkdirSync('supabase/migrations_archive/post-first-edition-editorial', { recursive: true })

const tableCounts = Object.fromEntries([...new Set(rows.map((row) => row.table))].sort().map((table) => [table, rows.filter((row) => row.table === table).length]))
const inserts = rows.filter((row) => row.operation !== 'update').length
const updates = rows.filter((row) => row.operation === 'update').length
const reuse = 20
const archive = 'supabase/migrations_archive/post-first-edition-editorial/20260916210000_cierra_dos_hermanas_macrolote_municipal.sql'
const coreSql = rows.map(statement).join('\n\n')
const auditItems = rows.map((row, position) => `('${uuid(`import-item:${position}`)}','${IMPORT_ID}',${position},${lit(row.table)},'upsert',100,${lit(JSON.stringify(row.data))}::jsonb,'applied','[]'::jsonb,${lit(JSON.stringify({ operation: row.operation }))}::jsonb,now())`).join(',\n')
const stageItems = rows.map((row, position) => `('${uuid(`import-item:${position}`)}','${IMPORT_ID}',${position},${lit(row.table)},'upsert',100,${lit(JSON.stringify(row.data))}::jsonb,'valid','[]'::jsonb)`).join(',\n')
const stagingSql = `insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata)\nvalues ('${IMPORT_ID}','HC-016 · Macrolote municipal · Dos Hermanas','Fuentes locales, institucionales y oficiales · 2026-09-16','jsonl','staging',${rows.length},${rows.length},${rows.length},0,0,0,'{"scope":"ecosistema municipal de Dos Hermanas","schema":"unchanged","legitimate_gaps":"cultos, igualas, conciertos, crucetas, multimedia y autorias sin fuente suficiente","preserved":"Santa Ana y Santo Entierro"}'::jsonb)\non conflict (id) do update set status='staging',expected_items=excluded.expected_items,staged_items=excluded.staged_items,valid_items=excluded.valid_items,invalid_items=0,applied_items=0,failed_items=0,metadata=excluded.metadata,completed_at=null;\n\ndelete from public.bulk_import_items where import_id='${IMPORT_ID}' and position >= ${rows.length};\n\ninsert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors) values\n${stageItems}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='valid',validation_errors='[]'::jsonb,error_text=null,result=null,applied_at=null;`
const importSql = `insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata,completed_at)\nvalues ('${IMPORT_ID}','HC-016 · Macrolote municipal · Dos Hermanas','Fuentes locales, institucionales y oficiales · 2026-09-16','jsonl','completed',${rows.length},${rows.length},${rows.length},0,${rows.length},0,'{"scope":"ecosistema municipal de Dos Hermanas","schema":"unchanged","legitimate_gaps":"cultos, igualas, conciertos, crucetas, multimedia y autorias sin fuente suficiente","preserved":"Santa Ana y Santo Entierro"}'::jsonb,now())\non conflict (id) do update set status='completed',expected_items=excluded.expected_items,staged_items=excluded.staged_items,valid_items=excluded.valid_items,invalid_items=0,applied_items=excluded.applied_items,failed_items=0,metadata=excluded.metadata,completed_at=now();\n\ninsert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors,result,applied_at) values\n${auditItems}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='applied',validation_errors='[]'::jsonb,error_text=null,result=excluded.result,applied_at=now();`

writeFileSync(archive, `-- HC-016 · macrolote municipal · Dos Hermanas\n-- Veinte corporaciones canónicas, siete formaciones locales y agenda procesional de 2026.\n-- Santa Ana y Santo Entierro se preservan como contextos certificados.\n-- Asociaciones y grupos de fieles no se promocionan a Hermandad.\n-- Solo DML; sin DDL ni cambios de RLS.\n-- Operaciones editoriales: ${rows.length} (${inserts} insert/upsert, ${updates} update, ${reuse} reuse).\n\nbegin;\n\n${coreSql}\n\n${importSql}\n\ncommit;\n`)
writeFileSync('tmp/dos-hermanas-municipal-hc016-core.sql', `begin;\n${coreSql}\ncommit;\n`)
writeFileSync('tmp/dos-hermanas-municipal-hc016-preflight.sql', `begin;\n${coreSql}\nrollback;\n`)
writeFileSync('tmp/dos-hermanas-municipal-hc016-staging.sql', `${stagingSql}\n`)
writeFileSync('tmp/dos-hermanas-municipal-hc016-import.sql', `${importSql}\n`)
writeFileSync('tmp/dos-hermanas-municipal-hc016.jsonl', `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`)
writeFileSync('tmp/dos-hermanas-municipal-hc016-summary.json', `${JSON.stringify({ total: rows.length, inserts, updates, reuse, tables: tableCounts }, null, 2)}\n`)

const scopes = [...new Set(rows.map((row) => row.scope).filter((scope) => scope !== 'shared'))]
for (const scope of scopes) {
  const scopedRows = rows.filter((row) => row.scope === 'shared' || row.scope === scope)
  const filename = scope.replaceAll(':', '-')
  writeFileSync(`tmp/dos-hermanas-preflight-${filename}.sql`, `begin;\n${scopedRows.map(statement).join('\n\n')}\nrollback;\n`)
  const applyRows = rows.filter((row) => row.scope === scope)
  writeFileSync(`tmp/dos-hermanas-apply-${filename}.sql`, `begin;\n${applyRows.map(statement).join('\n\n')}\ncommit;\n`)
}
const sharedRows = rows.filter((row) => row.scope === 'shared')
writeFileSync('tmp/dos-hermanas-apply-shared.sql', `begin;\n${sharedRows.map(statement).join('\n\n')}\ncommit;\n`)
const santaCruzRows = rows.filter((row) => row.scope === 'corporation:santa-cruz')
for (let end = 1; end <= santaCruzRows.length; end += 1) {
  const progressiveRows = [...sharedRows, ...santaCruzRows.slice(0, end)]
  writeFileSync(`tmp/dos-hermanas-preflight-santa-cruz-${end}.sql`, `begin;\n${progressiveRows.map(statement).join('\n\n')}\nrollback;\n`)
}
if (santaCruzRows.length % 5) {
  const progressiveRows = [...sharedRows, ...santaCruzRows]
  writeFileSync(`tmp/dos-hermanas-preflight-santa-cruz-${santaCruzRows.length}.sql`, `begin;\n${progressiveRows.map(statement).join('\n\n')}\nrollback;\n`)
}

console.log(JSON.stringify({ archive, total: rows.length, inserts, updates, reuse, tables: tableCounts, preflightChunks: scopes.length }))

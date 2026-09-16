import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'

const MUNICIPALITY = 'a58d9378-8403-4c8e-97cd-0f7cbcc85b38'
const ACCESS_DATE = '2026-09-16'
const IMPORT_ID = 'c0160026-0000-4000-8000-000000000001'
const GRAN_PODER = 'b0e62209-dedc-4b58-b6e4-9f1dfa8b6a0f'
const VERA_CRUZ = '986af4c9-b178-42fb-b97e-a0c6caf9240d'
const SANGRE = '3323dcde-01e7-41f2-9e3c-7ecea2621736'
const SANGRE_STEP = 'cb1c0ee0-4e6b-446f-8069-851612e232ca'
const GRAN_PODER_SEE = '95bbd265-ed97-40c0-9d59-66d39b51d6a9'
const VERA_CRUZ_SEE = '3fee89ba-389a-4ff0-bad2-88c680a5524f'
const GUIDE_2026 = '7a124dd7-a594-4fd0-979a-b9f1ce65d58c'
const GUIDE_2019 = '209023d6-3036-4d5a-a95b-67f0efb834ca'
const CORONATION_HELD = '1accde5a-be1c-4eca-b393-7d086342c5e4'

function uuid(key) {
  const chars = createHash('sha256').update(`hc016-gerena:${key}`).digest('hex').slice(0, 32).split('')
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

const soledadOfficial = source(
  'soledad-official',
  'Web oficial · Hermandad de la Soledad Coronada de Gerena',
  'https://www.hermandaddelasoledadcoronadadegerena.com/',
  'Fuente oficial',
  'Hermandad de la Soledad Coronada de Gerena',
  'Identidad, historia, sede, titulares, patrimonio y estación de penitencia alterna.',
)
const soledadStation = source(
  'soledad-station',
  'Estación de penitencia · Soledad Coronada de Gerena',
  'https://www.hermandaddelasoledadcoronadadegerena.com/estacion-de-penitencia/',
  'Fuente oficial',
  'Hermandad de la Soledad Coronada de Gerena',
  'Pasos, alternancia entre Sábado Santo y Domingo de Resurrección y acompañamiento de la Banda Municipal.',
)
const soledadHeritage = source(
  'soledad-heritage',
  'Patrimonio · Soledad Coronada de Gerena',
  'https://www.hermandaddelasoledadcoronadadegerena.com/patrimonio/',
  'Fuente oficial',
  'Hermandad de la Soledad Coronada de Gerena',
  'Cronología y autorías de imágenes, capilla y patrimonio procesional.',
)
const veraOfficial = source(
  'vera-official',
  'Web oficial · Hermandad de la Vera-Cruz de Gerena',
  'https://veracruzdegerena.com/',
  'Fuente oficial',
  'Hermandad de la Vera-Cruz de Gerena',
  'Canal institucional de la corporación y dossier de la Coronación Canónica de 2026.',
)
const veraArt = source(
  'vera-art',
  'La Hermandad de la Vera-Cruz de Gerena · patrimonio',
  'https://www.artesacro.org/Noticia/Ver/34504/provincia-mirada-provincia-hermandad-vera-cruz-gerena',
  'Prensa cofrade',
  'Arte Sacro',
  'Titulares y pasos de la corporación, contrastados con las guías municipales.',
)
const granPoderArt = source(
  'gran-poder-art',
  'Gerena y su Gran Poder',
  'https://www.artesacro.org/Noticia/Ver/151455/provincia-gerena-y-su-gran-poder',
  'Prensa cofrade',
  'Arte Sacro',
  'Autoría y cronología de Nuestro Padre Jesús del Gran Poder.',
)
const bandMunicipal = source(
  'band-municipal',
  'Banda Municipal de Música · Cultura Gerena',
  'https://www.gerena.es/es/cultura/',
  'Fuente institucional',
  'Ayuntamiento de Gerena',
  'El portal municipal mantiene la Banda Municipal de Música como entidad cultural local.',
)

// Gran Poder: dos titulares y sus pasos, sin fabricar una edición de salida pasada.
const jesusGranPoder = entity('image:gran-poder', 'image', 'Nuestro Padre Jesús del Gran Poder de Gerena', 'nuestro-padre-jesus-gran-poder-gerena', 'Nazareno titular de la Agrupación Parroquial del Gran Poder de Gerena, obra de Antonio Dubé de Luque de 1990.')
add('images', { entity_id: jesusGranPoder, image_type: 'Nazareno', execution_date_text: '1990 · Antonio Dubé de Luque', current_condition: 'extant', description: 'Imagen de Nuestro Padre Jesús del Gran Poder realizada por Antonio Dubé de Luque en 1990.', is_dress_image: true }, 'entity_id')
add('brotherhood_images', { id: uuid('bh-image:gran-poder'), brotherhood_entity_id: GRAN_PODER, image_entity_id: jesusGranPoder, relation_type: 'titular', notes: 'Titular cristífero de la Agrupación Parroquial.', status: 'published' })
const pasoGranPoder = entity('step:gran-poder', 'step', 'Paso de Nuestro Padre Jesús del Gran Poder de Gerena', 'paso-gran-poder-gerena', 'Paso procesional del titular cristífero en la estación del Miércoles Santo.')
add('steps', { entity_id: pasoGranPoder, step_type: 'Paso de Cristo', current_condition: 'preserved', description: 'Paso procesional de Nuestro Padre Jesús del Gran Poder; las autorías materiales permanecen pendientes de fuente suficiente.' }, 'entity_id')
add('brotherhood_steps', { id: uuid('bh-step:gran-poder'), brotherhood_entity_id: GRAN_PODER, step_entity_id: pasoGranPoder, relation_type: 'processional_step', notes: 'Paso del titular cristífero.', status: 'published' })
add('image_steps', { id: uuid('image-step:gran-poder'), image_entity_id: jesusGranPoder, step_entity_id: pasoGranPoder, relation_type: 'processional', notes: 'El Nazareno preside este paso.', status: 'published' })

const rosario = entity('image:rosario', 'image', 'María Santísima del Rosario en sus Misterios Dolorosos de Gerena', 'maria-santisima-rosario-misterios-dolorosos-gerena', 'Titular mariana de la Agrupación Parroquial del Gran Poder de Gerena; imagen anónima restaurada por Antonio Dubé de Luque.')
add('images', { entity_id: rosario, image_type: 'Dolorosa', execution_date_text: 'Autoría anónima; restaurada por Antonio Dubé de Luque', current_condition: 'extant', description: 'Titular mariana de la corporación y eje de su dimensión rosariana.', is_dress_image: true }, 'entity_id')
add('brotherhood_images', { id: uuid('bh-image:rosario'), brotherhood_entity_id: GRAN_PODER, image_entity_id: rosario, relation_type: 'titular', notes: 'Titular mariana y rosariana.', status: 'published' })
const pasoRosario = entity('step:rosario', 'step', 'Paso procesional de María Santísima del Rosario de Gerena', 'paso-rosario-gran-poder-gerena', 'Paso de la procesión de gloria de María Santísima del Rosario.')
add('steps', { entity_id: pasoRosario, step_type: 'Gloria', current_condition: 'preserved', description: 'Paso procesional de María Santísima del Rosario; no se atribuyen materiales ni autorías sin fuente suficiente.' }, 'entity_id')
add('brotherhood_steps', { id: uuid('bh-step:rosario'), brotherhood_entity_id: GRAN_PODER, step_entity_id: pasoRosario, relation_type: 'processional_step', notes: 'Paso de la titular rosariana.', status: 'published' })
add('image_steps', { id: uuid('image-step:rosario'), image_entity_id: rosario, step_entity_id: pasoRosario, relation_type: 'processional', notes: 'La titular mariana preside su paso de gloria.', status: 'published' })
change('music_accompaniment_periods', { id: '76117425-348e-40ad-84b0-94b0d71cc58b' }, { step_entity_id: pasoRosario, public_step_name: 'Paso procesional de María Santísima del Rosario de Gerena', notes: 'Maestro Tejera acompañó la procesión de gloria del 10 de octubre de 2026; el inicio del vínculo no se infiere.' })
change('brotherhoods', { entity_id: GRAN_PODER }, { notes: 'Ficha cerrada dentro del primer macrolote municipal HC-016 de Gerena; agenda fechada e igualás permanecen sin publicar por falta de convocatoria verificable.' })
for (const [key, sourceId, target, scope] of [
  ['gran-poder:identity', GUIDE_2026, GRAN_PODER, 'Identidad, historia, sede y Miércoles Santo'],
  ['gran-poder:image', granPoderArt, jesusGranPoder, 'Autoría y cronología'],
  ['gran-poder:rosario', GUIDE_2026, rosario, 'Titular mariana'],
  ['gran-poder:step', GUIDE_2026, pasoGranPoder, 'Dimensión procesional'],
  ['gran-poder:rosario-step', GUIDE_2026, pasoRosario, 'Dimensión procesional rosariana'],
]) link(key, sourceId, { entity_id: target }, scope)

// Vera-Cruz: incorpora el crucificado y publica el palio ya existente.
const cristoVeraCruz = entity('image:cristo-vera-cruz', 'image', 'Santísimo Cristo de la Vera Cruz de Gerena', 'santisimo-cristo-vera-cruz-gerena', 'Crucificado anónimo de la Hermandad de la Vera-Cruz de Gerena.')
add('images', { entity_id: cristoVeraCruz, image_type: 'Crucificado', execution_date_text: 'Imagen anónima del siglo XVI', current_condition: 'extant', description: 'Crucificado titular de la Vera-Cruz de Gerena, realizado mediante la técnica de telas encoladas.', technique: 'Telas encoladas' }, 'entity_id')
add('brotherhood_images', { id: uuid('bh-image:cristo-vera-cruz'), brotherhood_entity_id: VERA_CRUZ, image_entity_id: cristoVeraCruz, relation_type: 'titular', notes: 'Titular cristífero de la corporación.', status: 'published' })
const pasoVeraCruz = entity('step:cristo-vera-cruz', 'step', 'Paso del Santísimo Cristo de la Vera Cruz de Gerena', 'paso-cristo-vera-cruz-gerena', 'Paso procesional del Santísimo Cristo de la Vera Cruz.')
add('steps', { entity_id: pasoVeraCruz, step_type: 'Paso de Cristo', execution_date_text: '1960 · Manuel Guzmán Bejarano', current_condition: 'preserved', description: 'Paso tallado por Manuel Guzmán Bejarano y dorado por Herrera y Feria.' }, 'entity_id')
add('brotherhood_steps', { id: uuid('bh-step:cristo-vera-cruz'), brotherhood_entity_id: VERA_CRUZ, step_entity_id: pasoVeraCruz, relation_type: 'processional_step', notes: 'Paso del titular cristífero.', status: 'published' })
add('image_steps', { id: uuid('image-step:cristo-vera-cruz'), image_entity_id: cristoVeraCruz, step_entity_id: pasoVeraCruz, relation_type: 'processional', notes: 'El crucificado preside este paso.', status: 'published' })
change('entities', { id: SANGRE_STEP }, { status: 'published', summary: 'Paso de palio de María Santísima de la Sangre de Gerena.' })
change('steps', { entity_id: SANGRE_STEP }, { current_condition: 'preserved', description: 'Paso de palio de terciopelo verde, diseñado por Juan Pérez Calvo y bordado por las Adoratrices de Sevilla en 1958; su orfebrería reúne trabajos de varios talleres.' })
change('brotherhood_steps', { id: '61758889-f55c-4441-8089-95474a259b27' }, { status: 'published', notes: 'Paso de palio canónico de María Santísima de la Sangre.' })
add('image_steps', { id: uuid('image-step:sangre'), image_entity_id: SANGRE, step_entity_id: SANGRE_STEP, relation_type: 'processional', notes: 'La titular mariana preside su paso de palio.', status: 'published' })
change('brotherhoods', { entity_id: VERA_CRUZ }, { website_url: 'https://veracruzdegerena.com/', notes: 'Ficha cerrada dentro del primer macrolote municipal HC-016 de Gerena; se preserva la extraordinaria de la Coronación ya certificada.' })
add('entity_social_links', { id: uuid('social:vera-official'), entity_id: VERA_CRUZ, platform: 'website', url: 'https://veracruzdegerena.com/', label: 'Web oficial', display_order: 0, is_public: true }, 'entity_id,platform')
for (const [key, sourceId, target, scope] of [
  ['vera:identity', GUIDE_2019, VERA_CRUZ, 'Identidad, historia, sede y Jueves Santo'],
  ['vera:official', veraOfficial, VERA_CRUZ, 'Canal oficial y actualidad corporativa'],
  ['vera:cristo', veraArt, cristoVeraCruz, 'Titular cristífero'],
  ['vera:cristo-step', veraArt, pasoVeraCruz, 'Paso de Cristo'],
  ['vera:sangre', veraArt, SANGRE, 'Titular mariana'],
  ['vera:sangre-step', veraArt, SANGRE_STEP, 'Paso de palio'],
  ['vera:coronation-held', CORONATION_HELD, VERA_CRUZ, 'Coronación Canónica celebrada · 12 de septiembre de 2026'],
]) link(key, sourceId, { entity_id: target }, scope)

// Soledad: tercera corporación canónica del municipio, controlada por identidad territorial.
const soledadSee = uuid('place:soledad')
add('places', { id: soledadSee, municipality_id: MUNICIPALITY, name: 'Capilla de Nuestra Señora de la Soledad de Gerena', slug: 'capilla-nuestra-senora-soledad-gerena', place_type: 'Capilla', address: 'Calle San Sebastián, Gerena', notes: 'Sede canónica de la Hermandad de la Soledad Coronada, contigua a la Parroquia de la Purísima Concepción.' })
const soledad = entity('brotherhood:soledad', 'brotherhood', 'Hermandad de la Soledad Coronada de Gerena', 'soledad-coronada-gerena', 'Primitiva corporación del Santo Entierro, la Resurrección y Nuestra Señora de la Soledad Coronada de Gerena.')
add('brotherhoods', { entity_id: soledad, official_name: 'Primitiva, Real e Ilustre Hermandad y Cofradía del Santo Entierro de Cristo, Nuestro Señor de la Paz en su Resurrección Gloriosa, Nuestra Señora de la Soledad Coronada y San Sebastián Mártir, Co-Patrón de la Villa de Gerena', popular_name: 'Soledad Coronada de Gerena', foundation_text: 'Documentada en 1560 y con visitas pastorales desde 1604', municipality_id: MUNICIPALITY, canonical_see_place_id: soledadSee, neighborhood: null, website_url: 'https://www.hermandaddelasoledadcoronadadegerena.com/', instagram_url: null, brotherhood_types: ['Penitencia', 'Gloria'], current_procession_day: 'Sábado Santo / Domingo de Resurrección (años alternos)', history_text: 'La Cofradía de Santa María de la Soledad aparece documentada en 1560 y conserva una relación de visitas pastorales desde 1604. Su archivo histórico acredita hospital propio y una trayectoria continuada; la corporación alterna sus estaciones del Sábado Santo y del Domingo de Resurrección.', notes: 'Ficha cerrada en el primer macrolote municipal HC-016 de Gerena. No se crea una salida 2026 sin evidencia posterior suficiente de celebración.' }, 'entity_id')
const soledadLocation = uuid('location:soledad')
add('entity_locations', { id: soledadLocation, entity_id: soledad, place_id: soledadSee, municipality_id: MUNICIPALITY, location_type: 'canonical_see', is_current: true, notes: 'Sede canónica actual.', status: 'published' })
add('entity_social_links', { id: uuid('social:soledad-official'), entity_id: soledad, platform: 'website', url: 'https://www.hermandaddelasoledadcoronadadegerena.com/', label: 'Web oficial', display_order: 0, is_public: true }, 'entity_id,platform')

const paz = entity('image:paz', 'image', 'Nuestro Señor de la Paz en su Resurrección Gloriosa', 'senor-paz-resurreccion-gerena', 'Titular cristífero de la Soledad Coronada de Gerena, obra de Antonio Dubé de Luque.')
add('images', { entity_id: paz, image_type: 'Resucitado', execution_date_text: '1989 · Antonio Dubé de Luque', current_condition: 'extant', description: 'Imagen del Señor de la Paz en su Resurrección Gloriosa, bendecida el 14 de octubre de 1989.', is_dress_image: false }, 'entity_id')
const soledadImage = entity('image:soledad', 'image', 'Nuestra Señora de la Soledad Coronada de Gerena', 'nuestra-senora-soledad-coronada-gerena', 'Dolorosa titular de la Hermandad de la Soledad Coronada de Gerena.')
add('images', { entity_id: soledadImage, image_type: 'Dolorosa', execution_date_text: 'Obra anónima sevillana de la segunda mitad del siglo XVII', current_condition: 'extant', description: 'Dolorosa de autoría anónima sevillana, coronada en 1974 con reconocimiento canónico por decreto de 1999.', is_dress_image: true }, 'entity_id')
const yacente = entity('image:yacente', 'image', 'Cristo Yacente de la Soledad de Gerena', 'cristo-yacente-soledad-gerena', 'Cristo Yacente gótico tardío conservado por la Hermandad de la Soledad.')
add('images', { entity_id: yacente, image_type: 'Yacente', execution_date_text: '1520 · autoría anónima', current_condition: 'extant', description: 'Cristo Yacente de estilo gótico tardío, restaurado por el IAPH en 1995–1996.', is_dress_image: false }, 'entity_id')
for (const [key, imageId, notes] of [
  ['paz', paz, 'Titular del misterio de la Resurrección.'],
  ['soledad', soledadImage, 'Titular mariana de la corporación.'],
  ['yacente', yacente, 'Titular del Santo Entierro.'],
]) add('brotherhood_images', { id: uuid(`bh-image:soledad:${key}`), brotherhood_entity_id: soledad, image_entity_id: imageId, relation_type: 'titular', notes, status: 'published' })

const pasoPaz = entity('step:paz', 'step', 'Paso de Nuestro Señor de la Paz de Gerena', 'paso-senor-paz-gerena', 'Paso del misterio de la Resurrección de la Soledad de Gerena.')
add('steps', { entity_id: pasoPaz, step_type: 'Paso de misterio', execution_date_text: 'Finales de la década de 1970 · Manuel Guzmán Bejarano', current_condition: 'preserved', description: 'Paso tallado por Manuel Guzmán Bejarano, con figuras de Ortega Bru de 1983 y dorado de Luis Sánchez.' }, 'entity_id')
const pasoSoledad = entity('step:soledad', 'step', 'Paso de palio de Nuestra Señora de la Soledad Coronada de Gerena', 'paso-palio-soledad-coronada-gerena', 'Paso de palio de la titular mariana, con conjuntos diferenciados para Sábado Santo y Domingo de Resurrección.')
add('steps', { entity_id: pasoSoledad, step_type: 'Paso de palio', current_condition: 'preserved', description: 'Paso de palio con respiraderos de Manuel de los Ríos, varales y jarras de Jesús Domínguez, peana y crestería de Fernando Marmolejo y candelabros de Manuel Seco Velasco.' }, 'entity_id')
for (const [key, stepId, imageId, notes] of [
  ['paz', pasoPaz, paz, 'Paso del misterio de la Resurrección.'],
  ['soledad', pasoSoledad, soledadImage, 'Paso de palio de la titular mariana.'],
]) {
  add('brotherhood_steps', { id: uuid(`bh-step:soledad:${key}`), brotherhood_entity_id: soledad, step_entity_id: stepId, relation_type: 'processional_step', notes, status: 'published' })
  add('image_steps', { id: uuid(`image-step:soledad:${key}`), image_entity_id: imageId, step_entity_id: stepId, relation_type: 'processional', notes, status: 'published' })
}

const band = entity('band:municipal', 'band', 'Banda Municipal de Música de Gerena', 'banda-municipal-musica-gerena', 'Formación musical municipal de Gerena, vinculada al patrimonio sonoro y procesional de la localidad.')
add('bands', { entity_id: band, band_type: 'Banda de música', municipality_id: MUNICIPALITY, foundation_text: null, website_url: null, instagram_url: null, description: 'Banda de música de carácter municipal con actividad cultural y acompañamientos procesionales documentados en Gerena.', headquarters_text: 'Gerena' }, 'entity_id')
add('music_accompaniment_periods', { id: uuid('music:soledad-band'), brotherhood_entity_id: soledad, band_entity_id: band, step_entity_id: pasoSoledad, position: 'Tras el paso de palio', outing_type: 'Estación de penitencia', date_from_text: 'Vigencia documentada por la web oficial; inicio no acreditado', is_current: true, notes: 'La web oficial identifica a la Banda Municipal tras el palio; no se infiere año inicial.', status: 'published', public_brotherhood_name: 'Soledad Coronada de Gerena', public_step_name: 'Paso de palio de Nuestra Señora de la Soledad Coronada de Gerena', public_brotherhood_slug: 'soledad-coronada-gerena', public_municipality_name: 'Gerena', public_municipality_slug: 'gerena', public_province: 'Sevilla' })

for (const [key, sourceId, target, scope] of [
  ['soledad:identity', soledadOfficial, soledad, 'Identidad, historia y corporación'],
  ['soledad:paz', soledadHeritage, paz, 'Titular y autoría'],
  ['soledad:image', soledadHeritage, soledadImage, 'Titular, cronología y coronación'],
  ['soledad:yacente', soledadHeritage, yacente, 'Titular, cronología y restauración'],
  ['soledad:paso-paz', soledadStation, pasoPaz, 'Paso y patrimonio procesional'],
  ['soledad:paso-palio', soledadStation, pasoSoledad, 'Paso y patrimonio procesional'],
  ['soledad:band', soledadStation, band, 'Acompañamiento musical'],
  ['band:municipal', bandMunicipal, band, 'Identidad municipal'],
]) link(key, sourceId, { entity_id: target }, scope)
link('soledad:place', soledadOfficial, { entity_location_id: soledadLocation }, 'Sede canónica')
link('soledad:music-period', soledadStation, { music_accompaniment_period_id: uuid('music:soledad-band') }, 'Acompañamiento tras el palio')

mkdirSync('tmp', { recursive: true })
mkdirSync('supabase/migrations_archive/post-first-edition-editorial', { recursive: true })

const tableCounts = Object.fromEntries([...new Set(rows.map((row) => row.table))].sort().map((table) => [table, rows.filter((row) => row.table === table).length]))
const inserts = rows.filter((row) => row.operation !== 'update').length
const updates = rows.filter((row) => row.operation === 'update').length
const archive = 'supabase/migrations_archive/post-first-edition-editorial/20260916150000_cierra_gerena_macrolote_municipal.sql'
const coreSql = rows.map(statement).join('\n\n')
const auditItems = rows.map((row, position) => `('${uuid(`import-item:${position}`)}','${IMPORT_ID}',${position},${lit(row.table)},'upsert',100,${lit(JSON.stringify(row.data))}::jsonb,'applied','[]'::jsonb,${lit(JSON.stringify({ operation: row.operation }))}::jsonb,now())`).join(',\n')
const stageItems = rows.map((row, position) => `('${uuid(`import-item:${position}`)}','${IMPORT_ID}',${position},${lit(row.table)},'upsert',100,${lit(JSON.stringify(row.data))}::jsonb,'valid','[]'::jsonb)`).join(',\n')
const stagingSql = `insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata)\nvalues ('${IMPORT_ID}','HC-016 · Primer macrolote municipal · Gerena','Fuentes institucionales, oficiales y contraste territorial · 2026-09-16','jsonl','staging',${rows.length},${rows.length},${rows.length},0,0,0,'{"scope":"ecosistema municipal de Gerena","schema":"unchanged","legitimate_gaps":"agenda futura, cultos fechados, igualas, conciertos y crucetas sin convocatoria verificable"}'::jsonb)\non conflict (id) do update set status='staging',expected_items=excluded.expected_items,staged_items=excluded.staged_items,valid_items=excluded.valid_items,invalid_items=0,applied_items=0,failed_items=0,metadata=excluded.metadata,completed_at=null;\n\ninsert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors) values\n${stageItems}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='valid',validation_errors='[]'::jsonb,error_text=null,result=null,applied_at=null;`
const importSql = `insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata,completed_at)\nvalues ('${IMPORT_ID}','HC-016 · Primer macrolote municipal · Gerena','Fuentes institucionales, oficiales y contraste territorial · 2026-09-16','jsonl','completed',${rows.length},${rows.length},${rows.length},0,${rows.length},0,'{"scope":"ecosistema municipal de Gerena","schema":"unchanged","legitimate_gaps":"agenda futura, cultos fechados, igualas, conciertos y crucetas sin convocatoria verificable","preserved":"coronacion de la Sangre y cierres anteriores"}'::jsonb,now())\non conflict (id) do update set status='completed',expected_items=excluded.expected_items,staged_items=excluded.staged_items,valid_items=excluded.valid_items,invalid_items=0,applied_items=excluded.applied_items,failed_items=0,metadata=excluded.metadata,completed_at=now();\n\ninsert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors,result,applied_at) values\n${auditItems}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='applied',validation_errors='[]'::jsonb,error_text=null,result=excluded.result,applied_at=now();`
writeFileSync(archive, `-- HC-016 · primer macrolote provincial por municipios · Gerena\n-- Tres Hermandades, una Banda local y sus relaciones canónicas.\n-- No se crean Agenda, cultos fechados, igualás, conciertos ni Crucetas sin convocatoria verificable.\n-- Solo DML; sin DDL ni cambios de RLS.\n-- Operaciones editoriales: ${rows.length} (${inserts} insert/upsert, ${updates} update).\n\nbegin;\n\n${coreSql}\n\n${importSql}\n\ncommit;\n`)
writeFileSync('tmp/gerena-municipal-hc016-core.sql', `begin;\n${coreSql}\ncommit;\n`)
writeFileSync('tmp/gerena-municipal-hc016-preflight.sql', `begin;\n${coreSql}\nrollback;\n`)
writeFileSync('tmp/gerena-municipal-hc016-staging.sql', `${stagingSql}\n`)
writeFileSync('tmp/gerena-municipal-hc016-import.sql', `${importSql}\n`)
writeFileSync('tmp/gerena-municipal-hc016.jsonl', `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`)
writeFileSync('tmp/gerena-municipal-hc016-summary.json', `${JSON.stringify({ total: rows.length, inserts, updates, reuse: 10, tables: tableCounts }, null, 2)}\n`)

console.log(JSON.stringify({ archive, total: rows.length, inserts, updates, reuse: 10, tables: tableCounts }))

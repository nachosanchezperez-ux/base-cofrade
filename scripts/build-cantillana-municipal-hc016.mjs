import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'

const MUNICIPALITY = '30000000-0000-0000-0000-000000000001'
const BROTHERHOOD = '7f968a07-e7c0-43cc-93b6-e8dd8b91ab5d'
const SANCTUARY = '3541b014-0f9e-4871-ab7b-067207ab5ea0'
const PALIO_STEP = 'd42514a4-cd0f-499b-86de-65637db156f6'
const PALIO_RELATION = '01e01e64-8e0a-4086-8716-12923f6a383f'
const LOCAL_BAND = '7a0f25e9-4901-4fb2-b35e-c851c24fb845'
const CURRENT_MUSIC = 'b5163ba2-f3f2-40f3-a18c-1c1b1f94809c'
const MUNICIPAL_SOURCE = '92bea4dd-e624-49a3-8e70-192da1d3b312'
const ACCESS_DATE = '2026-09-17'
const IMPORT_ID = 'c0160030-0000-4000-8000-000000000001'

function uuid(key) {
  const chars = createHash('sha256').update(`hc016-cantillana:${key}`).digest('hex').slice(0, 32).split('')
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
const entity = (key, type, name, slug, summary) => {
  const id = uuid(`entity:${key}`)
  add('entities', { id, entity_type: type, name, slug, summary, status: 'published' })
  return id
}
const source = (key, name, url, type, publisher, notes, publication_date = null) => {
  const id = uuid(`source:${key}`)
  add('sources', { id, name, url, source_type: type, author_or_publisher: publisher, publication_date, accessed_at: ACCESS_DATE, notes })
  return id
}
const link = (key, sourceId, target, scope, notes = null) => add('source_links', { id: uuid(`source-link:${key}`), source_id: sourceId, ...target, scope, notes })

const program2026 = source(
  'program-2026',
  'Programa de Cuaresma y Semana Santa de Cantillana 2026',
  'https://drive.google.com/file/d/1npeoMWaU1xox46apKEOOlKwk__QXKjc-/view',
  'Programa institucional',
  'Ayuntamiento de Cantillana',
  'Ficha vigente de la Soledad: tres pasos, cortejo, horarios, recorrido, música y calendario cultual de 2026.',
  '2026-03-01',
)
const marchChronicle = source(
  'passio-march-2026',
  'Cantillana · crónicas de marzo de 2026',
  'https://passionaevensis.blogspot.com/2026/03/',
  'Crónica local',
  'Passio Naevensis',
  'Evidencia posterior del Septenario y del besamanos de Nuestra Señora de la Soledad.',
)
const aprilChronicle = source(
  'passio-april-2026',
  'Cantillana · crónica de Semana Santa de abril de 2026',
  'https://passionaevensis.blogspot.com/2026/04/',
  'Crónica local',
  'Passio Naevensis',
  'Crónica posterior que acredita la estación de la Soledad y describe los tres pasos.',
)
const fridayOfficial = source(
  'friday-official',
  'Viernes Santo · Hermandad de la Soledad de Cantillana',
  'https://soledadcantillana.blogspot.com/2009/11/viernes-santo.html',
  'Fuente oficial',
  'Hermandad de la Soledad de Cantillana',
  'Configuración histórica del cortejo y acompañamiento de la Banda de Música de Nuestra Señora de la Soledad.',
)
const calvaryOfficial = source(
  'calvary-official',
  'Paso del Calvario · Hermandad de la Soledad de Cantillana',
  'https://soledadcantillana.blogspot.com/2009/11/paso-del-calvario.html',
  'Fuente oficial',
  'Hermandad de la Soledad de Cantillana',
  'Composición del Calvario, cronología de San Juan y María Magdalena y canastilla de 1946.',
)
const archdiocese = source(
  'archdiocese-soledad',
  'La Soledad de Cantillana y su ermita (II)',
  'https://www.archisevilla.org/la-soledad-de-cantillana-y-su-ermita-ii/',
  'Fuente institucional',
  'Archidiócesis de Sevilla',
  'Contexto histórico y documental del contrato de Juan de Santamaría de 1583.',
)

change('brotherhoods', { entity_id: BROTHERHOOD }, {
  brotherhood_types: ['Servita', 'Penitencia', 'Patronal'],
  current_procession_day: 'Viernes Santo',
  notes: 'Ecosistema municipal de Cantillana cerrado mediante HC-016. La estación de 2026 se acredita como celebrada por crónica posterior; los cultos sin prueba posterior conservan announced.',
})
change('entities', { id: PALIO_STEP }, {
  status: 'published',
  summary: 'Paso de palio de Nuestra Señora de la Soledad Coronada, patrona de Cantillana.',
})
change('steps', { entity_id: PALIO_STEP }, {
  current_condition: 'preserved',
  description: 'Paso de palio de Nuestra Señora de la Soledad Coronada, tercero del cortejo penitencial de 2026.',
})
change('brotherhood_steps', { id: PALIO_RELATION }, {
  relation_type: 'processional_step',
  notes: 'Paso de palio vigente, publicado en el cierre municipal HC-016.',
  status: 'published',
})
change('music_accompaniment_periods', { id: CURRENT_MUSIC }, {
  step_entity_id: PALIO_STEP,
  position: 'Tras el paso de palio',
  date_from_text: 'Vigente en el Viernes Santo de 2026; inicio no acreditado',
  is_current: true,
  notes: 'El programa municipal de 2026 y la fuente oficial documentan a la Banda de Música de Nuestra Señora de la Soledad tras la Patrona; no se infiere continuidad para 2027.',
  status: 'published',
})

const juanSantamaria = entity('agent:juan-santamaria', 'agent', 'Juan de Santamaría', 'juan-de-santamaria', 'Escultor documentado en Cantillana en el contrato de 1583 relacionado con la Soledad.')
add('agents', { entity_id: juanSantamaria, agent_kind: 'person', municipality_id: null, foundation_or_birth_text: 'Activo en el siglo XVI', death_or_end_text: null, website_url: null, instagram_url: null, description: 'Escultor documentado por el contrato de 1583 conservado en el contexto histórico de la Soledad de Cantillana.' }, 'entity_id')
add('agent_names', { id: uuid('agent-name:juan-santamaria'), agent_entity_id: juanSantamaria, name: 'Juan de Santamaría', name_type: 'official', is_current: true, notes: 'Nombre consignado en la documentación histórica.' })
add('agent_disciplines', { id: uuid('agent-discipline:juan-santamaria'), agent_entity_id: juanSantamaria, discipline: 'Escultura', is_primary: true, notes: 'Disciplina documentada.' })

function addImage(key, name, slug, summary, image_type, execution_date_text, description, is_dress_image, author = false) {
  const id = entity(`image:${key}`, 'image', name, slug, summary)
  add('images', { entity_id: id, image_type, execution_date_text, current_condition: 'extant', description, is_dress_image }, 'entity_id')
  add('brotherhood_images', { id: uuid(`brotherhood-image:${key}`), brotherhood_entity_id: BROTHERHOOD, image_entity_id: id, relation_type: 'titular', notes: 'Titular vigente de la corporación.', status: 'published' })
  if (author) add('image_authorships', { id: uuid(`authorship:${key}`), image_entity_id: id, agent_entity_id: juanSantamaria, authorship_type: 'author', role_name: 'escultor', date_from_text: '1583', certainty: 'documented', notes: 'Autoría y fecha consignadas por la documentación histórica contextualizada por la Archidiócesis.', status: 'published' })
  return id
}

const yacente = addImage('yacente', 'Santísimo Cristo Yacente de Cantillana', 'santisimo-cristo-yacente-cantillana', 'Titular cristífero del Santo Entierro de la Soledad de Cantillana.', 'Yacente', '1583', 'Cristo Yacente del Santo Entierro, documentado en el conjunto histórico de 1583.', false, true)
const virgin = addImage('virgin', 'Nuestra Señora de la Soledad Coronada de Cantillana', 'nuestra-senora-soledad-coronada-cantillana', 'Patrona de Cantillana y titular mariana de la Hermandad de la Soledad.', 'Dolorosa', '1583', 'Dolorosa servita, patrona de Cantillana y coronada canónicamente en 2024.', true, true)
const sanJuan = addImage('san-juan', 'San Juan Evangelista de la Soledad de Cantillana', 'san-juan-evangelista-soledad-cantillana', 'Imagen secundaria del Calvario de la Soledad de Cantillana.', 'San Juan Evangelista', 'Siglo XVIII; autoría no acreditada', 'Imagen de vestir que integra el paso del Calvario.', true)
const magdalena = addImage('magdalena', 'Santa María Magdalena de la Soledad de Cantillana', 'santa-maria-magdalena-soledad-cantillana', 'Imagen secundaria del Calvario de la Soledad de Cantillana.', 'Santa María Magdalena', 'Siglo XVIII; autoría no acreditada', 'Imagen de vestir que integra el paso del Calvario.', true)

function addStep(key, name, slug, summary, type, description, images) {
  const id = entity(`step:${key}`, 'step', name, slug, summary)
  add('steps', { entity_id: id, step_type: type, current_condition: 'preserved', description }, 'entity_id')
  add('brotherhood_steps', { id: uuid(`brotherhood-step:${key}`), brotherhood_entity_id: BROTHERHOOD, step_entity_id: id, relation_type: 'processional_step', notes: 'Paso vigente del cortejo del Viernes Santo.', status: 'published' })
  images.forEach(([imageId, relation], index) => add('image_steps', { id: uuid(`image-step:${key}:${index}`), image_entity_id: imageId, step_entity_id: id, relation_type: relation, notes: relation === 'processional' ? 'Imagen principal del paso.' : 'Imagen secundaria integrada en el conjunto.', status: 'published' }))
  return id
}

const sepulchre = addStep('sepulchre', 'Paso del Santo Sepulcro de Cantillana', 'paso-santo-sepulcro-cantillana', 'Paso del Santísimo Cristo Yacente en el Santo Entierro de Cantillana.', 'Santo Sepulcro', 'Paso del Santo Sepulcro recuperado para el cortejo contemporáneo; la crónica de 2026 acredita su participación.', [[yacente, 'processional']])
const calvary = addStep('calvary', 'Paso del Calvario de la Soledad de Cantillana', 'paso-calvario-soledad-cantillana', 'Paso del Calvario con San Juan Evangelista y Santa María Magdalena.', 'Misterio', 'Paso del Calvario con canastilla realizada en 1946 por Francisco Luis Zambrano.', [[sanJuan, 'processional'], [magdalena, 'secondary']])
add('image_steps', { id: uuid('image-step:palio:virgin'), image_entity_id: virgin, step_entity_id: PALIO_STEP, relation_type: 'processional', notes: 'Nuestra Señora de la Soledad Coronada preside su paso de palio.', status: 'published' })

function addCult(key, imageId, type, title, start, end, time, eventStatus, order, description) {
  const id = uuid(`cult:${key}`)
  add('cults', { id, brotherhood_entity_id: BROTHERHOOD, image_entity_id: imageId, cult_type: type, title, cult_date: start, date_rule: 'Edición 2026 documentada', month: Number(start.slice(5, 7)), time_text: time, place_id: SANCTUARY, description, status: 'published', is_recurring: false, recurrence_label: null, display_order: order, notes: 'No se extrapola recurrencia ni convocatoria de 2027.' })
  add('cult_entities', { id: uuid(`cult-entity:${key}`), cult_id: id, entity_id: imageId, role: 'honoree', notes: 'Titular a quien se dedica el culto.' })
  const occurrence = uuid(`cult-occurrence:${key}`)
  add('cult_occurrences', { id: occurrence, cult_id: id, year: 2026, title_override: null, start_date: start, end_date: end, place_id: SANCTUARY, description_override: null, event_status: eventStatus, status: 'published', notes: eventStatus === 'held' ? 'Celebración acreditada por evidencia posterior.' : 'Convocatoria documentada; no se eleva a held sin evidencia posterior.' })
  link(`cult:${key}:program`, program2026, { cult_id: id }, 'Fecha, horario y lugar de la convocatoria de 2026')
  link(`cult:${key}:occurrence`, eventStatus === 'held' ? marchChronicle : program2026, { cult_occurrence_id: occurrence }, eventStatus === 'held' ? 'Evidencia posterior de celebración' : 'Convocatoria de 2026')
  return id
}

addCult('function-yacente', yacente, 'Función solemne', 'Función solemne al Santísimo Cristo Yacente', '2026-03-14', '2026-03-14', '18:00', 'announced', 1, 'Función solemne convocada en honor del Santísimo Cristo Yacente.')
addCult('veneration-yacente', yacente, 'Veneración', 'Veneración al Santísimo Cristo Yacente', '2026-03-15', '2026-03-15', '09:00–13:00', 'announced', 2, 'Veneración matinal al Santísimo Cristo Yacente.')
addCult('descendimiento', yacente, 'Sermón y rito', 'Sermón de las Cinco Llagas y Descendimiento', '2026-03-15', '2026-03-15', '20:00', 'announced', 3, 'Sermón de las Cinco Llagas y rito del Descendimiento.')
addCult('septenary', virgin, 'Septenario', 'Septenario a Nuestra Señora de la Soledad Coronada', '2026-03-20', '2026-03-26', '20:00', 'held', 4, 'Septenario anual a la patrona de Cantillana; la crónica local acredita su celebración en 2026.')
addCult('principal-function', virgin, 'Función principal', 'Función Principal de Instituto', '2026-03-27', '2026-03-27', '11:30', 'announced', 5, 'Función Principal de Instituto convocada para el Viernes de Dolores.')
addCult('besamanos', virgin, 'Besamanos', 'Besamanos a Nuestra Señora de la Soledad Coronada', '2026-03-27', '2026-03-27', '17:00–20:00', 'held', 6, 'Besamanos de la patrona de Cantillana, acreditado por galería posterior.')
addCult('easter-mass', virgin, 'Misa de Pascua', 'Misa de Pascua y procesión eucarística', '2026-04-05', '2026-04-05', '20:00', 'announced', 7, 'Misa de Pascua, procesión del Santísimo, bendición y Regina Coeli; permanece anunciada sin evidencia posterior suficiente.')

const series = uuid('outing-series:friday')
add('outing_series', { id: series, brotherhood_entity_id: BROTHERHOOD, outing_type: 'Estación de penitencia', character: 'ordinary', title: 'Estación de penitencia de la Soledad de Cantillana', month: 4, date_rule: 'Viernes Santo', time_text: '19:00–02:00', municipality_id: MUNICIPALITY, origin_place_id: SANCTUARY, destination_place_id: SANCTUARY, route_summary: 'Santuario, San Bartolomé, Plaza del Llano, Real, Antonio Machado, Asunción, Casillas, Cristo de la Misericordia, Iglesia, Parroquia, Pastora Solís, Callejón, Castelar, Martín Rey, Polvillo y Santuario.', description: 'Cortejo penitencial de tres pasos.', display_order: 1, status: 'published', notes: 'Serie anual; la edición de 2026 se modela por separado y consta como held.' })
const outing = uuid('outing:friday-2026')
add('outings', { id: outing, brotherhood_entity_id: BROTHERHOOD, outing_type: 'Estación de penitencia', character: 'ordinary', title: 'Estación de penitencia de la Soledad de Cantillana 2026', outing_date: '2026-04-03', year: 2026, departure_time: '19:00', return_time: '02:00', municipality_id: MUNICIPALITY, origin_place_id: SANCTUARY, destination_place_id: SANCTUARY, reason: null, description: 'Estación de penitencia celebrada el Viernes Santo de 2026 con tres pasos y aproximadamente 250 nazarenos.', event_status: 'held', status: 'published', return_date: '2026-04-04', route_summary: 'Santuario, San Bartolomé, Plaza del Llano, Real, Antonio Machado, Asunción, Casillas, Cristo de la Misericordia, Iglesia, Parroquia, Pastora Solís, Callejón, Castelar, Martín Rey, Polvillo y Santuario.', public_notes: 'Capataces: Rogelio Satorres y auxiliares; Antonio Junco Campos y auxiliares. Vestidor: José Naranjo Ferrari. El programa identifica también a la Banda de Música “Montefrío” de Granada sin precisar de forma inequívoca su posición.', organizer_name: null, organizer_notes: null, outing_series_id: series, slug: 'estacion-penitencia-soledad-cantillana-2026', reference_code: 'HC016-CANTILLANA-SOLEDAD-2026', origin_text: 'Santuario de Nuestra Señora de la Soledad', destination_text: 'Santuario de Nuestra Señora de la Soledad' })
link('outing:program', program2026, { outing_id: outing }, 'Fecha, horarios, recorrido, cortejo y música de 2026')
link('outing:held', aprilChronicle, { outing_id: outing }, 'Evidencia posterior de celebración y presencia de los tres pasos')

const montefrioPosition = uuid('music-position:montefrio')
add('outing_music_positions', { id: montefrioPosition, outing_id: outing, step_entity_id: null, position_code: 'unspecified', position_label: 'Acompañamiento del cortejo; posición exacta no publicada', sequence_no: 1, notes: 'No se asigna a un paso sin evidencia inequívoca.', status: 'published' })
add('outing_music_assignments', { id: uuid('music-assignment:montefrio'), music_position_id: montefrioPosition, band_entity_id: null, participation_mode: 'unspecified', sequence_no: 1, segment_start_label: null, segment_end_label: null, notes: 'Crédito textual: no se crea nodo de Banda por identidad insuficientemente resuelta.', status: 'published', band_name_text: 'Banda de Música “Montefrío” de Granada' })
const localPosition = uuid('music-position:local')
add('outing_music_positions', { id: localPosition, outing_id: outing, step_entity_id: PALIO_STEP, position_code: 'after_step', position_label: 'Tras el paso de palio', sequence_no: 2, notes: 'Posición documentada por la fuente oficial y el programa de 2026.', status: 'published' })
add('outing_music_assignments', { id: uuid('music-assignment:local'), music_position_id: localPosition, band_entity_id: LOCAL_BAND, participation_mode: 'full_route', sequence_no: 1, segment_start_label: null, segment_end_label: null, notes: 'Banda local canónica reutilizada, sin duplicar entidad.', status: 'published', band_name_text: null })

for (const [key, sourceId, target, scope] of [
  ['brotherhood:municipal', MUNICIPAL_SOURCE, BROTHERHOOD, 'Identidad, sede y tradición del Viernes Santo'],
  ['agent:juan', archdiocese, juanSantamaria, 'Contrato histórico de 1583'],
  ['image:yacente', archdiocese, yacente, 'Autoría y cronología histórica'],
  ['image:virgin', archdiocese, virgin, 'Autoría y cronología histórica'],
  ['image:san-juan', calvaryOfficial, sanJuan, 'Imagen secundaria y cronología'],
  ['image:magdalena', calvaryOfficial, magdalena, 'Imagen secundaria y cronología'],
  ['step:sepulchre', aprilChronicle, sepulchre, 'Participación del paso en 2026'],
  ['step:calvary', calvaryOfficial, calvary, 'Composición y canastilla'],
  ['step:palio', program2026, PALIO_STEP, 'Tercer paso del cortejo de 2026'],
  ['band:local', fridayOfficial, LOCAL_BAND, 'Acompañamiento de la Patrona'],
]) link(key, sourceId, { entity_id: target }, scope)
link('music:current', program2026, { music_accompaniment_period_id: CURRENT_MUSIC }, 'Acompañamiento vigente en 2026')

mkdirSync('tmp', { recursive: true })
mkdirSync('supabase/migrations_archive/post-first-edition-editorial', { recursive: true })
const tableCounts = Object.fromEntries([...new Set(rows.map((row) => row.table))].sort().map((table) => [table, rows.filter((row) => row.table === table).length]))
const inserts = rows.filter((row) => row.operation !== 'update').length
const updates = rows.filter((row) => row.operation === 'update').length
const reuse = 7
const archive = 'supabase/migrations_archive/post-first-edition-editorial/20260917070000_cierra_cantillana_macrolote_municipal.sql'
const coreSql = rows.map(statement).join('\n\n')
const auditItems = rows.map((row, position) => `('${uuid(`import-item:${position}`)}','${IMPORT_ID}',${position},${lit(row.table)},'upsert',100,${lit(JSON.stringify(row.data))}::jsonb,'applied','[]'::jsonb,${lit(JSON.stringify({ operation: row.operation }))}::jsonb,now())`).join(',\n')
const stageItems = rows.map((row, position) => `('${uuid(`import-item:${position}`)}','${IMPORT_ID}',${position},${lit(row.table)},'upsert',100,${lit(JSON.stringify(row.data))}::jsonb,'valid','[]'::jsonb)`).join(',\n')
const metadata = '{"scope":"ecosistema municipal de Cantillana","schema":"unchanged","universe":"Asuncion y Pastora preservadas; Soledad completada; Banda y Cruceta reutilizadas","legitimate_gaps":"identidad y posicion exacta de Montefrio, fotografia con licencia, patrimonio no documentado y cultos sin evidencia posterior"}'
const stagingSql = `insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata)\nvalues ('${IMPORT_ID}','HC-016 · Tercer macrolote municipal · Cantillana','Fuentes institucionales, oficiales y crónicas posteriores · 2026-09-17','jsonl','staging',${rows.length},${rows.length},${rows.length},0,0,0,'${metadata}'::jsonb)\non conflict (id) do update set status='staging',expected_items=excluded.expected_items,staged_items=excluded.staged_items,valid_items=excluded.valid_items,invalid_items=0,applied_items=0,failed_items=0,metadata=excluded.metadata,completed_at=null;\n\ninsert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors) values\n${stageItems}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='valid',validation_errors='[]'::jsonb,error_text=null,result=null,applied_at=null;`
const importSql = `insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata,completed_at)\nvalues ('${IMPORT_ID}','HC-016 · Tercer macrolote municipal · Cantillana','Fuentes institucionales, oficiales y crónicas posteriores · 2026-09-17','jsonl','completed',${rows.length},${rows.length},${rows.length},0,${rows.length},0,'${metadata}'::jsonb,now())\non conflict (id) do update set status='completed',expected_items=excluded.expected_items,staged_items=excluded.staged_items,valid_items=excluded.valid_items,invalid_items=0,applied_items=excluded.applied_items,failed_items=0,metadata=excluded.metadata,completed_at=now();\n\ninsert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors,result,applied_at) values\n${auditItems}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='applied',validation_errors='[]'::jsonb,error_text=null,result=excluded.result,applied_at=now();`
writeFileSync(archive, `-- HC-016 · tercer macrolote provincial por municipios · Cantillana\n-- Asunción y Pastora se preservan; se completa la Soledad y se reutilizan Banda y Cruceta.\n-- La estación de 2026 queda held por crónica posterior; los cultos sin prueba posterior siguen announced.\n-- Solo DML; sin DDL ni cambios de RLS.\n-- Operaciones editoriales: ${rows.length} (${inserts} insert/upsert, ${updates} update, ${reuse} reuse).\n\nbegin;\n\n${coreSql}\n\n${importSql}\n\ncommit;\n`)
writeFileSync('tmp/cantillana-municipal-hc016-core.sql', `begin;\n${coreSql}\ncommit;\n`)
writeFileSync('tmp/cantillana-municipal-hc016-preflight.sql', `begin;\n${coreSql}\nrollback;\n`)
writeFileSync('tmp/cantillana-municipal-hc016-staging.sql', `${stagingSql}\n`)
writeFileSync('tmp/cantillana-municipal-hc016-import.sql', `${importSql}\n`)
writeFileSync('tmp/cantillana-municipal-hc016.jsonl', `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`)
writeFileSync('tmp/cantillana-municipal-hc016-summary.json', `${JSON.stringify({ total: rows.length, inserts, updates, reuse, tables: tableCounts }, null, 2)}\n`)
console.log(JSON.stringify({ archive, total: rows.length, inserts, updates, reuse, tables: tableCounts }))

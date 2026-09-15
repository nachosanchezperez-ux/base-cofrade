import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'

const ACCESS_DATE = '2026-09-15'
const IMPORT_ID = 'c0160021-0000-4000-8000-000000000001'

function uuid(key) {
  const chars = createHash('sha256').update(`hc016-past-announced:${key}`).digest('hex').slice(0, 32).split('')
  chars[12] = '4'
  chars[16] = ['8', '9', 'a', 'b'][parseInt(chars[16], 16) % 4]
  const value = chars.join('')
  return `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20)}`
}

function lit(value) {
  if (value == null) return 'null'
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
const source = (key, name, url, sourceType, publisher, publicationDate, notes) => {
  const id = uuid(`source:${key}`)
  add('sources', { id, name, url, source_type: sourceType, author_or_publisher: publisher, publication_date: publicationDate, accessed_at: ACCESS_DATE, notes })
  return id
}
const link = (key, sourceId, target, scope) => add('source_links', { id: uuid(`source-link:${key}`), source_id: sourceId, ...target, scope })

const historicalEvents = [
  '35000000-0000-0000-0000-000000000001',
  '0f528808-a102-49b1-a30c-11ec7b41a7a5',
  '15000000-0000-0000-0000-000000000002',
  '15000000-0000-0000-0000-000000000003',
]
for (const entityId of historicalEvents) change('events', { entity_id: entityId }, { event_status: 'held' })

const evidence = {
  utrera: source('utrera', 'Miles de fieles acompañan a la Virgen de Consolación en su procesión por Utrera', 'https://www.utreraweb.com/noticias-de-utrera/feria/2026/21420/miles-de-fieles-acompanan-a-la-virgen-de-consolacion-en-su-procesion-por-utrera-video/', 'Prensa local', 'UtreraWeb', '2026-09-08', 'Crónica posterior que documenta la salida, el recorrido y la participación del 8 de septiembre de 2026.'),
  setefilla: source('setefilla', 'La devoción a la Virgen de Setefilla, a través del objetivo de Antonio Nuño', 'https://lacajacofrade.es/virgen-setefilla-2026-galeria-antonio-nuno/', 'Prensa cofrade', 'La Caja Cofrade', '2026-09-12', 'Crónica fotográfica posterior de la Romería de Setefilla de 2026.'),
  coria: source('coria', 'La Virgen de la Estrella realizó su procesión de Gloria de 2026', 'https://www.facebook.com/aytocoriario/posts/la-virgen-de-la-estrella-patrona-de-coria-del-r%C3%ADo-realiz%C3%B3-ayer-su-procesi%C3%B3n-de-g/1392817602980906/', 'Red social institucional', 'Ayuntamiento de Coria del Río', null, 'Comunicación municipal posterior que confirma la procesión del 8 de septiembre de 2026.'),
  ecija: source('ecija', 'La Hermandad del Rocío de Écija acompaña a la Virgen del Valle en su procesión', 'https://www.rocio.com/radar/historias/la-hermandad-del-rocio-de-ecija-acompana-a-la-virgen-del-valle-en-su-procesion', 'Fuente institucional', 'Hermandad del Rocío de Écija / Rocio.com', null, 'Comunicación posterior de una corporación participante en la procesión del 8 de septiembre de 2026.'),
  osuna: source('osuna', 'Participación en la procesión de Nuestra Señora de Consolación de Osuna', 'https://www.instagram.com/p/DdGliUVFYmE/', 'Red social oficial', 'Hermandad de Fátima de Osuna', null, 'Comunicación posterior de una corporación participante que confirma la procesión del 8 de septiembre de 2026.'),
  gerena: source('gerena', 'Gerena vive una jornada histórica con la Coronación Canónica de la Virgen de la Sangre', 'https://www.mundocofrade.es/articulo/actualidad/gerena-vive-jornada-historica-coronacion-canonica-virgen-sangre/20260914123359007998.html', 'Prensa cofrade', 'Mundo Cofrade', '2026-09-14', 'Crónica posterior de la coronación y procesión triunfal celebradas el 12 de septiembre de 2026.'),
  tocina: source('tocina', 'Crónica de la procesión del Cristo de la Vera Cruz de Tocina de 2026', 'https://www.facebook.com/elpespunte.es/posts/%EF%B8%8Ftocina-celebra-este-lunes-la-funci%C3%B3n-del-se%C3%B1or-todos-los-detalles-de-la-procesi/1722841523182628/', 'Prensa local', 'El Pespunte', null, 'Publicación posterior que documenta la procesión celebrada el 14 de septiembre de 2026.'),
  sanBernardo: source('san-bernardo', 'San Bernardo recuperó el paso del Niño Jesús en la procesión del Santísimo', 'https://www.artesacro.org/Noticia/Ver/169082/san-bernardo-recupero-paso-nino-jesus-procesion-santisimo', 'Prensa cofrade', 'Arte Sacro', '2026-09-15', 'Crónica posterior que confirma la Función de la Santa Cruz y la procesión eucarística del 14 de septiembre de 2026.'),
}

const confirmedOutings = [
  ['utrera', 'd4debf08-2ffc-40ef-9e9b-001056634cf8'],
  ['setefilla', 'f2269fd6-67d9-470f-a1c3-1bc4f39c65db'],
  ['coria', 'fe8a73c6-d4bb-404e-9509-d3c911d862ce'],
  ['ecija', 'ddb20bf2-4bf5-4976-b8e1-c8ec1b94e04e'],
  ['osuna', '99467611-8d13-4f7e-8e31-2bb46f905e1e'],
  ['gerena', 'f5d2e6a6-21b4-4462-9510-e4f9292ae4af'],
  ['tocina', '323a20d6-b16e-4004-b171-351ecc420a2d'],
  ['sanBernardo', '34fd555f-8ca2-4651-90d6-ff7712635ec4'],
]
for (const [key, outingId] of confirmedOutings) {
  change('outings', { id: outingId }, { event_status: 'held' })
  link(`outing:${key}`, evidence[key], { outing_id: outingId }, 'Evidencia posterior de celebración · 2026')
}

const sanBernardoOccurrence = 'e8a729e6-3f7c-47ea-a2d1-7e8d0440ff64'
change('cult_occurrences', { id: sanBernardoOccurrence }, { event_status: 'held' })
link('cult-occurrence:san-bernardo', evidence.sanBernardo, { cult_occurrence_id: sanBernardoOccurrence }, 'Evidencia posterior de la función y procesión · 14 de septiembre de 2026')

mkdirSync('tmp', { recursive: true })
mkdirSync('supabase/migrations_archive/post-first-edition-editorial', { recursive: true })

const sqlPath = 'supabase/migrations_archive/post-first-edition-editorial/20260915130000_audita_acontecimientos_pasados_announced.sql'
const sql = `begin;\n${rows.map(statement).join('\n\n')}\ncommit;\n`
writeFileSync(sqlPath, sql)
writeFileSync('tmp/auditoria-past-announced-hc016.jsonl', `${rows.map((row) => JSON.stringify(row)).join('\n')}\n`)
writeFileSync('tmp/auditoria-past-announced-hc016-summary.json', `${JSON.stringify({
  expected_items: rows.length,
  inserts: rows.filter((row) => row.operation !== 'update').length,
  updates: rows.filter((row) => row.operation === 'update').length,
  tables: Object.fromEntries([...new Set(rows.map((row) => row.table))].sort().map((table) => [table, rows.filter((row) => row.table === table).length])),
}, null, 2)}\n`)
writeFileSync('tmp/auditoria-past-announced-hc016-import.sql', `insert into public.bulk_imports (id,label,source_name,source_format,status,expected_items,staged_items,valid_items,invalid_items,applied_items,failed_items,metadata) values ('${IMPORT_ID}','HC-016 · Auditoría de acontecimientos pasados en announced','Contraste documental posterior · 2026-09-15','jsonl','staging',${rows.length},0,0,0,0,0,'{"scope":"125 registros pasados auditados; solo cambios con evidencia posterior","schema":"unchanged","timezone":"Europe/Madrid"}'::jsonb) on conflict (id) do update set label=excluded.label,status='staging',expected_items=excluded.expected_items,staged_items=0,valid_items=0,invalid_items=0,applied_items=0,failed_items=0,metadata=excluded.metadata,completed_at=null;\n`)
for (let offset = 0; offset < rows.length; offset += 35) {
  const values = rows.slice(offset, offset + 35).map((row, index) => `(gen_random_uuid(),'${IMPORT_ID}',${offset + index},${lit(row.table)},'upsert',100,${lit(JSON.stringify(row.data))}::jsonb,'valid','[]'::jsonb)`).join(',\n')
  writeFileSync(`tmp/auditoria-past-announced-hc016-items-${String(offset / 35 + 1).padStart(2, '0')}.sql`, `insert into public.bulk_import_items (id,import_id,position,table_name,operation,priority,record,status,validation_errors) values\n${values}\non conflict (import_id,position) do update set table_name=excluded.table_name,operation=excluded.operation,priority=excluded.priority,record=excluded.record,status='valid',validation_errors='[]'::jsonb,error_text=null,result=null,applied_at=null;\n`)
}

console.log(JSON.stringify({ rows: rows.length, sql: sqlPath }))

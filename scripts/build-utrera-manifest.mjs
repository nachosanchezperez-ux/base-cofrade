import { createHash } from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { readUtreraModel, validateUtreraModel } from './validate-utrera-model.mjs'
import { buildBrotherhoodTypesGuard } from './hc016-brotherhood-types-guard.mjs'
import { DIRECTORY_TYPES } from '../lib/brotherhood-directory.js'
import { meetsPublicEditorialMinimum } from '../lib/supabase/public-entity-page.js'

// Offline only. No connection, credentials, staging, migration or execution.
const folder = new URL('../docs/evidence/modelado-utrera-2026-09-27/', import.meta.url)
const read = (name) => JSON.parse(readFileSync(new URL(name, folder), 'utf8'))
const hash = (value) => createHash('sha256').update(value).digest('hex')
const M = 'e4319248-831a-4f4c-adb8-19c496f95dd6'
const NON_PUBLIC_KEYS = ['I44', 'I45', 'S25', 'H17']
const fail = (ok, message) => { if (!ok) throw new Error(`UTRERA_MANIFEST: ${message}`) }
const slug = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const unique = (rows) => [...new Set(rows.filter(Boolean))]
const keymap = (rows) => new Map(rows.map((row) => [row.key, row]))
const merge = (rows, additions) => {
  const map = keymap(rows)
  for (const row of additions) map.set(row.key, { ...map.get(row.key), ...row })
  return [...map.values()]
}
const generatedId = (kind, key) => `c0160038-${kind}-4000-8000-${hash(key).slice(0, 12)}`
const refsFor = (row) => unique([...(row.sources || []), ...(row.attribute_sources || []), row.source])

export function buildUtreraManifest() {
  const [base, gloria, stepsReview] = readUtreraModel()
  validateUtreraModel(base, gloria, stepsReview) // Earlier documentary cuts remain reproducible.
  const closure = read('identity-closure.json')
  const snapshot = read('manifest-production-snapshot-reconciled.json')
  const local = read('manifest-local-snapshot.json')
  const schema = read('manifest-schema.json')
  const outingSchema = read('outing-entities-schema.json')
  const sources = [...base.sources, ...gloria.sources, ...stepsReview.sources, ...closure.sources]
  const corporations = merge(merge([...base.corporations, ...base.municipal_census_review], [...gloria.corporations, ...stepsReview.corporate_profiles]), [...closure.corporations, ...closure.corporate_overrides])
  const images = merge([...base.images, ...gloria.images, ...stepsReview.images, ...closure.images], closure.image_overrides)
  const steps = merge(base.steps, [...gloria.step_refinements, ...stepsReview.step_refinements, ...closure.steps, ...(closure.step_overrides || [])])
  const places = [...base.places, ...gloria.places, ...closure.places]
  const bands = [...base.bands, ...closure.bands]
  const assets = [...gloria.heritage_assets, ...closure.heritage_assets]
  const outings = merge([...base.outings, ...gloria.outings, ...closure.outings], closure.outing_refinements)
  const hh = keymap(corporations), imageMap = keymap(images), stepMap = keymap(steps)
  const ids = {}, identities = [], operations = [], reused = [], minima = []
  const sourceIds = {}, entityLookup = new Map(snapshot.entities.map((row) => [row.id, row]))
  const liveTables = { ...local, brotherhoods: snapshot.brotherhoods, places: snapshot.places, outing_entities: outingSchema.local_rows }
  const schemas = [...schema.initial, ...schema.tables, ...outingSchema.columns]
  const columns = new Map()
  for (const row of schemas) {
    if (!columns.has(row.table)) columns.set(row.table, new Map())
    columns.get(row.table).set(row.column, row)
  }
  const usedIds = new Set(), allowedTypes = new Set(DIRECTORY_TYPES.map(({ type }) => type))
  const add = (table, data, label, sourceKeys = []) => {
    // Keep documented identities for editors without inventing corporate links.
    const privateIds = NON_PUBLIC_KEYS.map((key) => ids[key]).filter(Boolean)
    if (data.status && ['entities', 'entity_locations', 'image_authorships', 'image_steps'].includes(table)
      && Object.entries(data).some(([key, value]) => (key === 'id' || key.endsWith('entity_id')) && privateIds.includes(value))) data.status = 'review'
    const pk = columns.get(table)?.has('entity_id') && ['brotherhoods', 'images', 'steps', 'bands', 'agents', 'heritage_assets'].includes(table) ? 'entity_id' : 'id'
    for (const [column, value] of Object.entries(data)) if (columns.get(table)?.get(column)?.udt === 'time' && typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)) data[column] = `${value}:00`
    const key = `${table}:${data[pk]}`
    fail(data[pk] && !usedIds.has(key), `operación repetida o sin PK: ${label}`)
    usedIds.add(key)
    fail(Object.keys(data).every((c) => columns.get(table)?.has(c)), `columna inexistente: ${label}`)
    const before = liveTables[table]?.find((row) => row[pk] === data[pk])
    const operation = before ? 'update' : 'insert'
    if (before && Object.entries(data).every(([k, v]) => JSON.stringify(before[k]) === JSON.stringify(v))) {
      reused.push({ table, pk, id: data[pk], reason: label }); return
    }
    const naturalKeys = {
      brotherhood_images: ['brotherhood_entity_id', 'image_entity_id', 'relation_type', 'date_from'],
      brotherhood_steps: ['brotherhood_entity_id', 'step_entity_id', 'relation_type', 'date_from'],
      image_steps: ['image_entity_id', 'step_entity_id', 'relation_type', 'date_from'],
      outing_entities: ['outing_id', 'entity_id', 'role'],
      outing_music_positions: ['outing_id', 'sequence_no'],
      outing_music_assignments: ['music_position_id', 'band_entity_id', 'sequence_no'],
      image_authorships: ['image_entity_id', 'agent_entity_id', 'authorship_type', 'role_name'],
      source_links: ['source_id', ...Object.keys(data).filter((c) => c.endsWith('_id') && c !== 'source_id'), 'scope'],
      entity_locations: ['entity_id', 'place_id', 'location_type', 'is_current'],
    }[table] || (data.slug ? ['slug'] : [])
    operations.push({ number: operations.length + 1, label, table, operation, pk, id: data[pk], data, before: before || null, sources: unique(sourceKeys), natural_keys: naturalKeys })
  }
  const register = (row, kind, type) => {
    const id = row.id || generatedId(kind, row.key)
    fail(!ids[row.key], `clave de identidad duplicada ${row.key}`)
    ids[row.key] = id
    const existing = type === 'place' ? snapshot.places.find((p) => p.id === id) : entityLookup.get(id)
    if (row.id) fail(existing && (type === 'place' || existing.entity_type === type), `REUSE inexistente/tipo erróneo: ${row.key}`)
    else fail(!existing, `UUID nuevo ocupado: ${row.key}`)
    identities.push({ key: row.key, id, type, name: row.name || row.popular_name, decision: row.id ? 'REUSE' : 'INSERT', rationale: row.id ? 'Identidad canónica del snapshot y fuentes de la matriz.' : 'Sin identidad coincidente en el catálogo global y la conciliación municipal; no reutilizar homónimos de otro municipio.' })
    if (row.id) reused.push({ table: type === 'place' ? 'places' : 'entities', pk: 'id', id, reason: row.key })
    return id
  }
  const sourceLink = (sourceKey, target, scope = 'documentación') => {
    fail(sourceIds[sourceKey], `fuente desconocida ${sourceKey}`)
    const fields = { source_id: sourceIds[sourceKey], ...target, scope }
    const existing = local.source_links.find((row) => Object.entries(fields).every(([k, v]) => row[k] === v))
    if (existing) { reused.push({ table: 'source_links', pk: 'id', id: existing.id, reason: 'Misma fuente/destino/ámbito' }); return }
    const id = generatedId('1000', JSON.stringify(fields))
    if (usedIds.has(`source_links:${id}`)) return
    add('source_links', { id, ...fields }, `Fuente ${sourceKey}`, [sourceKey])
  }
  const linkAll = (keys, target, scope) => unique(keys).forEach((key) => sourceLink(key, target, scope))
  const publishEntity = (row, type, name, summary, context, relations, sourceKeys) => {
    const existing = entityLookup.get(ids[row.key])
    const candidateSlug = existing?.slug || slug(`${name}${type === 'agent' || type === 'band' ? '' : ' utrera'}`)
    fail(!snapshot.entities.some((e) => e.slug === candidateSlug && e.id !== ids[row.key]), `slug ocupado: ${candidateSlug}`)
    const ready = meetsPublicEditorialMinimum({ identity: name, type, context, summary, relations, sources: sourceKeys, publicValues: [summary] })
    fail(ready, `mínimo editorial ${row.key}`)
    minima.push({ key: row.key, ready, public_profile: !NON_PUBLIC_KEYS.includes(row.key) })
    add('entities', { id: ids[row.key], entity_type: type, name: existing?.name || name, slug: candidateSlug, summary, status: 'published' }, row.key, sourceKeys)
    linkAll(sourceKeys, { entity_id: ids[row.key] })
  }
  for (const source of sources) {
    fail(!sourceIds[source.key], `fuente repetida ${source.key}`)
    const matches = snapshot.sources.filter((row) => row.url === source.url)
    // Multiple existing citations of the same URL: deterministic reuse, never rewrite them.
    const existing = matches.sort((a, b) => a.id.localeCompare(b.id))[0]
    const id = existing?.id || generatedId('0900', source.url)
    sourceIds[source.key] = id
    if (existing) reused.push({ table: 'sources', pk: 'id', id, reason: `URL exacta ${source.key}` })
    else if (!usedIds.has(`sources:${id}`)) add('sources', { id, name: source.title, url: source.url, source_type: /Consejo|Hermandad|Salesianos|Ayuntamiento/.test(source.publisher || '') ? 'Fuente institucional' : 'Fuente documental', author_or_publisher: source.publisher || null, publication_date: source.published_date || null, accessed_at: '2026-09-27', notes: source.sha256 ? `SHA256 del documento consultado: ${source.sha256}` : null }, source.key)
  }
  for (const row of places) {
    register(row, '0200', 'place')
    if (!row.id) add('places', { id: ids[row.key], municipality_id: M, name: row.name, slug: slug(`${row.name} utrera`), place_type: row.place_type || (row.name.startsWith('Parroquia') ? 'Parroquia' : row.name.startsWith('Basílica') ? 'Basílica' : 'Capilla') }, row.key, refsFor(row))
  }
  for (const row of corporations) { register(row, '0300', 'brotherhood'); fail(row.brotherhood_types?.length && row.brotherhood_types.every((v) => allowedTypes.has(v)) && unique(row.brotherhood_types).length === row.brotherhood_types.length, `tipos ${row.key}`) }
  for (const row of images) register(row, '0600', 'image')
  for (const row of steps) register(row, '0700', 'step')
  for (const row of bands) register(row, '0400', 'band')
  for (const row of assets) register(row, '0800', 'heritage_asset')
  for (const row of outings) { ids[row.key] = generatedId('1100', row.key); identities.push({ key: row.key, id: ids[row.key], type: 'outing', name: row.name, decision: 'INSERT' }) }
  const titles = {
    H01: 'Fervorosa, Ilustre y Antigua Hermandad del Rosario de la Santísima Trinidad y Cofradía de Nazarenos del Santísimo Cristo de los Afligidos, Nuestro Padre Jesús en su Entrada Triunfal en Jerusalén y Nuestra Señora de los Desamparados',
    H03: 'Real e Ilustre Hermandad de Penitencia del Santísimo Cristo de la Caridad en su Sagrado Descendimiento, María Santísima de la Piedad en su Quinta Angustia, Nuestra Señora de los Ángeles en su Soledad y Santa Ángela de la Cruz',
    H04: 'Hermandad Obrera del Apostolado y Penitencia del Santísimo Cristo del Perdón, María Santísima de la Amargura y San Juan Bosco',
    H05: 'Hermandad Salesiana y Cofradía de Nazarenos del Santísimo Cristo del Amor, Nuestra Señora de las Veredas, María Auxilio de los Cristianos y San Juan Bosco',
    H06: 'Ilustre Hermandad de Nuestro Padre Jesús Atado a la Columna, María Santísima de la Paz y San Pedro Príncipe de los Apóstoles',
    H07: 'Pontificia e Ilustre Hermandad Sacramental de la Inmaculada Concepción y Ánimas Benditas, y Cofradía de Nazarenos del Santísimo Cristo de Santiago, Nuestro Padre Jesús Redentor Cautivo y Nuestra Señora de las Lágrimas',
    H08: 'Real, Fervorosa e Ilustre Hermandad de Penitencia del Santísimo Cristo de la Buena Muerte, Nuestra Señora de la Esperanza, Nuestra Señora del Rosario y Beato Ceferino Mártir',
    H10: 'Hermandad de Penitencia y Cofradía de Nazarenos del Santo Crucifijo de los Milagros, María Santísima de la Concepción y San Miguel Arcángel',
    H11: 'Hermandad del Santísimo Sacramento y Ánimas Benditas del Purgatorio',
  }
  for (const row of corporations) {
    if (row.key === 'H12') continue
    const old = snapshot.brotherhoods.find((b) => b.entity_id === ids[row.key])
    const sourceKeys = unique([...refsFor(row), ...(titles[row.key] ? ['F01'] : [])])
    if (!old) publishEntity(row, 'brotherhood', `${row.name || row.popular_name} de Utrera`, row.summary, 'Utrera', [row.place || 'Culto en Pinzón'], sourceKeys)
    else linkAll(sourceKeys, { entity_id: ids[row.key] })
    const data = old ? { entity_id: old.entity_id, notes: null, current_procession_day: row.key === 'H02' ? 'Domingo de Ramos y Viernes Santo' : 'Viernes Santo y Sábado Santo' } : { entity_id: ids[row.key], official_name: row.official_name || titles[row.key], popular_name: row.popular_name || row.name, municipality_id: M, canonical_see_place_id: row.place ? ids[row.place] : null, brotherhood_types: row.brotherhood_types, history_text: row.history_text || null, foundation_text: row.foundation_text || null }
    add('brotherhoods', data, `Perfil ${row.key}`, sourceKeys)
    if (row.place && !local.entity_locations.some((r) => r.entity_id === ids[row.key] && r.is_current && r.location_type === 'canonical_see')) {
      const location = generatedId('1200', row.key)
      add('entity_locations', { id: location, entity_id: ids[row.key], place_id: ids[row.place], municipality_id: M, location_type: 'canonical_see', is_current: true, status: 'published' }, `Sede ${row.key}`, sourceKeys)
      linkAll(sourceKeys, { entity_location_id: location })
    }
  }
  const aliases = {
    'José Montes de Oca': '0875a668-af38-4d7d-9ecd-d7aff487608f', 'Sebastián Santos': '13fb6b36-f879-41ef-ab19-90d97e693972', 'Marcos Cabrera': 'ff3b1c8b-2c17-49cd-990d-a3f79b1c739d',
    'Diego Roldán': 'c0160033-0503-4000-8000-000000000003', 'Juan Ventura': 'ee06b3cf-beb0-4794-8e3a-321288b0e130', 'Cristóbal Ramos Tello': '7c377abb-bc65-4647-899d-1c4704ff6180', 'Francisco Buiza': '160be307-5396-41a2-8903-7467a8c330f3',
  }
  const authors = new Map()
  for (const row of images) {
    if (row.id || !row.author_name || row.author_name === 'Pepe Romero') continue
    if (!authors.has(row.author_name)) {
      const matches = snapshot.entities.filter((e) => e.entity_type === 'agent' && (e.id === aliases[row.author_name] || (!aliases[row.author_name] && slug(e.name) === slug(row.author_name))))
      fail(matches.length <= 1, `autor ambiguo ${row.author_name}`)
      const author = { key: `AG:${row.author_name}`, id: matches[0]?.id, name: row.author_name }
      register(author, '0500', 'agent'); authors.set(row.author_name, author)
      if (!author.id) {
        const subject = `${row.name} de Utrera`
        const text = row.authorship_type === 'author' ? `Autor de ${subject}, identificado en las fuentes de esta imagen.` : `Artista citado en la atribución o el contexto de taller de ${subject}; el vínculo no afirma una autoría documentada.`
        publishEntity(author, 'agent', author.name, text, 'Patrimonio de Utrera', [subject], refsFor(row))
        add('agents', { entity_id: ids[author.key], agent_kind: 'person', description: text }, author.key, refsFor(row))
      }
    }
  }
  const imageTypes = { I01: 'Entrada en Jerusalén', I05: 'Crucificado', I07: 'Oración en el Huerto', I11: 'Nazareno', I14: 'Cristo yacente', I19: 'Crucificado', I21: 'Crucificado', I25: 'Atado a la columna', I27: 'Cautivo', I29: 'Crucificado', I31: 'Atado a la columna', I33: 'Cristo yacente', I34: 'Crucificado' }
  for (const row of images) {
    const sourceKeys = refsFor(row), parent = hh.get(row.brotherhood)
    const type = row.image_type || imageTypes[row.key] || (/Virgen|María Santísima/.test(row.name) ? 'Dolorosa' : 'Imagen secundaria')
    const context = parent?.name || row.organizer
    let description = row.description || `Imagen de ${row.name} vinculada a ${context} de Utrera.`
    if (!row.description && row.author_name) description += ` ${row.authorship_type === 'author' ? 'Obra de' : row.authorship_type === 'workshop_of' ? 'Atribuida al taller de' : row.authorship_type === 'school_of' ? 'Relacionada con la escuela de' : row.authorship_type === 'circle_of' ? 'Relacionada con el círculo de' : 'Atribuida a'} ${row.author_name}.`
    if (!row.description && row.execution_date_text) description += ` Datación: ${row.execution_date_text}.`
    if (!row.id) {
      const name = `${row.name} · ${parent?.name || 'Resucitado de Utrera'}`
      publishEntity(row, 'image', name, description, 'Utrera', [context, row.place || parent?.place], sourceKeys)
      add('images', { entity_id: ids[row.key], image_type: type, execution_date: row.execution_date || null, execution_date_text: row.execution_date_text || null, material: row.material || null, description, notes: ({ I06: 'Hechura de 1959 y bendición de 1960, según la historia corporativa.', I31: 'Las fuentes proponen atribuciones alternativas a Pedro Roldán y Francisco Antonio Ruiz Gijón; no hay autoría única confirmada.', I38: 'Cronología y autoría con lecturas diferentes en la web corporativa y el catálogo del Consejo.', I42: 'Imagen histórica del colegio salesiano, distinta de la réplica procesional.' })[row.key] || null }, row.key, sourceKeys)
    } else linkAll(sourceKeys, { entity_id: ids[row.key] })
    if (row.brotherhood) {
      const old = local.brotherhood_images.find((r) => r.brotherhood_entity_id === ids[row.brotherhood] && r.image_entity_id === ids[row.key])
      const relation = old?.id || generatedId('1300', row.key)
      add('brotherhood_images', { id: relation, brotherhood_entity_id: ids[row.brotherhood], image_entity_id: ids[row.key], relation_type: old?.relation_type || (['I02', 'I03', 'I04', 'I08', 'I09', 'I10', 'I12', 'I16', 'I17', 'I22', 'I23'].includes(row.key) ? 'secondary_image' : 'titular'), status: 'published', notes: old?.notes && !/draft|pendiente/i.test(old.notes) ? old.notes : 'Vinculación de culto documentada; no acredita transferencia de propiedad.' }, `Relación ${row.key}`, sourceKeys)
      linkAll(sourceKeys, { brotherhood_image_id: relation })
    }
    // A brotherhood seat is not evidence that a secondary sculpture is stored there.
    if (row.place) {
      const location = generatedId('1200', row.key)
      add('entity_locations', { id: location, entity_id: ids[row.key], place_id: ids[row.place], municipality_id: M, location_type: 'Lugar de culto', is_current: true, status: 'published' }, `Lugar ${row.key}`, sourceKeys)
      linkAll(sourceKeys, { entity_location_id: location })
    }
    if (!row.id && row.authorship_type && row.author_name !== 'Pepe Romero') {
      const author = row.author_name ? authors.get(row.author_name) : null
      const authorship = generatedId('1400', row.key)
      add('image_authorships', { id: authorship, image_entity_id: ids[row.key], agent_entity_id: author ? ids[author.key] : null, authorship_type: row.authorship_type, certainty: row.authorship_type === 'author' ? 'documented' : row.authorship_type === 'anonymous' ? 'unknown' : 'attributed', role_name: 'autor', status: 'published', notes: row.key === 'I38' ? 'La atribución puede corresponder a una intervención posterior; véanse las dos fuentes.' : null }, `Autoría ${row.key}`, sourceKeys)
      linkAll(sourceKeys, { image_authorship_id: authorship })
    }
  }
  for (const row of steps) {
    const sourceKeys = refsFor(row), parent = hh.get(row.brotherhood)
    const name = `Paso de ${row.name.replace(/^Paso de /, '')} · ${parent?.name || 'Resucitado de Utrera'}`
    publishEntity(row, 'step', name, row.description, 'Utrera', [row.brotherhood || row.place, row.images], sourceKeys)
    const data = { entity_id: ids[row.key], step_type: row.step_type, description: row.description }
    if (row.key === 'S18') data.notes = 'El palio anunciado en 2016 y el llamador anunciado en junio de 2026 se conservan como proyectos sin terminación acreditada en las fuentes revisadas.'
    for (const col of ['style', 'materials', 'execution_date_text']) if (row[col] != null) data[col] = row[col]
    add('steps', data, `Perfil ${row.key}`, sourceKeys)
    if (row.brotherhood) {
      const old = local.brotherhood_steps.find((r) => r.brotherhood_entity_id === ids[row.brotherhood] && r.step_entity_id === ids[row.key])
      const relation = old?.id || generatedId('1500', row.key)
      add('brotherhood_steps', { id: relation, brotherhood_entity_id: ids[row.brotherhood], step_entity_id: ids[row.key], relation_type: old?.relation_type || 'processional_step', status: 'published', notes: row.key === 'S20' ? 'Mismo soporte en Viernes y Sábado Santo, con configuraciones diferentes.' : 'Soporte documentado; fecha y autoría no se heredan de la imagen.' }, `Relación ${row.key}`, sourceKeys)
      linkAll(sourceKeys, { brotherhood_step_id: relation })
    }
    for (const key of row.images) {
      const old = local.image_steps.find((r) => r.image_entity_id === ids[key] && r.step_entity_id === ids[row.key])
      const relation = old?.id || generatedId('1600', `${row.key}:${key}`)
      add('image_steps', { id: relation, image_entity_id: ids[key], step_entity_id: ids[row.key], relation_type: 'processes_on', status: 'published' }, `${key}/${row.key}`, sourceKeys)
      linkAll(sourceKeys, { image_step_id: relation })
    }
  }
  for (const row of bands) {
    if (row.id) continue
    const type = row.name.startsWith('AM ') ? 'Agrupación Musical' : row.name.startsWith('CCyTT ') ? 'Banda de Cornetas y Tambores' : 'Banda de Música'
    const name = row.name.replace(/^AM /, 'Agrupación Musical ').replace(/^CCyTT /, 'Banda de Cornetas y Tambores ').replace(/^BM /, 'Banda de Música ')
    const town = row.name.includes(' · ') ? row.name.split(' · ').at(-1) : row.name.replace(/^BM (Municipal )?/, '')
    const municipality = snapshot.municipalities.find((m) => slug(m.name) === slug(town))
    const text = `${name}, formación identificada en el programa de Semana Santa de Utrera de 2026. Su participación se documenta por Salida y posición, sin extenderla a otros años.`
    publishEntity(row, 'band', name, text, town, ['Semana Santa de Utrera 2026'], ['F01'])
    add('bands', { entity_id: ids[row.key], band_type: type, municipality_id: municipality?.id || null, description: text, headquarters_text: town }, row.key, ['F01'])
  }
  for (const row of assets) {
    publishEntity(row, 'heritage_asset', row.name, row.description, 'Utrera', [row.parent], refsFor(row))
    const data = { entity_id: ids[row.key], parent_entity_id: ids[row.parent], asset_type: row.asset_type, description: row.description, is_current: true }
    for (const col of ['materials', 'technique', 'date_from_text']) if (row[col]) data[col] = row[col]
    add('heritage_assets', data, row.key, refsFor(row))
  }
  const temporal = new Map()
  for (const decision of [...gloria.temporal_decisions, ...stepsReview.temporal_overrides]) for (const key of decision.outings) temporal.set(key, { event_status: decision.event_status, sources: decision.sources })
  for (const row of outings) {
    const state = temporal.get(row.key) || { event_status: row.event_status, sources: refsFor(row) }
    fail(['held', 'announced'].includes(state.event_status), `estado temporal ${row.key}`)
    const sourceKeys = unique([...refsFor(row), ...state.sources]), parent = hh.get(row.brotherhood)
    const place = Object.hasOwn(row, 'departure_place') ? row.departure_place : parent?.place
    const arrival = Object.hasOwn(row, 'return_place') ? row.return_place : place
    const type = ['O14', 'O15'].includes(row.key) ? 'Procesión eucarística' : ['O16', 'O17', 'O18'].includes(row.key) ? 'Romería' : row.key === 'O19' ? 'Procesión de Gloria' : row.key === 'O20' ? 'Vía Lucis' : 'Estación de penitencia'
    const text = `${row.name} en Utrera, ${row.date}. ${state.event_status === 'held' ? 'Celebración documentada por la fuente posterior enlazada.' : 'Convocatoria histórica conservada como anuncio.'}`
    add('outings', { id: ids[row.key], brotherhood_entity_id: row.brotherhood ? ids[row.brotherhood] : null, municipality_id: M, title: row.name, slug: slug(`${row.name} utrera ${row.date}`), outing_type: type, character: 'ordinary', outing_date: row.date, year: 2026, departure_time: row.departure_time || null, return_date: row.return_date || null, return_time: row.return_time || null, origin_place_id: place ? ids[place] : null, destination_place_id: arrival ? ids[arrival] : null, event_status: state.event_status, status: 'published', description: text, organizer_name: row.organizer_name || parent?.official_name || titles[parent?.key] || snapshot.brotherhoods.find((h) => h.entity_id === ids[row.brotherhood])?.official_name || parent?.name, route_summary: row.route_summary || null, public_notes: ({ O16: 'La crónica sitúa la partida aproximadamente a las 09:00. No acredita el regreso.', O17: 'Fecha de regreso anunciada; sin crónica posterior vinculada.', O18: 'Las fuentes consultadas difieren en la hora y el punto de partida; esos datos se conservan sin fijar.', O20: 'La crónica documenta el Vía Lucis y una llegada posterior a las 21:00, sin minuto exacto.' })[row.key] || 'Horarios e itinerario previstos en la convocatoria enlazada; no constituyen mediciones reales.' }, row.key, sourceKeys)
    linkAll(sourceKeys, { outing_id: ids[row.key] })
    for (const position of row.positions) {
      const step = stepMap.get(position.step_key), positionId = generatedId('1700', position.key)
      fail(step && (step.brotherhood || null) === (row.brotherhood || null), `posición ajena ${position.key}`)
      const silence = position.music === 'SILENCE'
      add('outing_music_positions', { id: positionId, outing_id: ids[row.key], step_entity_id: ids[position.step_key], position_code: 'processional_music', position_label: step.name, sequence_no: position.order, status: 'published', notes: silence ? 'Silencio documentado para esta posición.' : 'Acompañamiento documentado para esta Salida de 2026.' }, position.key, sourceKeys)
      linkAll(unique([...sourceKeys, position.music_source]), { outing_music_position_id: positionId })
      if (position.music && !silence) {
        const assignmentId = generatedId('1800', position.key)
        add('outing_music_assignments', { id: assignmentId, music_position_id: positionId, band_entity_id: ids[position.music], participation_mode: 'unspecified', sequence_no: 1, status: 'published', notes: row.key === 'O12' ? 'Conjunto vocal con acompañamiento instrumental documentado; no silencio ni segunda banda genérica.' : 'Identificación para esta Salida. No implica continuidad en 2027 ni certifica cada tramo interpretado.' }, `Música ${position.key}`, sourceKeys)
        linkAll(sourceKeys, { outing_music_assignment_id: assignmentId })
      }
      for (const key of [position.step_key, ...step.images]) {
        const relation = generatedId('1900', `${row.key}:${key}`)
        add('outing_entities', { id: relation, outing_id: ids[row.key], entity_id: ids[key], role: key.startsWith('S') ? 'processional_step' : 'processional_image' }, `${row.key}/${key}`, sourceKeys)
      }
    }
    for (const key of row.images || []) add('outing_entities', { id: generatedId('1900', `${row.key}:${key}`), outing_id: ids[row.key], entity_id: ids[key], role: 'processional_image' }, `${row.key}/${key}`, sourceKeys)
    const extraAssets = row.key === 'O14' ? ['A05'] : row.key === 'O15' ? ['A06'] : (row.heritage || [])
    // The Fátima cart is documented in 2022, not identified for 2026.
    for (const key of extraAssets.filter((key) => !(row.key === 'O18' && key === 'A03'))) add('outing_entities', { id: generatedId('1900', `${row.key}:${key}`), outing_id: ids[row.key], entity_id: ids[key], role: 'participant' }, `${row.key}/${key}`, sourceKeys)
  }
  const linkedSources = new Set(operations.filter((r) => r.table === 'source_links').map((r) => r.data.source_id))
  for (let i = operations.length - 1; i >= 0; i--) if (operations[i].table === 'sources' && !linkedSources.has(operations[i].id)) operations.splice(i, 1)
  operations.forEach((r, i) => { r.number = i + 1 })
  const manifest = {
    meta: { version: 2, date: '2026-09-27', namespace: 'c0160038', future_import_id: 'c0160038-0000-4000-8000-000000000001', municipality_id: M, main: '2d088746bd8c857e3daa27d0c0a12063edb8a2ab', snapshot_at: local.observed_at, status: 'PREPARED_NOT_EXECUTED', apply_gate: read('public-contract-audit.json').result === 'PASS' ? 'NOT_AUTHORIZED' : 'NO_GO_PUBLIC_CONTRACT', production_writes: 0, dry_run_executed: false, apply: false, universal_census_certified: false },
    non_public_keys: NON_PUBLIC_KEYS,
    counts: { corporations: corporations.length, images: images.length, steps: steps.length, heritage_assets: assets.length, bands: bands.length, outings: outings.length, positions: outings.reduce((n, o) => n + o.positions.length, 0), operations: operations.length, insert: operations.filter((r) => r.operation === 'insert').length, update: operations.filter((r) => r.operation === 'update').length, held: operations.filter((r) => r.table === 'outings' && r.data.event_status === 'held').length },
    identities, ids, source_ids: sourceIds, brotherhood_universe: corporations.map((row) => ids[row.key]), expected_types: Object.fromEntries(corporations.map((row) => [ids[row.key], row.brotherhood_types])), reused,
    protected: { outings: local.outings.map((r) => r.id), entities: ['8d4e62d9-a428-4363-afc7-6a2f9e8c1450', '46968f38-a4a1-43df-ad66-1436e19bb394', '2f9d80fc-0c4f-4346-95fd-109d31c29b23', '4c9e01e0-e671-41a5-a738-dd33fc15747a'], note: 'Morón, otros municipios, duplicados globales y salidas ya publicadas fuera del DML.' },
    public_contract_audit: read('public-contract-audit.json'),
    accepted_exceptions: [...closure.excluded_relationships, 'Pepe Romero: crédito textual en I36; no crear agente ni fusionar con homónimos sin identificación suficiente.', 'Autorías/componentes históricos de Pasos conservados en la matriz documental; no generar atribuciones integrales ni agentes de identidad incierta.', 'El alcance de edición no equivale a censo universal ni garantiza imágenes con derechos.'],
    candidate_editorial_minima: minima, operations,
  }
  validateUtreraManifest(manifest, columns)
  return manifest
}

export function validateUtreraManifest(manifest, columns) {
  const { ids, operations } = manifest
  const byTable = (table) => operations.filter((r) => r.table === table)
  fail(manifest.brotherhood_universe.length === 17 && new Set(manifest.brotherhood_universe).size === 17, 'universo corporativo')
  fail(new Set(operations.map((r) => `${r.table}:${r.id}`)).size === operations.length, 'operaciones duplicadas')
  fail(!operations.some((r) => r.operation === 'delete' || ['import_batches', 'import_rows'].includes(r.table)), 'escritura fuera de preparación')
  fail(!operations.some((r) => Object.keys(r.data).some((c) => ['updated_at', 'created_at'].includes(c))), 'timestamp manual')
  const allowedTypes = new Set(DIRECTORY_TYPES.map(({ type }) => type))
  for (const key of NON_PUBLIC_KEYS) fail(byTable('entities').find((r) => r.id === ids[key])?.data.status === 'review', `exclusión pública ${key}`)
  const entityIds = new Set(manifest.identities.filter((r) => !['place', 'outing'].includes(r.type)).map((r) => r.id))
  const targetIds = new Map()
  for (const r of [...manifest.reused, ...operations]) {
    if (!targetIds.has(r.table)) targetIds.set(r.table, new Set())
    targetIds.get(r.table).add(r.id)
  }
  for (const table of ['entities', 'places', 'outings']) {
    const slugs = byTable(table).map((r) => r.data.slug).filter(Boolean)
    fail(new Set(slugs).size === slugs.length, `slug duplicado en candidato: ${table}`)
  }
  for (const r of operations) {
    fail(r.data[r.pk] === r.id, `PK ${r.label}`)
    if (r.data.municipality_id && !['bands', 'agents'].includes(r.table)) fail(r.data.municipality_id === M, `municipio ajeno ${r.label}`)
    if (r.operation === 'update') fail(r.before && r.before[r.pk] === r.id && !['bands', 'agents'].includes(r.table), `UPDATE ajeno ${r.label}`)
    if (r.table === 'brotherhoods' && r.operation === 'insert') {
      const types = r.data.brotherhood_types
      fail(types?.length && types.every((t) => allowedTypes.has(t)) && new Set(types).size === types.length, `Hermandad sin tipos válidos ${r.label}`)
      fail(JSON.stringify(types) === JSON.stringify(manifest.expected_types[r.id]), `clasificación divergente ${r.label}`)
    }
    for (const [column, value] of Object.entries(r.data)) {
      if (!value) continue
      if ((column.endsWith('_entity_id') || column === 'entity_id') && r.table !== 'source_links') fail(entityIds.has(value), `entidad huérfana ${r.label}/${column}`)
      if (r.table === 'source_links' && column !== 'source_id' && column.endsWith('_id')) {
        const targetTable = { entity_id: 'entities', outing_id: 'outings', brotherhood_image_id: 'brotherhood_images', brotherhood_step_id: 'brotherhood_steps', image_step_id: 'image_steps', image_authorship_id: 'image_authorships', entity_location_id: 'entity_locations', outing_music_position_id: 'outing_music_positions', outing_music_assignment_id: 'outing_music_assignments' }[column]
        fail(targetTable && targetIds.get(targetTable)?.has(value), `fuente huérfana ${r.label}/${column}`)
      }
    }
    if (columns && r.operation === 'insert') for (const c of columns.get(r.table).values()) if (c.nullable === 'NO' && !c.default) fail(r.data[c.column] !== undefined && r.data[c.column] !== null, `NOT NULL ${r.table}.${c.column}`)
  }
  for (const table of ['entities', 'outings']) fail(!byTable(table).some((r) => manifest.protected[table].includes(r.id)), `registro protegido ${table}`)
  fail(!byTable('image_steps').some((r) => r.data.image_entity_id === ids.I35 || (r.data.image_entity_id === ids.I42 && r.data.step_entity_id === ids.S23)), 'imagen procesional indebidamente enlazada')
  fail(!byTable('outing_entities').some((r) => [ids.I35, ids.I45, ids.I42].includes(r.data.entity_id)), 'titular no acreditado en Salida')
  fail(byTable('outings').find((r) => r.id === ids.O20)?.data.brotherhood_entity_id === null, 'Resucitado: Hermandad inventada')
  fail(byTable('outings').find((r) => r.id === ids.O17)?.data.event_status === 'announced', 'regreso Rocío sin prueba')
  fail(byTable('outings').find((r) => r.id === ids.O18)?.data.departure_time === null, 'Fátima: conflicto de hora')
  fail(byTable('outing_entities').some((r) => r.data.outing_id === ids.O18 && r.data.entity_id === ids.I36), 'Fátima: falta vínculo con imagen')
  fail(ids.I13 === '4550fd96-94d3-4929-8d61-af79ba7de8e7' && ids.I32 === 'e875dbee-612f-4739-9f24-fd583d6b2df6', 'ID imagen canónica')
  fail(ids.S18 === 'b51dd99d-97fe-4636-b35e-59ac8fa92dc5', 'ID Paso Angustias')
  const s20Positions = byTable('outing_music_positions').filter((r) => r.data.step_entity_id === ids.S20)
  fail(s20Positions.length === 2 && new Set(s20Positions.map((r) => r.data.outing_id)).size === 2, 'Dolores: dos jornadas un soporte')
  fail(manifest.meta.production_writes === 0 && !manifest.meta.apply && !manifest.meta.dry_run_executed, 'certificación anticipada')
  return { status: 'PASS', counts: manifest.counts, offline_only: true, apply_gate: manifest.meta.apply_gate, public_contract_blockers: manifest.public_contract_audit.affected_candidates.map((r) => r.key), production_writes: 0, dry_run: 'PREPARED_NOT_EXECUTED', public_qa: 'NOT_EXECUTED', seo_qa: 'NOT_EXECUTED' }
}

export function renderUtreraDryRun(manifest) {
  const quote = (v) => `'${String(v).replaceAll("'", "''")}'`
    const tables = unique(manifest.operations.map((r) => r.table)).sort()
  const tablePks = tables.map((table) => ({ table, pk: manifest.operations.find((r) => r.table === table).pk }))
  const typed = (value) => `${quote(JSON.stringify(value))}::jsonb`
  return `-- PREPARED ONLY: refresh production/preflight before execution. No staging or Apply.
-- Manifest SHA256: ${hash(JSON.stringify(manifest))}
BEGIN;
${manifest.public_contract_audit.result === 'PASS' ? '-- Public contract gate PASS.' : "DO $public_gate$ BEGIN RAISE EXCEPTION 'UTRERA_PUBLIC_CONTRACT_NO_GO'; END $public_gate$;"}
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';
-- Serialize these tables for a consistent before/after safety comparison.
LOCK TABLE ${tables.map((t) => `public."${t}"`).join(', ')} IN SHARE ROW EXCLUSIVE MODE;
DO $utrera$
DECLARE
  ops jsonb := ${typed(manifest.operations)};
  tables jsonb := ${typed(tablePks)};
  op jsonb; tab jsonb; current_row jsonb; expected jsonb; columns_sql text;
  snapshot_before jsonb := '{}'::jsonb; snapshot_after jsonb := '{}'::jsonb;
  before_other jsonb; after_other jsonb; target_ids text[]; changed_columns text[];
  natural_filter text; affected integer;
BEGIN
  FOR tab IN SELECT value FROM jsonb_array_elements(tables) LOOP
    SELECT array_agg(value->>'id') INTO target_ids FROM jsonb_array_elements(ops) WHERE value->>'table'=tab->>'table';
    EXECUTE format('SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY %I), ''[]''::jsonb) FROM public.%I t WHERE NOT (%I::text = ANY($1))', tab->>'pk',tab->>'table',tab->>'pk') INTO before_other USING target_ids;
    snapshot_before := snapshot_before || jsonb_build_object(tab->>'table', before_other);
  END LOOP;
  FOR op IN SELECT value FROM jsonb_array_elements(ops) LOOP
    EXECUTE format('SELECT to_jsonb(t) FROM public.%I t WHERE %I::text=$1',op->>'table',op->>'pk') INTO current_row USING op->>'id';
    IF op->>'operation'='update' THEN
      SELECT array_agg(key) INTO changed_columns FROM jsonb_object_keys(op->'data') key WHERE key<>op->>'pk';
      IF current_row IS DISTINCT FROM op->'before' AND NOT (current_row @> (op->'data') AND (current_row - (changed_columns || ARRAY['updated_at'])) IS NOT DISTINCT FROM ((op->'before') - (changed_columns || ARRAY['updated_at']))) THEN RAISE EXCEPTION 'UTRERA_DRIFT: %',op->>'label'; END IF;
      IF current_row IS NULL THEN RAISE EXCEPTION 'UTRERA_MISSING_UPDATE: %',op->>'label'; END IF;
    ELSIF current_row IS NOT NULL THEN
      IF NOT (current_row @> (op->'data')) THEN RAISE EXCEPTION 'UTRERA_COLLISION: %',op->>'label'; END IF;
    END IF;
    IF jsonb_array_length(op->'natural_keys') > 0 THEN
      SELECT string_agg(format('t.%I IS NOT DISTINCT FROM r.%I', value, value), ' AND ') INTO natural_filter FROM jsonb_array_elements_text(op->'natural_keys');
      EXECUTE format('SELECT count(*) FROM public.%I t CROSS JOIN jsonb_populate_record(NULL::public.%I,$1) r WHERE %s AND t.%I::text<>$2',op->>'table',op->>'table',natural_filter,op->>'pk') INTO affected USING op->'data',op->>'id';
      IF affected<>0 THEN RAISE EXCEPTION 'UTRERA_NATURAL_DUPLICATE: %',op->>'label'; END IF;
    END IF;
    SELECT string_agg(format('%I',key),', ' ORDER BY key) INTO columns_sql FROM jsonb_object_keys(op->'data') key;
    IF op->>'operation'='insert' THEN
      EXECUTE format('INSERT INTO public.%I (%s) SELECT %s FROM jsonb_populate_record(NULL::public.%I,$1) ON CONFLICT (%I) DO NOTHING',op->>'table',columns_sql,columns_sql,op->>'table',op->>'pk') USING op->'data';
    ELSIF NOT (current_row @> (op->'data')) THEN
      SELECT array_agg(key) INTO changed_columns FROM jsonb_object_keys(op->'data') key WHERE key<>op->>'pk';
      SELECT string_agg(format('%1$I=r.%1$I',key),', ' ORDER BY key) INTO columns_sql FROM unnest(changed_columns) key;
      EXECUTE format('UPDATE public.%I t SET %s FROM jsonb_populate_record(NULL::public.%I,$1) r WHERE t.%I::text=$2',op->>'table',columns_sql,op->>'table',op->>'pk') USING op->'data',op->>'id';
      GET DIAGNOSTICS affected = ROW_COUNT;
      IF affected<>1 THEN RAISE EXCEPTION 'UTRERA_UPDATE_COUNT: %',op->>'label'; END IF;
      EXECUTE format('SELECT to_jsonb(t) FROM public.%I t WHERE %I::text=$1',op->>'table',op->>'pk') INTO expected USING op->>'id';
      IF (expected - (changed_columns || ARRAY['updated_at'])) IS DISTINCT FROM (current_row - (changed_columns || ARRAY['updated_at'])) THEN RAISE EXCEPTION 'UTRERA_OTHER_COLUMN: %',op->>'label'; END IF;
    END IF;
    EXECUTE format('SELECT to_jsonb(t) FROM public.%I t WHERE %I::text=$1',op->>'table',op->>'pk') INTO expected USING op->>'id';
    IF expected IS NULL OR NOT (expected @> (op->'data')) THEN RAISE EXCEPTION 'UTRERA_POSTCONDITION: %',op->>'label'; END IF;
  END LOOP;
  FOR tab IN SELECT value FROM jsonb_array_elements(tables) LOOP
    SELECT array_agg(value->>'id') INTO target_ids FROM jsonb_array_elements(ops) WHERE value->>'table'=tab->>'table';
    EXECUTE format('SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY %I), ''[]''::jsonb) FROM public.%I t WHERE NOT (%I::text = ANY($1))',tab->>'pk',tab->>'table',tab->>'pk') INTO after_other USING target_ids;
    snapshot_after := snapshot_after || jsonb_build_object(tab->>'table',after_other);
  END LOOP;
  IF snapshot_before IS DISTINCT FROM snapshot_after THEN RAISE EXCEPTION 'UTRERA_OUTSIDE_SCOPE'; END IF;
  RAISE NOTICE 'UTRERA_QA: % operations passed; outside-scope rows unchanged',jsonb_array_length(ops);
END
$utrera$;
${buildBrotherhoodTypesGuard(manifest.brotherhood_universe)}
SET CONSTRAINTS ALL IMMEDIATE;
DO $utrera_counts$
DECLARE
  groups jsonb := ${typed(tablePks.map(({table,pk}) => ({table,pk,ids:manifest.operations.filter(op=>op.table===table).map(op=>op.id)})))};
  reuses jsonb := ${typed(manifest.reused)};
  entry jsonb; actual integer;
BEGIN
  FOR entry IN SELECT value FROM jsonb_array_elements(groups) LOOP
    EXECUTE format('SELECT count(*) FROM public.%I WHERE %I::text IN (SELECT jsonb_array_elements_text($1))',entry->>'table',entry->>'pk') INTO actual USING entry->'ids';
    IF actual <> jsonb_array_length(entry->'ids') THEN RAISE EXCEPTION 'UTRERA_TARGET_COUNT: %',entry->>'table'; END IF;
  END LOOP;
  FOR entry IN SELECT value FROM jsonb_array_elements(reuses) LOOP
    EXECUTE format('SELECT count(*) FROM public.%I WHERE %I::text=$1',entry->>'table',entry->>'pk') INTO actual USING entry->>'id';
    IF actual <> 1 THEN RAISE EXCEPTION 'UTRERA_REUSE_MISSING: %',entry->>'id'; END IF;
  END LOOP;
  IF (SELECT count(*) FROM public.entities WHERE id = ANY(ARRAY[${manifest.non_public_keys.map(key=>quote(manifest.ids[key])).join(',')}]::uuid[]) AND status='review') <> 4 THEN
    RAISE EXCEPTION 'UTRERA_NON_PUBLIC_DECISIONS';
  END IF;
END
$utrera_counts$;
ROLLBACK;
SELECT 'UTRERA_DRY_RUN_PASS_ROLLED_BACK' AS result, ${manifest.counts.operations} AS checked_operations, ${manifest.counts.insert} AS insert_operations, ${manifest.counts.update} AS update_operations, 0 AS delete_operations, ${manifest.reused.length} AS checked_reuse;

-- This rollback is not proof of zero residues: run and compare rollback-snapshot.sql
-- before and after this file in the execution session. This file has no COMMIT.
`
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const manifest = buildUtreraManifest()
  const certificate = existsSync(new URL('execution-certificate.json', folder)) ? read('execution-certificate.json') : null
  const certified = certificate?.gate === 'GO_FOR_STAGING_ONLY'
    && certificate.sql_sha256 === hash(renderUtreraDryRun(manifest))
    && certificate.manifest_sha256 === hash(JSON.stringify(manifest, null, 2) + '\n')
  const write = (name, data) => writeFileSync(new URL(name, folder), typeof data === 'string' ? data : `${JSON.stringify(data, null, 2)}\n`)
  write('manifest.json', manifest)
  write('manifest-validation.json', { ...validateUtreraManifest(manifest), ...(certified ? { dry_run: 'PASS_ROLLED_BACK', residues: 0, staging_gate: 'GO_FOR_STAGING_ONLY', execution_certificate: 'execution-certificate.json' } : {}) })
  write('brotherhood-universe.json', manifest.brotherhood_universe)
  write('prepared-dry-run.sql', renderUtreraDryRun(manifest))
  const tables = unique(manifest.operations.map((r) => r.table)).sort()
  write('rollback-snapshot.sql', `-- SELECT only. Save complete results immediately before and after the dry-run.\nSELECT jsonb_build_object(\n${tables.map((table) => {
    const pk = manifest.operations.find((r) => r.table === table).pk
    return `  '${table}', (SELECT jsonb_build_object('count',count(*),'md5',md5(coalesce(jsonb_agg(to_jsonb(t) ORDER BY ${pk})::text,'[]'))) FROM public.${table} t)`
  }).join(',\n')}\n) AS rollback_snapshot;\n`)
  const report = ['# Utrera · manifiesto determinista HC-016', '', (certified ? '**Dry-run ejecutado y certificado; rollback PASS, 0 residuos.**' : '**Preparado, sin ejecutar.**') + ' Corte 27/09/2026. Main `'+manifest.meta.main+'`.', '', 'La congelación se limita a la edición documentada. No certifica censo universal, carga, publicación ni QA web/SEO.', '', (certified ? '**GO PARA STAGING, sin crearlo.** Véase `UTRERA-GO-STAGING-2026-09-27.md`. ' : '**Staging: pendiente de puerta final.** ') + 'I44, I45, S25 y H17 se conservan en review, fuera de publicación. La corrección transversal #1014 está integrada; consultar el certificado de ejecución para el resultado vigente de auditoría, preflight y dry-run. Véase `evidence/modelado-utrera-2026-09-27/public-contract-audit.json`. No confundir mínimos genéricos del candidato con indexabilidad real.', '', '## Conteo', '', '| Concepto | Total |', '|---|---:|', ...Object.entries(manifest.counts).map(([k,v])=>`| ${k} | ${v} |`), '', '## Identidades por UUID', '', '| Clave | Acción | Tipo | Nombre | UUID |', '|---|---|---|---|---|', ...manifest.identities.map((r)=>`| ${r.key} | ${r.decision} | ${r.type} | ${r.name} | \`${r.id}\` |`), '', '## Operaciones fila por fila', '', 'El payload completo y el estado previo de cada UPDATE están en `evidence/modelado-utrera-2026-09-27/manifest.json`.', '', '| # | Tabla | Operación | Referencia | UUID |', '|---:|---|---|---|---|', ...manifest.operations.map((r)=>`| ${r.number} | ${r.table} | ${r.operation} | ${r.label} | \`${r.id}\` |`), '', '## Puerta de ejecución', '', '1. Refrescar main, PR, producción y salud de Supabase; resolver cualquier deriva de identidad o datos.', '2. Registrar resultado completo de `rollback-snapshot.sql` y ejecutar `prepared-dry-run.sql` en una sola sesión transaccional.', '3. Consultar de nuevo el snapshot: igualdad exacta y cero residuos. Un error o diferencia impide Apply.', '4. Tras dry-run verde solo procede emitir GO/NO-GO para staging y detenerse. Esta orden no autoriza staging ni Apply.', '', 'El guard de tipos contiene las 17 corporaciones, incluidas las tres reutilizadas. Las cuatro Salidas existentes, Consolación y Morón permanecen protegidos. No se toca ningún duplicado global.', '']
  writeFileSync(new URL('../docs/MANIFIESTO-DETERMINISTA-UTRERA-HC016-2026-09-27.md', import.meta.url), report.join('\n'))
  process.stdout.write(`${JSON.stringify(manifest.counts)}\n`)
}

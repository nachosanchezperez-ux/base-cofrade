import { normalizeSourceUrl } from '../sources/source-url.js'

const TABLES = [
  'accompaniments', 'advocations', 'agent_disciplines', 'agent_names', 'agent_roles', 'agents',
  'band_agents', 'band_colors', 'band_names', 'band_premieres', 'band_release_sources',
  'band_release_tracks', 'band_releases', 'bands', 'brotherhood_colors', 'brotherhood_habits',
  'brotherhood_images', 'brotherhood_procession_stats', 'brotherhood_section_authority',
  'brotherhood_steps', 'brotherhoods', 'cult_entities', 'cult_occurrence_days', 'cult_occurrences',
  'cults', 'editorial_content', 'editorial_content_links', 'entities', 'entity_locations',
  'entity_media', 'entity_relations', 'entity_social_links', 'events', 'heritage_assets',
  'heritage_interventions', 'heritage_update_agents', 'heritage_updates', 'image_authorships',
  'image_names', 'image_steps', 'images', 'march_authors', 'march_dedications', 'march_recordings',
  'marches', 'media_assets', 'municipalities', 'music_accompaniment_periods', 'outing_entities',
  'outing_media', 'outing_music_assignments', 'outing_music_positions', 'outing_route_points',
  'outing_schedule_items', 'outing_series', 'outing_series_movements', 'outings', 'places',
  'source_links', 'sources', 'step_personnel_periods', 'step_phase_agents', 'step_phases', 'steps',
]

export const IMPORTABLE_TABLES = Object.freeze(TABLES)
export const IMPORT_OPERATIONS = Object.freeze(['insert', 'upsert'])

const TABLE_SET = new Set(IMPORTABLE_TABLES)
const OPERATION_SET = new Set(IMPORT_OPERATIONS)
const WRITE_POLICY_BLOCKED_TABLES = new Set([
  'accompaniments',
  'agent_disciplines',
  'agent_names',
  'entity_locations',
  'image_names',
  'march_dedications',
  'march_recordings',
  'step_personnel_periods',
  'step_phase_agents',
  'step_phases',
])
const UPSERT_CONFLICT_TARGETS = new Map([
  ['accompaniments', ['id']],
  ['advocations', ['entity_id']],
  ['agent_disciplines', ['id', 'agent_entity_id,discipline']],
  ['agent_names', ['id', 'agent_entity_id,name,date_from']],
  ['agent_roles', ['id', 'agent_entity_id,role_name,date_from']],
  ['agents', ['entity_id']],
  ['band_agents', ['id', 'band_entity_id,agent_entity_id,role_name,date_from']],
  ['band_colors', ['id', 'band_entity_id,color_name']],
  ['band_names', ['id', 'band_entity_id,name,date_from']],
  ['band_premieres', ['id', 'band_entity_id,title,premiere_year']],
  ['band_release_sources', ['release_id,source_id']],
  ['band_release_tracks', ['id', 'release_id,sequence_no']],
  ['band_releases', ['id', 'band_entity_id,title,release_year']],
  ['bands', ['entity_id']],
  ['brotherhood_colors', ['id', 'brotherhood_entity_id,color_name']],
  ['brotherhood_habits', ['id', 'brotherhood_entity_id,name']],
  ['brotherhood_images', ['id', 'brotherhood_entity_id,image_entity_id,relation_type,date_from']],
  ['brotherhood_procession_stats', ['id', 'brotherhood_entity_id,year']],
  ['brotherhood_section_authority', ['brotherhood_entity_id,section_key']],
  ['brotherhood_steps', ['id', 'brotherhood_entity_id,step_entity_id,relation_type,date_from']],
  ['brotherhoods', ['entity_id']],
  ['cult_entities', ['id', 'cult_id,entity_id,role']],
  ['cult_occurrence_days', ['id']],
  ['cult_occurrences', ['id', 'cult_id,year,start_date']],
  ['cults', ['id']],
  ['editorial_content', ['id']],
  ['editorial_content_links', ['id', 'editorial_content_id,entity_id,relation_type']],
  ['entities', ['id', 'slug']],
  ['entity_locations', ['id']],
  ['entity_media', ['id', 'entity_id,media_asset_id,relation_type']],
  ['entity_relations', ['id']],
  ['entity_social_links', ['id', 'entity_id,platform']],
  ['events', ['entity_id']],
  ['heritage_assets', ['entity_id']],
  ['heritage_interventions', ['id']],
  ['heritage_update_agents', ['id', 'heritage_update_id,agent_entity_id,role_name']],
  ['heritage_updates', ['id']],
  ['image_authorships', ['id', 'image_entity_id,agent_entity_id,authorship_type,role_name']],
  ['image_names', ['id', 'image_entity_id,name,date_from']],
  ['image_steps', ['id', 'image_entity_id,step_entity_id,relation_type,date_from']],
  ['images', ['entity_id']],
  ['march_authors', ['id', 'march_entity_id,agent_entity_id,author_role']],
  ['march_dedications', ['id', 'march_entity_id,dedicatee_entity_id,dedication_type']],
  ['march_recordings', ['id']],
  ['marches', ['entity_id']],
  ['media_assets', ['id', 'storage_path']],
  ['municipalities', ['id', 'slug']],
  ['music_accompaniment_periods', ['id']],
  ['outing_entities', ['id', 'outing_id,entity_id,role']],
  ['outing_media', ['id', 'outing_id,media_asset_id,role']],
  ['outing_music_assignments', ['id', 'music_position_id,band_entity_id,sequence_no']],
  ['outing_music_positions', ['id', 'outing_id,sequence_no']],
  ['outing_route_points', ['id', 'outing_id,sequence_no']],
  ['outing_schedule_items', ['id', 'outing_id,sequence_no']],
  ['outing_series', ['id']],
  ['outing_series_movements', ['id', 'outing_series_id,sequence_no']],
  ['outings', ['id']],
  ['places', ['id', 'slug']],
  ['source_links', ['id']],
  ['sources', ['id']],
  ['step_personnel_periods', ['id']],
  ['step_phase_agents', ['id', 'step_phase_id,agent_entity_id,discipline,element_entity_id']],
  ['step_phases', ['id']],
  ['steps', ['entity_id']],
].map(([table, targets]) => [table, new Set(targets.map((target) => target.split(',').sort().join(',')))]))

function supportsConflictTarget(table, target) {
  const normalized = String(target || '').split(',').filter(Boolean).sort().join(',')
  return Boolean(normalized && UPSERT_CONFLICT_TARGETS.get(table)?.has(normalized))
}

const IDENTIFIER = /^[a-z][a-z0-9_]*$/
const CONFLICT_TARGET = /^[a-z][a-z0-9_]*(?:,[a-z][a-z0-9_]*)*$/
const REF_COLUMNS = new Set(['id', 'entity_id'])

const TABLE_CONTRACTS = Object.freeze({
  entities: {
    columns: ['id', 'entity_type', 'name', 'slug', 'summary', 'status', 'created_at', 'updated_at'],
    requiredOnInsert: ['entity_type', 'name'],
  },
  brotherhoods: {
    columns: [
      'entity_id', 'official_name', 'popular_name', 'foundation_text', 'municipality_id',
      'canonical_see_place_id', 'neighborhood', 'website_url', 'instagram_url', 'crest_path',
      'brotherhood_types', 'current_procession_day', 'notes', 'history_text',
    ],
    requiredOnInsert: ['entity_id', 'official_name', 'popular_name'],
  },
  bands: {
    columns: [
      'entity_id', 'band_type', 'municipality_id', 'foundation_text', 'website_url', 'instagram_url',
      'description', 'primary_color', 'secondary_color', 'logo_path', 'hero_image_path',
      'hero_image_alt', 'hero_image_credit', 'linked_brotherhood_name', 'headquarters_text',
      'youtube_url', 'banderin_entity_id', 'logo_background_color',
    ],
    requiredOnInsert: ['entity_id'],
  },
  sources: {
    columns: [
      'id', 'name', 'url', 'source_type', 'author_or_publisher', 'publication_date', 'accessed_at',
      'license', 'notes', 'created_at',
    ],
    requiredOnInsert: ['name', 'source_type'],
  },
})

export function bulkImportTableContract(tableName) {
  return TABLE_CONTRACTS[tableName] || null
}

const PRIORITIES = new Map([
  ['municipalities', 10],
  ['sources', 10],
  ['places', 20],
  ['entities', 30],
  ['advocations', 40],
  ['agents', 40],
  ['bands', 40],
  ['brotherhoods', 40],
  ['images', 40],
  ['marches', 40],
  ['steps', 40],
  ['events', 50],
  ['cults', 50],
  ['outings', 50],
  ['outing_series', 50],
])

export function bulkImportPriority(tableName) {
  return PRIORITIES.get(tableName) ?? 100
}

function isObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function isScalar(value) {
  return value == null || ['string', 'number', 'boolean'].includes(typeof value)
}

function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object || {}, key)
}

function validateIdentifiers(object, prefix, errors) {
  for (const key of Object.keys(object || {})) {
    if (!IDENTIFIER.test(key)) errors.push(`${prefix}: «${key}» no es un nombre de campo válido.`)
  }
}

function canonicalizeSourceUrl(value) {
  if (typeof value !== 'string') return value
  try {
    return normalizeSourceUrl(value)
  } catch {
    return value.trim()
  }
}

function normalizeRefs(input) {
  if (!isObject(input)) return input == null ? {} : input
  const refs = {}
  for (const [targetColumn, ref] of Object.entries(input)) {
    if (!isObject(ref)) {
      refs[targetColumn] = ref
      continue
    }
    const match = isObject(ref.match) ? { ...ref.match } : ref.match
    if (ref.table === 'sources' && isObject(match) && typeof match.url === 'string') {
      match.url = canonicalizeSourceUrl(match.url)
    }
    refs[targetColumn] = { ...ref, match }
  }
  return refs
}

export function normalizeBulkImportRecord(input) {
  if (!isObject(input)) return input
  const table = String(input.table || '').trim()
  const data = isObject(input.data) ? { ...input.data } : input.data
  if (table === 'bands' && typeof data?.logo_background_color === 'string') {
    data.logo_background_color = data.logo_background_color.trim().toUpperCase() || null
  }
  if (table === 'sources' && typeof data?.url === 'string') data.url = canonicalizeSourceUrl(data.url)
  return {
    table,
    operation: String(input.operation || 'insert').trim().toLowerCase(),
    on_conflict: input.on_conflict == null && input.onConflict == null
      ? null
      : String(input.on_conflict ?? input.onConflict).replace(/\s+/g, ''),
    data,
    refs: normalizeRefs(input.refs),
  }
}

export function validateBulkImportTableContract(record, effectiveOperation = null) {
  const errors = []
  if (!isObject(record) || !TABLE_SET.has(record.table)) return errors

  const contract = bulkImportTableContract(record.table)
  if (!contract) return errors
  const allowed = new Set(contract.columns)

  for (const key of Object.keys(record.data || {})) {
    if (!allowed.has(key)) errors.push(`INVALID_COLUMN: ${record.table}.${key} no existe en el contrato importable.`)
  }
  for (const key of Object.keys(record.refs || {})) {
    if (!allowed.has(key)) errors.push(`INVALID_COLUMN: ${record.table}.${key} no existe en el contrato importable.`)
  }
  if (record.on_conflict) {
    for (const key of record.on_conflict.split(',').filter(Boolean)) {
      if (!allowed.has(key)) errors.push(`INVALID_COLUMN: ${record.table}.${key} no puede usarse como clave de conflicto.`)
    }
  }

  if (effectiveOperation === 'insert') {
    for (const key of contract.requiredOnInsert || []) {
      const inData = hasOwn(record.data, key) && record.data[key] != null
      const inRefs = Boolean(record.refs?.[key])
      if (!inData && !inRefs) errors.push(`MISSING_REQUIRED_FIELD: ${record.table}.${key} es obligatorio para INSERT.`)
    }
  }

  return errors
}

export function validateBulkImportRecord(input) {
  const record = normalizeBulkImportRecord(input)
  const errors = []

  if (!isObject(record)) return { record, errors: ['El registro debe ser un objeto JSON.'] }
  if (!TABLE_SET.has(record.table)) errors.push(`La tabla «${record.table || 'sin tabla'}» no está habilitada para importación.`)
  if (TABLE_SET.has(record.table) && WRITE_POLICY_BLOCKED_TABLES.has(record.table)) {
    errors.push(`WRITE_POLICY_BLOCKED: ${record.table} no dispone actualmente de una política de escritura para el rol del Panel.`)
  }
  if (!OPERATION_SET.has(record.operation)) errors.push(`La operación «${record.operation || 'sin operación'}» no está permitida.`)
  if (!isObject(record.data) || Object.keys(record.data).length === 0) errors.push('data debe contener al menos un campo.')
  if (isObject(record.data)) validateIdentifiers(record.data, 'data', errors)
  const staticOperation = record.operation === 'insert' && record.table !== 'sources' ? 'insert' : null
  errors.push(...validateBulkImportTableContract(record, staticOperation))

  if (record.table === 'sources' && hasOwn(record.data, 'url') && record.data.url !== null) {
    try {
      normalizeSourceUrl(record.data.url)
    } catch (error) {
      errors.push(error instanceof Error ? error.message : 'La URL de la Fuente no es válida.')
    }
  }

  if (
    record.table === 'bands'
    && hasOwn(record.data, 'logo_background_color')
    && record.data.logo_background_color !== null
    && !/^#[0-9A-F]{6}$/.test(record.data.logo_background_color)
  ) {
    errors.push('bands.logo_background_color debe ser NULL o un color HEX #RRGGBB.')
  }

  if (record.operation === 'upsert') {
    if (record.on_conflict && !CONFLICT_TARGET.test(record.on_conflict)) errors.push('on_conflict contiene un identificador no válido.')
    if (record.on_conflict && CONFLICT_TARGET.test(record.on_conflict) && !supportsConflictTarget(record.table, record.on_conflict)) {
      errors.push(`INVALID_CONFLICT_TARGET: ${record.table}(${record.on_conflict}) no coincide con una clave primaria o restricción única disponible.`)
    }
    const hasPrimaryKey = Boolean(record.data?.id != null || record.data?.entity_id != null || record.refs?.id || record.refs?.entity_id)
    if (!record.on_conflict && !hasPrimaryKey) errors.push('Un upsert necesita on_conflict o una clave primaria id/entity_id.')
    const conflicts = new Set(String(record.on_conflict || '').split(',').filter(Boolean))
    if (record.data?.id != null && record.on_conflict && !conflicts.has('id')) {
      errors.push('No se puede enviar id en un upsert cuya clave de conflicto no incluye id; podría cambiar el UUID de una fila existente.')
    }
  }

  if (!isObject(record.refs)) {
    errors.push('refs debe ser un objeto cuando se utiliza.')
  } else {
    validateIdentifiers(record.refs, 'refs', errors)
    for (const [targetColumn, ref] of Object.entries(record.refs)) {
      if (!isObject(ref)) {
        errors.push(`refs.${targetColumn} debe ser un objeto.`)
        continue
      }
      if (!TABLE_SET.has(ref.table)) errors.push(`refs.${targetColumn}: la tabla «${ref.table || 'sin tabla'}» no está habilitada.`)
      if (!isObject(ref.match) || Object.keys(ref.match).length === 0) {
        errors.push(`refs.${targetColumn}.match debe contener al menos un criterio.`)
      } else {
        if (Object.keys(ref.match).length > 5) errors.push(`refs.${targetColumn}.match admite como máximo cinco criterios.`)
        validateIdentifiers(ref.match, `refs.${targetColumn}.match`, errors)
        for (const [matchColumn, matchValue] of Object.entries(ref.match)) {
          if (!isScalar(matchValue)) errors.push(`refs.${targetColumn}.match.${matchColumn} debe ser un valor simple.`)
        }
        if (ref.table === 'sources' && typeof ref.match.url === 'string') {
          try {
            normalizeSourceUrl(ref.match.url)
          } catch (error) {
            errors.push(error instanceof Error ? error.message : `refs.${targetColumn}.match.url no es válida.`)
          }
        }
      }
      const column = ref.column || 'id'
      if (!REF_COLUMNS.has(column)) errors.push(`refs.${targetColumn}.column solo puede ser id o entity_id.`)
    }
  }

  try {
    if (JSON.stringify(record).length > 500_000) errors.push('El registro supera el tamaño máximo de 500 KB.')
  } catch {
    errors.push('El registro no se puede serializar como JSON.')
  }

  return { record, errors }
}

function conflictColumns(record) {
  if (record.operation !== 'upsert') return []
  if (record.on_conflict) return [...new Set(record.on_conflict.split(',').filter(Boolean))].sort()
  if (hasOwn(record.data, 'id') || record.refs?.id) return ['id']
  if (hasOwn(record.data, 'entity_id') || record.refs?.entity_id) return ['entity_id']
  return []
}

export function bulkImportConflictColumns(record) {
  return conflictColumns(record)
}

function targetValueDescriptor(record, column) {
  if (hasOwn(record.data, column)) {
    const value = record.data[column]
    if (!isScalar(value)) return null
    return { source: 'data', value }
  }

  const ref = record.refs?.[column]
  if (!isObject(ref) || !TABLE_SET.has(ref.table) || !isObject(ref.match)) return null
  const match = Object.entries(ref.match).sort(([left], [right]) => left.localeCompare(right))
  if (!match.length || match.some(([, value]) => !isScalar(value))) return null
  return {
    source: 'ref',
    table: ref.table,
    column: ref.column || 'id',
    match,
  }
}

function describeTargetColumn(column, descriptor) {
  if (descriptor.source === 'data') return `${column}=${String(descriptor.value)}`
  const match = descriptor.match.map(([key, value]) => `${key}=${String(value)}`).join(', ')
  return `${column}→${descriptor.table}(${match})`
}

function targetIdentity(input) {
  const record = normalizeBulkImportRecord(input)
  if (!isObject(record) || record.operation !== 'upsert' || !TABLE_SET.has(record.table)) return null
  const columns = conflictColumns(record)
  if (!columns.length) return null

  const descriptors = columns.map((column) => [column, targetValueDescriptor(record, column)])
  if (descriptors.some(([, descriptor]) => !descriptor)) return null

  return {
    signature: JSON.stringify([record.table, descriptors]),
    table: record.table,
    target: descriptors.map(([column, descriptor]) => describeTargetColumn(column, descriptor)).join(' · ').slice(0, 280),
  }
}

export function findBulkImportTargetCollisions(inputs = []) {
  const seen = new Map()

  inputs.forEach((input, index) => {
    const validation = isObject(input) && Array.isArray(input.errors) && hasOwn(input, 'record')
      ? input
      : validateBulkImportRecord(input)
    if (validation.errors.length) return

    const identity = targetIdentity(validation.record)
    if (!identity) return

    const existing = seen.get(identity.signature) || { ...identity, positions: [] }
    existing.positions.push(index + 1)
    seen.set(identity.signature, existing)
  })

  return [...seen.values()].filter((item) => item.positions.length > 1)
}

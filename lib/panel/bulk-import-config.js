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
const IDENTIFIER = /^[a-z][a-z0-9_]*$/
const CONFLICT_TARGET = /^[a-z][a-z0-9_]*(?:,[a-z][a-z0-9_]*)*$/
const REF_COLUMNS = new Set(['id', 'entity_id'])

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

export function normalizeBulkImportRecord(input) {
  if (!isObject(input)) return input
  const table = String(input.table || '').trim()
  const data = isObject(input.data) ? { ...input.data } : input.data
  if (table === 'bands' && typeof data?.logo_background_color === 'string') {
    data.logo_background_color = data.logo_background_color.trim().toUpperCase() || null
  }
  return {
    table,
    operation: String(input.operation || 'insert').trim().toLowerCase(),
    on_conflict: input.on_conflict == null && input.onConflict == null
      ? null
      : String(input.on_conflict ?? input.onConflict).replace(/\s+/g, ''),
    data,
    refs: isObject(input.refs) ? input.refs : (input.refs == null ? {} : input.refs),
  }
}

export function validateBulkImportRecord(input) {
  const record = normalizeBulkImportRecord(input)
  const errors = []

  if (!isObject(record)) return { record, errors: ['El registro debe ser un objeto JSON.'] }
  if (!TABLE_SET.has(record.table)) errors.push(`La tabla «${record.table || 'sin tabla'}» no está habilitada para importación.`)
  if (!OPERATION_SET.has(record.operation)) errors.push(`La operación «${record.operation || 'sin operación'}» no está permitida.`)
  if (!isObject(record.data) || Object.keys(record.data).length === 0) errors.push('data debe contener al menos un campo.')
  if (isObject(record.data)) validateIdentifiers(record.data, 'data', errors)
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

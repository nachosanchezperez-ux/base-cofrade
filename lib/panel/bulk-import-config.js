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

function validateIdentifiers(object, prefix, errors) {
  for (const key of Object.keys(object || {})) {
    if (!IDENTIFIER.test(key)) errors.push(`${prefix}: «${key}» no es un nombre de campo válido.`)
  }
}

export function normalizeBulkImportRecord(input) {
  if (!isObject(input)) return input
  return {
    table: String(input.table || '').trim(),
    operation: String(input.operation || 'insert').trim().toLowerCase(),
    on_conflict: input.on_conflict == null && input.onConflict == null
      ? null
      : String(input.on_conflict ?? input.onConflict).replace(/\s+/g, ''),
    data: isObject(input.data) ? input.data : input.data,
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

  if (record.operation === 'upsert' && record.on_conflict && !CONFLICT_TARGET.test(record.on_conflict)) {
    errors.push('on_conflict contiene un identificador no válido.')
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

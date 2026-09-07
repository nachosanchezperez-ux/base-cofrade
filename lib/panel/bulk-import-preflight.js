import {
  bulkImportConflictColumns,
  bulkImportPriority,
  findBulkImportTargetCollisions,
  validateBulkImportRecord,
  validateBulkImportTableContract,
} from './bulk-import-config.js'
import { sourceUrlVariants } from '../sources/source-url.js'

function errorMessage(error, fallback) {
  return error instanceof Error ? error.message : fallback
}

function plannedMatches(record, ref) {
  if (record?.table !== ref.table || !record.data) return false
  return Object.entries(ref.match).every(([column, expected]) => {
    if (ref.table === 'sources' && column === 'url') {
      return sourceUrlVariants(record.data.url).includes(expected)
        || sourceUrlVariants(expected).includes(record.data.url)
    }
    return record.data[column] === expected
  })
}

async function queryReference(supabase, targetColumn, ref) {
  const selectedColumn = ref.column || 'id'
  const sourceUrlMatch = ref.table === 'sources' && typeof ref.match?.url === 'string'
  let query = supabase.from(ref.table).select(selectedColumn)

  for (const [column, expected] of Object.entries(ref.match)) {
    if (sourceUrlMatch && column === 'url') {
      const variants = sourceUrlVariants(expected)
      query = variants.length ? query.in('url', variants) : query.eq('url', expected)
    } else {
      query = expected === null ? query.is(column, null) : query.eq(column, expected)
    }
  }

  if (sourceUrlMatch) query = query.order('created_at', { ascending: true }).limit(1)
  else query = query.limit(2)

  const result = await query
  if (result.error) throw new Error(`UNRESOLVED_REFERENCE: no se pudo resolver ${targetColumn}: ${result.error.message}`)
  if (!result.data?.length) return null
  if (!sourceUrlMatch && result.data.length > 1) {
    throw new Error(`AMBIGUOUS_REFERENCE: la referencia ${targetColumn} no es unívoca en ${ref.table}.`)
  }

  const value = result.data[0]?.[selectedColumn]
  if (value == null) throw new Error(`UNRESOLVED_REFERENCE: la referencia ${targetColumn} no contiene ${selectedColumn}.`)
  return {
    value,
    detail: { target_column: targetColumn, table: ref.table, column: selectedColumn, state: 'resolved', value },
  }
}

async function resolveReference(supabase, targetColumn, ref, context) {
  const resolved = await queryReference(supabase, targetColumn, ref)
  if (resolved) return resolved

  const candidates = []
  for (let index = 0; index < context.records.length; index += 1) {
    if (index === context.currentIndex) continue
    if (!plannedMatches(context.records[index], ref)) continue
    const plan = context.plans[index]
    if (plan?.status !== 'valid' || plan.errors?.length) continue
    candidates.push({ index, record: context.records[index], plan })
  }

  if (candidates.length > 1) {
    throw new Error(`AMBIGUOUS_REFERENCE: la referencia ${targetColumn} coincide con varios registros del propio lote.`)
  }
  if (!candidates.length) {
    throw new Error(`UNRESOLVED_REFERENCE: no se pudo resolver ${targetColumn} en ${ref.table}.`)
  }

  const candidate = candidates[0]
  const selectedColumn = ref.column || 'id'
  const value = candidate.plan?.providedValues?.[selectedColumn] ?? candidate.record.data?.[selectedColumn] ?? null
  return {
    value,
    detail: {
      target_column: targetColumn,
      table: ref.table,
      column: selectedColumn,
      state: 'planned',
      provider_position: candidate.index + 1,
      value,
    },
  }
}

async function materializePayload(supabase, record, context) {
  const payload = { ...record.data }
  const resolvedReferences = []
  const plannedRefs = {}

  for (const [targetColumn, ref] of Object.entries(record.refs || {})) {
    const resolution = await resolveReference(supabase, targetColumn, ref, context)
    resolvedReferences.push(resolution.detail)
    if (resolution.value == null) plannedRefs[targetColumn] = ref
    else payload[targetColumn] = resolution.value
  }

  return { payload, resolvedReferences, plannedRefs }
}

async function findReusableSource(supabase, url) {
  const variants = sourceUrlVariants(url)
  if (!variants.length) return null

  const result = await supabase
    .from('sources')
    .select('id, url, created_at')
    .in('url', variants)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (result.error) throw new Error(`CONFLICT: no se pudo comprobar si la Fuente ya existe: ${result.error.message}`)
  return result.data || null
}

async function resolveEffectiveOperation(supabase, record, payload, plannedRefs) {
  if (record.operation !== 'upsert') return { operation: 'insert', existing: null }
  const columns = bulkImportConflictColumns(record)
  if (!columns.length) return { operation: 'insert', existing: null }

  const unresolvedColumns = columns.filter((column) => payload[column] == null)
  if (unresolvedColumns.length) {
    const allPlanned = unresolvedColumns.every((column) => plannedRefs[column])
    return { operation: allPlanned ? 'insert' : null, existing: null }
  }

  let query = supabase.from(record.table).select('*').limit(1)
  for (const column of columns) query = query.eq(column, payload[column])
  const result = await query
  if (result.error) throw new Error(`CONFLICT: no se pudo comprobar si ${record.table} requiere INSERT o UPDATE: ${result.error.message}`)
  return { operation: result.data?.length ? 'update' : 'insert', existing: result.data?.[0] || null }
}

export async function preflightBulkImportRecord(supabase, input, context = null) {
  const validation = validateBulkImportRecord(input)
  const errors = [...validation.errors]
  const record = validation.record
  const empty = {
    record,
    errors,
    effectiveOperation: null,
    payload: null,
    reusedSourceId: null,
    resolvedReferences: [],
    providedValues: {},
    status: 'invalid',
  }
  if (errors.length || !record || typeof record !== 'object') return empty

  const activeContext = context || { currentIndex: -1, records: [], plans: [] }
  let materialized
  try {
    materialized = await materializePayload(supabase, record, activeContext)
  } catch (error) {
    errors.push(errorMessage(error, 'UNRESOLVED_REFERENCE: error desconocido al resolver referencias.'))
    return { ...empty, errors }
  }

  const { payload, resolvedReferences, plannedRefs } = materialized
  let effectiveOperation = null
  let reusedSourceId = null
  let existing = null
  try {
    if (record.table === 'sources' && record.operation === 'insert' && payload.url) {
      const reusable = await findReusableSource(supabase, payload.url)
      if (reusable) {
        effectiveOperation = 'reuse'
        reusedSourceId = reusable.id
        existing = reusable
      }
    }
    if (!effectiveOperation) {
      const effective = await resolveEffectiveOperation(supabase, record, payload, plannedRefs)
      effectiveOperation = effective.operation
      existing = effective.existing
    }
  } catch (error) {
    errors.push(errorMessage(error, 'CONFLICT: no se pudo determinar INSERT/UPDATE/REUSE.'))
  }

  if (!effectiveOperation) errors.push('CONFLICT: no se pudo determinar INSERT/UPDATE/REUSE.')
  if (effectiveOperation) {
    errors.push(...validateBulkImportTableContract({ ...record, data: payload, refs: plannedRefs }, effectiveOperation))
  }

  return {
    record,
    errors,
    effectiveOperation: errors.length ? null : effectiveOperation,
    payload,
    reusedSourceId: errors.length ? null : reusedSourceId,
    resolvedReferences,
    providedValues: errors.length ? {} : { ...payload, ...(existing || {}) },
    status: errors.length ? 'invalid' : 'valid',
  }
}

function collisionErrors(records) {
  const errors = new Map()
  for (const collision of findBulkImportTargetCollisions(records)) {
    for (const position of collision.positions) {
      errors.set(position - 1, `BATCH_COLLISION: ${collision.table} (${collision.target}) se repite de forma incompatible en los registros ${collision.positions.join(', ')}.`)
    }
  }
  return errors
}

function duplicateNewSourceErrors(plans) {
  const byUrl = new Map()
  plans.forEach((plan, index) => {
    if (plan?.errors?.length || plan?.record?.table !== 'sources' || plan.effectiveOperation !== 'insert') return
    const url = plan.payload?.url
    if (!url) return
    const positions = byUrl.get(url) || []
    positions.push(index + 1)
    byUrl.set(url, positions)
  })

  const errors = new Map()
  for (const [url, positions] of byUrl) {
    if (positions.length < 2) continue
    for (const position of positions) {
      errors.set(position - 1, `BATCH_COLLISION: varias operaciones intentarían crear la misma Fuente canónica ${url} en los registros ${positions.join(', ')}.`)
    }
  }
  return errors
}

export async function preflightBulkImportBatch(supabase, inputs = []) {
  const validations = inputs.map(validateBulkImportRecord)
  const records = validations.map((validation) => validation.record)
  const plans = validations.map((validation) => ({
    record: validation.record,
    errors: [...validation.errors],
    effectiveOperation: null,
    payload: null,
    reusedSourceId: null,
    resolvedReferences: [],
    providedValues: {},
    status: validation.errors.length ? 'invalid' : 'pending',
  }))

  const collisions = collisionErrors(records)
  for (const [index, message] of collisions) {
    plans[index].errors.push(message)
    plans[index].status = 'invalid'
  }

  const order = records
    .map((record, index) => ({ index, priority: bulkImportPriority(record?.table) }))
    .sort((left, right) => left.priority - right.priority || left.index - right.index)

  for (const { index } of order) {
    if (plans[index].errors.length) continue
    plans[index] = await preflightBulkImportRecord(supabase, records[index], { currentIndex: index, records, plans })
  }

  for (const [index, message] of duplicateNewSourceErrors(plans)) {
    plans[index].errors.push(message)
    plans[index].effectiveOperation = null
    plans[index].status = 'invalid'
  }

  const invalidCount = plans.filter((plan) => plan.errors.length).length
  const effectiveOperationCounts = plans.reduce((counts, plan) => {
    if (plan.effectiveOperation) counts[plan.effectiveOperation] += 1
    return counts
  }, { insert: 0, update: 0, reuse: 0 })

  return {
    plans,
    invalidCount,
    validCount: plans.length - invalidCount,
    canApply: plans.length > 0 && invalidCount === 0 && plans.every((plan) => plan.effectiveOperation),
    effectiveOperationCounts,
  }
}

export function assertBulkImportBatchCanApply(preflight) {
  if (!preflight?.plans?.length) throw new Error('PREFLIGHT_BLOCKED: el lote no contiene registros preflightados.')
  if (!preflight.canApply) {
    const invalid = preflight.invalidCount || preflight.plans.filter((plan) => plan.errors?.length).length
    throw new Error(`PREFLIGHT_BLOCKED: el lote contiene ${invalid} registro${invalid === 1 ? '' : 's'} inválido${invalid === 1 ? '' : 's'}; no se aplicará ninguno.`)
  }
  return true
}

export async function applyBulkImportRecord(supabase, input) {
  const preflight = await preflightBulkImportRecord(supabase, input)
  if (preflight.errors.length) throw new Error(preflight.errors.join(' '))

  const record = preflight.record
  const payload = preflight.payload
  if (preflight.effectiveOperation === 'reuse') {
    return {
      table: record.table,
      operation: record.operation,
      effective_operation: 'reuse',
      reused_source_id: preflight.reusedSourceId,
      on_conflict: record.on_conflict || null,
      resolved_references: preflight.resolvedReferences,
    }
  }

  const options = record.on_conflict ? { onConflict: record.on_conflict } : undefined
  const result = record.operation === 'upsert'
    ? await supabase.from(record.table).upsert(payload, options)
    : await supabase.from(record.table).insert(payload)

  if (result.error) throw new Error(`${record.table}: ${result.error.message}`)
  return {
    table: record.table,
    operation: record.operation,
    effective_operation: preflight.effectiveOperation,
    on_conflict: record.on_conflict || null,
    resolved_references: preflight.resolvedReferences,
  }
}

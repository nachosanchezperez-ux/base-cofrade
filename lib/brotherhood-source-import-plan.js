const TRACKING_QUERY_PARAMS = new Set([
  'fbclid',
  'gclid',
  'igshid',
  'mc_cid',
  'mc_eid',
])

const FIELD_ALIASES = {
  brotherhoodId: ['brotherhood_id', 'hermandad_id', 'id_hermandad', 'entity_id'],
  brotherhoodSlug: ['brotherhood_slug', 'hermandad_slug', 'slug_hermandad', 'slug'],
  brotherhoodName: ['brotherhood_name', 'hermandad', 'nombre_hermandad', 'nombre'],
  sourceName: ['source_name', 'nombre_fuente', 'fuente', 'titulo_fuente'],
  sourceUrl: ['source_url', 'url', 'enlace', 'web', 'fuente_url'],
  sourceType: ['source_type', 'tipo_fuente', 'tipo'],
  scope: ['scope', 'ambito', 'alcance'],
  sourceNotes: ['source_notes', 'notas_fuente'],
  linkNotes: ['link_notes', 'notas_vinculo', 'notas'],
  authorOrPublisher: ['author_or_publisher', 'autor_editor', 'editor', 'publisher'],
  publicationDate: ['publication_date', 'fecha_publicacion'],
  accessedAt: ['accessed_at', 'fecha_consulta'],
  license: ['license', 'licencia'],
}

function text(value = '') {
  return String(value ?? '').trim()
}

function normalizedText(value = '') {
  return text(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
}

function normalizedFieldName(value = '') {
  return normalizedText(value).replace(/ /g, '_')
}

function normalizedSlug(value = '') {
  return text(value)
    .toLowerCase()
    .replace(/^\/+|\/+$/g, '')
}

function normalizedScope(value = '') {
  return normalizedText(value)
}

function rowLookup(row = {}) {
  return new Map(
    Object.entries(row).map(([key, value]) => [normalizedFieldName(key), value])
  )
}

function readField(rowMap, aliases = []) {
  for (const alias of aliases) {
    const value = rowMap.get(normalizedFieldName(alias))
    if (value !== undefined && value !== null && text(value) !== '') return value
  }
  return ''
}

function booleanish(value) {
  if (typeof value === 'boolean') return value
  const normalized = normalizedText(value)
  if (['si', 'yes', 'true', '1'].includes(normalized)) return true
  if (['no', 'false', '0'].includes(normalized)) return false
  return null
}

export function canonicalSourceUrl(value = '') {
  const raw = text(value)
  if (!raw) return ''

  let url
  try {
    url = new URL(raw)
  } catch {
    return null
  }

  if (!['http:', 'https:'].includes(url.protocol.toLowerCase())) return null

  url.protocol = url.protocol.toLowerCase()
  url.hostname = url.hostname.toLowerCase()
  url.hash = ''

  if ((url.protocol === 'http:' && url.port === '80') || (url.protocol === 'https:' && url.port === '443')) {
    url.port = ''
  }

  url.pathname = url.pathname.replace(/\/{2,}/g, '/')
  if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, '')

  const keptParams = [...url.searchParams.entries()]
    .filter(([key]) => {
      const normalized = key.toLowerCase()
      return !normalized.startsWith('utm_') && !TRACKING_QUERY_PARAMS.has(normalized)
    })
    .sort(([firstKey, firstValue], [secondKey, secondValue]) => {
      const keyDiff = firstKey.localeCompare(secondKey)
      return keyDiff || firstValue.localeCompare(secondValue)
    })

  url.search = ''
  keptParams.forEach(([key, paramValue]) => url.searchParams.append(key, paramValue))

  return url.toString()
}

function sourceKey(source = {}) {
  const canonicalUrl = canonicalSourceUrl(source.url)
  if (canonicalUrl) return `url:${canonicalUrl}`
  return `name:${normalizedText(source.name)}|type:${normalizedText(source.source_type)}`
}

function entityNames(entity = {}) {
  return [
    entity.name,
    entity.nombre,
    entity.nombrePopular,
    entity.nombre_popular,
    ...(Array.isArray(entity.aliases) ? entity.aliases : []),
  ].filter(Boolean)
}

function addCandidate(map, key, entity) {
  if (!key) return
  const current = map.get(key) || []
  if (!current.some((candidate) => candidate.id === entity.id)) current.push(entity)
  map.set(key, current)
}

function buildEntityIndexes(brotherhoods = []) {
  const byId = new Map()
  const bySlug = new Map()
  const byName = new Map()

  for (const entity of brotherhoods) {
    if (entity?.id) byId.set(text(entity.id), entity)
    addCandidate(bySlug, normalizedSlug(entity?.slug), entity)
    entityNames(entity).forEach((name) => addCandidate(byName, normalizedText(name), entity))
  }

  return { byId, bySlug, byName }
}

function resolveBrotherhood(row, indexes) {
  if (row.brotherhoodId) {
    const entity = indexes.byId.get(row.brotherhoodId)
    return entity
      ? { status: 'matched', entity, via: 'id' }
      : { status: 'unmatched', reason: 'brotherhood_id_not_found' }
  }

  if (row.brotherhoodSlug) {
    const candidates = indexes.bySlug.get(normalizedSlug(row.brotherhoodSlug)) || []
    if (candidates.length === 1) return { status: 'matched', entity: candidates[0], via: 'slug' }
    if (candidates.length > 1) return { status: 'ambiguous', reason: 'duplicate_brotherhood_slug', candidates }
    return { status: 'unmatched', reason: 'brotherhood_slug_not_found' }
  }

  if (row.brotherhoodName) {
    const candidates = indexes.byName.get(normalizedText(row.brotherhoodName)) || []
    if (candidates.length === 1) return { status: 'matched', entity: candidates[0], via: 'name' }
    if (candidates.length > 1) return { status: 'ambiguous', reason: 'ambiguous_brotherhood_name', candidates }
    return { status: 'unmatched', reason: 'brotherhood_name_not_found' }
  }

  return { status: 'unmatched', reason: 'missing_brotherhood_reference' }
}

function sourceRepresentative(candidates = [], row = {}) {
  return [...candidates].sort((first, second) => {
    const firstExactName = normalizedText(first.name) === normalizedText(row.sourceName) ? 0 : 1
    const secondExactName = normalizedText(second.name) === normalizedText(row.sourceName) ? 0 : 1
    if (firstExactName !== secondExactName) return firstExactName - secondExactName

    const firstExactType = normalizedText(first.source_type) === normalizedText(row.sourceType) ? 0 : 1
    const secondExactType = normalizedText(second.source_type) === normalizedText(row.sourceType) ? 0 : 1
    if (firstExactType !== secondExactType) return firstExactType - secondExactType

    const dateDiff = text(first.created_at).localeCompare(text(second.created_at))
    if (dateDiff) return dateDiff
    return text(first.id).localeCompare(text(second.id))
  })[0] || null
}

function normalizeImportRow(input = {}, rowNumber, defaults) {
  const lookup = rowLookup(input)
  const brotherhoodName = text(readField(lookup, FIELD_ALIASES.brotherhoodName))
  const brotherhoodSlug = text(readField(lookup, FIELD_ALIASES.brotherhoodSlug))
  const brotherhoodId = text(readField(lookup, FIELD_ALIASES.brotherhoodId))
  const rawUrl = text(readField(lookup, FIELD_ALIASES.sourceUrl))
  const canonicalUrl = canonicalSourceUrl(rawUrl)
  let sourceName = text(readField(lookup, FIELD_ALIASES.sourceName))
  const warnings = []

  if (!sourceName && rawUrl) {
    const label = brotherhoodName || brotherhoodSlug || 'Hermandad'
    sourceName = `${label} · fuente`
    warnings.push('source_name_inferred')
  }

  let sourceType = text(readField(lookup, FIELD_ALIASES.sourceType))
  if (!sourceType) {
    sourceType = defaults.defaultSourceType
    warnings.push('source_type_defaulted')
  }

  let scope = text(readField(lookup, FIELD_ALIASES.scope))
  if (!scope) scope = defaults.defaultScope

  return {
    rowNumber,
    brotherhoodId,
    brotherhoodSlug,
    brotherhoodName,
    sourceName,
    sourceUrl: rawUrl,
    canonicalUrl,
    sourceType,
    scope,
    sourceNotes: text(readField(lookup, FIELD_ALIASES.sourceNotes)),
    linkNotes: text(readField(lookup, FIELD_ALIASES.linkNotes)),
    authorOrPublisher: text(readField(lookup, FIELD_ALIASES.authorOrPublisher)),
    publicationDate: text(readField(lookup, FIELD_ALIASES.publicationDate)),
    accessedAt: text(readField(lookup, FIELD_ALIASES.accessedAt)),
    license: text(readField(lookup, FIELD_ALIASES.license)),
    warnings,
  }
}

function invalidReason(row) {
  if (row.sourceUrl && row.canonicalUrl === null) return 'invalid_source_url'
  if (!row.sourceName) return 'missing_source_name'
  if (!row.sourceUrl && !row.sourceName) return 'missing_source_reference'
  if (!row.sourceType) return 'missing_source_type'
  return ''
}

function candidateIds(candidates = []) {
  return candidates.map((candidate) => candidate.id).filter(Boolean)
}

export function planBrotherhoodSourceImport({
  rows = [],
  brotherhoods = [],
  sources = [],
  sourceLinks = [],
  defaultSourceType = 'web',
  defaultScope = 'general',
} = {}) {
  const defaults = { defaultSourceType, defaultScope }
  const entityIndexes = buildEntityIndexes(brotherhoods)
  const sourceById = new Map(sources.filter((source) => source?.id).map((source) => [source.id, source]))
  const existingSourcesByKey = new Map()

  for (const source of sources) {
    const key = sourceKey(source)
    const current = existingSourcesByKey.get(key) || []
    current.push(source)
    existingSourcesByKey.set(key, current)
  }

  const existingLinkKeys = new Set()
  for (const link of sourceLinks) {
    if (!link?.entity_id || !link?.source_id) continue
    const linkedSource = sourceById.get(link.source_id)
    if (!linkedSource) continue
    existingLinkKeys.add(`${link.entity_id}|${sourceKey(linkedSource)}|${normalizedScope(link.scope)}`)
  }

  const actions = {
    sourcesToCreate: [],
    linksToCreate: [],
    reusedSources: [],
    noops: [],
    review: [],
    invalid: [],
  }
  const plannedSourceKeys = new Set()
  const plannedLinkKeys = new Set()

  rows.forEach((input, index) => {
    const row = normalizeImportRow(input, index + 2, defaults)
    const invalid = invalidReason(row)
    if (invalid) {
      actions.invalid.push({ rowNumber: row.rowNumber, reason: invalid, row })
      return
    }

    const resolved = resolveBrotherhood(row, entityIndexes)
    if (resolved.status !== 'matched') {
      actions.review.push({
        rowNumber: row.rowNumber,
        reason: resolved.reason,
        candidateIds: candidateIds(resolved.candidates),
        row,
      })
      return
    }

    const importSource = {
      name: row.sourceName,
      url: row.canonicalUrl || null,
      source_type: row.sourceType,
      author_or_publisher: row.authorOrPublisher || null,
      publication_date: row.publicationDate || null,
      accessed_at: row.accessedAt || null,
      license: row.license || null,
      notes: row.sourceNotes || null,
    }
    const key = sourceKey(importSource)
    const candidates = existingSourcesByKey.get(key) || []
    const existingSource = sourceRepresentative(candidates, row)

    if (existingSource) {
      actions.reusedSources.push({
        rowNumber: row.rowNumber,
        entityId: resolved.entity.id,
        sourceId: existingSource.id,
        sourceKey: key,
        duplicateExistingSourceIds: candidates.length > 1 ? candidateIds(candidates) : [],
        matchedVia: resolved.via,
        warnings: row.warnings,
      })
    } else if (!plannedSourceKeys.has(key)) {
      actions.sourcesToCreate.push({
        rowNumber: row.rowNumber,
        sourceKey: key,
        source: importSource,
        warnings: row.warnings,
      })
      plannedSourceKeys.add(key)
    }

    const linkKey = `${resolved.entity.id}|${key}|${normalizedScope(row.scope)}`
    if (existingLinkKeys.has(linkKey)) {
      actions.noops.push({
        rowNumber: row.rowNumber,
        reason: 'source_already_linked',
        entityId: resolved.entity.id,
        sourceKey: key,
      })
      return
    }

    if (plannedLinkKeys.has(linkKey)) {
      actions.noops.push({
        rowNumber: row.rowNumber,
        reason: 'duplicate_import_row',
        entityId: resolved.entity.id,
        sourceKey: key,
      })
      return
    }

    actions.linksToCreate.push({
      rowNumber: row.rowNumber,
      entityId: resolved.entity.id,
      sourceId: existingSource?.id || null,
      sourceKey: key,
      scope: row.scope || null,
      notes: row.linkNotes || null,
      matchedVia: resolved.via,
      warnings: row.warnings,
    })
    plannedLinkKeys.add(linkKey)
  })

  return {
    summary: {
      totalRows: rows.length,
      newSources: actions.sourcesToCreate.length,
      reusedSources: actions.reusedSources.length,
      newLinks: actions.linksToCreate.length,
      noops: actions.noops.length,
      review: actions.review.length,
      invalid: actions.invalid.length,
    },
    actions,
  }
}

export function importBoolean(value) {
  return booleanish(value)
}

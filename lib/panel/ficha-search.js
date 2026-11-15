// Pure search and index projection. No raw database rows are sent to the browser.
export function normalizeFichaSearch(value = '') {
  return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9ñ]+/g, ' ').trim()
}
const stopWords = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y', 'en'])
export function fichaSearchTokens(query) {
  return normalizeFichaSearch(query).split(' ').filter((word) => word && !stopWords.has(word))
    .map((word) => word.length > 4 && word.endsWith('s') ? word.slice(0, -1) : word)
}
function text(...values) {
  return values.flat(Infinity).filter((value) => typeof value === 'string' || typeof value === 'number').join(' · ')
}
function fields(row, names) { return text(...names.split(' ').map((name) => row?.[name])) }
const prose = 'title name summary description notes date_from_text date_to_text year outing_date start_date end_date'

export function buildBrotherhoodSearchIndex(data) {
  const root = `/panel/hermandades/${data.entity.id}`
  const index = []
  function add(section, path, title, content, status, anchor = '') {
    index.push({ section, title, content, status: status || '', href: `${root}${path}${anchor ? `#${anchor}` : ''}` })
  }
  add('General', '', data.entity.name, text(data.entity.summary, fields(data.brotherhood, 'popular_name official_name foundation_text neighborhood current_procession_day brotherhood_types')), data.entity.status)
  add('Historia', '/historia', 'Relato histórico', data.history || '', data.entity.status)
  const entities = new Map((data.relatedEntities || []).map((row) => [row.id, row]))
  for (const asset of data.assets || []) {
    const entity = entities.get(asset.entity_id)
    if (!entity) continue
    const contributions = (data.contributions || []).filter((row) => row.target_entity_id === asset.entity_id)
    const credits = contributions.map((row) => text(entities.get(row.agent_entity_id)?.name, fields(row, `${prose} discipline phase intervention_type element_name`)))
    add('Patrimonio', '/patrimonio', entity.name, text(entity.summary, fields(asset, `${prose} asset_type technique materials iconography historical_context provenance_text origin_notes blessing_date_text current_condition`), credits), entity.status, `pieza-${entity.id}`)
  }
  for (const row of data.heritage || []) add('Estrenos y restauraciones', '/patrimonio', row.title || row.element_name || 'Novedad patrimonial', fields(row, `${prose} element_name discipline update_type`), row.status, `novedad-${row.id}`)
  for (const row of data.cults || []) add('Cultos', '/cultos', row.title || row.cult_type || 'Culto', fields(row, `${prose} cult_type schedule_text preacher_name`), row.status, `culto-${row.id}`)
  for (const row of data.outings || []) add('Salidas', '/salidas', row.title || row.outing_type || 'Salida', fields(row, `${prose} outing_type route_text historical_context`), row.status, `outing-${row.id}`)
  for (const row of data.series || []) add('Salidas habituales', '/salidas/recurrentes', row.title || row.outing_type || 'Salida habitual', fields(row, `${prose} outing_type recurrence_text route_text`), row.status, `serie-${row.id}`)
  for (const row of data.habits || []) add('Hábito', '/habito', row.name || 'Hábito', fields(row, `${prose} tunic_description hood_description cord_description buttons_description shield_description footwear_description`), row.status, `habit-${row.id}`)
  for (const row of data.stats || []) add('Jornada', '/jornada', `Jornada ${row.year}`, fields(row, `${prose} procession_day procession_date`), row.status, `jornada-${row.id}`)
  for (const [key, section, path, field, prefix] of [
    ['images', 'Titulares', '/titulares', 'image_entity_id', 'titular'],
    ['steps', 'Pasos', '/pasos', 'step_entity_id', 'paso'],
  ]) for (const row of data[key] || []) {
    const entity = entities.get(row[field])
    if (entity) add(section, path, entity.name, fields(row, `${prose} relation_type`), row.status, `${prefix}-${row.id}`)
  }
  for (const row of data.channels || []) add('Canales', '/canales', row.label || row.platform, fields(row, 'label platform url'), '', `canal-${row.id}`)
  return index
}

export function searchFichaIndex(index, query, { context = '', limit = 40 } = {}) {
  const tokens = fichaSearchTokens(query)
  if (!tokens.length) return { results: [], total: 0 }
  const matches = index.map((entry) => {
    const title = normalizeFichaSearch(entry.title)
    const body = normalizeFichaSearch(text(entry.section, entry.content))
    const haystack = text(title, body, normalizeFichaSearch(context))
    if (!tokens.every((token) => haystack.includes(token))) return null
    const score = tokens.reduce((sum, token) => sum + (title.includes(token) ? 10 : body.includes(token) ? 1 : 0), 0)
    // Return an excerpt around the matching content, never HTML.
    const content = String(entry.content || '').replace(/\s+/g, ' ')
    const at = tokens.map((token) => normalizeFichaSearch(content).indexOf(token)).filter((pos) => pos >= 0).sort((a, b) => a - b)[0] || 0
    const start = Math.max(0, at - 55)
    const excerpt = `${start ? '…' : ''}${content.slice(start, start + 190)}${content.length > start + 190 ? '…' : ''}`
    return { entry: { title: entry.title, section: entry.section, status: entry.status, href: entry.href, excerpt }, score }
  }).filter(Boolean).sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, 'es'))
  return { results: matches.slice(0, limit).map(({ entry }) => entry), total: matches.length }
}

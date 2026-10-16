import 'server-only'

import { NEWS_RELATION_PROTAGONIST, NEWS_RELATION_RELATED, NEWS_PROTAGONIST_TYPES, newsPublicationIssues } from '@/lib/hilo-movements-editorial'
import { createClient } from '@/lib/supabase/server'

const ENTITY_TYPE_LABELS = { brotherhood: 'Hermandad', band: 'Banda', image: 'Imagen', step: 'Paso', agent: 'Persona', march: 'Marcha' }
export const NEWS_TOPICS = [['musica', 'Música'], ['agenda', 'Salidas y cultos'], ['patrimonio', 'Patrimonio'], ['hermandad', 'Vida de hermandad']]
export const NEWS_KIND_SUGGESTIONS = ['Cambio', 'Renovación', 'Nombramiento', 'Estreno', 'Restauración', 'Salida extraordinaria', 'Carrera Oficial', 'Cabildo', 'Aniversario']

const NEWS_COLUMNS = 'id, content_type, status, slug, title, summary, body, publish_date, announced_on, news_topic, news_kind, municipality_id, effective_label, discover_label, discover_href, author_name, created_at, updated_at'

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

function madridToday() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date())
}

export async function getPanelNewsList({ query = '', status = '' } = {}) {
  const supabase = await createClient()
  let request = supabase.from('editorial_content').select(NEWS_COLUMNS).eq('content_type', 'news').order('publish_date', { ascending: false, nullsFirst: true }).order('created_at', { ascending: false })
  if (status) request = request.eq('status', status)
  const contents = rows(await request, 'No se pudieron cargar las noticias')
  const ids = contents.map((item) => item.id)
  const links = ids.length ? rows(await supabase.from('editorial_content_links').select('editorial_content_id, entity_id, relation_type, is_primary').in('editorial_content_id', ids).eq('is_primary', true), 'No se pudieron cargar los protagonistas de las noticias') : []
  const entityIds = [...new Set(links.map((link) => link.entity_id))]
  const entities = entityIds.length ? rows(await supabase.from('entities').select('id, name').in('id', entityIds), 'No se pudieron cargar los protagonistas') : []
  const nameById = new Map(entities.map((item) => [item.id, item.name]))
  const protagonistByContent = new Map(links.map((link) => [link.editorial_content_id, nameById.get(link.entity_id) || '']))
  const normalized = query.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  return contents
    .map((item) => ({ ...item, protagonist: protagonistByContent.get(item.id) || '' }))
    .filter((item) => !normalized || `${item.title} ${item.protagonist} ${item.slug || ''}`.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().includes(normalized))
}

export async function getNewsReferenceOptions(supabaseClient = null) {
  const supabase = supabaseClient || await createClient()
  const [entities, municipalitiesResult] = await Promise.all([
    loadNewsEntities(supabase),
    supabase.from('municipalities').select('id, name, province').order('name'),
  ])
  const municipalities = rows(municipalitiesResult, 'No se pudieron cargar las localidades')
  const option = (item) => ({ id: item.id, name: item.name, slug: item.slug || '', meta: `${ENTITY_TYPE_LABELS[item.entity_type]}${item.status === 'published' ? '' : ' · sin publicar'}` })
  return {
    protagonistOptions: entities.filter((item) => NEWS_PROTAGONIST_TYPES.includes(item.entity_type)).map(option),
    relationOptions: entities.map(option),
    municipalities: municipalities.map((item) => ({ ...item, label: item.province && item.province !== 'Sevilla' ? `${item.name} (${item.province})` : item.name })),
  }
}

async function loadNewsEntities(supabase) {
  const entities = []
  const pageSize = 500
  // El límite solicitado no amplía el máximo de filas de PostgREST.
  // Paginar evita perder bandas y Hermandades al final del alfabeto.
  for (let offset = 0; ; offset += pageSize) {
    const page = rows(await supabase.from('entities').select('id, name, slug, status, entity_type')
      .in('entity_type', Object.keys(ENTITY_TYPE_LABELS)).neq('status', 'archived')
      .order('name').order('id').range(offset, offset + pageSize - 1), 'No se pudieron cargar las fichas')
    entities.push(...page)
    if (page.length < pageSize) return entities
  }
}

export async function getNewsEditorData(id) {
  const supabase = await createClient()
  const contentResult = await supabase.from('editorial_content').select(NEWS_COLUMNS).eq('id', id).eq('content_type', 'news').maybeSingle()
  if (contentResult.error) throw new Error(`No se pudo cargar la noticia: ${contentResult.error.message}`)
  const content = contentResult.data
  if (!content) return null
  const [links, sourceLinks, options] = await Promise.all([
    supabase.from('editorial_content_links').select('id, entity_id, relation_type, is_primary, notes').eq('editorial_content_id', id).then((result) => rows(result, 'No se pudieron cargar las fichas relacionadas')),
    supabase.from('source_links').select('id, source_id, scope').eq('editorial_content_id', id).then((result) => rows(result, 'No se pudieron cargar las fuentes')),
    getNewsReferenceOptions(supabase),
  ])
  const entityIds = [...new Set(links.map((link) => link.entity_id))]
  const sourceIds = [...new Set(sourceLinks.map((link) => link.source_id))]
  const [entities, sources] = await Promise.all([
    entityIds.length ? supabase.from('entities').select('id, name, slug, status, entity_type').in('id', entityIds).then((result) => rows(result, 'No se pudieron cargar las fichas')) : [],
    sourceIds.length ? supabase.from('sources').select('id, name, url, source_type, author_or_publisher').in('id', sourceIds).then((result) => rows(result, 'No se pudieron cargar las fuentes')) : [],
  ])
  const entityById = new Map(entities.map((item) => [item.id, item]))
  const sourceById = new Map(sources.map((item) => [item.id, item]))
  const protagonistLink = links.find((link) => link.is_primary && link.relation_type === NEWS_RELATION_PROTAGONIST) || null
  const protagonist = protagonistLink ? entityById.get(protagonistLink.entity_id) || null : null
  const relations = links
    .filter((link) => link !== protagonistLink)
    .map((link) => ({ ...link, entity: entityById.get(link.entity_id) || null, typeLabel: ENTITY_TYPE_LABELS[entityById.get(link.entity_id)?.entity_type] || 'Ficha', isEditable: link.relation_type === NEWS_RELATION_RELATED }))
  const sourceItems = sourceLinks.map((link) => ({ ...link, source: sourceById.get(link.source_id) || null }))
  const issues = newsPublicationIssues({
    content,
    protagonist,
    sources: sourceItems.map((item) => ({ label: item.source?.name, href: item.source?.url })),
    today: madridToday(),
  })
  return { content, protagonist, protagonistLink, relations, sources: sourceItems, issues, today: madridToday(), ...options }
}

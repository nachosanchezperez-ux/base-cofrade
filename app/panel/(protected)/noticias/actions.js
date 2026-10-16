'use server'

import { revalidatePath, updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
import { NEWS_RELATION_PROTAGONIST, NEWS_RELATION_RELATED, NEWS_PROTAGONIST_TYPES, newsPublicationIssues } from '@/lib/hilo-movements-editorial'
import { requirePanelAdmin, requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])
const TOPICS = new Set(['musica', 'agenda', 'patrimonio', 'hermandad'])
const SOURCE_TYPES = new Set(['Prensa digital', 'Comunicado de la Hermandad', 'Red social oficial', 'Web oficial de la Hermandad', 'Web oficial de banda', 'Fuente diocesana', 'Aportación directa'])

function value(formData, name) { return String(formData.get(name) || '').trim() }
function nullable(formData, name) { return value(formData, name) || null }
function required(formData, name, label) { const candidate = value(formData, name); if (!candidate) throw new Error(`${label} es obligatorio.`); return candidate }
function uuid(formData, name, optional = false) { const candidate = value(formData, name); if (optional && !candidate) return null; if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`); return candidate }
function status(formData) { const candidate = value(formData, 'status') || 'draft'; if (!STATUSES.has(candidate)) throw new Error('Estado editorial no válido.'); return candidate }
function topic(formData) { const candidate = value(formData, 'news_topic'); if (!candidate) return null; if (!TOPICS.has(candidate)) throw new Error('Tema no válido.'); return candidate }
function slugify(input) { return String(input || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 90).replace(/-$/, '') }
function dateValue(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || Number.isNaN(Date.parse(`${candidate}T00:00:00Z`))) throw new Error('La fecha no es válida.')
  return candidate
}
function internalPath(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!/^\/(?!\/)[^\s\\]*$/.test(candidate)) throw new Error('El enlace «Descubre» debe ser una ruta interna que empiece por /, por ejemplo /hermandades/san-benito.')
  return candidate
}
function httpsUrl(formData, name) {
  const candidate = required(formData, name, 'El enlace de la fuente')
  let url
  try { url = new URL(candidate) } catch { throw new Error('El enlace de la fuente no es válido.') }
  if (url.protocol !== 'https:' || url.username || url.password) throw new Error('El enlace de la fuente debe empezar por https://')
  return url.toString()
}
function madridToday() { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date()) }
function assertRow(result, label) { if (result.error) throw new Error(`${label}: ${result.error.message}`); if (!result.data) throw new Error(label); return result.data }
function assertMutation(result, label) { if (result.error) throw new Error(`${label}: ${result.error.message}`); return result.data }

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({ actor_user_id: user.id, actor_label: user.name, object_type: 'editorial_content', ...entry })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición de la noticia', error)
}

async function requireNews(supabase, id) {
  return assertRow(await supabase.from('editorial_content').select('*').eq('id', id).eq('content_type', 'news').maybeSingle(), 'La noticia no existe.')
}

async function ensureUniqueSlug(supabase, slug, id = null) {
  let query = supabase.from('editorial_content').select('id').eq('slug', slug)
  if (id) query = query.neq('id', id)
  const result = await query.limit(1).maybeSingle()
  if (result.error) throw new Error(`No se pudo comprobar el identificador: ${result.error.message}`)
  if (result.data) throw new Error(`El identificador «${slug}» ya lo usa otra noticia.`)
}

async function requireProtagonist(supabase, id) {
  return assertRow(await supabase.from('entities').select('id, name, slug, status, entity_type').eq('id', id).in('entity_type', NEWS_PROTAGONIST_TYPES).neq('status', 'archived').maybeSingle(), 'La Hermandad o banda seleccionada no existe o está archivada.')
}

async function protagonistOf(supabase, id) {
  const link = await supabase.from('editorial_content_links').select('id, entity_id').eq('editorial_content_id', id).eq('relation_type', NEWS_RELATION_PROTAGONIST).eq('is_primary', true).limit(1).maybeSingle()
  if (link.error) throw new Error(`No se pudo leer la ficha protagonista: ${link.error.message}`)
  return link.data
}

async function setProtagonist(supabase, id, protagonistId) {
  const current = await protagonistOf(supabase, id)
  if (current?.entity_id === protagonistId) return
  if (current) {
    assertMutation(await supabase.from('editorial_content_links').update({ entity_id: protagonistId }).eq('id', current.id), 'No se pudo cambiar la ficha protagonista')
    return
  }
  assertMutation(await supabase.from('editorial_content_links').insert({ editorial_content_id: id, entity_id: protagonistId, relation_type: NEWS_RELATION_PROTAGONIST, is_primary: true }), 'No se pudo vincular la ficha protagonista')
}

async function publicationIssues(supabase, content, selectedProtagonist = null) {
  const link = await protagonistOf(supabase, content.id)
  const protagonist = selectedProtagonist || (link ? assertRow(await supabase.from('entities').select('id, slug, status, entity_type').eq('id', link.entity_id).maybeSingle(), 'No se pudo comprobar la ficha protagonista') : null)
  const sourceLinks = assertMutation(await supabase.from('source_links').select('source_id').eq('editorial_content_id', content.id), 'No se pudieron comprobar las fuentes') || []
  const ids = sourceLinks.map((item) => item.source_id)
  const sources = ids.length ? assertMutation(await supabase.from('sources').select('name, url').in('id', ids), 'No se pudieron comprobar las fuentes') || [] : []
  return newsPublicationIssues({ content, protagonist, sources: sources.map((item) => ({ label: item.name, href: item.url })), today: madridToday() })
}

async function refreshNews(supabase, id) {
  updateTag('public-platform-updates')
  updateTag('home-public')
  revalidatePath('/el-hilo-se-mueve')
  revalidatePath('/')
  revalidatePath('/panel/noticias')
  revalidatePath(`/panel/noticias/${id}`)
  // También retira la noticia de una ficha anterior al cambiar el protagonista.
  revalidatePath('/hermandades/[slug]', 'page')
  revalidatePath('/bandas/[slug]', 'page')
}

function redirectEditor(id, saved) { redirect(`/panel/noticias/${id}?saved=${saved}`) }

function newsPayload(formData) {
  return {
    title: required(formData, 'title', 'El titular'),
    summary: nullable(formData, 'summary'),
    body: nullable(formData, 'body'),
    news_topic: topic(formData),
    news_kind: nullable(formData, 'news_kind'),
    municipality_id: uuid(formData, 'municipality_id', true),
    publish_date: dateValue(formData, 'publish_date'),
    announced_on: dateValue(formData, 'announced_on'),
    effective_label: nullable(formData, 'effective_label'),
    discover_label: nullable(formData, 'discover_label'),
    discover_href: internalPath(formData, 'discover_href'),
    author_name: nullable(formData, 'author_name'),
  }
}

export async function createNewsAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const payload = newsPayload(formData)
  const slug = slugify(value(formData, 'slug') || payload.title)
  if (!slug) throw new Error('No se ha podido generar un identificador válido a partir del titular.')
  await ensureUniqueSlug(supabase, slug)
  const protagonistId = uuid(formData, formData.has('protagonist_entity_id') ? 'protagonist_entity_id' : 'brotherhood_entity_id', true)
  if (protagonistId) await requireProtagonist(supabase, protagonistId)
  const saved = assertRow(await supabase.from('editorial_content').insert({ ...payload, content_type: 'news', slug, status: 'draft', publish_date: payload.publish_date || madridToday(), eligible_for_daily: false, daily_priority: 0 }).select('id').single(), 'No se pudo crear la noticia')
  if (protagonistId) await setProtagonist(supabase, saved.id, protagonistId)
  await audit(supabase, user, { action_type: 'create', object_id: saved.id, summary: `Noticia creada: ${payload.title}`, changed_fields: { ...payload, slug, protagonist_entity_id: protagonistId } })
  await refreshNews(supabase, saved.id)
  redirectEditor(saved.id, 'created')
}

export async function updateNewsAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const id = uuid(formData, 'content_id')
  const current = await requireNews(supabase, id)
  const payload = newsPayload(formData)
  const nextStatus = status(formData)
  const slug = slugify(required(formData, 'slug', 'El identificador'))
  if (current.status === 'published' && current.slug && slug !== current.slug) throw new Error('El identificador de una noticia publicada no puede cambiarse: rompería los enlaces compartidos. Pásala primero a borrador.')
  await ensureUniqueSlug(supabase, slug, id)
  const protagonistId = uuid(formData, formData.has('protagonist_entity_id') ? 'protagonist_entity_id' : 'brotherhood_entity_id', true)
  const selectedProtagonist = protagonistId ? await requireProtagonist(supabase, protagonistId) : null
  if (nextStatus === 'published') {
    const issues = await publicationIssues(supabase, { ...current, ...payload, id, slug }, selectedProtagonist)
    if (issues.length) throw new Error(`Aún no se puede publicar: ${issues.join(' ')}`)
  }
  if (protagonistId) await setProtagonist(supabase, id, protagonistId)
  assertMutation(await supabase.from('editorial_content').update({ ...payload, slug, status: nextStatus }).eq('id', id).eq('content_type', 'news'), 'No se pudo guardar la noticia')
  await audit(supabase, user, { action_type: 'update', object_id: id, summary: `Noticia ${nextStatus === 'published' ? 'publicada' : 'actualizada'}: ${payload.title}`, changed_fields: { ...payload, slug, status: nextStatus, protagonist_entity_id: protagonistId } })
  await refreshNews(supabase, id)
  redirectEditor(id, nextStatus === 'published' && current.status !== 'published' ? 'published' : 'updated')
}

export async function addNewsRelationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const id = uuid(formData, 'content_id')
  await requireNews(supabase, id)
  const entityId = uuid(formData, 'entity_id')
  const role = required(formData, 'role', 'El papel en la noticia')
  const entity = assertRow(await supabase.from('entities').select('id, name').eq('id', entityId).neq('status', 'archived').maybeSingle(), 'La ficha seleccionada no existe o está archivada.')
  const result = await supabase.from('editorial_content_links').insert({ editorial_content_id: id, entity_id: entityId, relation_type: NEWS_RELATION_RELATED, is_primary: false, notes: role })
  if (result.error?.code === '23505') throw new Error(`«${entity.name}» ya está relacionada con esta noticia.`)
  assertMutation(result, 'No se pudo relacionar la ficha')
  await audit(supabase, user, { action_type: 'update', object_id: id, summary: `Ficha relacionada con la noticia: ${entity.name}`, changed_fields: { entity_id: entityId, role } })
  await refreshNews(supabase, id)
  redirectEditor(id, 'relation')
}

export async function updateNewsRelationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const id = uuid(formData, 'content_id')
  const linkId = uuid(formData, 'link_id')
  const role = required(formData, 'role', 'El papel en la noticia')
  assertMutation(await supabase.from('editorial_content_links').update({ notes: role }).eq('id', linkId).eq('editorial_content_id', id).eq('relation_type', NEWS_RELATION_RELATED), 'No se pudo guardar el papel')
  await audit(supabase, user, { action_type: 'update', object_id: id, summary: 'Papel de una ficha relacionada actualizado', changed_fields: { link_id: linkId, role } })
  await refreshNews(supabase, id)
  redirectEditor(id, 'relation')
}

export async function removeNewsRelationAction(formData) {
  const user = await requirePanelAdmin()
  const supabase = await createClient()
  const id = uuid(formData, 'content_id')
  const linkId = uuid(formData, 'link_id')
  const removed = assertMutation(await supabase.from('editorial_content_links').delete().eq('id', linkId).eq('editorial_content_id', id).eq('relation_type', NEWS_RELATION_RELATED).select('id'), 'No se pudo retirar la ficha')
  if (!removed?.length) throw new Error('No se ha retirado ninguna ficha: comprueba que sigue relacionada.')
  await audit(supabase, user, { action_type: 'update', object_id: id, summary: 'Ficha retirada de la noticia', changed_fields: { link_id: linkId } })
  await refreshNews(supabase, id)
  redirectEditor(id, 'relation-removed')
}

export async function addNewsSourceAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const id = uuid(formData, 'content_id')
  const content = await requireNews(supabase, id)
  const url = httpsUrl(formData, 'url')
  const name = required(formData, 'name', 'El título de la fuente')
  const sourceType = value(formData, 'source_type') || 'Prensa digital'
  if (!SOURCE_TYPES.has(sourceType)) throw new Error('Tipo de fuente no válido.')
  // Reutiliza la fuente si la URL ya está en el archivo, para no duplicarla.
  const existing = assertMutation(await supabase.from('sources').select('id').eq('url', url).limit(1).maybeSingle(), 'No se pudo comprobar la fuente')
  const sourceId = existing?.id || assertRow(await supabase.from('sources').insert({ name, url, source_type: sourceType, author_or_publisher: nullable(formData, 'author_or_publisher'), accessed_at: madridToday() }).select('id').single(), 'No se pudo crear la fuente').id
  const already = assertMutation(await supabase.from('source_links').select('id').eq('source_id', sourceId).eq('editorial_content_id', id).limit(1).maybeSingle(), 'No se pudo comprobar la fuente')
  if (already) throw new Error('Esta fuente ya está enlazada a la noticia.')
  assertMutation(await supabase.from('source_links').insert({ source_id: sourceId, editorial_content_id: id, scope: `Noticia de El Hilo se mueve: ${content.title}`.slice(0, 200) }), 'No se pudo enlazar la fuente')
  await audit(supabase, user, { action_type: 'update', object_id: id, summary: `Fuente añadida a la noticia: ${name}`, changed_fields: { source_id: sourceId, url } })
  await refreshNews(supabase, id)
  redirectEditor(id, 'source')
}

export async function removeNewsSourceAction(formData) {
  const user = await requirePanelAdmin()
  const supabase = await createClient()
  const id = uuid(formData, 'content_id')
  const linkId = uuid(formData, 'link_id')
  const content = await requireNews(supabase, id)
  if (content.status === 'published') {
    const remaining = assertMutation(await supabase.from('source_links').select('id').eq('editorial_content_id', id), 'No se pudieron comprobar las fuentes') || []
    if (remaining.length <= 1) throw new Error('Una noticia publicada necesita al menos una fuente. Añade otra antes de retirar esta, o pasa la noticia a borrador.')
  }
  const removed = assertMutation(await supabase.from('source_links').delete().eq('id', linkId).eq('editorial_content_id', id).select('id'), 'No se pudo retirar la fuente')
  if (!removed?.length) throw new Error('No se ha retirado ninguna fuente: comprueba que sigue enlazada.')
  await audit(supabase, user, { action_type: 'update', object_id: id, summary: 'Fuente retirada de la noticia (el registro de la fuente se conserva)', changed_fields: { source_link_id: linkId } })
  await refreshNews(supabase, id)
  redirectEditor(id, 'source-removed')
}

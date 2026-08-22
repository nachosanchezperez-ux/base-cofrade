'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const ENTITY_TYPES = [
  'brotherhood',
  'image',
  'step',
  'band',
  'agent',
  'heritage_asset',
  'march',
  'event',
  'advocation',
]
const PANEL_ROUTES = {
  brotherhood: 'hermandades',
  image: 'imagenes',
  step: 'pasos',
  band: 'bandas',
  agent: 'agentes',
}
const PUBLIC_ROUTES = {
  brotherhood: 'hermandades',
  image: 'imagenes',
  step: 'pasos',
  band: 'bandas',
}

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function optionalValue(formData, name) {
  return value(formData, name) || null
}

function uuid(formData, name, { optional = false } = {}) {
  const candidate = value(formData, name)
  if (optional && !candidate) return null
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function optionalDate(formData, name, label) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || Number.isNaN(Date.parse(`${candidate}T00:00:00Z`))) {
    throw new Error(`${label} no es válida.`)
  }
  return candidate
}

function normalizeUrl(candidate) {
  if (!candidate) return null
  const prepared = /^[a-z][a-z0-9+.-]*:\/\//i.test(candidate) ? candidate : `https://${candidate}`
  let parsed
  try {
    parsed = new URL(prepared)
  } catch {
    throw new Error('La URL de la Fuente no es válida.')
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error('La URL de la Fuente debe usar http o https.')
  }
  parsed.hash = ''
  parsed.hostname = parsed.hostname.toLowerCase()
  let normalized = parsed.toString()
  if (!parsed.search) normalized = normalized.replace(/\/+$/, '')
  return normalized
}

function urlVariants(url) {
  if (!url) return []
  return [...new Set([url, url.endsWith('/') ? url.slice(0, -1) : `${url}/`].filter(Boolean))]
}

function assertRow(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  if (!result.data) throw new Error(label)
  return result.data
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la operación de Fuentes', error)
}

async function loadTarget(supabase, entityId) {
  return assertRow(
    await supabase
      .from('entities')
      .select('id, entity_type, name, slug, status')
      .eq('id', entityId)
      .in('entity_type', ENTITY_TYPES)
      .neq('status', 'archived')
      .maybeSingle(),
    'La entidad seleccionada no existe o no está disponible.'
  )
}

async function loadSource(supabase, sourceId) {
  return assertRow(
    await supabase
      .from('sources')
      .select('id, name, url, source_type')
      .eq('id', sourceId)
      .maybeSingle(),
    'La Fuente seleccionada no existe o no está disponible.'
  )
}

async function findSourceByUrl(supabase, url) {
  if (!url) return null
  const result = await supabase
    .from('sources')
    .select('id, name, url, source_type')
    .in('url', urlVariants(url))
    .limit(1)
    .maybeSingle()
  if (result.error) throw new Error(`No se pudo comprobar la URL de la Fuente: ${result.error.message}`)
  return result.data || null
}

async function ensureSourceLink(supabase, sourceId, entityId) {
  const existing = await supabase
    .from('source_links')
    .select('id')
    .eq('source_id', sourceId)
    .eq('entity_id', entityId)
    .limit(1)
    .maybeSingle()
  if (existing.error) throw new Error(`No se pudo comprobar el vínculo de la Fuente: ${existing.error.message}`)
  if (existing.data) return { id: existing.data.id, created: false }

  const created = assertRow(
    await supabase
      .from('source_links')
      .insert({ source_id: sourceId, entity_id: entityId, scope: 'entity' })
      .select('id')
      .single(),
    'No se pudo vincular la Fuente'
  )
  return { id: created.id, created: true }
}

async function refreshSourceViews(supabase, entityId = null) {
  revalidatePath('/panel/fuentes')
  revalidatePath('/')
  if (!entityId) return
  const result = await supabase
    .from('entities')
    .select('entity_type, slug')
    .eq('id', entityId)
    .maybeSingle()
  if (!result.data) return

  const panelRoute = PANEL_ROUTES[result.data.entity_type]
  if (panelRoute) revalidatePath(`/panel/${panelRoute}/${entityId}`)

  const publicRoute = PUBLIC_ROUTES[result.data.entity_type]
  if (publicRoute && result.data.slug) revalidatePath(`/${publicRoute}/${result.data.slug}`)
}

function redirectSaved(result, entityId = null) {
  const params = new URLSearchParams({ saved: result })
  if (entityId) params.set('entity', entityId)
  redirect(`/panel/fuentes?${params.toString()}`)
}

export async function createSourceAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const name = value(formData, 'name')
  const sourceType = value(formData, 'source_type') || 'website'
  const url = normalizeUrl(value(formData, 'url'))
  const targetId = uuid(formData, 'entity_id', { optional: true })

  if (!name) throw new Error('El nombre de la Fuente es obligatorio.')
  if (sourceType.length > 100) throw new Error('El tipo de Fuente es demasiado largo.')

  const publicationDate = optionalDate(formData, 'publication_date', 'La fecha de publicación')
  const accessedAt = optionalDate(formData, 'accessed_at', 'La fecha de consulta')
  const target = targetId ? await loadTarget(supabase, targetId) : null
  const duplicate = await findSourceByUrl(supabase, url)

  if (duplicate) {
    if (target) {
      const link = await ensureSourceLink(supabase, duplicate.id, target.id)
      if (link.created) {
        await audit(supabase, user, {
          action_type: 'link',
          object_type: 'source_link',
          object_id: link.id,
          entity_id: target.id,
          summary: `Fuente reutilizada por URL: ${duplicate.name} → ${target.name}`,
          changed_fields: { source_id: duplicate.id, entity_id: target.id },
        })
      }
      await refreshSourceViews(supabase, target.id)
      redirectSaved(link.created ? 'reused-linked' : 'already-linked', target.id)
    }
    redirectSaved('duplicate-url')
  }

  const payload = {
    name,
    url,
    source_type: sourceType,
    author_or_publisher: optionalValue(formData, 'author_or_publisher'),
    publication_date: publicationDate,
    accessed_at: accessedAt,
    license: optionalValue(formData, 'license'),
    notes: optionalValue(formData, 'notes'),
  }

  const source = assertRow(
    await supabase.from('sources').insert(payload).select('id, name').single(),
    'No se pudo crear la Fuente'
  )

  let link = null
  if (target) link = await ensureSourceLink(supabase, source.id, target.id)

  await audit(supabase, user, {
    action_type: 'create',
    object_type: 'source',
    object_id: source.id,
    entity_id: target?.id || null,
    summary: target ? `Fuente creada y vinculada: ${source.name} → ${target.name}` : `Fuente creada: ${source.name}`,
    changed_fields: payload,
  })
  await refreshSourceViews(supabase, target?.id || null)
  redirectSaved(link?.created ? 'created-linked' : 'created', target?.id || null)
}

export async function linkExistingSourceAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const sourceId = uuid(formData, 'source_id')
  const entityId = uuid(formData, 'entity_id')
  const [source, target] = await Promise.all([
    loadSource(supabase, sourceId),
    loadTarget(supabase, entityId),
  ])

  const link = await ensureSourceLink(supabase, source.id, target.id)
  if (link.created) {
    await audit(supabase, user, {
      action_type: 'link',
      object_type: 'source_link',
      object_id: link.id,
      entity_id: target.id,
      summary: `Fuente vinculada: ${source.name} → ${target.name}`,
      changed_fields: { source_id: source.id, entity_id: target.id },
    })
  }

  await refreshSourceViews(supabase, target.id)
  redirectSaved(link.created ? 'linked' : 'already-linked', target.id)
}

export async function unlinkSourceAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const linkId = uuid(formData, 'link_id')

  const link = assertRow(
    await supabase
      .from('source_links')
      .select('id, source_id, entity_id')
      .eq('id', linkId)
      .not('entity_id', 'is', null)
      .maybeSingle(),
    'El vínculo de Fuente no existe o no corresponde a una entidad.'
  )
  const [source, target] = await Promise.all([
    loadSource(supabase, link.source_id),
    loadTarget(supabase, link.entity_id),
  ])

  const deleted = await supabase.from('source_links').delete().eq('id', link.id).select('id').single()
  assertRow(deleted, 'No se pudo retirar el vínculo de la Fuente')

  await audit(supabase, user, {
    action_type: 'unlink',
    object_type: 'source_link',
    object_id: link.id,
    entity_id: target.id,
    summary: `Vínculo retirado sin borrar la Fuente: ${source.name} ↔ ${target.name}`,
    changed_fields: { source_id: source.id, entity_id: target.id },
  })
  await refreshSourceViews(supabase, target.id)
  redirectSaved('unlinked', target.id)
}

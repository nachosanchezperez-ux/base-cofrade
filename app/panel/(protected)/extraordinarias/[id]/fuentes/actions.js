'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelAdmin, requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

function value(formData, name) { return String(formData.get(name) || '').trim() }
function nullable(formData, name) { return value(formData, name) || null }
function uuid(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}
function optionalDate(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate)) throw new Error('Fecha no válida.')
  return candidate
}

async function loadOuting(supabase, id) {
  const result = await supabase.from('outings').select('id, slug, title').eq('id', id).eq('character', 'extraordinary').maybeSingle()
  if (result.error) throw new Error(`No se pudo cargar la extraordinaria: ${result.error.message}`)
  if (!result.data) throw new Error('La extraordinaria no existe.')
  return result.data
}

async function audit(supabase, user, outing, objectId, actionType, summary, changedFields) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    action_type: actionType,
    object_type: 'outing_source',
    object_id: objectId,
    summary,
    changed_fields: changedFields,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo auditar la Fuente de Extraordinarias', error)
}

function refresh(outing) {
  revalidatePath('/extraordinarias')
  if (outing.slug) revalidatePath(`/extraordinarias/${outing.slug}`)
  revalidatePath(`/panel/extraordinarias/${outing.id}`)
  revalidatePath(`/panel/extraordinarias/${outing.id}/fuentes`)
  revalidatePath('/panel/fuentes')
}

export async function addExtraordinarySourceAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const outing = await loadOuting(supabase, outingId)
  const name = value(formData, 'name')
  const url = nullable(formData, 'url')
  const sourceType = value(formData, 'source_type') || 'Fuente oficial'
  const scope = nullable(formData, 'scope')
  const linkNotes = nullable(formData, 'link_notes')
  if (!name) throw new Error('El nombre de la Fuente es obligatorio.')

  let source = null
  if (url) {
    const existing = await supabase.from('sources').select('id, name').eq('url', url).limit(1).maybeSingle()
    if (existing.error) throw new Error(`No se pudo comprobar la Fuente: ${existing.error.message}`)
    source = existing.data || null
  }

  if (!source) {
    const created = await supabase.from('sources').insert({
      name,
      url,
      source_type: sourceType,
      author_or_publisher: nullable(formData, 'author_or_publisher'),
      publication_date: optionalDate(formData, 'publication_date'),
      accessed_at: optionalDate(formData, 'accessed_at'),
      notes: nullable(formData, 'source_notes'),
    }).select('id, name').single()
    if (created.error) throw new Error(`No se pudo crear la Fuente: ${created.error.message}`)
    source = created.data
  }

  const existingLink = await supabase.from('source_links').select('id').eq('outing_id', outingId).eq('source_id', source.id).limit(1).maybeSingle()
  if (existingLink.error) throw new Error(`No se pudo comprobar el vínculo: ${existingLink.error.message}`)

  let linkId = existingLink.data?.id || null
  if (linkId) {
    const updated = await supabase.from('source_links').update({ scope, notes: linkNotes }).eq('id', linkId).select('id').single()
    if (updated.error) throw new Error(`No se pudo actualizar el vínculo: ${updated.error.message}`)
  } else {
    const linked = await supabase.from('source_links').insert({ source_id: source.id, outing_id: outingId, scope, notes: linkNotes }).select('id').single()
    if (linked.error) throw new Error(`No se pudo vincular la Fuente: ${linked.error.message}`)
    linkId = linked.data.id
  }

  await audit(supabase, user, outing, linkId, existingLink.data ? 'update' : 'link', `Fuente ${existingLink.data ? 'actualizada' : 'vinculada'}: ${source.name}`, { source_id: source.id, scope, notes: linkNotes })
  refresh(outing)
  redirect(`/panel/extraordinarias/${outingId}/fuentes?saved=linked`)
}

export async function updateExtraordinarySourceLinkAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const linkId = uuid(formData, 'source_link_id')
  const outing = await loadOuting(supabase, outingId)
  const link = await supabase.from('source_links').select('id, source_id').eq('id', linkId).eq('outing_id', outingId).maybeSingle()
  if (link.error) throw new Error(`No se pudo cargar el vínculo: ${link.error.message}`)
  if (!link.data) throw new Error('El vínculo de Fuente no existe.')
  const payload = { scope: nullable(formData, 'scope'), notes: nullable(formData, 'link_notes') }
  const updated = await supabase.from('source_links').update(payload).eq('id', linkId).select('id').single()
  if (updated.error) throw new Error(`No se pudo actualizar la Fuente: ${updated.error.message}`)
  await audit(supabase, user, outing, linkId, 'update', 'Alcance documental actualizado', { source_id: link.data.source_id, ...payload })
  refresh(outing)
  redirect(`/panel/extraordinarias/${outingId}/fuentes?saved=updated`)
}

export async function unlinkExtraordinarySourceAction(formData) {
  const user = await requirePanelAdmin()
  const supabase = await createClient()
  const outingId = uuid(formData, 'outing_id')
  const linkId = uuid(formData, 'source_link_id')
  const outing = await loadOuting(supabase, outingId)
  const link = await supabase.from('source_links').select('id, source_id, sources(name)').eq('id', linkId).eq('outing_id', outingId).maybeSingle()
  if (link.error) throw new Error(`No se pudo cargar el vínculo: ${link.error.message}`)
  if (!link.data) throw new Error('El vínculo de Fuente no existe.')
  const removed = await supabase.from('source_links').delete().eq('id', linkId).select('id').single()
  if (removed.error) throw new Error(`No se pudo retirar la Fuente: ${removed.error.message}`)
  const source = Array.isArray(link.data.sources) ? link.data.sources[0] : link.data.sources
  await audit(supabase, user, outing, linkId, 'unlink', `Fuente retirada sin borrar el documento: ${source?.name || link.data.source_id}`, { source_id: link.data.source_id })
  refresh(outing)
  redirect(`/panel/extraordinarias/${outingId}/fuentes?saved=unlinked`)
}

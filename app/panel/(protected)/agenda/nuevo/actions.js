'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { revalidateAgendaPhotos } from '@/lib/panel/revalidate-agenda'
import { PANEL_IMAGE_MAX_BYTES, PANEL_IMAGE_TYPES } from '@/lib/panel/signed-image-upload'
import { parseQuickAct, quickActTitle, quickCultPayloads, quickOutingPayload, slugify } from '@/lib/panel/quick-act-core'
import { createClient } from '@/lib/supabase/server'

const BUCKET = 'hilo-media'
const RIGHTS = new Set(['owned', 'authorized'])

function fail(message) {
  return { error: message }
}

async function uniqueOutingSlug(supabase, base) {
  const root = base || 'acto'
  for (let index = 1; index <= 99; index += 1) {
    const candidate = index === 1 ? root : `${root}-${index}`
    const existing = await supabase.from('outings').select('id').eq('slug', candidate).limit(1).maybeSingle()
    if (existing.error) throw new Error(`No se pudo validar la dirección: ${existing.error.message}`)
    if (!existing.data) return candidate
  }
  throw new Error('No se pudo generar una dirección única para el acto.')
}

// Foto o cartel opcional. Se valida tipo y tamaño antes de subir nada.
function readImage(formData) {
  const file = formData.get('image')
  if (!(file instanceof File) || !file.size) return null
  const extension = PANEL_IMAGE_TYPES.get(file.type)
  if (!extension) throw new Error('La imagen debe ser JPG, PNG, WEBP, GIF o AVIF.')
  if (file.size > PANEL_IMAGE_MAX_BYTES) throw new Error('La imagen supera los 10 MB.')
  const credit = String(formData.get('image_credit') || '').trim().slice(0, 180)
  const alt = String(formData.get('image_alt') || '').trim().slice(0, 300)
  const rights = String(formData.get('image_rights') || '')
  if (!RIGHTS.has(rights)) throw new Error('Confirma de quién son los derechos de la imagen.')
  return { file, extension, credit, alt, rights, fit: formData.get('image_kind') === 'poster' ? 'contain' : 'cover' }
}

async function audit(supabase, user, objectType, objectId, summary, fields) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id, actor_label: user.name, action_type: 'create',
    object_type: objectType, object_id: objectId, summary, changed_fields: fields,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo auditar el alta rápida', error)
}

export async function createQuickActAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const parsed = parseQuickAct((name) => formData.get(name))
  if (parsed.errors) return fail(parsed.errors.join(' '))
  const { act } = parsed

  let image = null
  try { image = readImage(formData) } catch (error) { return fail(error.message) }
  if (image && !image.alt) return fail('Describe la imagen (texto alternativo).')

  const brotherhood = await supabase.from('entities').select('id, name, slug').eq('id', act.brotherhoodId).eq('entity_type', 'brotherhood').maybeSingle()
  if (brotherhood.error || !brotherhood.data) return fail('No se encontró la Hermandad.')
  const brotherhoodName = brotherhood.data.name

  // Sin duplicados: el mismo tipo de acto de la misma Hermandad el mismo día.
  let target = ''
  let uploadedPath = ''
  if (act.type.group === 'outing') {
    const duplicate = await supabase.from('outings').select('id').eq('brotherhood_entity_id', act.brotherhoodId).eq('outing_date', act.startDate).eq('outing_type', act.type.outingType).neq('status', 'archived').limit(1).maybeSingle()
    if (duplicate.error) return fail('No se pudo comprobar si el acto ya existe. Inténtalo de nuevo.')
    if (duplicate.data) return fail('Ya existe esa salida de la Hermandad en esa fecha. Revísala en su ficha antes de crear otra.')
    const slug = await uniqueOutingSlug(supabase, slugify(`${quickActTitle(act, brotherhoodName)}-${act.startDate.slice(0, 4)}`))
    const payload = quickOutingPayload(act, { brotherhoodName, slug })
    const created = await supabase.from('outings').insert(payload).select('id').single()
    if (created.error) return fail(`No se pudo crear la salida: ${created.error.message}`)
    target = created.data.id
    await audit(supabase, user, 'outing', target, `Alta rápida: ${payload.title}`, payload)

    if (image) {
      uploadedPath = `salidas/${target}/${randomUUID()}.${image.extension}`
      const uploaded = await supabase.storage.from(BUCKET).upload(uploadedPath, image.file, { contentType: image.file.type, upsert: false })
      if (uploaded.error) return fail(`La salida se creó, pero no se pudo subir la imagen: ${uploaded.error.message}`)
      const publicUrl = supabase.storage.from(BUCKET).getPublicUrl(uploadedPath).data.publicUrl
      const updated = await supabase.from('outings').update({
        hero_image_path: publicUrl, hero_image_alt: image.alt, hero_image_credit: image.credit || null, hero_image_fit: image.fit,
      }).eq('id', target)
      if (updated.error) {
        await supabase.storage.from(BUCKET).remove([uploadedPath])
        return fail(`La salida se creó, pero no se pudo vincular la imagen: ${updated.error.message}`)
      }
    }
  } else {
    // Se reutiliza el culto del mismo tipo de la Hermandad, si existe.
    const existing = await supabase.from('cults').select('id').eq('brotherhood_entity_id', act.brotherhoodId).ilike('cult_type', act.type.cultType).neq('status', 'archived').order('created_at').limit(1).maybeSingle()
    if (existing.error) return fail('No se pudo consultar el culto de la Hermandad. Inténtalo de nuevo.')
    const payloads = quickCultPayloads(act, { brotherhoodName, existingCultId: existing.data?.id || '' })
    let cultId = existing.data?.id || ''
    if (!cultId) {
      const createdCult = await supabase.from('cults').insert(payloads.cult).select('id').single()
      if (createdCult.error) return fail(`No se pudo crear el culto: ${createdCult.error.message}`)
      cultId = createdCult.data.id
      await audit(supabase, user, 'cult', cultId, `Alta rápida (culto): ${payloads.cult.title}`, payloads.cult)
    }
    const duplicate = await supabase.from('cult_occurrences').select('id').eq('cult_id', cultId).eq('start_date', act.startDate).neq('status', 'archived').limit(1).maybeSingle()
    if (duplicate.error) return fail('No se pudo comprobar si el acto ya existe. Inténtalo de nuevo.')
    if (duplicate.data) return fail('Ese culto ya tiene una convocatoria en esa fecha. Revísala antes de crear otra.')
    const occurrence = await supabase.from('cult_occurrences').insert({ cult_id: cultId, ...payloads.occurrence }).select('id').single()
    if (occurrence.error) return fail(`No se pudo crear la convocatoria del culto: ${occurrence.error.message}`)
    target = occurrence.data.id
    const days = await supabase.from('cult_occurrence_days').insert(payloads.days.map((day) => ({ cult_occurrence_id: target, ...day })))
    if (days.error) console.error('[Hilo Cofrade] No se pudieron crear los días del culto', days.error)
    await audit(supabase, user, 'cult_occurrence', target, `Alta rápida: ${payloads.occurrence.title_override}`, { cult_id: cultId, ...payloads.occurrence, days: payloads.days.length })

    if (image) {
      uploadedPath = `cultos/${cultId}/${randomUUID()}.${image.extension}`
      const uploaded = await supabase.storage.from(BUCKET).upload(uploadedPath, image.file, { contentType: image.file.type, upsert: false })
      if (uploaded.error) return fail(`El culto se creó, pero no se pudo subir la imagen: ${uploaded.error.message}`)
      const asset = await supabase.from('media_assets').insert({
        storage_path: uploadedPath, media_type: 'image', title: payloads.occurrence.title_override,
        alt_text: image.alt, author_name: image.credit || null, rights_status: image.rights,
      }).select('id').single()
      if (asset.error) {
        await supabase.storage.from(BUCKET).remove([uploadedPath])
        return fail(`El culto se creó, pero no se pudo registrar la imagen: ${asset.error.message}`)
      }
      await supabase.from('cult_media').update({ is_cover: false, role: 'gallery' }).eq('cult_id', cultId).eq('is_cover', true)
      const link = await supabase.from('cult_media').insert({
        cult_id: cultId, media_asset_id: asset.data.id, role: 'cover', sort_order: 0, is_cover: true, focus_x: 50, focus_y: 50, fit_mode: image.fit,
      })
      if (link.error) console.error('[Hilo Cofrade] No se pudo vincular la imagen del culto', link.error)
    }
  }

  revalidatePath('/panel')
  revalidatePath(`/panel/hermandades/${act.brotherhoodId}`)
  if (brotherhood.data.slug) revalidatePath(`/hermandades/${brotherhood.data.slug}`)
  revalidatePath('/extraordinarias')
  revalidatePath('/procesiones-de-gloria')
  revalidateAgendaPhotos()
  redirect(`/panel/agenda/nuevo?creado=${act.type.group === 'outing' ? 'salida' : 'culto'}&id=${target}&hermandad=${act.brotherhoodId}&estado=${act.publish ? 'publicado' : 'borrador'}`)
}

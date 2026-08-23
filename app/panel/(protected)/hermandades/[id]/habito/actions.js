'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import {
  getHiloMediaStoragePath,
  normalizeHiloMediaReference,
} from '@/lib/supabase/hilo-media-paths'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])
const ALLOWED_IMAGES = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
  ['image/avif', 'avif'],
])
const MAX_BYTES = 10 * 1024 * 1024

function value(formData, name) { return String(formData.get(name) || '').trim() }
function nullable(formData, name) { return value(formData, name) || null }
function required(formData, name, label) {
  const candidate = value(formData, name)
  if (!candidate) throw new Error(`${label} es obligatorio.`)
  return candidate
}
function uuid(formData, name, optional = false) {
  const candidate = value(formData, name)
  if (optional && !candidate) return null
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}
function integer(formData, name, fallback = 0) {
  const candidate = value(formData, name)
  if (!candidate) return fallback
  const parsed = Number.parseInt(candidate, 10)
  if (!Number.isFinite(parsed)) throw new Error(`${name} debe ser un número entero.`)
  return parsed
}
function status(formData) {
  const candidate = value(formData, 'status') || 'draft'
  if (!STATUSES.has(candidate)) throw new Error('Estado editorial no válido.')
  return candidate
}
function assertRow(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  if (!result.data) throw new Error(label)
  return result.data
}
function assertMutation(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({ actor_user_id: user.id, actor_label: user.name, ...entry })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición del hábito', error)
}

async function requireBrotherhood(supabase, brotherhoodId) {
  return assertRow(
    await supabase.from('entities').select('id, name, slug').eq('id', brotherhoodId).eq('entity_type', 'brotherhood').maybeSingle(),
    'La Hermandad no existe.'
  )
}

async function requireHabit(supabase, brotherhoodId, habitId) {
  return assertRow(
    await supabase.from('brotherhood_habits').select('*').eq('id', habitId).eq('brotherhood_entity_id', brotherhoodId).maybeSingle(),
    'El hábito no existe o no pertenece a esta Hermandad.'
  )
}

async function refresh(supabase, brotherhoodId) {
  const entity = await requireBrotherhood(supabase, brotherhoodId)
  revalidatePath('/panel')
  revalidatePath(`/panel/hermandades/${brotherhoodId}`)
  revalidatePath(`/panel/hermandades/${brotherhoodId}/habito`)
  revalidatePath('/hermandades')
  if (entity.slug) revalidatePath(`/hermandades/${entity.slug}`)
}

function redirectSaved(brotherhoodId, saved, anchor = '') {
  const hash = anchor ? `#${anchor}` : ''
  redirect(`/panel/hermandades/${brotherhoodId}/habito?saved=${saved}${hash}`)
}

export async function saveBrotherhoodHabitAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const habitId = uuid(formData, 'habit_id', true)
  const brotherhood = await requireBrotherhood(supabase, brotherhoodId)
  const imagePath = normalizeHiloMediaReference(nullable(formData, 'image_path')) || null

  const payload = {
    brotherhood_entity_id: brotherhoodId,
    name: required(formData, 'name', 'El nombre del hábito'),
    tunic_description: nullable(formData, 'tunic_description'),
    hood_description: nullable(formData, 'hood_description'),
    cord_description: nullable(formData, 'cord_description'),
    buttons_description: nullable(formData, 'buttons_description'),
    shield_description: nullable(formData, 'shield_description'),
    footwear_description: nullable(formData, 'footwear_description'),
    image_path: imagePath,
    image_alt: nullable(formData, 'image_alt'),
    sort_order: integer(formData, 'sort_order', 0),
    notes: nullable(formData, 'notes'),
    status: status(formData),
  }

  const result = habitId
    ? await supabase.from('brotherhood_habits').update(payload).eq('id', habitId).eq('brotherhood_entity_id', brotherhoodId).select('id').single()
    : await supabase.from('brotherhood_habits').insert(payload).select('id').single()
  const saved = assertRow(result, 'No se pudo guardar el hábito. Comprueba que no exista otro con el mismo nombre.')

  await audit(supabase, user, {
    action_type: habitId ? 'update' : 'create',
    object_type: 'brotherhood_habit',
    object_id: saved.id,
    entity_id: brotherhoodId,
    summary: `${habitId ? 'Hábito actualizado' : 'Hábito creado'}: ${payload.name} · ${brotherhood.name}`,
    changed_fields: payload,
  })
  await refresh(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, habitId ? 'updated' : 'created', `habit-${saved.id}`)
}

export async function archiveBrotherhoodHabitAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const habitId = uuid(formData, 'habit_id')
  const saved = assertRow(
    await supabase.from('brotherhood_habits').update({ status: 'archived' }).eq('id', habitId).eq('brotherhood_entity_id', brotherhoodId).select('id, name').single(),
    'No se pudo archivar el hábito.'
  )
  await audit(supabase, user, { action_type: 'archive', object_type: 'brotherhood_habit', object_id: saved.id, entity_id: brotherhoodId, summary: `Hábito archivado: ${saved.name}` })
  await refresh(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'archived', 'habitos')
}

export async function uploadBrotherhoodHabitImageAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const habitId = uuid(formData, 'habit_id')
  const habit = await requireHabit(supabase, brotherhoodId, habitId)
  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) throw new Error('Selecciona una imagen para el hábito.')
  if (file.size > MAX_BYTES) throw new Error('La imagen no puede superar 10 MB.')
  const extension = ALLOWED_IMAGES.get(file.type)
  if (!extension) throw new Error('Formato no admitido. Usa JPG, PNG, WEBP, GIF o AVIF.')

  const storagePath = `habitos/${brotherhoodId}/${habitId}/${randomUUID()}.${extension}`
  const uploaded = await supabase.storage.from('hilo-media').upload(storagePath, file, { contentType: file.type, upsert: false })
  assertMutation(uploaded, 'No se pudo subir la imagen del hábito')
  const imageAlt = required(formData, 'image_alt', 'El texto alternativo')

  const updated = await supabase
    .from('brotherhood_habits')
    .update({ image_path: storagePath, image_alt: imageAlt })
    .eq('id', habitId)
    .eq('brotherhood_entity_id', brotherhoodId)
  if (updated.error) {
    await supabase.storage.from('hilo-media').remove([storagePath])
    throw new Error(`No se pudo asociar la imagen al hábito: ${updated.error.message}`)
  }

  const previousStoragePath = getHiloMediaStoragePath(habit.image_path)
  if (previousStoragePath && previousStoragePath !== storagePath) {
    const removed = await supabase.storage.from('hilo-media').remove([previousStoragePath])
    if (removed.error) console.error('[Hilo Cofrade] No se pudo limpiar la imagen anterior del hábito', removed.error)
  }

  await audit(supabase, user, {
    action_type: 'update',
    object_type: 'brotherhood_habit',
    object_id: habitId,
    entity_id: brotherhoodId,
    summary: `Imagen del hábito actualizada: ${habit.name}`,
    changed_fields: { image_path: storagePath, image_alt: imageAlt },
  })
  await refresh(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'image', `habit-${habitId}`)
}

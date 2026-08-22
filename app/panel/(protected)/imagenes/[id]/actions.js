'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function nullable(formData, name) {
  return value(formData, name) || null
}

function required(formData, name, label) {
  const candidate = value(formData, name)
  if (!candidate) throw new Error(`${label} es obligatorio.`)
  return candidate
}

function uuid(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function slugify(valueToSlug) {
  return String(valueToSlug || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function normalizeIdentity(identity) {
  return String(identity || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function optionalDate(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || Number.isNaN(Date.parse(`${candidate}T00:00:00Z`))) {
    throw new Error(`La fecha de ${name} no es válida.`)
  }
  return candidate
}

function optionalNumber(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  const parsed = Number.parseFloat(candidate.replace(',', '.'))
  if (!Number.isFinite(parsed) || parsed <= 0) throw new Error(`${name} debe ser un número positivo.`)
  return parsed
}

function entityStatus(formData) {
  const candidate = value(formData, 'status') || 'draft'
  if (!STATUSES.has(candidate)) throw new Error('Estado editorial no válido.')
  return candidate
}

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

function assertMutation(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición de la imagen', error)
}

async function ensureUniqueIdentity(supabase, { imageId, name, slug }) {
  const [slugResult, imagesResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, entity_type, name, slug, status')
      .eq('slug', slug)
      .neq('id', imageId)
      .limit(1),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'image')
      .neq('id', imageId),
  ])

  const slugMatch = (assertQuery(slugResult, 'No se pudo comprobar el slug') || [])[0]
  if (slugMatch) throw new Error(`El slug «${slug}» ya pertenece a otra entidad.`)

  const duplicate = (assertQuery(imagesResult, 'No se pudieron comprobar posibles duplicados') || [])
    .find((item) => normalizeIdentity(item.name) === normalizeIdentity(name))

  if (duplicate && slug === slugify(name)) {
    throw new Error(`Ya existe una imagen con ese nombre: ${duplicate.name}. Usa un slug específico solo si se trata de otra imagen física.`)
  }
}

function auditAction(currentStatus, nextStatus) {
  if (currentStatus !== 'published' && nextStatus === 'published') return 'publish'
  if (currentStatus === 'published' && nextStatus !== 'published') return 'unpublish'
  if (nextStatus === 'archived') return 'archive'
  return 'update'
}

export async function updateImageAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const imageId = uuid(formData, 'image_id')
  const imageName = required(formData, 'name', 'El nombre de la imagen')
  const entitySlug = slugify(required(formData, 'slug', 'El slug'))
  const nextStatus = entityStatus(formData)

  if (!entitySlug) throw new Error('No se ha podido generar un slug válido.')
  if (entitySlug.length > 160) throw new Error('El slug es demasiado largo.')

  const current = assertQuery(
    await supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', imageId)
      .eq('entity_type', 'image')
      .maybeSingle(),
    'No se pudo comprobar la imagen'
  )

  if (!current) throw new Error('La imagen ya no existe.')
  if (current.status === 'published' && current.slug !== entitySlug) {
    throw new Error('El slug de una imagen publicada no puede cambiarse. Retira primero la publicación si necesitas modificar la URL pública.')
  }

  await ensureUniqueIdentity(supabase, { imageId, name: imageName, slug: entitySlug })

  const entityPayload = {
    name: imageName,
    slug: entitySlug,
    summary: nullable(formData, 'summary'),
    status: nextStatus,
  }
  const imagePayload = {
    image_type: nullable(formData, 'image_type'),
    execution_date: optionalDate(formData, 'execution_date'),
    execution_date_text: nullable(formData, 'execution_date_text'),
    material: nullable(formData, 'material'),
    technique: nullable(formData, 'technique'),
    polychromy: nullable(formData, 'polychromy'),
    dimensions_text: nullable(formData, 'dimensions_text'),
    height_cm: optionalNumber(formData, 'height_cm'),
    width_cm: optionalNumber(formData, 'width_cm'),
    depth_cm: optionalNumber(formData, 'depth_cm'),
    iconography: nullable(formData, 'iconography'),
    anatomical_type: nullable(formData, 'anatomical_type'),
    is_dress_image: formData.get('is_dress_image') === 'on',
    current_condition: nullable(formData, 'current_condition'),
    current_state_notes: nullable(formData, 'current_state_notes'),
    description: nullable(formData, 'description'),
    notes: nullable(formData, 'notes'),
  }

  assertMutation(
    await supabase.from('entities').update(entityPayload).eq('id', imageId).eq('entity_type', 'image'),
    'No se pudo actualizar la entidad de imagen'
  )
  assertMutation(
    await supabase.from('images').update(imagePayload).eq('entity_id', imageId),
    'No se pudo actualizar la ficha de imagen'
  )

  await audit(supabase, user, {
    action_type: auditAction(current.status, nextStatus),
    object_type: 'image',
    object_id: imageId,
    entity_id: imageId,
    summary: `Imagen actualizada: ${imageName}`,
    changed_fields: { entity: entityPayload, image: imagePayload },
  })

  revalidatePath('/panel')
  revalidatePath('/panel/imagenes')
  revalidatePath(`/panel/imagenes/${imageId}`)
  revalidatePath('/imagenes')
  revalidatePath('/')
  if (current.slug) revalidatePath(`/imagenes/${current.slug}`)
  if (entitySlug !== current.slug) revalidatePath(`/imagenes/${entitySlug}`)
  redirect(`/panel/imagenes/${imageId}?saved=general`)
}

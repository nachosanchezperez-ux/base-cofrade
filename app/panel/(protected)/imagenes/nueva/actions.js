'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { PUBLIC_CACHE_TAGS, revalidatePublicData } from '@/lib/cache/public-cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

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

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
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
  if (error) console.error('[Hilo Cofrade] No se pudo registrar el alta de la imagen', error)
}

async function ensureUniqueIdentity(supabase, { name, slug, customSlug }) {
  const [slugResult, imagesResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, entity_type, name, slug, status')
      .eq('slug', slug)
      .limit(1),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'image'),
  ])

  const slugMatches = assertQuery(slugResult, 'No se pudo comprobar el slug')
  if (slugMatches.length) {
    throw new Error(`El slug «${slug}» ya pertenece a otra entidad.`)
  }

  if (!customSlug) {
    const normalizedName = normalizeIdentity(name)
    const duplicate = assertQuery(imagesResult, 'No se pudieron comprobar posibles duplicados')
      .find((item) => normalizeIdentity(item.name) === normalizedName)

    if (duplicate) {
      throw new Error(`Ya existe una imagen con ese nombre: ${duplicate.name}. Usa un slug específico solo si se trata de otra imagen física.`)
    }
  }
}

export async function createImageAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const imageName = required(formData, 'name', 'El nombre de la imagen')
  const submittedSlug = value(formData, 'slug')
  const entitySlug = slugify(submittedSlug || imageName)
  const imageType = nullable(formData, 'image_type')

  if (!entitySlug) throw new Error('No se ha podido generar un slug válido.')
  if (entitySlug.length > 160) throw new Error('El slug es demasiado largo.')

  await ensureUniqueIdentity(supabase, {
    name: imageName,
    slug: entitySlug,
    customSlug: Boolean(submittedSlug),
  })

  const imageId = randomUUID()
  const entityPayload = {
    id: imageId,
    entity_type: 'image',
    name: imageName,
    slug: entitySlug,
    status: 'draft',
  }
  const imagePayload = {
    entity_id: imageId,
    image_type: imageType,
  }

  assertMutation(
    await supabase.from('entities').insert(entityPayload).select('id').single(),
    'No se pudo crear la entidad de imagen'
  )

  const imageResult = await supabase
    .from('images')
    .insert(imagePayload)
    .select('entity_id')
    .single()

  if (imageResult.error) {
    const rollback = await supabase
      .from('entities')
      .delete()
      .eq('id', imageId)
      .eq('status', 'draft')

    if (rollback.error) {
      console.error('[Hilo Cofrade] No se pudo revertir una entidad creada sin ficha de imagen', {
        imageId,
        rollbackError: rollback.error.message,
      })
    }

    throw new Error(`No se pudo crear la ficha de imagen: ${imageResult.error.message}`)
  }

  await audit(supabase, user, {
    action_type: 'create',
    object_type: 'image',
    object_id: imageId,
    entity_id: imageId,
    summary: `Imagen creada como borrador: ${imageName}`,
    changed_fields: {
      entity: entityPayload,
      image: imagePayload,
    },
  })

  revalidatePath('/panel')
  revalidatePath('/panel/imagenes')
  revalidatePath(`/panel/imagenes/${imageId}`)
  revalidatePublicData(PUBLIC_CACHE_TAGS.IMAGES)
  redirect(`/panel/imagenes/${imageId}?saved=created`)
}

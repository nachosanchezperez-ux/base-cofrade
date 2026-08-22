'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'
import { assertRow, assertRows, uuidValue, writeAudit } from '@/lib/panel/relation-actions'

function relationStatus(image) {
  if (image.status === 'published') return 'published'
  if (image.status === 'review') return 'review'
  return 'draft'
}

async function refreshImage(supabase, imageId) {
  const imageResult = await supabase
    .from('entities')
    .select('slug')
    .eq('id', imageId)
    .eq('entity_type', 'image')
    .maybeSingle()

  revalidatePath('/panel')
  revalidatePath('/panel/imagenes')
  revalidatePath(`/panel/imagenes/${imageId}`)
  revalidatePath(`/panel/imagenes/${imageId}/autorias`)
  revalidatePath('/panel/datos/salud')
  revalidatePath('/imagenes')
  if (imageResult.data?.slug) revalidatePath(`/imagenes/${imageResult.data.slug}`)
}

export async function addAnonymousImageAuthorshipAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const imageId = uuidValue(formData, 'image_id')

  const image = assertRow(
    await supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', imageId)
      .eq('entity_type', 'image')
      .maybeSingle(),
    'La Imagen no existe o no está disponible.'
  )

  const equivalents = assertRows(
    await supabase
      .from('image_authorships')
      .select('id, status')
      .eq('image_entity_id', imageId)
      .is('agent_entity_id', null)
      .eq('authorship_type', 'anonymous')
      .eq('role_name', 'autor'),
    'No se pudo comprobar la autoría desconocida existente'
  )
  const equivalent = equivalents[0] || null

  if (equivalent && equivalent.status !== 'archived') {
    throw new Error('Esta Imagen ya tiene documentada la autoría como desconocida.')
  }

  const payload = {
    image_entity_id: imageId,
    agent_entity_id: null,
    authorship_type: 'anonymous',
    role_name: 'autor',
    certainty: 'unknown',
    date_from: null,
    date_from_text: null,
    date_to: null,
    date_to_text: null,
    notes: 'La documentación disponible no identifica al autor de la obra.',
    status: relationStatus(image),
  }

  const saved = equivalent
    ? assertRow(
        await supabase
          .from('image_authorships')
          .update(payload)
          .eq('id', equivalent.id)
          .select('id')
          .single(),
        'No se pudo restaurar la autoría desconocida'
      )
    : assertRow(
        await supabase
          .from('image_authorships')
          .insert(payload)
          .select('id')
          .single(),
        'No se pudo documentar la autoría desconocida'
      )

  await writeAudit(supabase, user, {
    action_type: equivalent ? 'update' : 'link',
    object_type: 'image_authorship',
    object_id: saved.id,
    entity_id: imageId,
    summary: `Autoría documentada como desconocida: ${image.name}`,
    changed_fields: payload,
  }, 'la autoría desconocida de la Imagen')

  await refreshImage(supabase, imageId)
  redirect(`/panel/imagenes/${imageId}/autorias?saved=anonymous`)
}

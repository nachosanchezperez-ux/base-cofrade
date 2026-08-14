'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

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
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición del paso', error)
}

async function ensureUniqueIdentity(supabase, { stepId, name, slug }) {
  const [slugResult, stepsResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, entity_type, name, slug, status')
      .eq('slug', slug)
      .neq('id', stepId)
      .limit(1),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'step')
      .neq('id', stepId),
  ])

  const slugMatch = (assertQuery(slugResult, 'No se pudo comprobar el slug') || [])[0]
  if (slugMatch) throw new Error(`El slug «${slug}» ya pertenece a otra entidad.`)

  const duplicate = (assertQuery(stepsResult, 'No se pudieron comprobar posibles duplicados') || [])
    .find((item) => normalizeIdentity(item.name) === normalizeIdentity(name))

  if (duplicate && slug === slugify(name)) {
    throw new Error(`Ya existe un paso con ese nombre: ${duplicate.name}. Usa un slug específico solo si se trata de otro paso físico.`)
  }
}

export async function updateStepAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const stepId = uuid(formData, 'step_id')
  const stepName = required(formData, 'name', 'El nombre del paso')
  const entitySlug = slugify(required(formData, 'slug', 'El slug'))
  const stepType = nullable(formData, 'step_type')

  if (!entitySlug) throw new Error('No se ha podido generar un slug válido.')
  if (entitySlug.length > 160) throw new Error('El slug es demasiado largo.')

  const current = assertQuery(
    await supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', stepId)
      .eq('entity_type', 'step')
      .maybeSingle(),
    'No se pudo comprobar el paso'
  )

  if (!current) throw new Error('El paso ya no existe.')
  if (current.status === 'published' && current.slug !== entitySlug) {
    throw new Error('El slug de un paso publicado no puede cambiarse desde este editor básico.')
  }

  await ensureUniqueIdentity(supabase, {
    stepId,
    name: stepName,
    slug: entitySlug,
  })

  const entityPayload = {
    name: stepName,
    slug: entitySlug,
  }
  const stepPayload = {
    step_type: stepType,
  }

  assertMutation(
    await supabase
      .from('entities')
      .update(entityPayload)
      .eq('id', stepId)
      .eq('entity_type', 'step'),
    'No se pudo actualizar la entidad de paso'
  )
  assertMutation(
    await supabase
      .from('steps')
      .update(stepPayload)
      .eq('entity_id', stepId),
    'No se pudo actualizar la ficha de paso'
  )

  await audit(supabase, user, {
    action_type: 'update',
    object_type: 'step',
    object_id: stepId,
    entity_id: stepId,
    summary: `Paso actualizado: ${stepName}`,
    changed_fields: {
      entity: entityPayload,
      step: stepPayload,
    },
  })

  revalidatePath('/panel')
  revalidatePath('/panel/pasos')
  revalidatePath(`/panel/pasos/${stepId}`)
  if (current.status === 'published') {
    revalidatePath('/pasos')
    revalidatePath(`/pasos/${current.slug}`)
  }
  redirect(`/panel/pasos/${stepId}?saved=general`)
}

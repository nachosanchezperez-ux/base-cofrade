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
  if (error) console.error('[Hilo Cofrade] No se pudo registrar el alta del paso', error)
}

async function ensureUniqueIdentity(supabase, { name, slug, customSlug }) {
  const [slugResult, stepsResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, entity_type, name, slug, status')
      .eq('slug', slug)
      .limit(1),
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('entity_type', 'step'),
  ])

  const slugMatches = assertQuery(slugResult, 'No se pudo comprobar el slug')
  if (slugMatches.length) {
    throw new Error(`El slug «${slug}» ya pertenece a otra entidad.`)
  }

  if (!customSlug) {
    const normalizedName = normalizeIdentity(name)
    const duplicate = assertQuery(stepsResult, 'No se pudieron comprobar posibles duplicados')
      .find((item) => normalizeIdentity(item.name) === normalizedName)

    if (duplicate) {
      throw new Error(`Ya existe un paso con ese nombre: ${duplicate.name}. Usa un slug específico solo si se trata de otro paso físico.`)
    }
  }
}

export async function createStepAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const stepName = required(formData, 'name', 'El nombre del paso')
  const submittedSlug = value(formData, 'slug')
  const entitySlug = slugify(submittedSlug || stepName)
  const stepType = nullable(formData, 'step_type')

  if (!entitySlug) throw new Error('No se ha podido generar un slug válido.')
  if (entitySlug.length > 160) throw new Error('El slug es demasiado largo.')

  await ensureUniqueIdentity(supabase, {
    name: stepName,
    slug: entitySlug,
    customSlug: Boolean(submittedSlug),
  })

  const stepId = randomUUID()
  const entityPayload = {
    id: stepId,
    entity_type: 'step',
    name: stepName,
    slug: entitySlug,
    status: 'draft',
  }
  const stepPayload = {
    entity_id: stepId,
    step_type: stepType,
  }

  assertMutation(
    await supabase.from('entities').insert(entityPayload).select('id').single(),
    'No se pudo crear la entidad de paso'
  )

  const stepResult = await supabase
    .from('steps')
    .insert(stepPayload)
    .select('entity_id')
    .single()

  if (stepResult.error) {
    const rollback = await supabase
      .from('entities')
      .delete()
      .eq('id', stepId)
      .eq('status', 'draft')

    if (rollback.error) {
      console.error('[Hilo Cofrade] No se pudo revertir una entidad creada sin ficha de paso', {
        stepId,
        rollbackError: rollback.error.message,
      })
    }

    throw new Error(`No se pudo crear la ficha de paso: ${stepResult.error.message}`)
  }

  await audit(supabase, user, {
    action_type: 'create',
    object_type: 'step',
    object_id: stepId,
    entity_id: stepId,
    summary: `Paso creado como borrador: ${stepName}`,
    changed_fields: {
      entity: entityPayload,
      step: stepPayload,
    },
  })

  revalidatePath('/panel')
  revalidatePath('/panel/pasos')
  revalidatePath(`/panel/pasos/${stepId}`)
  revalidatePublicData(PUBLIC_CACHE_TAGS.STEPS)
  redirect(`/panel/pasos/${stepId}?saved=created`)
}

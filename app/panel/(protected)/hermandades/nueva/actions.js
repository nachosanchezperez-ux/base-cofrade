'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

function value(formData, name) {
  return String(formData.get(name) || '').trim()
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
  if (error) console.error('[Hilo Cofrade] No se pudo registrar el alta de la hermandad', error)
}

async function ensureUniqueIdentity(supabase, { popularName, officialName, slug }) {
  const [slugResult, brotherhoodsResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, entity_type, name, slug, status')
      .eq('slug', slug)
      .limit(1),
    supabase
      .from('brotherhoods')
      .select('entity_id, popular_name, official_name'),
  ])

  const slugMatches = assertQuery(slugResult, 'No se pudo comprobar el slug')
  if (slugMatches.length) {
    throw new Error(`El slug «${slug}» ya pertenece a otra entidad.`)
  }

  const identityKeys = new Set([
    normalizeIdentity(popularName),
    normalizeIdentity(officialName),
  ].filter(Boolean))
  const duplicate = assertQuery(brotherhoodsResult, 'No se pudieron comprobar posibles duplicados')
    .find((item) => (
      identityKeys.has(normalizeIdentity(item.popular_name))
      || identityKeys.has(normalizeIdentity(item.official_name))
    ))

  if (duplicate) {
    throw new Error(`Ya existe una hermandad con ese nombre: ${duplicate.popular_name || duplicate.official_name}.`)
  }
}

export async function createBrotherhoodAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const popularName = required(formData, 'popular_name', 'El nombre popular')
  const officialName = required(formData, 'official_name', 'El nombre oficial')
  const entitySlug = slugify(value(formData, 'slug') || popularName)

  if (!entitySlug) throw new Error('No se ha podido generar un slug válido.')
  if (entitySlug.length > 160) throw new Error('El slug es demasiado largo.')

  await ensureUniqueIdentity(supabase, {
    popularName,
    officialName,
    slug: entitySlug,
  })

  const brotherhoodId = randomUUID()
  const entityPayload = {
    id: brotherhoodId,
    entity_type: 'brotherhood',
    name: popularName,
    slug: entitySlug,
    status: 'draft',
  }
  const brotherhoodPayload = {
    entity_id: brotherhoodId,
    official_name: officialName,
    popular_name: popularName,
  }

  assertMutation(
    await supabase.from('entities').insert(entityPayload).select('id').single(),
    'No se pudo crear la entidad de la hermandad'
  )

  const brotherhoodResult = await supabase
    .from('brotherhoods')
    .insert(brotherhoodPayload)
    .select('entity_id')
    .single()

  if (brotherhoodResult.error) {
    const rollback = await supabase
      .from('entities')
      .delete()
      .eq('id', brotherhoodId)
      .eq('status', 'draft')

    if (rollback.error) {
      console.error('[Hilo Cofrade] No se pudo revertir una entidad creada sin ficha de hermandad', {
        brotherhoodId,
        rollbackError: rollback.error.message,
      })
    }

    throw new Error(`No se pudo crear la ficha de la hermandad: ${brotherhoodResult.error.message}`)
  }

  await audit(supabase, user, {
    action_type: 'create',
    object_type: 'brotherhood',
    object_id: brotherhoodId,
    entity_id: brotherhoodId,
    summary: `Hermandad creada como borrador: ${popularName}`,
    changed_fields: {
      entity: entityPayload,
      brotherhood: brotherhoodPayload,
    },
  })

  revalidatePath('/panel')
  revalidatePath('/panel/hermandades')
  revalidatePath(`/panel/hermandades/${brotherhoodId}`)
  redirect(`/panel/hermandades/${brotherhoodId}?saved=created#general`)
}

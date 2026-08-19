'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { PUBLIC_CACHE_TAGS, revalidatePublicData } from '@/lib/cache/public-cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import {
  assertRow,
  assertRows,
  formValue,
  relationalStatus,
  requiredValue,
  uuidValue,
  writeAudit,
} from '@/lib/panel/relation-actions'
import { createClient } from '@/lib/supabase/server'

function slugify(input) {
  return String(input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function refresh() {
  revalidatePath('/panel/relaciones')
  revalidatePath('/panel/relaciones/titulares')
  revalidatePublicData(PUBLIC_CACHE_TAGS.BROTHERHOODS, PUBLIC_CACHE_TAGS.IMAGES)
}

export async function createAdvocationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const name = requiredValue(formData, 'name', 'El nombre de la identidad devocional')
  const slug = slugify(formValue(formData, 'slug') || name)
  const status = formValue(formData, 'status') === 'published' ? 'published' : 'draft'

  if (!slug) throw new Error('No se ha podido generar un slug válido.')

  const [slugResult, namesResult] = await Promise.all([
    supabase.from('entities').select('id').eq('slug', slug).limit(1),
    supabase.from('entities').select('id, name').eq('entity_type', 'advocation').neq('status', 'archived'),
  ])
  if (assertRows(slugResult, 'No se pudo comprobar el slug').length) {
    throw new Error(`El slug «${slug}» ya pertenece a otra entidad.`)
  }

  const normalize = (value) => String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
  const duplicate = assertRows(namesResult, 'No se pudieron comprobar duplicados')
    .find((item) => normalize(item.name) === normalize(name))
  if (duplicate) throw new Error(`Ya existe una identidad devocional con ese nombre: ${duplicate.name}.`)

  const id = randomUUID()
  assertRow(
    await supabase
      .from('entities')
      .insert({ id, entity_type: 'advocation', name, slug, status })
      .select('id')
      .single(),
    'No se pudo crear la entidad devocional'
  )
  assertRow(
    await supabase
      .from('advocations')
      .insert({
        entity_id: id,
        advocation_type: formValue(formData, 'advocation_type') || null,
        description: formValue(formData, 'description') || null,
      })
      .select('entity_id')
      .single(),
    'No se pudo crear la identidad devocional'
  )

  await writeAudit(supabase, user, {
    action_type: 'create',
    object_type: 'advocation',
    object_id: id,
    entity_id: id,
    summary: `Identidad devocional creada: ${name}`,
    changed_fields: { status },
  }, 'la identidad devocional')

  refresh()
  redirect('/panel/relaciones/titulares?saved=advocation')
}

export async function addTitularRelationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuidValue(formData, 'brotherhood_entity_id')
  const advocationId = uuidValue(formData, 'advocation_entity_id')

  const [brotherhood, advocation] = await Promise.all([
    assertRow(
      await supabase
        .from('entities')
        .select('id, name, status')
        .eq('id', brotherhoodId)
        .eq('entity_type', 'brotherhood')
        .maybeSingle(),
      'La Hermandad seleccionada no existe.'
    ),
    assertRow(
      await supabase
        .from('entities')
        .select('id, name, status')
        .eq('id', advocationId)
        .eq('entity_type', 'advocation')
        .maybeSingle(),
      'La identidad devocional seleccionada no existe.'
    ),
  ])

  const existing = assertRows(
    await supabase
      .from('entity_relations')
      .select('id')
      .eq('source_entity_id', brotherhood.id)
      .eq('target_entity_id', advocation.id)
      .eq('relation_type', 'has_titular')
      .neq('status', 'archived')
      .limit(1),
    'No se pudo comprobar la titularidad existente'
  )[0]
  if (existing) throw new Error('Esta titularidad ya está registrada.')

  const payload = {
    source_entity_id: brotherhood.id,
    target_entity_id: advocation.id,
    relation_type: 'has_titular',
    notes: formValue(formData, 'notes') || null,
    status: relationalStatus(brotherhood, advocation),
  }
  const relation = assertRow(
    await supabase.from('entity_relations').insert(payload).select('id').single(),
    'No se pudo crear la titularidad'
  )

  await writeAudit(supabase, user, {
    action_type: 'link',
    object_type: 'entity_relation',
    object_id: relation.id,
    entity_id: brotherhood.id,
    summary: `Titularidad: ${brotherhood.name} → ${advocation.name}`,
    changed_fields: payload,
  }, 'la titularidad conceptual')

  refresh()
  redirect('/panel/relaciones/titulares?saved=linked')
}

export async function archiveTitularRelationAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const relationId = uuidValue(formData, 'relation_id')

  const relation = assertRow(
    await supabase
      .from('entity_relations')
      .select('id, source_entity_id, relation_type')
      .eq('id', relationId)
      .eq('relation_type', 'has_titular')
      .maybeSingle(),
    'La titularidad ya no existe.'
  )

  assertRow(
    await supabase
      .from('entity_relations')
      .update({ status: 'archived' })
      .eq('id', relation.id)
      .select('id')
      .single(),
    'No se pudo archivar la titularidad'
  )

  await writeAudit(supabase, user, {
    action_type: 'unlink',
    object_type: 'entity_relation',
    object_id: relation.id,
    entity_id: relation.source_entity_id,
    summary: 'Titularidad conceptual archivada sin borrar entidades',
    changed_fields: { status: 'archived' },
  }, 'la titularidad conceptual')

  refresh()
  redirect('/panel/relaciones/titulares?saved=archived')
}

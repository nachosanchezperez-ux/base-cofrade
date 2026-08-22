'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])
const EDITOR_ROUTES = { agent: 'agentes', step: 'pasos', brotherhood: 'hermandades' }

function value(formData, name) { return String(formData.get(name) || '').trim() }
function nullable(formData, name) { return value(formData, name) || null }
function required(formData, name, label) { const candidate = value(formData, name); if (!candidate) throw new Error(`${label} es obligatorio.`); return candidate }
function optionalUuid(formData, name) { const candidate = value(formData, name); if (!candidate) return null; if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`); return candidate }
function status(formData) { const candidate = value(formData, 'status') || 'draft'; if (!STATUSES.has(candidate)) throw new Error('Estado editorial no válido.'); return candidate }
function slugify(input) { return String(input || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') }
function optionalNumber(formData, name) { const candidate = value(formData, name); if (!candidate) return null; const parsed = Number.parseFloat(candidate.replace(',', '.')); if (!Number.isFinite(parsed)) throw new Error(`${name} debe ser un número válido.`); return parsed }
function optionalDate(formData, name) { const candidate = value(formData, name); if (!candidate) return null; if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate) || Number.isNaN(Date.parse(`${candidate}T00:00:00Z`))) throw new Error(`La fecha de ${name} no es válida.`); return candidate }
function assertMutation(result, label) { if (result.error) throw new Error(`${label}: ${result.error.message}`); return result.data }
async function audit(supabase, user, entry) { const { error } = await supabase.from('audit_log').insert({ actor_user_id: user.id, actor_label: user.name, ...entry }); if (error) console.error('[Hilo Cofrade] No se pudo registrar la edición de datos maestros', error) }
async function ensureEntitySlug(supabase, slug, exceptId = null) { let query = supabase.from('entities').select('id, name').eq('slug', slug).limit(1); if (exceptId) query = query.neq('id', exceptId); const result = await query; if (result.error) throw new Error(`No se pudo comprobar el slug: ${result.error.message}`); if (result.data?.length) throw new Error(`El slug «${slug}» ya pertenece a ${result.data[0].name}.`) }
function refreshMasterData() { revalidatePath('/panel'); revalidatePath('/panel/datos'); revalidatePath('/panel/imagenes'); revalidatePath('/panel/agentes'); revalidatePath('/panel/pasos'); revalidatePath('/panel/hermandades'); revalidatePath('/hermandades'); revalidatePath('/') }
function redirectSaved(kind) { redirect(`/panel/datos?saved=${kind}#${kind}`) }

export async function completeReferenceNodeAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const entityId = optionalUuid(formData, 'entity_id')
  if (!entityId) throw new Error('Selecciona una entidad válida.')
  const entity = assertMutation(await supabase.from('entities').select('id, entity_type, name').eq('id', entityId).single(), 'No se pudo cargar el nodo de referencia')
  if (!EDITOR_ROUTES[entity.entity_type]) throw new Error('Este tipo de entidad no necesita una ficha especializada.')

  if (entity.entity_type === 'agent') {
    assertMutation(await supabase.from('agents').upsert({ entity_id: entityId, agent_kind: 'person' }, { onConflict: 'entity_id' }), 'No se pudo completar la ficha de Persona')
  } else if (entity.entity_type === 'step') {
    assertMutation(await supabase.from('steps').upsert({ entity_id: entityId }, { onConflict: 'entity_id' }), 'No se pudo completar la ficha de Paso')
  } else if (entity.entity_type === 'brotherhood') {
    assertMutation(await supabase.from('brotherhoods').upsert({ entity_id: entityId, official_name: entity.name, popular_name: entity.name, brotherhood_types: [] }, { onConflict: 'entity_id' }), 'No se pudo completar la ficha de Hermandad')
  }

  await audit(supabase, user, { action_type: 'update', object_type: entity.entity_type, object_id: entityId, entity_id: entityId, summary: `Nodo de referencia convertido en ficha editable: ${entity.name}`, changed_fields: { specialized_record_created: true } })
  refreshMasterData()
  redirect(`/panel/${EDITOR_ROUTES[entity.entity_type]}/${entityId}`)
}

export async function saveAdvocationAction(formData) {
  const user = await requirePanelEditor(); const supabase = await createClient(); const id = optionalUuid(formData, 'advocation_id') || randomUUID(); const exists = Boolean(value(formData, 'advocation_id')); const name = required(formData, 'name', 'El nombre'); const slug = slugify(required(formData, 'slug', 'El slug')); if (!slug) throw new Error('No se ha podido generar un slug válido.'); await ensureEntitySlug(supabase, slug, exists ? id : null)
  const entityPayload = { name, slug, summary: nullable(formData, 'summary'), status: status(formData) }; const subtypePayload = { entity_id: id, advocation_type: nullable(formData, 'advocation_type'), description: nullable(formData, 'description') }
  if (exists) { assertMutation(await supabase.from('entities').update(entityPayload).eq('id', id).eq('entity_type', 'advocation'), 'No se pudo actualizar la Advocación'); assertMutation(await supabase.from('advocations').upsert(subtypePayload, { onConflict: 'entity_id' }), 'No se pudo actualizar la ficha de Advocación') } else { assertMutation(await supabase.from('entities').insert({ id, entity_type: 'advocation', ...entityPayload }), 'No se pudo crear la Advocación'); const subtypeResult = await supabase.from('advocations').insert(subtypePayload); if (subtypeResult.error) { await supabase.from('entities').delete().eq('id', id); throw new Error(`No se pudo crear la ficha de Advocación: ${subtypeResult.error.message}`) } }
  await audit(supabase, user, { action_type: exists ? 'update' : 'create', object_type: 'advocation', object_id: id, entity_id: id, summary: `${exists ? 'Advocación actualizada' : 'Advocación creada'}: ${name}`, changed_fields: { entity: entityPayload, advocation: subtypePayload } }); refreshMasterData(); redirectSaved('advocaciones')
}

export async function saveImageAdvocationAction(formData) {
  const user = await requirePanelEditor(); const supabase = await createClient(); const imageId = optionalUuid(formData, 'image_id'); if (!imageId) throw new Error('Selecciona una Imagen.'); const advocationId = optionalUuid(formData, 'advocation_id')
  const imageEntity = assertMutation(await supabase.from('entities').select('id, name, slug').eq('id', imageId).eq('entity_type', 'image').single(), 'La Imagen seleccionada no es válida'); if (advocationId) assertMutation(await supabase.from('advocations').select('entity_id').eq('entity_id', advocationId).single(), 'La Advocación seleccionada no es válida')
  assertMutation(await supabase.from('images').update({ advocation_entity_id: advocationId }).eq('entity_id', imageId), 'No se pudo actualizar la Advocación de la Imagen'); await audit(supabase, user, { action_type: 'update', object_type: 'image', object_id: imageId, entity_id: imageId, summary: `${advocationId ? 'Advocación asignada' : 'Advocación retirada'}: ${imageEntity.name}`, changed_fields: { advocation_entity_id: advocationId } }); refreshMasterData(); if (imageEntity.slug) revalidatePath(`/imagenes/${imageEntity.slug}`); redirectSaved('advocaciones')
}

export async function saveMunicipalityAction(formData) {
  const user = await requirePanelEditor(); const supabase = await createClient(); const id = optionalUuid(formData, 'municipality_id'); const name = required(formData, 'name', 'El municipio'); const payload = { name, slug: slugify(required(formData, 'slug', 'El slug')), province: required(formData, 'province', 'La provincia'), autonomous_community: required(formData, 'autonomous_community', 'La comunidad autónoma'), country: required(formData, 'country', 'El país') }
  const result = id ? await supabase.from('municipalities').update(payload).eq('id', id).select('id').single() : await supabase.from('municipalities').insert(payload).select('id').single(); const saved = assertMutation(result, 'No se pudo guardar el municipio'); await audit(supabase, user, { action_type: id ? 'update' : 'create', object_type: 'municipality', object_id: saved.id, summary: `${id ? 'Municipio actualizado' : 'Municipio creado'}: ${name}`, changed_fields: payload }); refreshMasterData(); redirectSaved('municipios')
}

export async function savePlaceAction(formData) {
  const user = await requirePanelEditor(); const supabase = await createClient(); const id = optionalUuid(formData, 'place_id'); const name = required(formData, 'name', 'El lugar'); const payload = { municipality_id: optionalUuid(formData, 'municipality_id'), name, slug: slugify(required(formData, 'slug', 'El slug')), place_type: nullable(formData, 'place_type'), address: nullable(formData, 'address'), latitude: optionalNumber(formData, 'latitude'), longitude: optionalNumber(formData, 'longitude'), notes: nullable(formData, 'notes'), opening_hours_text: nullable(formData, 'opening_hours_text'), opening_hours_verified_at: optionalDate(formData, 'opening_hours_verified_at') }
  const result = id ? await supabase.from('places').update(payload).eq('id', id).select('id').single() : await supabase.from('places').insert(payload).select('id').single(); const saved = assertMutation(result, 'No se pudo guardar el lugar'); await audit(supabase, user, { action_type: id ? 'update' : 'create', object_type: 'place', object_id: saved.id, summary: `${id ? 'Lugar actualizado' : 'Lugar creado'}: ${name}`, changed_fields: payload }); refreshMasterData(); redirectSaved('lugares')
}

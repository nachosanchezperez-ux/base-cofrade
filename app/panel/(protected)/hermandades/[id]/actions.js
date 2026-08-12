'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

// PostgreSQL acepta UUID con cualquier valor hexadecimal en los campos de
// versión y variante. Los identificadores documentales sembrados usan ceros
// en esas posiciones para que sus familias sean reconocibles.
const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const STATUSES = new Set(['draft', 'review', 'published', 'archived'])
const BROTHERHOOD_TYPES = new Map([
  ['penitencia', 'Penitencia'],
  ['gloria', 'Gloria'],
  ['sacramental', 'Sacramental'],
])

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function nullable(formData, name) {
  return value(formData, name) || null
}

function integer(formData, name) {
  const raw = value(formData, name)
  if (!raw) return null
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) ? parsed : null
}

function uuid(formData, name) {
  const candidate = value(formData, name)
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function optionalUuid(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}

function required(formData, name, label) {
  const candidate = value(formData, name)
  if (!candidate) throw new Error(`${label} es obligatorio.`)
  return candidate
}

function status(formData) {
  const candidate = value(formData, 'status') || 'draft'
  if (!STATUSES.has(candidate)) throw new Error('Estado editorial no válido.')
  return candidate
}

function brotherhoodTypes(formData) {
  const submitted = formData.getAll('brotherhood_types').map((item) => String(item).trim())
  if (submitted.some((item) => !BROTHERHOOD_TYPES.has(item.toLowerCase()))) {
    throw new Error('Se ha recibido un tipo de hermandad no válido.')
  }
  const selected = [...new Set(submitted.map((item) => BROTHERHOOD_TYPES.get(item.toLowerCase())))]
  if (!selected.length) throw new Error('Selecciona al menos un tipo de hermandad.')
  return selected
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
  if (error) console.error('[Hilo Cofrade] No se pudo registrar la auditoría', error)
}

async function refreshBrotherhood(supabase, brotherhoodId) {
  const { data } = await supabase.from('entities').select('slug').eq('id', brotherhoodId).maybeSingle()
  revalidatePath('/panel')
  revalidatePath('/panel/hermandades')
  revalidatePath(`/panel/hermandades/${brotherhoodId}`)
  revalidatePath('/hermandades')
  if (data?.slug) revalidatePath(`/hermandades/${data.slug}`)
}

function redirectSaved(brotherhoodId, section) {
  redirect(`/panel/hermandades/${brotherhoodId}?saved=${section}#${section}`)
}

export async function updateBrotherhoodAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const entityStatus = status(formData)
  const entitySlug = required(formData, 'slug', 'El slug')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entitySlug)) {
    throw new Error('El slug solo puede contener minúsculas, números y guiones simples.')
  }
  const entityPayload = {
    name: required(formData, 'name', 'El nombre de la entidad'),
    slug: entitySlug,
    summary: nullable(formData, 'summary'),
    status: entityStatus,
  }
  const brotherhoodPayload = {
    official_name: required(formData, 'official_name', 'El nombre oficial'),
    popular_name: required(formData, 'popular_name', 'El nombre popular'),
    foundation_text: nullable(formData, 'foundation_text'),
    municipality_id: optionalUuid(formData, 'municipality_id'),
    canonical_see_place_id: optionalUuid(formData, 'canonical_see_place_id'),
    neighborhood: nullable(formData, 'neighborhood'),
    website_url: nullable(formData, 'website_url'),
    instagram_url: nullable(formData, 'instagram_url'),
    crest_path: nullable(formData, 'crest_path'),
    brotherhood_types: brotherhoodTypes(formData),
    current_procession_day: nullable(formData, 'current_procession_day'),
    notes: nullable(formData, 'notes'),
  }

  assertMutation(
    await supabase.from('entities').update(entityPayload).eq('id', brotherhoodId).eq('entity_type', 'brotherhood'),
    'No se pudo actualizar la entidad'
  )
  assertMutation(
    await supabase.from('brotherhoods').update(brotherhoodPayload).eq('entity_id', brotherhoodId),
    'No se pudo actualizar la ficha'
  )

  const colorIds = formData.getAll('color_id').map(String)
  const colorNames = formData.getAll('color_name').map(String)
  const colorHexes = formData.getAll('color_hex').map(String)
  const colorRoles = formData.getAll('color_role').map(String)

  for (let index = 0; index < colorNames.length; index += 1) {
    const colorName = colorNames[index].trim()
    if (!colorName) continue
    const hex = colorHexes[index]?.trim() || null
    if (hex && !/^#[0-9a-f]{6}$/i.test(hex)) throw new Error(`El color ${colorName} no tiene un valor hexadecimal válido.`)
    const colorPayload = {
      brotherhood_entity_id: brotherhoodId,
      color_name: colorName,
      hex_value: hex,
      color_role: ['primary', 'secondary', 'accent', 'identity'].includes(colorRoles[index]) ? colorRoles[index] : 'identity',
      sort_order: index + 1,
      status: entityStatus,
    }
    const colorId = colorIds[index]
    if (UUID_PATTERN.test(colorId)) {
      assertMutation(
        await supabase.from('brotherhood_colors').update(colorPayload).eq('id', colorId).eq('brotherhood_entity_id', brotherhoodId),
        'No se pudo actualizar un color'
      )
    } else {
      assertMutation(await supabase.from('brotherhood_colors').insert(colorPayload), 'No se pudo añadir un color')
    }
  }

  await audit(supabase, user, {
    action_type: entityStatus === 'published' ? 'publish' : 'update',
    object_type: 'brotherhood', object_id: brotherhoodId, entity_id: brotherhoodId,
    summary: `Ficha actualizada: ${entityPayload.name}`,
    changed_fields: { entity: entityPayload, brotherhood: brotherhoodPayload },
  })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'general')
}

export async function saveOutingSeriesAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const seriesId = optionalUuid(formData, 'series_id')
  const payload = {
    brotherhood_entity_id: brotherhoodId,
    outing_type: required(formData, 'outing_type', 'El tipo de salida'),
    character: value(formData, 'character') === 'extraordinary' ? 'extraordinary' : 'ordinary',
    title: required(formData, 'title', 'El título'),
    month: integer(formData, 'month'),
    date_rule: nullable(formData, 'date_rule'),
    time_text: nullable(formData, 'time_text'),
    municipality_id: optionalUuid(formData, 'municipality_id'),
    origin_place_id: optionalUuid(formData, 'origin_place_id'),
    destination_place_id: optionalUuid(formData, 'destination_place_id'),
    route_summary: nullable(formData, 'route_summary'),
    description: nullable(formData, 'description'),
    display_order: integer(formData, 'display_order'),
    status: status(formData),
    notes: nullable(formData, 'notes'),
  }

  const result = seriesId
    ? await supabase.from('outing_series').update(payload).eq('id', seriesId).eq('brotherhood_entity_id', brotherhoodId).select('id').single()
    : await supabase.from('outing_series').insert(payload).select('id').single()
  const saved = assertMutation(result, 'No se pudo guardar la salida recurrente')

  await audit(supabase, user, {
    action_type: seriesId ? 'update' : 'create', object_type: 'outing_series',
    object_id: saved.id, entity_id: brotherhoodId,
    summary: `${seriesId ? 'Salida actualizada' : 'Salida creada'}: ${payload.title}`,
    changed_fields: payload,
  })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'salidas')
}

export async function archiveOutingSeriesAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const seriesId = uuid(formData, 'series_id')
  const saved = assertMutation(
    await supabase.from('outing_series').update({ status: 'archived' }).eq('id', seriesId).eq('brotherhood_entity_id', brotherhoodId).select('id, title').single(),
    'No se pudo archivar la salida'
  )
  await audit(supabase, user, { action_type: 'archive', object_type: 'outing_series', object_id: saved.id, entity_id: brotherhoodId, summary: `Salida archivada: ${saved.title}` })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'salidas')
}

export async function saveMovementAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const seriesId = uuid(formData, 'series_id')
  const movementId = optionalUuid(formData, 'movement_id')
  const payload = {
    outing_series_id: seriesId,
    sequence_no: integer(formData, 'sequence_no') || 1,
    direction: required(formData, 'direction', 'La dirección del movimiento'),
    date_rule: nullable(formData, 'date_rule'),
    time_text: nullable(formData, 'time_text'),
    origin_place_id: optionalUuid(formData, 'origin_place_id'),
    destination_place_id: optionalUuid(formData, 'destination_place_id'),
    route_summary: nullable(formData, 'route_summary'),
    description: nullable(formData, 'description'),
  }
  const result = movementId
    ? await supabase.from('outing_series_movements').update(payload).eq('id', movementId).eq('outing_series_id', seriesId).select('id').single()
    : await supabase.from('outing_series_movements').insert(payload).select('id').single()
  const saved = assertMutation(result, 'No se pudo guardar el movimiento')
  await audit(supabase, user, { action_type: movementId ? 'update' : 'create', object_type: 'outing_series_movement', object_id: saved.id, entity_id: brotherhoodId, summary: `Movimiento ${movementId ? 'actualizado' : 'creado'} en ${value(formData, 'series_title')}` })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'salidas')
}

export async function saveCultAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const cultId = optionalUuid(formData, 'cult_id')
  const payload = {
    brotherhood_entity_id: brotherhoodId,
    cult_type: required(formData, 'cult_type', 'El tipo de culto'),
    title: required(formData, 'title', 'El título'),
    cult_date: nullable(formData, 'cult_date'),
    date_rule: nullable(formData, 'date_rule'),
    month: integer(formData, 'month'),
    time_text: nullable(formData, 'time_text'),
    place_id: optionalUuid(formData, 'place_id'),
    description: nullable(formData, 'description'),
    is_recurring: formData.get('is_recurring') === 'on',
    recurrence_label: nullable(formData, 'recurrence_label'),
    display_order: integer(formData, 'display_order'),
    status: status(formData),
    notes: nullable(formData, 'notes'),
  }
  const result = cultId
    ? await supabase.from('cults').update(payload).eq('id', cultId).eq('brotherhood_entity_id', brotherhoodId).select('id').single()
    : await supabase.from('cults').insert(payload).select('id').single()
  const saved = assertMutation(result, 'No se pudo guardar el culto')
  await audit(supabase, user, { action_type: cultId ? 'update' : 'create', object_type: 'cult', object_id: saved.id, entity_id: brotherhoodId, summary: `${cultId ? 'Culto actualizado' : 'Culto creado'}: ${payload.title}`, changed_fields: payload })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'cultos')
}

export async function archiveCultAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const cultId = uuid(formData, 'cult_id')
  const saved = assertMutation(await supabase.from('cults').update({ status: 'archived' }).eq('id', cultId).eq('brotherhood_entity_id', brotherhoodId).select('id, title').single(), 'No se pudo archivar el culto')
  await audit(supabase, user, { action_type: 'archive', object_type: 'cult', object_id: saved.id, entity_id: brotherhoodId, summary: `Culto archivado: ${saved.title}` })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'cultos')
}

export async function saveHeritageAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const updateId = optionalUuid(formData, 'update_id')
  const payload = {
    brotherhood_entity_id: brotherhoodId,
    update_type: value(formData, 'update_type') === 'restauracion' ? 'restauracion' : 'estreno',
    title: required(formData, 'title', 'El título'),
    update_date: nullable(formData, 'update_date'),
    year: integer(formData, 'year'),
    target_entity_id: optionalUuid(formData, 'target_entity_id'),
    element_name: nullable(formData, 'element_name'),
    discipline: nullable(formData, 'discipline'),
    description: nullable(formData, 'description'),
    status: status(formData),
  }
  if (!payload.update_date && !payload.year) throw new Error('Indica la fecha o el año de la novedad patrimonial.')
  const result = updateId
    ? await supabase.from('heritage_updates').update(payload).eq('id', updateId).eq('brotherhood_entity_id', brotherhoodId).select('id').single()
    : await supabase.from('heritage_updates').insert(payload).select('id').single()
  const saved = assertMutation(result, 'No se pudo guardar la novedad patrimonial')
  await audit(supabase, user, { action_type: updateId ? 'update' : 'create', object_type: 'heritage_update', object_id: saved.id, entity_id: brotherhoodId, summary: `${updateId ? 'Novedad actualizada' : 'Novedad creada'}: ${payload.title}`, changed_fields: payload })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'patrimonio')
}

export async function archiveHeritageAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const updateId = uuid(formData, 'update_id')
  const saved = assertMutation(await supabase.from('heritage_updates').update({ status: 'archived' }).eq('id', updateId).eq('brotherhood_entity_id', brotherhoodId).select('id, title').single(), 'No se pudo archivar la novedad')
  await audit(supabase, user, { action_type: 'archive', object_type: 'heritage_update', object_id: saved.id, entity_id: brotherhoodId, summary: `Novedad archivada: ${saved.title}` })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'patrimonio')
}

export async function uploadMediaAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const brotherhoodId = uuid(formData, 'brotherhood_id')
  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) throw new Error('Selecciona una imagen para subir.')
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) throw new Error('La imagen debe ser JPG, PNG, WEBP o GIF.')
  if (file.size > 10 * 1024 * 1024) throw new Error('La imagen no puede superar 10 MB.')
  const altText = required(formData, 'alt_text', 'El texto alternativo')
  const rightsStatus = value(formData, 'rights_status')
  if (!['owned', 'authorized', 'licensed', 'public_domain'].includes(rightsStatus)) {
    throw new Error('Solo se pueden subir imágenes cuyos derechos permitan su publicación.')
  }

  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg'
  const storagePath = `${brotherhoodId}/${randomUUID()}.${extension}`
  const uploadResult = await supabase.storage.from('hilo-media').upload(storagePath, file, { contentType: file.type, upsert: false })
  assertMutation(uploadResult, 'No se pudo subir la imagen')

  const assetResult = await supabase.from('media_assets').insert({
      storage_path: storagePath,
      media_type: 'image',
      title: nullable(formData, 'title') || file.name,
      caption: nullable(formData, 'caption'),
      alt_text: altText,
      author_name: nullable(formData, 'author_name'),
      source_name: nullable(formData, 'source_name'),
      source_url: nullable(formData, 'source_url'),
      rights_status: rightsStatus,
      rights_holder: nullable(formData, 'rights_holder'),
      license: nullable(formData, 'license'),
      permission_notes: nullable(formData, 'permission_notes'),
    }).select('id').single()
  if (assetResult.error) {
    await supabase.storage.from('hilo-media').remove([storagePath])
    throw new Error(`No se pudo registrar la imagen: ${assetResult.error.message}`)
  }
  const asset = assetResult.data
  const linkResult = await supabase.from('entity_media').insert({
      entity_id: brotherhoodId,
      media_asset_id: asset.id,
      relation_type: value(formData, 'relation_type') || 'gallery',
      sort_order: integer(formData, 'sort_order') || 0,
      is_cover: formData.get('is_cover') === 'on',
    }).select('id').single()
  if (linkResult.error) {
    await supabase.from('media_assets').delete().eq('id', asset.id)
    await supabase.storage.from('hilo-media').remove([storagePath])
    throw new Error(`No se pudo vincular la imagen a la hermandad: ${linkResult.error.message}`)
  }
  const link = linkResult.data
  await audit(supabase, user, { action_type: 'link', object_type: 'entity_media', object_id: link.id, entity_id: brotherhoodId, summary: `Imagen incorporada: ${nullable(formData, 'title') || file.name}` })
  await refreshBrotherhood(supabase, brotherhoodId)
  redirectSaved(brotherhoodId, 'imagenes')
}

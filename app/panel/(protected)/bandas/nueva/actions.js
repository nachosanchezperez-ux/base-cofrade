'use server'

import { randomUUID } from 'node:crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const BAND_TYPES = new Set([
  'Cornetas y Tambores',
  'Agrupación Musical',
  'Banda de Música',
  'Capilla Musical',
  'Otra',
])

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function required(formData, name, label) {
  const candidate = value(formData, name)
  if (!candidate) throw new Error(`${label} es obligatorio.`)
  return candidate
}

function optionalUuid(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
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
  return result.data || []
}

function assertMutation(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

async function ensureUniqueBand(supabase, { popularName, officialName, slug }) {
  const [slugResult, namesResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, entity_type, name, slug, status')
      .eq('slug', slug)
      .limit(1),
    supabase
      .from('band_names')
      .select('band_entity_id, name, name_type')
      .in('name_type', ['popular', 'official']),
  ])

  const slugMatches = assertQuery(slugResult, 'No se pudo comprobar el slug')
  if (slugMatches.length) throw new Error(`El slug «${slug}» ya pertenece a otra entidad.`)

  const identityKeys = new Set([
    normalizeIdentity(popularName),
    normalizeIdentity(officialName),
  ].filter(Boolean))
  const duplicate = assertQuery(namesResult, 'No se pudieron comprobar posibles Bandas duplicadas')
    .find((item) => identityKeys.has(normalizeIdentity(item.name)))

  if (duplicate) throw new Error(`Ya existe una Banda con ese nombre: ${duplicate.name}.`)
}

async function validateMunicipality(supabase, municipalityId) {
  if (!municipalityId) return
  const result = await supabase
    .from('municipalities')
    .select('id')
    .eq('id', municipalityId)
    .maybeSingle()
  if (result.error) throw new Error(`No se pudo validar la localidad: ${result.error.message}`)
  if (!result.data) throw new Error('La localidad seleccionada ya no está disponible.')
}

async function rollbackDraftBand(supabase, bandId) {
  const nameDelete = await supabase.from('band_names').delete().eq('band_entity_id', bandId)
  const bandDelete = await supabase.from('bands').delete().eq('entity_id', bandId)
  const entityDelete = await supabase.from('entities').delete().eq('id', bandId).eq('status', 'draft')

  if (!nameDelete.error && !bandDelete.error && !entityDelete.error) return

  const archiveResult = await supabase
    .from('entities')
    .update({ status: 'archived' })
    .eq('id', bandId)
    .eq('status', 'draft')

  if (archiveResult.error) {
    console.error('[Hilo Cofrade] No se pudo revertir completamente un alta fallida de Banda', {
      bandId,
      nameDelete: nameDelete.error?.message || null,
      bandDelete: bandDelete.error?.message || null,
      entityDelete: entityDelete.error?.message || null,
      archive: archiveResult.error.message,
    })
  }
}

async function audit(supabase, user, entry) {
  const { error } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    ...entry,
  })
  if (error) console.error('[Hilo Cofrade] No se pudo registrar el alta de la Banda', error)
}

export async function createBandAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const popularName = required(formData, 'popular_name', 'El nombre popular')
  const officialName = required(formData, 'official_name', 'El nombre oficial')
  const bandType = required(formData, 'band_type', 'El tipo de formación')
  const municipalityId = optionalUuid(formData, 'municipality_id')
  const foundationText = value(formData, 'foundation_text') || null
  const entitySlug = slugify(value(formData, 'slug') || popularName)

  if (!BAND_TYPES.has(bandType)) throw new Error('Tipo de formación no válido.')
  if (!entitySlug) throw new Error('No se ha podido generar un slug válido.')
  if (entitySlug.length > 160) throw new Error('El slug es demasiado largo.')

  await Promise.all([
    ensureUniqueBand(supabase, { popularName, officialName, slug: entitySlug }),
    validateMunicipality(supabase, municipalityId),
  ])

  const bandId = randomUUID()
  const entityPayload = {
    id: bandId,
    entity_type: 'band',
    name: popularName,
    slug: entitySlug,
    status: 'draft',
  }
  const bandPayload = {
    entity_id: bandId,
    band_type: bandType,
    municipality_id: municipalityId,
    foundation_text: foundationText,
  }
  const namesPayload = [
    {
      band_entity_id: bandId,
      name: popularName,
      short_name: popularName,
      name_type: 'popular',
      is_current: true,
    },
    {
      band_entity_id: bandId,
      name: officialName,
      name_type: 'official',
      is_current: true,
    },
  ]

  assertMutation(
    await supabase.from('entities').insert(entityPayload).select('id').single(),
    'No se pudo crear la entidad de la Banda'
  )

  const bandResult = await supabase
    .from('bands')
    .insert(bandPayload)
    .select('entity_id')
    .single()

  if (bandResult.error) {
    await rollbackDraftBand(supabase, bandId)
    throw new Error(`No se pudo crear la ficha de la Banda: ${bandResult.error.message}`)
  }

  const namesResult = await supabase.from('band_names').insert(namesPayload)
  if (namesResult.error) {
    await rollbackDraftBand(supabase, bandId)
    throw new Error(`No se pudieron crear los nombres de la Banda: ${namesResult.error.message}`)
  }

  await audit(supabase, user, {
    action_type: 'create',
    object_type: 'band',
    object_id: bandId,
    entity_id: bandId,
    summary: `Banda creada como borrador: ${popularName}`,
    changed_fields: {
      entity: entityPayload,
      band: bandPayload,
      names: namesPayload,
    },
  })

  revalidatePath('/panel')
  revalidatePath('/panel/bandas')
  revalidatePath(`/panel/bandas/${bandId}`)
  redirect(`/panel/bandas/${bandId}?saved=created#general`)
}

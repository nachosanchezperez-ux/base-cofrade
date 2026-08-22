'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i

function value(formData, name) { return String(formData.get(name) || '').trim() }
function nullable(formData, name) { return value(formData, name) || null }
function optionalUuid(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!UUID_PATTERN.test(candidate)) throw new Error(`Identificador no válido: ${name}`)
  return candidate
}
function optionalDate(formData, name) {
  const candidate = value(formData, name)
  if (!candidate) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(candidate)) throw new Error('Fecha no válida.')
  return candidate
}
function slugify(input) {
  return String(input || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function uniqueSlug(supabase, base) {
  const root = base || 'extraordinaria'
  for (let index = 1; index <= 99; index += 1) {
    const candidate = index === 1 ? root : `${root}-${index}`
    const existing = await supabase.from('outings').select('id').eq('slug', candidate).limit(1).maybeSingle()
    if (existing.error) throw new Error(`No se pudo validar el slug: ${existing.error.message}`)
    if (!existing.data) return candidate
  }
  throw new Error('No se pudo generar un slug único para la extraordinaria.')
}

export async function createExtraordinaryAction(formData) {
  const user = await requirePanelEditor()
  const supabase = await createClient()
  const title = value(formData, 'title')
  if (!title) throw new Error('El titular o título es obligatorio.')
  const outingDate = optionalDate(formData, 'outing_date')
  const municipalityId = optionalUuid(formData, 'municipality_id')
  const brotherhoodEntityId = optionalUuid(formData, 'brotherhood_entity_id')

  let municipalityName = ''
  if (municipalityId) {
    const municipality = await supabase.from('municipalities').select('name').eq('id', municipalityId).maybeSingle()
    if (municipality.error) throw new Error(`No se pudo cargar la localidad: ${municipality.error.message}`)
    municipalityName = municipality.data?.name || ''
  }

  const year = outingDate ? Number(outingDate.slice(0, 4)) : new Date().getFullYear()
  const slug = await uniqueSlug(supabase, slugify(`${title}-${municipalityName}-${year}`))
  const payload = {
    title,
    slug,
    outing_type: value(formData, 'outing_type') || 'Procesión extraordinaria',
    character: 'extraordinary',
    outing_date: outingDate,
    year: outingDate ? Number(outingDate.slice(0, 4)) : null,
    municipality_id: municipalityId,
    brotherhood_entity_id: brotherhoodEntityId,
    organizer_name: nullable(formData, 'organizer_name'),
    event_status: 'announced',
    status: 'draft',
  }

  const created = await supabase.from('outings').insert(payload).select('id').single()
  if (created.error) throw new Error(`No se pudo crear la extraordinaria: ${created.error.message}`)

  const { error: auditError } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    action_type: 'create',
    object_type: 'outing',
    object_id: created.data.id,
    summary: `Extraordinaria creada: ${title}`,
    changed_fields: payload,
  })
  if (auditError) console.error('[Hilo Cofrade] No se pudo auditar la creación de Extraordinaria', auditError)

  revalidatePath('/panel/extraordinarias')
  redirect(`/panel/extraordinarias/${created.data.id}/general?saved=created`)
}

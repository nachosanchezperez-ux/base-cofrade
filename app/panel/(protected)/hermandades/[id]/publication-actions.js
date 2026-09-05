'use server'

import { revalidatePath } from 'next/cache'
import { requirePanelEditor } from '@/lib/panel/auth'
import { createClient } from '@/lib/supabase/server'

const UUID_PATTERN = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i
const PUBLICATION_STATUSES = new Set(['draft', 'published'])

function value(formData, name) {
  return String(formData.get(name) || '').trim()
}

function assertMutation(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

export async function updateBrotherhoodPublicationAction(formData) {
  const user = await requirePanelEditor()
  const brotherhoodId = value(formData, 'brotherhood_id')
  const nextStatus = value(formData, 'next_status')

  if (!UUID_PATTERN.test(brotherhoodId)) throw new Error('Identificador de Hermandad no válido.')
  if (!PUBLICATION_STATUSES.has(nextStatus)) throw new Error('Estado de publicación no válido.')

  const supabase = await createClient()
  const [entityResult, brotherhoodResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', brotherhoodId)
      .eq('entity_type', 'brotherhood')
      .maybeSingle(),
    supabase
      .from('brotherhoods')
      .select('entity_id, official_name, popular_name')
      .eq('entity_id', brotherhoodId)
      .maybeSingle(),
  ])

  if (entityResult.error) throw new Error(`No se pudo validar la entidad: ${entityResult.error.message}`)
  if (brotherhoodResult.error) throw new Error(`No se pudo validar la ficha: ${brotherhoodResult.error.message}`)
  const entity = entityResult.data
  const brotherhood = brotherhoodResult.data
  if (!entity || !brotherhood) throw new Error('La Hermandad ya no está disponible.')

  if (nextStatus === 'published') {
    if (!entity.name || !entity.slug || !brotherhood.popular_name || !brotherhood.official_name) {
      throw new Error('Completa el nombre popular, nombre oficial y slug antes de publicar la Hermandad.')
    }
  }

  if (entity.status === nextStatus) return

  assertMutation(
    await supabase
      .from('entities')
      .update({ status: nextStatus })
      .eq('id', brotherhoodId)
      .eq('entity_type', 'brotherhood')
      .select('id, status')
      .single(),
    nextStatus === 'published' ? 'No se pudo publicar la Hermandad' : 'No se pudo devolver la Hermandad a borrador'
  )

  const { error: auditError } = await supabase.from('audit_log').insert({
    actor_user_id: user.id,
    actor_label: user.name,
    action_type: nextStatus === 'published' ? 'publish' : 'update',
    object_type: 'brotherhood',
    object_id: brotherhoodId,
    entity_id: brotherhoodId,
    summary: nextStatus === 'published'
      ? `Hermandad publicada: ${brotherhood.popular_name || entity.name}`
      : `Hermandad devuelta a borrador: ${brotherhood.popular_name || entity.name}`,
    changed_fields: { status: { from: entity.status, to: nextStatus } },
  })
  if (auditError) console.error('[Hilo Cofrade] No se pudo registrar el cambio de publicación', auditError)

  revalidatePath('/panel')
  revalidatePath('/panel/hermandades')
  revalidatePath(`/panel/hermandades/${brotherhoodId}`)
  revalidatePath('/hermandades')
  revalidatePath('/')
  revalidatePath('/sitemap.xml')
  if (entity.slug) revalidatePath(`/hermandades/${entity.slug}`)
}

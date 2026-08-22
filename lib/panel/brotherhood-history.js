import 'server-only'

import { getHermandadBySlug } from '@/lib/data'
import { createClient } from '@/lib/supabase/server'

function assertQuery(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data
}

export async function getBrotherhoodHistoryEditorData(id) {
  const supabase = await createClient()
  const [entityResult, brotherhoodResult, authorityResult] = await Promise.all([
    supabase
      .from('entities')
      .select('id, name, slug, status')
      .eq('id', id)
      .eq('entity_type', 'brotherhood')
      .maybeSingle(),
    supabase
      .from('brotherhoods')
      .select('entity_id, popular_name, official_name, history_text, notes')
      .eq('entity_id', id)
      .maybeSingle(),
    supabase
      .from('brotherhood_section_authority')
      .select('section_key, managed_at')
      .eq('brotherhood_entity_id', id)
      .eq('section_key', 'historia')
      .maybeSingle(),
  ])

  const entity = assertQuery(entityResult, 'No se pudo cargar la Hermandad')
  if (!entity) return null
  const brotherhood = assertQuery(brotherhoodResult, 'No se pudo cargar la historia de la Hermandad')
  if (!brotherhood) return null

  const authority = authorityResult.error?.code === '42P01'
    ? null
    : assertQuery(authorityResult, 'No se pudo cargar la autoridad editorial de Historia')
  const localFallback = entity.slug ? getHermandadBySlug(entity.slug)?.historia || '' : ''

  return { entity, brotherhood, authority, localFallback }
}

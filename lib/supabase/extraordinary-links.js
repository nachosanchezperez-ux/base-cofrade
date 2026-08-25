import 'server-only'

import { createPublicClient } from '@/lib/supabase/public'

function madridDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Madrid',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const value = (type) => parts.find((part) => part.type === type)?.value || ''
  return `${value('year')}-${value('month')}-${value('day')}`
}

function serialize(row) {
  return {
    id: row.id,
    slug: row.slug || '',
    title: row.title || row.outing_type || 'Salida extraordinaria',
    date: row.outing_date || '',
    municipality: row.municipality_name || '',
    reason: row.reason || '',
  }
}

async function publishedUpcomingByIds(supabase, ids) {
  if (!ids.length) return []
  const { data, error } = await supabase
    .from('extraordinary_outings_directory')
    .select('id, slug, title, outing_type, outing_date, municipality_name, reason, event_status')
    .in('id', ids)
    .eq('province', 'Sevilla')
    .eq('event_status', 'announced')
    .gte('outing_date', madridDateKey())
    .not('slug', 'is', null)
    .order('outing_date')

  if (error) throw error
  return (data || []).map(serialize)
}

export async function getBrotherhoodUpcomingExtraordinaryLinks(brotherhoodId) {
  if (!brotherhoodId) return []
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('extraordinary_outings_directory')
      .select('id, slug, title, outing_type, outing_date, municipality_name, reason, event_status')
      .eq('brotherhood_entity_id', brotherhoodId)
      .eq('province', 'Sevilla')
      .eq('event_status', 'announced')
      .gte('outing_date', madridDateKey())
      .not('slug', 'is', null)
      .order('outing_date')

    if (error) throw error
    return (data || []).map(serialize)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar las extraordinarias de la Hermandad', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}

export async function getBandUpcomingExtraordinaryLinks(bandId) {
  if (!bandId) return []
  try {
    const supabase = createPublicClient()
    const { data, error } = await supabase
      .from('outing_music_assignments')
      .select('music_position_id')
      .eq('band_entity_id', bandId)
      .eq('status', 'published')

    if (error) throw error
    const positionIds = [...new Set((data || []).map((item) => item.music_position_id).filter(Boolean))]
    if (!positionIds.length) return []

    const positions = await supabase
      .from('outing_music_positions')
      .select('outing_id')
      .in('id', positionIds)
      .eq('status', 'published')
    if (positions.error) throw positions.error

    const outingIds = [...new Set((positions.data || []).map((item) => item.outing_id).filter(Boolean))]
    return publishedUpcomingByIds(supabase, outingIds)
  } catch (error) {
    console.error('[Hilo Cofrade] No se pudieron cargar las extraordinarias de la Banda', {
      error: error instanceof Error ? error.message : String(error),
    })
    return []
  }
}

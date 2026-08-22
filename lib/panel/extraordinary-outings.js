import 'server-only'

import { createClient } from '@/lib/supabase/server'

function relationOne(value) {
  if (Array.isArray(value)) return value[0] || null
  return value || null
}

function normalize(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
}

export async function getPanelExtraordinaryOutings({ query = '', eventStatus = '' } = {}) {
  const supabase = await createClient()
  let request = supabase
    .from('outings')
    .select('id, reference_code, slug, title, outing_type, outing_date, event_status, status, organizer_name, hero_image_path, municipalities(name)')
    .eq('character', 'extraordinary')
    .neq('status', 'archived')
    .order('outing_date', { ascending: true, nullsFirst: false })

  if (eventStatus) request = request.eq('event_status', eventStatus)

  const { data, error } = await request
  if (error) throw new Error(`No se pudieron cargar las extraordinarias del panel: ${error.message}`)

  const needle = normalize(query)
  return (data || [])
    .map((item) => ({
      ...item,
      municipality: relationOne(item.municipalities)?.name || '',
      hasPhoto: Boolean(item.hero_image_path),
    }))
    .filter((item) => {
      if (!needle) return true
      return normalize([
        item.title,
        item.organizer_name,
        item.municipality,
        item.reference_code,
        item.outing_type,
      ].filter(Boolean).join(' ')).includes(needle)
    })
}

export async function getPanelExtraordinaryOuting(id) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('outings')
    .select('id, reference_code, slug, title, outing_type, outing_date, departure_time, return_date, return_time, reason, description, public_notes, event_status, status, organizer_name, hero_image_path, hero_image_alt, hero_image_credit, municipalities(name)')
    .eq('id', id)
    .eq('character', 'extraordinary')
    .maybeSingle()

  if (error) throw new Error(`No se pudo cargar la extraordinaria: ${error.message}`)
  if (!data) return null

  const [{ count: scheduleCount, error: scheduleError }, { count: musicCount, error: musicError }, { count: sourceCount, error: sourceError }] = await Promise.all([
    supabase.from('outing_schedule_items').select('id', { count: 'exact', head: true }).eq('outing_id', id),
    supabase.from('outing_music_positions').select('id', { count: 'exact', head: true }).eq('outing_id', id),
    supabase.from('source_links').select('id', { count: 'exact', head: true }).eq('outing_id', id),
  ])

  if (scheduleError) throw new Error(`No se pudieron contar los horarios: ${scheduleError.message}`)
  if (musicError) throw new Error(`No se pudo contar la música: ${musicError.message}`)
  if (sourceError) throw new Error(`No se pudieron contar las fuentes: ${sourceError.message}`)

  return {
    ...data,
    municipality: relationOne(data.municipalities)?.name || '',
    scheduleCount: scheduleCount || 0,
    musicCount: musicCount || 0,
    sourceCount: sourceCount || 0,
  }
}

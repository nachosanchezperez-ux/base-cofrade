import 'server-only'
import { createPublicClient } from '@/lib/supabase/public'

function rows(result, label) {
  if (result.error) throw new Error(`${label}: ${result.error.message}`)
  return result.data || []
}

// Batched public reads: never one query per card. RLS remains in force.
export async function withAgendaOutingContext(groups) {
  const ids = [...new Set(groups.slice(0, 4).flatMap((group) => group.filter((item) => item.isUpcoming || (!item.isCancelled && item.returnDate && item.returnDate >= new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date()))).map((item) => item.id)).filter(Boolean))]
  if (!ids.length) return groups
  const supabase = createPublicClient()
  const chunks = Array.from({ length: Math.ceil(ids.length / 100) }, (_, i) => ids.slice(i * 100, (i + 1) * 100))
  const results = await Promise.all(chunks.map(async (batch) => {
    const [schedule, music] = await Promise.all([
      supabase.from('outing_schedule_items').select('id, outing_id, sequence_no, label, item_date, item_time, time_text, place_text, notes').in('outing_id', batch).order('sequence_no'),
      supabase.from('outing_music_details').select('outing_id, music_assignment_id, position_order, position_label, band_name, band_entity_id, notes').in('outing_id', batch).order('position_order'),
    ])
    return { schedule: rows(schedule, 'Horarios de Agenda'), music: rows(music, 'Música de Agenda') }
  }))
  const schedules = results.flatMap((result) => result.schedule)
  const music = results.flatMap((result) => result.music)
  const bandIds = [...new Set(music.map((row) => row.band_entity_id).filter(Boolean))]
  const bands = bandIds.length ? rows(await supabase.from('entities').select('id,name,slug').in('id', bandIds).eq('status', 'published').eq('entity_type', 'band'), 'Bandas de Agenda') : []
  const bandById = new Map(bands.map((band) => [band.id, band]))
  const context = new Map(ids.map((id) => [id, { schedule: [], music: [] }]))
  for (const row of schedules) context.get(row.outing_id)?.schedule.push({
    id: row.id, label: row.label || '', date: row.item_date || '', time: String(row.item_time || '').slice(0, 5),
    timeText: row.time_text || '', place: row.place_text || '', notes: row.notes || '',
  })
  for (const row of music) {
    const band = bandById.get(row.band_entity_id)
    const name = row.band_name || band?.name
    if (name) context.get(row.outing_id)?.music.push({ id: row.music_assignment_id, name, href: band?.slug ? `/bandas/${band.slug}` : '', context: row.position_label || '', notes: row.notes || '' })
  }
  return groups.map((group, index) => index < 4 ? group.map((item) => ({ ...item, ...context.get(item.id) })) : group)
}
